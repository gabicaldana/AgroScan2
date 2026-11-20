"""Testes do caderno de campo: proteção, validação e sincronização.

Não tocam banco. O que está sob teste aqui é o CONTRATO HTTP - quem pode
chamar, o que é recusado antes de chegar ao banco, e como a fila offline é
particionada na resposta. A camada de SQL é substituída por um dublê, porque
misturar as duas faria o teste falhar por motivos que nada têm a ver com a
regra sendo verificada.

Sobre o `except` abaixo capturar RuntimeError junto de ImportError: o
TestClient do Starlette exige um cliente HTTP que ele não declara como
dependência obrigatória, e sinaliza a ausência com RuntimeError. Sem isso, a
falta da dependência fazia o módulo ERRAR no import em vez de se pular. Para
que estes testes rodem de verdade, instale `requirements-dev.txt`.
"""

import unittest
from datetime import datetime, timezone
from unittest.mock import patch
from uuid import uuid4

try:
    from fastapi.testclient import TestClient

    from app.api import seguranca
    from app.api.principal import app

    CLIENTE = TestClient(app)
    TEM_API = True
except (ImportError, RuntimeError):  # pragma: no cover - depende do ambiente
    CLIENTE = None
    seguranca = None
    app = None
    TEM_API = False


PREFIXO = "/api/v1"
USUARIO = {"id": 1, "nome": "Produtora", "email": "p@exemplo.br",
           "papel": "produtor", "ativo": True}


def consulta_do_tomate(**extra) -> dict:
    """O que `repo.detalhar` devolve: tomate com pinta-preta na frente."""
    consulta = {
        "id": 1, "cultura_id": "tomate", "cultura_nome": "Tomate",
        "hipoteses": [
            {"doenca_id": "tomate_pinta_preta", "nome": "Pinta-preta",
             "posicao": 1, "compatibilidade": 0.48},
            {"doenca_id": "tomate_requeima", "nome": "Requeima",
             "posicao": 2, "compatibilidade": 0.31},
        ],
    }
    consulta.update(extra)
    return consulta


def consulta_valida(**extra) -> dict:
    pedido = {
        "offline_id": str(uuid4()),
        "cultura_id": "tomate",
        "sintomas": ["manchas_escuras_aneis"],
        "hipoteses": [{"doenca_id": "tomate_pinta_preta",
                       "compatibilidade": 0.48276}],
        "registrada_em": datetime.now(timezone.utc).isoformat(),
    }
    pedido.update(extra)
    return pedido


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestProtecao(unittest.TestCase):
    """Sem token, nada do caderno responde."""

    def test_rotas_do_caderno_exigem_autenticacao(self):
        casos = [
            ("post", "/consultas", consulta_valida()),
            ("post", "/consultas/sincronizar", {"consultas": []}),
            ("get", "/consultas", None),
            ("get", "/consultas/1", None),
            ("post", "/consultas/1/feedback", {"confirmado": True}),
            ("delete", "/consultas/1/localizacao", None),
            ("get", "/autenticacao/eu", None),
        ]
        for metodo, caminho, corpo in casos:
            with self.subTest(rota=f"{metodo.upper()} {caminho}"):
                chamada = getattr(CLIENTE, metodo)
                r = chamada(f"{PREFIXO}{caminho}", json=corpo) if corpo is not None \
                    else chamada(f"{PREFIXO}{caminho}")
                self.assertEqual(r.status_code, 401)

    def test_o_diagnostico_NAO_exige_autenticacao(self):
        """Diagnosticar é o produto, e tem que funcionar antes do cadastro.

        Exigir conta para responder o que a planta tem afastaria justamente
        quem o app existe para atender.
        """
        r = CLIENTE.post(f"{PREFIXO}/diagnosticos",
                         json={"cultura_id": "tomate",
                               "sintomas": ["manchas_escuras_aneis"]})
        self.assertEqual(r.status_code, 200)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestCadernoAutenticado(unittest.TestCase):

    def setUp(self):
        app.dependency_overrides[seguranca.usuario_atual] = lambda: USUARIO

    def tearDown(self):
        app.dependency_overrides.clear()

    # --- validação antes do banco ---

    def test_cultura_desconhecida_e_recusada_antes_do_banco(self):
        # O identificador precisa ser impossivel de virar cultura real. Este
        # teste ja quebrou uma vez por usar "couve" como exemplo de cultura
        # inexistente: a curadoria das brassicas cadastrou a couve e a
        # premissa caiu. Nome de hortalica, por mais improvavel que pareca,
        # e candidato a entrar na base.
        with patch("app.api.rotas.consultas.repo") as repo:
            r = CLIENTE.post(f"{PREFIXO}/consultas",
                             json=consulta_valida(cultura_id="nao_e_cultura"))
        self.assertEqual(r.status_code, 422)
        self.assertIn("nao_e_cultura", r.json()["detail"])
        repo.registrar.assert_not_called()

    def test_sintoma_desconhecido_e_recusado(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            r = CLIENTE.post(
                f"{PREFIXO}/consultas",
                json=consulta_valida(sintomas=["manchas_escuras_aneis", "xyz"]))
        self.assertEqual(r.status_code, 422)
        repo.registrar.assert_not_called()

    def test_doenca_desconhecida_na_hipotese_e_recusada(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            r = CLIENTE.post(
                f"{PREFIXO}/consultas",
                json=consulta_valida(
                    hipoteses=[{"doenca_id": "nao_existe",
                                "compatibilidade": 0.9}]))
        self.assertEqual(r.status_code, 422)
        repo.registrar.assert_not_called()

    def test_coordenada_pela_metade_e_recusada(self):
        """Latitude sem longitude não localiza nada, e o banco tem o mesmo
        CHECK - a validação aqui existe para a mensagem ser legível."""
        r = CLIENTE.post(f"{PREFIXO}/consultas",
                         json=consulta_valida(latitude=-15.8))
        self.assertEqual(r.status_code, 422)

    # --- idempotência ---

    def test_consulta_nova_responde_criada(self):
        pedido = consulta_valida()
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.registrar.return_value = ({"id": 10}, True)
            r = CLIENTE.post(f"{PREFIXO}/consultas", json=pedido)
        self.assertEqual(r.status_code, 201)
        self.assertTrue(r.json()["criada"])

    def test_reenvio_da_mesma_consulta_nao_duplica(self):
        """Reenviar a fila é o caso NORMAL: o aparelho não sabe se a tentativa
        anterior chegou antes de a conexão cair."""
        pedido = consulta_valida()
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.registrar.return_value = ({"id": 10}, False)
            r = CLIENTE.post(f"{PREFIXO}/consultas", json=pedido)
        self.assertEqual(r.status_code, 201)
        self.assertFalse(r.json()["criada"])
        self.assertEqual(r.json()["consulta"]["id"], 10)

    # --- sincronização em lote ---

    def test_sincronizar_separa_aceitas_duplicadas_e_rejeitadas(self):
        """Um item ruim não pode impedir os bons de entrarem: o aparelho
        precisa poder limpar da fila o que foi aceito."""
        nova = consulta_valida()
        repetida = consulta_valida()
        invalida = consulta_valida(cultura_id="nao_e_cultura")

        def registrar(**kwargs):
            return ({"id": 1}, kwargs["offline_id"] == nova["offline_id"])

        with patch("app.api.rotas.consultas.repo") as repo:
            repo.registrar.side_effect = registrar
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/sincronizar",
                json={"consultas": [nova, repetida, invalida]})

        self.assertEqual(r.status_code, 200)
        corpo = r.json()
        self.assertEqual(corpo["aceitas"], [nova["offline_id"]])
        self.assertEqual(corpo["duplicadas"], [repetida["offline_id"]])
        self.assertEqual(len(corpo["rejeitadas"]), 1)
        self.assertEqual(corpo["rejeitadas"][0]["offline_id"],
                         invalida["offline_id"])
        self.assertIn("nao_e_cultura", corpo["rejeitadas"][0]["motivo"])

    def test_lote_vazio_responde_sem_erro(self):
        r = CLIENTE.post(f"{PREFIXO}/consultas/sincronizar",
                         json={"consultas": []})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["aceitas"], [])

    # --- feedback (US20) ---

    def test_confirmado_com_outra_doenca_e_incoerente(self):
        """TI21."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": True,
                      "doenca_confirmada_id": "tomate_requeima"})
        self.assertEqual(r.status_code, 422)
        repo.registrar_feedback.assert_not_called()

    def test_nao_confirmado_com_a_doenca_real_e_aceito(self):
        """TI22."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            repo.registrar_feedback.return_value = {"consulta_id": 1}
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": False,
                      "doenca_confirmada_id": "tomate_requeima",
                      "comentario": "era requeima mesmo"})
        self.assertEqual(r.status_code, 201)
        repo.registrar_feedback.assert_called_once_with(
            1, USUARIO["id"], False, "tomate_requeima", "era requeima mesmo")

    def test_confirmado_sem_outra_doenca_e_aceito(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            repo.registrar_feedback.return_value = {"consulta_id": 1}
            r = CLIENTE.post(f"{PREFIXO}/consultas/1/feedback",
                             json={"confirmado": True})
        self.assertEqual(r.status_code, 201)

    def test_nao_confirmado_sem_saber_a_doenca_e_aceito(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            repo.registrar_feedback.return_value = {"consulta_id": 1}
            r = CLIENTE.post(f"{PREFIXO}/consultas/1/feedback",
                             json={"confirmado": False})
        self.assertEqual(r.status_code, 201)

    def test_doenca_real_de_outra_cultura_e_recusada(self):
        """Uma ficha da batata não pode ser a doença real de um tomate."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": False,
                      "doenca_confirmada_id": "batata_requeima"})
        self.assertEqual(r.status_code, 422)
        self.assertIn("cultura", r.json()["detail"])
        repo.registrar_feedback.assert_not_called()

    def test_doenca_real_igual_a_hipotese_principal_e_incoerente(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": False,
                      "doenca_confirmada_id": "tomate_pinta_preta"})
        self.assertEqual(r.status_code, 422)
        repo.registrar_feedback.assert_not_called()

    def test_doenca_real_desconhecida_e_recusada(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate()
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": False, "doenca_confirmada_id": "nao_existe"})
        self.assertEqual(r.status_code, 422)

    def test_confirmar_consulta_sem_hipotese_e_recusado(self):
        """Sem hipótese principal, um "confirmado" viraria acerto inventado."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = consulta_do_tomate(hipoteses=[])
            r = CLIENTE.post(f"{PREFIXO}/consultas/1/feedback",
                             json={"confirmado": True})
        self.assertEqual(r.status_code, 422)
        repo.registrar_feedback.assert_not_called()

    def test_feedback_em_consulta_de_outra_pessoa_da_404(self):
        """404 e não 403: um 403 confirmaria que aquele id existe."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = None
            r = CLIENTE.post(f"{PREFIXO}/consultas/999/feedback",
                             json={"confirmado": True})
        self.assertEqual(r.status_code, 404)
        repo.registrar_feedback.assert_not_called()

    def test_listagem_traz_a_resposta_do_feedback(self):
        linha = {
            "id": 1, "offline_id": str(uuid4()), "cultura_id": "tomate",
            "cultura_nome": "Tomate", "emoji": None, "canteiro_id": None,
            "canteiro_nome": None, "origem": "sintomas",
            "registrada_em": datetime.now(timezone.utc),
            "versao_catalogo": "2026.10.24",
            "doenca_id": "tomate_pinta_preta", "doenca_nome": "Pinta-preta",
            "compatibilidade": 0.48, "tem_feedback": True,
            "confirmado": False, "doenca_confirmada_id": "tomate_requeima",
            "doenca_confirmada_nome": "Requeima",
            "feedback_comentario": "o técnico confirmou",
        }
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.listar.return_value = [linha]
            r = CLIENTE.get(f"{PREFIXO}/consultas")
        self.assertEqual(r.status_code, 200)
        corpo = r.json()[0]
        self.assertIs(corpo["confirmado"], False)
        self.assertEqual(corpo["doenca_confirmada_id"], "tomate_requeima")
        self.assertEqual(corpo["doenca_confirmada_nome"], "Requeima")
        self.assertEqual(corpo["feedback_comentario"], "o técnico confirmou")

    # --- localização (revisão LGPD, RF22, RNF16) ---

    def test_apagar_localizacao_responde_204_e_filtra_pelo_usuario(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.apagar_localizacao.return_value = True
            r = CLIENTE.delete(f"{PREFIXO}/consultas/7/localizacao")
        self.assertEqual(r.status_code, 204)
        repo.apagar_localizacao.assert_called_once_with(USUARIO["id"], 7)

    def test_apagar_localizacao_de_outra_pessoa_da_404(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.apagar_localizacao.return_value = False
            r = CLIENTE.delete(f"{PREFIXO}/consultas/999/localizacao")
        self.assertEqual(r.status_code, 404)

    def test_listagem_diz_se_ha_local_sem_trazer_a_coordenada(self):
        linha = {
            "id": 1, "offline_id": str(uuid4()), "cultura_id": "tomate",
            "cultura_nome": "Tomate", "origem": "sintomas",
            "registrada_em": datetime.now(timezone.utc),
            "versao_catalogo": "2026.11.09", "tem_localizacao": True,
            "latitude": -15.794, "longitude": -47.883,
        }
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.listar.return_value = [linha]
            r = CLIENTE.get(f"{PREFIXO}/consultas")
        corpo = r.json()[0]
        self.assertIs(corpo["tem_localizacao"], True)
        self.assertNotIn("latitude", corpo)
        self.assertNotIn("longitude", corpo)

    def test_consulta_de_outra_pessoa_nao_e_visivel(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = None
            r = CLIENTE.get(f"{PREFIXO}/consultas/999")
        self.assertEqual(r.status_code, 404)


if __name__ == "__main__":
    unittest.main()

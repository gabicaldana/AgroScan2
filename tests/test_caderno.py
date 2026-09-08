"""Testes do caderno de campo: proteção, validação e sincronização.

Não tocam banco. O que está sob teste aqui é o CONTRATO HTTP - quem pode
chamar, o que é recusado antes de chegar ao banco, e como a fila offline é
particionada na resposta. A camada de SQL é substituída por um dublê, porque
misturar as duas faria o teste falhar por motivos que nada têm a ver com a
regra sendo verificada.
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
except ImportError:  # pragma: no cover - depende do ambiente
    CLIENTE = None
    seguranca = None
    app = None
    TEM_API = False


PREFIXO = "/api/v1"
USUARIO = {"id": 1, "nome": "Produtora", "email": "p@exemplo.br",
           "papel": "produtor", "ativo": True}


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
        with patch("app.api.rotas.consultas.repo") as repo:
            r = CLIENTE.post(f"{PREFIXO}/consultas",
                             json=consulta_valida(cultura_id="couve"))
        self.assertEqual(r.status_code, 422)
        self.assertIn("couve", r.json()["detail"])
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
        invalida = consulta_valida(cultura_id="couve")

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
        self.assertIn("couve", corpo["rejeitadas"][0]["motivo"])

    def test_lote_vazio_responde_sem_erro(self):
        r = CLIENTE.post(f"{PREFIXO}/consultas/sincronizar",
                         json={"consultas": []})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["aceitas"], [])

    # --- feedback ---

    def test_confirmado_com_outra_doenca_e_incoerente(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.pertence_ao_usuario.return_value = True
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": True,
                      "doenca_confirmada_id": "tomate_requeima"})
        self.assertEqual(r.status_code, 422)

    def test_nao_confirmado_com_a_doenca_real_e_aceito(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.pertence_ao_usuario.return_value = True
            repo.registrar_feedback.return_value = {"consulta_id": 1}
            r = CLIENTE.post(
                f"{PREFIXO}/consultas/1/feedback",
                json={"confirmado": False,
                      "doenca_confirmada_id": "tomate_requeima",
                      "comentario": "era requeima mesmo"})
        self.assertEqual(r.status_code, 201)

    def test_feedback_em_consulta_de_outra_pessoa_da_404(self):
        """404 e não 403: um 403 confirmaria que aquele id existe."""
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.pertence_ao_usuario.return_value = False
            r = CLIENTE.post(f"{PREFIXO}/consultas/999/feedback",
                             json={"confirmado": True})
        self.assertEqual(r.status_code, 404)

    def test_consulta_de_outra_pessoa_nao_e_visivel(self):
        with patch("app.api.rotas.consultas.repo") as repo:
            repo.detalhar.return_value = None
            r = CLIENTE.get(f"{PREFIXO}/consultas/999")
        self.assertEqual(r.status_code, 404)


if __name__ == "__main__":
    unittest.main()

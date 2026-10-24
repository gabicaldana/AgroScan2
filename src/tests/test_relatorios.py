"""Testes dos relatórios da horta e do alerta de rotação: o CONTRATO HTTP.

Como em test_hortas, não tocam banco: o que está sob teste é quem vê, o que é
recusado antes do SQL e a regra do alerta. Que a AGREGAÇÃO confere com a
contagem manual é o assunto de test_relatorios_banco, num PostgreSQL real.

Rodar:  python -m unittest tests.test_relatorios
"""

import unittest
from datetime import date
from unittest.mock import patch

try:
    from fastapi.testclient import TestClient

    from app.api import seguranca
    from app.api.principal import app
    from app.api.rotas import relatorios

    CLIENTE = TestClient(app)
    TEM_API = True
except (ImportError, RuntimeError):  # pragma: no cover - depende do ambiente
    CLIENTE = None
    TEM_API = False


PREFIXO = "/api/v1"
EU = {"id": 1, "nome": "Gestora", "email": "g@exemplo.br",
      "papel": "produtor", "ativo": True}
REPO = "app.api.rotas.relatorios.repo"
HORTAS = "app.api.rotas.relatorios.repo_hortas"

ROTAS = [
    "/hortas/3/relatorios/incidencia",
    "/hortas/3/relatorios/confirmacao",
    "/hortas/3/relatorios/rotacao",
    "/hortas/3/canteiros/rotacao?identificacao=Canteiro%201&cultura_id=tomate",
]


def ciclo(cultura_nome: str, familia: str, ativo: bool = False) -> dict:
    return {"id": 1, "cultura_id": cultura_nome.lower(),
            "cultura_nome": cultura_nome, "familia": familia,
            "data_plantio": None, "ativo": ativo}


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestProtecao(unittest.TestCase):

    def test_relatorios_exigem_autenticacao(self):
        for caminho in ROTAS:
            with self.subTest(rota=caminho):
                self.assertEqual(CLIENTE.get(f"{PREFIXO}{caminho}").status_code, 401)


class _Autenticado(unittest.TestCase):

    def setUp(self):
        app.dependency_overrides[seguranca.usuario_atual] = lambda: EU

    def tearDown(self):
        app.dependency_overrides.clear()


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestAcesso(_Autenticado):

    def test_quem_nao_e_membro_recebe_404_em_todos(self):
        """Um 403 confirmaria que a horta existe (ADR 0012)."""
        for caminho in ROTAS:
            with self.subTest(rota=caminho), patch(HORTAS) as hortas, \
                    patch(REPO) as repo:
                hortas.papel_na_horta.return_value = None
                r = CLIENTE.get(f"{PREFIXO}{caminho}")
                self.assertEqual(r.status_code, 404)
                self.assertEqual(repo.method_calls, [])

    def test_membro_comum_ve_os_relatorios(self):
        """O relatório é de quem cuida da horta, não só da responsável."""
        with patch(HORTAS) as hortas, patch(REPO) as repo:
            hortas.papel_na_horta.return_value = "membro"
            repo.confirmacao.return_value = {"linhas": []}
            r = CLIENTE.get(f"{PREFIXO}/hortas/3/relatorios/confirmacao")
        self.assertEqual(r.status_code, 200)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestIncidencia(_Autenticado):

    def _pedir(self, busca=""):
        with patch(HORTAS) as hortas, patch(REPO) as repo:
            hortas.papel_na_horta.return_value = "membro"
            repo.incidencia.return_value = {"consultas": 0, "sem_hipotese": 0,
                                            "linhas": []}
            r = CLIENTE.get(f"{PREFIXO}/hortas/3/relatorios/incidencia{busca}")
        return r, repo

    def test_periodo_informado_vai_para_a_consulta(self):
        r, repo = self._pedir("?de=2026-05-01&ate=2026-06-30")
        self.assertEqual(r.status_code, 200)
        repo.incidencia.assert_called_once_with(
            3, date(2026, 5, 1), date(2026, 6, 30))

    def test_sem_periodo_sao_os_ultimos_doze_meses(self):
        r, repo = self._pedir("?ate=2026-10-24")
        repo.incidencia.assert_called_once_with(
            3, date(2025, 11, 1), date(2026, 10, 24))
        self.assertEqual(r.json()["de"], "2025-11-01")

    def test_inicio_padrao_atravessa_o_ano(self):
        self.assertEqual(relatorios._inicio_padrao(date(2026, 1, 15)),
                         date(2025, 2, 1))
        self.assertEqual(relatorios._inicio_padrao(date(2026, 12, 31)),
                         date(2026, 1, 1))

    def test_periodo_invertido_e_recusado(self):
        r, repo = self._pedir("?de=2026-07-01&ate=2026-06-01")
        self.assertEqual(r.status_code, 422)
        repo.incidencia.assert_not_called()


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestConfirmacao(_Autenticado):

    def test_a_amostra_minima_vai_para_a_consulta_e_para_a_tela(self):
        with patch(HORTAS) as hortas, patch(REPO) as repo:
            hortas.papel_na_horta.return_value = "membro"
            repo.confirmacao.return_value = {"linhas": []}
            r = CLIENTE.get(f"{PREFIXO}/hortas/3/relatorios/confirmacao")
        repo.confirmacao.assert_called_once_with(3, relatorios.AMOSTRA_MINIMA)
        self.assertEqual(r.json()["amostra_minima"], relatorios.AMOSTRA_MINIMA)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestRotacaoDoCanteiroNovo(_Autenticado):

    def _pedir(self, ciclos, cultura_id="tomate", identificacao="Canteiro 1"):
        with patch(HORTAS) as hortas, patch(REPO) as repo:
            hortas.papel_na_horta.return_value = "membro"
            repo.ciclos_recentes.return_value = ciclos
            r = CLIENTE.get(
                f"{PREFIXO}/hortas/3/canteiros/rotacao",
                params={"identificacao": identificacao, "cultura_id": cultura_id})
        return r, repo

    def test_mesma_familia_no_ciclo_anterior_alerta(self):
        """Tomate depois de pimentão: é a mesma solanácea no solo."""
        r, _ = self._pedir([ciclo("Pimentão", "Solanaceae")])
        corpo = r.json()
        self.assertTrue(corpo["alerta"])
        self.assertEqual(corpo["familia"], "Solanaceae")
        self.assertEqual([x["ciclos_atras"] for x in corpo["repeticoes"]], [1])

    def test_mesma_familia_com_um_ciclo_de_intervalo_alerta(self):
        r, _ = self._pedir([ciclo("Couve", "Brassicaceae"),
                            ciclo("Batata", "Solanaceae")])
        corpo = r.json()
        self.assertTrue(corpo["alerta"])
        self.assertEqual([x["ciclos_atras"] for x in corpo["repeticoes"]], [2])

    def test_outra_familia_nos_ciclos_recentes_nao_alerta(self):
        r, _ = self._pedir([ciclo("Couve", "Brassicaceae"),
                            ciclo("Repolho", "Brassicaceae")])
        self.assertFalse(r.json()["alerta"])
        self.assertEqual(r.json()["ciclos_conhecidos"], 2)

    def test_lugar_sem_historico_nao_alerta(self):
        r, _ = self._pedir([])
        self.assertFalse(r.json()["alerta"])

    def test_olha_so_os_ciclos_recentes_e_pelo_nome_sem_espacos(self):
        _, repo = self._pedir([], identificacao="  Canteiro 1 ")
        repo.ciclos_recentes.assert_called_once_with(
            3, "Canteiro 1", relatorios.CICLOS_RECENTES)

    def test_cultura_desconhecida_e_recusada(self):
        r, repo = self._pedir([], cultura_id="mandioca_inexistente")
        self.assertEqual(r.status_code, 422)
        repo.ciclos_recentes.assert_not_called()


if __name__ == "__main__":
    unittest.main()

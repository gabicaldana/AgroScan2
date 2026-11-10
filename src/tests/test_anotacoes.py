"""Testes das anotações livres (US21): o CONTRATO HTTP.

Como em test_hortas, não tocam banco. O que está sob teste é quem pode o quê:
membro da horta, quem fez a consulta, quem escreveu a anotação e quem não
participa. A camada de dados é um dublê.

Rodar:  python -m unittest tests.test_anotacoes
"""

import unittest
from unittest.mock import patch

try:
    from fastapi.testclient import TestClient

    from app.api import seguranca
    from app.api.principal import app

    CLIENTE = TestClient(app)
    TEM_API = True
except (ImportError, RuntimeError):  # pragma: no cover - depende do ambiente
    CLIENTE = None
    TEM_API = False


PREFIXO = "/api/v1"
EU = {"id": 1, "nome": "Gestora", "email": "g@exemplo.br",
      "papel": "produtor", "ativo": True}
REPO = "app.api.rotas.anotacoes.repo"
HORTAS = "app.api.rotas.anotacoes.repo_hortas"
CONSULTAS = "app.api.rotas.anotacoes.repo_consultas"


def anotacao(**campos):
    base = {"id": 9, "canteiro_id": 3, "consulta_id": None, "texto": "choveu",
            "criada_em": "2026-11-09T10:00:00Z",
            "atualizada_em": "2026-11-09T10:00:00Z",
            "autor_id": EU["id"], "autor_nome": EU["nome"]}
    base.update(campos)
    return base


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestProtecao(unittest.TestCase):

    def test_rotas_de_anotacao_exigem_autenticacao(self):
        casos = [
            ("get", "/canteiros/1/anotacoes"), ("post", "/canteiros/1/anotacoes"),
            ("get", "/consultas/1/anotacoes"), ("post", "/consultas/1/anotacoes"),
            ("patch", "/anotacoes/1"), ("delete", "/anotacoes/1"),
        ]
        for metodo, caminho in casos:
            with self.subTest(rota=f"{metodo.upper()} {caminho}"):
                r = getattr(CLIENTE, metodo)(f"{PREFIXO}{caminho}")
                self.assertEqual(r.status_code, 401)


class _Autenticado(unittest.TestCase):

    def setUp(self):
        app.dependency_overrides[seguranca.usuario_atual] = lambda: EU

    def tearDown(self):
        app.dependency_overrides.clear()


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestAnotacaoNoCanteiro(_Autenticado):

    def test_membro_anota_e_o_texto_chega_aparado(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            hortas.canteiro_do_membro.return_value = {"id": 3}
            repo.criar.return_value = anotacao()
            r = CLIENTE.post(f"{PREFIXO}/canteiros/3/anotacoes",
                             json={"texto": "  choveu  "})
        self.assertEqual(r.status_code, 201)
        repo.criar.assert_called_once_with(EU["id"], "choveu", canteiro_id=3)

    def test_quem_nao_e_membro_recebe_404(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            hortas.canteiro_do_membro.return_value = None
            r = CLIENTE.post(f"{PREFIXO}/canteiros/3/anotacoes",
                             json={"texto": "choveu"})
            r_lista = CLIENTE.get(f"{PREFIXO}/canteiros/3/anotacoes")
        self.assertEqual(r.status_code, 404)
        self.assertEqual(r_lista.status_code, 404)
        repo.criar.assert_not_called()
        repo.listar_do_canteiro.assert_not_called()

    def test_texto_vazio_ou_so_espacos_e_recusado(self):
        for texto in ("", "   "):
            with self.subTest(texto=repr(texto)), patch(REPO) as repo, \
                    patch(HORTAS) as hortas:
                hortas.canteiro_do_membro.return_value = {"id": 3}
                r = CLIENTE.post(f"{PREFIXO}/canteiros/3/anotacoes",
                                 json={"texto": texto})
                self.assertEqual(r.status_code, 422)
                repo.criar.assert_not_called()

    def test_texto_longo_demais_e_recusado(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            hortas.canteiro_do_membro.return_value = {"id": 3}
            r = CLIENTE.post(f"{PREFIXO}/canteiros/3/anotacoes",
                             json={"texto": "x" * 2001})
        self.assertEqual(r.status_code, 422)
        repo.criar.assert_not_called()

    def test_membro_lista_as_anotacoes_de_todos(self):
        outra = anotacao(id=10, autor_id=2, autor_nome="Vizinha")
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            hortas.canteiro_do_membro.return_value = {"id": 3}
            repo.listar_do_canteiro.return_value = [outra, anotacao()]
            r = CLIENTE.get(f"{PREFIXO}/canteiros/3/anotacoes")
        self.assertEqual(r.status_code, 200)
        self.assertEqual([a["autor_nome"] for a in r.json()],
                         ["Vizinha", "Gestora"])


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestAnotacaoNaConsulta(_Autenticado):

    def test_quem_fez_a_consulta_anota(self):
        with patch(REPO) as repo, patch(CONSULTAS) as consultas:
            consultas.pertence_ao_usuario.return_value = True
            repo.criar.return_value = anotacao(canteiro_id=None, consulta_id=5)
            r = CLIENTE.post(f"{PREFIXO}/consultas/5/anotacoes",
                             json={"texto": "começou pela cerca"})
        self.assertEqual(r.status_code, 201)
        consultas.pertence_ao_usuario.assert_called_once_with(5, EU["id"])
        repo.criar.assert_called_once_with(
            EU["id"], "começou pela cerca", consulta_id=5)

    def test_consulta_alheia_e_404(self):
        with patch(REPO) as repo, patch(CONSULTAS) as consultas:
            consultas.pertence_ao_usuario.return_value = False
            r = CLIENTE.post(f"{PREFIXO}/consultas/5/anotacoes",
                             json={"texto": "x"})
            r_lista = CLIENTE.get(f"{PREFIXO}/consultas/5/anotacoes")
        self.assertEqual(r.status_code, 404)
        self.assertEqual(r_lista.status_code, 404)
        repo.criar.assert_not_called()


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestEdicaoEExclusao(_Autenticado):

    def test_autora_edita(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            repo.obter.return_value = anotacao()
            hortas.canteiro_do_membro.return_value = {"id": 3}
            repo.alterar.return_value = anotacao(texto="choveu muito")
            r = CLIENTE.patch(f"{PREFIXO}/anotacoes/9",
                              json={"texto": "choveu muito"})
        self.assertEqual(r.status_code, 200)
        repo.alterar.assert_called_once_with(9, "choveu muito")

    def test_autora_apaga(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            repo.obter.return_value = anotacao()
            hortas.canteiro_do_membro.return_value = {"id": 3}
            r = CLIENTE.delete(f"{PREFIXO}/anotacoes/9")
        self.assertEqual(r.status_code, 204)
        repo.apagar.assert_called_once_with(9)

    def test_outro_membro_ve_mas_nao_altera_nem_apaga(self):
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            repo.obter.return_value = anotacao(autor_id=2)
            hortas.canteiro_do_membro.return_value = {"id": 3}
            r_editar = CLIENTE.patch(f"{PREFIXO}/anotacoes/9",
                                     json={"texto": "outro"})
            r_apagar = CLIENTE.delete(f"{PREFIXO}/anotacoes/9")
        self.assertEqual(r_editar.status_code, 403)
        self.assertEqual(r_apagar.status_code, 403)
        repo.alterar.assert_not_called()
        repo.apagar.assert_not_called()

    def test_quem_saiu_da_horta_nao_enxerga_nem_a_propria(self):
        # A anotação é do canteiro, não da pessoa: quem deixa a horta deixa
        # de vê-la, como deixa de ver o canteiro.
        with patch(REPO) as repo, patch(HORTAS) as hortas:
            repo.obter.return_value = anotacao()
            hortas.canteiro_do_membro.return_value = None
            r = CLIENTE.delete(f"{PREFIXO}/anotacoes/9")
        self.assertEqual(r.status_code, 404)
        repo.apagar.assert_not_called()

    def test_anotacao_inexistente_e_404(self):
        with patch(REPO) as repo:
            repo.obter.return_value = None
            r = CLIENTE.patch(f"{PREFIXO}/anotacoes/9", json={"texto": "x"})
        self.assertEqual(r.status_code, 404)

    def test_anotacao_de_consulta_alheia_e_404(self):
        with patch(REPO) as repo, patch(CONSULTAS) as consultas:
            repo.obter.return_value = anotacao(canteiro_id=None, consulta_id=5,
                                               autor_id=2)
            consultas.pertence_ao_usuario.return_value = False
            r = CLIENTE.delete(f"{PREFIXO}/anotacoes/9")
        self.assertEqual(r.status_code, 404)
        repo.apagar.assert_not_called()


if __name__ == "__main__":
    unittest.main()

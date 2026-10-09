"""Testes de horta, membros, canteiros e manejo: o CONTRATO HTTP.

Como em test_caderno, não tocam banco. O que está sob teste é quem pode o quê
- membro, responsável, quem não participa - e o que é recusado antes de chegar
ao SQL. A camada de dados é um dublê.

Rodar:  python -m unittest tests.test_hortas
"""

import unittest
from datetime import date, timedelta
from unittest.mock import patch

try:
    from fastapi.testclient import TestClient

    from app.api import seguranca
    from app.api.principal import app
    from app.api.repositorios.hortas import Duplicado

    CLIENTE = TestClient(app)
    TEM_API = True
except (ImportError, RuntimeError):  # pragma: no cover - depende do ambiente
    CLIENTE = None
    TEM_API = False


PREFIXO = "/api/v1"
EU = {"id": 1, "nome": "Gestora", "email": "g@exemplo.br",
      "papel": "produtor", "ativo": True}
REPO = "app.api.rotas.hortas.repo"


def papeis(**por_usuario):
    """Dublê de `papel_na_horta`: {usuario_id: papel}, o resto é None."""
    return lambda horta_id, usuario_id: por_usuario.get(f"u{usuario_id}")


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestProtecao(unittest.TestCase):

    def test_rotas_de_horta_exigem_autenticacao(self):
        casos = [
            ("get", "/hortas"), ("post", "/hortas"), ("get", "/hortas/1"),
            ("patch", "/hortas/1"), ("delete", "/hortas/1"),
            ("post", "/hortas/1/membros"), ("delete", "/hortas/1/membros/2"),
            ("get", "/canteiros"), ("post", "/hortas/1/canteiros"),
            ("get", "/canteiros/1"), ("patch", "/canteiros/1"),
            ("get", "/canteiros/1/manejos"), ("post", "/canteiros/1/manejos"),
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
class TestHorta(_Autenticado):

    def test_criar_horta_normaliza_a_uf(self):
        with patch(REPO) as repo:
            repo.criar_horta.return_value = {"id": 7, "papel": "responsavel"}
            r = CLIENTE.post(f"{PREFIXO}/hortas", json={
                "nome": "Horta da Escola", "municipio": "Brasília", "uf": "df"})
        self.assertEqual(r.status_code, 201)
        args, kwargs = repo.criar_horta.call_args
        self.assertEqual(args, (EU["id"],))
        self.assertEqual(kwargs["uf"], "DF")

    def test_uf_invalida_e_recusada(self):
        r = CLIENTE.post(f"{PREFIXO}/hortas", json={
            "nome": "Horta", "municipio": "Brasília", "uf": "Distrito"})
        self.assertEqual(r.status_code, 422)

    def test_coordenada_pela_metade_e_recusada(self):
        r = CLIENTE.post(f"{PREFIXO}/hortas", json={
            "nome": "Horta", "municipio": "Brasília", "uf": "DF",
            "latitude": -15.8})
        self.assertEqual(r.status_code, 422)

    def test_horta_de_quem_nao_e_membro_da_404_e_nao_403(self):
        """Um 403 confirmaria que a horta existe."""
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis()
            r = CLIENTE.get(f"{PREFIXO}/hortas/99")
        self.assertEqual(r.status_code, 404)
        repo.detalhar_horta.assert_not_called()

    def test_membro_ve_a_horta_com_o_proprio_papel(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            repo.detalhar_horta.return_value = {"id": 3, "membros": [],
                                                "canteiros": []}
            r = CLIENTE.get(f"{PREFIXO}/hortas/3")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["papel"], "membro")

    def test_membro_comum_nao_altera_a_horta(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            r = CLIENTE.patch(f"{PREFIXO}/hortas/3", json={"nome": "Outro"})
        self.assertEqual(r.status_code, 403)
        repo.alterar_horta.assert_not_called()

    def test_transferir_para_quem_nao_e_membro_e_recusado(self):
        """A horta ficaria sob alguém que nem a enxerga."""
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            r = CLIENTE.patch(f"{PREFIXO}/hortas/3",
                              json={"responsavel_id": 42})
        self.assertEqual(r.status_code, 422)
        repo.alterar_horta.assert_not_called()

    def test_transferir_para_um_membro_e_aceito(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel",
                                                     u42="membro")
            repo.alterar_horta.return_value = {"id": 3}
            r = CLIENTE.patch(f"{PREFIXO}/hortas/3",
                              json={"responsavel_id": 42})
        self.assertEqual(r.status_code, 200)
        repo.alterar_horta.assert_called_once_with(3, {"responsavel_id": 42})

    def test_apagar_horta_com_outros_membros_e_recusado(self):
        """Apagar levaria canteiros e manejos de outras pessoas junto."""
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            repo.detalhar_horta.return_value = {"membros": [{"id": 1},
                                                            {"id": 2}]}
            r = CLIENTE.delete(f"{PREFIXO}/hortas/3")
        self.assertEqual(r.status_code, 409)
        repo.apagar_horta.assert_not_called()

    def test_apagar_horta_so_com_o_responsavel_e_aceito(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            repo.detalhar_horta.return_value = {"membros": [{"id": 1}]}
            r = CLIENTE.delete(f"{PREFIXO}/hortas/3")
        self.assertEqual(r.status_code, 204)
        repo.apagar_horta.assert_called_once_with(3)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestMembros(_Autenticado):

    def test_responsavel_adiciona_membro_pelo_email(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            repo.usuario_por_email.return_value = {
                "id": 5, "nome": "Ana", "email": "ana@exemplo.br"}
            repo.adicionar_membro.return_value = {
                "horta_id": 3, "usuario_id": 5, "papel": "membro"}
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/membros",
                             json={"email": "  Ana@Exemplo.br "})
        self.assertEqual(r.status_code, 201)
        repo.usuario_por_email.assert_called_once_with("ana@exemplo.br")
        # Entra sempre como membro: a responsabilidade só muda por transferência.
        repo.adicionar_membro.assert_called_once_with(3, 5, "membro")

    def test_membro_comum_nao_adiciona_ninguem(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/membros",
                             json={"email": "ana@exemplo.br"})
        self.assertEqual(r.status_code, 403)

    def test_email_sem_conta_diz_o_que_fazer(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            repo.usuario_por_email.return_value = None
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/membros",
                             json={"email": "ninguem@exemplo.br"})
        self.assertEqual(r.status_code, 404)
        self.assertIn("criar a conta", r.json()["detail"])

    def test_membro_repetido_da_409(self):
        with patch(REPO) as repo:
            repo.Duplicado = Duplicado
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            repo.usuario_por_email.return_value = {
                "id": 5, "nome": "Ana", "email": "ana@exemplo.br"}
            repo.adicionar_membro.side_effect = Duplicado("ja existe")
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/membros",
                             json={"email": "ana@exemplo.br"})
        self.assertEqual(r.status_code, 409)

    def test_membro_pode_sair_sozinho(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            repo.remover_membro.return_value = True
            r = CLIENTE.delete(f"{PREFIXO}/hortas/3/membros/1")
        self.assertEqual(r.status_code, 204)

    def test_membro_comum_nao_remove_outra_pessoa(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro", u5="membro")
            r = CLIENTE.delete(f"{PREFIXO}/hortas/3/membros/5")
        self.assertEqual(r.status_code, 403)
        repo.remover_membro.assert_not_called()

    def test_responsavel_nao_sai_sem_transferir(self):
        """A horta ficaria sem ninguém que responda por ela."""
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="responsavel")
            r = CLIENTE.delete(f"{PREFIXO}/hortas/3/membros/1")
        self.assertEqual(r.status_code, 409)
        repo.remover_membro.assert_not_called()


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestCanteiros(_Autenticado):

    def test_membro_cadastra_canteiro(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            repo.criar_canteiro.return_value = {"id": 9}
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/canteiros", json={
                "identificacao": "Canteiro 1", "cultura_id": "tomate",
                "data_plantio": "2026-09-20"})
        self.assertEqual(r.status_code, 201)

    def test_quem_nao_e_membro_nao_cadastra_canteiro(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis()
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/canteiros", json={
                "identificacao": "Canteiro 1", "cultura_id": "tomate"})
        self.assertEqual(r.status_code, 404)
        repo.criar_canteiro.assert_not_called()

    def test_cultura_fora_do_catalogo_e_recusada(self):
        with patch(REPO) as repo:
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/canteiros", json={
                "identificacao": "Canteiro 1", "cultura_id": "nao_e_cultura"})
        self.assertEqual(r.status_code, 422)
        repo.criar_canteiro.assert_not_called()

    def test_identificacao_repetida_na_horta_da_409(self):
        with patch(REPO) as repo:
            repo.Duplicado = Duplicado
            repo.papel_na_horta.side_effect = papeis(u1="membro")
            repo.criar_canteiro.side_effect = Duplicado("ja existe")
            r = CLIENTE.post(f"{PREFIXO}/hortas/3/canteiros", json={
                "identificacao": "Canteiro 1", "cultura_id": "tomate"})
        self.assertEqual(r.status_code, 409)

    def test_cultura_do_canteiro_nao_muda(self):
        """Outra cultura é um ciclo novo: encerra-se e cadastra-se outro.

        O campo é ignorado, e não aceito: aceitar apagaria da sucessão do
        canteiro a família que estava ali, que é o que o alerta de rotação lê.
        """
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = {"id": 9}
            repo.alterar_canteiro.return_value = {"id": 9}
            CLIENTE.patch(f"{PREFIXO}/canteiros/9",
                          json={"cultura_id": "alface", "ativo": False})
        repo.alterar_canteiro.assert_called_once_with(9, {"ativo": False})

    def test_canteiro_alheio_da_404(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = None
            r = CLIENTE.get(f"{PREFIXO}/canteiros/9")
        self.assertEqual(r.status_code, 404)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestManejo(_Autenticado):

    def manejo(self, **extra):
        corpo = {"tipo": "cultural", "descricao": "Retirada das folhas baixeiras",
                 "aplicado_em": date.today().isoformat()}
        corpo.update(extra)
        return corpo

    def test_membro_registra_manejo(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = {"id": 9}
            repo.registrar_manejo.return_value = {"id": 1}
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                             json=self.manejo(doenca_id="tomate_pinta_preta"))
        self.assertEqual(r.status_code, 201)
        args, kwargs = repo.registrar_manejo.call_args
        self.assertEqual(args, (9, EU["id"]))

    def test_produto_so_em_manejo_quimico(self):
        """O banco tem o mesmo CHECK; aqui a mensagem é legível."""
        r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                         json=self.manejo(produto="Mancozebe"))
        self.assertEqual(r.status_code, 422)

    def test_manejo_quimico_com_produto_e_aceito(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = {"id": 9}
            repo.registrar_manejo.return_value = {"id": 1}
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos", json=self.manejo(
                tipo="quimico", produto="Mancozebe", dose="2 g/L"))
        self.assertEqual(r.status_code, 201)

    def test_data_no_futuro_e_recusada(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = {"id": 9}
            futuro = (date.today() + timedelta(days=5)).isoformat()
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                             json=self.manejo(aplicado_em=futuro))
        self.assertEqual(r.status_code, 422)
        repo.registrar_manejo.assert_not_called()

    def test_doenca_fora_do_catalogo_e_recusada(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = {"id": 9}
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                             json=self.manejo(doenca_id="nao_existe"))
        self.assertEqual(r.status_code, 422)

    def test_consulta_de_outra_pessoa_nao_e_vinculada(self):
        with (patch(REPO) as repo,
              patch("app.api.rotas.hortas.repo_consultas") as consultas):
            repo.canteiro_do_membro.return_value = {"id": 9}
            consultas.pertence_ao_usuario.return_value = False
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                             json=self.manejo(consulta_id=55))
        self.assertEqual(r.status_code, 422)
        repo.registrar_manejo.assert_not_called()

    def test_manejo_em_canteiro_alheio_da_404(self):
        with patch(REPO) as repo:
            repo.canteiro_do_membro.return_value = None
            r = CLIENTE.post(f"{PREFIXO}/canteiros/9/manejos",
                             json=self.manejo())
        self.assertEqual(r.status_code, 404)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestConsultaNoCanteiro(_Autenticado):
    """US25: a consulta só se vincula a canteiro de uma horta da pessoa."""

    def consulta(self, **extra):
        from tests.test_caderno import consulta_valida
        return consulta_valida(**extra)

    def test_canteiro_alheio_rejeita_a_consulta(self):
        with (patch("app.api.rotas.consultas.repo") as repo,
              patch("app.api.rotas.consultas.repo_hortas") as hortas):
            hortas.canteiro_do_membro.return_value = None
            r = CLIENTE.post(f"{PREFIXO}/consultas",
                             json=self.consulta(canteiro_id=9))
        self.assertEqual(r.status_code, 422)
        repo.registrar.assert_not_called()

    def test_na_fila_o_canteiro_alheio_vira_rejeitada_com_motivo(self):
        """A consulta fica no aparelho com o motivo, em vez de sumir."""
        with (patch("app.api.rotas.consultas.repo"),
              patch("app.api.rotas.consultas.repo_hortas") as hortas):
            hortas.canteiro_do_membro.return_value = None
            item = self.consulta(canteiro_id=9)
            r = CLIENTE.post(f"{PREFIXO}/consultas/sincronizar",
                             json={"consultas": [item]})
        self.assertEqual(r.json()["rejeitadas"][0]["offline_id"],
                         item["offline_id"])
        self.assertIn("canteiro", r.json()["rejeitadas"][0]["motivo"])

    def test_canteiro_da_horta_da_pessoa_e_aceito(self):
        with (patch("app.api.rotas.consultas.repo") as repo,
              patch("app.api.rotas.consultas.repo_hortas") as hortas):
            hortas.canteiro_do_membro.return_value = {"id": 9}
            repo.registrar.return_value = ({"id": 1}, True)
            r = CLIENTE.post(f"{PREFIXO}/consultas",
                             json=self.consulta(canteiro_id=9))
        self.assertEqual(r.status_code, 201)
        self.assertEqual(repo.registrar.call_args.kwargs["canteiro_id"], 9)


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestExclusaoDeConta(_Autenticado):

    def test_responsavel_de_horta_compartilhada_nao_exclui_a_conta(self):
        with (patch("app.api.rotas.autenticacao.hortas") as hortas,
              patch("app.api.rotas.autenticacao.usuarios") as usuarios):
            hortas.hortas_sob_responsabilidade.return_value = [
                {"id": 3, "nome": "Horta da Escola", "membros": 4}]
            r = CLIENTE.delete(f"{PREFIXO}/autenticacao/eu")
        self.assertEqual(r.status_code, 409)
        self.assertIn("Horta da Escola", r.json()["detail"])
        usuarios.desativar.assert_not_called()

    def test_horta_so_da_pessoa_vai_junto_com_a_conta(self):
        with (patch("app.api.rotas.autenticacao.hortas") as hortas,
              patch("app.api.rotas.autenticacao.usuarios") as usuarios):
            hortas.hortas_sob_responsabilidade.return_value = [
                {"id": 3, "nome": "Quintal", "membros": 1}]
            r = CLIENTE.delete(f"{PREFIXO}/autenticacao/eu")
        self.assertEqual(r.status_code, 204)
        hortas.apagar_horta.assert_called_once_with(3)
        usuarios.desativar.assert_called_once_with(EU["id"])


if __name__ == "__main__":
    unittest.main()

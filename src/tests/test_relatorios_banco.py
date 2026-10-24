"""Os relatórios conferidos contra contagem manual, num PostgreSQL real.

É a evidência que a Sprint 4 pede: cada relatório é aceito comparando a saída
da consulta com uma contagem feita à mão sobre um conjunto conhecido. O
conjunto é a carga de exemplo (`app/exemplo.py`); as tabelas ESPERADO_* abaixo
foram contadas a mão a partir da lista CONSULTAS de lá, e não geradas pela
própria consulta - senão o teste só provaria que a consulta concorda consigo.

Também confere o que só um banco real mostra: a migração 004 (nome livre
depois que o ciclo encerra, e só então) e o mês pelo fuso de Brasília com a
sessão em UTC.

O teste APAGA o schema `public` do banco e o recria. Por isso só roda com
AGROSCAN_BANCO_DE_TESTE definida, e recusa banco cujo nome não tenha "teste".

Rodar:
    AGROSCAN_BANCO_DE_TESTE=postgresql://.../agroscan_teste \\
        python -m unittest tests.test_relatorios_banco
"""

import os
import unittest
from datetime import date

URL = os.environ.get("AGROSCAN_BANCO_DE_TESTE")

# (mes, doenca) -> ocorrencias, contado a mao. So consultas em canteiro da
# horta, pela hipotese principal. A de 31/05 23:30 em Brasilia (02:30 de 1/6
# em UTC) esta em maio.
ESPERADO_INCIDENCIA = {
    ("2026-04", "tomate_requeima"): 2,
    ("2026-04", "repolho_podridao_negra"): 1,
    ("2026-05", "tomate_pinta_preta"): 1,
    ("2026-05", "repolho_podridao_negra"): 1,
    ("2026-05", "tomate_oidio"): 1,
    ("2026-05", "tomate_requeima"): 1,
    ("2026-06", "tomate_pinta_preta"): 1,
    ("2026-06", "repolho_alternariose"): 1,
    ("2026-06", "tomate_requeima"): 2,
    ("2026-07", "tomate_pinta_preta"): 1,
    ("2026-07", "tomate_requeima"): 1,
    ("2026-08", "pimentao_mancha_bacteriana"): 2,
    ("2026-08", "tomate_pinta_preta"): 1,
    ("2026-08", "tomate_requeima"): 1,
    ("2026-09", "couve_alternariose"): 1,
    ("2026-09", "tomate_pinta_preta"): 1,
    ("2026-09", "pimentao_antracnose"): 1,
    ("2026-09", "tomate_mancha_bacteriana"): 1,
    ("2026-09", "couve_mildio"): 1,
    ("2026-10", "tomate_oidio"): 1,
    ("2026-10", "tomate_requeima"): 1,
    ("2026-10", "couve_alternariose"): 1,
}

# doenca -> (avaliadas, confirmadas, taxa). Taxa so com 5 ou mais avaliacoes.
# As duas consultas sem canteiro (batata_requeima e tomate_requeima, ambas
# confirmadas) ficam de fora: sao do caderno, nao da horta.
ESPERADO_CONFIRMACAO = {
    "tomate_pinta_preta": (5, 3, 60.0),
    "tomate_requeima": (7, 6, 85.7),
    "repolho_podridao_negra": (2, 2, None),
    "couve_alternariose": (1, 1, None),
    "pimentao_antracnose": (1, 0, None),
    "pimentao_mancha_bacteriana": (1, 1, None),
    "tomate_mancha_bacteriana": (1, 1, None),
    "tomate_oidio": (1, 1, None),
}

# identificacao -> (cultura atual, [(cultura repetida, ciclos atras)])
ESPERADO_ROTACAO = {
    "Canteiro 1": ("Pimentão", [("Tomate", 1)]),
    "Canteiro 3": ("Couve", [("Repolho", 2)]),
}


@unittest.skipUnless(URL, "AGROSCAN_BANCO_DE_TESTE nao definida")
class TestRelatoriosNoBanco(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        import psycopg

        from app import exemplo, seed
        from app.api import banco, configuracao
        from app.api.seguranca import hash_senha

        con = psycopg.connect(URL, autocommit=True)
        nome = con.execute("SELECT current_database()").fetchone()[0]
        if "teste" not in nome:
            con.close()
            raise RuntimeError(
                f"o banco {nome!r} nao parece de teste, e este teste apaga o "
                "schema public inteiro; use um banco com 'teste' no nome")
        con.execute("DROP SCHEMA public CASCADE")
        con.execute("CREATE SCHEMA public")
        con.close()

        con = seed._conectar(URL)
        seed.aplicar_migracoes(con)
        con.commit()
        seed.carregar_catalogo(con, seed.carregar_json())
        con.execute(exemplo.gerar_sql(hash_senha("s" * 12), transacao=False))
        con.commit()
        con.close()

        # A API passa a falar com este banco. Sessao em UTC, como no Neon e
        # na Vercel: e nela que o mes errado aparecia.
        cls._url_anterior = configuracao.DATABASE_URL
        configuracao.DATABASE_URL = URL
        banco._conexao = None
        banco.conexao().execute("SET TIME ZONE 'UTC'")

        cls.horta = banco.consultar_um("SELECT id FROM horta")["id"]

    @classmethod
    def tearDownClass(cls):
        # Os modulos que rodam depois, no mesmo processo, nao podem herdar
        # esta conexao: para eles o banco continua sendo o do ambiente.
        from app.api import banco, configuracao

        banco.conexao().close()
        banco._conexao = None
        configuracao.DATABASE_URL = cls._url_anterior

    # ------------------------------------------------------------------ US27

    def test_incidencia_confere_com_a_contagem_manual(self):
        from app.api.repositorios import relatorios

        r = relatorios.incidencia(self.horta, date(2026, 1, 1), date(2026, 12, 31))
        obtido = {(l["mes"], l["doenca_id"]): l["ocorrencias"] for l in r["linhas"]}
        self.assertEqual(obtido, ESPERADO_INCIDENCIA)
        self.assertEqual(r["consultas"], 25)
        self.assertEqual(r["consultas"], sum(ESPERADO_INCIDENCIA.values()))
        self.assertEqual(r["sem_hipotese"], 0)

    def test_incidencia_respeita_o_periodo_pelo_calendario_local(self):
        """Só maio: entra a consulta das 23:30 de 31/05, que em UTC é junho."""
        from app.api.repositorios import relatorios

        r = relatorios.incidencia(self.horta, date(2026, 5, 1), date(2026, 5, 31))
        obtido = {(l["mes"], l["doenca_id"]): l["ocorrencias"] for l in r["linhas"]}
        esperado = {k: v for k, v in ESPERADO_INCIDENCIA.items() if k[0] == "2026-05"}
        self.assertEqual(obtido, esperado)
        self.assertEqual(r["consultas"], 4)

    def test_incidencia_ordena_por_mes_recente_e_ocorrencias(self):
        from app.api.repositorios import relatorios

        linhas = relatorios.incidencia(
            self.horta, date(2026, 1, 1), date(2026, 12, 31))["linhas"]
        chaves = [(l["mes"], -l["ocorrencias"]) for l in linhas]
        self.assertEqual(chaves, sorted(chaves, key=lambda c: (-int(c[0].replace("-", "")), c[1])))

    # ------------------------------------------------------------------ US28

    def test_confirmacao_confere_com_a_contagem_manual(self):
        from app.api.repositorios import relatorios

        r = relatorios.confirmacao(self.horta, 5)
        obtido = {l["doenca_id"]: (l["avaliadas"], l["confirmadas"], l["taxa_pct"])
                  for l in r["linhas"]}
        self.assertEqual(obtido, ESPERADO_CONFIRMACAO)
        # Numero, e nao Decimal: Decimal sairia como texto no JSON da API.
        self.assertTrue(all(isinstance(l["taxa_pct"], (float, type(None)))
                            for l in r["linhas"]))
        self.assertEqual((r["consultas"], r["avaliadas"], r["confirmadas"]),
                         (25, 19, 15))

    def test_confirmacao_poe_as_de_menor_taxa_primeiro(self):
        from app.api.repositorios import relatorios

        ordem = [l["doenca_id"] for l in relatorios.confirmacao(self.horta, 5)["linhas"]]
        self.assertEqual(ordem[:2], ["tomate_pinta_preta", "tomate_requeima"])

    # ------------------------------------------------------------------ US30

    def test_rotacao_confere_com_a_sucessao_dos_canteiros(self):
        from app.api.repositorios import relatorios

        obtido = {
            a["identificacao"]: (
                a["cultura_nome"],
                [(x["cultura_nome"], x["ciclos_atras"]) for x in a["repeticoes"]])
            for a in relatorios.rotacao(self.horta, 2)
        }
        self.assertEqual(obtido, ESPERADO_ROTACAO)

    def test_rotacao_olha_so_os_ciclos_recentes(self):
        """Com um ciclo só, a repetição do Canteiro 3 (dois atrás) some."""
        from app.api.repositorios import relatorios

        obtido = [a["identificacao"] for a in relatorios.rotacao(self.horta, 1)]
        self.assertEqual(obtido, ["Canteiro 1"])

    def test_ciclos_recentes_do_lugar_para_o_canteiro_novo(self):
        from app.api.repositorios import relatorios

        ciclos = relatorios.ciclos_recentes(self.horta, "Canteiro 3", 2)
        self.assertEqual([(c["cultura_id"], c["ativo"]) for c in ciclos],
                         [("couve", True), ("tomate", False)])

    # ------------------------------------------------------- migracao 004

    def test_nome_so_fica_livre_depois_que_o_ciclo_encerra(self):
        from app.api import banco
        from app.api.repositorios import hortas, relatorios

        con = banco.conexao()
        # Desfeito no fim, para nao mudar a carga que os outros testes leem.
        # Cada violacao esperada fica num savepoint proprio: sem ele, a
        # transacao inteira abortaria no primeiro erro.
        with con.transaction(force_rollback=True):
            with self.assertRaises(hortas.Duplicado), con.transaction():
                hortas.criar_canteiro(self.horta, "Estufa A", "pimentao")

            estufa = banco.consultar_um(
                "SELECT id FROM canteiro WHERE identificacao = 'Estufa A'")["id"]
            hortas.alterar_canteiro(estufa, {"ativo": False})
            novo = hortas.criar_canteiro(self.horta, "Estufa A", "pimentao")
            self.assertTrue(novo["ativo"])

            # Reativar o antigo daria dois ativos com o mesmo nome.
            with self.assertRaises(hortas.Duplicado), con.transaction():
                hortas.alterar_canteiro(estufa, {"ativo": True})

            # E o alerta enxerga a sucessao nova: pimentao depois de tomate.
            alertas = {a["identificacao"] for a in relatorios.rotacao(self.horta, 2)}
            self.assertIn("Estufa A", alertas)


if __name__ == "__main__":
    unittest.main()

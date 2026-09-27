"""Testes da API HTTP, incluindo a paridade com o motor de referencia.

O teste de paridade e o que a arquitetura de tres camadas ganhou. Antes, o
motor em Python era "implementacao de referencia" e o porte em TypeScript era o
que rodava de verdade - comparar os dois era uma checagem de engenharia. Agora
o Python roda em producao dentro da API, e a mesma fixture e reproduzida por
TRES implementacoes:

    app/diagnostico.py          motor puro, sem I/O
    POST /api/v1/diagnosticos   o mesmo motor, servido por HTTP
    web/lib/diagnostico.ts      o porte que roda no navegador, offline

Se as tres concordam caso a caso, nao existe caminho pelo qual o usuario receba
um diagnostico diferente do que a base curada determina.

As dependencias do back-end nao sao necessarias para o resto da suite: o motor
e a validacao sao stdlib pura. Por isso o modulo se pula sozinho quando elas
nao estao instaladas, em vez de quebrar `python -m unittest`.

RuntimeError entra no except junto de ImportError de proposito. O TestClient do
Starlette exige um cliente HTTP que ele NAO declara como dependencia
obrigatoria, e sinaliza a ausencia levantando RuntimeError - nao ImportError.
Com a protecao capturando so ImportError, faltar esse cliente fazia a suite
ERRAR no import do modulo em vez de pular, e o CI acusava dependencia faltante
como se fosse defeito de codigo. Para que estes testes de fato RODEM, e nao se
pulem, instale `requirements-dev.txt` - e o CI verifica isso explicitamente
antes de rodar a suite.
"""

import json
import unittest

from app import fixtures

try:
    from fastapi.testclient import TestClient

    from app.api import banco as banco_api
    from app.api.principal import app

    CLIENTE = TestClient(app)
    TEM_API = True
except (ImportError, RuntimeError):  # pragma: no cover - depende do ambiente
    CLIENTE = None
    banco_api = None
    TEM_API = False


PREFIXO = "/api/v1"


@unittest.skipUnless(TEM_API, "FastAPI nao instalado (pip install -r requirements.txt)")
class TestParidadeHttp(unittest.TestCase):
    """A API tem que reproduzir as fixtures campo a campo, sem tolerancia."""

    @classmethod
    def setUpClass(cls):
        with open(fixtures.CAMINHO_FIXTURES, encoding="utf-8") as f:
            cls.fixtures = json.load(f)

    def test_cada_caso_das_fixtures_bate_com_a_resposta_http(self):
        for caso in self.fixtures["casos"]:
            with self.subTest(caso=caso["nome"]):
                resposta = CLIENTE.post(
                    f"{PREFIXO}/diagnosticos",
                    json={
                        "cultura_id": caso["cultura"],
                        "sintomas": caso["sintomas"],
                    },
                )
                self.assertEqual(resposta.status_code, 200)
                corpo = resposta.json()

                esperado = caso["esperado"]["hipoteses"]
                obtido = corpo["hipoteses"]

                self.assertEqual(
                    [h["doenca_id"] for h in obtido],
                    [h["doenca_id"] for h in esperado],
                    "a ordem das hipoteses divergiu",
                )

                for e, o in zip(esperado, obtido):
                    # Igualdade EXATA, sem tolerancia. Comparar com margem
                    # deixaria passar justamente a divergencia que o teste
                    # existe para pegar.
                    self.assertEqual(o["compatibilidade"], e["compatibilidade"])
                    self.assertEqual(o["compatibilidade_pct"],
                                     e["compatibilidade_pct"])
                    self.assertEqual(o["gravidade"], e["gravidade"])
                    self.assertEqual(o["rotulo_gravidade"], e["rotulo_gravidade"])
                    self.assertEqual(
                        [s["id"] for s in o["sintomas_compativeis"]],
                        [s["id"] for s in e["sintomas_compativeis"]])
                    self.assertEqual(
                        [s["id"] for s in o["sintomas_esperados_ausentes"]],
                        [s["id"] for s in e["sintomas_esperados_ausentes"]])
                    self.assertEqual(
                        [s["id"] for s in o["sintomas_nao_explicados"]],
                        [s["id"] for s in e["sintomas_nao_explicados"]])

    def test_a_pergunta_de_desempate_tambem_bate(self):
        for caso in self.fixtures["casos"]:
            with self.subTest(caso=caso["nome"]):
                resposta = CLIENTE.post(
                    f"{PREFIXO}/diagnosticos",
                    json={
                        "cultura_id": caso["cultura"],
                        "sintomas": caso["sintomas"],
                    },
                )
                esperada = caso["esperado"]["pergunta"]
                obtida = resposta.json()["pergunta"]

                if esperada is None:
                    self.assertIsNone(obtida)
                    continue

                self.assertEqual(obtida["sintoma_id"], esperada["sintoma_id"])
                # `descarta` e o campo delicado: so pode vir preenchido quando a
                # segunda hipotese realmente nao espera aquele sintoma.
                self.assertEqual(obtida["descarta"], esperada["descarta"])


@unittest.skipUnless(TEM_API, "FastAPI nao instalado")
class TestCatalogoHttp(unittest.TestCase):

    def test_saude_responde_sem_banco_configurado(self):
        """O catalogo e servido da memoria: a API informa, nao quebra.

        Sem DATABASE_URL a API nao tenta conectar - nao ha rede envolvida, e o
        teste e deterministico em qualquer maquina.
        """
        from unittest.mock import patch

        with patch.object(banco_api, "disponivel", return_value=False):
            resposta = CLIENTE.get(f"{PREFIXO}/saude")

        self.assertEqual(resposta.status_code, 200)
        corpo = resposta.json()
        self.assertEqual(corpo["banco"], "nao_configurado")
        self.assertIsNone(corpo["migracao_aplicada"])
        self.assertTrue(corpo["versao_catalogo"])

    def test_saude_relata_a_falha_de_conexao_em_vez_de_quebrar(self):
        """Banco fora do ar tem que virar diagnostico, nao erro 500.

        A mensagem entra na resposta de proposito: e o que transforma
        "nao funciona" em "a string de conexao esta errada".
        """
        from unittest.mock import patch

        with (
            patch.object(banco_api, "disponivel", return_value=True),
            patch.object(banco_api, "consultar_um",
                         side_effect=OSError("porta 5432 bloqueada")),
        ):
            resposta = CLIENTE.get(f"{PREFIXO}/saude")

        self.assertEqual(resposta.status_code, 200)
        corpo = resposta.json()
        self.assertTrue(corpo["banco"].startswith("erro:"))
        self.assertIn("porta 5432 bloqueada", corpo["banco"])
        # O catalogo continua respondendo: ele nao vem do banco.
        self.assertTrue(corpo["versao_catalogo"])

    def test_culturas_batem_com_as_fixtures(self):
        with open(fixtures.CAMINHO_FIXTURES, encoding="utf-8") as f:
            esperadas = json.load(f)["culturas"]
        obtidas = CLIENTE.get(
            f"{PREFIXO}/culturas?apenas_com_doencas=true").json()
        self.assertEqual([c["id"] for c in obtidas],
                         [c["id"] for c in esperadas])

    def test_cultura_desconhecida_da_404_e_nao_lista_vazia(self):
        """Lista vazia seria indistinguivel de cultura sem sintomas."""
        r = CLIENTE.get(f"{PREFIXO}/culturas/nao_existe/sintomas")
        self.assertEqual(r.status_code, 404)

    def test_ficha_de_doenca_bate_com_a_fixture(self):
        with open(fixtures.CAMINHO_FIXTURES, encoding="utf-8") as f:
            fichas = json.load(f)["fichas"]
        for ficha in fichas:
            with self.subTest(doenca=ficha["id"]):
                obtida = CLIENTE.get(f"{PREFIXO}/doencas/{ficha['id']}").json()
                self.assertEqual(obtida, ficha)

    def test_versao_do_catalogo_traz_checksum_do_arquivo(self):
        from app.seed import checksum_da_base

        corpo = CLIENTE.get(f"{PREFIXO}/catalogo/versao").json()
        self.assertEqual(corpo["checksum_sha256"], checksum_da_base())


if __name__ == "__main__":
    unittest.main()

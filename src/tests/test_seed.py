"""Testes do gerador de SQL do seed (`--gerar-sql`).

Rodar:  python -m unittest tests.test_seed
"""

import tempfile
import unittest
from pathlib import Path

from app import seed


class TestGerarSql(unittest.TestCase):

    def gerar(self, **kwargs) -> str:
        with tempfile.TemporaryDirectory() as pasta:
            destino = Path(pasta) / "carga.sql"
            seed.gerar_sql(seed.carregar_json(), destino, **kwargs)
            return destino.read_text(encoding="utf-8")

    def test_banco_novo_recebe_o_esquema_inteiro(self):
        sql = self.gerar()
        self.assertIn("CREATE TABLE usuario", sql)
        self.assertIn("migracao 002_", sql)

    def test_banco_existente_pula_a_001_e_mantem_o_resto(self):
        """A 001 reexecutada aborta a transacao - e o catalogo vai junto."""
        sql = self.gerar(desde_migracao=2)
        self.assertNotIn("CREATE TABLE usuario", sql)
        self.assertIn("migracao_aplicada", sql)       # a 000, idempotente
        self.assertIn("migracao 002_", sql)
        self.assertIn("INSERT INTO cultura", sql)
        self.assertIn(seed.carregar_json()["versao"], sql)


if __name__ == "__main__":
    unittest.main()


class TestValidacaoContraOBanco(unittest.TestCase):
    """A base precisa obedecer as mesmas regras do banco, ou a carga aborta
    inteira em producao - e o banco fica preso no catalogo anterior."""

    def base_com(self, mudar):
        import copy

        base = copy.deepcopy(seed.carregar_json())
        mudar(base)
        return base

    def test_id_de_cultura_fora_do_padrao_do_banco_e_erro(self):
        from app.validacao import BaseInvalida, validar

        base = self.base_com(lambda b: b["culturas"][0].update(id="Couve Flor"))
        with self.assertRaises(BaseInvalida):
            validar(base)

    def test_tipo_de_agente_que_o_banco_nao_conhece_e_erro(self):
        from app.validacao import BaseInvalida, validar

        def mudar(b):
            b["culturas"][0]["doencas"][0]["tipo_agente"] = "viroide"

        with self.assertRaises(BaseInvalida) as erro:
            validar(self.base_com(mudar))
        self.assertIn("viroide", str(erro.exception))

    def test_sublinhado_no_id_de_cultura_e_aceito(self):
        """couve_flor, como esta na base desde as brassicas (migracao 003)."""
        from app.validacao import validar

        validar(self.base_com(lambda b: None))
        self.assertIn("couve_flor", [c["id"] for c in seed.carregar_json()["culturas"]])

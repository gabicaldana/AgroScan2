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

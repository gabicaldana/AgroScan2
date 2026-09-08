"""Testes de senha e token.

Não dependem de banco nem de rede: `hash_senha` e `conferir_senha` são funções
puras, e o token é assinado e lido no mesmo processo.
"""

import unittest

try:
    import jwt  # noqa: F401

    from app.api import configuracao, seguranca

    TEM_API = True
except ImportError:  # pragma: no cover - depende do ambiente
    TEM_API = False


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestSenha(unittest.TestCase):

    def test_a_senha_certa_confere(self):
        guardado = seguranca.hash_senha("horta-da-esquina-7")
        self.assertTrue(seguranca.conferir_senha("horta-da-esquina-7", guardado))

    def test_a_senha_errada_nao_confere(self):
        guardado = seguranca.hash_senha("horta-da-esquina-7")
        self.assertFalse(seguranca.conferir_senha("horta-da-esquina-8", guardado))

    def test_a_mesma_senha_gera_hashes_diferentes(self):
        """Sal aleatório por senha.

        Sem isso, duas pessoas com a mesma senha teriam o mesmo hash - e quem
        visse o banco saberia disso sem quebrar nada.
        """
        a = seguranca.hash_senha("mesma-senha-123")
        b = seguranca.hash_senha("mesma-senha-123")
        self.assertNotEqual(a, b)
        self.assertTrue(seguranca.conferir_senha("mesma-senha-123", a))
        self.assertTrue(seguranca.conferir_senha("mesma-senha-123", b))

    def test_o_hash_carrega_os_proprios_parametros(self):
        """Sem isso, aumentar o custo no futuro invalidaria todas as senhas."""
        partes = seguranca.hash_senha("senha-longa-o-bastante").split("$")
        self.assertEqual(partes[0], "scrypt")
        self.assertEqual(int(partes[1]), seguranca.SCRYPT_N)
        self.assertEqual(int(partes[2]), seguranca.SCRYPT_R)

    def test_senha_curta_e_recusada(self):
        with self.assertRaises(ValueError):
            seguranca.hash_senha("curta")

    def test_hash_corrompido_nega_em_vez_de_explodir(self):
        """Um 500 aqui diria ao atacante que aquele usuário existe."""
        for lixo in ("", "nada", "scrypt$x$y$z$w$v", "outro$1$2$3$4$5"):
            with self.subTest(guardado=lixo):
                self.assertFalse(seguranca.conferir_senha("qualquer", lixo))

    def test_a_senha_nao_aparece_no_hash(self):
        senha = "segredo-do-canteiro"
        self.assertNotIn(senha, seguranca.hash_senha(senha))


@unittest.skipUnless(TEM_API, "dependencias do back-end nao instaladas")
class TestToken(unittest.TestCase):

    def setUp(self):
        self._segredo = configuracao.JWT_SEGREDO
        configuracao.JWT_SEGREDO = "segredo-de-teste-nao-usar-em-producao"

    def tearDown(self):
        configuracao.JWT_SEGREDO = self._segredo

    def test_o_token_carrega_o_usuario_e_o_papel(self):
        dados = seguranca._ler_token(seguranca.criar_token(42, "agronomo"))
        self.assertEqual(dados["sub"], "42")
        self.assertEqual(dados["papel"], "agronomo")

    def test_token_assinado_com_outro_segredo_e_recusado(self):
        token = seguranca.criar_token(1, "produtor")
        configuracao.JWT_SEGREDO = "outro-segredo-completamente-diferente"

        from fastapi import HTTPException

        with self.assertRaises(HTTPException) as ctx:
            seguranca._ler_token(token)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_token_expirado_e_recusado_com_mensagem_propria(self):
        """Expirado e inválido são coisas diferentes para quem usa o app:
        um pede para entrar de novo, o outro é sinal de problema."""
        from datetime import datetime, timedelta, timezone

        import jwt
        from fastapi import HTTPException

        vencido = jwt.encode(
            {
                "sub": "1",
                "papel": "produtor",
                "exp": datetime.now(timezone.utc) - timedelta(hours=1),
            },
            configuracao.JWT_SEGREDO,
            algorithm="HS256",
        )

        with self.assertRaises(HTTPException) as ctx:
            seguranca._ler_token(vencido)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("expirada", ctx.exception.detail)

    def test_sem_segredo_configurado_a_criacao_falha(self):
        """Segredo vazio assinaria com string previsível - qualquer pessoa
        poderia forjar uma sessão."""
        configuracao.JWT_SEGREDO = ""
        with self.assertRaises(RuntimeError):
            seguranca.criar_token(1, "produtor")


if __name__ == "__main__":
    unittest.main()

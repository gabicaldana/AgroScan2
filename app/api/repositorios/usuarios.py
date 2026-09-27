"""SQL da tabela `usuario`. Sem regra de negocio, sem HTTP."""

from app.api import banco


def por_email(email: str) -> dict | None:
    return banco.consultar_um(
        "SELECT id, nome, email, senha_hash, papel, ativo"
        " FROM usuario WHERE email = %s",
        (email,),
    )


def por_id(usuario_id: int) -> dict | None:
    return banco.consultar_um(
        "SELECT id, nome, email, papel, criado_em, ativo"
        " FROM usuario WHERE id = %s",
        (usuario_id,),
    )


def criar(nome: str, email: str, senha_hash: str, papel: str = "produtor") -> dict:
    return banco.consultar_um(
        """INSERT INTO usuario (nome, email, senha_hash, papel)
           VALUES (%s, %s, %s, %s)
           RETURNING id, nome, email, papel, criado_em, ativo""",
        (nome, email, senha_hash, papel),
    )


def email_ja_usado(email: str) -> bool:
    return banco.consultar_um(
        "SELECT 1 AS existe FROM usuario WHERE email = %s", (email,)
    ) is not None


def desativar(usuario_id: int) -> None:
    """Exclusao de conta (LGPD).

    As consultas do usuario tem ON DELETE CASCADE, entao apagar a linha leva
    junto o historico - que e o que a lei pede quando o titular solicita.
    """
    with banco.conexao().cursor() as cur:
        cur.execute("DELETE FROM usuario WHERE id = %s", (usuario_id,))

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


def excluir(usuario_id: int) -> str:
    """Exclusao de conta (LGPD). Devolve "excluida" ou "anonimizada".

    Sem manejo registrado, a linha e apagada, e o ON DELETE CASCADE leva
    junto consultas, feedbacks, anotacoes e participacao em hortas.

    Com manejo, a linha FICA, anonimizada. `manejo.responsavel_id` e
    RESTRICT de proposito: o registro de aplicacao de defensivo tem valor de
    rastreabilidade para quem continua na horta (carencia, residuo), e nao
    pode sumir com a saida de quem o registrou. O que se apaga e a pessoa:
    nome, e-mail e senha, e tudo o que o CASCADE apagaria. Dado anonimizado
    deixa de ser dado pessoal (LGPD, art. 12), e o manejo aponta para uma
    "Conta excluida" em vez de para alguem identificavel.

    As quatro tabelas abaixo sao exatamente as que referenciam `usuario` com
    ON DELETE CASCADE na migracao 001. Uma tabela nova com essa referencia
    precisa entrar aqui tambem.
    """
    con = banco.conexao()
    with con.transaction():
        with con.cursor() as cur:
            cur.execute(
                "SELECT 1 FROM manejo WHERE responsavel_id = %s LIMIT 1",
                (usuario_id,))
            if cur.fetchone() is None:
                cur.execute("DELETE FROM usuario WHERE id = %s", (usuario_id,))
                return "excluida"

            for tabela in ("membro_horta", "consulta", "feedback", "anotacao"):
                cur.execute(f"DELETE FROM {tabela} WHERE usuario_id = %s",
                            (usuario_id,))
            cur.execute(
                """UPDATE usuario
                      SET nome = 'Conta excluída',
                          email = 'excluida-' || id || '@agroscan.invalid',
                          senha_hash = '!',
                          ativo = FALSE
                    WHERE id = %s""",
                (usuario_id,))
            return "anonimizada"

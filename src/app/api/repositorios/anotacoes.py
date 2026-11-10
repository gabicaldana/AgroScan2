"""Acesso à tabela `anotacao` (US21).

A anotação é texto livre preso a um canteiro ou a uma consulta. O banco já
garante que ela nunca fica solta (CHECK `anotacao_tem_contexto`) e mantém
`atualizada_em` por gatilho; aqui ficam só as consultas.
"""

from app.api import banco

_COLUNAS = """a.id, a.canteiro_id, a.consulta_id, a.texto, a.criada_em,
              a.atualizada_em, a.usuario_id AS autor_id, u.nome AS autor_nome"""


def listar_do_canteiro(canteiro_id: int) -> list[dict]:
    return banco.consultar(
        f"""SELECT {_COLUNAS}
              FROM anotacao a
              JOIN usuario u ON u.id = a.usuario_id
             WHERE a.canteiro_id = %s
             ORDER BY a.criada_em DESC, a.id DESC""",
        (canteiro_id,),
    )


def listar_da_consulta(consulta_id: int) -> list[dict]:
    return banco.consultar(
        f"""SELECT {_COLUNAS}
              FROM anotacao a
              JOIN usuario u ON u.id = a.usuario_id
             WHERE a.consulta_id = %s
             ORDER BY a.criada_em DESC, a.id DESC""",
        (consulta_id,),
    )


def criar(usuario_id: int, texto: str, canteiro_id: int | None = None,
          consulta_id: int | None = None) -> dict:
    criada = banco.consultar_um(
        """INSERT INTO anotacao (usuario_id, canteiro_id, consulta_id, texto)
           VALUES (%s, %s, %s, %s)
           RETURNING id""",
        (usuario_id, canteiro_id, consulta_id, texto),
    )
    return obter(criada["id"])


def obter(anotacao_id: int) -> dict | None:
    return banco.consultar_um(
        f"""SELECT {_COLUNAS}
              FROM anotacao a
              JOIN usuario u ON u.id = a.usuario_id
             WHERE a.id = %s""",
        (anotacao_id,),
    )


def alterar(anotacao_id: int, texto: str) -> dict:
    banco.consultar_um(
        "UPDATE anotacao SET texto = %s WHERE id = %s RETURNING id",
        (texto, anotacao_id),
    )
    return obter(anotacao_id)


def apagar(anotacao_id: int) -> None:
    banco.consultar_um(
        "DELETE FROM anotacao WHERE id = %s RETURNING id", (anotacao_id,))

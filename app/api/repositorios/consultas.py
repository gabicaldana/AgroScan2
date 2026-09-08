"""SQL das consultas registradas. Sem regra de negocio, sem HTTP."""

from app.api import banco


def por_offline_id(usuario_id: int, offline_id: str) -> dict | None:
    return banco.consultar_um(
        """SELECT id, offline_id, cultura_id, canteiro_id, origem,
                  latitude, longitude, registrada_em, sincronizada_em,
                  versao_catalogo
             FROM consulta
            WHERE usuario_id = %s AND offline_id = %s""",
        (usuario_id, offline_id),
    )


def registrar(
    usuario_id: int,
    offline_id: str,
    cultura_id: str,
    versao_catalogo: str,
    registrada_em,
    sintomas: list[str],
    hipoteses: list[dict],
    canteiro_id: int | None = None,
    origem: str = "sintomas",
    latitude=None,
    longitude=None,
) -> tuple[dict, bool]:
    """Grava a consulta. Devolve (linha, foi_criada_agora).

    Idempotente por `offline_id`. Reenviar a fila e o caso NORMAL, nao a
    excecao: o aparelho registra sem sinal, guarda localmente e sobe quando a
    rede volta - e nao tem como saber se a tentativa anterior chegou antes de
    a conexao cair. A garantia mora no banco (`UNIQUE (offline_id)`), e nao
    apenas neste codigo, porque duas invocacoes concorrentes da funcao
    serverless passariam juntas por qualquer verificacao feita em Python.
    """
    con = banco.conexao()

    with con.transaction():
        with con.cursor() as cur:
            cur.execute(
                """INSERT INTO consulta
                       (offline_id, usuario_id, canteiro_id, cultura_id,
                        origem, latitude, longitude, registrada_em,
                        versao_catalogo)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (offline_id) DO NOTHING
                   RETURNING id, offline_id, cultura_id, canteiro_id, origem,
                             latitude, longitude, registrada_em,
                             sincronizada_em, versao_catalogo""",
                (offline_id, usuario_id, canteiro_id, cultura_id, origem,
                 latitude, longitude, registrada_em, versao_catalogo),
            )
            linha = cur.fetchone()

            if linha is None:
                # Ja existia: devolve a original, sem tocar nela. Regravar
                # apagaria a data em que a observacao foi feita em campo.
                return por_offline_id(usuario_id, offline_id), False

            consulta_id = linha["id"]

            for sintoma_id in sintomas:
                cur.execute(
                    "INSERT INTO consulta_sintoma (consulta_id, sintoma_id)"
                    " VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (consulta_id, sintoma_id),
                )

            # A posicao vem do indice, e nao de reordenar aqui: a ordem foi
            # decidida pelo motor, e recalcula-la seria uma segunda regra de
            # negocio escondida na camada de dados.
            for posicao, h in enumerate(hipoteses, start=1):
                cur.execute(
                    """INSERT INTO consulta_hipotese
                           (consulta_id, doenca_id, posicao, compatibilidade)
                       VALUES (%s, %s, %s, %s)""",
                    (consulta_id, h["doenca_id"], posicao,
                     round(float(h["compatibilidade"]), 5)),
                )

    return linha, True


def listar(
    usuario_id: int,
    de=None,
    ate=None,
    cultura_id: str | None = None,
    canteiro_id: int | None = None,
    limite: int = 50,
    deslocamento: int = 0,
) -> list[dict]:
    """Historico do usuario, do mais recente para o mais antigo.

    Traz a hipotese principal junto, por LATERAL: sem isso a tela faria uma
    consulta por linha para mostrar o nome da doenca, que e o problema de
    N+1 consultas - invisivel com dez registros, caro com mil.
    """
    condicoes = ["c.usuario_id = %s"]
    parametros: list = [usuario_id]

    if de is not None:
        condicoes.append("c.registrada_em >= %s")
        parametros.append(de)
    if ate is not None:
        condicoes.append("c.registrada_em <= %s")
        parametros.append(ate)
    if cultura_id:
        condicoes.append("c.cultura_id = %s")
        parametros.append(cultura_id)
    if canteiro_id:
        condicoes.append("c.canteiro_id = %s")
        parametros.append(canteiro_id)

    parametros += [limite, deslocamento]

    return banco.consultar(
        f"""SELECT c.id, c.offline_id, c.cultura_id, cu.nome AS cultura_nome,
                   cu.emoji, c.canteiro_id, c.origem, c.registrada_em,
                   c.versao_catalogo,
                   p.doenca_id, p.nome AS doenca_nome, p.compatibilidade,
                   (f.consulta_id IS NOT NULL) AS tem_feedback
              FROM consulta c
              JOIN cultura cu ON cu.id = c.cultura_id
              LEFT JOIN LATERAL (
                    SELECT ch.doenca_id, d.nome, ch.compatibilidade
                      FROM consulta_hipotese ch
                      JOIN doenca d ON d.id = ch.doenca_id
                     WHERE ch.consulta_id = c.id AND ch.posicao = 1
                     LIMIT 1
              ) p ON TRUE
              LEFT JOIN feedback f ON f.consulta_id = c.id
             WHERE {' AND '.join(condicoes)}
             ORDER BY c.registrada_em DESC, c.id DESC
             LIMIT %s OFFSET %s""",
        tuple(parametros),
    )


def detalhar(usuario_id: int, consulta_id: int) -> dict | None:
    consulta = banco.consultar_um(
        """SELECT c.id, c.offline_id, c.cultura_id, cu.nome AS cultura_nome,
                  c.canteiro_id, c.origem, c.latitude, c.longitude,
                  c.registrada_em, c.sincronizada_em, c.versao_catalogo
             FROM consulta c JOIN cultura cu ON cu.id = c.cultura_id
            WHERE c.id = %s AND c.usuario_id = %s""",
        (consulta_id, usuario_id),
    )
    if consulta is None:
        return None

    consulta["sintomas"] = banco.consultar(
        """SELECT s.id, s.nome FROM consulta_sintoma cs
             JOIN sintoma s ON s.id = cs.sintoma_id
            WHERE cs.consulta_id = %s ORDER BY s.id""",
        (consulta_id,),
    )
    consulta["hipoteses"] = banco.consultar(
        """SELECT ch.doenca_id, d.nome, ch.posicao, ch.compatibilidade
             FROM consulta_hipotese ch JOIN doenca d ON d.id = ch.doenca_id
            WHERE ch.consulta_id = %s ORDER BY ch.posicao""",
        (consulta_id,),
    )
    return consulta


def registrar_feedback(
    consulta_id: int,
    usuario_id: int,
    confirmado: bool,
    doenca_confirmada_id: str | None,
    comentario: str | None,
) -> dict:
    """Um feedback por consulta. Reenviar atualiza em vez de duplicar."""
    return banco.consultar_um(
        """INSERT INTO feedback (consulta_id, usuario_id, confirmado,
                                 doenca_confirmada_id, comentario)
           VALUES (%s, %s, %s, %s, %s)
           ON CONFLICT (consulta_id) DO UPDATE
             SET confirmado           = EXCLUDED.confirmado,
                 doenca_confirmada_id = EXCLUDED.doenca_confirmada_id,
                 comentario           = EXCLUDED.comentario,
                 registrado_em        = now()
           RETURNING consulta_id, confirmado, doenca_confirmada_id,
                     comentario, registrado_em""",
        (consulta_id, usuario_id, confirmado, doenca_confirmada_id, comentario),
    )


def pertence_ao_usuario(consulta_id: int, usuario_id: int) -> bool:
    return banco.consultar_um(
        "SELECT 1 AS existe FROM consulta WHERE id = %s AND usuario_id = %s",
        (consulta_id, usuario_id),
    ) is not None

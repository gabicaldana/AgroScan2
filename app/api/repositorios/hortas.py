"""SQL de horta, membros, canteiros e manejo. Sem regra de negocio, sem HTTP.

A autorizacao e decidida nas rotas, mas a PERGUNTA que ela faz mora aqui:
`papel_na_horta` e `canteiro_do_membro` respondem "esta pessoa ve isto?" com
uma consulta so, e devolvem None quando nao ve - a rota transforma isso em
404, sem distinguir "nao existe" de "nao e seu".
"""

from app.api import banco


class Duplicado(Exception):
    """Violou uma restricao de unicidade. A rota decide a mensagem."""


def _unicidade(funcao):
    """Traduz UniqueViolation do psycopg em `Duplicado`.

    A verificacao fica no banco, e nao num SELECT antes do INSERT: duas
    requisicoes concorrentes passariam juntas pelo SELECT.
    """

    def envolvida(*args, **kwargs):
        import psycopg

        try:
            return funcao(*args, **kwargs)
        except psycopg.errors.UniqueViolation as erro:
            raise Duplicado(str(erro)) from erro

    return envolvida


# =============================================================================
# Horta
# =============================================================================

_COLUNAS_HORTA = """h.id, h.nome, h.municipio, h.uf, h.latitude, h.longitude,
                    h.responsavel_id, h.criada_em"""


def criar_horta(usuario_id: int, nome: str, municipio: str, uf: str,
                latitude=None, longitude=None) -> dict:
    """Cria a horta e torna quem criou o responsavel, na mesma transacao.

    Sem a transacao, uma falha entre os dois INSERTs deixaria uma horta sem
    nenhum membro - invisivel para todos, inclusive para quem a criou.
    """
    con = banco.conexao()
    with con.transaction():
        with con.cursor() as cur:
            cur.execute(
                """INSERT INTO horta (nome, municipio, uf, latitude, longitude,
                                      responsavel_id)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   RETURNING id, nome, municipio, uf, latitude, longitude,
                             responsavel_id, criada_em""",
                (nome, municipio, uf, latitude, longitude, usuario_id),
            )
            horta = cur.fetchone()
            cur.execute(
                """INSERT INTO membro_horta (horta_id, usuario_id, papel)
                   VALUES (%s, %s, 'responsavel')""",
                (horta["id"], usuario_id),
            )
    horta["papel"] = "responsavel"
    return horta


def listar_hortas(usuario_id: int) -> list[dict]:
    return banco.consultar(
        f"""SELECT {_COLUNAS_HORTA}, m.papel,
                   (SELECT count(*) FROM canteiro c
                     WHERE c.horta_id = h.id AND c.ativo) AS canteiros_ativos,
                   (SELECT count(*) FROM membro_horta mm
                     WHERE mm.horta_id = h.id) AS membros
              FROM horta h
              JOIN membro_horta m ON m.horta_id = h.id AND m.usuario_id = %s
             ORDER BY h.nome""",
        (usuario_id,),
    )


def papel_na_horta(horta_id: int, usuario_id: int) -> str | None:
    """'responsavel', 'membro', ou None quando a pessoa nao participa."""
    linha = banco.consultar_um(
        "SELECT papel FROM membro_horta WHERE horta_id = %s AND usuario_id = %s",
        (horta_id, usuario_id),
    )
    return linha["papel"] if linha else None


def detalhar_horta(horta_id: int) -> dict | None:
    horta = banco.consultar_um(
        f"SELECT {_COLUNAS_HORTA} FROM horta h WHERE h.id = %s", (horta_id,))
    if horta is None:
        return None

    horta["membros"] = banco.consultar(
        """SELECT u.id, u.nome, u.email, m.papel, m.entrou_em
             FROM membro_horta m JOIN usuario u ON u.id = m.usuario_id
            WHERE m.horta_id = %s
            ORDER BY (m.papel = 'responsavel') DESC, u.nome""",
        (horta_id,),
    )
    horta["canteiros"] = listar_canteiros_da_horta(horta_id)
    return horta


def alterar_horta(horta_id: int, campos: dict) -> dict:
    """Atualiza os campos enviados. Transferir a responsabilidade troca os
    papeis em `membro_horta` junto, na mesma transacao: o antigo responsavel
    vira membro, e nunca ficam dois nem nenhum."""
    con = banco.conexao()
    with con.transaction():
        with con.cursor() as cur:
            novo = campos.pop("responsavel_id", None)
            if novo is not None:
                cur.execute(
                    """UPDATE membro_horta SET papel = 'membro'
                        WHERE horta_id = %s AND papel = 'responsavel'""",
                    (horta_id,),
                )
                cur.execute(
                    """UPDATE membro_horta SET papel = 'responsavel'
                        WHERE horta_id = %s AND usuario_id = %s""",
                    (horta_id, novo),
                )
                campos["responsavel_id"] = novo

            if campos:
                # Os nomes de coluna vem do esquema Pydantic, nunca do cliente:
                # so as chaves declaradas em AlteracaoDeHorta chegam aqui.
                atribuicoes = ", ".join(f"{coluna} = %s" for coluna in campos)
                cur.execute(
                    f"UPDATE horta SET {atribuicoes} WHERE id = %s",
                    (*campos.values(), horta_id),
                )
    return detalhar_horta(horta_id)


# =============================================================================
# Membros
# =============================================================================


def usuario_por_email(email: str) -> dict | None:
    return banco.consultar_um(
        "SELECT id, nome, email FROM usuario WHERE email = %s AND ativo",
        (email,),
    )


@_unicidade
def adicionar_membro(horta_id: int, usuario_id: int, papel: str) -> dict:
    return banco.consultar_um(
        """INSERT INTO membro_horta (horta_id, usuario_id, papel)
           VALUES (%s, %s, %s)
           RETURNING horta_id, usuario_id, papel, entrou_em""",
        (horta_id, usuario_id, papel),
    )


def remover_membro(horta_id: int, usuario_id: int) -> bool:
    with banco.conexao().cursor() as cur:
        cur.execute(
            "DELETE FROM membro_horta WHERE horta_id = %s AND usuario_id = %s",
            (horta_id, usuario_id),
        )
        return cur.rowcount > 0


def hortas_sob_responsabilidade(usuario_id: int) -> list[dict]:
    """As hortas que impedem a exclusao da conta (FK com ON DELETE RESTRICT)."""
    return banco.consultar(
        """SELECT h.id, h.nome,
                  (SELECT count(*) FROM membro_horta m
                    WHERE m.horta_id = h.id) AS membros
             FROM horta h WHERE h.responsavel_id = %s ORDER BY h.nome""",
        (usuario_id,),
    )


def apagar_horta(horta_id: int) -> None:
    """Membros, canteiros e manejos vao junto (ON DELETE CASCADE); as
    consultas feitas nos canteiros ficam, com o canteiro anulado."""
    with banco.conexao().cursor() as cur:
        cur.execute("DELETE FROM horta WHERE id = %s", (horta_id,))


# =============================================================================
# Canteiros
# =============================================================================

_COLUNAS_CANTEIRO = """c.id, c.horta_id, c.identificacao, c.cultura_id,
                       cu.nome AS cultura_nome, cu.emoji, cu.familia,
                       c.data_plantio, c.area_m2, c.ativo"""


def listar_canteiros_da_horta(horta_id: int) -> list[dict]:
    return banco.consultar(
        f"""SELECT {_COLUNAS_CANTEIRO}
              FROM canteiro c JOIN cultura cu ON cu.id = c.cultura_id
             WHERE c.horta_id = %s
             ORDER BY c.ativo DESC, c.identificacao""",
        (horta_id,),
    )


def canteiros_do_usuario(usuario_id: int) -> list[dict]:
    """Os canteiros ATIVOS de todas as hortas da pessoa.

    E a lista que o aparelho guarda para vincular uma consulta ao canteiro
    sem rede: o produtor escolhe o canteiro no campo, e a consulta sobe
    depois com o vinculo.
    """
    return banco.consultar(
        f"""SELECT {_COLUNAS_CANTEIRO}, h.nome AS horta_nome
              FROM canteiro c
              JOIN cultura cu ON cu.id = c.cultura_id
              JOIN horta h ON h.id = c.horta_id
              JOIN membro_horta m ON m.horta_id = h.id AND m.usuario_id = %s
             WHERE c.ativo
             ORDER BY h.nome, c.identificacao""",
        (usuario_id,),
    )


def canteiro_do_membro(canteiro_id: int, usuario_id: int) -> dict | None:
    """O canteiro, se a pessoa e membro da horta dele; senao None."""
    return banco.consultar_um(
        f"""SELECT {_COLUNAS_CANTEIRO}, h.nome AS horta_nome, m.papel
              FROM canteiro c
              JOIN cultura cu ON cu.id = c.cultura_id
              JOIN horta h ON h.id = c.horta_id
              JOIN membro_horta m ON m.horta_id = h.id AND m.usuario_id = %s
             WHERE c.id = %s""",
        (usuario_id, canteiro_id),
    )


@_unicidade
def criar_canteiro(horta_id: int, identificacao: str, cultura_id: str,
                   data_plantio=None, area_m2=None) -> dict:
    linha = banco.consultar_um(
        """INSERT INTO canteiro (horta_id, identificacao, cultura_id,
                                 data_plantio, area_m2)
           VALUES (%s, %s, %s, %s, %s)
           RETURNING id""",
        (horta_id, identificacao, cultura_id, data_plantio, area_m2),
    )
    return _canteiro_por_id(linha["id"])


@_unicidade
def alterar_canteiro(canteiro_id: int, campos: dict) -> dict:
    if campos:
        # Chaves vindas de AlteracaoDeCanteiro, nunca do cliente direto.
        atribuicoes = ", ".join(f"{coluna} = %s" for coluna in campos)
        with banco.conexao().cursor() as cur:
            cur.execute(
                f"UPDATE canteiro SET {atribuicoes} WHERE id = %s",
                (*campos.values(), canteiro_id),
            )
    return _canteiro_por_id(canteiro_id)


def _canteiro_por_id(canteiro_id: int) -> dict:
    return banco.consultar_um(
        f"""SELECT {_COLUNAS_CANTEIRO}
              FROM canteiro c JOIN cultura cu ON cu.id = c.cultura_id
             WHERE c.id = %s""",
        (canteiro_id,),
    )


# =============================================================================
# Manejo
# =============================================================================


def listar_manejos(canteiro_id: int) -> list[dict]:
    return banco.consultar(
        """SELECT mj.id, mj.canteiro_id, mj.doenca_id, d.nome AS doenca_nome,
                  mj.consulta_id, mj.tipo, mj.descricao, mj.produto, mj.dose,
                  mj.aplicado_em, mj.responsavel_id, u.nome AS responsavel_nome
             FROM manejo mj
             JOIN usuario u ON u.id = mj.responsavel_id
             LEFT JOIN doenca d ON d.id = mj.doenca_id
            WHERE mj.canteiro_id = %s
            ORDER BY mj.aplicado_em DESC, mj.id DESC""",
        (canteiro_id,),
    )


def registrar_manejo(canteiro_id: int, responsavel_id: int, tipo: str,
                     descricao: str, aplicado_em, produto=None, dose=None,
                     doenca_id=None, consulta_id=None) -> dict:
    return banco.consultar_um(
        """INSERT INTO manejo (canteiro_id, doenca_id, consulta_id, tipo,
                               descricao, produto, dose, aplicado_em,
                               responsavel_id)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
           RETURNING id, canteiro_id, doenca_id, consulta_id, tipo, descricao,
                     produto, dose, aplicado_em, responsavel_id""",
        (canteiro_id, doenca_id, consulta_id, tipo, descricao, produto, dose,
         aplicado_em, responsavel_id),
    )

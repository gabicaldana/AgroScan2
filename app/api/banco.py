"""Conexao com o PostgreSQL, reusada entre invocacoes.

Em ambiente serverless cada invocacao fria abriria uma conexao nova, e o plano
gratuito da Neon corta em algumas dezenas de conexoes simultaneas. A conexao
vive em escopo de modulo: a mesma instancia da funcao reaproveita, e so uma
conexao morta e recriada.

ARMADILHA QUE SO APARECE SOB CONCORRENCIA:

O pooling em modo transacao (PgBouncer, que e o que a string "pooled" da Neon e
da Supabase entrega) NAO suporta prepared statements nomeados. O psycopg3
prepara automaticamente a partir da quinta execucao da mesma consulta, e ai
comeca a aparecer, de forma intermitente, `prepared statement "_pg_x" already
exists` - porque a proxima transacao pode cair noutra conexao fisica do pool.

Por isso `prepare_threshold=None`. Esta linha e a diferenca entre uma API que
funciona no teste manual e uma que quebra quando dois usuarios chegam juntos.
"""

from app.api import configuracao

_conexao = None


def _abrir():
    import psycopg
    from psycopg.rows import dict_row

    if not configuracao.DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL nao definida. A API precisa da string POOLED do "
            "PostgreSQL para responder.")

    return psycopg.connect(
        configuracao.DATABASE_URL,
        autocommit=True,
        row_factory=dict_row,
        # Ver o bloco de armadilha no topo do modulo. Nao remover.
        prepare_threshold=None,
        # Falhar rapido e melhor que segurar uma conexao do pool: o limite de
        # tempo da funcao serverless e menor que a paciencia de um cliente.
        options="-c statement_timeout=5000",
    )


def conexao():
    """A conexao do processo, reaberta se tiver morrido."""
    global _conexao

    if _conexao is None or _conexao.closed:
        _conexao = _abrir()
        return _conexao

    try:
        _conexao.execute("SELECT 1")
    except Exception:
        # Conexao derrubada pelo servidor entre invocacoes: descarta e refaz.
        try:
            _conexao.close()
        except Exception:
            pass
        _conexao = _abrir()

    return _conexao


def consultar(sql: str, parametros: tuple = ()) -> list[dict]:
    with conexao().cursor() as cur:
        cur.execute(sql, parametros)
        return cur.fetchall()


def consultar_um(sql: str, parametros: tuple = ()) -> dict | None:
    with conexao().cursor() as cur:
        cur.execute(sql, parametros)
        return cur.fetchone()


def disponivel() -> bool:
    """Ha banco configurado? A API serve o catalogo mesmo sem ele."""
    return bool(configuracao.DATABASE_URL)

"""SQL dos relatorios da horta (epico E6). Sem regra de negocio, sem HTTP.

As consultas partem de `docs/modelo-de-dados.md`, secao 6, e corrigem o que a
conferencia contra o banco real achou na Sprint 4 (detalhe na propria secao).
A agregacao roda no banco, sem desnormalizacao: se uma consulta ficar lenta,
o caminho e indice nas colunas de filtro, e depois visao materializada (R05).

Todo relatorio e de UMA horta, pelas consultas vinculadas aos canteiros dela.
Consulta sem canteiro e do caderno da pessoa, nao da horta. Quem pode ver a
horta e decidido na rota (ADR 0012).
"""

from app.api import banco

# O mes de uma consulta e o mes no calendario de quem a fez. O servidor roda
# em UTC, e `date_trunc` sobre timestamptz usa o fuso da sessao: sem isto, a
# consulta das 23h do dia 31 cairia no mes seguinte.
FUSO = "America/Sao_Paulo"


def incidencia(horta_id: int, de, ate) -> dict:
    """Ocorrencias por mes e doenca, pela hipotese principal (US27, secao 6.1).

    `de` e `ate` sao datas, inclusivas, no calendario local. Devolve tambem o
    total de consultas do periodo e quantas ficaram sem hipotese, para a tela
    dizer sobre quantos registros a tabela fala.
    """
    periodo = """c.registrada_em >= (%(de)s::date::timestamp AT TIME ZONE %(fuso)s)
             AND c.registrada_em <  ((%(ate)s::date + 1)::timestamp AT TIME ZONE %(fuso)s)"""
    parametros = {"horta": horta_id, "de": de, "ate": ate, "fuso": FUSO}

    linhas = banco.consultar(
        f"""SELECT to_char(date_trunc('month', c.registrada_em AT TIME ZONE %(fuso)s),
                           'YYYY-MM')     AS mes,
                   d.id                   AS doenca_id,
                   d.nome                 AS doenca_nome,
                   cu.id                  AS cultura_id,
                   cu.nome                AS cultura_nome,
                   count(*)               AS ocorrencias
              FROM consulta c
              JOIN canteiro ca         ON ca.id = c.canteiro_id
              JOIN consulta_hipotese h ON h.consulta_id = c.id AND h.posicao = 1
              JOIN doenca d            ON d.id = h.doenca_id
              JOIN cultura cu          ON cu.id = c.cultura_id
             WHERE ca.horta_id = %(horta)s
               AND {periodo}
             GROUP BY mes, d.id, d.nome, cu.id, cu.nome
             ORDER BY mes DESC, ocorrencias DESC, d.nome""",
        parametros,
    )
    totais = banco.consultar_um(
        f"""SELECT count(*) AS consultas,
                   count(*) FILTER (WHERE NOT EXISTS (
                       SELECT 1 FROM consulta_hipotese h
                        WHERE h.consulta_id = c.id AND h.posicao = 1
                   )) AS sem_hipotese
              FROM consulta c
              JOIN canteiro ca ON ca.id = c.canteiro_id
             WHERE ca.horta_id = %(horta)s
               AND {periodo}""",
        parametros,
    )
    return {**totais, "linhas": linhas}


def confirmacao(horta_id: int, amostra_minima: int) -> dict:
    """Feedbacks por doenca da hipotese principal (US28, secao 6.2).

    Toda doenca avaliada aparece, com a contagem. A taxa so vem calculada a
    partir de `amostra_minima` avaliacoes; abaixo disso fica nula, e a tela
    mostra "x de y". Ordem: as de menor taxa primeiro - sao as que orientam a
    proxima revisao da curadoria -, e as sem taxa no fim.
    """
    linhas = banco.consultar(
        """SELECT d.id                                   AS doenca_id,
                  d.nome                                 AS doenca_nome,
                  cu.nome                                AS cultura_nome,
                  count(*)                               AS avaliadas,
                  count(*) FILTER (WHERE f.confirmado)   AS confirmadas,
                  -- float8: numeric viraria texto no JSON da API.
                  CASE WHEN count(*) >= %(minimo)s
                       THEN round(100.0 * count(*) FILTER (WHERE f.confirmado)
                                  / count(*), 1)::float8
                  END                                    AS taxa_pct
             FROM feedback f
             JOIN consulta c          ON c.id = f.consulta_id
             JOIN canteiro ca         ON ca.id = c.canteiro_id
             JOIN consulta_hipotese h ON h.consulta_id = c.id AND h.posicao = 1
             JOIN doenca d            ON d.id = h.doenca_id
             JOIN cultura cu          ON cu.id = d.cultura_id
            WHERE ca.horta_id = %(horta)s
            GROUP BY d.id, d.nome, cu.nome
            ORDER BY taxa_pct ASC NULLS LAST, avaliadas DESC, d.nome""",
        {"horta": horta_id, "minimo": amostra_minima},
    )
    totais = banco.consultar_um(
        """SELECT count(*)                             AS consultas,
                  count(f.consulta_id)                 AS avaliadas,
                  count(*) FILTER (WHERE f.confirmado) AS confirmadas
             FROM consulta c
             JOIN canteiro ca ON ca.id = c.canteiro_id
             LEFT JOIN feedback f ON f.consulta_id = c.id
            WHERE ca.horta_id = %(horta)s""",
        {"horta": horta_id},
    )
    return {**totais, "linhas": linhas}


def sintomas(horta_id: int | None) -> dict:
    """Sintomas mais marcados por cultura (US29, secao 6.3).

    Com `horta_id`, so as consultas feitas nos canteiros daquela horta; com
    `None`, as de todo o sistema - o relatorio da curadoria. A rota decide
    quem ve cada recorte.

    Devolve duas listas, que a rota junta por cultura:

    - `culturas`: quantas consultas cada cultura teve e quantas doencas a base
      tem para ela. E a base da leitura "sintoma muito marcado numa cultura
      com poucas doencas cadastradas indica onde a base precisa crescer".
    - `linhas`: marcacoes por (cultura, sintoma), com quantas doencas DAQUELA
      cultura usam o sintoma no perfil. Sintoma muito marcado que poucas
      fichas usam e onde o diagnostico tem menos com que separar.
    """
    if horta_id is None:
        origem = "SELECT c.id, c.cultura_id FROM consulta c"
    else:
        origem = """SELECT c.id, c.cultura_id
                      FROM consulta c
                      JOIN canteiro ca ON ca.id = c.canteiro_id
                     WHERE ca.horta_id = %(horta)s"""
    parametros = {"horta": horta_id}

    culturas = banco.consultar(
        f"""WITH base AS ({origem})
            SELECT b.cultura_id, cu.nome AS cultura_nome,
                   count(*) AS consultas,
                   (SELECT count(*) FROM doenca d
                     WHERE d.cultura_id = b.cultura_id) AS doencas_cadastradas
              FROM base b
              JOIN cultura cu ON cu.id = b.cultura_id
             GROUP BY b.cultura_id, cu.nome
             ORDER BY consultas DESC, cu.nome""",
        parametros,
    )
    linhas = banco.consultar(
        f"""WITH base AS ({origem})
            SELECT b.cultura_id, s.id AS sintoma_id, s.nome AS sintoma_nome,
                   s.orgao_id,
                   count(*) AS marcacoes,
                   (SELECT count(*) FROM doenca_sintoma ds
                      JOIN doenca d ON d.id = ds.doenca_id
                     WHERE ds.sintoma_id = s.id
                       AND d.cultura_id = b.cultura_id) AS doencas_com_o_sintoma
              FROM base b
              JOIN consulta_sintoma cs ON cs.consulta_id = b.id
              JOIN sintoma s           ON s.id = cs.sintoma_id
             GROUP BY b.cultura_id, s.id, s.nome, s.orgao_id
             ORDER BY b.cultura_id, marcacoes DESC, s.nome""",
        parametros,
    )
    return {"culturas": culturas, "linhas": linhas}


# Os ciclos anteriores de um lugar: canteiros da mesma horta com a mesma
# identificacao, do mais recente para o mais antigo. O id e a ordem da
# sucessao (migracao 004).
_CICLOS_ANTERIORES = """
    SELECT ant.id, ant.cultura_id, cua.nome AS cultura_nome, cua.familia,
           ant.data_plantio, ant.ativo
      FROM canteiro ant
      JOIN cultura cua ON cua.id = ant.cultura_id
     WHERE ant.horta_id = {horta} AND ant.identificacao = {identificacao}
       AND {anteriores_a}
     ORDER BY ant.id DESC
     LIMIT %(ciclos)s"""


def rotacao(horta_id: int, ciclos: int) -> list[dict]:
    """Canteiros em cultivo que repetem a familia de um dos `ciclos` ciclos
    anteriores do mesmo lugar (US30, secao 6.4)."""
    anteriores = _CICLOS_ANTERIORES.format(
        horta="ca.horta_id", identificacao="ca.identificacao",
        anteriores_a="ant.id < ca.id")
    return banco.consultar(
        f"""SELECT ca.id AS canteiro_id, ca.identificacao,
                   cu.id AS cultura_id, cu.nome AS cultura_nome, cu.familia,
                   json_agg(json_build_object(
                       'cultura_nome', r.cultura_nome,
                       'data_plantio', r.data_plantio,
                       'ciclos_atras', r.ciclos_atras)
                     ORDER BY r.ciclos_atras) AS repeticoes
              FROM canteiro ca
              JOIN cultura cu ON cu.id = ca.cultura_id
              CROSS JOIN LATERAL (
                    SELECT a.*, row_number() OVER (ORDER BY a.id DESC) AS ciclos_atras
                      FROM ({anteriores}) a
              ) r
             WHERE ca.horta_id = %(horta)s AND ca.ativo
               AND r.familia = cu.familia
             GROUP BY ca.id, ca.identificacao, cu.id, cu.nome, cu.familia
             ORDER BY ca.identificacao""",
        {"horta": horta_id, "ciclos": ciclos},
    )


def ciclos_recentes(horta_id: int, identificacao: str, ciclos: int) -> list[dict]:
    """Os ultimos `ciclos` ciclos de um lugar, para avisar ANTES de cadastrar
    o canteiro novo nele. Inclui o que ainda esta ativo: e o ciclo anterior do
    que vai ser plantado, depois que ele encerrar."""
    return banco.consultar(
        _CICLOS_ANTERIORES.format(
            horta="%(horta)s", identificacao="%(identificacao)s",
            anteriores_a="TRUE"),
        {"horta": horta_id, "identificacao": identificacao, "ciclos": ciclos},
    )

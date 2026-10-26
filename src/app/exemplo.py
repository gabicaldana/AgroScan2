"""Carga de registros de exemplo: uma horta com historico conhecido.

Existe porque relatorio sobre base vazia nao demonstra nada (impedimento 1 da
Sprint 4). A carga cria uma conta de demonstracao, uma horta com canteiros em
sucessao, consultas ao longo de sete meses e feedbacks - o bastante para os
relatorios de incidencia (US27), taxa de confirmacao (US28) e alerta de
rotacao (US30) mostrarem alguma coisa na revisao.

O conjunto e FIXO, e e isso que o torna evidencia: `tests/test_relatorios_banco`
carrega exatamente estes registros e compara a saida de cada relatorio com a
contagem feita a mao, linha a linha, nas tabelas do proprio teste.

As hipoteses nao sao inventadas. Cada consulta marca os sintomas mais pesados
da doenca declarada, e o motor de diagnostico calcula o ranking - o mesmo que
o aparelho gravaria. Se a curadoria mudar a base a ponto de o motor nao
colocar mais a doenca declarada em primeiro, a carga para com erro, em vez de
gravar um historico que o app nunca produziria.

A carga e refeita do zero a cada execucao: apaga a horta e as consultas da
conta de demonstracao e grava tudo de novo, numa transacao so. Nao toca em
nenhuma outra conta. Precisa do catalogo ja carregado (`python -m app.seed`),
porque a consulta referencia a versao da base.

Rodar (com as variaveis no .env da raiz):
    python -m app.exemplo                   aplica no banco
    python -m app.exemplo --gerar-sql       escreve carga_exemplo.sql, para o
                                            SQL Editor do Neon

A senha da conta vem de SENHA_DEMONSTRACAO. Sem ela, a conta que ja existe
mantem a senha que tem, e uma conta nova recebe uma senha aleatoria, mostrada
uma vez no terminal. A senha nunca vai para o arquivo gerado, so a derivacao.
"""

import os
import secrets
import sys
import uuid
from datetime import date, datetime

from app import ambiente
from app.catalogo import RAIZ, catalogo
from app.diagnostico import diagnosticar

EMAIL = "demonstracao@agroscan.example"
NOME = "Conta de demonstração"

HORTA = {"nome": "Horta de demonstração", "municipio": "Brasília", "uf": "DF"}

# Na ordem em que foram cadastrados: o id e a ordem da sucessao (migracao 004).
# (chave, identificacao, cultura, plantio, ativo)
CANTEIROS = [
    ("c3_repolho", "Canteiro 3", "repolho", date(2026, 2, 2), False),
    ("c1_tomate", "Canteiro 1", "tomate", date(2026, 3, 2), False),
    ("c2_repolho", "Canteiro 2", "repolho", date(2026, 3, 9), False),
    ("estufa_tomate", "Estufa A", "tomate", date(2026, 4, 6), True),
    ("c3_tomate", "Canteiro 3", "tomate", date(2026, 5, 4), False),
    # Solanacea logo depois de solanacea: alerta.
    ("c1_pimentao", "Canteiro 1", "pimentao", date(2026, 7, 6), True),
    # Solanacea depois de brassicacea: sem alerta.
    ("c2_tomate", "Canteiro 2", "tomate", date(2026, 7, 13), True),
    # Brassicacea com um ciclo so de intervalo: alerta.
    ("c3_couve", "Canteiro 3", "couve", date(2026, 8, 17), True),
]

# (quando, canteiro, doenca principal, feedback)
# feedback: True confirmou, False nao confirmou, None nao avaliou.
# Hora de Brasilia de proposito: o relatorio agrupa pelo mes local.
CONSULTAS = [
    ("2026-04-14T09:00:00-03:00", "c1_tomate", "tomate_requeima", True),
    ("2026-04-20T09:00:00-03:00", "c2_repolho", "repolho_podridao_negra", True),
    ("2026-04-22T09:00:00-03:00", "c1_tomate", "tomate_requeima", True),
    ("2026-05-05T09:00:00-03:00", "c1_tomate", "tomate_pinta_preta", False),
    ("2026-05-11T09:00:00-03:00", "c2_repolho", "repolho_podridao_negra", True),
    ("2026-05-26T09:00:00-03:00", "estufa_tomate", "tomate_oidio", True),
    # 02:30 de 1/6 em UTC, e ainda maio em Brasilia: conta em maio.
    ("2026-05-31T23:30:00-03:00", "c1_tomate", "tomate_requeima", True),
    ("2026-06-02T09:00:00-03:00", "c1_tomate", "tomate_pinta_preta", True),
    ("2026-06-08T09:00:00-03:00", "c2_repolho", "repolho_alternariose", None),
    ("2026-06-10T09:00:00-03:00", None, "batata_requeima", True),
    ("2026-06-16T09:00:00-03:00", "c3_tomate", "tomate_requeima", True),
    ("2026-06-30T09:00:00-03:00", "c3_tomate", "tomate_requeima", False),
    ("2026-07-07T09:00:00-03:00", "c3_tomate", "tomate_pinta_preta", True),
    ("2026-07-21T09:00:00-03:00", "estufa_tomate", "tomate_requeima", True),
    ("2026-08-04T09:00:00-03:00", "c1_pimentao", "pimentao_mancha_bacteriana", True),
    ("2026-08-11T09:00:00-03:00", "estufa_tomate", "tomate_pinta_preta", False),
    ("2026-08-18T09:00:00-03:00", "c2_tomate", "tomate_requeima", None),
    ("2026-08-25T09:00:00-03:00", "c1_pimentao", "pimentao_mancha_bacteriana", None),
    ("2026-09-01T09:00:00-03:00", "c3_couve", "couve_alternariose", True),
    ("2026-09-08T09:00:00-03:00", "estufa_tomate", "tomate_pinta_preta", True),
    # Sem canteiro: e do caderno da pessoa, mas nao entra no relatorio da horta.
    ("2026-09-10T09:00:00-03:00", None, "tomate_requeima", True),
    ("2026-09-15T09:00:00-03:00", "c1_pimentao", "pimentao_antracnose", False),
    ("2026-09-22T09:00:00-03:00", "c2_tomate", "tomate_mancha_bacteriana", True),
    ("2026-09-29T09:00:00-03:00", "c3_couve", "couve_mildio", None),
    ("2026-10-06T09:00:00-03:00", "estufa_tomate", "tomate_oidio", None),
    ("2026-10-13T09:00:00-03:00", "c2_tomate", "tomate_requeima", True),
    ("2026-10-20T09:00:00-03:00", "c3_couve", "couve_alternariose", None),
]

# offline_id estavel entre execucoes: recarregar nao muda a identidade.
_ESPACO = uuid.UUID("6f1c2a3e-8d47-4b0a-9a51-2c7e0d5b9f10")


def _sintomas_que_levam_a(doenca_id: str) -> tuple[list[str], list]:
    """Os sintomas mais pesados da doenca, no menor conjunto que o motor
    resolve para ela em primeiro lugar, e as hipoteses que ele produz."""
    perfil = catalogo().perfil_por_doenca[doenca_id]
    cultura_id = catalogo().doenca_por_id[doenca_id]["cultura_id"]
    ordem = sorted(perfil, key=lambda s: (-perfil[s], s))

    for n in range(2, len(ordem) + 1):
        marcados = ordem[:n]
        hipoteses = diagnosticar(cultura_id, set(marcados))
        if hipoteses and hipoteses[0].doenca_id == doenca_id:
            return marcados, hipoteses

    raise SystemExit(
        f"o motor nao coloca {doenca_id} em primeiro com nenhum conjunto dos "
        f"sintomas dela - a base mudou; revise CONSULTAS em app/exemplo.py")


def montar() -> list[dict]:
    """As consultas prontas para gravar, conferidas contra a base."""
    cultura_do_canteiro = {chave: cultura for chave, _, cultura, _, _ in CANTEIROS}
    consultas = []
    for numero, (quando, canteiro, doenca_id, feedback) in enumerate(CONSULTAS):
        cultura_id = catalogo().doenca_por_id[doenca_id]["cultura_id"]
        if canteiro is not None and cultura_do_canteiro[canteiro] != cultura_id:
            raise SystemExit(
                f"consulta {numero}: {doenca_id} nao e doenca da cultura do "
                f"canteiro {canteiro}")
        sintomas, hipoteses = _sintomas_que_levam_a(doenca_id)
        consultas.append({
            "offline_id": str(uuid.uuid5(_ESPACO, f"consulta-{numero}")),
            "registrada_em": datetime.fromisoformat(quando),
            "canteiro": canteiro,
            "cultura_id": cultura_id,
            "sintomas": sintomas,
            "hipoteses": [(h.doenca_id, round(h.compatibilidade, 5))
                          for h in hipoteses],
            "feedback": feedback,
        })
    return consultas


def _literal(valor) -> str:
    if valor is None:
        return "NULL"
    if isinstance(valor, bool):
        return "TRUE" if valor else "FALSE"
    if isinstance(valor, (int, float)):
        return repr(valor)
    if isinstance(valor, (date, datetime)):
        return "'" + valor.isoformat() + "'"
    return "'" + str(valor).replace("'", "''") + "'"


def gerar_sql(senha_hash: str | None, transacao: bool = True) -> str:
    """O script inteiro da carga: um bloco DO.

    Um texto so para os dois caminhos - aplicar pela conexao ou colar no SQL
    Editor do Neon -, para que o que se testa seja o que vai para o banco.
    `senha_hash` None mantem a senha de uma conta que ja existe. Sem
    `transacao`, quem chama abre e confirma a sua.
    """
    L = _literal
    versao = catalogo().versao
    consultas = montar()
    linhas = [
        "-- GERADO por `python -m app.exemplo --gerar-sql`. Nao editar a mao.",
        f"-- Registros de exemplo sobre a base {versao}. Refaz a horta e as",
        f"-- consultas da conta {EMAIL}; nao toca em nenhuma outra conta.",
        "",
    ]
    if transacao:
        linhas += ["BEGIN;", ""]
    linhas += [
        "DO $carga$",
        "DECLARE",
        "    uid BIGINT;",
        "    hid BIGINT;",
        "    cid BIGINT;",
        "    canteiro JSONB := '{}';",
        "BEGIN",
        "    IF NOT EXISTS (SELECT 1 FROM versao_catalogo",
        f"                    WHERE versao = {L(versao)}) THEN",
        f"        RAISE EXCEPTION 'catalogo {versao} ausente: rode python -m app.seed antes';",
        "    END IF;",
        "",
        f"    SELECT id INTO uid FROM usuario WHERE email = {L(EMAIL)};",
        "    IF uid IS NULL THEN",
    ]
    if senha_hash is None:
        linhas.append(
            "        RAISE EXCEPTION 'a conta de demonstracao nao existe: "
            "defina SENHA_DEMONSTRACAO';")
    else:
        linhas += [
            "        INSERT INTO usuario (nome, email, senha_hash)",
            f"        VALUES ({L(NOME)}, {L(EMAIL)}, {L(senha_hash)})",
            "        RETURNING id INTO uid;",
            "    ELSE",
            f"        UPDATE usuario SET senha_hash = {L(senha_hash)} WHERE id = uid;",
        ]
    linhas += [
        "    END IF;",
        "",
        "    -- Do zero: canteiros e manejos vao com a horta (CASCADE), sintomas,",
        "    -- hipoteses e feedbacks com a consulta.",
        "    DELETE FROM horta WHERE responsavel_id = uid;",
        "    DELETE FROM consulta WHERE usuario_id = uid;",
        "",
        "    INSERT INTO horta (nome, municipio, uf, responsavel_id)",
        f"    VALUES ({L(HORTA['nome'])}, {L(HORTA['municipio'])}, "
        f"{L(HORTA['uf'])}, uid)",
        "    RETURNING id INTO hid;",
        "    INSERT INTO membro_horta (horta_id, usuario_id, papel)",
        "    VALUES (hid, uid, 'responsavel');",
        "",
    ]
    for chave, identificacao, cultura, plantio, ativo in CANTEIROS:
        linhas += [
            "    INSERT INTO canteiro (horta_id, identificacao, cultura_id, "
            "data_plantio, ativo)",
            f"    VALUES (hid, {L(identificacao)}, {L(cultura)}, {L(plantio)}, "
            f"{L(ativo)})",
            "    RETURNING id INTO cid;",
            f"    canteiro := canteiro || jsonb_build_object({L(chave)}, cid);",
        ]
    linhas.append("")

    for c in consultas:
        canteiro = (f"(canteiro ->> {L(c['canteiro'])})::bigint"
                    if c["canteiro"] else "NULL")
        linhas += [
            "    INSERT INTO consulta (offline_id, usuario_id, canteiro_id, "
            "cultura_id, registrada_em, versao_catalogo)",
            f"    VALUES ({L(c['offline_id'])}, uid, {canteiro}, "
            f"{L(c['cultura_id'])}, {L(c['registrada_em'])}, {L(versao)})",
            "    RETURNING id INTO cid;",
        ]
        valores = ", ".join(f"(cid, {L(s)})" for s in c["sintomas"])
        linhas.append(
            f"    INSERT INTO consulta_sintoma (consulta_id, sintoma_id) "
            f"VALUES {valores};")
        valores = ", ".join(
            f"(cid, {L(d)}, {posicao}, {compat})"
            for posicao, (d, compat) in enumerate(c["hipoteses"], start=1))
        linhas.append(
            "    INSERT INTO consulta_hipotese (consulta_id, doenca_id, posicao, "
            f"compatibilidade) VALUES {valores};")
        if c["feedback"] is not None:
            linhas.append(
                "    INSERT INTO feedback (consulta_id, usuario_id, confirmado) "
                f"VALUES (cid, uid, {L(c['feedback'])});")
    linhas += ["END", "$carga$;", ""]
    if transacao:
        linhas += ["COMMIT;", ""]
    return "\n".join(linhas)


def main(argv: list[str] | None = None) -> None:
    # Importado aqui, e nao no topo: montar as consultas, que o teste usa,
    # roda sem as dependencias do back-end.
    from app.api.seguranca import hash_senha

    argumentos = set(argv if argv is not None else sys.argv[1:])
    ambiente.carregar()
    senha = os.environ.get("SENHA_DEMONSTRACAO")
    senha_hash = hash_senha(senha) if senha else None

    if "--gerar-sql" in argumentos:
        if senha_hash is None:
            print("SENHA_DEMONSTRACAO nao definida: o arquivo so funciona se a "
                  "conta de demonstracao ja existir no banco.")
        destino = RAIZ / "carga_exemplo.sql"
        destino.write_text(gerar_sql(senha_hash), encoding="utf-8", newline="\n")
        print(f"SQL gerado em {destino}")
        print("Cole no editor SQL do Neon (Console -> SQL Editor) e execute.")
        return

    from app.seed import _conectar

    con = _conectar()
    try:
        existe = con.execute(
            "SELECT 1 FROM usuario WHERE email = %s", (EMAIL,)).fetchone()
        gerada = None
        if senha_hash is None and not existe:
            gerada = secrets.token_urlsafe(12)
            senha_hash = hash_senha(gerada)

        con.execute(gerar_sql(senha_hash, transacao=False))
        con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()

    com_canteiro = sum(1 for c in CONSULTAS if c[1])
    print(f"exemplo carregado: 1 horta, {len(CANTEIROS)} canteiros, "
          f"{len(CONSULTAS)} consultas ({com_canteiro} na horta), "
          f"{sum(1 for c in CONSULTAS if c[3] is not None)} feedbacks")
    print(f"conta: {EMAIL}")
    if gerada:
        print(f"senha gerada agora (anote, nao aparece de novo): {gerada}")


if __name__ == "__main__":
    main()

"""Aplica as migracoes e carrega o catalogo curado no PostgreSQL.

Duas responsabilidades, de proposito no mesmo lugar: as duas so fazem sentido
juntas. Um banco com o esquema aplicado e sem catalogo nao responde nada, e
carregar catalogo num esquema desatualizado quebra.

O catalogo e CARREGADO, nunca escrito a mao. Ninguem digita um `INSERT` de
doenca: a fonte da verdade e data/base_conhecimento.json, validado antes de
qualquer escrita. Um `INSERT` manual criaria uma segunda fonte da verdade que
diverge da primeira no dia seguinte.

A carga e idempotente (`ON CONFLICT ... DO UPDATE`): rodar duas vezes deixa o
banco no mesmo estado. Isso importa porque o seed roda no CI, em cada ambiente
novo, e toda vez que a curadoria avanca.

Rodar (com as variaveis no .env da raiz):
    python -m app.seed --conferir           so testa a conexao, nao escreve
    python -m app.seed                      migracoes + catalogo
    python -m app.seed --apenas-migracoes
    python -m app.seed --apenas-catalogo
"""

import hashlib
import json
import os
import re
import sys
from pathlib import Path

from app import ambiente
from app.catalogo import (
    CAMINHO_JSON,
    ORDEM_DO_TRATAMENTO,
    RAIZ,
    carregar_json,
)
from app.validacao import validar

DIRETORIO_MIGRACOES = RAIZ / "migracoes"

# O enum `tipo_agente` do banco usa rotulos ASCII; a base curada escreve em
# portugues com acento. A traducao mora aqui, num lugar so.
#
# Por que nao acentuar o enum: rotulo de enum e identificador de esquema, lido
# em `psql`, em dump e em log. Manter ASCII evita depender da codificacao do
# terminal de quem for operar o banco. O texto que o usuario le vem da base,
# nunca do enum.
TIPO_AGENTE_NO_BANCO = {
    "fungo": "fungo",
    "oomiceto": "oomiceto",
    "bactéria": "bacteria",
    "vírus": "virus",
    "nematoide": "nematoide",
    "ácaro": "acaro",
    "abiótico": "abiotico",
    "inseto": "acaro",  # praga com o mesmo tratamento de artropode na ficha
}


def _conectar(url: str | None = None):
    import psycopg

    ambiente.carregar()

    # Migracao e DDL: exige conexao DIRETA. O pooling em modo transacao da
    # Neon/Supabase nao sustenta `CREATE TYPE` nem transacao longa.
    destino = url or os.environ.get("DATABASE_URL_DIRETA") or os.environ.get(
        "DATABASE_URL")
    if not destino:
        raise SystemExit(
            "Defina DATABASE_URL_DIRETA (string NAO-pooled) para aplicar "
            "migracoes e carregar o catalogo.")
    # 10s: o suficiente para o compute do Neon acordar, curto o bastante para
    # nao parecer travamento quando a porta 5432 esta bloqueada pela rede.
    return psycopg.connect(destino, autocommit=False, connect_timeout=10)


def migracoes_disponiveis() -> list[tuple[int, str, Path]]:
    """Os arquivos `NNN_nome.sql`, em ordem, sem os pares de reversao."""
    encontradas = []
    for caminho in sorted(DIRETORIO_MIGRACOES.glob("*.sql")):
        if caminho.stem.endswith("_reverter"):
            continue
        casa = re.match(r"^(\d{3})_(.+)$", caminho.stem)
        if not casa:
            raise SystemExit(f"nome fora do padrao NNN_nome.sql: {caminho.name}")
        encontradas.append((int(casa.group(1)), casa.group(2), caminho))
    return encontradas


def aplicar_migracoes(con) -> list[int]:
    """Aplica o que falta, em ordem, e registra. Nao reaplica nem pula."""
    pendentes = migracoes_disponiveis()
    if not pendentes:
        raise SystemExit("nenhuma migracao encontrada em migracoes/")

    # A 000 cria a propria tabela de controle, entao ela roda antes de
    # qualquer consulta ao registro.
    numero, nome, caminho = pendentes[0]
    if numero != 0:
        raise SystemExit("a migracao 000 (controle) precisa existir")
    con.execute(caminho.read_text(encoding="utf-8"))

    ja = {
        linha[0]
        for linha in con.execute("SELECT numero FROM migracao_aplicada").fetchall()
    }

    aplicadas = []
    for numero, nome, caminho in pendentes[1:]:
        if numero in ja:
            continue
        con.execute(caminho.read_text(encoding="utf-8"))
        con.execute(
            "INSERT INTO migracao_aplicada (numero, nome) VALUES (%s, %s)",
            (numero, nome),
        )
        aplicadas.append(numero)

    return aplicadas


def checksum_da_base(caminho: Path | None = None) -> str:
    """SHA-256 do arquivo curado, byte a byte.

    Vai para `versao_catalogo`: e o que permite provar depois que a versao
    gravada numa consulta corresponde a este conteudo, e nao a outro que foi
    publicado com o mesmo numero.
    """
    dados = (caminho or CAMINHO_JSON).read_bytes()
    return hashlib.sha256(dados).hexdigest()


def carregar_catalogo(con, base: dict) -> dict[str, int]:
    """Carrega orgaos, culturas, sintomas e doencas. Idempotente."""
    con.execute(
        """INSERT INTO versao_catalogo (versao, checksum_sha256, notas)
           VALUES (%s, %s, %s)
           ON CONFLICT (versao) DO UPDATE
             SET checksum_sha256 = EXCLUDED.checksum_sha256,
                 notas           = EXCLUDED.notas""",
        (base["versao"], checksum_da_base(),
         f"carga automatica de {CAMINHO_JSON.name}"),
    )

    for o in base["orgaos"]:
        con.execute(
            """INSERT INTO orgao (id, rotulo, ordem) VALUES (%s, %s, %s)
               ON CONFLICT (id) DO UPDATE
                 SET rotulo = EXCLUDED.rotulo, ordem = EXCLUDED.ordem""",
            (o["id"], o["rotulo"], o["ordem"]),
        )

    for s in base["sintomas"]:
        con.execute(
            """INSERT INTO sintoma (id, nome, orgao_id) VALUES (%s, %s, %s)
               ON CONFLICT (id) DO UPDATE
                 SET nome = EXCLUDED.nome, orgao_id = EXCLUDED.orgao_id""",
            (s["id"], s["nome"], s["orgao"]),
        )

    n_doencas = 0
    for c in base["culturas"]:
        con.execute(
            """INSERT INTO cultura
                   (id, nome, nome_cientifico, grupo, familia, emoji, ciclo_dias)
               VALUES (%s, %s, %s, %s, %s, %s, %s)
               ON CONFLICT (id) DO UPDATE
                 SET nome            = EXCLUDED.nome,
                     nome_cientifico = EXCLUDED.nome_cientifico,
                     grupo           = EXCLUDED.grupo,
                     familia         = EXCLUDED.familia,
                     emoji           = EXCLUDED.emoji,
                     ciclo_dias      = EXCLUDED.ciclo_dias""",
            (c["id"], c["nome"], c["nome_cientifico"], c["grupo"],
             c["familia"], c.get("emoji"), c.get("ciclo_dias")),
        )

        for d in c["doencas"]:
            cond = d["condicoes_favoraveis"]
            tipo = TIPO_AGENTE_NO_BANCO.get(d["tipo_agente"])
            if tipo is None:
                raise SystemExit(
                    f"doenca {d['id']}: tipo_agente '{d['tipo_agente']}' nao "
                    f"tem correspondente no enum do banco")

            con.execute(
                """INSERT INTO doenca
                       (id, cultura_id, nome, agente, tipo_agente, gravidade,
                        descricao, condicao_temperatura, condicao_umidade,
                        condicao_observacao)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (id) DO UPDATE
                     SET cultura_id           = EXCLUDED.cultura_id,
                         nome                 = EXCLUDED.nome,
                         agente               = EXCLUDED.agente,
                         tipo_agente          = EXCLUDED.tipo_agente,
                         gravidade            = EXCLUDED.gravidade,
                         descricao            = EXCLUDED.descricao,
                         condicao_temperatura = EXCLUDED.condicao_temperatura,
                         condicao_umidade     = EXCLUDED.condicao_umidade,
                         condicao_observacao  = EXCLUDED.condicao_observacao""",
                (d["id"], c["id"], d["nome"], d["agente"], tipo, d["gravidade"],
                 d["descricao"], cond["temperatura"], cond["umidade"],
                 cond["observacao"]),
            )
            n_doencas += 1

            # Perfil, tratamentos e ingredientes sao substituidos por inteiro.
            # Atualizar em vez de trocar deixaria orfao o sintoma que a
            # curadoria removeu da ficha - e o perfil e o coracao do motor.
            con.execute("DELETE FROM doenca_sintoma WHERE doenca_id = %s",
                        (d["id"],))
            for s in d["sintomas"]:
                con.execute(
                    "INSERT INTO doenca_sintoma (doenca_id, sintoma_id, peso)"
                    " VALUES (%s, %s, %s)",
                    (d["id"], s["id"], s["peso"]),
                )

            con.execute("DELETE FROM tratamento WHERE doenca_id = %s", (d["id"],))
            # `ordem` por tipo preserva a sequencia curada dentro de cada bloco,
            # que e o que a tela apresenta.
            posicao: dict[str, int] = {}
            for t in sorted(
                d["tratamentos"],
                key=lambda t: ORDEM_DO_TRATAMENTO.get(t["tipo"], 4),
            ):
                posicao[t["tipo"]] = posicao.get(t["tipo"], 0) + 1
                con.execute(
                    "INSERT INTO tratamento (doenca_id, tipo, descricao, ordem)"
                    " VALUES (%s, %s, %s, %s)",
                    (d["id"], t["tipo"], t["descricao"], posicao[t["tipo"]]),
                )

            con.execute("DELETE FROM ingrediente_ativo WHERE doenca_id = %s",
                        (d["id"],))
            for i in d["ingredientes_ativos"]:
                con.execute(
                    "INSERT INTO ingrediente_ativo (doenca_id, nome, grupo, acao)"
                    " VALUES (%s, %s, %s, %s)",
                    (d["id"], i["nome"], i.get("grupo"), i.get("acao")),
                )

    return {
        "culturas": len(base["culturas"]),
        "doencas": n_doencas,
        "sintomas": len(base["sintomas"]),
    }


def conferir() -> None:
    """Testa a conexao e relata o estado, sem escrever nada.

    Existe para separar dois problemas que se parecem na tela: string de
    conexao errada e migracao que falhou. Sem isto, os dois aparecem como um
    traceback no meio da carga.
    """
    ambiente.carregar()

    direta = os.environ.get("DATABASE_URL_DIRETA")
    pooled = os.environ.get("DATABASE_URL")

    print(f"DATABASE_URL_DIRETA .. {'definida' if direta else 'AUSENTE'}")
    print(f"DATABASE_URL ......... {'definida' if pooled else 'AUSENTE'}")

    if direta and pooled and "-pooler" in direta:
        print("\n  ATENCAO: DATABASE_URL_DIRETA tem '-pooler' no host. Essa e a")
        print("  string POOLED, e DDL nao sobrevive a transaction pooling.")
        print("  Troque pela conexao direta no painel da Neon.")

    if not direta:
        raise SystemExit("\nDefina DATABASE_URL_DIRETA no .env para conferir.")

    con = _conectar()
    try:
        versao = con.execute("SELECT version()").fetchone()[0]
        print(f"\nconectou: {versao.split(',')[0]}")

        tabelas = con.execute(
            """SELECT count(*) FROM information_schema.tables
                WHERE table_schema = 'public'"""
        ).fetchone()[0]
        print(f"tabelas no schema public: {tabelas}")

        if tabelas:
            try:
                aplicadas = con.execute(
                    "SELECT numero, nome FROM migracao_aplicada ORDER BY numero"
                ).fetchall()
                print(f"migracoes registradas: "
                      f"{[f'{n:03d}_{nome}' for n, nome in aplicadas] or 'nenhuma'}")
            except Exception:
                con.rollback()
                print("migracoes registradas: tabela de controle ainda nao existe")
        else:
            print("banco vazio - rode `python -m app.seed` para criar o esquema")
    finally:
        con.close()


def _literal(valor) -> str:
    """Valor Python -> literal SQL. Aspas simples dobradas, None vira NULL."""
    if valor is None:
        return "NULL"
    if isinstance(valor, bool):
        return "TRUE" if valor else "FALSE"
    if isinstance(valor, (int, float)):
        return repr(valor)
    return "'" + str(valor).replace("'", "''") + "'"


def gerar_sql(base: dict, destino: Path) -> None:
    """Escreve esquema + catalogo num arquivo .sql unico.

    Existe porque nem toda rede deixa sair trafego PostgreSQL: firewall
    institucional costuma bloquear a porta 5432 e liberar so a 443. Sem isto,
    quem esta atras de uma rede assim nao consegue preparar o banco de lugar
    nenhum - e o editor SQL do Neon, que roda no navegador, resolve.

    O conteudo e o MESMO que `carregar_catalogo` aplica; muda so o transporte.
    Continua sendo gerado a partir do JSON curado, nunca escrito a mao.
    """
    L = _literal
    partes: list[str] = [
        "-- GERADO por `python -m app.seed --gerar-sql`. Nao editar a mao.",
        f"-- Base {base['versao']} - checksum {checksum_da_base()}",
        "--",
        "-- Cole no editor SQL do Neon (Console -> SQL Editor) e execute.",
        "-- Idempotente: rodar duas vezes deixa o banco no mesmo estado.",
        "",
        "BEGIN;",
        "",
    ]

    for numero, nome, caminho in migracoes_disponiveis():
        partes.append(f"-- ===== migracao {numero:03d}_{nome} =====")
        partes.append(caminho.read_text(encoding="utf-8"))
        if numero > 0:
            partes.append(
                f"INSERT INTO migracao_aplicada (numero, nome) "
                f"VALUES ({numero}, {L(nome)}) "
                f"ON CONFLICT (numero) DO NOTHING;")
        partes.append("")

    partes.append("-- ===== catalogo curado =====")
    partes.append(
        f"INSERT INTO versao_catalogo (versao, checksum_sha256, notas) VALUES "
        f"({L(base['versao'])}, {L(checksum_da_base())}, "
        f"{L('carga via --gerar-sql')}) "
        f"ON CONFLICT (versao) DO UPDATE SET "
        f"checksum_sha256 = EXCLUDED.checksum_sha256, notas = EXCLUDED.notas;")

    for o in base["orgaos"]:
        partes.append(
            f"INSERT INTO orgao (id, rotulo, ordem) VALUES "
            f"({L(o['id'])}, {L(o['rotulo'])}, {o['ordem']}) "
            f"ON CONFLICT (id) DO UPDATE SET rotulo = EXCLUDED.rotulo, "
            f"ordem = EXCLUDED.ordem;")

    for sintoma in base["sintomas"]:
        partes.append(
            f"INSERT INTO sintoma (id, nome, orgao_id) VALUES "
            f"({L(sintoma['id'])}, {L(sintoma['nome'])}, "
            f"{L(sintoma['orgao'])}) "
            f"ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, "
            f"orgao_id = EXCLUDED.orgao_id;")

    for c in base["culturas"]:
        partes.append(
            f"INSERT INTO cultura (id, nome, nome_cientifico, grupo, familia, "
            f"emoji, ciclo_dias) VALUES ({L(c['id'])}, "
            f"{L(c['nome'])}, {L(c['nome_cientifico'])}, "
            f"{L(c['grupo'])}, {L(c['familia'])}, "
            f"{L(c.get('emoji'))}, {L(c.get('ciclo_dias'))}) "
            f"ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, "
            f"nome_cientifico = EXCLUDED.nome_cientifico, "
            f"grupo = EXCLUDED.grupo, familia = EXCLUDED.familia, "
            f"emoji = EXCLUDED.emoji, ciclo_dias = EXCLUDED.ciclo_dias;")

        for d in c["doencas"]:
            cond = d["condicoes_favoraveis"]
            tipo = TIPO_AGENTE_NO_BANCO[d["tipo_agente"]]
            partes.append(
                f"INSERT INTO doenca (id, cultura_id, nome, agente, "
                f"tipo_agente, gravidade, descricao, condicao_temperatura, "
                f"condicao_umidade, condicao_observacao) VALUES "
                f"({L(d['id'])}, {L(c['id'])}, "
                f"{L(d['nome'])}, {L(d['agente'])}, "
                f"{L(tipo)}, {d['gravidade']}, "
                f"{L(d['descricao'])}, "
                f"{L(cond['temperatura'])}, "
                f"{L(cond['umidade'])}, "
                f"{L(cond['observacao'])}) "
                f"ON CONFLICT (id) DO UPDATE SET "
                f"cultura_id = EXCLUDED.cultura_id, nome = EXCLUDED.nome, "
                f"agente = EXCLUDED.agente, tipo_agente = EXCLUDED.tipo_agente, "
                f"gravidade = EXCLUDED.gravidade, "
                f"descricao = EXCLUDED.descricao, "
                f"condicao_temperatura = EXCLUDED.condicao_temperatura, "
                f"condicao_umidade = EXCLUDED.condicao_umidade, "
                f"condicao_observacao = EXCLUDED.condicao_observacao;")

            partes.append(
                f"DELETE FROM doenca_sintoma WHERE doenca_id = {L(d['id'])};")
            for sp in d["sintomas"]:
                partes.append(
                    f"INSERT INTO doenca_sintoma (doenca_id, sintoma_id, peso) "
                    f"VALUES ({L(d['id'])}, {L(sp['id'])}, {sp['peso']});")

            partes.append(
                f"DELETE FROM tratamento WHERE doenca_id = {L(d['id'])};")
            posicao: dict[str, int] = {}
            for t in sorted(d["tratamentos"],
                            key=lambda t: ORDEM_DO_TRATAMENTO.get(t["tipo"], 4)):
                posicao[t["tipo"]] = posicao.get(t["tipo"], 0) + 1
                partes.append(
                    f"INSERT INTO tratamento (doenca_id, tipo, descricao, ordem) "
                    f"VALUES ({L(d['id'])}, {L(t['tipo'])}, "
                    f"{L(t['descricao'])}, {posicao[t['tipo']]});")

            partes.append(
                f"DELETE FROM ingrediente_ativo WHERE doenca_id = {L(d['id'])};")
            for i in d["ingredientes_ativos"]:
                partes.append(
                    f"INSERT INTO ingrediente_ativo (doenca_id, nome, grupo, "
                    f"acao) VALUES ({L(d['id'])}, {L(i['nome'])}, "
                    f"{L(i.get('grupo'))}, {L(i.get('acao'))});")

    partes.append("")
    partes.append("COMMIT;")
    partes.append("")

    destino.write_text(chr(10).join(partes), encoding="utf-8", newline=chr(10))


def main(argv: list[str] | None = None) -> None:
    argumentos = set(argv if argv is not None else sys.argv[1:])

    if "--conferir" in argumentos:
        conferir()
        return

    if "--gerar-sql" in argumentos:
        base = carregar_json()
        validar(base)
        destino = RAIZ / "carga_catalogo.sql"
        gerar_sql(base, destino)
        n = destino.read_text(encoding="utf-8").count(chr(10))
        print(f"SQL gerado em {destino} ({n} linhas)")
        print("Cole no editor SQL do Neon (Console -> SQL Editor) e execute.")
        return


    so_migracoes = "--apenas-migracoes" in argumentos
    so_catalogo = "--apenas-catalogo" in argumentos

    base = carregar_json()
    avisos = validar(base)

    con = _conectar()
    try:
        if not so_catalogo:
            aplicadas = aplicar_migracoes(con)
            print(f"migracoes aplicadas agora: {aplicadas or 'nenhuma (ja estava em dia)'}")

        if not so_migracoes:
            n = carregar_catalogo(con, base)
            print(f"catalogo {base['versao']} carregado: "
                  f"{n['culturas']} hortalicas, {n['doencas']} doencas, "
                  f"{n['sintomas']} sintomas")
        con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()

    if avisos and not so_migracoes:
        print(f"\n{len(avisos)} aviso(s) de curadoria incompleta:")
        for a in avisos:
            print(f"  - {a}")


if __name__ == "__main__":
    main()

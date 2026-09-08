"""Validacao da base de conhecimento curada.

O JSON e escrito a mao, e um id de sintoma com erro de digitacao passaria
despercebido: sumiria do perfil da doenca e o diagnostico ficaria
silenciosamente errado. Aqui isso vira erro na hora.

A validacao distingue dois niveis:

  ERRO   impede a carga. E o que torna a base incoerente: referencia quebrada,
         peso fora da faixa, doenca sem sintoma classico.
  AVISO  nao impede, mas aponta curadoria incompleta. Uma cultura com menos de
         tres doencas funciona, mas o motor nunca tem segunda hipotese nela e a
         pergunta de desempate deixa de existir. Sao avisos enquanto a curadoria
         das hortalicas esta em andamento; viram erro quando ela fechar.

Rodar:  python -m app.validacao
"""

from app.catalogo import RAIZ, CAMINHO_JSON, carregar_json

# Classificacao da Embrapa por parte comestivel. 'raiz' cobre raizes,
# tuberculos, bulbos e rizomas.
GRUPOS = {"fruto", "folha", "flor", "haste", "raiz"}

# Quantas doencas uma cultura precisa para que o motor consiga oferecer
# hipotese alternativa. Abaixo disso `melhor_pergunta` nao tem o que perguntar.
MINIMO_DE_DOENCAS = 3

class BaseInvalida(Exception):
    """A base de conhecimento tem um erro que impede a carga."""


def validar(base: dict) -> list[str]:
    """Checa a integridade da base antes de qualquer escrita.

    Levanta BaseInvalida com todos os erros de uma vez - corrigir um por rodada
    seria insuportavel numa base curada a mao. Devolve a lista de avisos, que
    apontam curadoria incompleta sem impedir a carga.
    """
    erros: list[str] = []
    avisos: list[str] = []

    ids_orgaos = {o["id"] for o in base["orgaos"]}
    ids_sintomas: set[str] = set()

    for s in base["sintomas"]:
        if s["id"] in ids_sintomas:
            erros.append(f"sintoma duplicado: {s['id']}")
        ids_sintomas.add(s["id"])
        if s["orgao"] not in ids_orgaos:
            erros.append(f"sintoma {s['id']}: orgao inexistente '{s['orgao']}'")

    ids_doencas: set[str] = set()
    sintomas_usados: set[str] = set()
    ids_culturas: set[str] = set()

    for cultura in base["culturas"]:
        cid = cultura["id"]
        if cid in ids_culturas:
            erros.append(f"cultura duplicada: {cid}")
        ids_culturas.add(cid)

        if cultura.get("grupo") not in GRUPOS:
            erros.append(
                f"cultura {cid}: grupo '{cultura.get('grupo')}' invalido. "
                f"Esperado um de {sorted(GRUPOS)}")
        if not cultura.get("familia"):
            erros.append(f"cultura {cid}: sem familia botanica")

        if len(cultura["doencas"]) < MINIMO_DE_DOENCAS:
            avisos.append(
                f"cultura {cid}: {len(cultura['doencas'])} doenca(s). Abaixo de "
                f"{MINIMO_DE_DOENCAS} o motor nunca tem segunda hipotese, e a "
                f"pergunta de desempate nao funciona nesta cultura")

        for d in cultura["doencas"]:
            if d["id"] in ids_doencas:
                erros.append(f"doenca duplicada: {d['id']}")
            ids_doencas.add(d["id"])

            if not d["sintomas"]:
                erros.append(f"doenca {d['id']}: nenhum sintoma no perfil")

            vistos: set[str] = set()
            for s in d["sintomas"]:
                if s["id"] not in ids_sintomas:
                    erros.append(
                        f"doenca {d['id']}: sintoma inexistente '{s['id']}'")
                if s["id"] in vistos:
                    erros.append(
                        f"doenca {d['id']}: sintoma repetido '{s['id']}'")
                vistos.add(s["id"])
                sintomas_usados.add(s["id"])
                if not 0 < s["peso"] <= 1:
                    erros.append(
                        f"doenca {d['id']}/{s['id']}: peso fora de (0, 1]")

            if not any(s["peso"] == 1.0 for s in d["sintomas"]):
                erros.append(
                    f"doenca {d['id']}: nenhum sintoma de peso 1.0. Toda "
                    f"doenca precisa de um sintoma classico, senao nunca "
                    f"alcanca compatibilidade alta")

            # Manejo integrado comeca pela medida cultural, e a interface
            # apresenta nessa ordem. Ficha que so oferece defensivo empurra
            # para a pulverizacao como primeira resposta.
            if not any(t["tipo"] == "cultural" for t in d["tratamentos"]):
                avisos.append(
                    f"doenca {d['id']}: sem tratamento do tipo cultural")

    orfaos = ids_sintomas - sintomas_usados
    if orfaos:
        erros.append(
            f"sintomas no catalogo que nenhuma doenca usa: {sorted(orfaos)}")

    if erros:
        raise BaseInvalida(
            f"{len(erros)} problema(s) na base de conhecimento:\n  - "
            + "\n  - ".join(erros))

    return avisos



def main() -> None:
    base = carregar_json()
    avisos = validar(base)

    culturas = base["culturas"]
    doencas = sum(len(c["doencas"]) for c in culturas)
    grupos: dict[str, list[str]] = {}
    for c in culturas:
        grupos.setdefault(c["grupo"], []).append(c["id"])

    print(f"Base valida - versao {base['versao']}")
    print(f"  {len(culturas)} hortalicas, {doencas} doencas, "
          f"{len(base['sintomas'])} sintomas no catalogo")
    for g in sorted(grupos):
        print(f"    {g:6} {', '.join(sorted(grupos[g]))}")

    if avisos:
        print()
        print(f"  {len(avisos)} aviso(s) de curadoria incompleta:")
        for a in avisos:
            print(f"    - {a}")


if __name__ == "__main__":
    main()

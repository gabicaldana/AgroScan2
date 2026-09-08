"""Gera as fixtures compartilhadas entre o motor Python e o porte TypeScript.

O Python e a implementacao de referencia. Este modulo roda o motor sobre um
conjunto fixo de casos e grava entrada + saida esperada num JSON versionado.
A partir dai:

  - o teste Python (tests/test_diagnostico.py) confere que o motor ainda
    produz exatamente esse arquivo, entao a fixture nunca envelhece em
    silencio: mudou o motor ou a base, o teste quebra e o arquivo tem que
    ser regerado de proposito;
  - o teste TypeScript (web/lib/diagnostico.test.ts) le o MESMO arquivo e
    exige que o porte reproduza cada campo. Nao precisa de Python instalado
    para rodar.

E por isso que as duas implementacoes nao podem divergir sem que alguem veja.

Os casos sao de dois tipos. Os escolhidos a mao cobrem o comportamento que
importa (ruido, ambiguidade, desempate, limiar). A varredura automatica cobre
TODAS as doencas da base - hoje 44 - com perfil completo e sintoma isolado de
cada uma. Uma mudanca de peso em qualquer doenca aparece em pelo menos um
caso, e uma cultura nova entra na varredura sozinha, sem editar este arquivo.

Rodar:  python -m app.fixtures
"""

import json
from dataclasses import asdict

from app.db import RAIZ, carregar_json
from app.diagnostico import (
    detalhar_doenca,
    diagnosticar,
    listar_culturas,
    listar_sintomas_da_cultura,
    melhor_pergunta,
)

CAMINHO_FIXTURES = RAIZ / "tests" / "fixtures" / "casos_diagnostico.json"

# Casos escolhidos a mao: cada um existe por causa de um comportamento
# especifico do motor, nomeado no proprio caso.
CASOS_MANUAIS: list[tuple[str, str, list[str]]] = [
    ("sintoma classico isolado", "tomate", ["manchas_escuras_aneis"]),
    ("quadro classico completo", "tomate",
     ["manchas_escuras_aneis", "desfolha_baixo_para_cima"]),
    ("sintoma inespecifico gera muitas hipoteses fracas", "tomate",
     ["manchas_amareladas"]),
    ("ruido derruba a pontuacao", "tomate",
     ["manchas_escuras_aneis", "po_branco_superficie"]),
    ("par classicamente confundido: pinta-preta x mancha-alvo", "tomate",
     ["manchas_escuras_aneis", "lesoes_no_caule"]),
    ("o fruto separa a mancha-alvo da pinta-preta", "tomate",
     ["manchas_escuras_aneis", "lesoes_no_fruto"]),
    ("as duas faces da folha separam requeima de mofo-de-folha", "tomate",
     ["manchas_amareladas", "mofo_oliva_face_inferior"]),
    ("praga, nao doenca", "tomate",
     ["pontuacoes_finas_cloroticas", "teia_fina"]),
    ("dois virus de tomate: mosaico x geminivirose", "tomate",
     ["folhas_deformadas", "crescimento_reduzido"]),
    ("nenhum sintoma nao devolve nada", "tomate", []),
    ("sintoma que nao existe no catalogo e apenas ruido", "tomate",
     ["manchas_escuras_aneis", "sintoma_inventado"]),
    # A mesma pinta-preta em duas solanaceas: o agente e o mesmo (Alternaria
    # solani), e o motor precisa devolver a ficha da cultura selecionada.
    ("pinta-preta na batata, nao no tomate", "batata",
     ["manchas_escuras_aneis", "desfolha_baixo_para_cima"]),
    ("requeima: a doenca que decide a safra de batata", "batata",
     ["manchas_encharcadas", "mofo_branco_face_inferior"]),
    ("so ruido: nada passa do limiar", "batata",
     ["po_branco_superficie", "folhas_deformadas"]),
    ("hipotese unica: nao ha segunda para desempatar", "pimentao",
     ["manchas_angulares_halo_amarelo"]),
    ("perfil inteiro marcado: compatibilidade maxima", "pimentao",
     ["manchas_angulares_halo_amarelo", "manchas_salientes_fruto",
      "manchas_encharcadas", "queda_precoce_folhas", "manchas_amareladas"]),
]


def _serializar_hipotese(h) -> dict:
    d = asdict(h)
    # Propriedades derivadas entram explicitamente: sao parte do contrato
    # que o TypeScript precisa reproduzir, e asdict() nao pega @property.
    d["compatibilidade_pct"] = h.compatibilidade_pct
    d["rotulo_gravidade"] = h.rotulo_gravidade
    return d


def _caso(nome: str, cultura: str, sintomas: list[str]) -> dict:
    hipoteses = diagnosticar(cultura, set(sintomas))
    pergunta = melhor_pergunta(hipoteses)
    return {
        "nome": nome,
        "cultura": cultura,
        # sorted() para a entrada tambem ser estavel entre execucoes.
        "sintomas": sorted(sintomas),
        "esperado": {
            "hipoteses": [_serializar_hipotese(h) for h in hipoteses],
            "pergunta": asdict(pergunta) if pergunta else None,
        },
    }


def montar() -> dict:
    base = carregar_json()

    casos = [_caso(nome, cultura, sintomas)
             for nome, cultura, sintomas in CASOS_MANUAIS]

    # Varredura: cada doenca da base entra com o perfil inteiro e com o
    # sintoma isolado de maior peso.
    for cultura in base["culturas"]:
        for d in cultura["doencas"]:
            perfil = sorted(d["sintomas"], key=lambda s: (-s["peso"], s["id"]))
            casos.append(_caso(
                f"perfil completo de {d['id']}", cultura["id"],
                [s["id"] for s in perfil]))
            casos.append(_caso(
                f"sintoma principal isolado de {d['id']}", cultura["id"],
                [perfil[0]["id"]]))

    return {
        "_comentario": (
            "GERADO AUTOMATICAMENTE por `python -m app.fixtures`. Nao editar a "
            "mao. Contrato compartilhado entre o motor de referencia em Python "
            "e o porte em TypeScript: os dois tem que produzir exatamente "
            "estes valores."
        ),
        "gerado_por": "python -m app.fixtures",
        "culturas": listar_culturas(apenas_com_doencas=True),
        # Listas, e nao dicionarios indexados por id: o lado TypeScript
        # converte snake_case para camelCase recursivamente, e um id como
        # `tomate_pinta_preta` usado como CHAVE viraria `tomatePintaPreta`.
        "catalogos": [
            {"cultura": c["id"], "sintomas": listar_sintomas_da_cultura(c["id"])}
            for c in listar_culturas()
        ],
        "fichas": [
            detalhar_doenca(d["id"])
            for cultura in base["culturas"] for d in cultura["doencas"]
        ],
        "casos": casos,
    }


def gerar() -> None:
    conteudo = montar()
    CAMINHO_FIXTURES.parent.mkdir(parents=True, exist_ok=True)
    with open(CAMINHO_FIXTURES, "w", encoding="utf-8", newline="\n") as f:
        json.dump(conteudo, f, ensure_ascii=False, indent=2)
        f.write("\n")

    n_hip = sum(len(c["esperado"]["hipoteses"]) for c in conteudo["casos"])
    print(f"Fixtures em {CAMINHO_FIXTURES}")
    print(f"  {len(conteudo['casos'])} casos, {n_hip} hipoteses esperadas, "
          f"{len(conteudo['fichas'])} fichas")


if __name__ == "__main__":
    gerar()

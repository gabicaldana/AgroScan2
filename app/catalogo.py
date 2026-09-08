"""A base de conhecimento carregada em memoria, sem banco.

Por que existe: o motor de diagnostico precisa rodar em tres lugares - no
terminal, dentro da API e (portado) no navegador. Amarra-lo ao SQLite obrigava
um arquivo de banco para gerar as fixtures e impedia a API de responder sem uma
consulta a disco por requisicao.

O catalogo agronomico e conteudo estatico e pequeno: cabe inteiro na memoria do
processo, e ler dele e mais rapido e mais simples que consultar o banco. O
PostgreSQL guarda o catalogo tambem, mas por outro motivo - as juncoes dos
relatorios (consulta -> hipotese -> doenca -> cultura) sao SQL de verdade, e
essas nao teriam como sair daqui.

As estruturas devolvidas reproduzem exatamente o formato e a ORDEM que as
consultas SQL produziam. Isso nao e coincidencia: as fixtures compartilhadas
com o TypeScript sao geradas a partir daqui, e qualquer diferenca de ordem
mudaria a soma de floats (que nao e associativa) e quebraria a paridade.
"""

import json
from functools import lru_cache
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMINHO_JSON = RAIZ / "data" / "base_conhecimento.json"

# Ordem do manejo integrado: cultural antes de biologico antes de quimico.
# Nao e cosmetico - e a ordem que o MIP recomenda, e a interface a repete.
ORDEM_DO_TRATAMENTO = {"cultural": 1, "biologico": 2, "quimico": 3}


def carregar_json(caminho: Path | None = None) -> dict:
    with open(caminho or CAMINHO_JSON, encoding="utf-8") as f:
        return json.load(f)


class Catalogo:
    """Indices sobre a base curada, montados uma vez."""

    def __init__(self, base: dict):
        self.versao: str = base["versao"]
        self.orgaos: list[dict] = base["orgaos"]
        self.culturas: list[dict] = base["culturas"]

        self.orgao_por_id = {o["id"]: o for o in base["orgaos"]}
        self.sintoma_por_id = {s["id"]: s for s in base["sintomas"]}
        self.nomes_de_sintomas = {s["id"]: s["nome"] for s in base["sintomas"]}
        self.cultura_por_id = {c["id"]: c for c in base["culturas"]}

        self.doenca_por_id: dict[str, dict] = {}
        # doenca_id -> {sintoma_id: peso}
        self.perfil_por_doenca: dict[str, dict[str, float]] = {}
        # cultura_id -> [doenca, ...] na ordem do id, como o `ORDER BY id`
        self.doencas_por_cultura: dict[str, list[dict]] = {}

        for cultura in base["culturas"]:
            doencas = sorted(cultura["doencas"], key=lambda d: d["id"])
            self.doencas_por_cultura[cultura["id"]] = doencas
            for d in doencas:
                # A cultura entra na ficha porque `detalhar_doenca` a devolve, e
                # sem isto seria preciso varrer as culturas para descobri-la.
                self.doenca_por_id[d["id"]] = {**d, "cultura_id": cultura["id"]}
                self.perfil_por_doenca[d["id"]] = {
                    s["id"]: s["peso"] for s in d["sintomas"]
                }

    def sintomas_da_cultura(self, cultura_id: str) -> list[dict]:
        """Os sintomas que aparecem em alguma doenca daquela cultura.

        Reproduz o `SELECT DISTINCT ... JOIN orgao` de antes: cada sintoma uma
        vez so, com o rotulo e a ordem do orgao anexados.
        """
        usados: set[str] = set()
        for d in self.doencas_por_cultura.get(cultura_id, []):
            usados.update(self.perfil_por_doenca[d["id"]].keys())

        linhas = []
        for sid in usados:
            s = self.sintoma_por_id[sid]
            orgao = self.orgao_por_id[s["orgao"]]
            linhas.append({
                "id": s["id"],
                "nome": s["nome"],
                "orgao": s["orgao"],
                "orgao_rotulo": orgao["rotulo"],
                "orgao_ordem": orgao["ordem"],
            })
        return linhas

    def resumo_das_culturas(self) -> list[dict]:
        """Uma linha por cultura, com a contagem de doencas."""
        return [
            {
                "id": c["id"],
                "nome": c["nome"],
                "nome_cientifico": c["nome_cientifico"],
                "grupo": c["grupo"],
                "familia": c["familia"],
                "emoji": c["emoji"],
                "n_doencas": len(c["doencas"]),
            }
            for c in self.culturas
        ]

    def ficha(self, doenca_id: str) -> dict:
        """Ficha completa da doenca, na ordem em que a tela a apresenta."""
        d = self.doenca_por_id.get(doenca_id)
        if d is None:
            raise KeyError(f"doenca desconhecida: {doenca_id}")

        cultura = self.cultura_por_id[d["cultura_id"]]

        # `sorted` do Python e estavel, entao dentro do mesmo tipo a ordem
        # curada no JSON e preservada - que e o que o `ORDER BY tipo, id` do
        # SQL fazia, ja que o id era o da insercao.
        tratamentos = sorted(
            d["tratamentos"],
            key=lambda t: ORDEM_DO_TRATAMENTO.get(t["tipo"], 4),
        )

        return {
            "id": d["id"],
            "nome": d["nome"],
            "cultura": cultura["nome"],
            "emoji": cultura["emoji"],
            "agente": d["agente"],
            "tipo_agente": d["tipo_agente"],
            "gravidade": d["gravidade"],
            "descricao": d["descricao"],
            "condicoes_favoraveis": {
                "temperatura": d["condicoes_favoraveis"]["temperatura"],
                "umidade": d["condicoes_favoraveis"]["umidade"],
                "observacao": d["condicoes_favoraveis"]["observacao"],
            },
            "tratamentos": [dict(t) for t in tratamentos],
            "ingredientes_ativos": [dict(i) for i in d["ingredientes_ativos"]],
        }


@lru_cache(maxsize=1)
def catalogo() -> Catalogo:
    """O catalogo do processo. Carregado na primeira chamada e reusado.

    Em ambiente serverless isso importa: a instancia sobrevive entre
    invocacoes, e reler 100 KB de JSON a cada requisicao seria desperdicio.
    """
    return Catalogo(carregar_json())

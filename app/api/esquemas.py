"""Modelos de entrada e saida da API.

Ficam num lugar so porque sao contrato publico: quem consome a API depende
deles, e espalha-los pelas rotas faria uma mudanca de formato passar
despercebida.
"""

from pydantic import BaseModel, Field


class PedidoDeDiagnostico(BaseModel):
    cultura_id: str = Field(
        ...,
        description="Slug da hortalica, como devolvido por GET /culturas.",
        examples=["tomate"],
    )
    sintomas: list[str] = Field(
        default_factory=list,
        description=(
            "Ids dos sintomas observados. Um id fora do catalogo e ignorado, "
            "nao penaliza: o caso real e um app servido de cache antigo."
        ),
        examples=[["manchas_escuras_aneis", "desfolha_baixo_para_cima"]],
    )


class SintomaPontuadoResposta(BaseModel):
    id: str
    nome: str
    peso: float


class SintomaRefResposta(BaseModel):
    id: str
    nome: str


class HipoteseResposta(BaseModel):
    doenca_id: str
    nome: str
    agente: str
    tipo_agente: str
    gravidade: int
    compatibilidade: float = Field(
        ...,
        description=(
            "Indice de Tversky ponderado, de 0 a 1. NAO e probabilidade: nao "
            "ha modelo probabilistico por tras, e a interface diz "
            "'compatibilidade', nunca 'confianca'."
        ),
    )
    compatibilidade_pct: int
    rotulo_gravidade: str
    sintomas_compativeis: list[SintomaPontuadoResposta]
    sintomas_esperados_ausentes: list[SintomaPontuadoResposta]
    sintomas_nao_explicados: list[SintomaRefResposta]


class PerguntaResposta(BaseModel):
    sintoma_id: str
    nome: str
    confirma: str
    descarta: str | None = Field(
        None,
        description=(
            "Nome da hipotese que a observacao afasta, ou null quando a "
            "segunda hipotese tambem espera aquele sintoma - nesse caso a "
            "resposta confirma, mas nao decide."
        ),
    )


class RespostaDeDiagnostico(BaseModel):
    cultura_id: str
    versao_catalogo: str
    hipoteses: list[HipoteseResposta]
    pergunta: PerguntaResposta | None


class CulturaResposta(BaseModel):
    id: str
    nome: str
    nome_cientifico: str
    grupo: str
    familia: str
    emoji: str | None = None
    n_doencas: int


class SintomaDoCatalogoResposta(BaseModel):
    id: str
    nome: str
    orgao: str
    orgao_rotulo: str
    orgao_ordem: int


class VersaoDoCatalogo(BaseModel):
    versao: str
    checksum_sha256: str
    culturas: int
    doencas: int
    sintomas: int


class Saude(BaseModel):
    versao_api: str
    ambiente: str
    versao_catalogo: str
    banco: str = Field(
        ...,
        description="'ok', 'nao_configurado' ou a mensagem do erro de conexao.",
    )
    migracao_aplicada: int | None

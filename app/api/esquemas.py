"""Modelos de entrada e saida da API.

Ficam num lugar so porque sao contrato publico: quem consome a API depende
deles, e espalha-los pelas rotas faria uma mudanca de formato passar
despercebida.
"""

from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, Field, StringConstraints, model_validator

# O formato do e-mail e conferido pelo CHECK da tabela `usuario`. Validar
# aqui com `EmailStr` exigiria a dependencia `email-validator` so para
# repetir a regra que o banco ja garante.
EmailNaoValidado = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=5, max_length=254)
]


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


# =============================================================================
# Conta
# =============================================================================


class PedidoDeRegistro(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: EmailNaoValidado = Field(..., description="Serve como login.")
    senha: str = Field(
        ...,
        min_length=8,
        description=(
            "Mínimo de 8 caracteres. Guardada com scrypt, nunca em texto claro."
        ),
    )


class UsuarioResposta(BaseModel):
    id: int
    nome: str
    email: str
    papel: str
    ativo: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# =============================================================================
# Caderno de campo
# =============================================================================


class HipoteseRegistrada(BaseModel):
    """A hipótese como o aparelho a calculou.

    O servidor NÃO recalcula: ele registra o que o motor do aparelho produziu,
    e a `versao_catalogo` da consulta diz contra qual base aquilo foi apurado.
    Recalcular aqui, com uma base mais nova, reescreveria a história.
    """

    doenca_id: str
    compatibilidade: float = Field(..., ge=0, le=1)


class PedidoDeConsulta(BaseModel):
    offline_id: UUID = Field(
        ...,
        description=(
            "Gerado no aparelho, no momento da observação. É a chave de "
            "idempotência: reenviar a fila não duplica o registro."
        ),
    )
    cultura_id: str
    sintomas: list[str] = Field(default_factory=list)
    hipoteses: list[HipoteseRegistrada] = Field(default_factory=list)
    origem: Literal["sintomas", "imagem"] = "sintomas"
    canteiro_id: int | None = None
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)
    registrada_em: datetime | None = Field(
        None,
        description=(
            "Quando a observação foi feita no campo, não quando chegou ao "
            "servidor. Ausente vira o instante da sincronização."
        ),
    )
    versao_catalogo: str | None = None

    @model_validator(mode="after")
    def coordenada_completa(self):
        """As duas, ou nenhuma. O banco tem o mesmo CHECK.

        `model_validator`, e nao `field_validator`: um validador de campo nao
        roda quando o campo sequer foi enviado, que e exatamente o caso a
        pegar aqui - latitude preenchida e longitude ausente.
        """
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError(
                "informe latitude e longitude juntas, ou nenhuma das duas")
        return self


class PedidoDeSincronizacao(BaseModel):
    consultas: list[PedidoDeConsulta] = Field(..., max_length=200)


class ConsultaRejeitada(BaseModel):
    offline_id: str
    motivo: str


class RespostaDeSincronizacao(BaseModel):
    """O que aconteceu com cada item da fila.

    Separar `aceitas` de `duplicadas` importa para o aparelho: as duas podem
    sair da fila, mas só a primeira é novidade. Um item em `rejeitadas` fica,
    e o motivo diz o que precisa ser corrigido.
    """

    aceitas: list[str]
    duplicadas: list[str]
    rejeitadas: list[ConsultaRejeitada]


class ConsultaResumida(BaseModel):
    id: int
    offline_id: UUID
    cultura_id: str
    cultura_nome: str
    emoji: str | None = None
    canteiro_id: int | None = None
    origem: str
    registrada_em: datetime
    versao_catalogo: str
    doenca_id: str | None = None
    doenca_nome: str | None = None
    compatibilidade: float | None = None
    tem_feedback: bool = False


class PedidoDeFeedback(BaseModel):
    confirmado: bool = Field(
        ..., description="O diagnóstico principal se confirmou no campo?")
    doenca_confirmada_id: str | None = Field(
        None,
        description=(
            "Só quando `confirmado` é falso e se sabe qual era a doença real. "
            "É o que permite medir acurácia percebida por doença."
        ),
    )
    comentario: str | None = Field(None, max_length=2000)

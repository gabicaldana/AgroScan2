"""O catalogo agronomico: culturas, sintomas e fichas de doenca.

Servido a partir da BASE EM MEMORIA, nao do banco. O catalogo e conteudo
estatico e pequeno; le-lo do processo evita uma ida ao banco por requisicao e
mantem estes endpoints respondendo mesmo com o PostgreSQL fora do ar.

O banco guarda o catalogo tambem, por outro motivo: as juncoes dos relatorios
(consulta -> hipotese -> doenca -> cultura) sao SQL de verdade e nao teriam
como sair daqui.
"""

from fastapi import APIRouter, HTTPException, Response

from app.api.esquemas import (
    CulturaResposta,
    SintomaDoCatalogoResposta,
    VersaoDoCatalogo,
)
from app.catalogo import catalogo
from app.diagnostico import (
    detalhar_doenca,
    listar_culturas,
    listar_sintomas_da_cultura,
)

rotas = APIRouter(tags=["catalogo"])


def _etag() -> str:
    return f'W/"catalogo-{catalogo().versao}"'


@rotas.get("/catalogo/versao", response_model=VersaoDoCatalogo)
def versao_do_catalogo() -> VersaoDoCatalogo:
    """Chamada barata: o app compara com a versao embutida no bundle.

    So baixa o catalogo inteiro se este numero for maior - e nunca bloqueia o
    diagnostico esperando a resposta.
    """
    from app.seed import checksum_da_base

    cat = catalogo()
    return VersaoDoCatalogo(
        versao=cat.versao,
        checksum_sha256=checksum_da_base(),
        culturas=len(cat.culturas),
        doencas=len(cat.doenca_por_id),
        sintomas=len(cat.sintoma_por_id),
    )


@rotas.get("/catalogo")
def catalogo_completo(response: Response) -> dict:
    """A base inteira, para o app guardar localmente."""
    response.headers["ETag"] = _etag()
    response.headers["Cache-Control"] = "public, max-age=300"
    cat = catalogo()
    return {
        "versao": cat.versao,
        "orgaos": cat.orgaos,
        "sintomas": list(cat.sintoma_por_id.values()),
        "culturas": cat.culturas,
    }


@rotas.get("/culturas", response_model=list[CulturaResposta])
def culturas(apenas_com_doencas: bool = False) -> list[dict]:
    return listar_culturas(apenas_com_doencas=apenas_com_doencas)


@rotas.get("/culturas/{cultura_id}/sintomas",
           response_model=list[SintomaDoCatalogoResposta])
def sintomas_da_cultura(cultura_id: str) -> list[dict]:
    if cultura_id not in catalogo().cultura_por_id:
        raise HTTPException(404, f"cultura desconhecida: {cultura_id}")
    return listar_sintomas_da_cultura(cultura_id)


@rotas.get("/doencas/{doenca_id}")
def ficha_da_doenca(doenca_id: str) -> dict:
    try:
        return detalhar_doenca(doenca_id)
    except KeyError:
        raise HTTPException(404, f"doenca desconhecida: {doenca_id}")

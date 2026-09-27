"""A aplicacao FastAPI.

Monta as rotas sob /api/v1 e nada mais: a regra de negocio esta em
app/diagnostico.py, sem framework, e o acesso ao banco em app/api/banco.py.
Esta separacao e o que permite testar o motor sem subir servidor e sem banco.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import configuracao
from app.api.rotas import autenticacao as rotas_autenticacao
from app.api.rotas import catalogo as rotas_catalogo
from app.api.rotas import consultas as rotas_consultas
from app.api.rotas import diagnostico as rotas_diagnostico
from app.api.rotas import saude as rotas_saude

app = FastAPI(
    title="AgroScan",
    version=configuracao.VERSAO_DA_API,
    description=(
        "Diagnostico de doencas em hortalicas.\n\n"
        "O cliente e autoridade sobre a RESPOSTA: o PWA calcula o diagnostico "
        "no proprio aparelho, porque funcionar sem rede e requisito funcional. "
        "O servidor e autoridade sobre o REGISTRO: historico, hortas, "
        "canteiros e os relatorios que so existem com dado acumulado."
    ),
    docs_url=f"{configuracao.PREFIXO}/docs",
    openapi_url=f"{configuracao.PREFIXO}/openapi.json",
)

# Em producao o PWA fala com /api/v1 na propria origem, via rewrite do Next,
# entao nao ha CORS a liberar. Isto serve ao desenvolvimento local, com o
# front em :3000 e a API em :8000.
if configuracao.ORIGENS_PERMITIDAS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=configuracao.ORIGENS_PERMITIDAS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

for modulo in (rotas_saude, rotas_catalogo, rotas_diagnostico,
               rotas_autenticacao, rotas_consultas):
    app.include_router(modulo.rotas, prefix=configuracao.PREFIXO)


@app.get("/", include_in_schema=False)
def raiz() -> dict:
    return {
        "servico": "AgroScan API",
        "versao": configuracao.VERSAO_DA_API,
        "documentacao": f"{configuracao.PREFIXO}/docs",
        "saude": f"{configuracao.PREFIXO}/saude",
    }

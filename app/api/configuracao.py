"""Variaveis de ambiente, lidas e validadas na importacao do modulo.

Ler no ponto de uso espalha `os.environ.get` pelo codigo e adia a descoberta de
uma variavel ausente para o momento em que alguem chama o endpoint. Aqui a
falta aparece no arranque, que num ambiente serverless significa: no primeiro
deploy, e nao no primeiro usuario.
"""

import os

AMBIENTE = os.environ.get("AMBIENTE", "local")
E_PRODUCAO = AMBIENTE == "producao"

# Conexao de runtime: usar a string POOLED (PgBouncer em modo transacao) da
# Neon/Supabase. Ver app/api/banco.py para a armadilha do prepared statement.
DATABASE_URL = os.environ.get("DATABASE_URL")

# Conexao direta, so para DDL. Migracao nao sobrevive a transaction pooling.
DATABASE_URL_DIRETA = os.environ.get("DATABASE_URL_DIRETA")

JWT_SEGREDO = os.environ.get("JWT_SEGREDO", "")
JWT_HORAS = int(os.environ.get("JWT_HORAS", "72"))

# Vazio = mesma origem. Em producao o PWA fala com /api/v1 na propria origem
# via rewrite do Next, entao nao ha CORS a liberar. A variavel existe para o
# desenvolvimento local, em que o front roda em :3000 e a API em :8000.
ORIGENS_PERMITIDAS = [
    o.strip()
    for o in os.environ.get("ORIGENS_PERMITIDAS", "").split(",")
    if o.strip()
]

VERSAO_DA_API = "1.0.0"
PREFIXO = "/api/v1"


def exigir_segredo() -> str:
    """O segredo do JWT so e obrigatorio quando ha rota autenticada em uso."""
    if not JWT_SEGREDO:
        raise RuntimeError(
            "JWT_SEGREDO nao definido. Sem ele a assinatura do token seria "
            "previsivel, e qualquer pessoa poderia forjar uma sessao.")
    return JWT_SEGREDO

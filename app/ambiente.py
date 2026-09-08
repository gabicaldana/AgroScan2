"""Le o arquivo .env da raiz, quando existe.

Por que escrever em vez de usar python-dotenv: sao vinte linhas de stdlib
contra mais uma dependencia no runtime serverless, onde cada pacote pesa no
tempo de arranque a frio. E o back-end ja tem as dependencias que precisa.

Variavel que ja existe no ambiente NAO e sobrescrita. Isso importa em
producao: a Vercel injeta as variaveis do projeto, e um .env que tivesse ido
junto no deploy por engano nao pode ganhar delas.

Formato aceito: `CHAVE=valor` por linha, `#` inicia comentario, aspas em volta
do valor sao removidas. Nao ha interpolacao nem export - se o arquivo precisar
de mais que isso, o lugar certo e o gerenciador de segredos, nao um .env.
"""

import os
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMINHO_ENV = RAIZ / ".env"


def carregar(caminho: Path | None = None) -> list[str]:
    """Carrega o .env no ambiente do processo. Devolve as chaves definidas."""
    destino = caminho or CAMINHO_ENV
    if not destino.exists():
        return []

    definidas = []
    for numero, linha in enumerate(
        destino.read_text(encoding="utf-8").splitlines(), start=1
    ):
        linha = linha.strip()
        if not linha or linha.startswith("#"):
            continue
        if "=" not in linha:
            raise ValueError(
                f"{destino.name}:{numero}: esperado CHAVE=valor, veio {linha!r}")

        chave, _, valor = linha.partition("=")
        chave = chave.strip()
        valor = valor.strip().strip('"').strip("'")

        # Ambiente real vence o arquivo, sempre.
        if chave not in os.environ:
            os.environ[chave] = valor
            definidas.append(chave)

    return definidas

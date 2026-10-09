"""Senha, token e a dependencia que identifica quem esta chamando.

A senha usa `hashlib.scrypt`, da biblioteca padrao. Nao ha dependencia nova
para isso: scrypt e uma funcao de derivacao de chave com custo de memoria
ajustavel, que e exatamente o que se quer contra ataque de forca bruta em
hardware dedicado. Guardar senha com SHA-256 puro seria rapido demais - o que
protege o atacante, nao o usuario.

O hash guarda os proprios parametros. Sem isso, aumentar o custo no futuro
invalidaria todas as senhas ja cadastradas: o verificador nao teria como saber
com que custo cada uma foi gerada.
"""

import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.api import banco, configuracao

# Parametros do scrypt. n e o custo de CPU/memoria; dobrar n dobra os dois.
# 2**14 com r=8 gasta ~16 MB por verificacao - suportavel numa funcao
# serverless de 512 MB e caro o suficiente para quem tenta forca bruta.
SCRYPT_N = 2 ** 14
SCRYPT_R = 8
SCRYPT_P = 1
TAMANHO_DO_SAL = 16
TAMANHO_DA_CHAVE = 32

esquema_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{configuracao.PREFIXO}/autenticacao/token",
    auto_error=False,
)


def _b64(dados: bytes) -> str:
    return base64.urlsafe_b64encode(dados).decode("ascii").rstrip("=")


def _de_b64(texto: str) -> bytes:
    return base64.urlsafe_b64decode(texto + "=" * (-len(texto) % 4))


def hash_senha(senha: str) -> str:
    """Devolve `scrypt$n$r$p$sal$chave`, com os parametros embutidos."""
    if len(senha) < 8:
        raise ValueError("a senha precisa de pelo menos 8 caracteres")

    sal = secrets.token_bytes(TAMANHO_DO_SAL)
    chave = hashlib.scrypt(
        senha.encode("utf-8"), salt=sal,
        n=SCRYPT_N, r=SCRYPT_R, p=SCRYPT_P, dklen=TAMANHO_DA_CHAVE,
    )
    return f"scrypt${SCRYPT_N}${SCRYPT_R}${SCRYPT_P}${_b64(sal)}${_b64(chave)}"


def conferir_senha(senha: str, guardado: str) -> bool:
    """Compara em tempo constante, e nunca levanta por hash malformado."""
    try:
        algoritmo, n, r, p, sal, chave = guardado.split("$")
        if algoritmo != "scrypt":
            return False
        calculada = hashlib.scrypt(
            senha.encode("utf-8"), salt=_de_b64(sal),
            n=int(n), r=int(r), p=int(p), dklen=len(_de_b64(chave)),
        )
    except (ValueError, TypeError):
        # Hash corrompido ou de formato desconhecido: nega, nao explode. Um
        # 500 aqui diria ao atacante que aquele usuario existe.
        return False

    # compare_digest: comparar com `==` vaza, pelo tempo gasto, quantos bytes
    # do inicio bateram.
    return hmac.compare_digest(calculada, _de_b64(chave))


def criar_token(usuario_id: int, papel: str) -> str:
    import jwt

    agora = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(usuario_id),
            "papel": papel,
            "iat": agora,
            "exp": agora + timedelta(hours=configuracao.JWT_HORAS),
        },
        configuracao.exigir_segredo(),
        algorithm="HS256",
    )


def _ler_token(token: str) -> dict:
    import jwt

    try:
        return jwt.decode(
            token, configuracao.exigir_segredo(), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "sessao expirada, entre novamente",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "token invalido",
            headers={"WWW-Authenticate": "Bearer"},
        )


def usuario_atual(token: str | None = Depends(esquema_oauth2)) -> dict:
    """Quem esta chamando. Levanta 401 quando nao da para saber.

    O usuario e relido do banco a cada requisicao, e nao deduzido apenas do
    token: uma conta desativada precisa parar de funcionar na hora, e nao
    quando o token expirar.
    """
    if not token:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "e preciso estar autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    dados = _ler_token(token)
    linha = banco.consultar_um(
        "SELECT id, nome, email, papel, ativo FROM usuario WHERE id = %s",
        (int(dados["sub"]),),
    )

    if linha is None or not linha["ativo"]:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "conta inexistente ou desativada")

    return linha


def exigir_papel(*papeis: str):
    """Dependencia para rota que so um papel pode chamar."""

    def verificar(usuario: dict = Depends(usuario_atual)) -> dict:
        if usuario["papel"] not in papeis:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                f"esta operacao exige um destes papeis: {', '.join(papeis)}")
        return usuario

    return verificar

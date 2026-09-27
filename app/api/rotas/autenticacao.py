"""Cadastro, entrada e exclusão de conta."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api import seguranca
from app.api.esquemas import PedidoDeRegistro, Token, UsuarioResposta
from app.api.repositorios import usuarios

rotas = APIRouter(prefix="/autenticacao", tags=["autenticacao"])


@rotas.post("/registro", response_model=UsuarioResposta,
            status_code=status.HTTP_201_CREATED)
def registrar(pedido: PedidoDeRegistro) -> dict:
    email = pedido.email.strip().lower()

    if usuarios.email_ja_usado(email):
        raise HTTPException(status.HTTP_409_CONFLICT,
                            "já existe uma conta com este e-mail")

    try:
        senha_hash = seguranca.hash_senha(pedido.senha)
    except ValueError as erro:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(erro))

    return usuarios.criar(pedido.nome.strip(), email, senha_hash)


@rotas.post("/token", response_model=Token)
def entrar(formulario: OAuth2PasswordRequestForm = Depends()) -> dict:
    """Fluxo `password` do OAuth2 - o padrão que o FastAPI já documenta.

    O campo se chama `username` por causa do padrão; aqui ele recebe o e-mail.
    """
    usuario = usuarios.por_email(formulario.username.strip().lower())

    # Mensagem única para e-mail inexistente e senha errada. Distinguir os dois
    # entregaria de graça quais e-mails têm conta no sistema.
    generico = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        "e-mail ou senha incorretos",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if usuario is None:
        # Gasta o mesmo tempo de uma verificação real. Sem isto, responder
        # rápido demais denuncia que o e-mail não existe.
        seguranca.conferir_senha(formulario.password, "scrypt$16384$8$1$x$y")
        raise generico

    if not seguranca.conferir_senha(formulario.password, usuario["senha_hash"]):
        raise generico

    if not usuario["ativo"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "conta desativada")

    return {
        "access_token": seguranca.criar_token(usuario["id"], usuario["papel"]),
        "token_type": "bearer",
    }


@rotas.get("/eu", response_model=UsuarioResposta)
def eu(usuario: dict = Depends(seguranca.usuario_atual)) -> dict:
    return usuarios.por_id(usuario["id"])


@rotas.delete("/eu", status_code=status.HTTP_204_NO_CONTENT)
def excluir_conta(usuario: dict = Depends(seguranca.usuario_atual)) -> None:
    """Exclusão efetiva, não desativação.

    A LGPD dá ao titular o direito de eliminação, e "marcamos como inativo mas
    guardamos tudo" não é eliminação. As consultas têm ON DELETE CASCADE, então
    o histórico vai junto.
    """
    usuarios.desativar(usuario["id"])

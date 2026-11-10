"""Anotações livres do caderno de campo (US21).

O que não cabe no diagnóstico nem no registro de manejo: "choveu forte na
terça", "a muda veio do vizinho", "a mancha começou pelo lado da cerca". A
anotação fica presa a um canteiro ou a uma consulta, nunca solta.

Regras de acesso, as mesmas do resto do caderno (ADR 0012):

- Anotação de canteiro é vista por todos os membros da horta, como o manejo:
  numa horta comunitária o que um anota serve a quem cuida do canteiro depois.
- Anotação de consulta é só de quem fez a consulta, como a própria consulta.
- Só quem escreveu edita ou apaga. Outro membro vê, mas recebe 403.
- Quem não enxerga o canteiro ou a consulta recebe 404, e não 403, para não
  confirmar que o id existe.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api import seguranca
from app.api.esquemas import PedidoDeAnotacao
from app.api.repositorios import anotacoes as repo
from app.api.repositorios import consultas as repo_consultas
from app.api.repositorios import hortas as repo_hortas

rotas = APIRouter(tags=["caderno"])

CANTEIRO_NAO_ENCONTRADO = "canteiro não encontrado"
CONSULTA_NAO_ENCONTRADA = "consulta não encontrada"
ANOTACAO_NAO_ENCONTRADA = "anotação não encontrada"


def _exigir_canteiro(canteiro_id: int, usuario: dict) -> None:
    if repo_hortas.canteiro_do_membro(canteiro_id, usuario["id"]) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, CANTEIRO_NAO_ENCONTRADO)


def _exigir_consulta(consulta_id: int, usuario: dict) -> None:
    if not repo_consultas.pertence_ao_usuario(consulta_id, usuario["id"]):
        raise HTTPException(status.HTTP_404_NOT_FOUND, CONSULTA_NAO_ENCONTRADA)


def _enxerga(anotacao: dict, usuario: dict) -> bool:
    if anotacao["canteiro_id"] is not None and repo_hortas.canteiro_do_membro(
            anotacao["canteiro_id"], usuario["id"]) is not None:
        return True
    if anotacao["consulta_id"] is not None and repo_consultas.pertence_ao_usuario(
            anotacao["consulta_id"], usuario["id"]):
        return True
    return False


def _anotacao_da_autora(anotacao_id: int, usuario: dict) -> dict:
    anotacao = repo.obter(anotacao_id)
    if anotacao is None or not _enxerga(anotacao, usuario):
        raise HTTPException(status.HTTP_404_NOT_FOUND, ANOTACAO_NAO_ENCONTRADA)
    if anotacao["autor_id"] != usuario["id"]:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "só quem escreveu a anotação pode alterá-la ou apagá-la")
    return anotacao


@rotas.get("/canteiros/{canteiro_id}/anotacoes")
def listar_do_canteiro(
    canteiro_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> list[dict]:
    _exigir_canteiro(canteiro_id, usuario)
    return repo.listar_do_canteiro(canteiro_id)


@rotas.post("/canteiros/{canteiro_id}/anotacoes",
            status_code=status.HTTP_201_CREATED)
def anotar_no_canteiro(
    canteiro_id: int,
    pedido: PedidoDeAnotacao,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _exigir_canteiro(canteiro_id, usuario)
    return repo.criar(usuario["id"], pedido.texto, canteiro_id=canteiro_id)


@rotas.get("/consultas/{consulta_id}/anotacoes")
def listar_da_consulta(
    consulta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> list[dict]:
    _exigir_consulta(consulta_id, usuario)
    return repo.listar_da_consulta(consulta_id)


@rotas.post("/consultas/{consulta_id}/anotacoes",
            status_code=status.HTTP_201_CREATED)
def anotar_na_consulta(
    consulta_id: int,
    pedido: PedidoDeAnotacao,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _exigir_consulta(consulta_id, usuario)
    return repo.criar(usuario["id"], pedido.texto, consulta_id=consulta_id)


@rotas.patch("/anotacoes/{anotacao_id}")
def alterar_anotacao(
    anotacao_id: int,
    pedido: PedidoDeAnotacao,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _anotacao_da_autora(anotacao_id, usuario)
    return repo.alterar(anotacao_id, pedido.texto)


@rotas.delete("/anotacoes/{anotacao_id}",
              status_code=status.HTTP_204_NO_CONTENT)
def apagar_anotacao(
    anotacao_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> None:
    _anotacao_da_autora(anotacao_id, usuario)
    repo.apagar(anotacao_id)

"""Horta, membros, canteiros e manejo (épico E5).

Regras de acesso, registradas no ADR 0012:

- Horta e canteiros só existem para quem é MEMBRO. Para os demais a resposta é
  404, e não 403: um 403 confirmaria que aquele id existe.
- Só o RESPONSÁVEL altera a horta, adiciona e remove membros, ou a apaga.
- Qualquer membro cadastra canteiros e registra manejo. Numa horta comunitária
  é quem está no canteiro que sabe o que foi plantado e aplicado.
- Canteiro não é apagado, é encerrado: a sucessão de canteiros encerrados no
  mesmo lugar é o que alimenta o alerta de rotação.
"""

from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, status

from app.api import seguranca
from app.api.esquemas import (
    AlteracaoDeCanteiro,
    AlteracaoDeHorta,
    PedidoDeCanteiro,
    PedidoDeHorta,
    PedidoDeManejo,
    PedidoDeMembro,
)
from app.api.repositorios import consultas as repo_consultas
from app.api.repositorios import hortas as repo
from app.catalogo import catalogo

rotas = APIRouter(tags=["horta"])

NAO_ENCONTRADA = "horta não encontrada"
CANTEIRO_NAO_ENCONTRADO = "canteiro não encontrado"


def _papel(horta_id: int, usuario: dict) -> str:
    """O papel de quem chama, ou 404 quando não participa da horta."""
    papel = repo.papel_na_horta(horta_id, usuario["id"])
    if papel is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NAO_ENCONTRADA)
    return papel


def _exigir_responsavel(horta_id: int, usuario: dict) -> None:
    if _papel(horta_id, usuario) != "responsavel":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "só a pessoa responsável pela horta pode fazer isso")


def _canteiro(canteiro_id: int, usuario: dict) -> dict:
    canteiro = repo.canteiro_do_membro(canteiro_id, usuario["id"])
    if canteiro is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, CANTEIRO_NAO_ENCONTRADO)
    return canteiro


# =============================================================================
# Horta
# =============================================================================


@rotas.get("/hortas")
def listar_hortas(usuario: dict = Depends(seguranca.usuario_atual)) -> list[dict]:
    return repo.listar_hortas(usuario["id"])


@rotas.post("/hortas", status_code=status.HTTP_201_CREATED)
def criar_horta(
    pedido: PedidoDeHorta,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Quem cria vira responsável, na mesma transação (US22)."""
    return repo.criar_horta(usuario["id"], **pedido.model_dump())


@rotas.get("/hortas/{horta_id}")
def detalhar_horta(
    horta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    papel = _papel(horta_id, usuario)
    horta = repo.detalhar_horta(horta_id)
    horta["papel"] = papel
    return horta


@rotas.patch("/hortas/{horta_id}")
def alterar_horta(
    horta_id: int,
    pedido: AlteracaoDeHorta,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _exigir_responsavel(horta_id, usuario)
    campos = pedido.model_dump(exclude_unset=True, exclude_none=True)

    novo = campos.get("responsavel_id")
    if novo is not None and novo != usuario["id"]:
        # Transferir para quem não é membro deixaria a horta sob alguém que
        # nem a enxerga.
        if repo.papel_na_horta(horta_id, novo) is None:
            raise HTTPException(
                422,
                "a responsabilidade só pode ir para alguém que já é membro")
    elif novo == usuario["id"]:
        campos.pop("responsavel_id")

    horta = repo.alterar_horta(horta_id, campos)
    horta["papel"] = repo.papel_na_horta(horta_id, usuario["id"])
    return horta


@rotas.delete("/hortas/{horta_id}", status_code=status.HTTP_204_NO_CONTENT)
def apagar_horta(
    horta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> None:
    """Só quando a horta não tem mais ninguém além do responsável.

    Apagar leva canteiros e manejos junto. Com outras pessoas na horta, isso
    apagaria trabalho alheio - elas precisam sair, ou receber a
    responsabilidade, antes.
    """
    _exigir_responsavel(horta_id, usuario)
    horta = repo.detalhar_horta(horta_id)
    if len(horta["membros"]) > 1:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "a horta tem outros membros: transfira a responsabilidade ou "
            "remova os membros antes de apagá-la")
    repo.apagar_horta(horta_id)


# =============================================================================
# Membros (US23)
# =============================================================================


@rotas.post("/hortas/{horta_id}/membros", status_code=status.HTTP_201_CREATED)
def adicionar_membro(
    horta_id: int,
    pedido: PedidoDeMembro,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _exigir_responsavel(horta_id, usuario)

    pessoa = repo.usuario_por_email(pedido.email.strip().lower())
    if pessoa is None:
        # Revela se o e-mail tem conta - mas só a quem já é responsável por uma
        # horta, e sem isto não há como dizer o que fazer: pedir à pessoa que
        # crie a conta primeiro.
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "não há conta com este e-mail; peça para a pessoa criar a conta "
            "no AgroScan primeiro")

    try:
        membro = repo.adicionar_membro(horta_id, pessoa["id"], "membro")
    except repo.Duplicado:
        raise HTTPException(status.HTTP_409_CONFLICT,
                            "esta pessoa já é membro da horta")

    return {**membro, "nome": pessoa["nome"], "email": pessoa["email"]}


@rotas.delete("/hortas/{horta_id}/membros/{usuario_id}",
              status_code=status.HTTP_204_NO_CONTENT)
def remover_membro(
    horta_id: int,
    usuario_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> None:
    """O responsável remove qualquer membro; um membro pode sair sozinho.

    O responsável não sai nem é removido: a horta ficaria sem ninguém que
    responda por ela. Antes, ele transfere a responsabilidade.
    """
    papel = _papel(horta_id, usuario)
    saindo = usuario_id == usuario["id"]

    if not saindo and papel != "responsavel":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "só a pessoa responsável pela horta pode remover membros")

    if repo.papel_na_horta(horta_id, usuario_id) == "responsavel":
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "a pessoa responsável não sai da horta: transfira a "
            "responsabilidade antes")

    if not repo.remover_membro(horta_id, usuario_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            "esta pessoa não é membro da horta")


# =============================================================================
# Canteiros (US24)
# =============================================================================


def _validar_cultura(cultura_id: str) -> None:
    if cultura_id not in catalogo().cultura_por_id:
        raise HTTPException(422,
                            f"cultura desconhecida: {cultura_id}")


@rotas.get("/canteiros")
def canteiros_do_usuario(
    usuario: dict = Depends(seguranca.usuario_atual),
) -> list[dict]:
    """Os canteiros ativos de todas as hortas da pessoa.

    O aparelho guarda esta lista para vincular a consulta ao canteiro mesmo
    sem rede (US25).
    """
    return repo.canteiros_do_usuario(usuario["id"])


@rotas.post("/hortas/{horta_id}/canteiros", status_code=status.HTTP_201_CREATED)
def criar_canteiro(
    horta_id: int,
    pedido: PedidoDeCanteiro,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _papel(horta_id, usuario)
    _validar_cultura(pedido.cultura_id)
    try:
        return repo.criar_canteiro(horta_id, **pedido.model_dump())
    except repo.Duplicado:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"já existe um canteiro chamado “{pedido.identificacao}” nesta horta")


@rotas.get("/canteiros/{canteiro_id}")
def detalhar_canteiro(
    canteiro_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    canteiro = _canteiro(canteiro_id, usuario)
    canteiro["manejos"] = repo.listar_manejos(canteiro_id)
    return canteiro


@rotas.patch("/canteiros/{canteiro_id}")
def alterar_canteiro(
    canteiro_id: int,
    pedido: AlteracaoDeCanteiro,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _canteiro(canteiro_id, usuario)
    campos = pedido.model_dump(exclude_unset=True)
    # `data_plantio` e `area_m2` aceitam null de propósito (apagar o valor);
    # `identificacao` e `ativo` não.
    for obrigatorio in ("identificacao", "ativo"):
        if obrigatorio in campos and campos[obrigatorio] is None:
            campos.pop(obrigatorio)
    try:
        return repo.alterar_canteiro(canteiro_id, campos)
    except repo.Duplicado:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "já existe um canteiro com esta identificação nesta horta")


# =============================================================================
# Manejo (US26)
# =============================================================================


@rotas.get("/canteiros/{canteiro_id}/manejos")
def listar_manejos(
    canteiro_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> list[dict]:
    _canteiro(canteiro_id, usuario)
    return repo.listar_manejos(canteiro_id)


@rotas.post("/canteiros/{canteiro_id}/manejos",
            status_code=status.HTTP_201_CREATED)
def registrar_manejo(
    canteiro_id: int,
    pedido: PedidoDeManejo,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    _canteiro(canteiro_id, usuario)

    # Um dia de folga para fuso, como na consulta: aplicação "amanhã" é
    # relógio errado ou planejamento - e planejamento não é registro.
    if pedido.aplicado_em > date.today() + timedelta(days=1):
        raise HTTPException(422,
                            "a data de aplicação não pode estar no futuro")

    if pedido.doenca_id and pedido.doenca_id not in catalogo().doenca_por_id:
        raise HTTPException(422,
                            f"doença desconhecida: {pedido.doenca_id}")

    if pedido.consulta_id is not None and not repo_consultas.pertence_ao_usuario(
            pedido.consulta_id, usuario["id"]):
        raise HTTPException(422,
                            "consulta não encontrada")

    return repo.registrar_manejo(
        canteiro_id, usuario["id"], **pedido.model_dump())

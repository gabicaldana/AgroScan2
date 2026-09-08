"""O caderno de campo: consultas registradas, sincronização e feedback.

O diagnóstico em si não passa por aqui — ele é calculado no aparelho, offline.
Estas rotas guardam o REGISTRO do que foi diagnosticado, que é a parte que
precisa sobreviver à troca de celular e ser vista por mais de uma pessoa.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api import seguranca
from app.api.esquemas import (
    ConsultaResumida,
    PedidoDeConsulta,
    PedidoDeFeedback,
    PedidoDeSincronizacao,
    RespostaDeSincronizacao,
)
from app.api.repositorios import consultas as repo
from app.catalogo import catalogo

rotas = APIRouter(tags=["caderno"])


def _validar(pedido: PedidoDeConsulta) -> None:
    """Recusa referência que o catálogo não conhece, antes de tocar o banco.

    Sem isto o erro viria como violação de chave estrangeira - correto, mas
    ilegível para quem está integrando.
    """
    cat = catalogo()

    if pedido.cultura_id not in cat.cultura_por_id:
        raise HTTPException(422, f"cultura desconhecida: {pedido.cultura_id}")

    desconhecidos = [s for s in pedido.sintomas if s not in cat.sintoma_por_id]
    if desconhecidos:
        raise HTTPException(422, f"sintomas desconhecidos: {desconhecidos}")

    for h in pedido.hipoteses:
        if h.doenca_id not in cat.doenca_por_id:
            raise HTTPException(422, f"doença desconhecida: {h.doenca_id}")


def _gravar(usuario_id: int, pedido: PedidoDeConsulta) -> tuple[dict, bool]:
    _validar(pedido)
    return repo.registrar(
        usuario_id=usuario_id,
        offline_id=str(pedido.offline_id),
        cultura_id=pedido.cultura_id,
        versao_catalogo=pedido.versao_catalogo or catalogo().versao,
        registrada_em=pedido.registrada_em or datetime.now(timezone.utc),
        sintomas=pedido.sintomas,
        hipoteses=[h.model_dump() for h in pedido.hipoteses],
        canteiro_id=pedido.canteiro_id,
        origem=pedido.origem,
        latitude=pedido.latitude,
        longitude=pedido.longitude,
    )


@rotas.post("/consultas", status_code=status.HTTP_201_CREATED)
def registrar_consulta(
    pedido: PedidoDeConsulta,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Grava uma consulta feita no aparelho.

    Idempotente por `offline_id`: reenviar devolve 200 com a consulta original
    em vez de criar outra. É o caso normal, não a exceção — o aparelho não tem
    como saber se a tentativa anterior chegou antes de a conexão cair.
    """
    linha, criada = _gravar(usuario["id"], pedido)
    return {"consulta": linha, "criada": criada}


@rotas.post("/consultas/sincronizar", response_model=RespostaDeSincronizacao)
def sincronizar(
    pedido: PedidoDeSincronizacao,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Sobe a fila acumulada offline, em lote.

    Cada item é tratado por si: uma consulta rejeitada não impede as outras de
    entrarem. O aparelho precisa poder limpar da fila o que foi aceito, e a
    resposta diz exatamente o que aconteceu com cada `offline_id`.
    """
    aceitas, duplicadas, rejeitadas = [], [], []

    for item in pedido.consultas:
        offline_id = str(item.offline_id)
        try:
            _, criada = _gravar(usuario["id"], item)
            (aceitas if criada else duplicadas).append(offline_id)
        except HTTPException as erro:
            rejeitadas.append({"offline_id": offline_id, "motivo": erro.detail})

    return {
        "aceitas": aceitas,
        "duplicadas": duplicadas,
        "rejeitadas": rejeitadas,
    }


@rotas.get("/consultas", response_model=list[ConsultaResumida])
def listar_consultas(
    de: datetime | None = None,
    ate: datetime | None = None,
    cultura_id: str | None = None,
    canteiro_id: int | None = None,
    limite: int = Query(50, ge=1, le=200),
    deslocamento: int = Query(0, ge=0),
    usuario: dict = Depends(seguranca.usuario_atual),
) -> list[dict]:
    return repo.listar(
        usuario["id"], de=de, ate=ate, cultura_id=cultura_id,
        canteiro_id=canteiro_id, limite=limite, deslocamento=deslocamento,
    )


@rotas.get("/consultas/{consulta_id}")
def detalhar_consulta(
    consulta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    consulta = repo.detalhar(usuario["id"], consulta_id)
    if consulta is None:
        # 404 também quando a consulta existe mas é de outra pessoa: um 403
        # confirmaria que aquele id existe.
        raise HTTPException(404, "consulta não encontrada")
    return consulta


@rotas.post("/consultas/{consulta_id}/feedback",
            status_code=status.HTTP_201_CREATED)
def registrar_feedback(
    consulta_id: int,
    pedido: PedidoDeFeedback,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Fecha o laço: o diagnóstico se confirmou?

    É o que transforma o histórico em medida de acurácia percebida — sem isso
    o sistema nunca sabe se acertou.
    """
    if not repo.pertence_ao_usuario(consulta_id, usuario["id"]):
        raise HTTPException(404, "consulta não encontrada")

    if pedido.doenca_confirmada_id:
        if pedido.doenca_confirmada_id not in catalogo().doenca_por_id:
            raise HTTPException(
                422, f"doença desconhecida: {pedido.doenca_confirmada_id}")

    # O banco tem CHECK equivalente; a checagem aqui existe para a mensagem
    # ser legível em vez de uma violação de constraint.
    if pedido.confirmado and pedido.doenca_confirmada_id:
        raise HTTPException(
            422,
            "quando o diagnóstico é confirmado não se informa outra doença - "
            "a doença confirmada é a própria hipótese principal")

    return repo.registrar_feedback(
        consulta_id, usuario["id"], pedido.confirmado,
        pedido.doenca_confirmada_id, pedido.comentario,
    )

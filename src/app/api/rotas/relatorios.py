"""Relatórios da horta (épico E6) e o alerta de rotação (US30).

Leem os canteiros e as consultas da horta, e seguem o ADR 0012: só os membros
os veem, e quem não participa recebe 404. Qualquer membro vê tudo - numa horta
comunitária, o relatório é de quem cuida dela, não só da pessoa responsável.

Os relatórios não afirmam mais do que sabem: com poucos registros, mostram a
contagem e o tamanho da amostra, sem percentuais que pareçam mais sólidos do
que são.
"""

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api import seguranca
from app.api.repositorios import hortas as repo_hortas
from app.api.repositorios import relatorios as repo
from app.api.rotas.hortas import NAO_ENCONTRADA
from app.catalogo import catalogo

rotas = APIRouter(tags=["relatórios"])

# Abaixo disto, a taxa de confirmação não é calculada: 1 de 1 confirmada não é
# "100% de acerto".
AMOSTRA_MINIMA = 5

# Quantos ciclos anteriores do mesmo lugar o alerta de rotação olha. Repetir a
# família no ciclo anterior, ou com um só ciclo de intervalo, mantém o mesmo
# inóculo no solo; o manejo recomenda pelo menos dois ciclos de outra família
# antes de voltar a ela.
CICLOS_RECENTES = 2

# Sem período informado, o relatório de incidência cobre os últimos doze meses
# - uma safra inteira, com as duas estações.
MESES_PADRAO = 12


def _membro(horta_id: int, usuario: dict) -> None:
    if repo_hortas.papel_na_horta(horta_id, usuario["id"]) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, NAO_ENCONTRADA)


def _inicio_padrao(ate: date) -> date:
    """O primeiro dia do mês, MESES_PADRAO - 1 meses antes de `ate`."""
    meses = ate.year * 12 + ate.month - 1 - (MESES_PADRAO - 1)
    return date(meses // 12, meses % 12 + 1, 1)


@rotas.get("/hortas/{horta_id}/relatorios/incidencia")
def incidencia(
    horta_id: int,
    de: date | None = Query(None, description="Primeiro dia, inclusivo."),
    ate: date | None = Query(None, description="Último dia, inclusivo."),
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Quais doenças mais ocorreram, por mês (US27, RF28).

    Conta só a hipótese principal de cada consulta: agregar todas contaria
    como ocorrência a doença que o motor apenas considerou e descartou.
    """
    _membro(horta_id, usuario)
    ate = ate or date.today()
    de = de or _inicio_padrao(ate)
    if de > ate:
        raise HTTPException(422, "o início do período vem depois do fim")
    return {"de": de, "ate": ate, **repo.incidencia(horta_id, de, ate)}


@rotas.get("/hortas/{horta_id}/relatorios/confirmacao")
def confirmacao(
    horta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Taxa de confirmação por doença, sobre os feedbacks registrados (US28,
    RF30).

    A taxa só aparece a partir de AMOSTRA_MINIMA avaliações da doença; abaixo
    disso, `taxa_pct` é nula e o que vale é a contagem.
    """
    _membro(horta_id, usuario)
    return {"amostra_minima": AMOSTRA_MINIMA,
            **repo.confirmacao(horta_id, AMOSTRA_MINIMA)}


@rotas.get("/hortas/{horta_id}/relatorios/rotacao")
def rotacao(
    horta_id: int,
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """Canteiros em cultivo que repetem a família botânica de um dos últimos
    ciclos do mesmo lugar (US30, RF31)."""
    _membro(horta_id, usuario)
    return {"ciclos_recentes": CICLOS_RECENTES,
            "alertas": repo.rotacao(horta_id, CICLOS_RECENTES)}


@rotas.get("/hortas/{horta_id}/canteiros/rotacao")
def rotacao_do_canteiro_novo(
    horta_id: int,
    identificacao: str = Query(..., min_length=1, max_length=120),
    cultura_id: str = Query(...),
    usuario: dict = Depends(seguranca.usuario_atual),
) -> dict:
    """O alerta ANTES do plantio: a cultura que se vai cadastrar neste lugar
    repete a família dos últimos ciclos dele? (US30)

    A tela de cadastro pergunta enquanto a pessoa preenche. É aviso, não
    bloqueio: quem decide plantar é quem está no canteiro.
    """
    _membro(horta_id, usuario)
    cultura = catalogo().cultura_por_id.get(cultura_id)
    if cultura is None:
        raise HTTPException(422, f"cultura desconhecida: {cultura_id}")

    ciclos = repo.ciclos_recentes(horta_id, identificacao.strip(), CICLOS_RECENTES)
    repeticoes = [
        {"cultura_nome": c["cultura_nome"], "data_plantio": c["data_plantio"],
         "ativo": c["ativo"], "ciclos_atras": n}
        for n, c in enumerate(ciclos, start=1)
        if c["familia"] == cultura["familia"]
    ]
    return {
        "familia": cultura["familia"],
        "alerta": bool(repeticoes),
        "repeticoes": repeticoes,
        "ciclos_conhecidos": len(ciclos),
    }

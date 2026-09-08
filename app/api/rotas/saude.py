"""Estado da API: versao, catalogo e banco.

Existe para diagnosticar em cinco segundos no dia da apresentacao. Sem ela, um
banco fora do ar aparece como erro generico numa tela qualquer, e a pessoa
descobre a causa depurando o front.
"""

from fastapi import APIRouter

from app.api import banco, configuracao
from app.api.esquemas import Saude
from app.catalogo import catalogo

rotas = APIRouter(tags=["saude"])


@rotas.get("/saude", response_model=Saude)
def saude() -> Saude:
    estado_do_banco = "nao_configurado"
    migracao = None

    if banco.disponivel():
        try:
            linha = banco.consultar_um(
                "SELECT max(numero) AS numero FROM migracao_aplicada")
            migracao = linha["numero"] if linha else None
            estado_do_banco = "ok"
        except Exception as erro:
            # A mensagem entra na resposta de proposito: e o que transforma
            # "nao funciona" em "a string de conexao esta errada".
            estado_do_banco = f"erro: {type(erro).__name__}: {erro}"

    return Saude(
        versao_api=configuracao.VERSAO_DA_API,
        ambiente=configuracao.AMBIENTE,
        versao_catalogo=catalogo().versao,
        banco=estado_do_banco,
        migracao_aplicada=migracao,
    )

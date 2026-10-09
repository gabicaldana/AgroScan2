"""Estado da API: versao, catalogo e banco.

Existe para diagnosticar em cinco segundos no dia da apresentacao. Sem ela, um
banco fora do ar aparece como erro generico numa tela qualquer, e a pessoa
descobre a causa depurando o front.
"""

import sys

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
            # Em desenvolvimento, a mensagem inteira entra na resposta: e o que
            # transforma "nao funciona" em "a string de conexao esta errada".
            # Em producao, so o tipo - a mensagem traz host, porta e usuario do
            # banco, e esta rota e publica. O detalhe vai para o log da funcao.
            if configuracao.E_PRODUCAO:
                print(f"/saude: falha no banco: {erro!r}", file=sys.stderr)
                estado_do_banco = f"erro: {type(erro).__name__}"
            else:
                estado_do_banco = f"erro: {type(erro).__name__}: {erro}"

    return Saude(
        versao_api=configuracao.VERSAO_DA_API,
        ambiente=configuracao.AMBIENTE,
        versao_catalogo=catalogo().versao,
        banco=estado_do_banco,
        migracao_aplicada=migracao,
    )

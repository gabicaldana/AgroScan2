"""O motor de diagnostico exposto por HTTP.

O app NAO depende deste endpoint: ele calcula o diagnostico no proprio
navegador, porque funcionar sem rede e requisito, nao otimizacao. Esta rota
existe por tres motivos:

  1. a regra de negocio precisa estar visivel na camada de back-end;
  2. qualquer outro cliente obtem exatamente a mesma resposta;
  3. vira o oraculo de paridade em producao - o teste compara esta resposta,
     caso a caso, com as fixtures que o porte em TypeScript tambem reproduz.

Nao tem efeito colateral: consultar nao grava nada. Gravar e POST /consultas.
"""

from dataclasses import asdict

from fastapi import APIRouter, HTTPException

from app.api.esquemas import PedidoDeDiagnostico, RespostaDeDiagnostico
from app.catalogo import catalogo
from app.diagnostico import diagnosticar, melhor_pergunta

rotas = APIRouter(tags=["diagnostico"])


@rotas.post("/diagnosticos", response_model=RespostaDeDiagnostico)
def diagnosticar_por_sintomas(pedido: PedidoDeDiagnostico) -> dict:
    cat = catalogo()
    if pedido.cultura_id not in cat.cultura_por_id:
        raise HTTPException(404, f"cultura desconhecida: {pedido.cultura_id}")

    hipoteses = diagnosticar(pedido.cultura_id, set(pedido.sintomas))
    pergunta = melhor_pergunta(hipoteses)

    return {
        "cultura_id": pedido.cultura_id,
        # A versao acompanha a resposta porque o diagnostico depende dela: o
        # mesmo quadro pontua diferente quando a curadoria avanca, e quem
        # grava a consulta precisa registrar contra qual base ela foi feita.
        "versao_catalogo": cat.versao,
        "hipoteses": [
            {**asdict(h),
             "compatibilidade_pct": h.compatibilidade_pct,
             "rotulo_gravidade": h.rotulo_gravidade}
            for h in hipoteses
        ],
        "pergunta": asdict(pergunta) if pergunta else None,
    }

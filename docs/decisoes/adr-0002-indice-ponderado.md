# ADR 0002 - Índice de similaridade ponderado, e não classificador probabilístico

## Status

Aprovado - implementado e verificado por teste automatizado.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O sistema precisa ordenar hipóteses de doença a partir de um conjunto de
sintomas marcados pelo usuário. Duas famílias de abordagem eram possíveis: um
modelo estatístico treinado sobre casos rotulados, ou uma regra determinística
sobre uma base curada.

Não existe, para este projeto, um conjunto de casos clínicos de hortaliças
brasileiras rotulados e em volume suficiente para treinar e validar um modelo
probabilístico. Treinar sobre dados insuficientes produziria um número com
aparência de probabilidade e sem lastro - exatamente o defeito que o produto
existe para não cometer.

## Decisão

A compatibilidade entre os sintomas observados e uma doença é calculada por um
**índice de similaridade ponderado**, variante do índice de Tversky:

```
                          acertos
compatibilidade = ─────────────────────────────────
                  acertos + faltantes + ruído × 0,5
```

- **acertos** - soma dos pesos dos sintomas marcados que a doença explica
- **faltantes** - soma dos pesos dos sintomas típicos que o usuário não marcou
- **ruído** - quantidade de sintomas marcados que a doença não explica

Cada doença tem um perfil de sintomas com pesos de 0 a 1: `1,0` para o sintoma
clássico, valores menores para os ocasionais. O denominador penaliza os dois
erros possíveis - quadro incompleto e quadro contaminado - com peso menor para o
ruído, porque um sintoma não explicado é evidência mais fraca do que um sintoma
esperado e ausente (RN02).

Hipóteses abaixo de 15% não são apresentadas (RN03).

A interface diz **"compatibilidade"**, nunca "probabilidade" nem "92% de
confiança". Se um modelo de imagem entrar no produto, ele produzirá uma
confiança de verdade, e os dois sinais conviverão rotulados de forma distinta.

**Sintoma de peso zero não existe.** Um sintoma que a doença não apresenta
simplesmente não tem linha no perfil, e essa ausência é informação: é ela que
permite identificar o sintoma não explicado e penalizá-lo.

## Alternativas consideradas

**Classificador probabilístico treinado.** Rejeitada: não há conjunto de casos
rotulados em volume suficiente. Produziria um número sem lastro.

**Contagem simples de sintomas coincidentes.** Rejeitada por duas razões. A
primeira é que trata o sintoma clássico e o ocasional como equivalentes. A
segunda é mais importante: sem pesos, **a pergunta de desempate não existe** -
não há como escolher qual sintoma separa melhor duas hipóteses empatadas.

**Rede bayesiana.** Rejeitada: exigiria probabilidades condicionais que a
literatura fitopatológica não fornece nesse formato, e a curadoria passaria a
depender de estimativas numéricas que o curador não tem como sustentar.

## Consequências

**Positivas**

- A regra é auditável: qualquer resultado pode ser recalculado à mão a partir da base.
- Os pesos codificam agronomia diretamente, e o curador consegue justificar cada um por fonte técnica.
- Os pesos viabilizam a pergunta de desempate (RF06): entre os sintomas que a líder espera e que ainda não foram marcados, o motor escolhe o de maior `peso na líder − peso na segunda`, que é exatamente o quanto a resposta afasta as duas hipóteses.
- O sistema consegue declarar desconhecimento (RF05), porque o limiar é uma propriedade explícita da regra.

**Negativas e custos aceitos**

- A qualidade do resultado depende inteiramente da qualidade da curadoria. Não há aprendizado que compense uma ficha malfeita - daí a validação automática obrigatória (RNF18).
- O sistema não melhora sozinho com o uso. Os feedbacks de confirmação (RF20) alimentam relatórios que orientam a curadoria humana, e não um treinamento automático.
- O coeficiente `0,5` do ruído é uma escolha de projeto, calibrada por julgamento agronômico e não por otimização sobre dados.

## Links relacionados

- Requisitos e regras: RF04, RF05, RF06, RN01, RN02, RN03, RN04, RN08
- Código: `src/app/diagnostico.py` (referência), `src/web/lib/diagnostico.ts` (porte)
- [ADR 0004 - Paridade entre motores](adr-0004-paridade-entre-motores.md)

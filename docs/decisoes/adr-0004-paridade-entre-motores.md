# ADR 0004 - Motor duplicado com paridade verificada por fixtures

## Status

Aprovado - implementado e verificado por teste automatizado.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O ADR 0001 estabeleceu que o diagnóstico roda no navegador. O ADR 0003
estabeleceu que o motor em Python é a referência normativa da regra e a base de
geração das fixtures. A consequência é que **a mesma regra existe agora em três
lugares**:

| Implementação | Papel |
| --- | --- |
| `src/app/diagnostico.py` | Motor puro, sem I/O - a definição normativa |
| `POST /api/v1/diagnosticos` | O mesmo motor, servido por HTTP |
| `src/web/lib/diagnostico.ts` | O porte que roda no navegador, offline |

Duas implementações da mesma regra divergem sozinhas. Três, mais ainda. E a
divergência aqui é especialmente difícil de notar: ela apareceria como um
percentual ligeiramente diferente, ou como duas hipóteses trocando de posição na
ordenação - nada que quebre uma tela.

## Decisão

O contrato entre as implementações é um **arquivo de fixtures gerado pelo Python
e versionado no repositório**: `src/tests/fixtures/casos_diagnostico.json`.

Os casos incluem o perfil completo e o sintoma isolado de **cada** doença da
base, além de casos escolhidos à mão para ruído, ambiguidade, desempate e
limiar. A varredura é automática: uma doença nova entra nas fixtures sozinha,
sem que ninguém escreva um caso.

As três implementações são verificadas contra o mesmo arquivo, **campo a campo,
por igualdade exata**. Sem tolerância numérica.

A ausência de tolerância é deliberada: comparar com tolerância deixaria passar
justamente as divergências reais que o teste existe para pegar.

### Armadilhas de portabilidade tratadas

Três diferenças entre as linguagens apareceram e estão resolvidas no porte:

| Armadilha | Sintoma | Solução |
| --- | --- | --- |
| `sum()` do CPython usa soma compensada de Neumaier; `reduce` do JavaScript soma ingenuamente | `0,7+0,6+0,5+0,3` dá `2.1` num lado e `2.0999999999999996` no outro | O porte replica a compensação |
| `round()` do Python arredonda meio para o par; `Math.round` arredonda meio para cima | 12,5% vira 12% num lado e 13% no outro | O porte replica o meio-para-o-par |
| Ordenar strings por código de caractere joga acento para depois do `z` | "Rúcula" depois de "Salsa" | As duas implementações removem diacríticos (NFD) antes de comparar |

Nenhuma dessas diferenças mudaria um número na tela - erram na décima-sexta casa
decimal ou em um ponto percentual isolado. Mas são exatamente o tipo de
divergência que a igualdade exata existe para expor.

## Alternativas consideradas

**Implementação única compilada para os dois ambientes** (por exemplo,
WebAssembly a partir de uma fonte comum). Rejeitada: acrescentaria uma cadeia de
compilação ao projeto, aumentaria o tamanho do pacote e dificultaria a
depuração, para resolver um problema que as fixtures resolvem com um arquivo
JSON.

**Motor só no cliente, sem referência em Python.** Rejeitada: a validação da
base, a geração das fixtures e o tooling de dados já são Python, e a API precisa
servir diagnóstico para integração. Sem referência normativa, não haveria contra
o que verificar o porte.

**Comparação com tolerância numérica.** Rejeitada: veja acima.

## Consequências

**Positivas**

- Se as três implementações concordam caso a caso, não existe caminho pelo qual o usuário receba um diagnóstico diferente do que a base curada determina.
- Mudar um peso na base sem regerar as fixtures quebra os dois lados - que é o objetivo.
- A cobertura cresce sozinha com a curadoria: doença nova gera caso novo.

**Negativas e custos aceitos**

- A regra precisa ser mantida em duas linguagens. Toda alteração no motor exige alterar os dois lados e regerar as fixtures.
- O porte carrega código que só existe para reproduzir peculiaridades do CPython - soma compensada e arredondamento meio-para-o-par - que um leitor desavisado julgaria desnecessário. Está comentado no código.
- O número de testes cresce com a base, aumentando o tempo de CI. Hoje é irrelevante: 176 testes rodam em segundos.

## Links relacionados

- Requisitos: RNF19, RNF20
- Código: `src/app/diagnostico.py`, `src/app/fixtures.py`, `src/web/lib/diagnostico.test.ts`, `src/tests/test_api.py`
- [Artefato 3, §3 - Testes de integração](../../entregas/artefato-3-gestao-do-produto.md#3-testes-de-integração)
- [ADR 0003 - Base como fonte única](adr-0003-base-como-fonte-unica.md)

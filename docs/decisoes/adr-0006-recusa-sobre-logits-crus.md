# ADR 0006 - Recusa calculada sobre os logits crus

## Status

Aprovado - implementado. Limiares deliberadamente não calibrados até haver
imagens de validação.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

Um classificador de imagem responde a **qualquer** entrada. Fotografe um sapato,
uma parede ou uma folha de uma doença que não está entre as classes treinadas, e
ele devolverá a classe mais parecida com alta confiança. Para este produto, esse
comportamento é inaceitável: o público-alvo decide manejo a partir da resposta.

O sistema precisa, portanto, de uma camada que decida **quando recusar-se a
responder** - detecção de entrada fora da distribuição de treino.

A tentação natural é restringir a saída às classes da cultura informada pelo
usuário e renormalizar as probabilidades. Isso parece melhorar a precisão, e de
fato reduz erros entre culturas. Mas **destrói a confiança como sinal de
fora-da-distribuição**, e o modo como destrói é aritmético:

- renormalizar sobre quatro classes dá à líder um **piso de 25%**, por pior que seja a foto;
- com **uma classe só**, o piso é **100%** - qualquer imagem sai com confiança total.

Esse piso mede como o modelo divide a cultura, e não o quanto ele reconheceu a
imagem.

## Decisão

A camada de recusa recebe os **logits crus**, antes de qualquer máscara por
cultura e antes de qualquer renormalização, e calcula três pontuações que falham
de formas diferentes:

| Pontuação | O que captura | Como falha |
| --- | --- | --- |
| **MSP** - máxima probabilidade softmax | Confiança direta | Satura em modelos muito confiantes |
| **Energia livre** | Magnitude geral da ativação | Não satura |
| **Margem** entre o primeiro e o segundo logit | Hesitação entre classes plausíveis | Não distingue hesitação de desconhecimento total |

As três juntas cobrem os casos em que cada uma isoladamente erraria. Hesitar
entre duas doenças plausíveis é diferente de não reconhecer nada, e a margem é o
que separa os dois casos.

Consequência para o contrato de exportação: o modelo tem de exportar **logits,
nunca softmax**. Com o softmax dentro do grafo, temperatura e energia ficam
impossíveis de calcular no cliente.

**Os limiares estão nulos, de propósito.** Eles saem da curva risco-cobertura
medida sobre imagens de validação. Chutar um número daria ao produtor uma recusa
que não significa nada. Até que existam imagens, o aplicativo calcula as
pontuações e **declara que não está calibrado** (RF11).

O carregador do modelo também recusa executar se a lista de classes do arquivo
não bater com o acervo declarado. O cenário provável é o service worker servir um
modelo antigo junto de um pacote novo: os dois carregam, a inferência roda, cada
índice aponta para a doença errada e nenhuma tela quebra.

## Alternativas consideradas

**Recusa sobre probabilidade renormalizada por cultura.** Rejeitada - é o
problema do piso descrito no contexto.

**Limiar único sobre MSP.** Rejeitada: satura em modelos confiantes, que é
justamente o caso em que a recusa mais importa.

**Chutar limiares plausíveis para ter a funcionalidade "pronta".** Rejeitada:
uma recusa não calibrada é pior que nenhuma, porque dá ao usuário a impressão de
que o sistema sabe reconhecer seus próprios limites quando não sabe.

**Classe "outro" treinada.** Rejeitada: exigiria um conjunto de negativos
representativo do que aparece numa horta, que não existe.

## Consequências

**Positivas**

- A confiança preserva seu significado como sinal de fora-da-distribuição.
- O produto pode declarar honestamente que a identificação por imagem não está disponível, em vez de arriscar um palpite - o que atende RF11 e é coerente com o princípio do ADR 0002.
- A camada está implementada e testada, então quando o modelo existir o caminho ao redor dele já está pronto e verificado.

**Negativas e custos aceitos**

- A funcionalidade permanece inutilizável até haver imagens de validação. O produto foi projetado para ser completo sem ela.
- Três pontuações exigem três limiares, o que multiplica o trabalho de calibração.
- O contrato restringe quem treina o modelo: exportar softmax deixa de ser uma opção.

## Links relacionados

- Requisitos: RF10, RF11
- Riscos: R04 - acervo de imagens não auditado
- Código: `src/web/lib/recusa.ts`, `src/web/lib/classificador.ts`, `src/data/contrato_visao.json`
- [ADR 0005 - Contrato de pré-processamento](adr-0005-contrato-de-preprocessamento.md)

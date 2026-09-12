# ADR 0008 - Diagnóstico por sintomas como tela inicial, e câmera fora da navegação

## Status

**Aprovado e implementado** - Sprint 1.

> A primeira redação deste ADR propunha apenas **reordenar** as abas, mantendo
> a captura por foto como segunda aba. A decisão executada foi mais forte: a
> câmera saiu inteiramente da navegação. O registro abaixo reflete o que foi
> implementado; o motivo da mudança está em "Alternativas consideradas".

## Data

2026-09-12

## Contexto

A tela inicial do aplicativo era "Escanear planta", com a captura por foto como
primeira ação, e o fluxo por sintomas aparecia como alternativa secundária, sob
um separador "ou". A barra de navegação tinha três abas: Escanear, Sintomas e
Caderno.

Essa hierarquia é herança da concepção original do projeto, em que a
identificação por imagem era a funcionalidade central. Duas coisas mudaram
desde então:

1. **O modelo de visão computacional não existe.** É escopo condicionado à auditoria de um acervo de imagens de hortaliças brasileiras ainda não verificado (risco R04), e os limiares de recusa estão deliberadamente nulos (ADR 0006).
2. **O fluxo por sintomas se tornou o produto.** Está implementado, verificado por paridade entre três implementações, funciona offline e cobre toda a base curada.

O efeito prático era o pior possível para o contexto de uso: **a primeira ação
oferecida terminava num aviso de indisponibilidade**, e o aviso só aparecia
*depois* de a pessoa ter fotografado. Para um público de letramento digital
variável, decidindo sob sol e com pressa, isso significa que a primeira
tentativa não resolve - e que o trabalho de enquadrar e fotografar foi perdido.

Havia ainda uma incoerência de documentação: o README do repositório de código
afirma que "o fluxo por sintomas é o produto, a câmera é enriquecimento", o que
a interface contradizia.

## Decisão

**A raiz `/` passa a ser o diagnóstico por sintomas**, e a captura por foto sai
da navegação enquanto não houver modelo de visão.

| Antes | Depois |
| --- | --- |
| Aba 1: Escanear (`/`) - câmera | Aba 1: **Diagnosticar** (`/`) - sintomas |
| Aba 2: Sintomas (`/sintomas`) | *(removida)* |
| Aba 3: Caderno (`/caderno`) | Aba 2: Caderno (`/caderno`) |

**O código do caminho de imagem permanece no repositório.** `PainelScanner`,
`Camera`, `preprocessamento`, `recusa`, `classificador` e
`diagnostico-por-imagem` continuam versionados e cobertos por **29 testes** que
seguem rodando na integração contínua - 13 em Python e 16 em TypeScript. O que
mudou é que nenhuma rota aponta para eles.

A razão para manter e não apagar: o caminho **ao redor** do modelo é o trabalho
difícil e está pronto - captura em resolução nativa, pré-processamento com
paridade de pixel verificada por digest SHA-256 contra a referência em Python, e
camada de recusa calculada sobre os logits crus. Apagar isso para limpar a
interface destruiria trabalho verificado para resolver um problema de
navegação. Quando houver modelo, basta criar a rota e apontar para o componente.

`PainelScanner` carrega um comentário de cabeçalho explicando que está fora da
navegação e por quê, para que um leitor futuro não o tome por código morto.

## Alternativas consideradas

**Reordenar as abas, mantendo a foto como segunda aba** *(proposta original
deste ADR)*. Rejeitada na execução. Melhoraria a primeira impressão, mas manteria
na barra inferior - a zona mais valiosa da tela, alcançável pelo polegar - uma
aba cujo único desfecho possível é um aviso de indisponibilidade. Numa barra de
três abas, um terço do espaço de navegação permanente estaria reservado para
algo que não funciona.

**Manter a captura por foto como tela inicial.** Rejeitada: é o problema descrito
no contexto. O argumento a favor seria que a foto é o fluxo mais intuitivo e o
que o usuário espera de um aplicativo assim - mas um fluxo intuitivo que não
entrega resposta é pior do que um fluxo com um passo a mais que entrega.

**Apagar o código do caminho de imagem.** Rejeitada: custaria 29 testes, dois
ADRs (0005 e 0006), o caso de integração TI06 e o pacote 6 da EAP, sem nenhum
ganho para o usuário - a interface fica igual, com ou sem o código no
repositório.

**Unificar numa única tela com as duas entradas.** Rejeitada para esta sprint:
aumentaria a densidade da tela inicial, o que contraria as decisões do sistema de
design para uso sob sol e com pressa. Pode ser reconsiderada quando o modelo
existir e as duas entradas tiverem peso comparável.

## Consequências

**Positivas**

- A primeira ação oferecida passa a ser a que funciona.
- A interface passa a concordar com a documentação do produto.
- Ninguém mais fotografa para depois descobrir que a foto não será analisada.
- A barra de navegação deixa de reservar espaço permanente para uma funcionalidade indisponível.
- O trabalho de engenharia do caminho de imagem é preservado e continua verificado.

**Negativas e custos aceitos**

- **A rota `/sintomas` deixou de existir.** Ela estava em três lugares fora do nosso alcance: o atalho de quem já instalou o PWA, o cache do service worker de quem ainda não atualizou, e qualquer link já compartilhado. Tratado com um redirecionamento permanente de `/sintomas` para `/`.
- **O service worker precisou subir de `v4` para `v5`.** Sem trocar o nome do cache, quem já tem o aplicativo instalado continuaria abrindo a tela de câmera offline por tempo indeterminado, porque a casca antiga está gravada no dispositivo.
- `PainelScanner` e `Camera` ficam sem rota que os alcance. Mitigado pelo comentário de cabeçalho que explica a situação.
- Usuários que já tinham o aplicativo instalado encontram a navegação alterada, sem aviso prévio.

## Verificação

Após a implementação, em 12/09/2026:

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | ✅ sem apontamentos |
| `npm run build` | ✅ 7 rotas geradas; `/sintomas` ausente, como esperado |
| `npm test` | ✅ 102 testes, nenhuma falha |
| `python -m unittest discover -s tests -t .` | ✅ 74 testes, nenhuma falha |
| Testes do caminho de imagem preservados | ✅ 29 testes seguem executando |

## Links relacionados

- Requisitos: RF10, RF11
- Riscos: R04 - acervo de imagens não auditado
- Histórias: US37
- [ADR 0006 - Recusa sobre logits crus](adr-0006-recusa-sobre-logits-crus.md)
- [Artefato 3, §1 - Arquitetura da informação](../artefato-3-gestao-do-produto.md#1-arquitetura-da-informação)
- Código alterado: `web/app/page.tsx`, `web/components/BarraInferior.tsx`, `web/components/Laudo.tsx`, `web/components/PainelCaderno.tsx`, `web/next.config.ts`, `web/public/sw.js`
- Código preservado fora da navegação: `web/components/PainelScanner.tsx`, `web/components/Camera.tsx`, `web/lib/preprocessamento.ts`, `web/lib/recusa.ts`, `web/lib/classificador.ts`, `web/lib/diagnostico-por-imagem.ts`

# Reunião - Sprint 3 · Planejamento

Reunião de abertura da **Sprint 3 - Horta, canteiros e manejo** (29/09/2026 a 12/10/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

29/09/2026

> A data corresponde ao primeiro dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | ⚠️ a definir |
| Thaís Regina Dias da Mota | 22403754 | ⚠️ a definir |

> A distribuição nominal dos papéis Scrum está pendente, conforme
> [`sprints/sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).

## Pauta

1. Revisão do resultado da sprint anterior e dos impedimentos herdados
2. Definição da meta da sprint
3. Seleção das histórias da milestone e conferência dos critérios de aceite
4. Conferência da capacidade da dupla para o período
5. Divisão de responsabilidades entre desenvolvimento e curadoria agronômica
6. Riscos ativos e mitigações do ciclo

## Decisões

### Itens previstos para o ciclo

Selecionados da `milestone` **Sprint 3 - Horta, canteiros e manejo**, mais a
republicação que a Sprint 2 não conseguiu fechar.

| Issue | Item | Tipo | Pts |
| --- | --- | --- | --- |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Doenças das cucurbitáceas | História | 8 |
| [#25](https://github.com/CampusCEUB/AgroScan/issues/25) | US22 - Cadastrar minha horta | História | 3 |
| [#26](https://github.com/CampusCEUB/AgroScan/issues/26) | US23 - Associar outras pessoas à horta | História | 5 |
| [#27](https://github.com/CampusCEUB/AgroScan/issues/27) | US24 - Cadastrar canteiros com a cultura plantada | História | 3 |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro | História | 3 |
| [#29](https://github.com/CampusCEUB/AgroScan/issues/29) | US26 - Registrar o manejo que apliquei | História | 5 |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicar o ambiente e conferir a versão do catálogo | Correção (R06) - vinda da Sprint 2 | - |

**Meta do ciclo:** horta, membros, canteiros e manejo funcionando ponta a ponta
(API, telas e ambiente publicado); cucurbitáceas curadas.

**6 histórias, 27 pontos** - a maior carga entre as sprints restantes.

### Escopo e prioridade

- **A US04 fica só com as cucurbitáceas** (pepino, abobrinha, abóbora e jiló). A outra metade do critério, elevar batata e pimentão, foi entregue na Sprint 2 ([#70](https://github.com/CampusCEUB/AgroScan/issues/70)).
- **A publicação vem primeiro.** Sem a API no ar, as histórias do E5 não passam no critério C11 (o publicado reflete a versão entregue), e o caderno segue inutilizável fora da máquina de desenvolvimento.
- **Ordem de corte do ciclo:** se a capacidade apertar, a **US26** (manejo) sai antes das demais, conforme o Artefato 2, §3.4. US22, US24 e US25 são intocáveis, porque a Sprint 4 depende delas.

### Modelagem do épico E5

- **O ponto de partida é o esquema da migração 001**, que já tem `horta`, `membro_horta`, `canteiro` e `manejo`. O ciclo constrói rotas, regras de acesso e telas, não tabelas novas.
- **As regras de acesso viram ADR antes de virar código**, porque a horta é o primeiro dado compartilhado entre pessoas. A pergunta a responder: quem vê, quem altera e o que acontece quando alguém sai, inclusive do sistema.
- **Canteiro é encerrado, não apagado, e tem cultura fixa.** É a sucessão de canteiros encerrados que vai alimentar o alerta de rotação (US30) na Sprint 4.
- **O vínculo consulta-canteiro precisa funcionar sem rede**, como o resto do caderno: a lista de canteiros fica guardada no aparelho.
- **Cada rota nova ganha teste de contrato HTTP**, incluindo as recusas por papel.

### Curadoria agronômica

- **A conferência das 18 fichas das brássicas** contra as fontes é feita na primeira semana, antes da curadoria nova, como ajuste da retrospectiva da Sprint 2.
- **As cucurbitáceas seguem o mesmo método por família**: um levantamento para os patógenos comuns, com as diferenças de órgão e de efeito econômico descritas por cultura.

### Dependência com a Sprint 4

Os relatórios da Sprint 4 leem os canteiros e as consultas criados aqui. Atraso
em US24 ou US25 desloca o início do épico E6, e isso foi aceito como o risco
principal de cronograma do ciclo.

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Issue |
| --- | --- | --- | --- | --- |
| 1 | Publicar a API e conferir no ambiente: cadastro, login, caderno e versão do catálogo | Ambas | Primeira semana do ciclo | [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |
| 2 | Registrar em ADR as regras de acesso à horta e o efeito na exclusão de conta | Ambas | Antes do código do E5 | - |
| 3 | Rotas e telas de horta e membros | Ambas | 12/10/2026 | [#25](https://github.com/CampusCEUB/AgroScan/issues/25), [#26](https://github.com/CampusCEUB/AgroScan/issues/26) |
| 4 | Rotas e telas de canteiros, e vínculo da consulta ao canteiro | Ambas | 12/10/2026 | [#27](https://github.com/CampusCEUB/AgroScan/issues/27), [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| 5 | Registro de manejo | Ambas | 12/10/2026 | [#29](https://github.com/CampusCEUB/AgroScan/issues/29) |
| 6 | Conferir as fichas das brássicas contra as fontes | Ambas | 05/10/2026 | [#6](https://github.com/CampusCEUB/AgroScan/issues/6) |
| 7 | Curadoria das cucurbitáceas, com revisão cruzada | Ambas | 12/10/2026 | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 8 | Atualizar as actions do CI | Ambas | Antes de 19/10/2026 | - |
| 9 | Atribuir nominalmente os papéis Scrum | Ambas | 12/10/2026 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |

## Impedimentos

| # | Impedimento | Efeito | Situação na abertura |
| --- | --- | --- | --- |
| 1 | Vercel ligada ao repositório antigo | O publicado não reflete o código do institucional; #67 bloqueada | Aberto - prioridade do ciclo |
| 2 | Comunidade parceira da Atividade de Extensão não definida (R03) | Impede fixar a priorização das famílias botânicas | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 3 | Datas dos Artefatos 5 a 9 não divulgadas | O calendário das Sprints 5 a 8 é provisório | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 4 | Papéis Scrum não atribuídos nominalmente | Os registros seguem sem responsável nominal | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 3 - Horta, canteiros e manejo` |
| Issue desta reunião | [#54](https://github.com/CampusCEUB/AgroScan/issues/54) |
| Relatório da sprint | [`sprints/sprint-03.md`](../../sprints/sprint-03.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

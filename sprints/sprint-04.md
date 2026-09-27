# Sprint 4 - Relatórios agregados

## Período

**13/10/2026 a 26/10/2026** (14 dias)

## Objetivo

Transformar o histórico acumulado em informação de decisão. A sprint entrega os
quatro relatórios agregados do épico E6 - incidência por período, taxa de
confirmação, sintomas mais marcados por cultura e alerta de repetição de família
botânica -, que leem os canteiros e as consultas criados na Sprint 3.

O alerta de rotação (US30) é o primeiro item do sistema que **antecipa** um
problema em vez de reagir a ele: avisa antes do plantio, a partir do histórico
do canteiro.

## Milestone

[**Sprint 4 - Relatórios agregados**](https://github.com/CampusCEUB/AgroScan/milestone/4) -
prazo em 26/10/2026, com 6 `issues`.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 13/10/2026 | [#56](https://github.com/CampusCEUB/AgroScan/issues/56) | [`sprint-04-planejamento.md`](../docs/reunioes/sprint-04-planejamento.md) |
| Revisão | 26/10/2026 | [#57](https://github.com/CampusCEUB/AgroScan/issues/57) | [`sprint-04-revisao.md`](../docs/reunioes/sprint-04-revisao.md) |

## Itens planejados

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#30](https://github.com/CampusCEUB/AgroScan/issues/30) | US27 - Ver quais doenças mais ocorreram na horta | E6 | 5 | Importante |
| [#31](https://github.com/CampusCEUB/AgroScan/issues/31) | US28 - Saber a taxa de confirmação dos diagnósticos | E6 | 3 | Desejável |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | US29 - Saber quais sintomas são mais marcados em cada cultura | E6 | 3 | Desejável |
| [#33](https://github.com/CampusCEUB/AgroScan/issues/33) | US30 - Ser alertado sobre repetição de família botânica | E6 | 5 | Importante |

**4 histórias, 16 pontos.**

### Requisitos cobertos

RF28 a RF31, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

### Curadoria em paralelo

O calendário do
[Artefato 2, §3.2](../entregas/artefato-2-gestao-do-projeto.md#32-calendário)
prevê para este ciclo o avanço da curadoria das apiáceas e amarilidáceas, como
parte parcial da US05.

> ⚠️ **Divergência a resolver no planejamento.** A `issue` da US05
> ([#8](https://github.com/CampusCEUB/AgroScan/issues/8)) está alocada
> integralmente à `milestone` da Sprint 5, enquanto o backlog do Artefato 2
> registra a história como "4-5". O avanço feito neste ciclo deve ser anotado na
> própria `issue`, ou a `issue` deve ser dividida, para que a curadoria destas
> duas semanas não fique sem registro.

## Responsáveis

| Item | Responsável |
| --- | --- |
| Consultas de agregação e rotas dos relatórios (US27-US29) | Ambas as integrantes |
| Alerta de rotação de culturas (US30) | Ambas as integrantes |
| Curadoria das apiáceas e amarilidáceas | Ambas as integrantes, com revisão cruzada |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.**

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.** Os relatórios exigem evidência
> de que a agregação confere: comparar o resultado de cada consulta com uma
> contagem manual sobre um conjunto conhecido de registros.

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Volume de dados de teste** | Relatórios agregados sobre base vazia não demonstram nada na revisão | A tratar no planejamento - prever carga de registros de exemplo |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das sprints seguintes é provisório | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R01 - volume da curadoria agronômica** | Restam as famílias de maior dispersão, sem o ganho de escala das brássicas | Ordem de corte da seção 3.4: US29 e US30 saem antes do núcleo |
| **R05 - esgotamento de conexões do banco** | Consultas de agregação são mais pesadas que as de leitura simples | Conexão agrupada; avaliar índices sobre as colunas de filtro |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 26/10/2026.**

## Próximas ações

### Preparação da Sprint 5 (27/10 - 09/11)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Definir quais indicadores dos relatórios viram painel visual (US41) | Artefato 9 |
| 2 | Levantar o escopo da auditoria do acervo Digipathos (US38) | R04 |
| 3 | Planejar o fechamento da base em 24 culturas e 88 doenças | Meta do épico E1 |

> **Nota.** A US41 (dashboards) depende dos indicadores construídos nesta
> sprint: o painel visual apresenta as mesmas agregações, em outra forma.

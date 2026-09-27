# Sprint 3 - Horta, canteiros e manejo

## Período

**29/09/2026 a 12/10/2026** (14 dias)

## Objetivo

Sair do diagnóstico isolado e dar ao produtor um lugar onde o registro se
organiza: a horta, seus canteiros e o manejo aplicado. É a sprint que introduz o
épico E5 por inteiro e cria a estrutura de dados sobre a qual os relatórios da
Sprint 4 serão calculados - sem canteiro cadastrado não há agregação por
período nem alerta de rotação.

Em paralelo, a curadoria avança pelas cucurbitáceas e fecha as solanáceas.

## Milestone

[**Sprint 3 - Horta, canteiros e manejo**](https://github.com/CampusCEUB/AgroScan/milestone/3) -
prazo em 12/10/2026, com 8 `issues`.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 29/09/2026 | [#54](https://github.com/CampusCEUB/AgroScan/issues/54) | [`sprint-03-planejamento.md`](../docs/reunioes/sprint-03-planejamento.md) |
| Revisão | 12/10/2026 | [#55](https://github.com/CampusCEUB/AgroScan/issues/55) | [`sprint-03-revisao.md`](../docs/reunioes/sprint-03-revisao.md) |

## Itens planejados

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Cadastrar as doenças das cucurbitáceas e fechar as solanáceas | E1 | 8 | Obrigatório |
| [#25](https://github.com/CampusCEUB/AgroScan/issues/25) | US22 - Cadastrar minha horta | E5 | 3 | Importante |
| [#26](https://github.com/CampusCEUB/AgroScan/issues/26) | US23 - Associar outras pessoas à horta | E5 | 5 | Importante |
| [#27](https://github.com/CampusCEUB/AgroScan/issues/27) | US24 - Cadastrar canteiros com a cultura plantada | E5 | 3 | Importante |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro | E5 | 3 | Importante |
| [#29](https://github.com/CampusCEUB/AgroScan/issues/29) | US26 - Registrar o manejo que apliquei | E5 | 5 | Desejável |

**6 histórias, 27 pontos** - a maior carga de pontos entre as sprints
restantes.

### Requisitos cobertos

RF23 a RF27, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

## Responsáveis

| Item | Responsável |
| --- | --- |
| Curadoria das cucurbitáceas e solanáceas (US04) | Ambas as integrantes, com revisão cruzada |
| Rotas e modelo de dados de horta, membros e canteiros (US22-US24) | Ambas as integrantes |
| Vínculo consulta-canteiro e registro de manejo (US25, US26) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.**

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.**

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | Impede fixar a priorização das famílias botânicas na curadoria | Herdado - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das sprints seguintes é provisório | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R01 - volume da curadoria agronômica** | A US04 soma cucurbitáceas e o fechamento das solanáceas no mesmo ciclo, junto com 19 pontos de desenvolvimento | Curadoria por família; ordem de corte da seção 3.4 do Artefato 2, que sacrifica US26 antes das demais |
| **R05 - esgotamento de conexões do banco** | O épico E5 acrescenta tabelas e consultas novas ao PostgreSQL | Conexão agrupada em tempo de execução, já adotada |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 12/10/2026.**

## Próximas ações

### Preparação da Sprint 4 (13/10 - 26/10)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Conferir que os canteiros têm histórico suficiente para as agregações dos relatórios | Dependência E5 → E6 |
| 2 | Definir as consultas SQL dos quatro relatórios agregados | Épico E6 |

> **Dependência.** Os relatórios da Sprint 4 leem os dados criados por esta
> sprint. Atraso em US24 ou US25 desloca o início do épico E6.

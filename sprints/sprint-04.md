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

### Conferência agronômica das brássicas

Encaminhamento herdado das revisões das Sprints 2 e 3, feito em 18/10/2026. As
18 fichas da US03 foram conferidas contra fontes técnicas, e a base passou para
a versão `2026.10.18`. Detalhe e fontes em
[`docs/curadoria/conferencia-brassicas.md`](../docs/curadoria/conferencia-brassicas.md).

| Correção | Fichas |
| --- | --- |
| Cúpricos retirados: não há produto registrado no MAPA para a podridão-negra em brássicas | 4 |
| Ciazofamida incluída na hérnia, com registro para o alvo; a ficha dizia que nenhum produto controla o patógeno | 2 |
| Agente da alternariose em *Brassica oleracea*: *A. brassicicola* e *A. brassicae* | 3 |
| Agente e manejo cultural do míldio do agrião | 1 |

Sintomas e pesos não mudaram, e o diagnóstico de cada caso continua o mesmo.
**A carga da `2026.10.18` no Neon precisa ser aplicada antes da publicação do
app**, ou as consultas novas são recusadas pelo banco.

Ficam para o planejamento da Sprint 5 o registro por cultura dos demais
ingredientes ativos no AGROFIT e a decisão sobre levar as fontes para dentro
da base, como pede o critério da US03.

### Conferência das consultas do `modelo-de-dados.md` §6

Encaminhamento 5 do planejamento, feito em 24/10/2026. As consultas foram
executadas, como estavam escritas, num PostgreSQL 16 com a carga de exemplo, e
comparadas com a contagem manual. Três das cinco tinham defeito; o detalhe
está no [§6.6](../docs/modelo-de-dados.md).

| Consulta | Defeito | Correção |
| --- | --- | --- |
| 6.1 incidência | Mês pelo fuso da sessão (UTC): a consulta das 23h30 do dia 31 caía no mês seguinte | Fuso de Brasília |
| 6.2 confirmação | Sem filtro de horta; agrupava pelo nome da doença | Filtro pela horta; agrupamento pelo id |
| 6.4 rotação | Não encontrava nada: o nome do canteiro era único também entre os encerrados | Migração 004 e [ADR 0013](../docs/decisoes/adr-0013-sucessao-de-canteiros-e-alerta-de-rotacao.md) |

A conferência achou também que `python -m app.seed` abortava em todo banco
novo, e o defeito foi corrigido.

### Carga de registros de exemplo

Encaminhamento 4, que resolve o impedimento 1. `python -m app.exemplo` cria uma
conta de demonstração com uma horta, oito canteiros em sucessão, 27 consultas
de abril a outubro de 2026 e 21 feedbacks. As hipóteses são calculadas pelo
motor. O conjunto é fixo, e é sobre ele que a contagem manual foi feita.
**A carga no Neon fica com a Gabriela**, depois da migração 004 (comandos no
pull request).

### Relatórios e alerta de rotação

| História | Entrega | Situação |
| --- | --- | --- |
| US25 | Filtro por canteiro no caderno, no aparelho e sem rede | Em revisão |
| US27 | Incidência por mês e doença, com período de 3, 6 ou 12 meses | Em revisão |
| US28 | Confirmação por doença; a taxa só a partir de 5 avaliações | Em revisão |
| US30 | Alerta no cadastro do canteiro, antes do plantio, e lista dos canteiros que repetem a família | Em revisão |
| US29 | - | Não iniciada: primeira da ordem de corte |
| US04 | - | Curadoria das cucurbitáceas com a equipe |

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

Os relatórios exigem evidência de que a agregação confere: comparar o
resultado de cada consulta com uma contagem manual sobre um conjunto conhecido
de registros.

[`src/tests/test_relatorios_banco.py`](../src/tests/test_relatorios_banco.py)
carrega a carga de exemplo num PostgreSQL 16 e compara cada relatório com as
tabelas contadas à mão a partir da lista de consultas. Roda no CI, num serviço
`postgres:16`.

| Relatório | Contagem manual conferida |
| --- | --- |
| Incidência (US27) | 22 pares (mês, doença), 25 consultas na horta; a de 31/05 às 23h30 em maio |
| Confirmação (US28) | Requeima do tomate 6 de 7 (85,7%), pinta-preta 3 de 5 (60,0%), seis doenças sem amostra para taxa; as 2 consultas sem canteiro fora |
| Rotação (US30) | Alerta no Canteiro 1 (pimentão depois de tomate) e no Canteiro 3 (couve dois ciclos depois de repolho); nenhum no Canteiro 2 e na Estufa A |

> ⚠️ **Demais evidências a preencher no encerramento da sprint.**

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Volume de dados de teste** | Relatórios agregados sobre base vazia não demonstram nada na revisão | Resolvido em 24/10 com a carga de exemplo; falta aplicá-la no Neon |
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

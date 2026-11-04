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

> **Resolvido no planejamento.** As cucurbitáceas (US04) tiveram prioridade
> sobre as apiáceas e amarilidáceas, e a US05
> ([#8](https://github.com/CampusCEUB/AgroScan/issues/8)) seguiu inteira na
> `milestone` da Sprint 5, sem ser dividida. Não houve avanço nas apiáceas e
> amarilidáceas neste ciclo.

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
pull request). A migração 004 foi aplicada em 04/11/2026; a carga de exemplo
segue pendente, como encaminhamento da revisão.

### Relatórios e alerta de rotação

| História | Entrega | Situação |
| --- | --- | --- |
| US25 | Filtro por canteiro no caderno, no aparelho e sem rede | ✅ Aceita - PR #91 |
| US27 | Incidência por mês e doença, com período de 3, 6 ou 12 meses | ✅ Aceita - PR #92 |
| US28 | Confirmação por doença; a taxa só a partir de 5 avaliações | ✅ Aceita - PR #92 |
| US30 | Alerta no cadastro do canteiro, antes do plantio, e lista dos canteiros que repetem a família | ✅ Aceita - PR #92 |
| US04 | Pepino, abobrinha, abóbora e jiló, base `2026.10.24` | ✅ Aceita em 04/11, com a carga no Neon - PR #93 |
| US29 | - | ❌ Não iniciada: primeira da ordem de corte. Realocada à Sprint 5 |

### Curadoria das cucurbitáceas e do jiló - base `2026.10.24`

Encaminhamento 1, feito em 24/10/2026. A base passa de 9 para 13 culturas e de
34 para 53 doenças, com 8 sintomas novos (de 30 para 38). Cada ficha parte de
uma publicação técnica, e os ingredientes ativos foram conferidos contra os
dados abertos do AGROFIT, cultura a cultura e alvo a alvo. O jiló entrou como
solanácea, e não como cucurbitácea. Detalhe e fontes em
[`docs/curadoria/curadoria-cucurbitaceas-e-jilo.md`](../docs/curadoria/curadoria-cucurbitaceas-e-jilo.md).

## Issues concluídas

| Issue | Título | Como foi verificada |
| --- | --- | --- |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro | Filtro por canteiro em `lib/filtro-caderno.test.ts`, combinado com o de período; roteiro em modo avião (PR #91) |
| [#30](https://github.com/CampusCEUB/AgroScan/issues/30) | US27 - Ver quais doenças mais ocorreram na horta | Contagem manual da incidência em `tests/test_relatorios_banco.py`, em PostgreSQL 16 |
| [#31](https://github.com/CampusCEUB/AgroScan/issues/31) | US28 - Saber a taxa de confirmação dos diagnósticos | Contagem manual da confirmação, no mesmo teste |
| [#33](https://github.com/CampusCEUB/AgroScan/issues/33) | US30 - Ser alertado sobre repetição de família botânica | Contagem manual do alerta de rotação, no mesmo teste; migração 004 e ADR 0013 |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Cadastrar as doenças das cucurbitáceas e fechar as solanáceas | `python -m app.validacao` sem aviso da RN05; paridade entre os motores nos 122 casos; `/saude` publicado com `2026.10.24` e `catalogo_no_banco: true` em 04/11 |
| [#56](https://github.com/CampusCEUB/AgroScan/issues/56) | Reunião - Sprint 4 · Planejamento | Ata em [`sprint-04-planejamento.md`](../docs/reunioes/sprint-04-planejamento.md) |
| [#57](https://github.com/CampusCEUB/AgroScan/issues/57) | Reunião - Sprint 4 · Revisão | Ata em [`sprint-04-revisao.md`](../docs/reunioes/sprint-04-revisao.md) |

### Não concluídas - realocadas à Sprint 5

| Issue | Título | O que falta |
| --- | --- | --- |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | US29 - Saber quais sintomas são mais marcados em cada cultura | Não iniciada |
| [#72](https://github.com/CampusCEUB/AgroScan/issues/72) | Atribuir nominalmente os papéis Scrum | Definição pela equipe |
| [#73](https://github.com/CampusCEUB/AgroScan/issues/73) | Definir a comunidade parceira da Atividade de Extensão | Resposta da coordenação |
| [#74](https://github.com/CampusCEUB/AgroScan/issues/74) | Confirmar as datas dos Artefatos 5 a 9 e a existência do Artefato 4 | Resposta da professora |

**5 histórias aceitas, 24 de 27 pontos planejados.** O núcleo chega a 144 de
172 pontos (84%), como registra a totalização do
[Artefato 2](../entregas/artefato-2-gestao-do-projeto.md#pontos-concluídos-até-o-encerramento-da-sprint-4).

## Pull requests aceitos

| PR | Conteúdo | Issue |
| --- | --- | --- |
| [#87](https://github.com/CampusCEUB/AgroScan/pull/87) | Encerramento das Sprints 1 a 3: relatórios, atas e realocações | - |
| [#88](https://github.com/CampusCEUB/AgroScan/pull/88) | Remove os avisos de revisão; encerramento das milestones 2 e 3 | [#41](https://github.com/CampusCEUB/AgroScan/issues/41), [#52](https://github.com/CampusCEUB/AgroScan/issues/52)-[#56](https://github.com/CampusCEUB/AgroScan/issues/56) |
| [#90](https://github.com/CampusCEUB/AgroScan/pull/90) | Conferência agronômica das brássicas, base `2026.10.18` | - |
| [#91](https://github.com/CampusCEUB/AgroScan/pull/91) | Filtro por canteiro no caderno | [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| [#92](https://github.com/CampusCEUB/AgroScan/pull/92) | Relatórios da horta, alerta de rotação, conferência do §6, migração 004 e carga de exemplo | [#30](https://github.com/CampusCEUB/AgroScan/issues/30), [#31](https://github.com/CampusCEUB/AgroScan/issues/31), [#33](https://github.com/CampusCEUB/AgroScan/issues/33) |
| [#93](https://github.com/CampusCEUB/AgroScan/pull/93) | Cucurbitáceas e jiló, base `2026.10.24` | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |

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

### Testes automatizados - `main` em `f89f997`, 04/11/2026

```text
$ cd src && python -m pytest -q
131 passed, 9 skipped

$ cd src/web && npm test
ℹ tests 291
ℹ fail 0
```

**Total: 431 testes, nenhuma falha.** Os 9 pulados localmente são os de
`tests/test_relatorios_banco.py`, que precisam de um PostgreSQL e rodam no CI.
Subiu de 331 no encerramento da Sprint 3.

### Integração contínua

[Execução #40316962883](https://github.com/CampusCEUB/AgroScan/actions/runs/40316962883)
no `main`, após o merge do PR #91, com o serviço `postgres:16`: **`success`**.

### Ambiente publicado - conferido em 04/11/2026

```text
$ curl https://agroscan-blond.vercel.app/api/v1/saude
{"versao_api":"1.0.0","ambiente":"producao","versao_catalogo":"2026.10.24",
 "banco":"ok","migracao_aplicada":4,"catalogo_no_banco":true}
```

A carga foi ensaiada antes num PostgreSQL embutido (PGlite) igual ao de
produção, com a migração 3 e o catálogo `2026.10.18`: os dois arquivos gerados
por `--gerar-sql --desde-migracao 4 --separar` levaram o banco à migração 4,
com 13 culturas, 53 doenças e 38 sintomas, e uma segunda execução deixou o
banco no mesmo estado. O espelho `gabicaldana/AgroScan2` foi avançado para
`f89f997`, o mesmo hash do institucional (ADR 0011).

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Volume de dados de teste** | Relatórios agregados sobre base vazia não demonstram nada na revisão | Resolvido em 24/10 com a carga de exemplo; falta aplicá-la no Neon |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das sprints seguintes é provisório | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | **Comunidade parceira não definida** (R03) | A Sprint 6 inteira depende dela | Herdado - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 4 | **Produção defasada em relação ao `main`** (R06) | O publicado serviu a Sprint 3 de 26/10 a 04/11 | ✅ Resolvido em 04/11 - migração 004 e catálogo `2026.10.24` no Neon, espelho em `f89f997` |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R01 - volume da curadoria agronômica** | Restam as famílias de maior dispersão, sem o ganho de escala das brássicas | Ordem de corte da seção 3.4: US29 e US30 saem antes do núcleo |
| **R05 - esgotamento de conexões do banco** | Consultas de agregação são mais pesadas que as de leitura simples | Conexão agrupada; avaliar índices sobre as colunas de filtro |

## Retrospectiva

Registrada na [ata da revisão](../docs/reunioes/sprint-04-revisao.md#retrospectiva---o-que-funcionou).

**Funcionou:** conferir as consultas do §6 num PostgreSQL real antes de
construir sobre elas (três defeitos em cinco); a carga de exemplo como
demonstração e teste ao mesmo tempo; teste em banco real no CI; a conferência
das brássicas no prazo; a ordem de corte, que tirou só a US29.

**Não funcionou:** todos os commits de código são de 24/10, a dois dias do fim,
pela terceira sprint seguida; a curadoria não começou na primeira semana; a
produção ficou 9 dias atrás do `main`; o teste do `offline_id` em banco real
foi adiado pela segunda vez; #73 e #74 não andaram.

**Ajustes:** o C11 passa a fazer parte do aceite na revisão; um PR por semana,
no mínimo; curadoria começada até o quarto dia; o teste do `offline_id` como
item próprio da Sprint 5; pedidos por escrito à professora e à coordenação.

## Próximas ações

### Preparação da Sprint 5 (27/10 - 09/11)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Definir quais indicadores dos relatórios viram painel visual (US41) | Artefato 9 |
| 2 | Levantar o escopo da auditoria do acervo Digipathos (US38) | R04 |
| 3 | Planejar o fechamento da base em 24 culturas e 88 doenças | Meta do épico E1 |

> **Nota.** A US41 (dashboards) depende dos indicadores construídos nesta
> sprint: o painel visual apresenta as mesmas agregações, em outra forma.

# Reunião - Sprint 4 · Revisão

Reunião de encerramento da **Sprint 4 - Relatórios agregados** (13/10/2026 a 26/10/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

26/10/2026

> A data corresponde ao último dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).
> Os pull requests #91, #92 e #93 foram aceitos nesse dia. A carga no banco de
> produção e a republicação, sem as quais a US04 não fecha, só foram feitas em
> 04/11/2026, e o aceite da US04 e o critério C11 estão registrados com essa data.

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | ⚠️ a definir |
| Thaís Regina Dias da Mota | 22403754 | ⚠️ a definir |

> A distribuição nominal dos papéis Scrum continua pendente
> ([#72](https://github.com/CampusCEUB/AgroScan/issues/72)) e foi realocada à Sprint 5.

## Pauta

1. Demonstração do incremento construído no ciclo
2. Aceite história a história contra os critérios de aceite e o Definition of Done
3. Conferência de que o ambiente publicado reflete a versão entregue (critério C11)
4. Retrospectiva: o que funcionou, o que não funcionou, ajustes de processo
5. Atualização do relatório da sprint e do CHANGELOG
6. Encaminhamentos para o planejamento do ciclo seguinte

## Decisões

### Aceite do incremento

Registro completo em [`sprints/sprint-04.md`](../../sprints/sprint-04.md).

| Issue | Item | Decisão | Verificação |
| --- | --- | --- | --- |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | **US25** - Vincular a consulta ao canteiro | ✅ Aceita | Filtro por canteiro na tela do caderno, no aparelho e sem rede, ao lado dos de período e cultura; canteiro encerrado continua aparecendo pelo nome (PR #91) |
| [#30](https://github.com/CampusCEUB/AgroScan/issues/30) | **US27** - Ver quais doenças mais ocorreram na horta | ✅ Aceita | Incidência por mês e doença, com período de 3, 6 ou 12 meses; 22 pares (mês, doença) e 25 consultas conferidos contra a contagem manual |
| [#31](https://github.com/CampusCEUB/AgroScan/issues/31) | **US28** - Saber a taxa de confirmação dos diagnósticos | ✅ Aceita | Taxa por doença só a partir de 5 avaliações; requeima do tomate 6 de 7 (85,7%) e pinta-preta 3 de 5 (60,0%) conferidas à mão |
| [#33](https://github.com/CampusCEUB/AgroScan/issues/33) | **US30** - Ser alertado sobre repetição de família botânica | ✅ Aceita | Alerta no cadastro do canteiro, antes do plantio, sem bloquear; alerta no Canteiro 1 e no Canteiro 3 e nenhum no Canteiro 2 e na Estufa A, como na contagem manual |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | **US04** - Cucurbitáceas e fechar as solanáceas | ✅ Aceita em 04/11 | Pepino, abobrinha, abóbora e jiló, com 19 doenças e fontes por ficha; validação sem aviso da RN05. Carga aplicada no Neon e `/saude` com catálogo `2026.10.24` e `catalogo_no_banco: true` em 04/11 |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | **US29** - Sintomas mais marcados em cada cultura | ❌ **Não iniciada** | Primeira da ordem de corte do planejamento. Realocada à Sprint 5 |

**Critério C11:** ✅ atendido em **04/11/2026**, e não em 26/10. Até essa data, o
publicado servia o catálogo `2026.10.18` com a migração 3; depois da carga no
Neon e do avanço do espelho, o `/api/v1/saude` publicado respondeu:

```json
{"versao_api":"1.0.0","ambiente":"producao","versao_catalogo":"2026.10.24",
 "banco":"ok","migracao_aplicada":4,"catalogo_no_banco":true}
```

**24 de 27 pontos planejados aceitos** (US25, US27, US28, US30 e US04). Fica a
US29, com 3 pontos. O núcleo chega a **144 de 172 pontos (84%)**.

**Testes no `main`: 431, nenhuma falha** - 140 em Python, 9 deles em banco
real (`tests/test_relatorios_banco.py`, num serviço `postgres:16` do CI), e 291
em TypeScript. CI verde no `main` após o PR #91
([execução #40316962883](https://github.com/CampusCEUB/AgroScan/actions/runs/40316962883)).

**Pull requests aceitos no ciclo:**
[#87](https://github.com/CampusCEUB/AgroScan/pull/87) e
[#88](https://github.com/CampusCEUB/AgroScan/pull/88) (encerramento das Sprints 1 a 3),
[#90](https://github.com/CampusCEUB/AgroScan/pull/90) (conferência das brássicas),
[#91](https://github.com/CampusCEUB/AgroScan/pull/91) (filtro por canteiro),
[#92](https://github.com/CampusCEUB/AgroScan/pull/92) (relatórios e alerta de rotação) e
[#93](https://github.com/CampusCEUB/AgroScan/pull/93) (cucurbitáceas e jiló).

### Encaminhamentos do planejamento

| # | Encaminhamento | Situação |
| --- | --- | --- |
| 1 | Curadoria das cucurbitáceas, com carga no Neon | ✅ Curadoria em 24/10 (PR #93); carga no Neon em 04/11 |
| 2 | Conferir as fichas das brássicas contra as fontes | ✅ 18/10, base `2026.10.18` (PR #90) - [`conferencia-brassicas.md`](../curadoria/conferencia-brassicas.md) |
| 3 | Filtro por canteiro na tela do caderno (US25) | ✅ PR #91 |
| 4 | Carga de registros de exemplo | ✅ `python -m app.exemplo`, 24/10. Carga no Neon pendente |
| 5 | Conferir as consultas do `modelo-de-dados.md` §6 | ✅ 24/10; três das cinco tinham defeito - [§6.6](../modelo-de-dados.md) |
| 6-8 | Relatórios de incidência e confirmação e alerta de rotação | ✅ PR #92 |
| 9 | Relatório de sintomas por cultura (US29) | ❌ Não iniciado - ordem de corte |
| 10 | Teste em banco real da unicidade do `offline_id` | ❌ Não feito; o teste em banco real do PR #92 cobre os relatórios, não a sincronização. Segunda sprint seguida adiado |
| 11 | Comparar o hash do `main` nos dois repositórios ao fim do ciclo | 🟡 Feito em 04/11, e não em 26/10: o espelho ficou 9 dias atrás do institucional. Hoje os dois estão em `f89f997` |
| 12 | Atribuir os papéis Scrum | ❌ Pendente - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 13 | Cobrar a comunidade parceira e as datas dos artefatos | ❌ Sem resposta - [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

### Decisões ratificadas na revisão

| Decisão | Registro |
| --- | --- |
| **A sucessão de canteiros se reconhece pelo nome**: a identificação é única só entre os canteiros ativos, e o replantio no mesmo lugar reusa o nome do encerrado. É dessa sucessão que o alerta de rotação lê os ciclos anteriores | [ADR 0013](../decisoes/adr-0013-sucessao-de-canteiros-e-alerta-de-rotacao.md), migração 004 |
| **O alerta de rotação avisa e não bloqueia**: aparece enquanto o canteiro é cadastrado e compara com os dois últimos ciclos do mesmo lugar | [ADR 0013](../decisoes/adr-0013-sucessao-de-canteiros-e-alerta-de-rotacao.md) |
| **Relatórios só para membros da horta**, com 404 para os demais | [ADR 0012](../decisoes/adr-0012-acesso-por-horta.md) |
| **A taxa de confirmação só aparece a partir de 5 avaliações**; abaixo disso o relatório mostra a contagem bruta | PR #92 |
| **Mês dos relatórios no fuso de Brasília**, e não no da sessão do banco | [`modelo-de-dados.md` §6.6](../modelo-de-dados.md) |
| **O jiló é solanácea**, embora o critério da US04 o agrupe com as cucurbitáceas. Entra como `Solanaceae`, o que muda o alerta de rotação | [`curadoria-cucurbitaceas-e-jilo.md`](../curadoria/curadoria-cucurbitaceas-e-jilo.md) |
| **Ingredientes ativos conferidos nos dados abertos do AGROFIT**, cultura a cultura e alvo a alvo. Nenhuma ficha cita produto sem registro | Idem |
| **Mosaico como uma ficha por cultura**, e não por vírus: PRSV-W, ZYMV e WMV só se separam por sorologia | Idem |
| **A US29 vai para a Sprint 5**, assim como #72, #73 e #74 | Esta revisão |

### Retrospectiva - o que funcionou

- **Conferir as consultas antes de construir sobre elas.** Executar o §6 do modelo de dados num PostgreSQL real, contra uma contagem feita à mão, achou três defeitos em cinco consultas, um deles (o da rotação) que fazia o alerta nunca encontrar nada em banco nenhum.
- **A carga de exemplo como evidência.** O conjunto fixo virou, ao mesmo tempo, a demonstração e o teste automatizado que compara cada relatório com a contagem manual.
- **Teste em banco real no CI**, com um serviço `postgres:16`. Os relatórios dependem de SQL que o cliente em memória não exercita.
- **A conferência das brássicas foi feita no prazo** (18/10, para 19/10), depois de duas sprints adiada.
- **A US04 saiu**, depois de uma sprint de atraso, e com a conferência dos ingredientes ativos que as brássicas não tiveram.
- **A ordem de corte funcionou como planejado**: saiu só a US29, a primeira da lista, e o núcleo do ciclo ficou.

### Retrospectiva - o que não funcionou

- **O trabalho se concentrou de novo no fim do ciclo.** Todos os commits de código da sprint são de 24/10, a dois dias do fim, e os três PRs entraram juntos em 26/10. É a terceira sprint seguida com o mesmo problema.
- **A curadoria não começou na primeira semana**, como o ajuste da Sprint 3 combinava: as cucurbitáceas foram curadas em 24/10.
- **A produção ficou 9 dias atrás do código.** Os PRs entraram em 26/10, mas a carga no Neon e o avanço do espelho só aconteceram em 04/11. Nesse intervalo, o publicado servia a Sprint 3: é o R06 materializado, apesar do ajuste que incluiu a API e o banco no C11.
- **O teste de unicidade do `offline_id` em banco real foi adiado pela segunda vez.**
- **As pendências que dependem de fora (#73 e #74) não andaram**, e a Sprint 6 depende da #73.

### Ajustes de processo para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| **A revisão só acontece com o C11 conferido**: carga no Neon, avanço do espelho e `/saude` na versão do `main` fazem parte do aceite, e não de um passo posterior | Produção 9 dias atrás |
| **Um PR por semana, no mínimo**, para a sprint não fechar com todo o código num dia só | Trabalho concentrado no fim pela terceira vez |
| **Curadoria na primeira semana, de fato**, com a família do ciclo começada até o quarto dia | Curadoria em 24/10 |
| **O teste do `offline_id` em banco real entra na Sprint 5 como item próprio**, aproveitando o serviço `postgres:16` que o CI já tem | Adiado duas vezes |
| **Pedir por escrito à professora e à coordenação** a comunidade parceira e as datas dos artefatos, e registrar a resposta na issue | #73 e #74 sem resposta |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Origem |
| --- | --- | --- | --- | --- |
| 1 | Aplicar a carga de exemplo no Neon, para demonstrar os relatórios no publicado | Gabriela | Início da Sprint 5 | Encaminhamento 4 |
| 2 | Relatório de sintomas mais marcados por cultura (US29) | Ambas | 09/11/2026 | [#32](https://github.com/CampusCEUB/AgroScan/issues/32) |
| 3 | Teste em banco real da unicidade do `offline_id` | Ambas | 09/11/2026 | Lacuna do ADR 0009 |
| 4 | Fechar a #7 e a milestone da Sprint 4; realocar #32, #72, #73 e #74 à Sprint 5 | Ambas | Início da Sprint 5 | Pauta 5 |
| 5 | Atualizar o relatório da Sprint 4, o CHANGELOG e a totalização do Artefato 2 (144 de 172) | Ambas | Início da Sprint 5 | Pauta 5 |
| 6 | Atribuir nominalmente os papéis Scrum | Ambas | 09/11/2026 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 7 | Pedir à coordenação a definição da comunidade parceira: a Sprint 6 depende dela | Ambas | 09/11/2026 | [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 8 | Pedir à professora as datas dos Artefatos 5 a 9 e se existe o Artefato 4 | Ambas | 09/11/2026 | [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 9 | Decidir se as fontes de cada ficha vão para dentro da base, como pede o critério da US03 | Ambas | Planejamento da Sprint 5 | Curadoria das brássicas e das cucurbitáceas |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | Volume de dados de teste | Relatórios sobre base vazia não demonstram nada | ✅ Resolvido em 24/10 com a carga de exemplo; falta aplicá-la no Neon |
| 2 | Tela de confirmação (US20) só na Sprint 5 | A US28 não tem feedback real para calcular | Contornado com a carga de exemplo; a US20 segue na Sprint 5 |
| 3 | Comunidade parceira não definida (R03) | A Sprint 6 inteira depende dela | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 4 | Datas dos Artefatos 5 a 9 não divulgadas | O Artefato 9 está alocado à Sprint 5 sem prazo confirmado | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 5 | Papéis Scrum não atribuídos nominalmente | Registros sem responsável nominal | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 6 | Produção defasada em relação ao `main` (R06) | O publicado serviu a Sprint 3 de 26/10 a 04/11 | ✅ Resolvido em 04/11 - migração 004 e catálogo `2026.10.24` no Neon, espelho em `f89f997` |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 4 - Relatórios agregados` |
| Issue desta reunião | [#57](https://github.com/CampusCEUB/AgroScan/issues/57) |
| Relatório da sprint | [`sprints/sprint-04.md`](../../sprints/sprint-04.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

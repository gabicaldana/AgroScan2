# Reunião - Sprint 4 · Planejamento

Reunião de abertura da **Sprint 4 - Relatórios agregados** (13/10/2026 a 26/10/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

13/10/2026

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

Selecionados da `milestone` **Sprint 4 - Relatórios agregados**, que recebeu as
realocações da Sprint 3 (US04 e US25) e as pendências #72, #73 e #74.

| Issue | Item | Tipo | Pts |
| --- | --- | --- | --- |
| [#30](https://github.com/CampusCEUB/AgroScan/issues/30) | US27 - Ver quais doenças mais ocorreram na horta | História | 5 |
| [#31](https://github.com/CampusCEUB/AgroScan/issues/31) | US28 - Saber a taxa de confirmação dos diagnósticos | História | 3 |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | US29 - Saber quais sintomas são mais marcados em cada cultura | História | 3 |
| [#33](https://github.com/CampusCEUB/AgroScan/issues/33) | US30 - Ser alertado sobre repetição de família botânica | História | 5 |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Doenças das cucurbitáceas | História - vinda da Sprint 3 | 8 |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro: falta o filtro na tela | História - vinda da Sprint 3 | 3 |
| [#72](https://github.com/CampusCEUB/AgroScan/issues/72), [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) | Papéis Scrum, comunidade parceira, datas dos artefatos | Tarefas - vindas da Sprint 2 | - |

**Meta do ciclo:** os quatro relatórios agregados disponíveis por horta, com a
agregação conferida contra contagem manual; cucurbitáceas curadas e carregadas
no banco de produção; US25 fechada.

**6 histórias, 27 pontos.**

### US25

- **Falta só a tela.** A API já filtra por canteiro (`GET /consultas?canteiro_id=`); o caderno ganha o filtro ao lado dos de período e cultura, e roda no aparelho, como eles, para funcionar sem rede.
- **Os critérios de aceite são marcados na `issue`** antes de pedir o fechamento, como ajuste da retrospectiva da Sprint 3.

### Curadoria agronômica

- **As cucurbitáceas (US04) têm prioridade** sobre as apiáceas e amarilidáceas que o calendário previa para este ciclo. A US04 já atrasou uma sprint e é pré-requisito para a base fechar na Sprint 5.
- **A curadoria tem tempo reservado** a partir da primeira semana, como ajuste da retrospectiva da Sprint 3, e não o tempo que sobra do desenvolvimento.
- **A divergência da US05 fica resolvida sem dividir a `issue`.** Se houver avanço nas apiáceas e amarilidáceas neste ciclo, ele é anotado em comentário na [#8](https://github.com/CampusCEUB/AgroScan/issues/8), que continua na `milestone` da Sprint 5.
- **A ficha só está concluída com a carga aplicada no Neon** e `/saude` mostrando a versão nova, conforme o ajuste da Sprint 3.

### Relatórios

- **Os relatórios são por horta** e seguem o [ADR 0012](../decisoes/adr-0012-acesso-por-horta.md): só os membros os veem, e quem não participa recebe 404.
- **As consultas partem do que já está desenhado** em [`docs/modelo-de-dados.md`](../modelo-de-dados.md) §6 (6.1 a 6.4), conferidas contra o esquema atual com as migrações 002 e 003.
- **A agregação roda no banco, em SQL**, sem desnormalização. Se uma consulta ficar lenta, o caminho é índice nas colunas de filtro, e depois visão materializada (R05).
- **US28 calcula sobre os feedbacks que já existem.** A rota `POST /consultas/{id}/feedback` está pronta desde a Sprint 1; a tela de confirmação (US20) só chega na Sprint 5. Até lá, o relatório é demonstrado com a carga de exemplo e diz claramente quando não há feedback suficiente para calcular a taxa.
- **US30 lê a sucessão de canteiros encerrados** do mesmo lugar, cada um com cultura fixa (ADR 0012), e compara a família botânica da base. O alerta aparece **antes** do plantio, ao cadastrar o canteiro novo.
- **Os relatórios também não afirmam mais do que sabem**: com poucos registros, mostram a contagem bruta e o tamanho da amostra, sem percentuais que pareçam mais sólidos do que são.

### Evidência e demonstração

- **Uma carga de registros de exemplo** (horta, canteiros em sucessão, consultas e feedbacks) é criada no início do ciclo. Sem ela, relatório sobre base vazia não demonstra nada na revisão.
- **Cada relatório é aceito com uma contagem manual** sobre esse conjunto conhecido, comparada à saída da consulta, e o mesmo conjunto vira teste automatizado.

### Ordem de corte do ciclo

Se a capacidade apertar, saem nesta ordem, conforme o Artefato 2, §3.4:
**US29**, depois **US30**. US27, US28, US25 e US04 ficam, porque a US25 é pequena e já está quase pronta, e porque a US41 (painéis da
Sprint 5) apresenta os mesmos indicadores e a base precisa fechar na Sprint 5.

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Issue |
| --- | --- | --- | --- | --- |
| 1 | Curadoria das cucurbitáceas (pepino, abobrinha, abóbora e jiló), com revisão cruzada e carga no Neon | Ambas | 26/10/2026 | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 2 | Conferir as fichas das brássicas contra as fontes, pendente desde a Sprint 2 | Ambas | 19/10/2026 | [#6](https://github.com/CampusCEUB/AgroScan/issues/6) |
| 3 | Filtro por canteiro na tela do caderno (US25) | Ambas | 19/10/2026 | [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| 4 | Criar a carga de registros de exemplo para os relatórios | Ambas | 16/10/2026 | - |
| 5 | Conferir as consultas do `modelo-de-dados.md` §6 contra o esquema atual | Ambas | 16/10/2026 | - |
| 6 | Relatório de incidência por período | Ambas | 26/10/2026 | [#30](https://github.com/CampusCEUB/AgroScan/issues/30) |
| 7 | Relatório de taxa de confirmação | Ambas | 26/10/2026 | [#31](https://github.com/CampusCEUB/AgroScan/issues/31) |
| 8 | Alerta de repetição de família botânica no cadastro de canteiro | Ambas | 26/10/2026 | [#33](https://github.com/CampusCEUB/AgroScan/issues/33) |
| 9 | Relatório de sintomas mais marcados por cultura | Ambas | 26/10/2026 | [#32](https://github.com/CampusCEUB/AgroScan/issues/32) |
| 10 | Teste em banco real da unicidade do `offline_id` | Ambas | 26/10/2026 | Lacuna do ADR 0009 |
| 11 | Comparar o hash do `main` nos dois repositórios ao fim do ciclo | Ambas | 26/10/2026 | ADR 0011 |
| 12 | Atribuir nominalmente os papéis Scrum | Ambas | 26/10/2026 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 13 | Cobrar a comunidade parceira e as datas dos artefatos: a Sprint 6 e o Artefato 9 dependem delas | Ambas | 26/10/2026 | [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

## Impedimentos

| # | Impedimento | Efeito | Situação na abertura |
| --- | --- | --- | --- |
| 1 | Volume de dados de teste | Relatórios sobre base vazia não demonstram nada | A tratar no ciclo - encaminhamento 4 |
| 2 | Tela de confirmação (US20) só na Sprint 5 | A US28 não tem feedback real para calcular | Contornado com a carga de exemplo |
| 3 | Comunidade parceira não definida (R03) | A Sprint 6 inteira depende dela; precisa estar resolvida até o fim da Sprint 5 | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 4 | Datas dos Artefatos 5 a 9 não divulgadas | O Artefato 9 está alocado à Sprint 5 sem prazo confirmado | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 5 | Papéis Scrum não atribuídos nominalmente | Registros sem responsável nominal | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 4 - Relatórios agregados` |
| Issue desta reunião | [#56](https://github.com/CampusCEUB/AgroScan/issues/56) |
| Relatório da sprint | [`sprints/sprint-04.md`](../../sprints/sprint-04.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

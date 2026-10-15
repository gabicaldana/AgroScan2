# Reunião - Sprint 2 · Planejamento

Reunião de abertura da **Sprint 2 - Base de conhecimento e publicação** (15/09/2026 a 28/09/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

15/09/2026

> A data corresponde ao primeiro dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md). ⚠️ Confirmar a data em que a reunião de fato ocorreu.

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

Selecionados da `milestone` **Sprint 2 - Base de conhecimento e publicação**.

| Item | Tipo | Pts |
| --- | --- | --- |
| US01 - Encontrar a hortaliça que cultivo em uma lista organizada | História | 3 |
| US03 - Cadastrar as doenças das brássicas | História | 8 |
| US36 - Receber atualizações do catálogo sem reinstalar | História | 5 |
| Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | Correção (R07) | - |
| Republicar o ambiente e conferir a versão do catálogo exibida | Correção (R06) | - |
| Conferir no ambiente publicado a nova hierarquia de entrada | Correção (ADR 0008) | - |
| Atualizar o README do repositório de código para o estado real | Documentação | - |
| Elevar batata e pimentão ao mínimo de três doenças | Curadoria (RN05) | - |
| Criar milestones, issues e GitHub Project do backlog | Documentação | - |
| Atribuir nominalmente os papéis Scrum | Documentação | - |
| Definir a comunidade parceira da Atividade de Extensão | Pesquisa (R03) | - |
| Confirmar as datas dos Artefatos 5 a 9 e a existência do Artefato 4 | Documentação | - |

**Meta do ciclo:** brássicas curadas (6 culturas); batata e pimentão em
conformidade com a RN05; ambiente publicado refletindo o código.

> ⚠️ **Decisões e encaminhamentos redigidos a partir dos registros do
> repositório** (relatório da sprint, `pull requests` e CHANGELOG), em
> 15/10/2026. Revisar pela equipe.

### Outras decisões

| Decisão | Registro |
| --- | --- |
| Toda integração passa a ser por `pull request` vinculado a uma `issue`, a começar pela estruturação do backlog | [PR #82](https://github.com/CampusCEUB/AgroScan/pull/82) |
| O código passa a viver no repositório institucional, ao lado da documentação | [PR #83](https://github.com/CampusCEUB/AgroScan/pull/83); Artefato 2, §4.1 |
| A curadoria do ciclo é feita por família: um levantamento sobre patógenos de crucíferas cobre as seis brássicas | [`sprint-02.md`](../../sprints/sprint-02.md#curadoria-das-brássicas-us03---6-culturas-18-fichas) |
| O catálogo baixado fica em `localStorage`, e o diagnóstico nunca espera pela sincronização (US36) | [`sprint-02.md`](../../sprints/sprint-02.md#atualização-do-catálogo-sem-reinstalar-us36) |

## Encaminhamentos

| # | Encaminhamento | Responsável | Issue |
| --- | --- | --- | --- |
| 1 | Criar milestones, `issues` e o GitHub Project | Ambas | [#71](https://github.com/CampusCEUB/AgroScan/issues/71) |
| 2 | Verificar no CI que os testes da API executam | Ambas | [#66](https://github.com/CampusCEUB/AgroScan/issues/66) |
| 3 | Curar as brássicas e elevar batata e pimentão a três doenças | Ambas | [#6](https://github.com/CampusCEUB/AgroScan/issues/6), [#70](https://github.com/CampusCEUB/AgroScan/issues/70) |
| 4 | Construir a sincronização de catálogo no cliente | Ambas | [#40](https://github.com/CampusCEUB/AgroScan/issues/40) |
| 5 | Republicar o ambiente e conferir a hierarquia de entrada | Ambas | [#67](https://github.com/CampusCEUB/AgroScan/issues/67), [#68](https://github.com/CampusCEUB/AgroScan/issues/68) |
| 6 | Levar à professora e à coordenação as pendências de calendário e de comunidade parceira | Ambas | [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

"Ambas" enquanto os papéis Scrum não forem atribuídos ([#72](https://github.com/CampusCEUB/AgroScan/issues/72)).

## Impedimentos

| # | Impedimento | Situação |
| --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Herdado da Sprint 1 |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | Herdado da Sprint 1 |
| 3 | Papéis Scrum não atribuídos nominalmente | Herdado da Sprint 1 |
| 4 | Dependência de teste ausente (R07) | Herdado da Sprint 1 - correção neste ciclo |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 2 - Base de conhecimento e publicação` |
| Issue desta reunião | [#52](https://github.com/CampusCEUB/AgroScan/issues/52) |
| Relatório da sprint | [`sprints/sprint-02.md`](../../sprints/sprint-02.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

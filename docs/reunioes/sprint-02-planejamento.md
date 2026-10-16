# Reunião - Sprint 2 · Planejamento

Reunião de abertura da **Sprint 2 - Base de conhecimento e publicação** (15/09/2026 a 28/09/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

15/09/2026

> A data corresponde ao primeiro dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md). ⚠️ Confirmar a data em que a reunião de fato ocorreu. Decisões e encaminhamentos redigidos em 16/10/2026 a partir dos registros do repositório (relatório da sprint, `pull requests`, CHANGELOG e ADRs); revisar pela equipe.

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

**3 histórias, 16 pontos**, mais nove tarefas de sprint derivadas da
retrospectiva da Sprint 1.

### Processo: os ajustes da retrospectiva entram em vigor

- **O backlog no GitHub vem antes do desenvolvimento.** A criação das `milestones`, das `issues` e do GitHub Project ([#71](https://github.com/CampusCEUB/AgroScan/issues/71)) é a primeira tarefa do ciclo. Nenhuma história começa sem `issue` aberta.
- **Toda integração passa por `pull request`** com revisão da outra integrante, em branch `feature/`, `docs/` ou `fix/` seguido do número da `issue`, conforme o [`CONTRIBUTING.md`](../../CONTRIBUTING.md). É a primeira sprint nesse fluxo.
- **As histórias da Sprint 1 ganham `issue` em retrospecto**, para recuperar a rastreabilidade entre backlog e execução. A nota de que foram criadas depois fica no próprio relatório da sprint.
- **O estado do projeto é afirmado em um só lugar**, o README do código, e os demais documentos o referenciam.

### Curadoria agronômica

- **As brássicas vêm primeiro** entre as famílias restantes: um levantamento cobre seis culturas (couve, repolho, brócolis, couve-flor, rúcula e agrião), o maior alcance por esforço do backlog. É a aplicação direta da mitigação do R01.
- **Batata e pimentão sobem a três doenças no mesmo ciclo** ([#70](https://github.com/CampusCEUB/AgroScan/issues/70)). Abaixo de três, o motor nunca tem segunda hipótese e a pergunta de desempate não funciona na cultura (RN05). Com isso, a parte "fechar as solanáceas" da US04 é antecipada para esta sprint.
- **Toda ficha nova passa pela validação automática** e cita fonte técnica com data de acesso. A validação aprova a estrutura, não a agronomia: a conferência contra as fontes é feita por revisão cruzada.

### Desenvolvimento

- **US36 - só o cliente.** O servidor (`/catalogo/versao` e `/catalogo` com `ETag`) está pronto desde a Sprint 1. O ciclo constrói a sincronização no PWA.
- **O diagnóstico nunca espera pela sincronização.** O motor funciona sobre o catálogo embutido antes de qualquer verificação de rede, e toda falha de sincronização é silenciosa (ADR 0001 preservada).
- **US01 entra pelo agrupamento e pelo nome científico.** O agrupamento por grupo passa a ser exercitado de verdade com as brássicas, que estreiam os grupos `folha` e `flor`.

### Correções herdadas: critério de verificação

As correções de R07 e do README já estão no código desde 12/09 (commits
`8053fc8` e `9570990`). As `issues` ficam abertas até a **verificação**, e não
até o código. O critério de fechamento de cada uma ficou definido assim:

| Verificação | Issue | Risco | Critério |
| --- | --- | --- | --- |
| A integração contínua **executa**, e não pula, os testes da API | [#66](https://github.com/CampusCEUB/AgroScan/issues/66) | R07 | Nenhum teste pulado no relatório do CI |
| O endereço publicado serve a versão corrente do catálogo | [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | R06 | Versão exibida na interface igual à da base no ramo principal |
| A tela inicial é o diagnóstico por sintomas | [#68](https://github.com/CampusCEUB/AgroScan/issues/68) | ADR 0008 | `/sintomas` redireciona para `/` no ambiente publicado |

### Itens que dependem de terceiros

As tarefas [#73](https://github.com/CampusCEUB/AgroScan/issues/73) (comunidade
parceira) e [#74](https://github.com/CampusCEUB/AgroScan/issues/74) (datas dos
artefatos) ficam na `milestone` com a etiqueta `bloqueado`. O compromisso da
equipe no ciclo é **fazer a interlocução**, não resolvê-las; não contam para a
meta.

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Issue |
| --- | --- | --- | --- | --- |
| 1 | Criar as 8 `milestones`, as `issues` do backlog e das reuniões, e o GitHub Project | Ambas | Primeira semana do ciclo (21/09) | [#71](https://github.com/CampusCEUB/AgroScan/issues/71) |
| 2 | Curadoria das brássicas: 6 culturas com 3 doenças cada, com revisão cruzada | Ambas | 28/09/2026 | [#6](https://github.com/CampusCEUB/AgroScan/issues/6) |
| 3 | Fichas de batata e pimentão até o mínimo de três doenças | Ambas | 28/09/2026 | [#70](https://github.com/CampusCEUB/AgroScan/issues/70) |
| 4 | Sincronização do catálogo no cliente, com testes dos casos de falha | Ambas | 28/09/2026 | [#40](https://github.com/CampusCEUB/AgroScan/issues/40) |
| 5 | Exibir nome científico e família no seletor de cultura | Ambas | 28/09/2026 | [#4](https://github.com/CampusCEUB/AgroScan/issues/4) |
| 6 | Conferir no CI que os 22 testes da API executam | Ambas | 28/09/2026 | [#66](https://github.com/CampusCEUB/AgroScan/issues/66) |
| 7 | Conferir o README do código contra a execução real (estado e contagem de testes) | Ambas | 28/09/2026 | [#69](https://github.com/CampusCEUB/AgroScan/issues/69) |
| 8 | Republicar o ambiente e conferir a versão do catálogo e a hierarquia de entrada | Ambas | 28/09/2026 | [#67](https://github.com/CampusCEUB/AgroScan/issues/67), [#68](https://github.com/CampusCEUB/AgroScan/issues/68) |
| 9 | Atribuir nominalmente os papéis Scrum | Ambas | 28/09/2026 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 10 | Consultar a coordenação sobre a comunidade parceira e a professora sobre as datas dos Artefatos 4 a 9 | Ambas | 28/09/2026 | [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

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

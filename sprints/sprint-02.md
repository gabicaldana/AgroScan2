# Sprint 2 - Base de conhecimento e publicação

## Período

**15/09/2026 a 28/09/2026** (14 dias)

Primeira sprint na cadência padrão de duas semanas, iniciada no dia seguinte à
entrega dos Artefatos 1, 2 e 3.

## Objetivo

Ampliar a base de conhecimento e recolocar o ambiente publicado em dia com o
código. A sprint fecha as pendências técnicas herdadas da Sprint 1 - a
dependência de teste ausente, o ambiente defasado e a falta de rastreabilidade
entre backlog e execução - e avança a curadoria agronômica pelas brássicas,
a família de maior alcance por levantamento.

É a primeira sprint com backlog no GitHub e com integração por `pull request`,
conforme os ajustes definidos na retrospectiva da Sprint 1.

## Milestone

[**Sprint 2 - Base de conhecimento e publicação**](https://github.com/CampusCEUB/AgroScan/milestone/2) -
prazo em 28/09/2026, com 14 `issues`.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 15/09/2026 | [#52](https://github.com/CampusCEUB/AgroScan/issues/52) | [`sprint-02-planejamento.md`](../docs/reunioes/sprint-02-planejamento.md) |
| Revisão | 28/09/2026 | [#53](https://github.com/CampusCEUB/AgroScan/issues/53) | [`sprint-02-revisao.md`](../docs/reunioes/sprint-02-revisao.md) |

## Itens planejados

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#4](https://github.com/CampusCEUB/AgroScan/issues/4) | US01 - Encontrar a hortaliça que cultivo em uma lista organizada | E1 | 3 | Obrigatório |
| [#6](https://github.com/CampusCEUB/AgroScan/issues/6) | US03 - Cadastrar as doenças das brássicas | E1 | 8 | Obrigatório |
| [#40](https://github.com/CampusCEUB/AgroScan/issues/40) | US36 - Receber atualizações do catálogo sem reinstalar | E7 | 5 | Importante |

**3 histórias, 16 pontos.**

### Tarefas de sprint

| Issue | Tarefa | Natureza | Origem |
| --- | --- | --- | --- |
| [#66](https://github.com/CampusCEUB/AgroScan/issues/66) | Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | Correção | R07 |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicar o ambiente e conferir a versão do catálogo exibida | Correção | R06 |
| [#68](https://github.com/CampusCEUB/AgroScan/issues/68) | Conferir no ambiente publicado a nova hierarquia de entrada | Correção | ADR 0008 |
| [#69](https://github.com/CampusCEUB/AgroScan/issues/69) | Atualizar o README do repositório de código para o estado real | Documentação | Retrospectiva da Sprint 1 |
| [#70](https://github.com/CampusCEUB/AgroScan/issues/70) | Elevar batata e pimentão ao mínimo de três doenças | Curadoria | RN05 |
| [#71](https://github.com/CampusCEUB/AgroScan/issues/71) | Criar milestones, issues e GitHub Project do backlog | Documentação | Pendência do Artefato 2 |
| [#72](https://github.com/CampusCEUB/AgroScan/issues/72) | Atribuir nominalmente os papéis Scrum | Documentação | Pendência do Artefato 2 |
| [#73](https://github.com/CampusCEUB/AgroScan/issues/73) | Definir a comunidade parceira da Atividade de Extensão | Pesquisa | R03 - bloqueado |
| [#74](https://github.com/CampusCEUB/AgroScan/issues/74) | Confirmar as datas dos Artefatos 5 a 9 e a existência do Artefato 4 | Documentação | Pendência - bloqueado |

## Responsáveis

| Item | Responsável |
| --- | --- |
| Curadoria das brássicas (US03) e das solanáceas pendentes (#70) | Ambas as integrantes, com revisão cruzada |
| Sincronização de catálogo (US36) e lista de culturas (US01) | Ambas as integrantes |
| Correções de infraestrutura (#66-#68) | Ambas as integrantes |
| Backlog no GitHub (#71) e documentação (#69) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.** Registrar as fichas de doença
> acrescentadas à base, a versão do catálogo publicada e o resultado da
> validação automática.

## Issues concluídas

| Issue | Título | Situação |
| --- | --- | --- |
| [#71](https://github.com/CampusCEUB/AgroScan/issues/71) | Criar milestones, issues e GitHub Project do backlog | ✅ Fechada - 8 milestones, 81 issues e 16 reuniões |

> ⚠️ **A completar no encerramento.** As demais `issues` da milestone seguem
> abertas nesta data.

## Pull requests aceitos

| PR | Conteúdo | Issue |
| --- | --- | --- |
| [#82](https://github.com/CampusCEUB/AgroScan/pull/82) | Estrutura o backlog no GitHub: 8 milestones, 81 issues e 16 reuniões | [#71](https://github.com/CampusCEUB/AgroScan/issues/71) |

Primeiro `pull request` do projeto, conforme o ajuste de processo definido na
retrospectiva da Sprint 1.

> ⚠️ **A completar no encerramento.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.** Reunir a saída da validação da
> base, a execução das suítes de teste, o endereço publicado com a versão do
> catálogo conferida e o resultado da integração contínua.

Verificações obrigatórias neste ciclo, por decorrerem dos riscos herdados:

| Verificação | Risco | Critério |
| --- | --- | --- |
| A integração contínua **executa** - e não pula - os testes da API | R07 | Nenhum teste pulado no relatório do CI |
| O endereço publicado serve a versão corrente do catálogo | R06 | Versão exibida na interface igual à da base no ramo principal |
| A tela inicial é o diagnóstico por sintomas | ADR 0008 | `/sintomas` redireciona para `/` no ambiente publicado |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | Impede fixar a priorização das famílias botânicas e a data da apresentação | Herdado da Sprint 1 - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das Sprints 5 a 8 é provisório | Herdado da Sprint 1 - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | **Papéis Scrum não atribuídos nominalmente** | Impede a atribuição nominal de responsáveis nos registros | Herdado da Sprint 1 - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | **Dependência de teste ausente** (R07) | 22 testes de integração da API não executam de forma confiável | Herdado da Sprint 1 - correção neste ciclo, [#66](https://github.com/CampusCEUB/AgroScan/issues/66) |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 28/09/2026.** Registrar o que
> funcionou, o que não funcionou e os ajustes para o ciclo seguinte, incluindo a
> avaliação do fluxo de `pull request` adotado nesta sprint.

## Próximas ações

### Preparação da Sprint 3 (29/09 - 12/10)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Modelar as rotas de horta, membros e canteiros na API | Épico E5 |
| 2 | Iniciar a curadoria das cucurbitáceas (US04) | Épico E1 |
| 3 | Conferir se as brássicas passaram na validação automática antes de abrir o ciclo | Definition of Done da curadoria |

### Pendências que dependem de terceiros

| # | Pendência | Interlocutor | Issue |
| --- | --- | --- | --- |
| 1 | Definição da comunidade parceira da Atividade de Extensão | Coordenação da disciplina | [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 e existência do Artefato 4 | Professora | [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

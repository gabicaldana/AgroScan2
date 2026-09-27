# Sprints

Esta pasta concentra os registros de planejamento, acompanhamento, revisão e encerramento de cada sprint do projeto. Use esses documentos para conectar o que foi planejado, o que foi executado e quais evidências comprovam o resultado.

Cada relatório de sprint deve apontar para a `milestone` correspondente no GitHub, para as `issues` planejadas e concluídas, para os `pull requests` aceitos e para as evidências que demonstram a entrega. Essa ligação facilita a rastreabilidade entre objetivo, execução, revisão e resultado.

Para iniciar uma nova sprint, copie `template-sprint.md` para um arquivo nomeado como `sprint-01.md`, `sprint-02.md` e assim por diante, e preencha-o ao longo do ciclo.

Considere como evidência os itens verificáveis, como links para artefatos, documentos, telas, demonstrações, checklists, validações, histórico de `merge` e outros registros que sustentem o status informado no relatório.

---

## Calendário e registros

Cadência de duas semanas. A Sprint 1 tem 15 dias, para encerrar na data de
entrega dos Artefatos 1, 2 e 3.

| Sprint | Período | Objetivo | Marco acadêmico | Registro |
| --- | --- | --- | --- | --- |
| 00 | - | Planejamento e acordos de trabalho | - | [sprint-00-planejamento.md](sprint-00-planejamento.md) |
| **1** | 31/08 - 14/09 | Especificação e gestão | **Artefatos 1, 2 e 3 - 14/09** | [sprint-01.md](sprint-01.md) |
| **2** | 15/09 - 28/09 | Base de conhecimento e publicação | Incremento funcional | [sprint-02.md](sprint-02.md) |
| 3 | 29/09 - 12/10 | Horta, canteiros e manejo | Sprint Review | [sprint-03.md](sprint-03.md) |
| 4 | 13/10 - 26/10 | Relatórios agregados | Sprint Review | [sprint-04.md](sprint-04.md) |
| 5 | 27/10 - 09/11 | Base completa, feedback e dashboards | **Artefato 9** *(data a definir)* | [sprint-05.md](sprint-05.md) |
| 6 | 10/11 - 23/11 | Comunidade e validação | Apresentação à Comunidade · **Artefato 6** *(datas a definir)* | [sprint-06.md](sprint-06.md) |
| 7 | 24/11 - 07/12 | Ativos e documentação técnica | **Artefatos 5 e 8** *(datas a definir)* | [sprint-07.md](sprint-07.md) |
| 8 | 08/12 - 19/12 | Fechamento do semestre | **Artefato 7** *(data a definir)* | [sprint-08.md](sprint-08.md) |

As sprints 1 e 2 estão em negrito por serem, respectivamente, a encerrada e a
corrente. Os relatórios das sprints 3 a 8 já existem preenchidos até o
planejamento - período, objetivo, `milestone`, itens e responsáveis - e trazem
as seções de execução marcadas como *a preencher*, para serem completadas na
revisão de cada ciclo.

## Milestones e reuniões

Cada sprint corresponde a uma `milestone` no GitHub e tem **duas reuniões**:
planejamento na abertura e revisão no encerramento. As atas ficam em
[`docs/reunioes/`](../docs/reunioes/README.md), e cada reunião tem uma `issue`
com a etiqueta `reuniao`, vinculada à `milestone` da sprint.

| Sprint | Milestone | Planejamento | Revisão |
| --- | --- | --- | --- |
| **1** | Sprint 1 - Especificação e gestão | [31/08](../docs/reunioes/sprint-01-planejamento.md) | [14/09](../docs/reunioes/sprint-01-revisao.md) |
| 2 | Sprint 2 - Base de conhecimento e publicação | [15/09](../docs/reunioes/sprint-02-planejamento.md) | [28/09](../docs/reunioes/sprint-02-revisao.md) |
| 3 | Sprint 3 - Horta, canteiros e manejo | [29/09](../docs/reunioes/sprint-03-planejamento.md) | [12/10](../docs/reunioes/sprint-03-revisao.md) |
| 4 | Sprint 4 - Relatórios agregados | [13/10](../docs/reunioes/sprint-04-planejamento.md) | [26/10](../docs/reunioes/sprint-04-revisao.md) |
| 5 | Sprint 5 - Base completa, feedback e dashboards | [27/10](../docs/reunioes/sprint-05-planejamento.md) | [09/11](../docs/reunioes/sprint-05-revisao.md) |
| 6 | Sprint 6 - Comunidade e validação | [10/11](../docs/reunioes/sprint-06-planejamento.md) | [23/11](../docs/reunioes/sprint-06-revisao.md) |
| 7 | Sprint 7 - Ativos e documentação técnica | [24/11](../docs/reunioes/sprint-07-planejamento.md) | [07/12](../docs/reunioes/sprint-07-revisao.md) |
| 8 | Sprint 8 - Fechamento do semestre | [08/12](../docs/reunioes/sprint-08-planejamento.md) | [19/12](../docs/reunioes/sprint-08-revisao.md) |

O alinhamento de meio de sprint é assíncrono e não gera ata própria: impedimento
que bloqueie por mais de 48 horas vira comentário na `issue` correspondente.

> **Somente a data de 14/09/2026 foi fixada pela disciplina**, para os Artefatos
> 1, 2 e 3. As datas dos Artefatos 5 a 9 e da apresentação à comunidade estão a
> definir. As demais datas são proposta da equipe, derivada da cadência de duas
> semanas, e serão ajustadas quando os marcos restantes forem divulgados.
>
> O semestre tem **nove artefatos avaliativos** distribuídos em dois bimestres,
> em quatro eixos que se repetem: Negócio/Domínio, Projeto, Produto e Ativos. A
> relação completa está no
> [Artefato 2, seção 3.1](../entregas/artefato-2-gestao-do-projeto.md#31-cadência-e-premissas).

Planejamento completo, com entregas e histórias alocadas por sprint, no
[Artefato 2, seção 3](../entregas/artefato-2-gestao-do-projeto.md#3-planejamento-das-sprints).

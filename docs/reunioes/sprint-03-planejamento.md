# Reunião - Sprint 3 · Planejamento

Reunião de abertura da **Sprint 3 - Horta, canteiros e manejo** (29/09/2026 a 12/10/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

29/09/2026

> Data prevista pela cadência de duas semanas. ⚠️ Confirmar a data em que a
> reunião de fato ocorreu. Ata redigida em 15/10/2026 a partir dos registros do
> repositório; revisar pela equipe.

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

Selecionados da `milestone` **Sprint 3 - Horta, canteiros e manejo**.

| Item | Tipo | Pts |
| --- | --- | --- |
| US04 - Cadastrar as doenças das cucurbitáceas e fechar as solanáceas | História | 8 |
| US22 - Cadastrar minha horta | História | 3 |
| US23 - Associar outras pessoas à horta | História | 5 |
| US24 - Cadastrar canteiros com a cultura plantada | História | 3 |
| US25 - Vincular a consulta ao canteiro | História | 3 |
| US26 - Registrar o manejo que apliquei | História | 5 |

**Meta do ciclo:** o produtor organiza o registro em horta, canteiros e manejo;
curadoria das cucurbitáceas.

### Outras decisões

| Decisão | Registro |
| --- | --- |
| Pela ordem de corte do Artefato 2, §3.4, a US26 é a primeira a sair se a capacidade faltar | Artefato 2, §3.4 |
| Quem não participa de uma horta recebe 404, e não 403, para não revelar que ela existe | [ADR 0012](../decisoes/adr-0012-acesso-por-horta.md) |
| A cultura de um canteiro não muda; plantar outra coisa é um ciclo novo, o que alimenta o alerta de rotação da Sprint 4 | `src/app/api/esquemas.py` |

## Encaminhamentos

| # | Encaminhamento | Issue |
| --- | --- | --- |
| 1 | Rotas e telas de horta, membros e canteiros | [#25](https://github.com/CampusCEUB/AgroScan/issues/25)-[#27](https://github.com/CampusCEUB/AgroScan/issues/27) |
| 2 | Consulta vinculada ao canteiro e registro de manejo | [#28](https://github.com/CampusCEUB/AgroScan/issues/28), [#29](https://github.com/CampusCEUB/AgroScan/issues/29) |
| 3 | Curadoria das cucurbitáceas | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 4 | Fechar a publicação do ambiente, herdada da Sprint 2 | [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |

## Impedimentos

| # | Impedimento | Situação |
| --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Herdado - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | Papéis Scrum não atribuídos nominalmente | Herdado - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | Vercel ligada ao repositório antigo | Herdado - [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 3 - Horta, canteiros e manejo` |
| Issue desta reunião | [#54](https://github.com/CampusCEUB/AgroScan/issues/54) |
| Relatório da sprint | [`sprints/sprint-03.md`](../../sprints/sprint-03.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

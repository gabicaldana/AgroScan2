# Reunião - Sprint 2 · Revisão

Reunião de encerramento da **Sprint 2 - Base de conhecimento e publicação** (15/09/2026 a 28/09/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

28/09/2026

> Data prevista pela cadência de duas semanas. ⚠️ Confirmar a data em que a
> reunião de fato ocorreu. Ata redigida em 15/10/2026 a partir dos registros do
> repositório (relatório da sprint, `pull requests` e CHANGELOG); revisar pela
> equipe.

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | ⚠️ a definir |
| Thaís Regina Dias da Mota | 22403754 | ⚠️ a definir |

> A distribuição nominal dos papéis Scrum está pendente, conforme
> [`sprints/sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).

## Pauta

1. Demonstração do incremento construído no ciclo
2. Aceite história a história contra os critérios de aceite e o Definition of Done
3. Conferência de que o ambiente publicado reflete a versão entregue (critério C11)
4. Retrospectiva: o que funcionou, o que não funcionou, ajustes de processo
5. Atualização do relatório da sprint e do CHANGELOG
6. Encaminhamentos para o planejamento do ciclo seguinte

## Decisões

### Aceite do incremento

Registro completo em [`sprints/sprint-02.md`](../../sprints/sprint-02.md).

| Item | Resultado | Verificação |
| --- | --- | --- |
| US03 - brássicas ([#6](https://github.com/CampusCEUB/AgroScan/issues/6)) | ✅ Aceita | 6 culturas com 3 doenças cada; validação sem avisos |
| US36 - catálogo sem reinstalar ([#40](https://github.com/CampusCEUB/AgroScan/issues/40)) | ✅ Aceita | 25 testes; 8 defeitos achados em revisão e corrigidos |
| Batata e pimentão na RN05 ([#70](https://github.com/CampusCEUB/AgroScan/issues/70)) | ✅ Aceita | Base `2026.09.27` sem avisos |
| CI executando os testes da API ([#66](https://github.com/CampusCEUB/AgroScan/issues/66)) | ✅ Aceita | 74 testes, `skipped 0`, CI verde no institucional |
| README do código ([#69](https://github.com/CampusCEUB/AgroScan/issues/69)) | ✅ Aceita | Hoje em `docs/aplicacao.md` |
| Backlog no GitHub ([#71](https://github.com/CampusCEUB/AgroScan/issues/71)) | ✅ Aceita | 8 milestones, 81 `issues`, Project #223 |
| Hierarquia de entrada no publicado ([#68](https://github.com/CampusCEUB/AgroScan/issues/68)) | ✅ Aceita | `/sintomas` → `/` (308) |
| US01 ([#4](https://github.com/CampusCEUB/AgroScan/issues/4)) | ❌ Não aceita | 2 de 3 critérios; vai para a Sprint 5 |
| Republicação ([#67](https://github.com/CampusCEUB/AgroScan/issues/67)) | ❌ Não aceita no ciclo | Vercel ligada ao repositório antigo; fechou na Sprint 3 |

**Critério C11** (ambiente publicado reflete a versão entregue): **não
atendido no ciclo** - o publicado ainda servia a versão anterior.

**Testes:** 74 Python e 193 TypeScript, nenhuma falha e nenhum pulado.

### Retrospectiva

Registrada no [relatório da sprint](../../sprints/sprint-02.md#retrospectiva):
o fluxo de `pull request` funcionou; a US01 foi mal alocada; a publicação ficou
fora do controle da sprint.

## Encaminhamentos

| # | Encaminhamento | Issue |
| --- | --- | --- |
| 1 | Realocar a US01 para a Sprint 5, quando a base fecha | [#4](https://github.com/CampusCEUB/AgroScan/issues/4) |
| 2 | Resolver a publicação do ambiente | [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |
| 3 | Modelar horta, membros e canteiros na API | [#25](https://github.com/CampusCEUB/AgroScan/issues/25)-[#29](https://github.com/CampusCEUB/AgroScan/issues/29) |
| 4 | Iniciar a curadoria das cucurbitáceas | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 5 | Manter abertas as pendências que dependem de terceiros | [#72](https://github.com/CampusCEUB/AgroScan/issues/72), [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

## Impedimentos

| # | Impedimento | Situação |
| --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | Papéis Scrum não atribuídos nominalmente | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | Dependência de teste ausente (R07) | ✅ Resolvido neste ciclo |
| 5 | Vercel ligada ao repositório antigo | Aberto - resolvido na Sprint 3 pelo ADR 0011 |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 2 - Base de conhecimento e publicação` |
| Issue desta reunião | [#53](https://github.com/CampusCEUB/AgroScan/issues/53) |
| Relatório da sprint | [`sprints/sprint-02.md`](../../sprints/sprint-02.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

# Reunião - Sprint 3 · Revisão

Reunião de encerramento da **Sprint 3 - Horta, canteiros e manejo** (29/09/2026 a 12/10/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

12/10/2026

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

1. Demonstração do incremento construído no ciclo
2. Aceite história a história contra os critérios de aceite e o Definition of Done
3. Conferência de que o ambiente publicado reflete a versão entregue (critério C11)
4. Retrospectiva: o que funcionou, o que não funcionou, ajustes de processo
5. Atualização do relatório da sprint e do CHANGELOG
6. Encaminhamentos para o planejamento do ciclo seguinte

## Decisões

### Aceite do incremento

Registro completo em [`sprints/sprint-03.md`](../../sprints/sprint-03.md).

| Item | Resultado | Verificação |
| --- | --- | --- |
| US22 - horta ([#25](https://github.com/CampusCEUB/AgroScan/issues/25)) | ✅ Aceita | Nome e município obrigatórios; quem cria vira responsável na mesma transação |
| US23 - membros ([#26](https://github.com/CampusCEUB/AgroScan/issues/26)) | ✅ Aceita | Membro por e-mail, papel `membro`/`responsavel`, transferência; membro lista os canteiros |
| US24 - canteiros ([#27](https://github.com/CampusCEUB/AgroScan/issues/27)) | ✅ Aceita | Identificação única por horta, cultura do catálogo, data de plantio |
| US25 - consulta no canteiro ([#28](https://github.com/CampusCEUB/AgroScan/issues/28)) | 🟡 Parcial | Seletor de canteiro ao salvar, vínculo opcional e `GET /consultas?canteiro_id=` prontos; falta o filtro por canteiro **na tela** do caderno |
| US26 - manejo ([#29](https://github.com/CampusCEUB/AgroScan/issues/29)) | ✅ Aceita | Tipo, descrição, produto, dose e data; atalho no laudo |
| US04 - cucurbitáceas ([#7](https://github.com/CampusCEUB/AgroScan/issues/7)) | ❌ Não aceita | Base segue com 9 culturas; só o critério de batata e pimentão, feito na Sprint 2 |
| Publicação ([#67](https://github.com/CampusCEUB/AgroScan/issues/67)) | ✅ Aceita | API publicada, catálogo `2026.09.27` no publicado e no banco |

**Critério C11:** ✅ atendido - `/api/v1/saude` publicado informa o catálogo do
ramo principal, com `catalogo_no_banco: true`.

**Testes:** 117 Python e 214 TypeScript, CI verde no `main`.

### Retrospectiva

Registrada no [relatório da sprint](../../sprints/sprint-03.md#retrospectiva).

## Encaminhamentos

| # | Encaminhamento | Issue |
| --- | --- | --- |
| 1 | Filtro por canteiro no caderno, para fechar a US25 | [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| 2 | Curadoria das cucurbitáceas, realocada à Sprint 4 | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 3 | Relatórios agregados sobre os canteiros | [#30](https://github.com/CampusCEUB/AgroScan/issues/30)-[#33](https://github.com/CampusCEUB/AgroScan/issues/33) |
| 4 | Atualizar as actions do CI (Node 20 depreciado; `ubuntu-latest` muda em 19/10) | - |

## Impedimentos

| # | Impedimento | Situação |
| --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | Papéis Scrum não atribuídos nominalmente | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | API nunca publicada | ✅ Resolvido em 08/10 - ADR 0010 |
| 5 | Catálogo `2026.09.27` fora do banco de produção | ✅ Resolvido em 09/10 - migrações 002 e 003 |
| 6 | Vercel ligada ao repositório antigo | ✅ Resolvido por decisão - ADR 0011 |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 3 - Horta, canteiros e manejo` |
| Issue desta reunião | [#55](https://github.com/CampusCEUB/AgroScan/issues/55) |
| Relatório da sprint | [`sprints/sprint-03.md`](../../sprints/sprint-03.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

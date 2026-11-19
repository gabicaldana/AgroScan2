# Reunião - Sprint 6 · Planejamento

Reunião de abertura da **Sprint 6 - Comunidade e validação** (10/11/2026 a 23/11/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

10/11/2026

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | Product Owner e Scrum Master, em conjunto |
| Thaís Regina Dias da Mota | 22403754 | Product Owner e Scrum Master, em conjunto |

## Pauta

1. Revisão do resultado da sprint anterior e dos impedimentos herdados
2. Definição da meta da sprint
3. Seleção das histórias da milestone e conferência dos critérios de aceite
4. Conferência da capacidade da dupla para o período
5. Divisão de responsabilidades entre desenvolvimento e curadoria agronômica
6. Riscos ativos e mitigações do ciclo

## Decisões

### Resultado da Sprint 5 e impedimentos herdados

A Sprint 5 fechou com as 7 histórias aceitas (29 pontos) e o núcleo em 171 de
174 pontos ([ata da revisão](sprint-05-revisao.md)). Os papéis Scrum (#72) e as
datas dos artefatos (#74) ficaram resolvidos. A comunidade parceira (#73)
continua sem definição.

### Meta da sprint

O plano original do ciclo girava em torno da apresentação à comunidade
parceira. Sem comunidade definida, a meta passa a ser **deixar o produto
pronto para ser apresentado**:

- **fechar o núcleo** com a tela de exclusão de conta (US15);
- **as verificações de conformidade**: LGPD (#75), acessibilidade WCAG 2.1 AAA
  (#76) e testes ponta a ponta do fluxo offline (#77);
- **a foto anexada à consulta** (US37), sem depender do modelo de imagem;
- **desdobrar o ADR 0015**, se aprovado: a US39 sai do semestre.

A apresentação (#78) e a validação com produtores do Artefato 6 (#46)
continuam no ciclo, abertas, e só são feitas se a comunidade for definida.

### Itens selecionados

| Issue | Item | Pts | Observação |
| --- | --- | --- | --- |
| [#18](https://github.com/CampusCEUB/AgroScan/issues/18) | US15 - Excluir a conta e os dados | 3 | A rota existe desde a Sprint 1; falta a tela. Fecha o núcleo |
| [#42](https://github.com/CampusCEUB/AgroScan/issues/42) | US37 - Fotografar a planta para anexar ao registro | 5 | Escopo condicionado; a decisão de onde guardar a foto fica para a implementação |
| [#75](https://github.com/CampusCEUB/AgroScan/issues/75) | Revisão de conformidade com a LGPD | - | Tarefa de sprint |
| [#76](https://github.com/CampusCEUB/AgroScan/issues/76) | Auditoria de acessibilidade WCAG 2.1 AAA | - | Tarefa de sprint |
| [#77](https://github.com/CampusCEUB/AgroScan/issues/77) | Testes ponta a ponta do fluxo offline | - | Tarefa de sprint |
| [#78](https://github.com/CampusCEUB/AgroScan/issues/78) | Apresentação à comunidade parceira | - | Depende da #73 |
| [#46](https://github.com/CampusCEUB/AgroScan/issues/46) | Artefato 6 - análise do usuário | - | A validação com produtores depende da #73 |

A US40 (instruções para iPhone), também desta milestone, foi antecipada e
aceita na Sprint 3.

### Calendário comprimido

As Sprints 6 a 8 passam a terminar até **27/11/2026**, para fechar as issues do
semestre nessa data, como decidido na revisão da Sprint 5. As datas das
reuniões seguintes são remarcadas no
[calendário das sprints](../../sprints/README.md).

### Responsáveis

As duas integrantes respondem por todos os itens, com revisão cruzada.

### Riscos do ciclo

| Risco | Mitigação combinada |
| --- | --- |
| **R03 - comunidade parceira** | Materializado: o ciclo segue sem depender dela, e o que depende fica aberto, sem registro do que não aconteceu |
| **R06 - produção defasada** | Cada PR com código passa primeiro pelo AgroScan2, com a prévia da Vercel conferida, antes do PR no institucional |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo |
| --- | --- | --- | --- |
| 1 | Tela de exclusão de conta (US15) | Ambas | 10/11/2026 - ✅ PR [#102](https://github.com/CampusCEUB/AgroScan/pull/102) |
| 2 | Decidir sobre o ADR 0015 e, se aprovado, fechar a #44 como trabalho futuro | Ambas | Sprint 6 |
| 3 | Revisão LGPD, auditoria WCAG e testes ponta a ponta (#75, #76, #77) | Ambas | 23/11/2026 |
| 4 | Foto anexada à consulta, com a decisão de armazenamento em ADR (US37) | Ambas | 23/11/2026 |
| 5 | Remarcar as reuniões das Sprints 6 a 8 para até 27/11 | Ambas | Sprint 6 |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | Comunidade parceira não definida (R03) | Sem apresentação (#78) nem validação com produtores (#46) | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 6 - Comunidade e validação` |
| Issue desta reunião | [#60](https://github.com/CampusCEUB/AgroScan/issues/60) |
| Relatório da sprint | [`sprints/sprint-06.md`](../../sprints/sprint-06.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

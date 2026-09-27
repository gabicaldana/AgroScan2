# Reunião - Sprint 1 · Planejamento

Reunião de abertura da **Sprint 1 - Especificação e gestão** (31/08/2026 a 14/09/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

31/08/2026

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

As decisões abaixo estão registradas em
[`sprints/sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md) e
no [Artefato 2](../../entregas/artefato-2-gestao-do-projeto.md). Esta ata as consolida como
o acordo de abertura do ciclo.

### Cadência e eventos

- Sprints de **duas semanas**. A Sprint 1 abre exceção com **15 dias**, para encerrar exatamente na data de entrega dos Artefatos 1, 2 e 3.
- Eventos por ciclo: **planejamento** na abertura, **alinhamento** no meio, **revisão** e **retrospectiva** no encerramento.
- Acompanhamento por `milestone` no GitHub, com uma `issue` por história de usuário.

### Escopo e backlog

- Backlog organizado em **8 épicos e 41 histórias**, estimadas em Fibonacci: **172 pontos no núcleo (E1-E7)** e 23 pontos condicionados em E8.
- A identificação por imagem (E8) é **escopo condicionado**: o produto tem de ser completo sem ela.
- **Ordem de corte definida antecipadamente**, para o caso de a velocidade ficar abaixo do previsto: (1) culturas além das 12 prioritárias; (2) US30 e US29; (3) US26 e US21; (4) US37.

### Curadoria agronômica

- A curadoria é organizada **por família botânica**, e não por cultura, porque é assim que a literatura fitopatológica está escrita. Uma pesquisa sobre brássicas cobre seis culturas.
- Responsabilidade **compartilhada pelas duas integrantes**, com revisão cruzada obrigatória por *pull request*. Concentrá-la em uma pessoa criaria ponto único de falha no item de maior esforço (risco R01).
- Nenhuma das integrantes tem formação em agronomia: toda ficha cita fonte técnica reconhecida (Embrapa Hortaliças, IAC, AGROFIT/MAPA) com data de acesso.

### Definition of Done

Uma história está concluída quando o código está integrado ao ramo principal com
histórico descritivo; os testes automatizados passam e o CI está verde; os
artefatos gerados estão atualizados em relação às fontes; a funcionalidade foi
verificada em dispositivo móvel real; o comportamento sem conexão foi verificado
quando aplicável; e a documentação afetada foi atualizada.

### Critério de qualidade não negociável

Nenhuma entrega pode fazer o sistema **afirmar mais do que ele sabe**: hipótese
abaixo do limiar não é exibida; a pergunta de desempate só promete descartar
quando a alternativa de fato não espera o sintoma; e a identificação por imagem
declara indisponibilidade em vez de arriscar um palpite. Esse critério vale sobre
qualquer pressão de prazo.

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo |
| --- | --- | --- | --- |
| 1 | Produzir os Artefatos 1, 2 e 3 no formato pedido pela disciplina | Ambas, com revisão cruzada | 14/09/2026 |
| 2 | Estruturar o repositório institucional: requisitos, arquitetura, ADRs, registros de sprint e entrega | Ambas | 14/09/2026 |
| 3 | Consolidar e documentar o incremento já construído | Ambas | 14/09/2026 |
| 4 | Registrar as decisões arquiteturais já tomadas como ADRs | Ambas | 14/09/2026 |
| 5 | Curadoria agronômica das solanáceas | Ambas | 14/09/2026 |

## Impedimentos

| # | Impedimento | Efeito | Situação na abertura |
| --- | --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Impede fixar a priorização das famílias botânicas e a data da apresentação | Aberto - depende da coordenação da disciplina |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | O calendário das Sprints 5 a 8 é provisório | Aberto - depende da professora |
| 3 | Papéis Scrum não atribuídos nominalmente | Os papéis estão descritos, mas sem indicação de quem responde por cada um | Aberto - depende da equipe |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 1 - Especificação e gestão` |
| Issue desta reunião | [#50](https://github.com/CampusCEUB/AgroScan/issues/50) |
| Relatório da sprint | [`sprints/sprint-01.md`](../../sprints/sprint-01.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

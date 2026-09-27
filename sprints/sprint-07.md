# Sprint 7 - Ativos e documentação técnica

## Período

**24/11/2026 a 07/12/2026** (14 dias)

## Objetivo

Converter o sistema construído em **ativo reutilizável e documentado**. A sprint
entrega o website com dados e documentação (Artefato 5) e a arquitetura de
software com os testes de sistema (Artefato 8), além dos relatórios da Atividade
de Extensão.

É a sprint de menor carga de desenvolvimento e maior carga documental: o
produto está completo desde a Sprint 6, e o trabalho agora é deixá-lo em estado
de ser retomado por outra equipe.

## Milestone

[**Sprint 7 - Ativos e documentação técnica**](https://github.com/CampusCEUB/AgroScan/milestone/7) -
prazo em 07/12/2026, com 6 `issues`.

## Marco acadêmico

**Artefato 5 - Gestão dos Ativos** ([#47](https://github.com/CampusCEUB/AgroScan/issues/47))
e **Artefato 8 - Gestão do Produto** ([#48](https://github.com/CampusCEUB/AgroScan/issues/48)).

> ⚠️ Datas a definir pela professora
> ([#74](https://github.com/CampusCEUB/AgroScan/issues/74)). O Artefato 5
> pertence ao 1º bimestre e sua alocação a esta sprint é proposta da equipe, a
> reajustar quando o prazo for divulgado.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 24/11/2026 | [#62](https://github.com/CampusCEUB/AgroScan/issues/62) | [`sprint-07-planejamento.md`](../docs/reunioes/sprint-07-planejamento.md) |
| Revisão | 07/12/2026 | [#63](https://github.com/CampusCEUB/AgroScan/issues/63) | [`sprint-07-revisao.md`](../docs/reunioes/sprint-07-revisao.md) |

## Itens planejados

### Entregas avaliativas

| Issue | Item | Artefato |
| --- | --- | --- |
| [#47](https://github.com/CampusCEUB/AgroScan/issues/47) | Artefato 5 - Gestão dos Ativos: website com dados e documentação | 5 |
| [#48](https://github.com/CampusCEUB/AgroScan/issues/48) | Artefato 8 - Gestão do Produto: arquitetura de software e testes de sistema | 8 |

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#44](https://github.com/CampusCEUB/AgroScan/issues/44) | US39 - Identificação da doença pela foto | E8 | 13 | Desejável *(condicionado)* |

**1 história, 13 pontos - inteiramente condicionados.**

> ⚠️ **A US39 só entra se a auditoria do acervo Digipathos (US38, Sprint 5)
> demonstrar viabilidade.** Caso contrário, é registrada como trabalho futuro
> com a justificativa medida, e o sistema segue declarando ao usuário que a
> funcionalidade não está disponível - em vez de arriscar um palpite. A decisão
> fica registrada em ADR ao fim da Sprint 5.
>
> Se a US39 não entrar, esta sprint fica sem desenvolvimento de produto e a
> capacidade é absorvida pelos Artefatos 5 e 8.

### Tarefas de sprint

| Issue | Tarefa | Natureza |
| --- | --- | --- |
| [#79](https://github.com/CampusCEUB/AgroScan/issues/79) | Relatórios da Atividade de Extensão | Documentação |

### Requisitos cobertos

RF11, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

## Responsáveis

| Item | Responsável |
| --- | --- |
| Artefato 5 - website com dados e documentação (#47) | Ambas as integrantes, com revisão cruzada |
| Artefato 8 - arquitetura de software e testes de sistema (#48) | Ambas as integrantes, com revisão cruzada |
| Relatórios da Atividade de Extensão (#79) | Ambas as integrantes |
| US39, se confirmada | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.**

Entregas esperadas do ciclo:

| Entrega | Critério de aceite |
| --- | --- |
| Artefato 5 - website com dados e documentação | Site publicado, com os dados do projeto e a documentação acessíveis a quem não participou do desenvolvimento |
| Artefato 8 - arquitetura de software | Arquitetura consolidada a partir de [`docs/arquitetura.md`](../docs/arquitetura.md) e das nove ADRs, atualizada para o sistema completo |
| Artefato 8 - testes de sistema | Suíte cobrindo os fluxos ponta a ponta, além dos testes de integração já documentados no Artefato 3 |
| Relatórios da Atividade de Extensão | Registro da apresentação e do retorno da comunidade, no formato exigido pela disciplina |

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.**

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Datas dos Artefatos 5 e 8 não divulgadas** | A alocação a esta sprint é provisória; o Artefato 5 é do 1º bimestre e pode ter prazo anterior | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 2 | **Escopo da US39 indefinido até o fim da Sprint 5** | A capacidade do ciclo varia em 13 pontos conforme a decisão | A resolver na Sprint 5, com a auditoria US38 |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R04 - indisponibilidade do acervo de imagens** | Determina se a US39 é executável | Escopo condicionado, fora do núcleo; decisão registrada em ADR na Sprint 5 |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 07/12/2026.**

## Próximas ações

### Preparação da Sprint 8 (08/12 - 19/12)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Consolidar a execução e a revisão das oito sprints para o Artefato 7 | Artefato 7 |
| 2 | Preparar a publicação do projeto na vitrine de ativos | Artefato 7 |
| 3 | Reunir as métricas de fechamento: pontos entregues, cobertura da base, testes | Artefato 7 |

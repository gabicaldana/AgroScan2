# Sprint 6 - Comunidade e validação

## Período

**10/11/2026 a 23/11/2026** (14 dias)

## Objetivo

Levar o sistema a quem ele foi feito para servir e voltar com evidência. A
sprint apresenta o AgroScan à comunidade parceira da Atividade de Extensão,
valida a análise de usuário com produtores reais e converte o resultado no
Artefato 6.

É também a sprint de conformidade: LGPD, acessibilidade e teste ponta a ponta do
fluxo offline - as verificações que só fazem sentido com o produto praticamente
completo, e que precisam estar feitas antes de expor o sistema a usuários
externos.

## Milestone

[**Sprint 6 - Comunidade e validação**](https://github.com/CampusCEUB/AgroScan/milestone/6) -
prazo em 23/11/2026, com 10 `issues`.

## Marco acadêmico

**Artefato 6 - Gestão do Negócio/Domínio: análise do usuário**
([#46](https://github.com/CampusCEUB/AgroScan/issues/46)) e a **apresentação à
comunidade parceira** ([#78](https://github.com/CampusCEUB/AgroScan/issues/78)).

> ⚠️ Datas a definir pela professora
> ([#74](https://github.com/CampusCEUB/AgroScan/issues/74)) e dependentes da
> identificação da comunidade parceira
> ([#73](https://github.com/CampusCEUB/AgroScan/issues/73)).

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 10/11/2026 | [#60](https://github.com/CampusCEUB/AgroScan/issues/60) | [`sprint-06-planejamento.md`](../docs/reunioes/sprint-06-planejamento.md) |
| Revisão | 23/11/2026 | [#61](https://github.com/CampusCEUB/AgroScan/issues/61) | [`sprint-06-revisao.md`](../docs/reunioes/sprint-06-revisao.md) |

## Itens planejados

### Entrega avaliativa

| Issue | Item | Artefato |
| --- | --- | --- |
| [#46](https://github.com/CampusCEUB/AgroScan/issues/46) | Artefato 6 - Gestão do Negócio/Domínio: análise do usuário revista após a validação | 6 |

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#18](https://github.com/CampusCEUB/AgroScan/issues/18) | US15 - Excluir minha conta e meus dados | E3 | 3 | Obrigatório |
| [#41](https://github.com/CampusCEUB/AgroScan/issues/41) | US40 - Saber como instalar o aplicativo no iPhone | E7 | 3 | Importante |
| [#42](https://github.com/CampusCEUB/AgroScan/issues/42) | US37 - Fotografar a planta para anexar ao registro | E8 | 5 | Desejável *(condicionado)* |

**3 histórias, 11 pontos** - 6 do núcleo e 5 do escopo condicionado.

> **Duas destas já estão meio prontas.** A US15 tem a rota de exclusão
> implementada e testada desde a Sprint 1, faltando a tela; a US37 tem a captura
> pela câmera construída, mas fora da navegação desde a
> [ADR 0008](../docs/decisoes/adr-0008-hierarquia-de-entrada.md).

### Tarefas de sprint

| Issue | Tarefa | Natureza |
| --- | --- | --- |
| [#75](https://github.com/CampusCEUB/AgroScan/issues/75) | Revisão de conformidade com a LGPD | Documentação |
| [#76](https://github.com/CampusCEUB/AgroScan/issues/76) | Auditoria de acessibilidade WCAG 2.1 AAA | Pesquisa |
| [#77](https://github.com/CampusCEUB/AgroScan/issues/77) | Testes ponta a ponta do fluxo offline | Infraestrutura |
| [#78](https://github.com/CampusCEUB/AgroScan/issues/78) | Apresentação à comunidade parceira | Documentação |

### Requisitos cobertos

RF10, RF15, RNF05-RNF11, RNF15-RNF17 e RNF25-RNF28, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

## Responsáveis

| Item | Responsável |
| --- | --- |
| Apresentação à comunidade e coleta de validação (#78) | Ambas as integrantes |
| Artefato 6 - análise de usuário revista (#46) | Ambas as integrantes, com revisão cruzada |
| Tela de exclusão de conta e instruções iOS (US15, US40) | Ambas as integrantes |
| Conformidade LGPD e acessibilidade (#75, #76) | Ambas as integrantes |
| Testes ponta a ponta do fluxo offline (#77) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.**

Entregas esperadas do ciclo:

| Entrega | Critério de aceite |
| --- | --- |
| Apresentação à comunidade parceira | Realizada, com registro de participantes e retorno coletado |
| Artefato 6 | Análise de usuário revista com base no retorno de produtores reais, e não apenas em pesquisa secundária |
| Conformidade com a LGPD | Bases legais, retenção e exclusão documentadas; exclusão de conta acessível pela interface |
| Acessibilidade WCAG 2.1 AAA | Auditoria com apontamentos registrados e correções priorizadas |

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.** O retorno dos produtores é a
> evidência que sustenta o Artefato 6 - registrar em forma verificável, não
> apenas como impressão da equipe.

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | **Bloqueia o ciclo inteiro:** sem comunidade não há apresentação nem validação, e sem validação não há Artefato 6 | Herdado desde a Sprint 1 - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | **Data da apresentação não divulgada** | Pode deslocar o ciclo | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

> ⚠️ **Este é o ciclo em que o R03 deixa de ser risco e passa a ser bloqueio.**
> A definição da comunidade parceira precisa estar resolvida até o encerramento
> da Sprint 5.

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R03 - comunidade parceira não definida** | A sprint inteira se organiza em torno da apresentação | Tratativa com a coordenação da disciplina desde a Sprint 1 |
| **R02 - descarte do armazenamento local em iOS** | A US40 é a mitigação prevista, e a apresentação pode ter participantes usando iPhone | Instruções de instalação e aviso sobre abertura periódica do aplicativo |
| **R06 - ambiente de produção defasado** | Demonstração a usuários externos sobre ambiente errado compromete a validação | Republicação verificada antes da apresentação; item do Definition of Done |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 23/11/2026.**

## Próximas ações

### Preparação da Sprint 7 (24/11 - 07/12)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Consolidar a arquitetura de software para o Artefato 8 | Artefato 8 |
| 2 | Estruturar o website com dados e documentação | Artefato 5 |
| 3 | Reunir os registros da Atividade de Extensão produzidos nesta sprint | Artefato 5 e relatórios de extensão |
| 4 | Confirmar se a US39 entra no ciclo, conforme a decisão registrada na Sprint 5 | Escopo condicionado |

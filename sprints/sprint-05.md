# Sprint 5 - Base completa, feedback e dashboards

## Período

**27/10/2026 a 09/11/2026** (14 dias)

## Objetivo

Fechar a base de conhecimento em **24 culturas e 88 doenças** - a meta de
cobertura do projeto -, completar o ciclo de realimentação do diagnóstico e
entregar os painéis visuais do Artefato 9.

É a sprint que encerra o épico E1 e fecha o laço do produto: até aqui o sistema
só emitia hipóteses; com a US20 ele passa a saber se acertou, e com a US28 da
sprint anterior essa taxa vira indicador. A auditoria do acervo Digipathos
(US38) decide, com dados, se a identificação por imagem entra no semestre.

## Milestone

[**Sprint 5 - Base completa, feedback e dashboards**](https://github.com/CampusCEUB/AgroScan/milestone/5) -
prazo em 09/11/2026, com 8 `issues`.

## Marco acadêmico

**Artefato 9 - Gestão dos Ativos: dashboards incorporados**
([#45](https://github.com/CampusCEUB/AgroScan/issues/45)).

> ⚠️ Data de entrega a definir pela professora
> ([#74](https://github.com/CampusCEUB/AgroScan/issues/74)). A alocação a esta
> sprint é proposta da equipe.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 27/10/2026 | [#58](https://github.com/CampusCEUB/AgroScan/issues/58) | [`sprint-05-planejamento.md`](../docs/reunioes/sprint-05-planejamento.md) |
| Revisão | 09/11/2026 | [#59](https://github.com/CampusCEUB/AgroScan/issues/59) | [`sprint-05-revisao.md`](../docs/reunioes/sprint-05-revisao.md) |

## Itens planejados

### Entrega avaliativa

| Issue | Item | Artefato |
| --- | --- | --- |
| [#45](https://github.com/CampusCEUB/AgroScan/issues/45) | Artefato 9 - Gestão dos Ativos: dashboards incorporados | 9 |

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#8](https://github.com/CampusCEUB/AgroScan/issues/8) | US05 - Cadastrar as doenças das demais famílias botânicas | E1 | 8 | Obrigatório |
| [#23](https://github.com/CampusCEUB/AgroScan/issues/23) | US20 - Informar se o diagnóstico se confirmou | E4 | 3 | Importante |
| [#24](https://github.com/CampusCEUB/AgroScan/issues/24) | US21 - Escrever anotações sobre um canteiro | E4 | 3 | Desejável |
| [#34](https://github.com/CampusCEUB/AgroScan/issues/34) | US41 - Ver os indicadores da horta em painéis visuais | E6 | 5 | Importante |
| [#43](https://github.com/CampusCEUB/AgroScan/issues/43) | US38 - Auditar o acervo Digipathos | E8 | 5 | Importante *(condicionado)* |

**5 histórias, 24 pontos** - 19 do núcleo e 5 do escopo condicionado.

> **A US20 já tem serviço pronto.** A rota da API está implementada e testada
> desde a Sprint 1; o que falta é a tela. São 3 dos 6 pontos classificados como
> parciais na [totalização do Artefato 2](../entregas/artefato-2-gestao-do-projeto.md#26-totalização).

### Requisitos cobertos

RF20, RF21 e RF37, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

## Responsáveis

| Item | Responsável |
| --- | --- |
| Curadoria das famílias restantes - apiáceas, amarilidáceas, amarantáceas, asteráceas e malváceas (US05) | Ambas as integrantes, com revisão cruzada |
| Telas de confirmação e anotação (US20, US21) | Ambas as integrantes |
| Painéis visuais e Artefato 9 (US41, #45) | Ambas as integrantes |
| Auditoria do acervo Digipathos (US38) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

> ⚠️ **A preencher no encerramento da sprint.**

Entregas esperadas do ciclo:

| Entrega | Critério de aceite |
| --- | --- |
| Base de conhecimento completa | 24 culturas e 88 doenças; validação automática aprovada; nenhuma cultura com menos de 3 doenças |
| Artefato 9 - dashboards incorporados | Quatro indicadores agregados em painel; legível em tela de celular; nenhuma informação transmitida só por cor |
| Decisão sobre identificação por imagem | ADR registrando o resultado da auditoria e a decisão de incluir ou não a US39 |

## Issues concluídas

> ⚠️ **A preencher no encerramento da sprint.**

## Pull requests aceitos

> ⚠️ **A preencher ao longo da sprint.**

## Evidências

> ⚠️ **A preencher no encerramento da sprint.** A saída da validação da base
> declarando 24 culturas e 88 doenças é a evidência central deste ciclo.

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Data do Artefato 9 não divulgada** | A alocação a esta sprint pode não corresponder ao prazo real | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 2 | **Comunidade parceira não definida** (R03) | A apresentação da Sprint 6 depende desta definição, que precisa estar resolvida ao fim deste ciclo | Herdado - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R01 - volume da curadoria agronômica** | A US05 concentra cinco famílias botânicas em um único ciclo; é o maior bloco de curadoria restante | Ordem de corte da seção 3.4: culturas além das 12 prioritárias saem primeiro, mantido o mínimo de 3 doenças nas que permanecerem |
| **R04 - indisponibilidade do acervo de imagens** | A auditoria acontece agora e decide o escopo da Sprint 7 | Auditoria com prazo delimitado; resultado registrado em ADR; a US39 é escopo condicionado, fora do núcleo |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 09/11/2026.**

## Próximas ações

### Preparação da Sprint 6 (10/11 - 23/11)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Agendar a apresentação à comunidade parceira | R03 |
| 2 | Preparar o roteiro de validação da análise de usuário com produtores | Artefato 6 |
| 3 | Registrar em ADR a decisão sobre a identificação por imagem | US38 |
| 4 | Confirmar se a US39 entra no escopo da Sprint 7 | Resultado da auditoria |

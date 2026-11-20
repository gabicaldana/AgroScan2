# Reunião - Sprint 5 · Planejamento

Reunião de abertura da **Sprint 5 - Base completa, feedback e dashboards** (27/10/2026 a 09/11/2026), para definir a meta do ciclo e selecionar as histórias da `milestone`.

## Data

27/10/2026

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | ⚠️ a definir |
| Thaís Regina Dias da Mota | 22403754 | ⚠️ a definir |

> Nesta data, a distribuição dos papéis Scrum ainda estava pendente
> ([#72](https://github.com/CampusCEUB/AgroScan/issues/72)). A decisão veio na
> revisão desta sprint.

## Pauta

1. Revisão do resultado da sprint anterior e dos impedimentos herdados
2. Definição da meta da sprint
3. Seleção das histórias da milestone e conferência dos critérios de aceite
4. Conferência da capacidade da dupla para o período
5. Divisão de responsabilidades entre desenvolvimento e curadoria agronômica
6. Riscos ativos e mitigações do ciclo

## Decisões

### Resultado da Sprint 4 e impedimentos herdados

A Sprint 4 fechou com 24 de 27 pontos aceitos e o núcleo em 144 de 172 pontos
([ata da revisão](sprint-04-revisao.md)). Ficaram para este ciclo a US29
([#32](https://github.com/CampusCEUB/AgroScan/issues/32)), a atribuição dos
papéis Scrum ([#72](https://github.com/CampusCEUB/AgroScan/issues/72)), a
comunidade parceira ([#73](https://github.com/CampusCEUB/AgroScan/issues/73)) e
as datas dos artefatos ([#74](https://github.com/CampusCEUB/AgroScan/issues/74)).

### Meta da sprint

Fechar a base de conhecimento em **24 culturas e 88 doenças**, a meta de
cobertura do projeto; completar o ciclo de realimentação do diagnóstico, com a
tela de confirmação (US20); entregar os painéis visuais da horta (US41); e
decidir com dados, pela auditoria do acervo Digipathos (US38), se a
identificação por imagem entra no semestre.

### Histórias selecionadas

| Issue | História | Pts | Observação |
| --- | --- | --- | --- |
| [#8](https://github.com/CampusCEUB/AgroScan/issues/8) | US05 - Doenças das demais famílias botânicas | 8 | Cinco famílias: apiáceas, amarilidáceas, amarantáceas, asteráceas e malváceas, mais a berinjela |
| [#23](https://github.com/CampusCEUB/AgroScan/issues/23) | US20 - Informar se o diagnóstico se confirmou | 3 | A rota existe desde a Sprint 1; falta a tela |
| [#24](https://github.com/CampusCEUB/AgroScan/issues/24) | US21 - Anotações sobre um canteiro | 3 | A tabela `anotacao` existe desde a migração 001 |
| [#34](https://github.com/CampusCEUB/AgroScan/issues/34) | US41 - Indicadores da horta em painéis visuais | 5 | Base do Artefato 9 |
| [#43](https://github.com/CampusCEUB/AgroScan/issues/43) | US38 - Auditar o acervo Digipathos | 5 | Escopo condicionado; decide a US39 |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | US29 - Sintomas mais marcados por cultura | 3 | Vem da Sprint 4 |

**6 histórias, 27 pontos**, 22 do núcleo e 5 do escopo condicionado.

> A US42, sair da conta (2 pontos), entrou na sprint em 06/11, depois desta
> reunião, quando se notou que a interface não oferecia como encerrar a
> sessão ([ADR 0014](../decisoes/adr-0014-sair-da-conta-com-a-fila-sem-dono.md)).
> Com ela, o ciclo ficou com 7 histórias e 29 pontos.

### Capacidade e ordem de corte

- A **US05 é o maior bloco do ciclo** e concentra o risco R01. Se a curadoria
  não couber, a ordem de corte da seção 3.4 do Artefato 2 vale: saem primeiro
  as culturas além das 12 prioritárias, mantido o mínimo de 3 doenças nas que
  ficarem.

### Responsáveis

As duas integrantes respondem por todos os itens, com revisão cruzada na
curadoria: curadoria das famílias restantes (US05), telas de confirmação e
anotação (US20, US21), painéis e Artefato 9 (US41, #45) e auditoria do acervo
(US38).

### Riscos do ciclo

| Risco | Mitigação combinada |
| --- | --- |
| **R01 - volume da curadoria** | Ordem de corte acima; a curadoria começa na primeira semana, como ajustado na revisão da Sprint 4 |
| **R04 - acervo de imagens** | Auditoria com prazo delimitado e resultado em ADR; a US39 continua fora do núcleo |
| **R06 - produção defasada** | O aceite inclui a carga no Neon e o espelho atualizado (ajuste da revisão da Sprint 4) |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo |
| --- | --- | --- | --- |
| 1 | Curadoria das famílias restantes, com fontes e conferência no AGROFIT | Ambas | 09/11/2026 |
| 2 | Telas de confirmação (US20) e anotação (US21) | Ambas | 09/11/2026 |
| 3 | Relatório de sintomas por cultura (US29) | Ambas | 09/11/2026 |
| 4 | Painel da horta com os quatro indicadores (US41) | Ambas | 09/11/2026 |
| 5 | Auditoria do Digipathos e ADR com a decisão sobre a US39 (US38) | Ambas | 09/11/2026 |
| 6 | Definir os papéis Scrum | Ambas | 09/11/2026 |
| 7 | Pedir à coordenação a comunidade parceira e à professora as datas dos artefatos | Ambas | 09/11/2026 |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | Data do Artefato 9 não divulgada | A alocação a esta sprint pode não corresponder ao prazo real | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 2 | Comunidade parceira não definida (R03) | A Sprint 6 depende dela | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 3 | Papéis Scrum não atribuídos | Registros sem responsável nominal | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 5 - Base completa, feedback e dashboards` |
| Issue desta reunião | [#58](https://github.com/CampusCEUB/AgroScan/issues/58) |
| Relatório da sprint | [`sprints/sprint-05.md`](../../sprints/sprint-05.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

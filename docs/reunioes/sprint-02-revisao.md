# Reunião - Sprint 2 · Revisão

Reunião de encerramento da **Sprint 2 - Base de conhecimento e publicação** (15/09/2026 a 28/09/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

28/09/2026

> A data corresponde ao último dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md). ⚠️ Confirmar a data em que a reunião de fato ocorreu. Ata redigida em 16/10/2026 a partir dos registros do repositório (relatório da sprint, `pull requests`, CHANGELOG e ADRs); revisar pela equipe.

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

| Issue | Item | Decisão | Verificação |
| --- | --- | --- | --- |
| [#6](https://github.com/CampusCEUB/AgroScan/issues/6) | **US03** - Doenças das brássicas | ✅ Aceita | 6 culturas com 3 doenças cada, 4 sintomas novos; validação aprovada |
| [#40](https://github.com/CampusCEUB/AgroScan/issues/40) | **US36** - Atualização do catálogo sem reinstalar | ✅ Aceita | 25 testes dos casos de falha; 8 defeitos achados em revisão e corrigidos na raiz |
| [#70](https://github.com/CampusCEUB/AgroScan/issues/70) | Batata e pimentão com 3 doenças | ✅ Aceita | Validação sem avisos, base `2026.09.27` |
| [#66](https://github.com/CampusCEUB/AgroScan/issues/66) | CI executa os testes da API (R07) | ✅ Aceita | [Execução #36340336427](https://github.com/CampusCEUB/AgroScan/actions/runs/36340336427): `success`, 74 testes, `skipped 0` |
| [#69](https://github.com/CampusCEUB/AgroScan/issues/69) | README do código no estado real | ✅ Aceita | Hoje em [`docs/aplicacao.md`](../aplicacao.md) |
| [#71](https://github.com/CampusCEUB/AgroScan/issues/71) | Backlog no GitHub | ✅ Aceita | 8 milestones, 81 issues, 16 reuniões; [PR #82](https://github.com/CampusCEUB/AgroScan/pull/82) |
| [#68](https://github.com/CampusCEUB/AgroScan/issues/68) | Hierarquia de entrada no publicado | ✅ Aceita | Conferida em 27/09: `/sintomas` responde 308 para `/`, service worker `v5` servido |
| [#4](https://github.com/CampusCEUB/AgroScan/issues/4) | **US01** - Lista organizada de hortaliças | ❌ Não aceita | 2 de 3 critérios; o terceiro pede 24 culturas |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicação e versão do catálogo no publicado | ❌ Não aceita no ciclo | Bloqueada: a Vercel publica do repositório antigo |
| [#72](https://github.com/CampusCEUB/AgroScan/issues/72), [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) | Papéis, comunidade, datas | ⬜ Abertas | Dependem da equipe e de terceiros |

**Critério C11** (o publicado reflete a versão entregue): **não atendido no
ciclo**. O publicado ainda servia a versão anterior do catálogo.

**13 de 16 pontos planejados aceitos** (US03 e US36). Somados aos 88 da Sprint 1,
o núcleo chega a **101 de 172 pontos (59%)**.

**Testes: 267, nenhuma falha e nenhum pulado** (74 em Python, 193 em
TypeScript), em 27/09/2026. A base passou para **9 hortaliças** nos quatro
grupos do catálogo.

### Decisões ratificadas na revisão

- **Repositório único.** O código saiu de `gabicaldana/AgroScan2` e passou a ocupar o repositório institucional, ao lado da documentação. O que a disciplina avalia é o institucional, e ele não continha o produto. Os 12 commits originais seguem no repositório antigo, onde os hashes citados na Sprint 1 continuam resolvendo. Registro no [Artefato 2, §4.1](../../entregas/artefato-2-gestao-do-projeto.md#41-repositório-único).
- **Artefatos em `entregas/`.** Os documentos dos Artefatos 1, 2 e 3 foram para junto dos registros de entrega; `docs/` fica só com a documentação técnica de apoio.
- **Registros históricos não são reescritos.** Atas, relatório da Sprint 1 e registros de entrega descrevem o que era verdade na época.
- **A US01 vai para a Sprint 5**, quando a base fecha as 24 culturas. Os pontos dela só contam no aceite completo.
- **A #67 segue para a Sprint 3**, junto com o impedimento novo criado pela migração (a Vercel ligada ao repositório antigo).
- **#72, #73 e #74 continuam abertas** e acompanham as sprints seguintes até a resposta da equipe e de terceiros.

### Retrospectiva - o que funcionou

- **O fluxo de `pull request` foi adotado.** Os PRs [#82](https://github.com/CampusCEUB/AgroScan/pull/82) e [#83](https://github.com/CampusCEUB/AgroScan/pull/83) foram os primeiros do projeto, e o CI passou a rodar no repositório avaliado.
- **A curadoria por família se pagou como previsto.** Um levantamento sobre patógenos de crucíferas cobriu seis culturas, porque *Hyaloperonospora brassicae*, *Alternaria brassicae* e *Xanthomonas campestris* atacam todas.
- **Os testes de falha pegaram defeito real.** O `lerGuardado` devolvia `null` para JSON corrompido sem apagar a chave, e o lixo ficaria no `localStorage` para sempre.
- **Verificar antes de fechar.** #66 e #69 tinham código pronto desde 12/09, e só fecharam com evidência: a execução do CI com `skipped 0`.

### Retrospectiva - o que não funcionou

- **Oito defeitos na US36, com uma causa só:** o catálogo ativo tinha mais de um dono. A reconstrução dos índices ficou a cargo de quem chamava, e só um componente foi ligado. É o mesmo erro da "documentação envelhecida" da Sprint 1, desta vez no código.
- **A US01 foi alocada com um critério que o ciclo não podia cumprir.** Pedir 24 culturas na Sprint 2 garantia que a história não fechasse.
- **A migração criou um impedimento que ninguém previu.** O código veio para o institucional, mas a publicação continuou saindo do repositório antigo, e o R06 se agravou.
- **A integração se concentrou no fim do ciclo.** Quase todo o código entrou em 27/09, véspera da revisão, e deixou pouca margem para a revisão cruzada da curadoria.
- **A carga das brássicas não chegou ao banco de produção, e ninguém notou.** O `tipo_agente` "protista" da hérnia das crucíferas abortava o seed, e toda consulta enviada a partir de 27/09 respondia 500. Só foi descoberto na Sprint 3, e entra aqui porque a causa é deste ciclo.
- **As atas não foram registradas na data das reuniões.**

### Ajustes de processo para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| Estado compartilhado (qual catálogo vale, qual sessão vale) tem **um dono só**, que atualiza e notifica | 8 defeitos da US36 |
| Critério de aceite que depende de sprint futura é **fatiado no planejamento**, ou a história é alocada à sprint que pode fechá-la | US01 |
| Mudança de infraestrutura (repositório, publicação) tem o efeito sobre a publicação conferido **antes** de ser feita | Impedimento da Vercel |
| Integrar em lotes menores ao longo do ciclo, com a revisão cruzada da curadoria na primeira semana | Concentração em 27/09 |
| Ata registrada no dia da reunião, ainda que curta | Atas vazias |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Origem |
| --- | --- | --- | --- | --- |
| 1 | Destravar a publicação: resolver a ligação da Vercel e concluir a #67 | Ambas | Início da Sprint 3 | Impedimento 5 |
| 2 | Modelar as rotas de horta, membros e canteiros na API | Ambas | 12/10/2026 | Épico E5 |
| 3 | Iniciar a curadoria das cucurbitáceas (US04) | Ambas | 12/10/2026 | Épico E1 |
| 4 | Conferir as 18 fichas das brássicas contra as fontes, com atenção à hérnia das crucíferas (única ficha sem defensivo) | Ambas | Primeira semana da Sprint 3 | DoD da curadoria |
| 5 | Atualizar as actions do CI (Node.js 20 depreciado; `ubuntu-latest` migra para o Ubuntu 26 em 19/10) | Ambas | Antes de 19/10/2026 | Avisos do CI |
| 6 | Completar o relatório da Sprint 2 (PRs e retrospectiva) | Ambas | 29/09/2026 | Pauta 5 |
| 7 | Atribuir nominalmente os papéis Scrum | Ambas | Sprint 3 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 8 | Insistir com a coordenação e a professora sobre a comunidade parceira e as datas | Ambas | Sprint 3 | [#73](https://github.com/CampusCEUB/AgroScan/issues/73), [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

## Impedimentos

| # | Impedimento | Situação |
| --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 não divulgadas | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | Papéis Scrum não atribuídos nominalmente | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | Dependência de teste ausente (R07) | ✅ **Resolvido** - CI com `skipped 0` em 27/09 |
| 5 | Vercel ligada ao repositório antigo | **Novo, criado pela migração.** Mantém a #67 bloqueada e agrava o R06. Resolvido na Sprint 3 por decisão ([ADR 0011](../decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md)) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 2 - Base de conhecimento e publicação` |
| Issue desta reunião | [#53](https://github.com/CampusCEUB/AgroScan/issues/53) |
| Relatório da sprint | [`sprints/sprint-02.md`](../../sprints/sprint-02.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

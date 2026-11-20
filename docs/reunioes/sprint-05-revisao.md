# Reunião - Sprint 5 · Revisão

Reunião de encerramento da **Sprint 5 - Base completa, feedback e dashboards** (27/10/2026 a 09/11/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

09/11/2026

> Os pull requests de quatro histórias (US05 e US01, US21, US41 e US38) foram
> aceitos em 10/11/2026, e o aceite delas está registrado com essa data.

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | Product Owner e Scrum Master, em conjunto |
| Thaís Regina Dias da Mota | 22403754 | Product Owner e Scrum Master, em conjunto |

> Os papéis foram decididos nesta reunião (ver Decisões) e registrados no
> Artefato 2 §4.6 pelo PR [#99](https://github.com/CampusCEUB/AgroScan/pull/99).

## Pauta

1. Demonstração do incremento construído no ciclo
2. Aceite história a história contra os critérios de aceite e o Definition of Done
3. Conferência de que o ambiente publicado reflete a versão entregue (critério C11)
4. Retrospectiva: o que funcionou, o que não funcionou, ajustes de processo
5. Atualização do relatório da sprint e do CHANGELOG
6. Encaminhamentos para o planejamento do ciclo seguinte

## Decisões

### Aceite do incremento

| Issue | Item | Decisão | Verificação |
| --- | --- | --- | --- |
| [#23](https://github.com/CampusCEUB/AgroScan/issues/23) | **US20** - Informar se o diagnóstico se confirmou | ✅ Aceita em 06/11 | Pergunta "O diagnóstico se confirmou?" em cada registro sincronizado; doença real só da mesma cultura; TI33 a TI36 na API, um em banco real (PR [#95](https://github.com/CampusCEUB/AgroScan/pull/95)) |
| [#32](https://github.com/CampusCEUB/AgroScan/issues/32) | **US29** - Sintomas mais marcados por cultura | ✅ Aceita em 06/11 | Recorte da horta e do sistema, conferidos contra a contagem da carga de exemplo em banco real (PR [#96](https://github.com/CampusCEUB/AgroScan/pull/96)) |
| [#97](https://github.com/CampusCEUB/AgroScan/issues/97) | **US42** - Sair da conta | ✅ Aceita em 09/11 | Sair só com a fila vazia ou apagando o que não subiu; `conta.test.ts` cobre fila vazia, rede, sem rede, recusa e apagar (PR [#98](https://github.com/CampusCEUB/AgroScan/pull/98), [ADR 0014](../decisoes/adr-0014-sair-da-conta-com-a-fila-sem-dono.md)) |
| [#8](https://github.com/CampusCEUB/AgroScan/issues/8) | **US05** - Doenças das demais famílias botânicas | ✅ Aceita em 10/11 | Base `2026.11.09` com 24 culturas e 88 doenças, nenhuma cultura com menos de 3; validação sem aviso; ingredientes ativos conferidos no AGROFIT (PR [#103](https://github.com/CampusCEUB/AgroScan/pull/103)) |
| [#4](https://github.com/CampusCEUB/AgroScan/issues/4) | **US01** - Encontrar a hortaliça numa lista organizada | ✅ Aceita em 10/11 | Com as 24 culturas, os cinco grupos ficam completos no seletor (PR [#103](https://github.com/CampusCEUB/AgroScan/pull/103)) |
| [#24](https://github.com/CampusCEUB/AgroScan/issues/24) | **US21** - Anotações sobre um canteiro | ✅ Aceita em 10/11 | Anotação de canteiro e de consulta; só a autora edita; `test_anotacoes.py` com 14 casos (PR [#100](https://github.com/CampusCEUB/AgroScan/pull/100)) |
| [#34](https://github.com/CampusCEUB/AgroScan/issues/34) | **US41** - Indicadores da horta em painéis | ✅ Aceita em 10/11 | Painel da horta com os quatro indicadores; nada só por cor; uma coluna no celular (PR [#101](https://github.com/CampusCEUB/AgroScan/pull/101)) |
| [#43](https://github.com/CampusCEUB/AgroScan/issues/43) | **US38** - Auditar o acervo Digipathos | ✅ Aceita em 10/11 | [Relatório](../auditoria-digipathos.md): 1 das 88 doenças com imagens, 4 fotos; decisão no [ADR 0015](../decisoes/adr-0015-identificacao-por-imagem.md) (PR [#104](https://github.com/CampusCEUB/AgroScan/pull/104)) |

**29 de 29 pontos planejados aceitos**, as 7 histórias do ciclo, e a US01, que
dependia da base completa, fecha junto. O núcleo chega a **171
de 174 pontos**; falta só a US15 (3 pontos), que é da Sprint 6.

**CI verde no `main`** depois de cada PR, até o último
([execução #42867908905](https://github.com/CampusCEUB/AgroScan/actions/runs/42867908905), PR #105).

**Critério C11:** ✅ a base `2026.11.09` foi carregada no Neon
(`app.seed --gerar-sql`). Conferido em 20/11: o
[`/api/v1/saude`](https://agroscan-blond.vercel.app/api/v1/saude) publicado
responde `versao_catalogo: 2026.11.09` com `catalogo_no_banco: true`.

**Pull requests aceitos no ciclo:**
[#94](https://github.com/CampusCEUB/AgroScan/pull/94) (encerramento da Sprint 4),
[#95](https://github.com/CampusCEUB/AgroScan/pull/95),
[#96](https://github.com/CampusCEUB/AgroScan/pull/96),
[#98](https://github.com/CampusCEUB/AgroScan/pull/98),
[#99](https://github.com/CampusCEUB/AgroScan/pull/99) (papéis e artefatos),
[#100](https://github.com/CampusCEUB/AgroScan/pull/100),
[#101](https://github.com/CampusCEUB/AgroScan/pull/101),
[#103](https://github.com/CampusCEUB/AgroScan/pull/103),
[#104](https://github.com/CampusCEUB/AgroScan/pull/104) e
[#105](https://github.com/CampusCEUB/AgroScan/pull/105) (ajustes de navegação).

### Decisões sobre o semestre

| Decisão | Registro |
| --- | --- |
| **Papéis Scrum**: Product Owner e Scrum Master são exercidos em conjunto pela dupla. Numa equipe de duas, separar os papéis deixaria cada decisão com uma integrante só | Artefato 2 §4.6, PR [#99](https://github.com/CampusCEUB/AgroScan/pull/99); fecha a [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| **Artefatos 5 a 9 não são documentos à parte nem têm data própria**: o conteúdo de cada um é o próprio projeto (aplicação, `docs/`, ADRs, atas, milestones) | Idem; fecha a [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| **O Artefato 4 não existe** | Idem |
| **A comunidade parceira não está definida.** A apresentação (#78), os relatórios da extensão (#79) e a validação com produtores do Artefato 6 (#46) ficam abertos até haver comunidade, e nenhum registro deles é escrito antes de acontecerem | [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| **Meta: fechar as demais issues até 27/11/2026**, com as Sprints 6 a 8 comprimidas para terminar até essa data | Esta revisão |
| **A identificação por imagem sai do semestre** (proposta): a US39 vira trabalho futuro, com piso de 100 fotos independentes por classe para ser retomada | [ADR 0015](../decisoes/adr-0015-identificacao-por-imagem.md), proposto em 09/11 |

### Retrospectiva - o que funcionou

- **A meta de cobertura saiu inteira.** A base fechou em 24 culturas e 88
  doenças, sem acionar a ordem de corte, com cada ingrediente ativo conferido
  no AGROFIT.
- **As histórias que tinham o serviço pronto andaram primeiro.** US20 e US29
  foram aceitas em 06/11, no meio do ciclo, e a US42, em 09/11.
- **A decisão sobre a imagem saiu de dados.** A auditoria mediu o acervo
  arquivo a arquivo antes de a US39 consumir uma sprint.
- **O CI ficou verde em todos os PRs do ciclo.**

### Retrospectiva - o que não funcionou

- **Sete PRs entraram no mesmo dia (10/11)**, entre eles a base completa e a
  auditoria. O ajuste "um PR por semana" da Sprint 4 valeu para a primeira
  metade do ciclo, e não para a segunda.
- **A comunidade parceira continua sem definição**, e a Sprint 6 foi planejada
  em torno dela.

### Ajustes de processo para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| **Fechar cada issue com o PR que a resolve**, e não em bloco no fim do ciclo | PRs concentrados em 10/11 |
| **Planejar a Sprint 6 sem depender da comunidade**: conformidade (LGPD, acessibilidade, testes ponta a ponta) e a US37 seguem, e o que depende da comunidade fica aberto | Decisão sobre a comunidade |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Origem |
| --- | --- | --- | --- | --- |
| 1 | Registrar papéis e artefatos (#72, #74) | Ambas | 10/11/2026 | ✅ PR #99 |
| 2 | Aplicar a base `2026.11.09` no Neon e conferir o `/saude` | Ambas | Início da Sprint 6 | C11 |
| 3 | Aprovar ou não o ADR 0015 e desdobrar a US39 | Ambas | Início da Sprint 6 | US38 |
| 4 | Tela de exclusão de conta (US15) | Ambas | Sprint 6 | Backlog |
| 5 | Preencher o relatório da Sprint 5 e o CHANGELOG | Ambas | Início da Sprint 6 | Pauta 5 |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | Data do Artefato 9 não divulgada | - | ✅ Resolvido: os artefatos não têm data própria (#74) |
| 2 | Papéis Scrum não atribuídos | - | ✅ Resolvido: papéis em conjunto (#72) |
| 3 | Comunidade parceira não definida (R03) | Apresentação, extensão e validação do Artefato 6 sem como acontecer | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 5 - Base completa, feedback e dashboards` |
| Issue desta reunião | [#59](https://github.com/CampusCEUB/AgroScan/issues/59) |
| Relatório da sprint | [`sprints/sprint-05.md`](../../sprints/sprint-05.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

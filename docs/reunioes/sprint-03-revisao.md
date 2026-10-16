# Reunião - Sprint 3 · Revisão

Reunião de encerramento da **Sprint 3 - Horta, canteiros e manejo** (29/09/2026 a 12/10/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

12/10/2026

> A data corresponde ao último dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).

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

Registro completo em [`sprints/sprint-03.md`](../../sprints/sprint-03.md) e no
[CHANGELOG](../../CHANGELOG.md#sprint-3---horta-canteiros-e-manejo--2909-a-12102026).

| Issue | Item | Decisão | Verificação |
| --- | --- | --- | --- |
| [#25](https://github.com/CampusCEUB/AgroScan/issues/25) | **US22** - Cadastrar minha horta | ✅ Aceita | Testes de contrato; roteiro no publicado |
| [#26](https://github.com/CampusCEUB/AgroScan/issues/26) | **US23** - Associar pessoas à horta | ✅ Aceita | Convite por e-mail, recusas por papel e transferência conferidos com três contas de teste |
| [#27](https://github.com/CampusCEUB/AgroScan/issues/27) | **US24** - Canteiros com a cultura plantada | ✅ Aceita | Canteiro encerrável e de cultura fixa; canteiro de couve no publicado |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | **US25** - Vincular a consulta ao canteiro | 🟡 **Parcial** | Seletor de canteiro sem rede, vínculo opcional e `GET /consultas?canteiro_id=` prontos; falta o filtro por canteiro **na tela** do caderno |
| [#29](https://github.com/CampusCEUB/AgroScan/issues/29) | **US26** - Registrar o manejo | ✅ Aceita | Atalho do laudo com a doença já marcada; manejo preservado na exclusão de conta |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicar e conferir a versão do catálogo | ✅ Aceita | API publicada; `/saude` com catálogo `2026.09.27`, banco `ok` e `catalogo_no_banco: true` |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | **US04** - Cucurbitáceas | ❌ **Não entregue** | A base segue em `2026.09.27`, com 9 culturas; nenhuma cucurbitácea curada |

**Critério C11:** ✅ atendido. O `/api/v1/saude` publicado informa o catálogo do
ramo principal, com `catalogo_no_banco: true`.

**Fora do planejado, também entregue:**

| Issue | Item | Observação |
| --- | --- | --- |
| [#22](https://github.com/CampusCEUB/AgroScan/issues/22) | US19 - Caderno filtrável e legível sem rede | Completa os critérios de filtro por período e cultura, paginação e leitura offline do histórico |
| [#41](https://github.com/CampusCEUB/AgroScan/issues/41) | **US40** - Instalar no iPhone | **Antecipada da Sprint 6.** Instruções só no iOS, com o aviso de abrir o app toda semana (R02) |

**16 de 27 pontos planejados aceitos** (US22, US23, US24 e US26), mais os 3 da
US40 antecipada. O núcleo chega a **120 de 172 pontos (70%)**.

**Testes: 331, nenhuma falha** (117 em Python e 214 em TypeScript), no PR #85,
em 09/10/2026, com 36 testes novos de contrato HTTP em `tests/test_hortas.py`.
CI verde no `main` após o PR #86
([execução #37978274215](https://github.com/CampusCEUB/AgroScan/actions/runs/37978274215)).
O roteiro ponta a ponta no publicado passou nas 36 verificações.

**Pull requests aceitos:** [#84](https://github.com/CampusCEUB/AgroScan/pull/84)
(publicação da API), [#85](https://github.com/CampusCEUB/AgroScan/pull/85)
(hortas, canteiros e manejo) e [#86](https://github.com/CampusCEUB/AgroScan/pull/86)
(código em `src/`).

### Decisões ratificadas na revisão

| Decisão | Registro |
| --- | --- |
| **Dois projetos na Vercel**, o PWA (`src/web`) e a API (`src`, preset *Other*), com a API atrás do PWA por *rewrite*; função em `gru1`, junto do banco | [ADR 0010](../decisoes/adr-0010-publicacao-em-dois-projetos.md) |
| **Dois repositórios**: o institucional, completo e avaliado, e `gabicaldana/AgroScan2` como espelho de publicação, avançado só por fast-forward depois de cada merge. A organização não autoriza ligar a Vercel aqui, então o reapontamento deixa de ser pendência | [ADR 0011](../decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md) |
| **Acesso por participação na horta**: quem não participa recebe 404; um responsável só, trocado por transferência; canteiro e manejo são de qualquer membro | [ADR 0012](../decisoes/adr-0012-acesso-por-horta.md) |
| **Exclusão de conta com anonimização**: com manejo registrado, a conta vira "Conta excluída" em vez de ser apagada, preservando a rastreabilidade do defensivo (LGPD, art. 12) | [ADR 0012](../decisoes/adr-0012-acesso-por-horta.md) |
| **Todo o código em `src/`**, a pedido da professora; Documentos de Software v1 e v2 removidos, substituídos pelos artefatos em `entregas/` | [PR #86](https://github.com/CampusCEUB/AgroScan/pull/86) |
| **A validação da base confere as regras do banco** (ids e `tipo_agente`) e roda no CI. Valor fora do banco passa a quebrar o CI, e não a carga em produção | Migrações 002 e 003 |
| **Actions do CI atualizadas** (`checkout@v5`, `setup-python@v6`, `setup-node@v5`) e runner fixado em `ubuntu-24.04`, antes da migração do `ubuntu-latest` em 19/10 | [`ci.yml`](../../.github/workflows/ci.yml) |
| **`/saude` expõe `catalogo_no_banco`** e deixa de expor a mensagem de erro do banco em produção | CHANGELOG |
| **A US04 e a US25 vão para a Sprint 4.** A US04 tem prioridade sobre as apiáceas e amarilidáceas previstas para aquele ciclo; a US25 fecha com o filtro por canteiro na tela do caderno | Esta revisão |

### Incidentes do ciclo

| Incidente | Duração | Efeito | Correção |
| --- | --- | --- | --- |
| **API nunca publicada** desde a Sprint 1 | Até 08/10 | Cadastro, login e sincronização davam 404 no site; o diagnóstico seguia funcionando porque roda no navegador | Projeto `agroscan-api` e `API_URL` no PWA (ADR 0010) |
| **`"framework": null` no `vercel.json`** derrubou o PWA | ~10 minutos em 08/10 | Todas as páginas com 404 | Revertido; o preset fica no painel de cada projeto |
| **Catálogo `2026.09.27` preso fora do banco**: `protista` e `couve_flor` violavam o esquema | 27/09 a 09/10 | Toda consulta enviada dava 500. A fila offline guardou tudo no aparelho, e nada se perdeu | Migrações 002 e 003, carga separada em dois arquivos, aplicada no Neon em 09/10 |

### Retrospectiva - o que funcionou

- **A fila offline provou o seu valor em produção.** Durante os 12 dias de consultas recusadas pelo banco, nenhuma se perdeu: a idempotência do ADR 0009 permitiu reenviar tudo sem duplicar.
- **Decidir em ADR antes de codificar.** As regras de acesso à horta foram escritas antes, e uma alternativa (`ON DELETE SET NULL` no manejo) foi revertida antes de ir ao banco porque contrariava a decisão registrada.
- **Verificação ponta a ponta no publicado**, com três contas (responsável, membro e alguém de fora), e as contas de teste apagadas ao fim.
- **Ensaio antes de produção.** O SQL incremental foi rodado num PostgreSQL embutido igual ao de produção, duas vezes seguidas, antes de ir ao Neon.

### Retrospectiva - o que não funcionou

- **A API passou duas sprints fora do ar sem ninguém notar.** O critério C11 era conferido só no PWA, e o diagnóstico, que roda no navegador, escondia o problema. Foi descoberto ao tentar criar uma conta.
- **O banco ficou 12 dias sem receber o catálogo.** A carga em produção não fazia parte da conclusão de uma ficha nova, e nenhum sinal de saúde dizia se o catálogo estava no banco.
- **A curadoria ficou para trás de novo.** A US04 não andou: publicação, incidentes e os 19 pontos do E5 consumiram a capacidade. É o R01 materializado, e a curadoria não tinha tempo reservado no ciclo.
- **A conferência das brássicas contra as fontes não aconteceu na primeira semana**, como combinado no planejamento.
- **A US25 foi entregue sem o filtro na tela**, e o PR não sinalizou a lacuna.
- **O trabalho se concentrou de novo no fim do ciclo.** Todo o código entrou em 08 e 09/10, apesar do ajuste combinado na Sprint 2.
- **Um nome de banco com espaço no fim** (`agroscan `) fez as duas primeiras tentativas de carga irem ao banco errado.

### Ajustes de processo para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| O critério C11 passa a incluir **a API e o banco**: `/api/v1/saude` com banco `ok` e `catalogo_no_banco: true`, além do PWA | API fora do ar sem ninguém notar |
| **Ficha nova só está concluída com a carga aplicada em produção** e conferida pelo `/saude` | Catálogo preso no banco |
| **A curadoria tem tempo reservado no ciclo**, começando na primeira semana, e não o que sobra do desenvolvimento | US04 não entregue |
| Mudança no `vercel.json` é conferida **nos dois projetos** antes do merge | Incidente do PWA |
| Ao fim de cada sprint, conferir que o `main` tem o mesmo hash nos dois repositórios | ADR 0011 |
| Cada critério de aceite é marcado na `issue` antes de pedir o fechamento | US25 parcial |

## Encaminhamentos

| # | Encaminhamento | Responsável | Prazo | Origem |
| --- | --- | --- | --- | --- |
| 1 | Curadoria das cucurbitáceas (US04), com prioridade sobre as apiáceas e amarilidáceas | Ambas | 26/10/2026 | [#7](https://github.com/CampusCEUB/AgroScan/issues/7) |
| 2 | Filtro por canteiro na tela do caderno, para fechar a US25 | Ambas | 26/10/2026 | [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| 3 | Conferir as fichas das brássicas contra as fontes, ainda pendente | Ambas | 19/10/2026 | [#6](https://github.com/CampusCEUB/AgroScan/issues/6) |
| 4 | Preparar uma carga de registros de exemplo (horta, canteiros, consultas e feedbacks) para demonstrar os relatórios | Ambas | Início da Sprint 4 | Impedimento da Sprint 4 |
| 5 | Conferir as consultas SQL dos relatórios em [`docs/modelo-de-dados.md`](../modelo-de-dados.md) §6 contra o esquema atual | Ambas | Início da Sprint 4 | Épico E6 |
| 6 | Cobrir com teste em banco real a restrição de unicidade do `offline_id` | Ambas | Sprint 4 | Lacuna do ADR 0009 |
| 7 | Comparar o hash do `main` no institucional e no espelho | Ambas | 13/10/2026 | ADR 0011 |
| 8 | Encerrar as milestones 2 e 3 e atualizar o estado das histórias no Artefato 2 (US22 a US26 e US40) | Ambas | 15/10/2026 | Pauta 5 |
| 9 | Atribuir nominalmente os papéis Scrum | Ambas | Sprint 4 | [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 10 | Cobrar a definição da comunidade parceira: a Sprint 6 depende dela | Ambas | Sprint 4 | [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | API nunca publicada | Cadastro e login davam 404 no site | ✅ Resolvido em 08/10 - [ADR 0010](../decisoes/adr-0010-publicacao-em-dois-projetos.md) |
| 2 | Framework Preset do `agroscan-api` detectado como FastAPI | Os pushes falhavam na publicação da API | ✅ Resolvido em 08/10 - preset *Other* |
| 3 | Banco preso no catálogo `2026.09.03` | Toda consulta dava 500 desde 27/09 | ✅ Resolvido em 09/10 - migrações 002 e 003 |
| 4 | Vercel ligada ao repositório antigo | O publicado não refletia o institucional | ✅ Encerrado por decisão - [ADR 0011](../decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md). O R06 passa a ser "espelho atrasado" |
| 5 | Comunidade parceira não definida (R03) | A Sprint 6 inteira depende dela | Aberto - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 6 | Datas dos Artefatos 5 a 9 não divulgadas | Calendário das Sprints 5 a 8 provisório | Aberto - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 7 | Papéis Scrum não atribuídos nominalmente | Registros sem responsável nominal | Aberto - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 3 - Horta, canteiros e manejo` |
| Issue desta reunião | [#55](https://github.com/CampusCEUB/AgroScan/issues/55) |
| Relatório da sprint | [`sprints/sprint-03.md`](../../sprints/sprint-03.md) |
| Backlog | [Artefato 2, §2.5](../../entregas/artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |

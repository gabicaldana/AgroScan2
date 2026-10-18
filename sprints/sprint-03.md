# Sprint 3 - Horta, canteiros e manejo

## Período

**29/09/2026 a 12/10/2026** (14 dias)

## Objetivo

Sair do diagnóstico isolado e dar ao produtor um lugar onde o registro se
organiza: a horta, seus canteiros e o manejo aplicado. É a sprint que introduz o
épico E5 por inteiro e cria a estrutura de dados sobre a qual os relatórios da
Sprint 4 serão calculados - sem canteiro cadastrado não há agregação por
período nem alerta de rotação.

Em paralelo, a curadoria avança pelas cucurbitáceas e fecha as solanáceas.

## Milestone

[**Sprint 3 - Horta, canteiros e manejo**](https://github.com/CampusCEUB/AgroScan/milestone/3) -
prazo em 12/10/2026, com 8 `issues`. Encerrada em 16/10/2026; US04 e US25
realocadas à Sprint 4.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 29/09/2026 | [#54](https://github.com/CampusCEUB/AgroScan/issues/54) | [`sprint-03-planejamento.md`](../docs/reunioes/sprint-03-planejamento.md) |
| Revisão | 12/10/2026 | [#55](https://github.com/CampusCEUB/AgroScan/issues/55) | [`sprint-03-revisao.md`](../docs/reunioes/sprint-03-revisao.md) |

## Itens planejados

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Cadastrar as doenças das cucurbitáceas e fechar as solanáceas | E1 | 8 | Obrigatório |
| [#25](https://github.com/CampusCEUB/AgroScan/issues/25) | US22 - Cadastrar minha horta | E5 | 3 | Importante |
| [#26](https://github.com/CampusCEUB/AgroScan/issues/26) | US23 - Associar outras pessoas à horta | E5 | 5 | Importante |
| [#27](https://github.com/CampusCEUB/AgroScan/issues/27) | US24 - Cadastrar canteiros com a cultura plantada | E5 | 3 | Importante |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro | E5 | 3 | Importante |
| [#29](https://github.com/CampusCEUB/AgroScan/issues/29) | US26 - Registrar o manejo que apliquei | E5 | 5 | Desejável |

**6 histórias, 27 pontos** - a maior carga de pontos entre as sprints
restantes.

### Requisitos cobertos

RF23 a RF27, conforme a
[matriz de rastreabilidade](../entregas/artefato-2-gestao-do-projeto.md#33-rastreabilidade-entre-sprints-e-requisitos).

## Responsáveis

| Item | Responsável |
| --- | --- |
| Curadoria das cucurbitáceas e solanáceas (US04) | Ambas as integrantes, com revisão cruzada |
| Rotas e modelo de dados de horta, membros e canteiros (US22-US24) | Ambas as integrantes |
| Vínculo consulta-canteiro e registro de manejo (US25, US26) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

O detalhamento técnico está no [CHANGELOG](../CHANGELOG.md#sprint-3---horta-canteiros-e-manejo--2909-a-12102026);
aqui fica o resumo e o aceite.

### Hortas, membros, canteiros e manejo (US22-US26)

- **API**: hortas, membros por e-mail com transferência da responsabilidade, canteiros encerráveis e de cultura fixa, consulta vinculada ao canteiro e registro de manejo. Quem não participa da horta recebe 404 ([ADR 0012](../docs/decisoes/adr-0012-acesso-por-horta.md)).
- **Telas**: aba Hortas; horta com canteiros e pessoas; canteiro com registro de manejo; seletor de canteiro ao salvar o diagnóstico, que funciona sem rede; atalho do laudo para o manejo com a doença já marcada.
- **Exclusão de conta**: hortas só da pessoa vão junto; as compartilhadas pedem a transferência; quem tem manejo registrado é anonimizado.
- **Lacuna**: o filtro do histórico por canteiro existe na API (`GET /consultas?canteiro_id=`), mas o caderno ainda não o oferece na tela. A US25 fica aberta por isso.

### Publicação: API no ar e catálogo no banco

- **API publicada pela primeira vez** - cadastro e login davam 404 no site ([ADR 0010](../docs/decisoes/adr-0010-publicacao-em-dois-projetos.md)).
- **Dois repositórios, por decisão** - a Vercel publica do espelho `gabicaldana/AgroScan2` ([ADR 0011](../docs/decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md)).
- **Catálogo `2026.09.27` carregado no Neon** depois das migrações 002 e 003; a validação da base passou a conferir as regras do banco, no CI.

### Caderno e iPhone (US19, US40)

Filtro do caderno por período e cultura, histórico legível sem rede e
instruções de instalação no iPhone. A US19 já estava fechada desde a Sprint 1;
a US40 é da Sprint 6 e foi adiantada.

### Código em `src/`

Todo o código passou para `src/`, a pedido da professora, e os Documentos de
Software v1 e v2 saíram - os artefatos em `entregas/` os substituem.

### Não entregue: US04 (cucurbitáceas)

A curadoria das cucurbitáceas não começou: a capacidade do ciclo foi para a
publicação, que estava quebrada, e para o épico E5. A base segue com 9
culturas. O critério de batata e pimentão já fora atendido na Sprint 2. A
história vai para a Sprint 4.

## Issues concluídas

| Issue | Título | Como foi verificada |
| --- | --- | --- |
| [#25](https://github.com/CampusCEUB/AgroScan/issues/25) | US22 - Cadastrar minha horta | Nome e município obrigatórios; criador vira responsável na mesma transação; testes em `tests/test_hortas.py` |
| [#26](https://github.com/CampusCEUB/AgroScan/issues/26) | US23 - Associar outras pessoas à horta | Membro por e-mail, papel, transferência; membro enxerga os canteiros |
| [#27](https://github.com/CampusCEUB/AgroScan/issues/27) | US24 - Cadastrar canteiros com a cultura plantada | `UNIQUE (horta_id, identificacao)`, cultura do catálogo, `data_plantio` |
| [#29](https://github.com/CampusCEUB/AgroScan/issues/29) | US26 - Registrar o manejo que apliquei | Tipo, descrição, produto, dose e data; acessível pelo laudo (`ManejoNoLaudo`) |
| [#41](https://github.com/CampusCEUB/AgroScan/issues/41) | US40 - Saber como instalar o aplicativo no iPhone | Antecipada da Sprint 6 e entregue no PR #84: instruções do caminho Compartilhar → Adicionar à Tela de Início, que não reaparecem depois da instalação |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicar o ambiente e conferir a versão do catálogo exibida | Herdada da Sprint 2; `/api/v1/saude` publicado com catálogo `2026.09.27` |

### Não concluídas - realocadas à Sprint 4

| Issue | Título | O que falta |
| --- | --- | --- |
| [#7](https://github.com/CampusCEUB/AgroScan/issues/7) | US04 - Cadastrar as doenças das cucurbitáceas e fechar as solanáceas | Pepino, abobrinha, abóbora e jiló |
| [#28](https://github.com/CampusCEUB/AgroScan/issues/28) | US25 - Vincular a consulta ao canteiro | Filtro por canteiro na tela do caderno |

**4 histórias planejadas aceitas, 16 de 27 pontos.** Somando a US40, que não
estava no planejamento, a sprint aceitou 19 pontos, como registra a totalização
do [Artefato 2](../entregas/artefato-2-gestao-do-projeto.md#pontos-concluídos-até-o-encerramento-da-sprint-3).

## Pull requests aceitos

| PR | Conteúdo | Issue |
| --- | --- | --- |
| [#84](https://github.com/CampusCEUB/AgroScan/pull/84) | Publica a API, define o espelho de publicação e entrega US19/US40 | [#67](https://github.com/CampusCEUB/AgroScan/issues/67), [#68](https://github.com/CampusCEUB/AgroScan/issues/68), [#41](https://github.com/CampusCEUB/AgroScan/issues/41), [#22](https://github.com/CampusCEUB/AgroScan/issues/22) |
| [#85](https://github.com/CampusCEUB/AgroScan/pull/85) | Hortas, membros, canteiros e manejo, e o catálogo de volta ao banco | [#25](https://github.com/CampusCEUB/AgroScan/issues/25)-[#29](https://github.com/CampusCEUB/AgroScan/issues/29) |
| [#86](https://github.com/CampusCEUB/AgroScan/pull/86) | Todo o código em `src/`; saem os Documentos de Software | - |

## Evidências

### Testes automatizados - PR #85, 09/10/2026

```text
$ python -m unittest discover -s tests -t .
Ran 117 tests
OK

$ cd web && npm test
ℹ tests 214
ℹ fail 0
```

**Total: 331 testes, nenhuma falha.** Subiu de 267 com os 36 testes de
contrato HTTP de hortas e os testes do caderno filtrável. `tsc`, `eslint` e
`next build` sem erro.

### Integração contínua

[Execução #37978274215](https://github.com/CampusCEUB/AgroScan/actions/runs/37978274215)
no `main`, após o merge do PR #86: **`success`**.

### Ambiente publicado - conferido em 15/10/2026

```text
$ curl https://agroscan-blond.vercel.app/api/v1/saude
{"versao_api":"1.0.0","ambiente":"producao","versao_catalogo":"2026.09.27",
 "banco":"ok","migracao_aplicada":3,"catalogo_no_banco":true}
```

Roteiro ponta a ponta com três contas de teste (responsável, membro e alguém
de fora) - criação, convite, recusas por papel, canteiro, manejo,
transferência e exclusão - **36 verificações sem falha** (PR #85).

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | Impede fixar a priorização das famílias botânicas na curadoria | Herdado - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das sprints seguintes é provisório | Herdado - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | **API nunca publicada** - cadastro e login davam 404 no site | Caderno e sincronização inutilizáveis no ambiente publicado | ✅ Resolvido em 08/10 - [ADR 0010](../docs/decisoes/adr-0010-publicacao-em-dois-projetos.md), [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |
| 4 | **Framework Preset do projeto `agroscan-api`** detectado como FastAPI | Os pushes falhavam na publicação da API | ✅ Resolvido em 08/10 - preset trocado para *Other* no painel |
| 5 | **Banco preso no catálogo 2026.09.03** - a carga das brássicas abortava na hérnia das crucíferas (`tipo_agente` "protista", ausente do banco) | Toda consulta enviada desde 27/09 dava 500; a fila guardava tudo no aparelho, mas nada subia | ✅ Resolvido em 09/10 - migrações 002 e 003, validação contra as regras do banco e carga aplicada no Neon; `/saude` com `catalogo_no_banco: true` |

## Riscos ativos no ciclo

| Risco | Por que pesa nesta sprint | Mitigação |
| --- | --- | --- |
| **R01 - volume da curadoria agronômica** | A US04 soma cucurbitáceas e o fechamento das solanáceas no mesmo ciclo, junto com 19 pontos de desenvolvimento | Curadoria por família; ordem de corte da seção 3.4 do Artefato 2, que sacrifica US26 antes das demais |
| **R05 - esgotamento de conexões do banco** | O épico E5 acrescenta tabelas e consultas novas ao PostgreSQL | Conexão agrupada em tempo de execução, já adotada |
| **R06 - ambiente publicado defasado** | PWA e API em dia desde 08/10; a Vercel publica do espelho `gabicaldana/AgroScan2`, porque a organização não autoriza a integração | Fluxo do [ADR 0011](../docs/decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md): commit no espelho, conferência no publicado, PR aqui, fast-forward do espelho após o merge |

## Retrospectiva

### O que funcionou

- **O épico E5 saiu inteiro na API, com regra de acesso decidida antes do código** (ADR 0012) e 36 testes de contrato.
- **O roteiro ponta a ponta no ambiente publicado** pegou o que os testes não pegam: o catálogo fora do banco e o 500 nas consultas.
- **A fila offline cumpriu o papel**: durante os 12 dias de 500, nenhuma consulta se perdeu.

### O que não funcionou

- **Uma falha de produção ficou 12 dias sem ser vista.** Nada avisava que o catálogo não estava no banco.
- **A curadoria das cucurbitáceas não começou.** A capacidade foi consumida pela publicação, herdada da Sprint 2.
- **Um `"framework": null` no `vercel.json` derrubou o PWA por cerca de dez minutos**, porque o arquivo vale para os dois projetos.
- **A US25 foi entregue sem o filtro na tela**, e o PR não sinalizou a lacuna.

### Ajustes para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| `/saude` com `catalogo_no_banco` conferido no fim de cada sprint, junto do C11 | Catálogo fora do banco |
| Mudança de `vercel.json` conferida nos dois projetos antes do merge | Queda do PWA |
| Cada critério de aceite marcado na `issue` antes de pedir o fechamento | US25 parcial |
| Curadoria com capacidade reservada no planejamento, e não com a que sobrar | US04 não iniciada |

## Próximas ações

### Preparação da Sprint 4 (13/10 - 26/10)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Conferir que os canteiros têm histórico suficiente para as agregações dos relatórios | Dependência E5 → E6 |
| 2 | Definir as consultas SQL dos quatro relatórios agregados | Épico E6 |

> **Dependência.** Os relatórios da Sprint 4 leem os dados criados por esta
> sprint. Atraso em US24 ou US25 desloca o início do épico E6.

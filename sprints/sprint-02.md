# Sprint 2 - Base de conhecimento e publicação

## Período

**15/09/2026 a 28/09/2026** (14 dias)

Primeira sprint na cadência padrão de duas semanas, iniciada no dia seguinte à
entrega dos Artefatos 1, 2 e 3.

## Objetivo

Ampliar a base de conhecimento e recolocar o ambiente publicado em dia com o
código. A sprint fecha as pendências técnicas herdadas da Sprint 1 - a
dependência de teste ausente, o ambiente defasado e a falta de rastreabilidade
entre backlog e execução - e avança a curadoria agronômica pelas brássicas,
a família de maior alcance por levantamento.

É a primeira sprint com backlog no GitHub e com integração por `pull request`,
conforme os ajustes definidos na retrospectiva da Sprint 1.

## Milestone

[**Sprint 2 - Base de conhecimento e publicação**](https://github.com/CampusCEUB/AgroScan/milestone/2) -
prazo em 28/09/2026, com 14 `issues`.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 15/09/2026 | [#52](https://github.com/CampusCEUB/AgroScan/issues/52) | [`sprint-02-planejamento.md`](../docs/reunioes/sprint-02-planejamento.md) |
| Revisão | 28/09/2026 | [#53](https://github.com/CampusCEUB/AgroScan/issues/53) | [`sprint-02-revisao.md`](../docs/reunioes/sprint-02-revisao.md) |

## Itens planejados

### Histórias de usuário

| Issue | História | Épico | Pts | Prioridade |
| --- | --- | --- | --- | --- |
| [#4](https://github.com/CampusCEUB/AgroScan/issues/4) | US01 - Encontrar a hortaliça que cultivo em uma lista organizada | E1 | 3 | Obrigatório |
| [#6](https://github.com/CampusCEUB/AgroScan/issues/6) | US03 - Cadastrar as doenças das brássicas | E1 | 8 | Obrigatório |
| [#40](https://github.com/CampusCEUB/AgroScan/issues/40) | US36 - Receber atualizações do catálogo sem reinstalar | E7 | 5 | Importante |

**3 histórias, 16 pontos.**

### Tarefas de sprint

| Issue | Tarefa | Natureza | Origem |
| --- | --- | --- | --- |
| [#66](https://github.com/CampusCEUB/AgroScan/issues/66) | Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | Correção | R07 |
| [#67](https://github.com/CampusCEUB/AgroScan/issues/67) | Republicar o ambiente e conferir a versão do catálogo exibida | Correção | R06 |
| [#68](https://github.com/CampusCEUB/AgroScan/issues/68) | Conferir no ambiente publicado a nova hierarquia de entrada | Correção | ADR 0008 |
| [#69](https://github.com/CampusCEUB/AgroScan/issues/69) | Atualizar o README do repositório de código para o estado real | Documentação | Retrospectiva da Sprint 1 |
| [#70](https://github.com/CampusCEUB/AgroScan/issues/70) | Elevar batata e pimentão ao mínimo de três doenças | Curadoria | RN05 |
| [#71](https://github.com/CampusCEUB/AgroScan/issues/71) | Criar milestones, issues e GitHub Project do backlog | Documentação | Pendência do Artefato 2 |
| [#72](https://github.com/CampusCEUB/AgroScan/issues/72) | Atribuir nominalmente os papéis Scrum | Documentação | Pendência do Artefato 2 |
| [#73](https://github.com/CampusCEUB/AgroScan/issues/73) | Definir a comunidade parceira da Atividade de Extensão | Pesquisa | R03 - bloqueado |
| [#74](https://github.com/CampusCEUB/AgroScan/issues/74) | Confirmar as datas dos Artefatos 5 a 9 e a existência do Artefato 4 | Documentação | Pendência - bloqueado |

## Responsáveis

| Item | Responsável |
| --- | --- |
| Curadoria das brássicas (US03) e das solanáceas pendentes (#70) | Ambas as integrantes, com revisão cruzada |
| Sincronização de catálogo (US36) e lista de culturas (US01) | Ambas as integrantes |
| Correções de infraestrutura (#66-#68) | Ambas as integrantes |
| Backlog no GitHub (#71) e documentação (#69) | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente na `issue` [#72](https://github.com/CampusCEUB/AgroScan/issues/72).

## Entregas

### Repositório unificado

O código deixou de viver em `gabicaldana/AgroScan2` e passou a ocupar a raiz do
repositório institucional, ao lado da documentação que o descreve. O que a
disciplina avalia é o repositório institucional, e ele não continha o produto -
apenas descrições dele, com cada afirmação técnica apontando para um endereço
externo. Justificativa completa no
[Artefato 2, §4.1](../entregas/artefato-2-gestao-do-projeto.md#41-repositório-único).

### Curadoria das brássicas (US03) - 6 culturas, 18 fichas

A meta-título da sprint. Seis culturas novas, todas da família Brassicaceae,
cada uma com três doenças curadas:

| Cultura | Nome científico | Grupo | Doenças |
| --- | --- | --- | --- |
| Couve | *Brassica oleracea* var. *acephala* | folha | Míldio, alternariose, podridão-negra |
| Repolho | *Brassica oleracea* var. *capitata* | folha | Podridão-negra, alternariose, hérnia |
| Brócolis | *Brassica oleracea* var. *italica* | flor | Míldio, alternariose, podridão-negra |
| Couve-flor | *Brassica oleracea* var. *botrytis* | flor | Míldio, podridão-negra, hérnia |
| Rúcula | *Eruca vesicaria* | folha | Míldio, alternariose, oídio |
| Agrião | *Nasturtium officinale* | folha | Míldio, cercosporiose, podridão-mole |

A curadoria por família se pagou como previsto no
[Artefato 2, §3.5](../entregas/artefato-2-gestao-do-projeto.md#35-riscos),
mitigação do R01: um levantamento sobre patógenos de crucíferas cobriu as seis
culturas, porque *Hyaloperonospora brassicae*, *Alternaria brassicae* e
*Xanthomonas campestris* pv. *campestris* atacam todas. O que muda por cultura
é o órgão afetado e o efeito econômico, e é isso que cada ficha descreve.

**Quatro sintomas novos** no catálogo, que a curadoria das solanáceas não havia
exigido:

| Sintoma | Órgão | Doença que o torna necessário |
| --- | --- | --- |
| Lesão amarela em forma de V, começando na borda da folha | folha | Podridão-negra |
| Nervuras escurecidas, quase pretas | folha | Podridão-negra |
| Raízes engrossadas e deformadas, com galhas | **raiz** | Hérnia das crucíferas |
| Apodrecimento mole e malcheiroso | planta | Podridão-mole |

O órgão `raiz` estava no catálogo mas **sem nenhum sintoma** desde o início - a
própria base registrava isso como pendência. A hérnia das crucíferas o estreia,
e é um caso em que o sinal só aparece ao arrancar a planta: a parte aérea
apenas murcha e amarelece, o que levaria a um diagnóstico errado se o produtor
não tivesse como marcar o que viu na raiz.

Os grupos `folha` e `flor` também estreiam: até aqui a base só tinha `fruto` e
`raiz`. A tela de seleção de cultura passa a exercitar de verdade o
agrupamento que a **US01** pede.

> **A validar pela equipe.** A validação automática aprova a estrutura, não a
> agronomia. Agente, perfil de sintomas, condições favoráveis e ingredientes
> ativos precisam de conferência contra as fontes e de revisão cruzada, como
> exige o Definition of Done para fichas da base. A **hérnia das crucíferas**
> merece atenção: é a única ficha com `ingredientes_ativos` vazio, porque não
> há produto que controle *Plasmodiophora brassicae* no solo em campo - o
> manejo é calagem e rotação longa.
>
> A apresentação dessa ficha sem defensivo **foi verificada**: o `Laudo.tsx` já
> trata lista vazia e exibe "não há produto que resolva esta doença depois de
> instalada - o manejo é todo preventivo, pelas medidas culturais acima", que é
> exatamente o caso. Nenhum ajuste de interface foi necessário.

### Curadoria: batata e pimentão em conformidade com a RN05

Três fichas de doença acrescentadas, elevando as duas culturas que estavam
abaixo do mínimo:

| Cultura | Antes | Depois | Fichas acrescentadas |
| --- | --- | --- | --- |
| Batata | 2 doenças | **3** | Canela-preta (*Pectobacterium atrosepticum*) |
| Pimentão | 1 doença | **3** | Antracnose (*Colletotrichum* spp.) e oídio (*Leveillula taurica*) |

A base passou da versão `2026.09.03` para `2026.09.27`, com **16 fichas** no
lugar de 13. A validação automática deixou de emitir avisos: nenhuma cultura
está abaixo de três doenças, e a pergunta de desempate volta a funcionar nas
três culturas.

### Relatórios das sprints 2 a 8

Criados os sete relatórios que faltavam em `sprints/`, completando a série, e
concluída a mudança dos artefatos para `entregas/`, que estava pela metade.

## Issues concluídas

| Issue | Título | Como foi verificada |
| --- | --- | --- |
| [#71](https://github.com/CampusCEUB/AgroScan/issues/71) | Criar milestones, issues e GitHub Project do backlog | 8 milestones, 81 issues e 16 reuniões |
| [#66](https://github.com/CampusCEUB/AgroScan/issues/66) | Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | Suíte executada em 27/09: 74 testes, **nenhum pulado**. O `ci.yml` tem o passo que transforma "pulou" em falha antes de a suíte rodar |
| [#69](https://github.com/CampusCEUB/AgroScan/issues/69) | Atualizar o README do repositório de código para o estado real | Feito no commit `9570990`; o documento é hoje [`docs/aplicacao.md`](../docs/aplicacao.md), atualizado para 16 doenças e 185 testes |
| [#70](https://github.com/CampusCEUB/AgroScan/issues/70) | Elevar batata e pimentão ao mínimo de três doenças | Validação automática sem avisos - ver Evidências |
| [#6](https://github.com/CampusCEUB/AgroScan/issues/6) | **US03** - Cadastrar as doenças das brássicas | 6 culturas com 3 doenças cada; validação aprovada; 245 testes passando |

> **Sobre #66 e #69.** A correção em código foi aplicada em 12/09, ainda dentro
> da Sprint 1, nos commits `8053fc8` e `9570990`. As `issues` nasceram das
> "Próximas ações" da retrospectiva e permaneceram abertas porque o que faltava
> era a **verificação**, não o código. É o que esta sprint fecha.

### Abertas nesta data

[#4](https://github.com/CampusCEUB/AgroScan/issues/4) (US01 - avançou de 3 para 9 das 24 culturas, mas o critério pede as 24),
[#40](https://github.com/CampusCEUB/AgroScan/issues/40) (US36),
[#67](https://github.com/CampusCEUB/AgroScan/issues/67),
[#68](https://github.com/CampusCEUB/AgroScan/issues/68),
[#72](https://github.com/CampusCEUB/AgroScan/issues/72),
[#73](https://github.com/CampusCEUB/AgroScan/issues/73) e
[#74](https://github.com/CampusCEUB/AgroScan/issues/74).

## Pull requests aceitos

| PR | Conteúdo | Issue |
| --- | --- | --- |
| [#82](https://github.com/CampusCEUB/AgroScan/pull/82) | Estrutura o backlog no GitHub: 8 milestones, 81 issues e 16 reuniões | [#71](https://github.com/CampusCEUB/AgroScan/issues/71) |

Primeiro `pull request` do projeto, conforme o ajuste de processo definido na
retrospectiva da Sprint 1.

> ⚠️ **A completar no encerramento.**

## Evidências

### Validação da base - execução em 27/09/2026

Antes, com as duas culturas abaixo do mínimo:

```
$ python -m app.validacao
Base valida - versao 2026.09.03
  3 hortalicas, 13 doencas, 26 sintomas no catalogo

  2 aviso(s) de curadoria incompleta:
    - cultura batata: 2 doenca(s). Abaixo de 3 o motor nunca tem segunda
      hipotese, e a pergunta de desempate nao funciona nesta cultura
    - cultura pimentao: 1 doenca(s). [...]
```

Depois das três fichas:

```
$ python -m app.validacao
Base valida - versao 2026.09.27
  9 hortalicas, 34 doencas, 30 sintomas no catalogo
    flor   brocolis, couve_flor
    folha  agriao, couve, repolho, rucula
    fruto  pimentao, tomate
    raiz   batata
```

**Nenhum aviso**, com as brássicas já incluídas. É o critério da RN05
atendido, e os quatro grupos do catálogo passam a ter cultura.

### Testes automatizados - execução em 27/09/2026

```
$ python -m unittest discover -s tests -t .
Ran 74 tests in 8.689s
OK
```

```
$ cd web && npm test
ℹ tests 171
ℹ pass 171
ℹ fail 0
ℹ skipped 0
```

**Total: 245 testes, nenhuma falha e nenhum pulado.** Subiu de 176 para 185 com
as três fichas das solanáceas, e de 185 para 245 com as brássicas: as fixtures
de paridade foram de 42 para 84 casos, porque são geradas a partir da base.

O campo `skipped 0` e os 74 testes em Python são a evidência direta da `issue`
[#66](https://github.com/CampusCEUB/AgroScan/issues/66): os 22 testes da API
executam, e não se pulam.

### Verificação da migração do código

Rodado no repositório institucional, após a migração:

| Verificação | Resultado |
| --- | --- |
| `python -m app.validacao` | Base válida, sem avisos |
| `python -m unittest discover -s tests -t .` | 74 testes, OK |
| `cd web && npm test` | 111 testes, 0 falhas |
| `npm run lint` | Sem apontamentos |
| `npm run build` | 7 rotas geradas |
| Regerar tudo e conferir `git status` | Nenhum artefato gerado divergiu - o passo mais rígido do CI |

### Integração contínua - primeira execução no repositório institucional

[Execução #36340336427](https://github.com/CampusCEUB/AgroScan/actions/runs/36340336427),
disparada pelo [PR #83](https://github.com/CampusCEUB/AgroScan/pull/83) em
27/09/2026. **Conclusão: `success`**, com os nove passos verdes.

O passo que existe justamente para impedir que a suíte se pule em silêncio:

```
Conferir que os testes da API vao rodar, e nao se pular
  TestClient operante: os 22 testes da API vao rodar.

Testes do motor e da API
  Ran 74 tests in 11.161s
  OK

Testes do porte em TypeScript
  tests 111

Nenhum artefato gerado ficou para tras
  ✓
```

Esta é a evidência que a `issue`
[#66](https://github.com/CampusCEUB/AgroScan/issues/66) pedia: não a suíte
passando na máquina de alguém, mas **o CI executando os 22 testes da API**. Até
aqui o pipeline rodava no repositório de código; é a primeira vez que roda no
repositório avaliado.

### Ainda a produzir

| Evidência | Depende de |
| --- | --- |
| Ambiente publicado servindo a versão `2026.09.27` | Reapontar a Vercel - [#67](https://github.com/CampusCEUB/AgroScan/issues/67) |
| Hierarquia de entrada conferida no publicado | O mesmo - [#68](https://github.com/CampusCEUB/AgroScan/issues/68) |

> **Manutenção anotada na primeira execução.** O CI emitiu dois avisos, sem
> falhar: as actions `checkout@v4`, `setup-node@v4` e `setup-python@v5` ainda
> declaram Node.js 20, já depreciado e forçado para o 24; e o rótulo
> `ubuntu-latest` migra para o Ubuntu 26 a partir de 19/10/2026. Nenhum dos dois
> quebra hoje, mas convém atualizar antes que quebrem.

Verificações obrigatórias neste ciclo, por decorrerem dos riscos herdados:

| Verificação | Risco | Situação |
| --- | --- | --- |
| A integração contínua **executa** - e não pula - os testes da API | R07 | ✅ Verificado: 74 testes, `skipped 0` |
| O endereço publicado serve a versão corrente do catálogo | R06 | ⬜ Bloqueado pela Vercel |
| A tela inicial é o diagnóstico por sintomas | ADR 0008 | 🟡 Em código desde `c679d48`; falta conferir no publicado |

Verificações obrigatórias neste ciclo, por decorrerem dos riscos herdados:

| Verificação | Risco | Critério |
| --- | --- | --- |
| A integração contínua **executa** - e não pula - os testes da API | R07 | Nenhum teste pulado no relatório do CI |
| O endereço publicado serve a versão corrente do catálogo | R06 | Versão exibida na interface igual à da base no ramo principal |
| A tela inicial é o diagnóstico por sintomas | ADR 0008 | `/sintomas` redireciona para `/` no ambiente publicado |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | Impede fixar a priorização das famílias botânicas e a data da apresentação | Herdado da Sprint 1 - [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | **Datas dos Artefatos 5 a 9 não divulgadas** | O calendário das Sprints 5 a 8 é provisório | Herdado da Sprint 1 - [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |
| 3 | **Papéis Scrum não atribuídos nominalmente** | Impede a atribuição nominal de responsáveis nos registros | Herdado da Sprint 1 - [#72](https://github.com/CampusCEUB/AgroScan/issues/72) |
| 4 | **Dependência de teste ausente** (R07) | 22 testes de integração da API não executavam de forma confiável | ✅ **Resolvido** - `requirements-dev.txt` declara a dependência e o CI falha se a suíte se pular. Verificado em 27/09: `skipped 0` |
| 5 | **Vercel ligada ao repositório antigo** | O código passou a viver em `CampusCEUB/AgroScan`, mas o deploy continua saindo de `gabicaldana/AgroScan2`. Enquanto não for reapontada, o ambiente publicado não reflete o que se desenvolve | **Novo, criado pela migração.** Depende do painel da Vercel, fora do alcance do repositório. Agrava o R06 e mantém [#67](https://github.com/CampusCEUB/AgroScan/issues/67) e [#68](https://github.com/CampusCEUB/AgroScan/issues/68) bloqueadas |

## Retrospectiva

> ⚠️ **A preencher na reunião de revisão de 28/09/2026.** Registrar o que
> funcionou, o que não funcionou e os ajustes para o ciclo seguinte, incluindo a
> avaliação do fluxo de `pull request` adotado nesta sprint.

## Próximas ações

### Preparação da Sprint 3 (29/09 - 12/10)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Modelar as rotas de horta, membros e canteiros na API | Épico E5 |
| 2 | Iniciar a curadoria das cucurbitáceas (US04) | Épico E1 |
| 3 | Conferir se as brássicas passaram na validação automática antes de abrir o ciclo | Definition of Done da curadoria |

### Pendências que dependem de terceiros

| # | Pendência | Interlocutor | Issue |
| --- | --- | --- | --- |
| 1 | Definição da comunidade parceira da Atividade de Extensão | Coordenação da disciplina | [#73](https://github.com/CampusCEUB/AgroScan/issues/73) |
| 2 | Datas dos Artefatos 5 a 9 e existência do Artefato 4 | Professora | [#74](https://github.com/CampusCEUB/AgroScan/issues/74) |

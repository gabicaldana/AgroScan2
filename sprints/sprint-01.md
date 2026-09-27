# Sprint 1 - Especificação e gestão

## Período

**31/08/2026 a 14/09/2026** (15 dias)

A sprint tem três dias a mais que a cadência padrão de duas semanas, para
encerrar exatamente na data de entrega dos Artefatos 1, 2 e 3.

## Objetivo

Especificar o projeto reformulado e formalizar a gestão: entregar os Artefatos
1, 2 e 3, estruturar o repositório institucional, documentar o incremento já
construído e registrar as decisões arquiteturais já tomadas.

A sprint é de especificação porque o projeto entra nela **com incremento
funcional pronto** - diagnóstico offline, API, banco e caderno de campo - e sem
documentação formal correspondente. O trabalho é fechar essa lacuna e corrigir
as inconsistências herdadas da versão anterior do escopo.

## Milestone

[**Sprint 1 - Especificação e gestão**](https://github.com/CampusCEUB/AgroScan/milestone/1) -
encerrada em 14/09/2026, com 24 `issues`, todas fechadas.

## Reuniões

| Evento | Data | Issue | Ata |
| --- | --- | --- | --- |
| Planejamento | 31/08/2026 | [#50](https://github.com/CampusCEUB/AgroScan/issues/50) | [`sprint-01-planejamento.md`](../docs/reunioes/sprint-01-planejamento.md) |
| Revisão | 14/09/2026 | [#51](https://github.com/CampusCEUB/AgroScan/issues/51) | [`sprint-01-revisao.md`](../docs/reunioes/sprint-01-revisao.md) |

## Itens planejados

| ID | Item | Tipo |
| --- | --- | --- |
| - | Artefato 1 - Gestão do Negócio/Domínio: análise de usuário | Documentação |
| - | Artefato 2 - Gestão do Projeto: EAP, backlog, planejamento das sprints, repositório institucional | Documentação |
| - | Artefato 3 - Gestão do Produto: arquitetura da informação, design arquitetural, testes de integração, protótipo de baixo nível, storyboard | Documentação |
| - | Estruturação do repositório institucional: requisitos, arquitetura, ADRs, registros de sprint e entrega | Documentação |
| US02 | Validação automática da base de conhecimento | Desenvolvimento |
| US06-US11 | Diagnóstico por sintomas offline, ponta a ponta | Desenvolvimento |
| US12-US14 | Cadastro, autenticação e uso sem conta | Desenvolvimento |
| US16-US19 | Caderno de campo com fila de sincronização offline | Desenvolvimento |
| US31-US35 | PWA instalável, API publicada, banco modelado, paridade entre motores, integração contínua | Desenvolvimento |

## Responsáveis

| Item | Responsável |
| --- | --- |
| Artefatos 1, 2 e 3 | Ambas as integrantes, com revisão cruzada |
| Estruturação do repositório institucional | Ambas as integrantes |
| Desenvolvimento (US02, US06-US19, US31-US35) | Ambas as integrantes |
| Curadoria agronômica - solanáceas | Ambas as integrantes |

> ⚠️ A atribuição nominal por item depende da definição dos papéis Scrum,
> pendente conforme `sprint-00-planejamento.md`.

## Entregas

### Documentação

| Entrega | Arquivo |
| --- | --- |
| Artefato 1 - análise de usuário, com correção do público-alvo | [`entregas/artefato-1-analise-de-usuario.md`](../entregas/artefato-1-analise-de-usuario.md) |
| Artefato 2 - EAP, backlog, sprints e repositório | [`entregas/artefato-2-gestao-do-projeto.md`](../entregas/artefato-2-gestao-do-projeto.md) |
| Artefato 3 - arquitetura da informação, design arquitetural, testes, protótipo e storyboard | [`entregas/artefato-3-gestao-do-produto.md`](../entregas/artefato-3-gestao-do-produto.md) |
| Requisitos consolidados com matriz de rastreabilidade | [`docs/requisitos.md`](../docs/requisitos.md) |
| Arquitetura da solução | [`docs/arquitetura.md`](../docs/arquitetura.md) |
| Nove ADRs das decisões arquiteturais | [`docs/decisoes/`](../docs/decisoes/) |
| Planejamento inicial | [`sprints/sprint-00-planejamento.md`](sprint-00-planejamento.md) |

### Incremento funcional consolidado

| Capacidade | Verificação |
| --- | --- |
| Diagnóstico por sintomas offline, com pergunta de desempate e declaração de desconhecimento | 28 testes do motor + 102 testes do porte |
| API REST publicada: saúde, catálogo, culturas, sintomas, doenças, diagnóstico | 8 testes HTTP |
| Banco PostgreSQL modelado: 19 tabelas, DDL numerado e reversível, carga idempotente | `migracoes/`, `app/seed.py` |
| Autenticação com scrypt e JWT; exclusão de conta pela API | 11 testes de segurança |
| Caderno de campo com fila de sincronização e idempotência por `offline_id` | 14 testes de caderno |
| PWA instalável com service worker escrito à mão | Instalação verificada em Android |
| Integração contínua que bloqueia artefatos gerados desatualizados | `.github/workflows/ci.yml` |

### Correções aplicadas ao código

| Correção | Origem | Verificação |
| --- | --- | --- |
| **Hierarquia de entrada**: a tela inicial passou a ser o diagnóstico por sintomas e a captura por foto saiu da navegação. `/sintomas` virou redirecionamento permanente para `/`; service worker de `v4` para `v5` | ADR 0008 | `npm run lint` sem apontamentos; build com 7 rotas; 176 testes passando; os 29 testes do caminho de imagem preservados |
| **Dependência de teste ausente**: criado `requirements-dev.txt` e acrescentado ao CI um passo que falha se os testes da API forem pulados | Risco R07 | Sem a dependência a suíte passou de *errar* para pular limpo (74 testes, 22 pulados); com ela, 74 testes executam |
| **README do repositório de código** atualizado: afirmava que a API não fora construída, e informava 88/41 testes | Retrospectiva | Estado e contagem conferidos por execução |

## Issues concluídas

As 24 `issues` da milestone, todas fechadas.

### Entregas avaliativas

| Issue | Título | Artefato |
| --- | --- | --- |
| [#1](https://github.com/CampusCEUB/AgroScan/issues/1) | [Artefato 01] Análise de Usuário | 1 |
| [#2](https://github.com/CampusCEUB/AgroScan/issues/2) | DOC02 - Artefato 2: Gestão do Projeto | 2 |
| [#3](https://github.com/CampusCEUB/AgroScan/issues/3) | DOC03 - Artefato 3: Gestão do Produto | 3 |

Os oito critérios de conclusão da issue #1 estão mapeados, um a um, no
[registro de entrega do Artefato 1](../entregas/entrega-artefato-1.md#critérios-de-conclusão-da-issue).

### Histórias de usuário

| Issue | História | Épico | Pts |
| --- | --- | --- | --- |
| [#5](https://github.com/CampusCEUB/AgroScan/issues/5) | US02 - Recusar fichas incompletas na base de conhecimento | E1 | 5 |
| [#9](https://github.com/CampusCEUB/AgroScan/issues/9) | US06 - Marcar os sintomas que vejo na planta | E2 | 3 |
| [#10](https://github.com/CampusCEUB/AgroScan/issues/10) | US07 - Ver as doenças mais compatíveis com o que observei | E2 | 5 |
| [#11](https://github.com/CampusCEUB/AgroScan/issues/11) | US08 - Ser avisado quando o sistema não souber responder | E2 | 2 |
| [#12](https://github.com/CampusCEUB/AgroScan/issues/12) | US09 - Saber qual outro sintoma procurar quando houver dúvida | E2 | 5 |
| [#13](https://github.com/CampusCEUB/AgroScan/issues/13) | US10 - Ler o laudo completo da doença | E2 | 5 |
| [#14](https://github.com/CampusCEUB/AgroScan/issues/14) | US11 - Usar o aplicativo sem internet | E2 | 5 |
| [#15](https://github.com/CampusCEUB/AgroScan/issues/15) | US12 - Criar uma conta | E3 | 5 |
| [#16](https://github.com/CampusCEUB/AgroScan/issues/16) | US13 - Entrar na minha conta e permanecer conectado | E3 | 3 |
| [#17](https://github.com/CampusCEUB/AgroScan/issues/17) | US14 - Usar o diagnóstico sem criar conta | E3 | 2 |
| [#19](https://github.com/CampusCEUB/AgroScan/issues/19) | US16 - Ter minhas consultas salvas | E4 | 5 |
| [#20](https://github.com/CampusCEUB/AgroScan/issues/20) | US17 - Registrar consultas mesmo sem sinal | E4 | 8 |
| [#21](https://github.com/CampusCEUB/AgroScan/issues/21) | US18 - Não ver consulta duplicada após reenvio | E4 | 3 |
| [#22](https://github.com/CampusCEUB/AgroScan/issues/22) | US19 - Ver meu histórico filtrado | E4 | 5 |
| [#35](https://github.com/CampusCEUB/AgroScan/issues/35) | US31 - Instalar o AgroScan como aplicativo no celular | E7 | 3 |
| [#36](https://github.com/CampusCEUB/AgroScan/issues/36) | US32 - API publicada e acessível | E7 | 8 |
| [#37](https://github.com/CampusCEUB/AgroScan/issues/37) | US33 - Banco PostgreSQL modelado e populado | E7 | 8 |
| [#38](https://github.com/CampusCEUB/AgroScan/issues/38) | US34 - Servidor e navegador produzindo o mesmo diagnóstico | E7 | 5 |
| [#39](https://github.com/CampusCEUB/AgroScan/issues/39) | US35 - Integração contínua bloqueando artefatos desatualizados | E7 | 3 |

**19 histórias, 88 pontos** - os 88 de 172 pontos do núcleo registrados na
totalização do [Artefato 2, §2.6](../entregas/artefato-2-gestao-do-projeto.md#26-totalização).

> **Nota sobre a data de criação destas `issues`.** As três `issues` de entrega
> avaliativa foram abertas durante a sprint. As 19 histórias e as 2 reuniões
> foram registradas **em retrospecto**, junto com a estruturação do backlog no
> GitHub, para recuperar a rastreabilidade entre backlog e execução - a falha
> apontada na retrospectiva abaixo. O trabalho que elas descrevem foi executado
> e verificado dentro do período da sprint; o que não existia era o registro.

## Pull requests aceitos

> ⚠️ **A preencher.** O desenvolvimento desta sprint foi integrado por commits
> diretos no ramo principal do repositório de código, antes da adoção do fluxo
> de `pull request` descrito no `CONTRIBUTING.md`. A partir da Sprint 2, toda
> integração passa por `pull request` com revisão.

Commits que consolidaram o incremento, no repositório de código:

| Commit | Conteúdo |
| --- | --- |
| `2971e78` | Domínio do projeto: hortaliças - reformulação de escopo |
| `b402ad3` | Back-end: motor puro, API FastAPI e carga do catálogo no PostgreSQL |
| `fee78d5` | Configuração por `.env` e conferência de conexão |
| `6a6b14f` | Seed em modo `--gerar-sql`, e falha rápida quando a rede bloqueia o Postgres |
| `0e3d3c3` | Conta, caderno de campo e sincronização offline |
| `068b6d9` | Front consumindo a API: conta, caderno de campo e fila offline |

## Evidências

### Testes automatizados - execução verificada em 12/09/2026, commit `068b6d9`

```
$ python -m unittest discover -s tests -t .
..........................................................................
Ran 74 tests in 7.296s
OK
```

```
$ cd web && npm test
ℹ tests 102
ℹ suites 14
ℹ pass 102
ℹ fail 0
ℹ duration_ms 322.6491
```

**Total: 176 testes automatizados, nenhuma falha.** Distribuição e mapeamento
para requisitos no [Artefato 3, §3](../entregas/artefato-3-gestao-do-produto.md#3-testes-de-integração).

### Validação da base de conhecimento

```
$ python -m app.validacao
Base valida - versao 2026.09.03
  3 hortalicas, 13 doencas, 26 sintomas no catalogo
    fruto  pimentao, tomate
    raiz   batata

  2 aviso(s) de curadoria incompleta:
    - cultura batata: 2 doenca(s). Abaixo de 3 o motor nunca tem segunda
      hipotese, e a pergunta de desempate nao funciona nesta cultura
    - cultura pimentao: 1 doenca(s). [...]
```

### Outras evidências

| Evidência | Onde |
| --- | --- |
| Ambiente publicado | https://agroscan-blond.vercel.app |
| Modelo de dados com 19 tabelas e consultas dos relatórios | `docs/modelo-de-dados.md` no repositório de código |
| Pipeline de integração contínua | `.github/workflows/ci.yml` |
| Histórico versionado | https://github.com/gabicaldana/AgroScan2/commits/main |

> ⚠️ **Ressalva sobre o ambiente publicado.** O endereço acima serve uma versão
> **anterior** à reformulação de escopo: o seletor de culturas ainda lista
> culturas de commodity, ausentes da base atual. Registrado como risco R06 e
> como item da Sprint 2.

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | **Comunidade parceira da Atividade de Extensão não definida** (R03) | Impede fixar a priorização das famílias botânicas na curadoria e a data da apresentação | Aberto - depende da coordenação da disciplina |
| 2 | **Datas do Artefato 5 e da apresentação à comunidade não divulgadas** | O calendário das Sprints 6 e 7 é provisório | Aberto - depende da professora |
| 3 | **Reformulação do formato das entregas pela disciplina** | Os artefatos produzidos anteriormente tiveram de ser refeitos no novo formato, consumindo a capacidade da sprint | Resolvido nesta sprint |
| 4 | **Dependência de teste ausente** (R07) | 22 testes de integração da API não executam de forma confiável; a integração contínua pode estar falhando | Aberto - correção na Sprint 2 |
| 5 | **Papéis Scrum não atribuídos nominalmente** | Os papéis estão descritos, mas sem indicação de quem responde por cada um | Aberto - depende da equipe |

## Retrospectiva

### O que funcionou

- **A decisão de tratar a base de conhecimento como fonte única derivada por geração** (ADR 0003) se pagou nesta sprint: documentar o sistema foi possível porque o conteúdo agronômico, os testes e o banco derivam todos do mesmo arquivo, sem divergência a reconciliar.
- **A paridade entre implementações do motor** (ADR 0004) deu à documentação de testes uma base concreta: 176 testes com resultado verificável, em vez de afirmações sobre qualidade.
- **A reformulação para hortaliças com curadoria por família botânica** tornou a meta de 24 culturas defensável. Por cultura, seriam 24 levantamentos; por família, são sete.

### O que não funcionou

- **A documentação envelheceu em relação ao código.** O README do repositório de código afirma que a API não foi construída, quando ela está implementada, publicada e testada. Descrever o estado do projeto em prosa, em vários lugares, garante divergência - o mesmo erro que a arquitetura evita para o conteúdo agronômico, cometido na documentação.
- **Os artefatos anteriores tinham contradição interna.** O Artefato 1 definia o engenheiro agrônomo como usuário principal, enquanto a delimitação de escopo afirmava que o sistema não o substitui, e as decisões de interface só fazem sentido para um usuário sem formação técnica. A contradição sobreviveu porque nenhuma revisão comparou os artefatos entre si.
- **O desenvolvimento aconteceu sem `issues` nem `pull requests`.** O trabalho foi integrado por commits diretos, o que deixou a sprint sem rastreabilidade entre backlog e execução - exatamente o que o repositório institucional existe para registrar.
- **O ambiente publicado ficou defasado sem ninguém notar.** O endereço que a documentação apresenta como o produto serve uma versão de escopo anterior.
- **A soma dos pontos do backlog estava errada** na versão anterior do planejamento: 155 em vez de 167. Erro de conferência que não teve consequência prática, mas invalidava a métrica de progresso. O núcleo hoje é de 172 pontos, após o acréscimo da US41.

### Ajustes para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| Toda integração passa por `pull request` com revisão, vinculado a uma `issue` | Falta de rastreabilidade nesta sprint |
| "O ambiente publicado reflete a versão entregue" entra no Definition of Done | Risco R06 |
| O estado do projeto passa a ser afirmado **em um único lugar** - o README do repositório de código - e referenciado pelos demais | Documentação envelhecida |
| Revisão cruzada de artefato inclui conferência de coerência **entre** artefatos, e não apenas dentro de cada um | Contradição do público-alvo |
| Criar as `milestones` e `issues` antes de iniciar o desenvolvimento da sprint | Falta de rastreabilidade |

## Próximas ações

### Preparação da Sprint 2 (15/09 - 28/09)

| # | Ação | Origem |
| --- | --- | --- |
| 1 | Criar o GitHub Project, as `milestones` das sprints 2 a 7 e as `issues` das histórias | Pendência do Artefato 2 |
| 2 | Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | R07 |
| 3 | Republicar o ambiente e conferir a versão do catálogo exibida | R06 |
| 4 | Atualizar o README do repositório de código para o estado real | Retrospectiva |
| 5 | Elevar batata e pimentão ao mínimo de três doenças | Conformidade com RN05 |
| 6 | Curadoria das brássicas - 6 culturas (US03) | Épico E1 |
| 7 | Implementar a sincronização de catálogo no cliente (US36) | Épico E7 |
| 8 | Conferir no ambiente publicado a nova hierarquia de entrada, já integrada ao código | ADR 0008 |

### Pendências que dependem de terceiros

| # | Pendência | Interlocutor |
| --- | --- | --- |
| 1 | Definição da comunidade parceira da Atividade de Extensão | Coordenação da disciplina |
| 2 | Data do Artefato 5 e da apresentação à comunidade | Professora |
| 3 | Confirmação de que o Artefato 4 não integra o conjunto de entregas | Professora |

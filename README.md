# AgroScan

Repositório institucional de Projeto Integrador criado a partir do template do CEUB.

> **Professor(a):** Leia as AS DIRETRIZES INSTITUCIONAIS constantes no repositório [DIRETRIZES](https://github.com/CAMPUSCEUB/DIRETRIZES), em especial o [Guia dos Professores](https://github.com/CAMPUSCEUB/DIRETRIZES/guias/github-enterprise-campus-ceub.md) e o [checklist do GitHub Enterprise](https://github.com/CAMPUSCEUB/DIRETRIZES/guias/github-enterprise-campus-ceub.md).
>
> **Estudante:** Leia o [guia dos alunos](docs/guia-alunos.md).


## Identificação do repositório 

| Campo | Informação |
| --- | --- |
| Instituição | CEUB |
| Organização no GitHub | CampusCEUB |
| Professor(a) responsável pela criação: | Adriana Falcomer Pontes |
| Equipe | Gabriela Pedersoli Caldana (22404253) e Thaís Regina Dias da Mota (22403754) |
| IDProjeto | 20260286 |

## Problema

Produtores de hortaliças - sobretudo pequenos agricultores, horticultores urbanos e gestores de hortas comunitárias - enfrentam limitações no acesso à assistência técnica especializada. Essa escassez resulta na identificação tardia ou incorreta de doenças fitossanitárias devido à semelhança visual de sintomas. Como consequência, o manejo é frequentemente inadequado, gerando prejuízos na produção e levando ao uso indiscriminado de defensivos agrícolas por incerteza, o que acarreta custos desnecessários, contaminação ambiental e riscos à saúde humana. As ferramentas digitais existentes também falham em atender esse público por exigirem conexão contínua ou não refletirem a realidade agrícola local.

## Solução proposta

O AgroScan é uma aplicação PWA (Progressive Web App) projetada para funcionar offline e orientar a tomada de decisão no canteiro.  
. A Solução: O sistema permite a identificação de doenças por meio da seleção de sintomas em hortaliças. Ele calcula hipóteses com base em graus de compatibilidade, faz perguntas de desempate quando há dúvidas e orienta o manejo focado no Manejo Integrado de Pragas (medidas culturais, biológicas e químicas, nesta ordem). Além disso, oferece caderno de campo com histórico de consultas e relatórios de incidência.  
. Público atendido: Pequenos e médios produtores de hortaliças, agricultores familiares, gestores de hortas comunitárias/escolares (usuários primários/terciários) e técnicos agrícolas/extensionistas (usuários secundários).  
. Valor esperado: Redução de perdas de safra, minimização do uso de defensivos químicos, autonomia técnica para quem não tem acesso frequente a agrônomos e registro histórico de manejo, mesmo em áreas sem conectividade.

## Entregas avaliativas

| Artefato | Conteúdo | Entrega | Documento |
| --- | --- | --- | --- |
| **1** | Gestão do Negócio/Domínio - análise de usuário | 14/09/2026 | [entregas/artefato-1-analise-de-usuario.md](entregas/artefato-1-analise-de-usuario.md) |
| **2** | Gestão do Projeto - EAP, backlog do produto, planejamento das sprints, projeto no repositório institucional | 14/09/2026 | [entregas/artefato-2-gestao-do-projeto.md](entregas/artefato-2-gestao-do-projeto.md) |
| **3** | Gestão do Produto - arquitetura da informação, design arquitetural, testes de integração, protótipo de baixo nível, storyboard | 14/09/2026 | [entregas/artefato-3-gestao-do-produto.md](entregas/artefato-3-gestao-do-produto.md) |
| **5** | Gestão dos Ativos - website com dados e documentação | sem data própria | o próprio projeto: [aplicação publicada](https://agroscan-blond.vercel.app), [API](https://agroscan-api.vercel.app/api/v1/docs) e [docs/](docs/) |
| **6** | Gestão do Negócio/Domínio - análise do usuário *(2º bim.)* | sem data própria | depende da validação com a comunidade parceira ([#73](https://github.com/CampusCEUB/AgroScan/issues/73)) |
| **7** | Gestão do Projeto - execução e revisão das sprints; vitrine de ativos *(2º bim.)* | sem data própria | o próprio projeto: [sprints/](sprints/), [atas](docs/reunioes/) e [milestones](https://github.com/CampusCEUB/AgroScan/milestones?state=all) |
| **8** | Gestão do Produto - arquitetura de software; testes de sistema *(2º bim.)* | sem data própria | o próprio projeto: [arquitetura](docs/arquitetura.md), [ADRs](docs/decisoes/) e [testes](src/tests/) |
| **9** | Gestão dos Ativos - dashboards incorporados *(2º bim.)* | sem data própria | o próprio projeto: painéis da horta (US41) |

Só os Artefatos 1, 2 e 3 são documentos com data própria. O conteúdo dos
Artefatos 5 a 9 é o próprio projeto, construído ao longo das sprints, e o
Artefato 4 não existe.

Os registros de cada entrega, com critérios atendidos, validação, limitações e
pendências, estão em [entregas/](entregas/README.md).

## Estrutura deste repositório

| Item | Link |
| --- | --- |
| Backlog | [GitHub Project](https://github.com/orgs/CAMPUSCEUB/projects/223) |
| Milestones | [8 sprints](https://github.com/CampusCEUB/AgroScan/milestones?state=all) |
| Issues | [81 issues](https://github.com/CampusCEUB/AgroScan/issues?q=is%3Aissue) |
| Sprints | [sprints/README.md](sprints/README.md) |
| Entregas | [entregas/README.md](entregas/README.md) |
| Requisitos | [docs/requisitos.md](docs/requisitos.md) |
| Arquitetura | [docs/arquitetura.md](docs/arquitetura.md) |
| Decisões arquiteturais (ADRs) | [docs/decisoes/README.md](docs/decisoes/README.md) |
| Reuniões | [docs/reunioes/README.md](docs/reunioes/README.md) |
| Histórico de mudanças | [CHANGELOG.md](CHANGELOG.md) |

O backlog está no GitHub Project, com cada item classificado por **Tipo**,
**Épico**, **Prioridade** (MoSCoW, no campo `Priority`), **Pontos** (no campo
`Estimate`) e **Milestone** da sprint. As 81 issues cobrem as 41 histórias de
usuário, as 8 entregas avaliativas, as 16 reuniões e 16 tarefas de sprint.

## A aplicação

O código, a base de conhecimento curada, a API, o banco de dados e os testes
automatizados vivem **neste mesmo repositório**, na pasta [`src/`](src/), ao
lado da documentação que os descreve.

| Pasta | Conteúdo |
| --- | --- |
| [src/app/](src/app/) | Motor de diagnóstico, validação da base, geradores e API em FastAPI |
| [src/web/](src/web/) | PWA em Next.js, com o porte TypeScript do motor |
| [src/tests/](src/tests/) | 117 testes Python, da API e do motor |
| [src/migracoes/](src/migracoes/) | DDL numerado e reversível |
| [src/data/](src/data/) | Base de conhecimento curada - a fonte única |

Como a aplicação funciona e como rodá-la localmente:
[docs/aplicacao.md](docs/aplicacao.md).

> Até a Sprint 2 o código ficava em um repositório separado,
> `gabicaldana/AgroScan2`, cujo histórico segue publicado. A unificação está
> justificada no
> [Artefato 2, §4.1](entregas/artefato-2-gestao-do-projeto.md#41-repositório-único).

### Estado do desenvolvimento

Estado verificado em 18/10/2026, no início da Sprint 4, depois do encerramento
das Sprints 1 a 3.

| Épico | Estado |
| --- | --- |
| Diagnóstico por sintomas offline | ✅ concluído |
| Plataforma - API REST, PostgreSQL, PWA, integração contínua | ✅ concluído, com atualização do catálogo sem reinstalar e instruções de instalação no iPhone |
| Identidade e conta | 🟡 API concluída; tela de exclusão pendente |
| Caderno de campo | 🟡 histórico, filtros e sincronização concluídos; confirmação e anotações pendentes |
| Base de conhecimento | ✅ 24 culturas · 88 fichas de doença · base `2026.11.09` |
| Horta, canteiros e manejo | 🟡 hortas, membros, canteiros e manejo concluídos; falta o filtro por canteiro na tela do caderno |
| Relatórios agregados | ⬜ em desenvolvimento na Sprint 4 |
| Identificação por imagem | 🟡 escopo condicionado - captura, pré-processamento e recusa prontos; sem modelo |

| Indicador | Valor |
| --- | --- |
| Pontos concluídos do núcleo | 120 de 172 (70%) |
| Testes automatizados | 331, nenhuma falha - 117 em Python e 214 em TypeScript |
| Tabelas no banco de dados | 19 |
| Endpoints da API | 30 |

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
| **1** | Gestão do Negócio/Domínio - análise de usuário | 14/09/2026 | [docs/artefato-1-analise-de-usuario.md](docs/artefato-1-analise-de-usuario.md) |
| **2** | Gestão do Projeto - EAP, backlog do produto, planejamento das sprints, projeto no repositório institucional | 14/09/2026 | [docs/artefato-2-gestao-do-projeto.md](docs/artefato-2-gestao-do-projeto.md) |
| **3** | Gestão do Produto - arquitetura da informação, design arquitetural, testes de integração, protótipo de baixo nível, storyboard | 14/09/2026 | [docs/artefato-3-gestao-do-produto.md](docs/artefato-3-gestao-do-produto.md) |
| **5** | Gestão dos Ativos - website com dados e documentação | a definir | a produzir |
| **6** | Gestão do Negócio/Domínio - análise do usuário *(2º bim.)* | a definir | a produzir |
| **7** | Gestão do Projeto - execução e revisão das sprints; vitrine de ativos *(2º bim.)* | a definir | a produzir |
| **8** | Gestão do Produto - arquitetura de software; testes de sistema *(2º bim.)* | a definir | a produzir |
| **9** | Gestão dos Ativos - dashboards incorporados *(2º bim.)* | a definir | a produzir |

Os registros de cada entrega, com critérios atendidos, validação, limitações e
pendências, estão em [entregas/](entregas/README.md).

## Estrutura deste repositório

| Item | Link |
| --- | --- |
| Backlog | ⚠️ Vincular o GitHub Project |
| Sprints | [sprints/README.md](sprints/README.md) |
| Entregas | [entregas/README.md](entregas/README.md) |
| Requisitos | [docs/requisitos.md](docs/requisitos.md) |
| Arquitetura | [docs/arquitetura.md](docs/arquitetura.md) |
| Decisões arquiteturais (ADRs) | [docs/decisoes/README.md](docs/decisoes/README.md) |
| Reuniões | [docs/reunioes/README.md](docs/reunioes/README.md) |
| Histórico de mudanças | [CHANGELOG.md](CHANGELOG.md) |

## Repositório de código

O código da aplicação, a base de conhecimento curada, a API, o banco de dados e
os testes automatizados ficam em um repositório próprio:

**https://github.com/gabicaldana/AgroScan2**

A separação mantém a documentação avaliativa legível neste repositório, sem
dispersá-la no histórico de desenvolvimento. Todo documento daqui que trata de
uma decisão técnica aponta para o arquivo correspondente lá.

### Estado do desenvolvimento

Estado verificado em 12/09/2026, ao encerramento da Sprint 1.

| Épico | Estado |
| --- | --- |
| Diagnóstico por sintomas offline | ✅ concluído |
| Plataforma - API REST, PostgreSQL, PWA, integração contínua | ✅ concluído |
| Identidade e conta | 🟡 API concluída; tela de exclusão pendente |
| Caderno de campo | 🟡 histórico e sincronização concluídos; confirmação e anotações pendentes |
| Base de conhecimento | 🔄 3 de 24 culturas · 13 de 88 fichas de doença |
| Horta, canteiros e manejo | ⬜ tabelas modeladas; rotas e telas pendentes |
| Relatórios agregados | ⬜ consultas SQL especificadas |
| Identificação por imagem | 🟡 escopo condicionado - captura, pré-processamento e recusa prontos; sem modelo |

| Indicador | Valor |
| --- | --- |
| Pontos concluídos do núcleo | 88 de 172 (51%) |
| Testes automatizados | 176, nenhuma falha |
| Tabelas no banco de dados | 19 |
| Endpoints da API | 16 |

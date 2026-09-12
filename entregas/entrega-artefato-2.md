# Entrega - Artefato 2: Gestão do Projeto

## Identificação

| Campo | Informação |
| --- | --- |
| Título | Artefato 2 - Gestão do Projeto: EAP, backlog do produto, planejamento das sprints e projeto no repositório institucional |
| Data de entrega | 14/09/2026 |
| Disciplina | Projeto Integrador II |
| Turma | B |
| Instituição | CEUB - Centro Universitário de Brasília |
| Professora responsável | Adriana Falcomer Pontes |
| IDProjeto | 20260286 |
| Equipe | Gabriela Pedersoli Caldana (22404253) · Thaís Regina Dias da Mota (22403754) |
| Natureza | **Reapresentação** - substitui a versão anterior |

## Sprint relacionada

[Sprint 1 - Especificação e gestão](../sprints/sprint-01.md) · 31/08 a 14/09/2026.

## Escopo

Quatro componentes exigidos pela disciplina:

1. **EAP** - decomposição do projeto em sete pacotes de entrega e seus pacotes de trabalho, com o estado atual de cada um.
2. **Backlog do produto** - oito épicos, 36 requisitos funcionais priorizados por MoSCoW, 28 requisitos não funcionais, 11 regras de negócio e 40 histórias de usuário com critérios de aceite e estimativa em pontos.
3. **Planejamento das sprints** - sete sprints de duas semanas, com objetivo, entregas, marcos acadêmicos, rastreabilidade para requisitos, ordem de corte e registro de riscos.
4. **Projeto no repositório institucional** - organização dos dois repositórios, estrutura de pastas, fluxo de trabalho, mapa de `milestones` e `issues`, Definition of Done e papéis.

**O que mudou em relação à versão anterior**

| Item | Antes | Agora |
| --- | --- | --- |
| Numeração das sprints | 1 a 7, e depois 4 a 10 em versão intermediária | **1 a 7**, realinhada ao novo calendário de entregas |
| Datas | Entregas escalonadas ao longo do semestre | Artefatos 1, 2 e 3 concentrados em **14/09/2026** |
| Histórias de usuário | Tabelas **vazias** na versão entregue | 40 histórias com critérios de aceite, estimativa e estado |
| Total de pontos | 152, e 155 em versão intermediária | **172** - as somas anteriores estavam incorretas, e o Artefato 9 acrescentou a US41 |
| EAP | Quatro ramos, com "Diagnóstico por Imagem" no mesmo nível dos demais | Sete pacotes, refletindo back-end, banco, caderno e relatórios; imagem marcada como escopo condicionado |
| Riscos | Seis riscos | Oito riscos - acrescentados R06 (implantação defasada) e R07 (dependência de teste ausente) |
| Estado de execução | Ausente | Cada pacote da EAP, épico e história com estado verificável |

## Links principais

| Item | Link |
| --- | --- |
| Documento do artefato | [`docs/artefato-2-gestao-do-projeto.md`](../docs/artefato-2-gestao-do-projeto.md) |
| Requisitos canônicos e rastreabilidade | [`docs/requisitos.md`](../docs/requisitos.md) |
| Planejamento inicial e acordos de trabalho | [`sprints/sprint-00-planejamento.md`](../sprints/sprint-00-planejamento.md) |
| Relatório da Sprint 1 | [`sprints/sprint-01.md`](../sprints/sprint-01.md) |
| ADRs | [`docs/decisoes/`](../docs/decisoes/) |
| Repositório institucional | https://github.com/CampusCEUB/AgroScan |
| Repositório de código | https://github.com/gabicaldana/AgroScan2 |
| Histórico versionado | https://github.com/gabicaldana/AgroScan2/commits/main |
| Backlog no GitHub Project | ⚠️ a criar |
| Milestone | ⚠️ a vincular |

## Critérios atendidos

| Critério | Como foi demonstrado |
| --- | --- |
| **EAP** | Seção 1 - diagrama e versão em lista, com sete pacotes de entrega, 27 pacotes de trabalho e estado de cada um |
| **Backlog do produto** | Seção 2 - épicos, requisitos funcionais com prioridade MoSCoW, requisitos não funcionais por categoria, regras de negócio e histórias de usuário com critérios de aceite |
| **Estimativa** | Escala de Fibonacci, com subtotal por épico e totalização: 172 pontos no núcleo, 23 condicionados |
| **Priorização** | MoSCoW nos requisitos funcionais; ordem de corte definida antecipadamente na seção 3.4; núcleo inegociável explicitado |
| **Planejamento das sprints** | Seção 3 - sete sprints com período, objetivo, entregas, marco acadêmico e histórias alocadas |
| **Rastreabilidade** | Seção 3.3 liga sprint → épico → requisitos; a matriz completa requisito → história → sprint → verificação está em `docs/requisitos.md` §9 |
| **Gestão de riscos** | Seção 3.5 - oito riscos com probabilidade, impacto e mitigação |
| **Projeto no repositório institucional** | Seção 4 - estrutura, fluxo de `issues` e `pull requests`, mapa de `milestones`, Definition of Done |
| **Aplicação de Scrum** | Cadência, eventos e acordos de trabalho em `sprints/sprint-00-planejamento.md`; Definition of Done na seção 4.5 |
| **Versionamento** | Repositório Git com histórico rastreável; integração contínua em `.github/workflows/ci.yml` |

## Validação

**Método.** Conferência aritmética das estimativas, verificação do estado
declarado de cada item contra o código, e revisão de coerência entre o backlog,
os requisitos canônicos e o calendário.

**Responsáveis.** Gabriela Pedersoli Caldana e Thaís Regina Dias da Mota.

**Verificações realizadas**

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | Soma dos pontos por épico e total geral | ✅ 32+25+13+27+19+21+35 = **172**; as somas anteriores (152 e 155) estavam erradas |
| 2 | Cada história tem critério de aceite observável | ✅ 40 de 40 |
| 3 | Cada requisito funcional está coberto por ao menos uma história | ✅ conferido na matriz de rastreabilidade |
| 4 | O estado declarado de cada história corresponde ao código | ✅ conferido rota por rota e componente por componente |
| 5 | Testes automatizados executam e passam | ✅ **176 testes** - 74 em Python, 102 em TypeScript, nenhuma falha |
| 6 | A base de conhecimento passa na validação automática | ✅ com 2 avisos de curadoria incompleta (batata e pimentão abaixo do mínimo da RN05) |
| 7 | As datas do calendário são compatíveis com a cadência de duas semanas | ✅ Sprint 1 com 15 dias, declarada como exceção justificada |
| 8 | Os marcos não fixados pela disciplina estão sinalizados como proposta | ✅ apenas 14/09 é data fixada; Artefato 5 e apresentação à comunidade marcados como pendentes |

**Resultado.** O backlog é internamente consistente e o estado declarado
corresponde ao sistema implementado. **88 dos 172 pontos do núcleo (51%) estão
concluídos** ao encerramento da Sprint 1.

## Limitações

- **As `milestones` e `issues` ainda não existem** no repositório institucional. A rastreabilidade é feita pelos identificadores de história e pelos commits, e não pelo Project do GitHub.
- **O desenvolvimento da Sprint 1 não passou por `pull request`.** Foi integrado por commits diretos no ramo principal, antes da adoção do fluxo descrito no `CONTRIBUTING.md`. A partir da Sprint 2 toda integração passa por `pull request` com revisão.
- **O calendário das Sprints 6 e 7 é provisório**, porque a data do Artefato 5 e a da apresentação à comunidade não foram divulgadas.
- **A estimativa em pontos não tem velocidade histórica** para calibração: é a primeira medição formal do projeto.
- **A distribuição nominal dos papéis Scrum está pendente.**
- Não há registro de `Artefato 4` no conjunto de entregas informado pela disciplina. A ausência foi preservada como recebida, e a confirmação consta das pendências.

## Pendências conhecidas

| Pendência | Responsável | Prazo |
| --- | --- | --- |
| Criar GitHub Project, `milestones` das Sprints 2 a 7 e `issues` das histórias | Equipe | Início da Sprint 2 |
| Vincular o link do Project no `README.md` do repositório institucional | Equipe | Início da Sprint 2 |
| Atribuição nominal dos papéis Product Owner e Scrum Master | Equipe | Início da Sprint 2 |
| Definição da comunidade parceira (R03) | Coordenação | - |
| Data do Artefato 5 e da apresentação à comunidade | Professora | - |
| Confirmação de que o Artefato 4 não integra o conjunto de entregas | Professora | - |

## Próximos passos

1. Criar o Project, as `milestones` e as `issues`, fechando a lacuna de rastreabilidade apontada na retrospectiva.
2. Adotar o fluxo de `pull request` com revisão a partir da Sprint 2.
3. Medir a velocidade real da Sprint 2 e recalibrar as estimativas seguintes.
4. Corrigir os itens de dívida identificados: dependência de teste ausente (R07) e ambiente publicado defasado (R06).
5. Reajustar o calendário das Sprints 6 e 7 quando os marcos restantes forem divulgados.

# Entrega - Artefato 1: Gestão do Negócio/Domínio

## Identificação

| Campo | Informação |
| --- | --- |
| Título | Artefato 1 - Gestão do Negócio/Domínio: análise de usuário |
| Data de entrega | 14/09/2026 |
| Disciplina | Projeto Integrador II |
| Turma | B |
| Instituição | CEUB - Centro Universitário de Brasília |
| Professora responsável | Adriana Falcomer Pontes |
| IDProjeto | 20260286 |
| Equipe | Gabriela Pedersoli Caldana (22404253) · Thaís Regina Dias da Mota (22403754) |
| Projeto | AgroScan - PWA para diagnóstico de doenças em hortaliças |
| Natureza | **Reapresentação** - substitui a versão anterior |

## Sprint relacionada

[Sprint 1 - Especificação e gestão](../sprints/sprint-01.md) · 31/08 a 14/09/2026.

## Escopo

Análise do usuário-alvo do AgroScan: contexto do domínio, perfil dos três níveis
de usuário, contexto de uso, necessidades, dores, objetivos, delimitação de quem
está fora do público-alvo, e a rastreabilidade entre cada característica do
usuário e a decisão de projeto que ela determina.

**Limite adotado:** a entrega cobre a compreensão do usuário e do domínio. Não
abrange a implementação técnica das funcionalidades, tratada no Artefato 3.

**O que mudou em relação à versão anterior.** A análise anterior definia como
público-alvo principal **engenheiros agrônomos e técnicos agrícolas**. Esta
versão corrige a definição: o usuário primário é o **pequeno produtor de
hortaliças**, e o profissional de assistência técnica passa a usuário
secundário, com necessidade distinta. O motivo da correção está na seção 7 do
artefato e se resume a três incoerências da versão anterior:

1. a mesma documentação afirmava que o sistema não substitui o agrônomo e que o agrônomo era seu usuário principal;
2. a justificativa social do projeto - levar informação técnica a quem não tem acesso a ela - pressupõe um usuário que não é o detentor dessa informação;
3. as decisões de projeto já implementadas (entrada por sintoma observado em vez de nome de doença, manejo ordenado pelo princípio do manejo integrado) só fazem sentido para um usuário sem formação técnica formal.

## Links principais

| Item | Link |
| --- | --- |
| Documento do artefato | [`docs/artefato-1-analise-de-usuario.md`](../docs/artefato-1-analise-de-usuario.md) |
| Requisitos consolidados | [`docs/requisitos.md`](../docs/requisitos.md) |
| Relatório da sprint | [`sprints/sprint-01.md`](../sprints/sprint-01.md) |
| Repositório de código | https://github.com/gabicaldana/AgroScan2 |
| Ambiente publicado | https://agroscan-blond.vercel.app *(ver ressalva em Limitações)* |
| Milestone | ⚠️ a vincular |
| Issue | [#1 - Artefato 1: Gestão do Negócio/Domínio](https://github.com/CAMPUSCEUB/AgroScan/issues/1), aberta por Thaís Regina Dias da Mota |
| Pull requests | ⚠️ a vincular |

## Critérios de conclusão da issue

A [issue #1](https://github.com/CAMPUSCEUB/AgroScan/issues/1), que originou esta entrega, define oito critérios de
conclusão. O estado de cada um:

| # | Critério de conclusão | Estado | Onde |
| --- | --- | --- | --- |
| 1 | Usuário-alvo identificado e descrito | ✅ | Seções 2, 3 e 4 - três níveis com perfil, necessidade e uso diferenciado |
| 2 | Contexto de uso em campo documentado | ✅ | Seção 2.2 - cinco condições do ambiente, cada uma ligada à decisão de projeto que provocou |
| 3 | Necessidades e dificuldades do usuário levantadas | ✅ | Seções 2.3 e 2.4 - cinco necessidades e cinco dores, com a forma em que se manifestam hoje |
| 4 | Objetivos do usuário definidos | ✅ | Seção 2.5 |
| 5 | Relação entre usuário e solução apresentada | ✅ | Seção 6 - tabela de onze linhas ligando característica do usuário, decisão no sistema e requisito |
| 6 | Documento revisado pela equipe | ⬜ | Pendente de revisão cruzada antes do envio |
| 7 | Artefato final inserido no repositório | ⬜ | Pendente do envio ao repositório institucional |
| 8 | Issue atualizada e encerrada após a conclusão | ⬜ | Pendente |

O escopo declarado na issue - identificação do usuário-alvo, contexto de uso,
necessidades, dores, objetivos e relação com as funcionalidades - está coberto
integralmente. A prioridade registrada é **Alta**.

## Critérios atendidos

| Critério | Como foi demonstrado |
| --- | --- |
| **Identificação do usuário-alvo** | Três níveis caracterizados - produtor (primário), técnico agrícola ou extensionista (secundário), gestor de horta coletiva (terciário) - com perfil, necessidade e uso diferenciado de cada um. Seções 2 a 4 |
| **Contexto de uso** | Ambiente de campo decomposto em cinco condições (sol direto, mãos sujas ou enluvadas, pressa, ausência de sinal, faixa etária ampla), cada uma ligada à decisão de projeto que provocou. Seção 2.2 |
| **Levantamento de necessidades** | Cinco necessidades do usuário primário, e necessidades distintas para os usuários secundário e terciário. Seções 2.3, 3 e 4 |
| **Identificação das dificuldades** | Cinco dores caracterizadas com a forma em que se manifestam hoje. Seção 2.4 |
| **Relação com a solução** | Tabela de rastreabilidade com onze linhas ligando característica do usuário → decisão no sistema → requisito correspondente. Seção 6 |
| **Delimitação do público** | Seção 5 registra explicitamente o que está fora: substituir o agrônomo, emitir receituário, atender grandes lavouras |
| **Fundamentação** | Dados do Censo Agropecuário 2017 (IBGE) e literatura técnica da Embrapa, com referências na seção 10 |

## Validação

**Método.** Revisão cruzada entre as integrantes, seguida de verificação de
coerência contra os demais artefatos e contra o estado implementado do sistema.

**Responsáveis.** Gabriela Pedersoli Caldana e Thaís Regina Dias da Mota.

**Verificações realizadas**

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | O público-alvo definido é coerente com a delimitação de escopo do próprio documento | ✅ corrigido nesta versão |
| 2 | O público-alvo é coerente com o Artefato 2 e com `docs/requisitos.md` | ✅ |
| 3 | Cada decisão de interface citada existe de fato no sistema implementado | ✅ verificado no código: toque de 56px, corpo de 18px, tema claro fixo, gravidade com barra e rótulo textual |
| 4 | Cada requisito citado na tabela de rastreabilidade existe no catálogo de requisitos | ✅ |
| 5 | As afirmações sobre funcionamento offline correspondem ao comportamento real | ✅ o diagnóstico é calculado no cliente; 176 testes automatizados, nenhuma falha |

**Resultado.** A análise apresenta correspondência entre o usuário definido e as
características do sistema, especialmente quanto ao uso em campo, funcionamento
offline, diagnóstico por sintomas e acesso a informação técnica. O aplicativo já
permite selecionar a cultura, informar sintomas, ver hipóteses ordenadas e
consultar a ficha da doença sem conexão.

## Limitações

- **Não houve pesquisa primária com produtores.** A análise é construída sobre literatura técnica do domínio e sobre a documentação do projeto. É hipótese fundamentada, não análise verificada em campo.
- **Não foram definidos dados demográficos específicos** - idade, gênero, renda, localização - por não haver base empírica que os sustente.
- A validação com a comunidade parceira da Atividade de Extensão está prevista, e é ela que converterá a análise em verificada.
- **O ambiente publicado está defasado** em relação ao código: serve uma versão anterior à reformulação de escopo, com culturas de commodity no seletor. Risco R06; republicação prevista para a Sprint 2.

## Pendências conhecidas

| Pendência | Responsável |
| --- | --- |
| Atribuição nominal dos papéis Product Owner e Scrum Master | Equipe |
| Identificação da comunidade parceira da Atividade de Extensão (R03) | Coordenação da disciplina |
| Vinculação de `milestone`, `issues` e `pull requests` | Equipe |
| Pesquisa primária com produtores | Equipe, na apresentação à comunidade |

## Próximos passos

1. Validar as decisões de interface com usuários do contexto agrícola, na apresentação à comunidade parceira.
2. Usar a priorização de culturas indicada pela comunidade para ordenar a curadoria por família botânica.
3. Incorporar o resultado da validação à documentação final do sistema.
4. Republicar o ambiente, para que a demonstração reflita o escopo atual.

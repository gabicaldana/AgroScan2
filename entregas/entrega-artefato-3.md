# Entrega - Artefato 3: Gestão do Produto

## Identificação

| Campo | Informação |
| --- | --- |
| Título | Artefato 3 - Gestão do Produto: arquitetura da informação, design arquitetural, testes de integração, protótipo de baixo nível e storyboard |
| Data de entrega | 14/09/2026 |
| Disciplina | Projeto Integrador II |
| Turma | B |
| Instituição | CEUB - Centro Universitário de Brasília |
| Professora responsável | Adriana Falcomer Pontes |
| IDProjeto | 20260286 |
| Equipe | Gabriela Pedersoli Caldana (22404253) · Thaís Regina Dias da Mota (22403754) |
| Natureza | **Complementação** - a versão anterior continha apenas a arquitetura da informação |

## Sprint relacionada

[Sprint 1 - Especificação e gestão](../sprints/sprint-01.md) · 31/08 a 14/09/2026.

## Escopo

Cinco componentes exigidos pela disciplina:

1. **Arquitetura da informação** - mapa de navegação, inventário de telas, princípios de organização do conteúdo e a correção aplicada na hierarquia de entrada.
2. **Design arquitetural** - princípio organizador, visão em camadas, responsabilidades e fronteiras, dois diagramas de sequência, diagrama de implantação e o fluxo de derivação da base curada.
3. **Testes de integração** - estratégia, inventário executado, 32 casos de integração catalogados e mapeados para requisitos, pipeline de integração contínua e lacunas conhecidas.
4. **Protótipo de baixo nível** - wireframes das cinco telas implementadas, com as medidas do sistema de design anotadas e os estados de exceção.
5. **Storyboard** - narrativa de uso em nove quadros, do aparecimento do sintoma até a confirmação do diagnóstico, com o mapeamento de qual requisito cada quadro demonstra.

**O que mudou em relação à versão anterior.** A versão anterior continha apenas
o componente 1, e com três imprecisões, corrigidas aqui:

| Imprecisão anterior | Correção |
| --- | --- |
| "Caderno de campo (Melhoria)" - apresentado como funcionalidade futura | O caderno de campo **está implementado**, com fila de sincronização offline e 14 testes de integração |
| Fluxo apresentado a partir da captura por imagem como caminho principal | O fluxo por sintomas é o caminho principal; a identificação por imagem é escopo condicionado e **não tem modelo** |
| Ausência dos componentes 2 a 5 | Incluídos |

## Links principais

| Item | Link |
| --- | --- |
| Documento do artefato | [`docs/artefato-3-gestao-do-produto.md`](../docs/artefato-3-gestao-do-produto.md) |
| Arquitetura consolidada | [`docs/arquitetura.md`](../docs/arquitetura.md) |
| ADRs | [`docs/decisoes/`](../docs/decisoes/) |
| Modelo de dados (19 tabelas, DER, consultas dos relatórios) | https://github.com/gabicaldana/AgroScan2/blob/main/docs/modelo-de-dados.md |
| DDL versionado e reversível | https://github.com/gabicaldana/AgroScan2/tree/main/migracoes |
| Pipeline de integração contínua | https://github.com/gabicaldana/AgroScan2/blob/main/.github/workflows/ci.yml |
| Ambiente publicado | https://agroscan-blond.vercel.app *(ver ressalva em Limitações)* |
| Milestone | ⚠️ a vincular |

## Critérios atendidos

| Critério | Como foi demonstrado |
| --- | --- |
| **Arquitetura da informação** | Seção 1 - mapa de navegação, inventário de sete telas com estado, cinco princípios de organização, profundidade máxima de três toques até o laudo |
| **Design arquitetural** | Seção 2 - três camadas com responsabilidades e fronteiras explícitas, inclusive o que cada componente **não** faz |
| **Diagramas** | Seis diagramas: navegação, camadas, duas sequências, implantação e derivação da base. Componentes e fronteiras em `docs/arquitetura.md` §2 |
| **Testes de integração** | Seção 3 - 32 casos catalogados (TI01-TI32) em seis grupos, cada um ligado a requisito e a implementação real, com resultado |
| **Evidência de execução** | 176 testes automatizados executados em 12/09/2026 sobre o commit `068b6d9`, com saída transcrita |
| **Protótipo de baixo nível** | Seção 4 - wireframes de cinco telas e três estados de exceção, com as medidas do sistema de design anotadas |
| **Storyboard** | Seção 5 - nove quadros com narrativa, mais tabela ligando cada quadro ao requisito que demonstra |
| **Rastreabilidade** | Cada seção referencia requisitos por identificador; decisões referenciam ADRs |
| **Modelagem de banco relacional** | 19 tabelas, DDL numerado com par de reversão, dicionário de dados e as consultas SQL dos quatro relatórios |

## Validação

**Método.** Execução das suítes automatizadas, conferência do inventário de
telas e rotas contra o código, e verificação de que cada caso de teste
catalogado corresponde a um teste que existe e passa.

**Responsáveis.** Gabriela Pedersoli Caldana e Thaís Regina Dias da Mota.

**Verificações realizadas**

| # | Verificação | Resultado |
| --- | --- | --- |
| 1 | Suíte Python completa | ✅ `Ran 74 tests - OK`, nenhuma falha |
| 2 | Suíte TypeScript | ✅ `tests 102 · suites 14 · pass 102 · fail 0` |
| 3 | Validação da base de conhecimento | ✅ base válida, versão 2026.09.03, com 2 avisos de curadoria incompleta |
| 4 | Cada caso TI01-TI32 corresponde a um teste existente | ✅ conferido nome a nome |
| 5 | Paridade das três implementações do motor sobre as mesmas fixtures | ✅ igualdade exata, sem tolerância |
| 6 | Paridade de pixel do pré-processamento por digest SHA-256 | ✅ sete casos |
| 7 | Inventário de telas e rotas corresponde ao código | ✅ cinco telas implementadas, duas previstas |
| 8 | Endpoints documentados correspondem às rotas registradas | ✅ 16 endpoints conferidos |
| 9 | Isolamento de dados entre usuários | ✅ consulta de outra pessoa não é visível; feedback em consulta de terceiro responde 404 |

**Resultado.** O design arquitetural documentado corresponde ao sistema
implementado, e a cobertura de testes declarada é verificável por execução.

**Defeito encontrado durante a validação.** O cliente HTTP exigido por
`fastapi.testclient` não está declarado em `requirements.txt`, e a proteção dos
módulos de teste captura apenas `ImportError`, enquanto a ausência da dependência
levanta `RuntimeError`. Consequência: **22 testes de integração da API ou falham
a execução, ou se pulam silenciosamente**, conforme a resolução de versões
transitivas. Reproduzido, documentado na seção 3.4.1 do artefato e registrado
como risco R07. Correção prevista para a Sprint 2.

## Limitações

| Limitação | Efeito |
| --- | --- |
| **Testes da API sem banco real** | As restrições do banco - inclusive a unicidade de `offline_id`, que é a garantia de idempotência - não são exercitadas pelos testes automatizados. Correção na Sprint 3 |
| **Sem teste ponta a ponta de navegador** | O fluxo offline é verificado manualmente em dispositivo real. Automação na Sprint 6 |
| **Requisitos de desempenho não medidos** | RNF02 (100 ms no dispositivo) e RNF03 (3 s no p95 da API) não têm evidência automatizada. Medição na Sprint 6 |
| **Acessibilidade verificada por inspeção** | RNF05 a RNF08 sem verificação automatizada. Auditoria na Sprint 6 |
| **Protótipo em baixa fidelidade** | Wireframes textuais, sem protótipo navegável de alta fidelidade |
| **Hortas e relatórios sem cobertura** | Ainda não implementados; testes serão escritos junto das funcionalidades, nas Sprints 3 e 4 |
| **Ambiente publicado defasado** | Serve versão anterior à reformulação de escopo. Risco R06; republicação na Sprint 2 |

## Pendências conhecidas

| Pendência | Sprint prevista |
| --- | --- |
| Correção da dependência de teste ausente (R07) | 2 |
| Republicação do ambiente e conferência de versão (R06) | 2 |
| Testes de integração com PostgreSQL efêmero | 3 |
| Telas e endpoints de horta, canteiros e manejo | 3 |
| Telas e endpoints de relatórios | 4 |
| Tela de confirmação de diagnóstico (US20) | 5 |
| Tela de exclusão de conta (US15) | 6 |
| Testes ponta a ponta do fluxo offline | 6 |
| Medição de desempenho e auditoria de acessibilidade | 6 |
| Protótipo navegável de alta fidelidade | a definir |

## Próximos passos

1. Corrigir os dois itens de dívida técnica identificados nesta validação - R06 e R07 - na abertura da Sprint 2.
2. Republicar o ambiente para que a correção da hierarquia de entrada (ADR 0008), já integrada ao código, chegue ao endereço público.
3. Escrever os testes de integração com banco real, fechando a lacuna que hoje deixa a garantia de idempotência sem verificação automatizada.
4. Estender a cobertura de testes junto de cada funcionalidade nova, em vez de acumulá-la para o fim do semestre.

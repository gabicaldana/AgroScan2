# Histórico de mudanças

Registre aqui as mudanças relevantes por sprint ou marco avaliativo.

## Sprint 2 - Base de conhecimento e publicação · 15/09 a 28/09/2026

### Gestão do projeto no GitHub

Resolvidas as pendências 4 e 5 do Artefato 2, §5, e o item 1 das "Próximas
ações" da Sprint 1. O backlog deixou de existir apenas como tabela Markdown e
passou a ser objeto rastreável no GitHub.

- **8 milestones**, uma por sprint, com data de encerramento e objetivo. A Sprint 1 foi encerrada com as 24 `issues` correspondentes.
- **81 issues**: 41 histórias de usuário (`US01` a `US41`), 8 entregas avaliativas, 16 reuniões e 16 tarefas de sprint. As três `issues` de artefato que a equipe já havia aberto foram reaproveitadas, e não duplicadas.
- **Classificação em três eixos**: tipo (`enhancement`, `documentation`, `research`, `bug`, `reuniao`, `entrega-avaliativa`, `curadoria`, `infraestrutura`), épico (`E1` a `E8`) e prioridade MoSCoW. Etiquetas `escopo-condicionado` e `bloqueado` marcam condições especiais.
- **Backlog no GitHub Project institucional** ([#223](https://github.com/orgs/CAMPUSCEUB/projects/223)), com campos de Épico e Tipo acrescentados aos já existentes. Os 81 itens estão classificados, e o campo `Estimate` soma os 195 pontos do backlog.
- **16 atas de reunião** em `docs/reunioes/`, duas por sprint - planejamento e revisão. As reuniões ainda não realizadas contêm a pauta prevista; os demais campos ficam marcados para preenchimento.

As `issues` das histórias da Sprint 1 foram criadas em retrospecto, para
recuperar a rastreabilidade entre backlog e execução apontada como falha na
retrospectiva daquela sprint. O trabalho que descrevem foi executado e
verificado dentro do período da sprint.

### Correções na documentação

- **Matriz de rastreabilidade** preenchida com a coluna `Issue`, em 34 linhas.
- **Inconsistência identificada e registrada**: RF22 e RNF16 (geolocalização mediante consentimento) apontam para `US22`, que é história do épico E5. O requisito não tem história própria no backlog; a decisão está pendente.
- **Tabela de metas por sprint** tinha duas linhas para a Sprint 5; a duplicata foi removida.
- **Contagens corrigidas** neste changelog: 41 histórias e 8 sprints, no lugar de 40 e 7.
- **Milestone da Sprint 8** acrescentada à tabela do Artefato 2, §4.4, que listava apenas as Sprints 1 a 7 enquanto o calendário da §3.2 já previa oito.

## Sprint 1 - Especificação e gestão · 31/08 a 14/09/2026

### Entregas avaliativas

- **Artefato 1 - Gestão do Negócio/Domínio** (reapresentação): análise de usuário com os três níveis de usuário caracterizados e a rastreabilidade entre característica do usuário e decisão de projeto.
- **Artefato 2 - Gestão do Projeto** (reapresentação): EAP com sete pacotes, backlog com 41 histórias estimadas, planejamento de oito sprints e organização do repositório institucional.
- **Artefato 3 - Gestão do Produto** (complementação): arquitetura da informação, design arquitetural, testes de integração, protótipo de baixo nível e storyboard.

### Documentação adicionada

- `docs/requisitos.md` - requisitos consolidados (36 funcionais, 28 não funcionais, 11 regras de negócio), critérios transversais de aceitação, dependências e matriz de rastreabilidade.
- `docs/arquitetura.md` - contexto técnico, componentes e fronteiras, integrações, dados, decisões e riscos.
- `docs/decisoes/` - nove ADRs registrando as decisões arquiteturais do projeto.
- `sprints/sprint-00-planejamento.md` - contexto da reformulação de escopo, papéis, cadência, riscos, backlog inicial e acordos de trabalho.
- `sprints/sprint-01.md` - relatório da sprint, com evidências de execução e retrospectiva.
- `entregas/entrega-artefato-1.md`, `entrega-artefato-2.md`, `entrega-artefato-3.md` - registros de entrega avaliativa.

### Correções

- **Público-alvo primário corrigido** no Artefato 1: de "engenheiros agrônomos e técnicos agrícolas" para **pequeno produtor de hortaliças**. A definição anterior contradizia a delimitação de escopo do próprio documento, a justificativa social do projeto e as decisões de interface já implementadas.
- **Histórias de usuário preenchidas** no Artefato 2: as tabelas estavam vazias na versão anterior. São 41 histórias com critérios de aceite, estimativa e estado.
- **Total de pontos do backlog corrigido**: de 152 (e 155, em versão intermediária) para **167**. As duas somas anteriores estavam aritmeticamente erradas. Com o acréscimo da US41, vinda do Artefato 9 do 2º bimestre, o núcleo passou a **172**.
- **Numeração das sprints realinhada** para 1 a 8, conforme o novo calendário de entregas.
- **Caderno de campo deixou de ser descrito como funcionalidade futura** na arquitetura da informação: está implementado, com fila de sincronização offline e 14 testes de integração.
- **EAP reestruturada** de quatro para sete pacotes, incorporando back-end, banco de dados, caderno de campo e relatórios, e marcando a identificação por imagem como escopo condicionado.

### Riscos acrescentados

- **R06 - ambiente publicado defasado em relação ao código.** O endereço apresentado como o produto serve uma versão anterior à reformulação de escopo. Mitigação: conferência de versão publicada incorporada ao Definition of Done.
- **R07 - dependência de teste ausente na lista de dependências.** O cliente HTTP exigido pelos testes da API não está declarado, e a proteção dos módulos não captura o erro efetivamente levantado. Consequência: 22 testes de integração da API não executam de forma confiável.

### Estado do incremento ao encerramento da sprint

| Indicador | Valor |
| --- | --- |
| Pontos concluídos do núcleo | 88 de 172 (51%) |
| Testes automatizados | 176 - 74 em Python, 102 em TypeScript, nenhuma falha |
| Culturas curadas | 3 de 24 |
| Fichas de doença | 13 de 88 |
| Tabelas no banco | 19, com DDL numerado e reversível |
| Endpoints da API | 16 |
| Telas implementadas | 5 de 7 |

## Sprint 00 - Planejamento

- Criação do repositório.
- Definição do problema, da equipe, dos papéis e do backlog inicial.

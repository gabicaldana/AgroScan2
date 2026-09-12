# Histórico de mudanças

Registre aqui as mudanças relevantes por sprint ou marco avaliativo.

## Sprint 1 - Especificação e gestão · 31/08 a 14/09/2026

### Entregas avaliativas

- **Artefato 1 - Gestão do Negócio/Domínio** (reapresentação): análise de usuário com os três níveis de usuário caracterizados e a rastreabilidade entre característica do usuário e decisão de projeto.
- **Artefato 2 - Gestão do Projeto** (reapresentação): EAP com sete pacotes, backlog com 40 histórias estimadas, planejamento de sete sprints e organização do repositório institucional.
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
- **Histórias de usuário preenchidas** no Artefato 2: as tabelas estavam vazias na versão anterior. São 40 histórias com critérios de aceite, estimativa e estado.
- **Total de pontos do backlog corrigido**: de 152 (e 155, em versão intermediária) para **167**. As duas somas anteriores estavam aritmeticamente erradas. Com o acréscimo da US41, vinda do Artefato 9 do 2º bimestre, o núcleo passou a **172**.
- **Numeração das sprints realinhada** para 1 a 7, conforme o novo calendário de entregas.
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

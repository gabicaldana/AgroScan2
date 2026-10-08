# Histórico de mudanças

Registre aqui as mudanças relevantes por sprint ou marco avaliativo.

## Sprint 3 - Horta, canteiros e manejo · 29/09 a 12/10/2026

### Caderno filtrável e legível sem rede (US19) e instalação no iPhone (US40)

- **Filtro do caderno** por período (7, 30, 90 dias ou tudo) e por cultura, com paginação de 20 em 20. Roda no aparelho, sobre o que já foi carregado, para funcionar igual em modo avião. O seletor só oferece culturas que têm registro.
- **Histórico sem rede**: antes, o caderno offline mostrava só a fila, e o que já tinha subido sumia. A última lista do servidor agora fica guardada no aparelho, vinculada ao dono e apagada ao sair da conta. A tela avisa quando mostra essa cópia.
- **Instruções para iPhone**: o caminho Compartilhar → Adicionar à Tela de Início, com o aviso de abrir o app ao menos uma vez por semana (risco R02). Aparece só no iOS, inclusive no iPad que se apresenta como Mac, e some no app instalado ou ao ser dispensada.
- **Verificado**: 212 testes TypeScript e 74 Python passando; build de produção sem erro.

### API publicada: o cadastro dava 404 no site ([#67](https://github.com/CampusCEUB/AgroScan/issues/67))

A API **nunca tinha sido publicada**. Na Vercel só existia o projeto do PWA, e
sem a variável `API_URL` o Next não cria o encaminhamento de `/api/v1`: cadastro,
login e sincronização caíam no próprio front e voltavam 404. O diagnóstico
continuava funcionando porque roda no navegador. Decisão registrada no
[ADR 0010](docs/decisoes/adr-0010-publicacao-em-dois-projetos.md).

- **Novo projeto `agroscan-api`** na Vercel, com raiz no repositório, e `API_URL` no projeto do PWA. Segredo JWT de produção gerado à parte, distinto do de desenvolvimento.
- **Conexão com o banco corrigida** em `app/api/banco.py`: o `statement_timeout` ia como parâmetro de inicialização, e o pooler da Neon o recusa — publicada, a API respondia sem banco.
- **Função movida para `gru1` (São Paulo)**, junto do banco em `sa-east-1`; a primeira publicação saiu em Washington.
- **Incidente durante a correção**: um `"framework": null` no `vercel.json` da raiz, colocado para a API, também valeu para o PWA, que ficou cerca de dez minutos servindo só arquivos estáticos (todas as páginas com 404). Revertido; a lição está no ADR 0010 e em [docs/aplicacao.md](docs/aplicacao.md#publicação).
- **Verificado no ambiente publicado**: `/api/v1/saude` com banco `ok`; cadastro, login, listagem do caderno e exclusão de conta pelo endereço do PWA; `/sintomas` redireciona para `/` (308), o que atende a conferência da [#68](https://github.com/CampusCEUB/AgroScan/issues/68). Contas de teste apagadas pela própria API.
- **Pendente**: trocar o Framework Preset do `agroscan-api` para *Other* no painel da Vercel — com o preset FastAPI detectado, os próximos pushes falham na publicação da API — e reapontar a Vercel para este repositório (R06).

## Sprint 2 - Base de conhecimento e publicação · 15/09 a 28/09/2026

### Repositório único: a aplicação veio para o institucional

O código deixou de viver em `gabicaldana/AgroScan2` e passou a ocupar a raiz
deste repositório, ao lado da documentação que o descreve. O que a disciplina
avalia é o repositório institucional, e ele não continha o produto — apenas
descrições dele, com cada afirmação técnica apontando para um endereço externo.

- **103 arquivos** trazidos: `app/`, `api/`, `web/`, `tests/`, `migracoes/`, `data/`, mais `vercel.json`, `requirements.txt`, `requirements-dev.txt` e `.env.example`.
- **Histórico condensado** num commit só, por decisão da equipe. Os 12 commits originais seguem em `gabicaldana/AgroScan2` — são os que o relatório da Sprint 1 cita por hash, e continuam resolvendo lá.
- **Colisões resolvidas**: o README institucional continua a capa avaliada e o README da aplicação virou [`docs/aplicacao.md`](docs/aplicacao.md); os `.github/` eram complementares (templates de um lado, `ci.yml` do outro); os `.gitignore` foram fundidos; adotado o `.gitattributes` do repo de código, cujo `* text=auto eol=lf` é necessário para o teste de frescor dos artefatos gerados não falhar em clone no Windows.
- **Verificado no novo local antes do commit**: validação da base aprovada; 74 testes Python e 102 TypeScript passando; regeração completa dos artefatos sem nenhuma divergência — o passo mais rígido do CI.
- **Documentação realinhada**: a §4.1 do Artefato 2 passou de "Organização de dois repositórios" para "Repositório único", com o registro de por que a separação foi desfeita; §4.2, README, `requisitos.md` e `arquitetura.md` atualizados.

Os registros históricos — atas, relatório da Sprint 1 e registros de entrega —
**não** foram reescritos: descrevem o que era verdade na época, e seus links
para o repositório antigo continuam válidos.

> ⚠️ **Pendência que a migração não resolve.** O ambiente publicado sai da
> Vercel ligada a `gabicaldana/AgroScan2`. Enquanto ela não for reapontada para
> `CampusCEUB/AgroScan`, o código evolui aqui e o deploy sai de lá. Agrava o
> risco R06 e mantém aberta a issue
> [#67](https://github.com/CampusCEUB/AgroScan/issues/67).

### Relatórios das oito sprints

Criados os relatórios das Sprints 2 a 8 em `sprints/`, completando a série. A
pasta deixou de ter apenas a sprint encerrada e a de planejamento inicial.

- **7 relatórios novos** (`sprint-02.md` a `sprint-08.md`), preenchidos até o planejamento: período, objetivo, `milestone`, reuniões, itens planejados com `issue` e pontos, responsáveis, impedimentos herdados e riscos ativos do ciclo. As seções de execução - entregas, `issues` concluídas, `pull requests`, evidências e retrospectiva - ficam marcadas para preenchimento na revisão de cada sprint.
- **Itens extraídos das milestones do GitHub**, e não do calendário em prosa: as contagens por sprint (14, 8, 6, 8, 10, 6 e 5 `issues`) conferem com a tabela do Artefato 2, §4.4.
- **Links pendentes resolvidos**: as 16 atas de reunião já apontavam para `sprints/sprint-0N.md`, que não existiam.
- **Divergência registrada**: a US05 aparece como "4-5" no backlog do Artefato 2 e como item integral da Sprint 5 na `milestone`. Anotada em `sprint-04.md` para decisão no planejamento daquele ciclo.

### Artefatos movidos para `entregas/`

Concluída a mudança de local pedida pela disciplina. Os documentos dos
artefatos passaram de `docs/` para `entregas/`, junto aos registros de entrega
correspondentes, de modo que cada entrega avaliativa se apresente como uma
unidade. A pasta `docs/` guarda agora apenas a documentação técnica de apoio.

- **3 documentos movidos**: Artefatos 1, 2 e 3. As cópias em `docs/` foram removidas - por um tempo o repositório manteve as duas versões, idênticas, com risco de divergirem.
- **~50 links reapontados** em README, requisitos, arquitetura, 9 ADRs, 16 atas de reunião, registros de entrega e relatórios de sprint.
- **Links internos dos próprios artefatos corrigidos**: apontavam para `requisitos.md`, `decisoes/` e `reunioes/` como vizinhos, o que deixou de valer com a mudança de pasta.
- **Artefato 2, §4.2** atualizado, pois descrevia a estrutura antiga de pastas.

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

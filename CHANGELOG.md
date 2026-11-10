# Histórico de mudanças

Registre aqui as mudanças relevantes por sprint ou marco avaliativo.

## Sprint 5 - Base completa, feedback e dashboards · 27/10 a 09/11/2026

### Papéis Scrum e artefatos do semestre (#72, #74)

- **Papéis Scrum**: Product Owner e Scrum Master são exercidos em conjunto pelas duas integrantes. Artefato 2 §4.6 registra a decisão e como cada papel é exercido; `sprint-00-planejamento.md` e `requisitos.md` §8 deixam de marcar a pendência.
- **Artefatos 5 a 9**: não são documentos à parte nem têm data própria; o conteúdo de cada um é o próprio projeto. As tabelas do `README.md`, de `entregas/README.md` e do Artefato 2 §3.1 apontam onde está cada conteúdo.
- **Artefato 4**: não existe. Saem as notas que sugeriam a lacuna na numeração.

### Sair da conta (US42)

- **Cabeçalho**: botão com o primeiro nome de quem está conectado, que leva à nova tela `/conta`; sem conta, "Entrar".
- **Tela "Sua conta"**: nome e e-mail, e o botão "Sair da conta". A exclusão de conta (US15) entra nesta mesma tela.
- **A fila vem antes da saída** ([ADR 0014](docs/decisoes/adr-0014-sair-da-conta-com-a-fila-sem-dono.md)): sair tenta enviar os diagnósticos que estão só no aparelho. Se algum não subir, por falta de rede ou por recusa do servidor, a tela diz quantos são e só sai com a escolha explícita de apagá-los. A opção padrão é "Ficar e enviar depois". Sem isso, eles subiriam para a próxima conta que entrasse no aparelho. A fila continua sem dono: o diagnóstico feito sem conta segue subindo para a conta em que a pessoa entrar (RF14).
- **A sessão avisa quando muda**: o cabeçalho e as telas que dependem da conta se atualizam na hora em que alguém entra ou sai, também em outra aba.
- **Backlog**: a US42 (2 pontos, E3) entrou na Sprint 5, e o núcleo passa de 172 para 174 pontos.
- **Testes**: `web/lib/conta.test.ts`, com a saída com fila vazia, com rede, sem rede, com recusa do servidor e apagando a fila.

### Sintomas mais marcados por cultura (US29)

- **Rotas**: `GET /hortas/{id}/relatorios/sintomas`, das consultas feitas nos canteiros da horta e só para os membros (ADR 0012); e `GET /relatorios/sintomas`, de todo o sistema, que é o relatório da curadoria, só para os papéis `agronomo` e `admin`.
- **O que cada cultura traz**: consultas, doenças cadastradas e, por sintoma, as marcações e quantas doenças da cultura têm o sintoma no perfil. O percentual sobre as consultas da cultura só aparece a partir de 5 consultas.
- **Tela**: seção "Sintomas mais marcados" nos relatórios da horta, com os 5 principais de cada cultura e "Ver todos". O sintoma entre os mais marcados que no máximo uma doença cadastrada tem recebe um aviso para a curadoria (⚠, com texto). Agrônomo e administração escolhem entre "Desta horta" e "De todo o sistema".
- **Conferência em banco real**: os dois recortes contra a contagem feita sobre a lista de consultas da carga de exemplo (`test_relatorios_banco.py`). [`modelo-de-dados.md` §6.3](docs/modelo-de-dados.md) registra os dois recortes e as colunas a mais.
- `requisitos.md`: RF28, RF30 e RF31, entregues na Sprint 4, passam a ✅, assim como o RF29.

### Confirmação do diagnóstico no caderno (US20)

- **Tela**: cada registro do caderno já sincronizado pergunta "O diagnóstico se confirmou?". A resposta é "Sim, era" ou "Não era", com a doença real escolhida entre as da mesma cultura (ou "Não sei qual era") e um comentário opcional. A resposta registrada aparece no lugar da pergunta, com texto e símbolo, sem depender de cor, e pode ser trocada.
- **Um feedback por consulta**: responder de novo substitui a resposta anterior, inclusive o comentário, que volta preenchido no formulário.
- **Precisa de rede**, porque o feedback se prende ao id que o servidor deu à consulta. O registro que ainda está só no aparelho avisa que a pergunta aparece depois que ele subir.
- **API**: `GET /consultas` passa a trazer `confirmado`, `doenca_confirmada_id`, `doenca_confirmada_nome` e `feedback_comentario`, e `GET /consultas/{id}` traz o `feedback`. `POST /consultas/{id}/feedback` passa a recusar, com 422, a doença real de outra cultura, a doença real igual à hipótese principal e a confirmação de consulta sem hipótese. Cada um desses casos entraria na taxa de confirmação (US28) como dado falso.
- **Testes**: TI33 a TI36 na API, um deles em banco real, e 20 casos novos em `web/lib/feedback.test.ts`.

## Sprint 4 - Relatórios agregados · 13/10 a 26/10/2026

### Encerramento da Sprint 4

- **Relatório e atas preenchidos**: `sprint-04.md` com issues, PRs, evidências e retrospectiva; ata da revisão em `docs/reunioes/sprint-04-revisao.md`.
- **24 de 27 pontos aceitos** (US25, US27, US28, US30 e US04); o núcleo chega a **144 de 172 pontos (84%)** no Artefato 2. Realocadas à Sprint 5: US29 (#32) e as pendências #72, #73 e #74.
- **Publicado em 04/11/2026**, e não em 26/10: migração 004 e catálogo `2026.10.24` aplicados no Neon e espelho avançado para `f89f997`. Até lá, o ambiente publicado servia a Sprint 3 (R06).

### Relatórios da horta e alerta de rotação (US27, US28, US30)

- **Rotas**, só para membros da horta (404 para os demais, ADR 0012): incidência por mês e doença, com período (`/hortas/{id}/relatorios/incidencia`); confirmação por doença, com a taxa só a partir de 5 avaliações (`/relatorios/confirmacao`); canteiros que repetem a família botânica de um dos dois últimos ciclos (`/relatorios/rotacao`); e o mesmo alerta antes do plantio (`/canteiros/rotacao`).
- **Telas**: `/relatorios?horta=` com os três relatórios; alerta de rotação no cadastro do canteiro, enquanto a pessoa preenche, sem bloquear.
- **Conferência do `modelo-de-dados.md` §6** contra a contagem manual, num PostgreSQL 16: três das cinco consultas tinham defeito. A incidência contava o mês em UTC, a confirmação não filtrava a horta e agrupava pelo nome, e a rotação não encontrava nada.
- **Migração 004** ([ADR 0013](docs/decisoes/adr-0013-sucessao-de-canteiros-e-alerta-de-rotacao.md)): o nome do canteiro é único só entre os ativos, e o replantio no mesmo lugar reusa o nome do encerrado. É por ele que a sucessão se reconhece. A reversão roda numa transação.
- **Carga de exemplo** (`python -m app.exemplo`, ou `--gerar-sql` para o SQL Editor): conta de demonstração com uma horta, oito canteiros em sucessão, 27 consultas e 21 feedbacks, com as hipóteses calculadas pelo motor.
- **Teste em banco real**: `tests/test_relatorios_banco.py` carrega a carga de exemplo e compara cada relatório com a contagem manual; o CI ganhou um serviço `postgres:16`.
- `python -m app.seed` abortava em todo banco novo; corrigido.

### Filtro por canteiro no caderno (US25)

- O caderno filtra por canteiro, ao lado de período e cultura, no aparelho e sem rede. O seletor só aparece quando separa alguma coisa.
- `GET /consultas` traz `canteiro_nome`, para o canteiro encerrado continuar aparecendo pelo nome.

### Cucurbitáceas e jiló - base `2026.10.24` (US04)

- **4 culturas e 19 doenças novas**: pepino, abobrinha, abóbora e jiló. A base vai de 9 para 13 culturas, de 34 para 53 doenças e de 30 para 38 sintomas. Perfis anteriores inalterados; 38 casos novos de paridade, 122 no total.
- **Ingredientes ativos conferidos nos dados abertos do AGROFIT**, cultura a cultura e alvo a alvo. Isso mudou a mancha-angular do pepino (casugamicina e óxido cuproso, no lugar dos cúpricos da fonte), o nematoide-das-galhas do jiló (ciclobutrifluram) e a antracnose do pepino.
- **O jiló entra como solanácea**, embora o critério da US04 o agrupe com as cucurbitáceas; o alerta de rotação o trata assim.
- Fontes e decisões em [`docs/curadoria/curadoria-cucurbitaceas-e-jilo.md`](docs/curadoria/curadoria-cucurbitaceas-e-jilo.md).

### Conferência agronômica das brássicas - base `2026.10.18`

- **Podridão-negra** (brócolis, couve, couve-flor, repolho): saem oxicloreto e hidróxido de cobre. Não há produto registrado no MAPA para o alvo em brássicas; o laudo passa a mostrar que o manejo é todo preventivo.
- **Hérnia das crucíferas** (couve-flor, repolho): entra a ciazofamida, registrada para o alvo (Ranman, MAPA 5105), em aplicação preventiva na bandeja de mudas e no campo. O texto do controle biológico deixa de afirmar efeito do *Trichoderma*, que não diferiu da testemunha em couve-flor.
- **Alternariose** em *Brassica oleracea*: agente passa a *Alternaria brassicicola* e *A. brassicae*.
- **Míldio do agrião**: agente passa a *Hyaloperonospora nasturtii-aquatici*, e o manejo cultural deixa de mandar secar a folha de uma planta cultivada na água.
- Sintomas e pesos inalterados; fixtures e módulo do app regerados. Fontes e pendências em [`docs/curadoria/conferencia-brassicas.md`](docs/curadoria/conferencia-brassicas.md).

### Documentação

- README, EAP e épicos do Artefato 2, `docs/aplicacao.md` e `sprints/README.md` alinhados ao estado de 18/10: 120 de 172 pontos, 331 testes, 30 endpoints.
- US40 (#41) incluída nas issues concluídas da Sprint 3.
- Travessões trocados por hífen em documentos e comentários de código.

## Sprint 3 - Horta, canteiros e manejo · 29/09 a 12/10/2026

### Encerramento das Sprints 1 a 3

- **Relatórios e atas preenchidos**: `sprint-02.md` e `sprint-03.md` com issues, PRs, evidências e retrospectiva; atas de planejamento e revisão das Sprints 2 e 3.
- **Milestones 2 e 3 encerradas** em 16/10/2026; a US40 (#41), entregue antes do previsto, foi movida para a milestone da Sprint 3. Realocadas: US01 (#4) para a Sprint 5; US04 (#7), US25 (#28) e as pendências #72, #73 e #74 para a Sprint 4.
- **US25 fica aberta**: o filtro por canteiro existe na API, mas ainda não na tela do caderno.

### Código em `src/`, e os Documentos de Software saem

- **Todo o código passou para `src/`**, a pedido da professora: `app/`, `api/`, `web/`, `tests/`, `migracoes/`, `data/`, os `requirements` e o `vercel.json`. A raiz fica com a documentação avaliada. Os caminhos internos são relativos entre si e não mudaram; mudaram o CI (`working-directory: src`), o `.gitattributes`, o `.gitignore` e os Root Directories na Vercel (`src/web` e `src`). O Neon não depende da estrutura do repositório.
- **Documentos de Software v1 e v2 removidos**: os artefatos em `entregas/` os substituem.
- Links da documentação para o código atualizados; relatórios de sprint, atas e artefatos entregues mantêm as menções de caminho da época.

### Hortas, membros, canteiros e manejo (US22-US26)

Regras de acesso e de exclusão de conta no
[ADR 0012](docs/decisoes/adr-0012-acesso-por-horta.md).

- **API**: hortas ([#25](https://github.com/CampusCEUB/AgroScan/issues/25)), membros por e-mail com transferência da responsabilidade ([#26](https://github.com/CampusCEUB/AgroScan/issues/26)), canteiros encerráveis e de cultura fixa ([#27](https://github.com/CampusCEUB/AgroScan/issues/27)), consulta vinculada ao canteiro ([#28](https://github.com/CampusCEUB/AgroScan/issues/28)) e registro de manejo ([#29](https://github.com/CampusCEUB/AgroScan/issues/29)). Quem não participa da horta recebe 404.
- **Telas**: aba Hortas; horta com canteiros e pessoas; canteiro com histórico e registro de manejo; seletor de canteiro ao salvar o diagnóstico, que funciona sem rede pela lista guardada no aparelho; atalho do laudo para registrar o manejo com a doença já marcada.
- **Exclusão de conta**: hortas só da pessoa vão junto; as compartilhadas pedem a transferência (409, antes era 500). Com manejo registrado, a conta é anonimizada em vez de apagada, preservando a rastreabilidade do registro de defensivo.
- **Verificado no ambiente publicado** com três contas de teste (responsável, membro e alguém de fora): criação, convite, recusas por papel, canteiro, manejo, transferência e exclusão. Depois da carga do catálogo, o roteiro completo passou sem falha: consulta vinculada ao canteiro, histórico filtrado por canteiro, canteiro de couve e exclusão com anonimização de quem tinha manejo. Contas de teste apagadas ao fim; fica um registro "Conta excluída", sem dado pessoal, como a regra prevê.
- 36 testes novos de contrato HTTP em `tests/test_hortas.py`.

### Catálogo preso no banco: toda consulta dava 500 desde 27/09

A carga do catálogo `2026.09.27` nunca entrou no banco de produção. A hérnia das
crucíferas tem `tipo_agente` "protista", que o tipo do banco e o seed não
conheciam, e a carga abortava inteira. Como cada consulta referencia a versão do
catálogo por chave estrangeira, **toda gravação de consulta respondia 500**. A
fila offline guardou tudo no aparelho, então nada se perdeu, mas nada subiu.

- **Migração 002**: `protista` no `tipo_agente`. O seed confirma as migrações antes de carregar o catálogo, porque um valor novo de ENUM não pode ser usado na transação que o criou.
- **Migração 003**: o id de cultura passa a aceitar sublinhado. `couve_flor` violava o `CHECK` da 001, que só aceitava hífen, e era o segundo ponto onde a carga abortava. Renomear na base quebraria as consultas de couve-flor já guardadas na fila dos aparelhos.
- **Validação da base contra as regras do banco**: ids de cultura, sintoma e doença e o `tipo_agente` são conferidos por `python -m app.validacao`, que roda no CI. As duas falhas acima passam a quebrar o CI, e não a carga em produção.
- **`--gerar-sql --separar`**: a carga em dois arquivos, migrações e catálogo, executados um de cada vez. Um erro de migração aparece sozinho num arquivo pequeno, e o tipo novo já está confirmado quando o catálogo chega.
- **Aplicado no Neon em 09/10/2026.** As duas primeiras tentativas falharam porque o SQL Editor estava em outro banco: o banco da aplicação se chama `agroscan` **com um espaço no fim**, e no seletor ele parece igual a um `agroscan` sem espaço.
- **Conferido antes de ir ao Neon**, num PostgreSQL embutido (PGlite): um banco igual ao de produção (migração 001 e catálogo 2026.09.03) recebe o SQL incremental inteiro, como no SQL Editor, e de novo uma segunda vez, sem erro.
- **`--gerar-sql --desde-migracao 2`**: SQL para banco existente. A 001 não é reexecutável, e o arquivo gerado antes abortava inteiro num banco pronto.
- **`/saude`**: novo campo `catalogo_no_banco`, que teria denunciado o problema no primeiro dia. Em produção, a rota também deixou de expor a mensagem de erro do banco, que trazia host e usuário.

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
- **Conexão com o banco corrigida** em `app/api/banco.py`: o `statement_timeout` ia como parâmetro de inicialização, e o pooler da Neon o recusa - publicada, a API respondia sem banco.
- **Função movida para `gru1` (São Paulo)**, junto do banco em `sa-east-1`; a primeira publicação saiu em Washington.
- **Incidente durante a correção**: um `"framework": null` no `vercel.json` da raiz, colocado para a API, também valeu para o PWA, que ficou cerca de dez minutos servindo só arquivos estáticos (todas as páginas com 404). Revertido; a lição está no ADR 0010 e em [docs/aplicacao.md](docs/aplicacao.md#publicação).
- **Verificado no ambiente publicado**: `/api/v1/saude` com banco `ok`; cadastro, login, listagem do caderno e exclusão de conta pelo endereço do PWA; `/sintomas` redireciona para `/` (308), o que atende a conferência da [#68](https://github.com/CampusCEUB/AgroScan/issues/68). Contas de teste apagadas pela própria API.
- **Framework Preset do `agroscan-api` trocado para *Other*** no painel da Vercel; publicação conferida em seguida.
- **Dois repositórios, por decisão** ([ADR 0011](docs/decisoes/adr-0011-dois-repositorios-com-espelho-de-publicacao.md)): a organização não autoriza ligar a Vercel aqui, então o reapontamento deixa de ser pendência. Este repositório segue completo e avaliado; `gabicaldana/AgroScan2` vira espelho de publicação, com o mesmo histórico, avançado só por fast-forward depois de cada merge.

## Sprint 2 - Base de conhecimento e publicação · 15/09 a 28/09/2026

### Repositório único: a aplicação veio para o institucional

O código deixou de viver em `gabicaldana/AgroScan2` e passou a ocupar a raiz
deste repositório, ao lado da documentação que o descreve. O que a disciplina
avalia é o repositório institucional, e ele não continha o produto - apenas
descrições dele, com cada afirmação técnica apontando para um endereço externo.

- **103 arquivos** trazidos: `app/`, `api/`, `web/`, `tests/`, `migracoes/`, `data/`, mais `vercel.json`, `requirements.txt`, `requirements-dev.txt` e `.env.example`.
- **Histórico condensado** num commit só, por decisão da equipe. Os 12 commits originais seguem em `gabicaldana/AgroScan2` - são os que o relatório da Sprint 1 cita por hash, e continuam resolvendo lá.
- **Colisões resolvidas**: o README institucional continua a capa avaliada e o README da aplicação virou [`docs/aplicacao.md`](docs/aplicacao.md); os `.github/` eram complementares (templates de um lado, `ci.yml` do outro); os `.gitignore` foram fundidos; adotado o `.gitattributes` do repo de código, cujo `* text=auto eol=lf` é necessário para o teste de frescor dos artefatos gerados não falhar em clone no Windows.
- **Verificado no novo local antes do commit**: validação da base aprovada; 74 testes Python e 102 TypeScript passando; regeração completa dos artefatos sem nenhuma divergência - o passo mais rígido do CI.
- **Documentação realinhada**: a §4.1 do Artefato 2 passou de "Organização de dois repositórios" para "Repositório único", com o registro de por que a separação foi desfeita; §4.2, README, `requisitos.md` e `arquitetura.md` atualizados.

Os registros históricos - atas, relatório da Sprint 1 e registros de entrega -
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

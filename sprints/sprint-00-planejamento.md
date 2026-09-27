# Sprint 00 - Planejamento

## Contexto

O AgroScan chega à Sprint 1 com uma reformulação de escopo já concluída. O
projeto começou voltado a **culturas de commodity** - havia cana, café e algodão
na base de conhecimento - e foi redirecionado para **hortaliças**, por três
razões:

1. O segmento de commodities já é atendido por assistência técnica própria e sistemas de gestão consolidados. A carência de informação técnica está na olericultura de pequena escala.
2. A olericultura brasileira é dominada por agricultura familiar, o que dá ao projeto relevância social verificável e vínculo natural com a Atividade de Extensão.
3. A curadoria agronômica de hortaliças pode ser organizada **por família botânica**, e não por cultura, porque é assim que a literatura fitopatológica está escrita. Uma pesquisa sobre brássicas cobre couve, repolho, brócolis, couve-flor, rúcula e agrião - seis culturas por levantamento. Isso torna a meta de 24 culturas alcançável por uma equipe de duas pessoas em um semestre.

A reformulação está registrada no histórico do repositório de código (commit
`2971e78`, "Domínio do projeto: hortaliças").

Ao entrar na Sprint 1, o projeto **já possui incremento funcional construído**:
diagnóstico por sintomas offline, API REST publicada, banco PostgreSQL modelado
e populado, autenticação e caderno de campo com sincronização. O trabalho da
Sprint 1 é, portanto, de **especificação e formalização** - documentar o que
existe, corrigir as inconsistências herdadas e planejar o que falta.

### Premissas

- A equipe tem duas integrantes e um semestre.
- A infraestrutura deve operar em camadas gratuitas de serviços em nuvem.
- O gargalo do projeto é a curadoria agronômica, não o desenvolvimento.
- A identificação de doenças por imagem é escopo condicionado, e o produto tem de ser completo sem ela.

### Restrições iniciais

| Restrição | Efeito no planejamento |
| --- | --- |
| Entrega dos Artefatos 1, 2 e 3 em 14/09/2026 | Define o encerramento da Sprint 1 |
| Data do Artefato 5 ainda não divulgada | O calendário das Sprints 6 e 7 é provisório |
| Comunidade parceira da Atividade de Extensão não definida | Impede fixar a priorização das famílias botânicas na curadoria |

## Equipe

| Integrante | Matrícula |
| --- | --- |
| Gabriela Pedersoli Caldana | 22404253 |
| Thaís Regina Dias da Mota | 22403754 |

| Campo | Informação |
| --- | --- |
| Disciplina | Projeto Integrador II |
| Turma | B |
| Instituição | CEUB - Centro Universitário de Brasília |
| Professora responsável | Adriana Falcomer Pontes |
| IDProjeto | 20260286 |
| Semestre | 2026/2 |

## Papéis

> ⚠️ **A distribuição nominal dos papéis está pendente de definição pela
> equipe.** Os papéis abaixo estão descritos; falta atribuí-los.

| Papel | Responsabilidade |
| --- | --- |
| Product Owner | Prioriza o backlog, decide cortes de escopo, é a interlocutora com a professora e com a comunidade parceira |
| Scrum Master | Conduz os eventos, mantém as `milestones` e as `issues` em dia, remove impedimentos |
| Desenvolvimento | Ambas as integrantes - front-end, back-end, banco e testes |
| Curadoria agronômica | Ambas as integrantes, com revisão cruzada obrigatória por *pull request* |
| Documentação | Ambas as integrantes, com revisão cruzada |

A curadoria agronômica é responsabilidade compartilhada porque é o gargalo do
projeto (risco R01): concentrá-la em uma pessoa criaria um ponto único de falha
no item de maior esforço.

## Cadência escolhida

| Item | Definição |
| --- | --- |
| Duração da sprint | 2 semanas |
| Exceção | A Sprint 1 tem 15 dias, para encerrar na data de entrega dos Artefatos 1, 2 e 3 |
| Planejamento | Na abertura da sprint - seleção das histórias e definição da meta |
| Alinhamento | No meio da sprint - impedimentos e ajuste de rota |
| Revisão | No encerramento - demonstração do incremento |
| Retrospectiva | No encerramento - melhoria do processo |
| Acompanhamento | `Milestone` por sprint no GitHub, com uma `issue` por história de usuário |

Duas semanas foi a escolha por dois motivos: acomoda um levantamento completo de
família botânica na trilha de curadoria, e casa com o intervalo entre os marcos
avaliativos da disciplina.

## Problema

Produtores de hortaliças identificam doenças tarde ou identificam errado, e as
duas coisas custam produção. O acesso ao engenheiro agrônomo é caro, esporádico
ou inexistente para grande parte dos pequenos produtores; sintomas visualmente
semelhantes correspondem a doenças de manejo distinto; e a incerteza resultante
leva à pulverização por precaução, com custo desnecessário, contaminação
ambiental e exposição do aplicador.

As ferramentas digitais existentes não servem a esse contexto: exigem conexão
permanente, usam bases que não refletem a realidade fitossanitária brasileira,
ou devolvem uma resposta única sem indicar seu grau de confiança.

Detalhamento em [`docs/requisitos.md`](../docs/requisitos.md) §3.

## Objetivo

**Objetivo do ciclo de planejamento:** estabelecer escopo, backlog priorizado,
calendário de sprints e estrutura de repositório suficientes para conduzir o
semestre, com rastreabilidade entre requisito, história, sprint e verificação.

**Critério verificável de encerramento:**

- [x] Problema, público-alvo e escopo definidos e livres de contradição interna
- [x] Requisitos funcionais, não funcionais e regras de negócio catalogados com identificador
- [x] Backlog do produto organizado em épicos e histórias estimadas
- [x] Calendário de sprints com marcos acadêmicos e ordem de corte definida
- [x] Riscos identificados com mitigação
- [x] Repositório institucional estruturado, com ADRs das decisões já tomadas
- [x] `Milestones` e `issues` criadas no GitHub *(8 milestones, 81 issues, backlog no [GitHub Project](https://github.com/orgs/CAMPUSCEUB/projects/223))*
- [ ] Papéis Scrum atribuídos nominalmente *(pendente)*

## Riscos

| ID | Risco | Prob. | Impacto | Mitigação |
| --- | --- | --- | --- | --- |
| R01 | Volume da curadoria agronômica - 75 fichas e 21 culturas restantes, com duas pessoas | Alta | Alto | Curadoria por família botânica; trilha paralela em todas as sprints; ordem de corte definida |
| R02 | Descarte do armazenamento local em iOS após ~7 dias sem uso | Média | Alto | Catálogo reconstruível; fila esvaziada na abertura; orientação ao usuário (US40) |
| R03 | Comunidade parceira da Atividade de Extensão não definida | Alta | Alto | Tratativa com a coordenação; a base permite repriorizar famílias sem retrabalho técnico |
| R04 | Acervo de imagens sem cobertura suficiente de hortaliças | Alta | Baixo | Escopo condicionado, fora do núcleo; auditoria com prazo delimitado na Sprint 5 |
| R05 | Esgotamento de conexões do banco em ambiente serverless | Média | Médio | Conexão agrupada em execução, direta só para migração |
| R06 | Ambiente publicado defasado em relação ao código | Média | Médio | Conferência de versão publicada no Definition of Done |
| R07 | Dependência de teste ausente na lista de dependências | Alta | Médio | Declarar a dependência; verificar que o CI executa os testes da API |
| R08 | Divergência silenciosa entre as implementações do motor | Baixa | Alto | Fixtures versionadas; igualdade exata; teste de frescor no CI |

**Lacunas de conhecimento reconhecidas:** nenhuma das integrantes tem formação em
agronomia. A curadoria é feita a partir de fontes técnicas reconhecidas
(Embrapa Hortaliças, IAC, AGROFIT/MAPA), com citação obrigatória de fonte por
ficha e revisão cruzada - e o sistema declara em todo laudo que não substitui a
avaliação de um engenheiro agrônomo.

## Backlog inicial

Priorização MoSCoW e estimativa em pontos de história no
[Artefato 2](../entregas/artefato-2-gestao-do-projeto.md). Resumo por épico:

| Épico | Descrição | Pts | Prioridade |
| --- | --- | --- | --- |
| E2 | Diagnóstico por sintomas offline | 25 | Núcleo inegociável |
| E7 | Plataforma e infraestrutura - API, banco, publicação, CI | 35 | Núcleo inegociável |
| E1 | Base de conhecimento - 24 culturas, 88 doenças | 32 | Núcleo, com ordem de corte |
| E3 | Identidade e conta | 13 | Núcleo inegociável |
| E4 | Caderno de campo | 27 | Núcleo inegociável |
| E5 | Horta, canteiros e manejo | 19 | Importante |
| E6 | Relatórios agregados | 21 | Importante - mínimo de dois relatórios |
| E8 | Identificação por imagem | 23 | **Condicionado** |

**Total do núcleo (E1-E7): 172 pontos.** E8 acrescenta 23 pontos condicionados.

**Ordem de corte, definida antecipadamente:**

1. Culturas além das 12 de cobertura prioritária, mantendo o mínimo de 3 doenças nas que permanecerem
2. Alerta de rotação de culturas (US30) e sintomas mais marcados por cultura (US29)
3. Registro de manejo (US26) e anotações livres (US21)
4. Foto anexada à consulta (US37)

## Acordos de trabalho

### Comunicação

- Alinhamento assíncrono contínuo; ponto de sincronização no meio e no fim de cada sprint.
- Impedimento que bloqueie por mais de 48 horas é registrado como comentário na `issue` correspondente, para ficar rastreável.

### Definition of Done

Uma história está concluída quando:

- o código está integrado ao ramo principal, com histórico de commits descritivo;
- os testes automatizados passam e a integração contínua está verde;
- os artefatos gerados estão atualizados em relação às suas fontes;
- a funcionalidade foi verificada em dispositivo móvel real;
- quando aplicável, o comportamento sem conexão foi verificado;
- o ambiente publicado reflete a versão entregue;
- a documentação afetada foi atualizada.

**Para fichas da base de conhecimento**, acrescenta-se: fonte técnica citada com
data de acesso; validação automática aprovada; revisão por outra integrante.

### Revisão

- Todo `pull request` exige revisão de uma integrante que não o abriu.
- `Merge` somente após aprovação e resolução das conversas.
- Branches no padrão `feature/`, `docs/` ou `fix/` seguido do número da `issue`.

### Registro de evidências

- Cada sprint tem um relatório em `sprints/`, com links para `milestone`, `issues`, `pull requests` e evidências verificáveis.
- Cada entrega avaliativa tem um registro em `entregas/`.
- Decisão que altere escopo, arquitetura ou processo gera um ADR em `docs/decisoes/`.

### Critério de qualidade não negociável

Nenhuma entrega pode fazer o sistema **afirmar mais do que ele sabe**. Na
prática: hipótese abaixo do limiar não é exibida; a pergunta de desempate só
promete descartar quando a alternativa de fato não espera o sintoma; e a
identificação por imagem declara indisponibilidade em vez de arriscar um
palpite. Esse critério vale sobre qualquer pressão de prazo.

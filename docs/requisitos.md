# Requisitos

> **Documento canônico de requisitos do AgroScan.** As tabelas de requisitos
> reproduzidas no [Artefato 2](../entregas/artefato-2-gestao-do-projeto.md) derivam deste
> documento. Em caso de divergência, este prevalece.

| Campo | Informação |
| --- | --- |
| Projeto | AgroScan - PWA para diagnóstico de doenças em hortaliças |
| Disciplina | Projeto Integrador II · Turma B · CEUB |
| Equipe | Gabriela Pedersoli Caldana (22404253) · Thaís Regina Dias da Mota (22403754) |
| IDProjeto | 20260286 |
| Última revisão | 12/09/2026 - Sprint 1 |

---

## 1. Visão do produto

O AgroScan é um aplicativo web progressivo que permite ao produtor de hortaliças
identificar doenças a partir dos sintomas que observa na planta, **sem depender
de conexão com a internet e sem depender de foto**. O usuário seleciona a
hortaliça, marca os sintomas agrupados pelo órgão da planta onde aparecem, e
recebe hipóteses de doença ordenadas por grau de compatibilidade, cada uma com
descrição, nível de gravidade, condições climáticas favoráveis e manejo
apresentado na ordem do manejo integrado.

Este repositório reúne a documentação de gestão do negócio, do projeto e do
produto **e** a aplicação: o código, a base de conhecimento curada, a API, o
banco de dados e os testes automatizados. Até a Sprint 2 o código vivia em
`gabicaldana/AgroScan2`, cujo histórico segue publicado.

O resultado esperado é duplo: acadêmico, exercitando modelagem e implementação
de banco relacional, back-end com API, front-end responsivo e acessível,
versionamento e Scrum; e social, levando informação agronômica confiável a um
público que hoje decide sem ela.

## 2. Público-alvo

| Nível | Usuário | Necessidade central |
| --- | --- | --- |
| **Primário** | Pequeno ou médio produtor de hortaliças, agricultor familiar, horticultor urbano | Saber o que a planta tem e o que fazer, agora, no canteiro e sem sinal |
| **Secundário** | Técnico agrícola ou extensionista | Registrar o que encontrou em cada propriedade e ler os relatórios agregados |
| **Terciário** | Gestor de horta comunitária ou escolar | Organizar canteiros cultivados coletivamente e manter histórico por canteiro |
| Avaliação | Professora responsável e banca da disciplina | Verificar competências e rastreabilidade das entregas |
| Validação | Comunidade parceira da Atividade de Extensão | Usar o sistema e validar as decisões de projeto |

Análise completa em [Artefato 1](../entregas/artefato-1-analise-de-usuario.md).

**Fora do público-alvo:** o sistema não substitui o engenheiro agrônomo, não
emite receituário agronômico e não atende grandes lavouras de commodities.

## 3. Problema

Produtores de hortaliças identificam doenças tarde ou identificam errado, e as
duas coisas custam produção. Três fatores se combinam:

1. **Assistência técnica escassa.** O acesso ao agrônomo é caro, esporádico ou inexistente para grande parte dos pequenos produtores, e a decisão precisa ser tomada no mesmo dia.
2. **Sintomas semelhantes em doenças de manejo distinto.** Míldio e oídio em cucurbitáceas, alternariose e podridão negra em brássicas. Confundir o par leva à aplicação que não atinge o agente real. Na requeima da batata, dados da Embrapa indicam perdas de 10% a 50% da produção.
3. **Pulverização por precaução como resposta padrão.** A literatura da Embrapa registra que o uso indiscriminado de químicos como única opção de controle resultou em contaminações, desequilíbrios ambientais, resíduos nos alimentos e intoxicação de aplicadores.

As ferramentas digitais disponíveis não atendem esse contexto: exigem conexão
permanente, usam bases que não refletem a realidade fitossanitária brasileira,
ou devolvem uma resposta única sem indicar seu grau de confiança.

## 4. Objetivos

### 4.1 Objetivo principal

Entregar um PWA instalável que produza diagnóstico por sintomas **integralmente
offline** sobre uma base agronômica curada de 24 hortaliças e 88 doenças,
apresentando incerteza de forma explícita e orientando o manejo na ordem
cultural → biológica → química.

### 4.2 Metas por sprint

| Sprint | Meta verificável |
| --- | --- |
| 1 | Artefatos 1, 2 e 3 entregues; repositório institucional estruturado; incremento já construído consolidado e documentado |
| 2 | Brássicas curadas (6 culturas); batata e pimentão em conformidade com a RN05; ambiente publicado refletindo o código |
| 3 | Horta, membros, canteiros e manejo funcionais ponta a ponta; cucurbitáceas curadas |
| 4 | Quatro relatórios agregados operando sobre histórico real; apiáceas e amarilidáceas curadas |
| 5 | Base completa: 24 culturas e 88 doenças; confirmação de diagnóstico na interface; dashboards incorporados (Artefato 9); auditoria do acervo de imagens |
| 6 | Apresentação à comunidade; análise de usuário validada com produtores (Artefato 6); conformidade LGPD; auditoria de acessibilidade; testes ponta a ponta do fluxo offline |
| 7 | Website com dados e documentação (Artefato 5); arquitetura de software e testes de sistema (Artefato 8); relatórios de extensão |
| 8 | Execução e revisão consolidada das sprints (Artefato 7); publicação na vitrine de ativos; apresentação final |

## 5. Requisitos funcionais

Prioridade MoSCoW: **Obrigatório** (must), **Importante** (should), **Desejável** (could).
Estado verificado em 12/09/2026 sobre o commit `068b6d9`.

### 5.1 Diagnóstico

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF01 | Selecionar a hortaliça, com culturas agrupadas por grupo (fruto, folha, flor, haste, raiz) | Obrigatório | 🔄 3 de 24 culturas |
| RF02 | Apresentar os sintomas da cultura selecionada, agrupados pelo órgão da planta | Obrigatório | ✅ |
| RF03 | Marcar e desmarcar os sintomas observados | Obrigatório | ✅ |
| RF04 | Calcular e apresentar hipóteses ordenadas por grau de compatibilidade | Obrigatório | ✅ |
| RF05 | Informar quando nenhuma hipótese atinge a compatibilidade mínima, em vez de apresentar a menos improvável | Obrigatório | ✅ |
| RF06 | Sugerir um sintoma adicional a observar quando as duas primeiras hipóteses estiverem próximas | Importante | ✅ |
| RF07 | Exibir, por hipótese, laudo com nome, agente causal, descrição, gravidade e condições favoráveis | Obrigatório | ✅ |
| RF08 | Apresentar as medidas de manejo na ordem cultural → biológica → química | Obrigatório | ✅ |
| RF09 | Exibir o aviso legal e a exigência de receituário agronômico em todo laudo | Obrigatório | ✅ |
| RF10 | Capturar foto da planta pela câmera do dispositivo | Desejável | 🟡 captura e pré-processamento prontos e testados, **fora da navegação** enquanto não houver modelo (ADR 0008); vínculo à consulta ⬜ |
| RF11 | Informar explicitamente quando a identificação automática por imagem não estiver disponível | Obrigatório | ✅ |

### 5.2 Conta e identidade

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF12 | Cadastro de usuário com nome, e-mail e senha | Obrigatório | ✅ |
| RF13 | Autenticar o usuário e manter a sessão | Obrigatório | ✅ |
| RF14 | Permitir o uso do diagnóstico sem cadastro, exigindo conta apenas para salvar histórico | Importante | ✅ |
| RF15 | Permitir a exclusão da conta e dos dados associados | Obrigatório | 🟡 API pronta, tela ⬜ |

### 5.3 Caderno de campo

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF16 | Registrar cada consulta com cultura, sintomas marcados, hipóteses e data | Obrigatório | ✅ |
| RF17 | Armazenar localmente as consultas feitas sem conexão e enviá-las quando houver rede | Obrigatório | ✅ |
| RF18 | Não duplicar consulta reenviada pela fila de sincronização | Obrigatório | ✅ |
| RF19 | Listar o histórico com filtro por período, cultura e canteiro | Obrigatório | 🟡 período e cultura ✅; canteiro ⬜ |
| RF20 | Registrar se o diagnóstico se confirmou e qual foi a doença real | Importante | 🟡 API pronta, tela ⬜ |
| RF21 | Permitir anotações livres associadas a canteiro ou consulta | Desejável | ⬜ |
| RF22 | Registrar a geolocalização da consulta, mediante consentimento explícito | Desejável | 🟡 aceita e valida coordenada; consentimento na interface ⬜ |

### 5.4 Horta e canteiros

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF23 | Cadastrar horta com nome e município | Importante | ⬜ tabela modelada |
| RF24 | Associar outros usuários a uma horta | Importante | ⬜ tabela modelada |
| RF25 | Cadastrar canteiros com identificação, cultura e data de plantio | Importante | ⬜ tabela modelada |
| RF26 | Vincular uma consulta a um canteiro | Importante | ⬜ coluna modelada |
| RF27 | Registrar o manejo aplicado, com tipo, descrição, produto e data | Desejável | ⬜ tabela modelada |

### 5.5 Relatórios

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF28 | Apresentar a incidência de doenças por período em uma horta | Importante | ⬜ consulta SQL especificada |
| RF29 | Apresentar os sintomas mais frequentemente marcados por cultura | Desejável | ⬜ consulta SQL especificada |
| RF30 | Apresentar a taxa de confirmação dos diagnósticos por doença | Desejável | ⬜ consulta SQL especificada |
| RF31 | Alertar quando culturas da mesma família botânica se repetirem no mesmo canteiro | Desejável | ⬜ consulta SQL especificada |
| RF37 | Apresentar os indicadores agregados em painéis visuais incorporados à interface | Importante | ⬜ escopo do Artefato 9, 2o bimestre |

### 5.6 Plataforma

| ID | Requisito | Prioridade | Estado |
| --- | --- | --- | --- |
| RF32 | Ser instalável como aplicativo no celular (PWA) | Obrigatório | ✅ |
| RF33 | Disponibilizar API REST para consulta ao catálogo e ao diagnóstico | Obrigatório | ✅ |
| RF34 | Sincronizar o catálogo quando houver versão mais recente no servidor | Importante | 🟡 endpoint de versão ✅; consumo no cliente ⬜ |
| RF35 | Registrar, em cada consulta, a versão do catálogo usada no diagnóstico | Importante | ✅ |
| RF36 | Indicar visualmente quando está operando sem conexão | Importante | ✅ |

## 6. Requisitos não funcionais

| ID | Requisito | Categoria | Verificação |
| --- | --- | --- | --- |
| RNF01 | Diagnóstico por sintomas integralmente sem conexão, incluindo a primeira consulta após a instalação | Disponibilidade | Manual em dispositivo real; ponta a ponta previsto na Sprint 6 |
| RNF02 | Cálculo do diagnóstico em menos de 100 ms no dispositivo | Desempenho | ⬜ não medido automaticamente |
| RNF03 | API responde em até 3 s no percentil 95, considerando inicialização a frio | Desempenho | ⬜ não medido automaticamente |
| RNF04 | Aplicativo carrega em até 3 s em conexão 3G | Desempenho | ⬜ não medido |
| RNF05 | Nível AAA de contraste da WCAG 2.1 | Acessibilidade | Inspeção - contraste de texto 17,9:1 |
| RNF06 | Alvos de toque de no mínimo 56 px, para uso com luvas | Acessibilidade | Inspeção do sistema de design |
| RNF07 | Corpo de texto de no mínimo 18 px | Acessibilidade | Inspeção do sistema de design |
| RNF08 | Nenhuma informação transmitida exclusivamente por cor | Acessibilidade | Inspeção - gravidade usa barra, escala e rótulo textual |
| RNF09 | Interface integralmente em português brasileiro | Usabilidade | Inspeção |
| RNF10 | Interface responsiva, com prioridade para telas de celular | Usabilidade | Inspeção |
| RNF11 | Tema claro fixo, sem herdar o modo escuro do sistema | Usabilidade | Inspeção |
| RNF12 | Senhas armazenadas com função de derivação de chave (scrypt), nunca em texto claro | Segurança | ✅ 7 testes automatizados |
| RNF13 | Autenticação com token de prazo de expiração | Segurança | ✅ 4 testes automatizados |
| RNF14 | Toda comunicação sobre HTTPS | Segurança | Garantido pela plataforma de publicação |
| RNF15 | Coletar apenas os dados pessoais necessários à finalidade, conforme a LGPD | Privacidade | ✅ isolamento entre usuários testado; revisão formal na Sprint 6 |
| RNF16 | Geolocalização sempre opcional, com consentimento explícito | Privacidade | 🟡 opcional no modelo; consentimento na interface ⬜ |
| RNF17 | Usuário pode excluir sua conta e seus dados de forma efetiva | Privacidade | 🟡 `DELETE /autenticacao/eu` ✅; tela ⬜ |
| RNF18 | Base de conhecimento validada automaticamente antes de qualquer carga | Confiabilidade | ✅ `python -m app.validacao` |
| RNF19 | As implementações do motor devem produzir resultados idênticos, verificados por testes sobre casos compartilhados | Confiabilidade | ✅ três implementações, igualdade exata |
| RNF20 | A integração contínua deve bloquear código cujos artefatos gerados estejam desatualizados | Manutenibilidade | ✅ verificação de árvore limpa no CI |
| RNF21 | Código e documentação versionados em Git com histórico rastreável | Manutenibilidade | ✅ |
| RNF22 | Infraestrutura dentro dos limites de camadas gratuitas | Restrição | ✅ |
| RNF23 | Front-end e back-end publicados em ambiente acessível por URL | Restrição | 🟡 publicado, porém **defasado** em relação ao código (risco R06) |
| RNF24 | Banco de dados relacional | Restrição | ✅ PostgreSQL |
| RNF25 | Instalável como PWA em Android, iOS e desktop, por URL pública, sem loja | Distribuição | ✅ |
| RNF26 | Funcionar nas versões correntes de Chrome (Android), Safari (iOS) e Chromium (desktop) | Compatibilidade | 🟡 verificação em iOS pendente |
| RNF27 | Apresentar instruções de instalação específicas para iOS | Compatibilidade | ⬜ US40 |
| RNF28 | Sincronização não depende de segundo plano; disparada na abertura e no retorno da conexão | Compatibilidade | ✅ |

## 7. Critérios de aceitação

Os critérios por história de usuário estão no
[Artefato 2, seção 2.5](../entregas/artefato-2-gestao-do-projeto.md#25-histórias-de-usuário).
Os critérios transversais abaixo se aplicam a **toda** entrega e integram o
Definition of Done:

| # | Critério transversal | Como é observado |
| --- | --- | --- |
| C1 | Nenhum laudo é exibido sem o aviso de receituário agronômico | Inspeção de toda tela de laudo; regra RN09 |
| C2 | Nenhuma hipótese abaixo de 15% de compatibilidade é apresentada | Teste automatizado de limiar; regra RN03 |
| C3 | A pergunta de desempate só afirma descartar quando a alternativa de fato não espera o sintoma | Teste automatizado; regra RN08 |
| C4 | Toda doença tem ao menos um sintoma de peso máximo e uma medida cultural | Validação automática da base; regras RN04 e RN06 |
| C5 | Toda cultura publicada tem no mínimo três doenças | Validação automática (aviso); regra RN05 |
| C6 | Doença de agente viral não apresenta ingrediente ativo de controle direto | Validação automática; regra RN07 |
| C7 | Toda consulta registra a versão do catálogo usada | Teste automatizado; regra RN10 |
| C8 | O reenvio de uma consulta não gera registro duplicado | Teste automatizado; requisito RF18 |
| C9 | Dado de um usuário não é acessível a outro | Teste automatizado de isolamento |
| C10 | Os artefatos gerados estão atualizados em relação às suas fontes | Verificação de árvore limpa no CI; requisito RNF20 |
| C11 | O ambiente publicado reflete a versão entregue | Conferência da versão do catálogo na interface publicada |

## 8. Dependências

| Dependência | Natureza | Impacto se não resolvida | Situação |
| --- | --- | --- | --- |
| Fontes técnicas de curadoria - Embrapa Hortaliças, IAC, AGROFIT/MAPA | Dados | Sem elas não há base de conhecimento; é o insumo do épico E1 | Disponíveis publicamente |
| Definição da comunidade parceira da Atividade de Extensão | Aprovação institucional | Condiciona a priorização das famílias botânicas e a data da apresentação | ⚠️ pendente (risco R03) |
| Data do Artefato 5 e da apresentação à comunidade | Agenda | Impede fechar o calendário das Sprints 6 e 7 | ⚠️ pendente |
| PostgreSQL gerenciado em camada gratuita | Infraestrutura | Sem banco não há caderno, hortas nem relatórios | Ativo |
| Plataforma de publicação (Vercel) em camada gratuita | Infraestrutura | Sem publicação, RNF23 não é atendido | Ativa, porém com implantação defasada (R06) |
| Acervo de imagens de hortaliças brasileiras (Digipathos) | Dados | Sem ele, a identificação por imagem não sai do escopo condicionado | ⚠️ não auditado (risco R04) |
| Dependência de teste do cliente HTTP | Técnica | 22 testes de integração da API não executam de forma confiável | ⚠️ em correção (risco R07) |
| Distribuição dos papéis Scrum entre as integrantes | Dado da equipe | Papéis descritos, mas sem atribuição nominal nos artefatos | ⚠️ pendente |

## 9. Matriz de rastreabilidade

Liga requisito → história → sprint → verificação → `issue`. As `issues` estão no
repositório institucional, uma por história, com o identificador da história no
título e vinculadas à `milestone` da sprint.

| Requisito | História | Sprint | Verificação | Issue |
| --- | --- | --- | --- | --- |
| RF01 | US01 | 2 | Validação da base: 24 culturas presentes | [#4](https://github.com/CampusCEUB/AgroScan/issues/4) |
| RF02, RF03 | US06 | 1 | `lib/diagnostico.test.ts`, TI04 | [#9](https://github.com/CampusCEUB/AgroScan/issues/9) |
| RF04 | US07 | 1 | TI01, TI03 - paridade de três implementações | [#10](https://github.com/CampusCEUB/AgroScan/issues/10) |
| RF05 | US08 | 1 | Teste de limiar (RN03) | [#11](https://github.com/CampusCEUB/AgroScan/issues/11) |
| RF06 | US09 | 1 | TI02 - desempate por HTTP e no cliente | [#12](https://github.com/CampusCEUB/AgroScan/issues/12) |
| RF07 | US10 | 1 | TI05 - ficha completa bate com a fixture | [#13](https://github.com/CampusCEUB/AgroScan/issues/13) |
| RF08, RF09 | US10 | 1 | Inspeção C1; ordem garantida na base | [#13](https://github.com/CampusCEUB/AgroScan/issues/13) |
| RF10, RF11 | US37 | 6 | Inspeção; `lib/recusa.test.ts` | [#42](https://github.com/CampusCEUB/AgroScan/issues/42) |
| RF12, RF13 | US12, US13 | 1 | TI26-TI32 - segurança | [#15](https://github.com/CampusCEUB/AgroScan/issues/15), [#16](https://github.com/CampusCEUB/AgroScan/issues/16) |
| RF14 | US14 | 1 | TI13 - diagnóstico não exige autenticação | [#17](https://github.com/CampusCEUB/AgroScan/issues/17) |
| RF15, RNF17 | US15 | 6 | `DELETE /autenticacao/eu`; tela pendente | [#18](https://github.com/CampusCEUB/AgroScan/issues/18) |
| RF16 | US16 | 1 | TI07 | [#19](https://github.com/CampusCEUB/AgroScan/issues/19) |
| RF17 | US17 | 1 | TI09, TI10, `lib/fila.test.ts` | [#20](https://github.com/CampusCEUB/AgroScan/issues/20) |
| RF18 | US18 | 1 | TI08 - reenvio não duplica | [#21](https://github.com/CampusCEUB/AgroScan/issues/21) |
| RF19 | US19 | 1 | Listagem com filtros; filtro por canteiro na Sprint 3 | [#22](https://github.com/CampusCEUB/AgroScan/issues/22) |
| RF20 | US20 | 5 | TI21, TI22 - coerência do feedback | [#23](https://github.com/CampusCEUB/AgroScan/issues/23) |
| RF21 | US21 | 5 | ⬜ | [#24](https://github.com/CampusCEUB/AgroScan/issues/24) |
| RF22, RNF16 | US22 | 6 | TI19 - coordenada pela metade recusada | ⚠️ ver nota |
| RF23-RF26 | US22-US25 | 3 | ⬜ | [#25](https://github.com/CampusCEUB/AgroScan/issues/25), [#26](https://github.com/CampusCEUB/AgroScan/issues/26), [#27](https://github.com/CampusCEUB/AgroScan/issues/27), [#28](https://github.com/CampusCEUB/AgroScan/issues/28) |
| RF27 | US26 | 3 | ⬜ | [#29](https://github.com/CampusCEUB/AgroScan/issues/29) |
| RF28 | US27 | 4 | Consulta especificada em `modelo-de-dados.md` §6.1 | [#30](https://github.com/CampusCEUB/AgroScan/issues/30) |
| RF29 | US29 | 4 | `modelo-de-dados.md` §6.3 | [#32](https://github.com/CampusCEUB/AgroScan/issues/32) |
| RF30 | US28 | 4 | `modelo-de-dados.md` §6.2 | [#31](https://github.com/CampusCEUB/AgroScan/issues/31) |
| RF31 | US30 | 4 | `modelo-de-dados.md` §6.4 | [#33](https://github.com/CampusCEUB/AgroScan/issues/33) |
| RF37 | US41 | 5 | ⬜ | [#34](https://github.com/CampusCEUB/AgroScan/issues/34) |
| RF32, RNF25 | US31 | 1 | Instalação verificada em Android | [#35](https://github.com/CampusCEUB/AgroScan/issues/35) |
| RF33 | US32 | 1 | TI01, TI04, TI05, TI20, TI23-TI25 | [#36](https://github.com/CampusCEUB/AgroScan/issues/36) |
| RF34 | US36 | 2 | TI25 - checksum da versão do catálogo | [#40](https://github.com/CampusCEUB/AgroScan/issues/40) |
| RF35, RN10 | US16 | 1 | TI11 | [#19](https://github.com/CampusCEUB/AgroScan/issues/19) |
| RF36 | US11 | 1 | Inspeção do `IndicadorRede` | [#14](https://github.com/CampusCEUB/AgroScan/issues/14) |
| RNF18 | US02 | 1 | `python -m app.validacao` | [#5](https://github.com/CampusCEUB/AgroScan/issues/5) |
| RNF19 | US34 | 1 | TI01-TI03, TI06 | [#38](https://github.com/CampusCEUB/AgroScan/issues/38) |
| RNF20 | US35 | 1 | Árvore limpa no CI | [#39](https://github.com/CampusCEUB/AgroScan/issues/39) |
| RNF27 | US40 | 6 | ⬜ | [#41](https://github.com/CampusCEUB/AgroScan/issues/41) |

> ⚠️ **A linha RF22 / RNF16 precisa de correção.** Ela aponta para `US22`, que
> no backlog é *"Como gestor de horta, quero cadastrar minha horta"* (épico E5).
> A geolocalização da consulta mediante consentimento explícito **não tem
> história própria** no backlog: o requisito existe, o modelo de dados já aceita
> e valida a coordenada, mas o consentimento na interface nunca foi convertido
> em item de trabalho. São duas saídas possíveis - criar uma história nova no
> épico E4, ou acrescentar o consentimento aos critérios de aceite de uma
> história existente. Enquanto a escolha não é feita, a célula fica sem `issue`,
> para não registrar um vínculo falso.

## 10. Riscos ligados a requisitos

Registro completo no [Artefato 2, seção 3.5](../entregas/artefato-2-gestao-do-projeto.md#35-riscos).
Ligação direta com requisitos:

| Risco | Requisitos ameaçados | Mitigação |
| --- | --- | --- |
| R01 - volume da curadoria | RF01, RN05 | Curadoria por família botânica; ordem de corte definida |
| R02 - descarte de armazenamento em iOS | RNF01, RF17, RNF26 | Catálogo reconstruível; fila esvaziada na abertura; US40 |
| R03 - comunidade parceira indefinida | RF01 (priorização das culturas) | Base permite repriorizar sem retrabalho técnico |
| R04 - acervo de imagens indisponível | RF10, RF11 | Escopo condicionado; RF11 garante que o sistema declare a ausência |
| R05 - esgotamento de conexões | RNF03 | Conexão agrupada em execução, direta só para migração |
| R06 - implantação defasada | RNF23 | Conferência de versão publicada no Definition of Done (C11) |
| R07 - dependência de teste ausente | RNF19, RNF20 | Declaração explícita da dependência e verificação no CI |

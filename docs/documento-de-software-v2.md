# AgroScan — Documento de Software v2

**Artefato 2 — Backlog e Planejamento**

> Este documento é cumulativo: incorpora integralmente o conteúdo do Documento de Software v1 (Artefato 1) e acrescenta os requisitos funcionais e não funcionais, o backlog do produto e o cronograma em sprints.

| | |
|---|---|
| **Projeto** | AgroScan — diagnóstico de doenças em hortaliças |
| **Disciplina** | Projeto Integrador II |
| **Professora** | Adriana Falcomer |
| **Instituição** | CEUB — Centro Universitário de Brasília |
| **Semestre** | 2026/2 |
| **Versão** | 2.0 |
| **Repositório** | https://github.com/gabicaldana/agroscan |

### Equipe

> ⚠️ **A PREENCHER** — nomes, matrículas e papéis das integrantes.

| Integrante | Matrícula | Papel |
|---|---|---|
| | | Product Owner |
| | | Scrum Master |
| | | Desenvolvimento / Curadoria agronômica |
| | | Desenvolvimento / Curadoria agronômica |

---

## 1. Introdução

O AgroScan é um aplicativo web progressivo (PWA) que auxilia produtores de hortaliças a identificar doenças em suas plantações a partir dos sintomas observados na planta. O usuário seleciona a hortaliça cultivada, marca os sintomas que enxerga — manchas na folha, murcha, lesões no caule, apodrecimento do bulbo — e recebe as hipóteses de doença mais compatíveis, ordenadas, com descrição, nível de gravidade, condições climáticas que favorecem o aparecimento e o manejo recomendado.

O sistema é projetado para o contexto real de uso: **o produtor está no canteiro, sob sol forte, com o celular na mão e frequentemente sem sinal de internet**. Essa restrição não é um detalhe de implementação — ela define a arquitetura do produto. O diagnóstico é calculado no próprio aparelho, sem depender de rede, enquanto o servidor guarda o histórico, organiza a horta e produz os relatórios que só fazem sentido quando há vários registros acumulados ao longo do tempo.

O projeto se apoia em uma **base de conhecimento agronômica curada manualmente** a partir de fontes técnicas reconhecidas (Embrapa Hortaliças, boletins do Instituto Agronômico de Campinas e o AGROFIT/MAPA para ingredientes ativos registrados). Essa base é a fonte da verdade do sistema: dela derivam o catálogo de sintomas, as fichas das doenças, o banco de dados e os testes automatizados.

---

## 2. Problema

**Produtores de hortaliças identificam doenças tarde, ou identificam errado — e as duas coisas custam caro.**

A olericultura brasileira é dominada por pequenos produtores. O Censo Agropecuário de 2017 registrou que **77% dos estabelecimentos agropecuários do país são de agricultura familiar**, e que ela emprega mais de 10 milhões de pessoas — 67% do pessoal ocupado no campo.

**2.1 Assistência técnica escassa.** O acesso a um engenheiro agrônomo é caro, esporádico ou inexistente para grande parte dos pequenos produtores. Quando a doença aparece, a decisão precisa ser tomada no mesmo dia — e normalmente é tomada sozinho.

**2.2 Sintomas parecidos, doenças diferentes, manejos opostos.** Confundir míldio com oídio numa cucurbitácea, ou alternariose com podridão negra numa brássica, leva à aplicação do produto errado: gasto sem resultado, e a doença real seguindo seu curso. Dados da Embrapa indicam que **as perdas causadas pela requeima na batata podem variar de 10% a 50% da produção**.

**2.3 Uso indiscriminado de defensivos como resposta padrão.** A literatura técnica da Embrapa registra que foi o uso indiscriminado de produtos químicos como única opção de controle que resultou em contaminações, desequilíbrios ambientais, resíduos nos alimentos e intoxicação de aplicadores — problema que deu origem ao conceito de **manejo integrado**.

**2.4 As ferramentas digitais existentes não servem a esse contexto.** Tendem a exigir conexão permanente, a serem construídas sobre bases de clima temperado que não refletem a realidade fitossanitária brasileira, ou a devolver uma resposta única sem indicar seu grau de confiança.

---

## 3. Justificativa

**3.1 Relevância social e econômica.** As hortaliças são cultivadas majoritariamente por agricultura familiar e abastecem o consumo alimentar cotidiano das cidades. Reduzir perdas por doença nesse segmento tem efeito direto sobre a renda de pequenos produtores e sobre a oferta de alimentos.

**3.2 Redução do uso desnecessário de defensivos.** Um diagnóstico mais preciso e a apresentação do manejo na ordem do manejo integrado atacam diretamente a prática de pulverizar por precaução.

**3.3 Viabilidade técnica demonstrada.** O motor de diagnóstico por sintomas já existe, está implementado e testado, e é independente da cultura.

**3.4 Adequação ao Projeto Integrador.** O projeto exercita integralmente as competências avaliadas: modelagem e implementação de banco de dados relacional, back-end com API, front-end responsivo e acessível, versionamento e Scrum.

**3.5 Vínculo com a Atividade de Extensão.** O sistema será entregue e demonstrado a uma comunidade real de produtores, que participa como usuária e como fonte de validação.

> ⚠️ **A PREENCHER** — identificação da comunidade parceira e situação do termo de anuência.

---

## 4. Público-alvo

**4.1 Usuário primário — produtor de hortaliças.** Agricultor familiar, horticultor urbano ou responsável por horta comunitária. Usa o sistema no canteiro, ao ar livre, sob luz solar direta, com as mãos sujas ou enluvadas. Conectividade intermitente ou ausente. Celular Android de entrada. Letramento digital variável.

**4.2 Usuário secundário — técnico agrícola ou extensionista.** Atende várias propriedades; precisa registrar o que encontrou e acompanhar a evolução. Consome os relatórios agregados.

**4.3 Usuário terciário — gestor de horta comunitária ou escolar.** Organiza canteiros cultivados coletivamente. É quem torna necessário o compartilhamento de dados entre usuários.

**4.4 Fora do público-alvo.** O sistema não substitui o engenheiro agrônomo, não emite receituário agronômico e não atende grandes lavouras de commodities.

---

## 5. Proposta de solução

O AgroScan é um PWA instalável que diagnostica por sintomas sem internet, assume a incerteza em vez de escondê-la (apresentando hipóteses ordenadas e uma pergunta de desempate quando duas doenças estão próximas), orienta o manejo na ordem do manejo integrado, registra o histórico no caderno de campo, organiza a horta em canteiros e produz relatórios agregados.

### 5.1 Escopo agronômico — 24 hortaliças

| Grupo | Hortaliças |
|---|---|
| **Fruto** | tomate, pimentão, pepino, berinjela, jiló, abobrinha, abóbora, quiabo |
| **Folha** | alface, couve, repolho, rúcula, espinafre, agrião, salsa |
| **Flor** | brócolis, couve-flor |
| **Haste** | alho-poró, aipo (salsão) |
| **Raiz, tubérculo e bulbo** | batata, cenoura, cebola, beterraba, alho |

Meta de **88 fichas de doença**, mínimo de 3 por cultura. Curadoria organizada **por família botânica**, não por cultura.

### 5.2 Arquitetura em três camadas

> **O cliente é autoridade sobre a resposta. O servidor é autoridade sobre o registro.**

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| **Front-end** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 — PWA | Interface, captura de sintomas, **cálculo do diagnóstico**, fila offline |
| **Back-end** | FastAPI (Python), API REST | Autenticação, persistência, hortas e canteiros, relatórios, catálogo |
| **Banco de dados** | PostgreSQL | Catálogo agronômico, usuários, hortas, canteiros, consultas, manejos, feedback |

### 5.3 Distribuição e instalação

O AgroScan é distribuído como **aplicativo web progressivo (PWA)**, instalado diretamente pelo navegador a partir de uma URL pública, sem passar por loja de aplicativos. Essa decisão elimina o custo e a burocracia de publicação em lojas, permite atualizar o sistema para todos os usuários sem exigir ação deles, e viabiliza que o produtor instale o aplicativo a partir de um link recebido por mensagem.

| Plataforma | Forma de instalação | Suporte |
|---|---|---|
| Android (Chrome) | Banner automático de instalação ou menu do navegador | Completo — ícone na lista de aplicativos, janela própria, funcionamento offline |
| iOS (Safari) | Menu Compartilhar → "Adicionar à Tela de Início" | Parcial — ver limitações abaixo |
| Desktop (Chrome, Edge) | Ícone de instalação na barra de endereço | Completo |

**Limitações conhecidas no iOS**, que o projeto trata explicitamente:

1. **Não há banner automático de instalação.** O iOS não oferece à aplicação a possibilidade de solicitar a instalação, de modo que o usuário precisa executar o procedimento manualmente pelo menu de compartilhamento do Safari. O sistema apresenta instruções específicas quando detecta esse ambiente.
2. **O armazenamento local pode ser descartado após cerca de sete dias sem uso.** O Safari remove automaticamente os dados gravados pela aplicação — incluindo o catálogo em cache e as consultas pendentes de envio — quando o aplicativo permanece sem ser aberto por esse período. Trata-se do risco mais relevante para a premissa de funcionamento offline, tratado na seção 11.3.
3. **Não há sincronização em segundo plano.** A fila de consultas registradas sem conexão é enviada quando o aplicativo é aberto ou quando a conexão retorna com o aplicativo em uso, e não de forma autônoma pelo sistema operacional.

Como o público-alvo primário definido na seção 4 utiliza predominantemente aparelhos Android, essas limitações afetam um segmento secundário dos usuários, sem comprometer a proposta central do sistema.

### 5.4 Aviso legal

Sistema **educativo e de apoio à decisão**. Não substitui a avaliação de um engenheiro agrônomo. A aquisição e a aplicação de defensivos agrícolas exigem **receituário agronômico**; o registro válido deve ser conferido no AGROFIT/MAPA. Exibido em todo laudo.

---

## 6. Delimitação de escopo

**Incluído:** diagnóstico por sintomas offline para 24 hortaliças; base curada com meta de 88 fichas; API REST com autenticação; banco PostgreSQL; caderno de campo com sincronização offline; gestão de hortas, canteiros e manejos; relatórios agregados; PWA instalável.

**Não incluído:** emissão de receituário; comercialização de insumos; identificação de pragas (insetos); recomendação de dose personalizada; aplicativo nativo.

**Condicionado:** identificação automática por imagem, dependente da auditoria do acervo Digipathos.

---

# 7. Requisitos Funcionais

Prioridade segundo MoSCoW: **Obrigatório** (must), **Importante** (should), **Desejável** (could).

## 7.1 Diagnóstico

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir ao usuário selecionar a hortaliça, com as culturas agrupadas por grupo (fruto, folha, flor, haste, raiz) | Obrigatório |
| RF02 | O sistema deve apresentar os sintomas da cultura selecionada, agrupados pelo órgão da planta em que ocorrem | Obrigatório |
| RF03 | O sistema deve permitir marcar e desmarcar os sintomas observados | Obrigatório |
| RF04 | O sistema deve calcular e apresentar as hipóteses de doença ordenadas por grau de compatibilidade | Obrigatório |
| RF05 | O sistema deve informar quando nenhuma hipótese atinge a compatibilidade mínima, em vez de apresentar a menos improvável | Obrigatório |
| RF06 | O sistema deve sugerir um sintoma adicional a observar quando as duas primeiras hipóteses estiverem próximas (pergunta de desempate) | Importante |
| RF07 | O sistema deve exibir, para cada hipótese, o laudo com nome, agente causal, descrição, nível de gravidade e condições favoráveis | Obrigatório |
| RF08 | O sistema deve apresentar as medidas de manejo na ordem cultural → biológica → química | Obrigatório |
| RF09 | O sistema deve exibir o aviso legal e a exigência de receituário agronômico em todo laudo | Obrigatório |
| RF10 | O sistema deve permitir capturar foto da planta pela câmera do dispositivo | Desejável |
| RF11 | O sistema deve informar explicitamente quando a identificação automática por imagem não estiver disponível | Obrigatório |

## 7.2 Conta e identidade

| ID | Requisito | Prioridade |
|---|---|---|
| RF12 | O sistema deve permitir o cadastro de usuário com nome, e-mail e senha | Obrigatório |
| RF13 | O sistema deve autenticar o usuário e manter a sessão | Obrigatório |
| RF14 | O sistema deve permitir o uso do diagnóstico sem cadastro, exigindo conta apenas para salvar histórico | Importante |
| RF15 | O sistema deve permitir a exclusão da conta e dos dados associados | Obrigatório |

## 7.3 Caderno de campo

| ID | Requisito | Prioridade |
|---|---|---|
| RF16 | O sistema deve registrar cada consulta realizada, com cultura, sintomas marcados, hipóteses e data | Obrigatório |
| RF17 | O sistema deve armazenar localmente as consultas feitas sem conexão e enviá-las quando houver rede | Obrigatório |
| RF18 | O sistema não deve duplicar uma consulta reenviada pela fila de sincronização | Obrigatório |
| RF19 | O sistema deve listar o histórico de consultas com filtro por período, cultura e canteiro | Obrigatório |
| RF20 | O sistema deve permitir registrar se o diagnóstico se confirmou e qual foi a doença real | Importante |
| RF21 | O sistema deve permitir anotações livres associadas a um canteiro ou consulta | Desejável |
| RF22 | O sistema deve registrar a geolocalização da consulta, mediante consentimento explícito | Desejável |

## 7.4 Horta e canteiros

| ID | Requisito | Prioridade |
|---|---|---|
| RF23 | O sistema deve permitir cadastrar uma horta com nome e município | Importante |
| RF24 | O sistema deve permitir associar outros usuários a uma horta | Importante |
| RF25 | O sistema deve permitir cadastrar canteiros com identificação, cultura e data de plantio | Importante |
| RF26 | O sistema deve permitir vincular uma consulta a um canteiro | Importante |
| RF27 | O sistema deve permitir registrar o manejo aplicado, com tipo, descrição, produto e data | Desejável |

## 7.5 Relatórios

| ID | Requisito | Prioridade |
|---|---|---|
| RF28 | O sistema deve apresentar a incidência de doenças por período em uma horta | Importante |
| RF29 | O sistema deve apresentar os sintomas mais frequentemente marcados por cultura | Desejável |
| RF30 | O sistema deve apresentar a taxa de confirmação dos diagnósticos por doença | Desejável |
| RF31 | O sistema deve alertar quando culturas da mesma família botânica se repetirem no mesmo canteiro | Desejável |

## 7.6 Plataforma

| ID | Requisito | Prioridade |
|---|---|---|
| RF32 | O sistema deve ser instalável como aplicativo no celular (PWA) | Obrigatório |
| RF33 | O sistema deve disponibilizar API REST para consulta ao catálogo e ao diagnóstico | Obrigatório |
| RF34 | O sistema deve sincronizar o catálogo quando houver versão mais recente no servidor | Importante |
| RF35 | O sistema deve registrar, em cada consulta, a versão do catálogo usada no diagnóstico | Importante |
| RF36 | O sistema deve indicar visualmente ao usuário quando está operando sem conexão | Importante |

---

# 8. Requisitos Não Funcionais

## 8.1 Disponibilidade e desempenho

| ID | Requisito |
|---|---|
| RNF01 | O diagnóstico por sintomas deve funcionar integralmente sem conexão com a internet, incluindo a primeira consulta após a instalação |
| RNF02 | O cálculo do diagnóstico no dispositivo deve responder em menos de 100 ms |
| RNF03 | As requisições à API devem responder em até 3 segundos no percentil 95, considerando a inicialização a frio do ambiente serverless |
| RNF04 | O aplicativo deve carregar em até 3 segundos em conexão 3G |

## 8.2 Usabilidade e acessibilidade

| ID | Requisito |
|---|---|
| RNF05 | A interface deve atender ao nível AAA de contraste da WCAG 2.1 |
| RNF06 | Os alvos de toque devem ter no mínimo 56 pixels, para uso com luvas |
| RNF07 | O corpo de texto deve ter no mínimo 18 pixels |
| RNF08 | Nenhuma informação pode ser transmitida exclusivamente por cor |
| RNF09 | A interface deve ser integralmente em português brasileiro |
| RNF10 | A interface deve ser responsiva, com prioridade para telas de celular |
| RNF11 | O aplicativo deve usar tema claro fixo, sem herdar o modo escuro do sistema operacional |

## 8.3 Segurança e privacidade

| ID | Requisito |
|---|---|
| RNF12 | As senhas devem ser armazenadas com função de derivação de chave (scrypt), nunca em texto claro |
| RNF13 | A autenticação deve usar token com prazo de expiração |
| RNF14 | Toda comunicação deve ocorrer sobre HTTPS |
| RNF15 | O sistema deve coletar apenas os dados pessoais necessários à sua finalidade, em conformidade com a LGPD |
| RNF16 | A geolocalização deve ser sempre opcional e solicitada com consentimento explícito |
| RNF17 | O usuário deve poder excluir sua conta e seus dados de forma efetiva |

## 8.4 Confiabilidade e manutenibilidade

| ID | Requisito |
|---|---|
| RNF18 | A base de conhecimento deve ser validada automaticamente antes de qualquer carga; referências quebradas, pesos fora da faixa e fichas incompletas devem impedir a publicação |
| RNF19 | As duas implementações do motor de diagnóstico (servidor e navegador) devem produzir resultados idênticos, verificados por testes automatizados sobre casos compartilhados |
| RNF20 | A integração contínua deve bloquear a entrada de código cujos artefatos gerados estejam desatualizados em relação às suas fontes |
| RNF21 | O código e a documentação devem ser versionados em repositório Git com histórico rastreável |

## 8.5 Restrições de projeto

| ID | Requisito |
|---|---|
| RNF22 | A infraestrutura deve operar dentro dos limites de camadas gratuitas de serviços em nuvem |
| RNF23 | O front-end e o back-end devem ser publicados em ambiente acessível publicamente por URL |
| RNF24 | O banco de dados deve ser relacional |

## 8.6 Compatibilidade e distribuição

| ID | Requisito |
|---|---|
| RNF25 | O sistema deve ser instalável como aplicativo web progressivo em Android, iOS e navegadores de mesa, a partir de URL pública, sem depender de loja de aplicativos |
| RNF26 | O sistema deve funcionar nas versões correntes do Chrome em Android, do Safari em iOS e de navegadores baseados em Chromium em computadores de mesa |
| RNF27 | O sistema deve apresentar instruções de instalação específicas para iOS, ambiente em que não há solicitação automática de instalação |
| RNF28 | A sincronização da fila de consultas registradas sem conexão não deve depender de sincronização em segundo plano, recurso indisponível em iOS; o envio deve ser disparado na abertura do aplicativo e no retorno da conexão |

---

# 9. Regras de Negócio

| ID | Regra |
|---|---|
| RN01 | A compatibilidade entre os sintomas observados e uma doença é calculada por índice de similaridade ponderado, considerando os sintomas presentes, os esperados e ausentes, e os observados que a doença não explica |
| RN02 | Sintomas observados que a doença não explica reduzem sua compatibilidade, com peso menor do que o de um sintoma esperado e ausente |
| RN03 | Hipóteses com compatibilidade inferior a 15% não são apresentadas |
| RN04 | Toda doença cadastrada deve ter ao menos um sintoma de peso máximo — o sintoma clássico da doença |
| RN05 | Toda cultura cadastrada deve ter no mínimo três doenças, para que o sistema possa oferecer hipótese alternativa |
| RN06 | Toda doença deve ter ao menos uma medida de manejo cultural, apresentada antes das demais |
| RN07 | Doenças de agente viral não apresentam ingredientes ativos de controle direto |
| RN08 | A pergunta de desempate só afirma que uma observação descarta uma hipótese quando a hipótese alternativa de fato não espera aquele sintoma |
| RN09 | Todo laudo exibe o aviso de que a aquisição e a aplicação de defensivos exigem receituário agronômico |
| RN10 | Cada consulta registra a versão do catálogo utilizada, garantindo que o histórico permaneça auditável quando a base for atualizada |
| RN11 | Em caso de edição concorrente de um mesmo registro do caderno, prevalece a última escrita recebida |

---

# 10. Backlog do Produto

## 10.1 Épicos

| ID | Épico | Descrição |
|---|---|---|
| **E1** | Base de conhecimento de hortaliças | Curadoria agronômica das 24 culturas e 88 fichas de doença |
| **E2** | Diagnóstico por sintomas offline | Motor de diagnóstico e telas de consulta |
| **E3** | Identidade e conta | Cadastro, autenticação e privacidade |
| **E4** | Caderno de campo | Histórico, sincronização offline e feedback |
| **E5** | Horta, canteiros e manejo | Organização coletiva da área cultivada |
| **E6** | Relatórios | Agregações sobre o histórico acumulado |
| **E7** | Plataforma e infraestrutura | API, banco, publicação e integração contínua |
| **E8** | Identificação por imagem | Escopo condicionado |

## 10.2 Histórias de usuário

Estimativa em pontos de história (escala de Fibonacci): 1 trivial, 2 pequena, 3 média, 5 grande, 8 muito grande.

### E1 — Base de conhecimento

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US01 | Como produtor, quero encontrar a hortaliça que cultivo em uma lista organizada, para não procurar num rol extenso | Culturas agrupadas por grupo; nome popular e científico visíveis; 24 culturas presentes | 3 | 5 |
| US02 | Como curadora, quero que a base recuse fichas incompletas, para que nenhum erro de digitação chegue ao produtor | Validação automática recusa referência quebrada, peso inválido, cultura com menos de 3 doenças, doença sem sintoma clássico e doença viral com ingrediente ativo | 5 | 5 |
| US03 | Como curadora, quero cadastrar as doenças das brássicas, para cobrir couve, repolho, brócolis, couve-flor, rúcula e agrião | 6 culturas com no mínimo 3 doenças cada; fontes citadas; validação aprovada | 8 | 6 |
| US04 | Como curadora, quero cadastrar as doenças das solanáceas e cucurbitáceas | 8 culturas cobertas; tomate, batata e pimentão revisados no novo formato | 8 | 7 |
| US05 | Como curadora, quero cadastrar as doenças das demais famílias | Amarilidáceas, apiáceas, amarantáceas e malváceas cobertas; base fecha 24 culturas e 88 doenças | 8 | 8 |

### E2 — Diagnóstico por sintomas

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US06 | Como produtor, quero marcar os sintomas que vejo na planta, para descobrir o que ela tem | Sintomas agrupados por órgão; marcação e desmarcação; contador de selecionados | 3 | 5 |
| US07 | Como produtor, quero ver as doenças mais compatíveis com o que observei, para saber por onde começar | Lista ordenada por compatibilidade; barra visual e percentual; nada abaixo de 15% | 5 | 5 |
| US08 | Como produtor, quero ser avisado quando o sistema não souber responder, para não seguir uma pista falsa | Mensagem explícita quando nenhuma hipótese atinge o limiar; orientação de procurar assistência | 2 | 5 |
| US09 | Como produtor, quero saber qual outro sintoma procurar quando houver dúvida entre duas doenças | Pergunta apresentada quando as duas primeiras hipóteses estão próximas; texto só promete descartar quando a alternativa realmente não espera o sintoma | 5 | 5 |
| US10 | Como produtor, quero ler o laudo completo da doença, para saber o que fazer | Nome, agente, gravidade com rótulo textual, descrição, condições favoráveis, manejo em ordem cultural → biológico → químico, aviso legal | 5 | 5 |
| US11 | Como produtor, quero usar o aplicativo sem internet, porque no canteiro não pega sinal | Fluxo completo de diagnóstico funciona em modo avião após a instalação; indicador de ausência de rede visível | 5 | 5 |

### E3 — Identidade

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US12 | Como produtor, quero criar uma conta, para que meu histórico não se perca | Cadastro com nome, e-mail e senha; e-mail único; senha com hash scrypt | 5 | 6 |
| US13 | Como produtor, quero entrar na minha conta e permanecer conectado | Autenticação por token com expiração; sessão persistida no dispositivo | 3 | 6 |
| US14 | Como visitante, quero usar o diagnóstico sem criar conta, para experimentar antes de me cadastrar | Diagnóstico acessível sem autenticação; salvar histórico solicita cadastro | 2 | 6 |
| US15 | Como usuário, quero excluir minha conta e meus dados | Exclusão efetiva e confirmada; dados associados removidos | 3 | 9 |

### E4 — Caderno de campo

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US16 | Como produtor, quero que minhas consultas fiquem salvas, para consultar depois o que já diagnostiquei | Consulta persistida com cultura, sintomas, hipóteses, data e versão do catálogo | 5 | 6 |
| US17 | Como produtor, quero registrar consultas mesmo sem sinal, para não perder o que observei no campo | Consulta gravada localmente e enfileirada; envio disparado na abertura do aplicativo e no retorno da conexão com o aplicativo em uso, sem depender de sincronização em segundo plano; indicador de pendências visível | 8 | 6 |
| US18 | Como produtor, quero que uma consulta reenviada não apareça duplicada | Identificador próprio por consulta; reenvio da fila não cria registro novo; verificado por teste | 3 | 6 |
| US19 | Como produtor, quero ver meu histórico filtrado por período e cultura | Listagem paginada com filtros; funciona a partir do armazenamento local quando sem rede | 5 | 6 |
| US20 | Como produtor, quero informar se o diagnóstico se confirmou, para melhorar o sistema | Registro de confirmação e da doença real; um feedback por consulta | 3 | 8 |
| US21 | Como produtor, quero escrever anotações sobre um canteiro | Anotação livre associada a canteiro ou consulta; edição e exclusão | 3 | 8 |

### E5 — Horta e canteiros

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US22 | Como gestor de horta, quero cadastrar minha horta, para organizar os registros | Cadastro com nome e município; usuário criador vira responsável | 3 | 7 |
| US23 | Como gestor, quero associar outras pessoas à horta, para que todas registrem no mesmo lugar | Associação de membros com papel; membro enxerga os canteiros da horta | 5 | 7 |
| US24 | Como gestor, quero cadastrar canteiros com a cultura plantada e a data | Identificação única por horta; cultura vinculada ao catálogo; data de plantio | 3 | 7 |
| US25 | Como produtor, quero vincular a consulta ao canteiro onde ela foi feita | Seleção de canteiro no fluxo de diagnóstico; vínculo opcional | 3 | 7 |
| US26 | Como produtor, quero registrar o manejo que apliquei | Registro com tipo, descrição, produto, dose e data, a partir do laudo | 5 | 7 |

### E6 — Relatórios

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US27 | Como gestor, quero ver quais doenças mais ocorreram na horta em um período | Agregação por doença e mês; filtro de período; considera apenas a hipótese principal | 5 | 8 |
| US28 | Como extensionista, quero saber a taxa de confirmação dos diagnósticos | Percentual de confirmação por doença, a partir dos feedbacks | 3 | 8 |
| US29 | Como curadora, quero saber quais sintomas são mais marcados em cada cultura, para orientar a próxima curadoria | Ranking de sintomas por cultura | 3 | 8 |
| US30 | Como gestor, quero ser alertado se plantar a mesma família botânica no mesmo canteiro | Alerta quando o histórico do canteiro repete a família nos ciclos recentes | 5 | 8 |

### E7 — Plataforma

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US31 | Como produtor, quero instalar o AgroScan como aplicativo no celular | PWA instalável; ícone; abre em tela cheia; funciona offline | 3 | 5 |
| US32 | Como equipe, queremos a API publicada e acessível, para integrar o front-end | Endpoints de saúde, catálogo, culturas, doenças e diagnóstico respondendo em URL pública | 8 | 5 |
| US33 | Como equipe, queremos o banco PostgreSQL modelado e populado | Migração inicial aplicada; catálogo carregado a partir da base curada; carga idempotente | 8 | 5 |
| US34 | Como equipe, queremos que o servidor e o navegador produzam o mesmo diagnóstico | Teste automatizado compara a resposta da API com os casos de referência, campo a campo | 5 | 5 |
| US35 | Como equipe, queremos que a integração contínua bloqueie artefatos desatualizados | Pipeline valida a base, regenera artefatos, roda testes e falha se houver divergência | 3 | 5 |
| US36 | Como produtor, quero receber atualizações do catálogo sem reinstalar o aplicativo | Verificação de versão; download e uso da versão nova; funcionamento preservado sem rede | 5 | 6 |
| US40 | Como usuário de iPhone, quero saber como instalar o aplicativo, já que meu aparelho não oferece o botão de instalação | Detecção do ambiente iOS; instruções ilustradas do caminho Compartilhar → Adicionar à Tela de Início; aviso de que o aplicativo deve ser aberto periodicamente para preservar os dados salvos; instrução não reaparece após a instalação | 3 | 5 |

### E8 — Identificação por imagem *(escopo condicionado)*

| ID | História | Critérios de aceite | Pts | Sprint |
|---|---|---|---|---|
| US37 | Como produtor, quero fotografar a planta para anexar ao registro | Captura pela câmera traseira; foto vinculada à consulta | 5 | 9 |
| US38 | Como equipe, queremos auditar o acervo Digipathos, para decidir com dados se a identificação por imagem é viável neste semestre | Inventário de espécies, classes e contagem de imagens; licença verificada; decisão registrada | 5 | 8 |
| US39 | Como produtor, quero que o sistema identifique a doença pela foto | Condicionado ao resultado de US38 | 13 | 9 |

**Total estimado do núcleo (E1–E7): 155 pontos.** E8 acrescenta 23 pontos condicionados.

> A história US40 recebeu numeração posterior às demais por ter sido incorporada ao backlog após a definição inicial dos identificadores, que foram preservados para não invalidar as referências já registradas.

---

# 11. Cronograma em Sprints

Sprints de 2 semanas, com numeração alinhada ao calendário da disciplina. A equipe entra no projeto reformulado na Sprint 4.

| Sprint | Período | Objetivo | Entregas | Marco acadêmico |
|---|---|---|---|---|
| **4** | 31/08 – 11/09 | Especificação | Documentos de Software v1, v2 e v3; modelagem do banco; diagramas de arquitetura, entidade-relacionamento e casos de uso; registro das decisões arquiteturais. Início da curadoria das brássicas | **Artefatos 1, 2 e 3** |
| **5** | 14/09 – 25/09 | Fatia vertical | Banco PostgreSQL modelado e populado; API publicada com catálogo e diagnóstico; front-end conectado; diagnóstico offline funcionando com as 24 culturas; integração contínua atualizada. *US01, US02, US06–US11, US31–US35* | Incremento funcional |
| **6** | 28/09 – 09/10 | Identidade e histórico | Cadastro e autenticação; consultas persistidas; fila de sincronização offline; caderno de campo funcional; sincronização de catálogo. Curadoria das brássicas concluída. *US03, US12–US14, US16–US19, US36* | Sprint Review |
| **7** | 12/10 – 23/10 | Horta e canteiros | Cadastro de hortas, membros e canteiros; consulta vinculada a canteiro; registro de manejo. Curadoria de solanáceas e cucurbitáceas. *US04, US22–US26* | Sprint Review |
| **8** | 26/10 – 06/11 | Relatórios e feedback | Confirmação de diagnóstico; quatro relatórios agregados; anotações. Curadoria das demais famílias — **base completa: 24 culturas, 88 doenças**. Auditoria do acervo Digipathos. *US05, US20, US21, US27–US30, US38* | Sprint Review |
| **9** | 09/11 – 20/11 | Comunidade e endurecimento | **Apresentação para a comunidade parceira (16/11)**; tratamento de erros; conformidade com a LGPD; auditoria de acessibilidade; testes ponta a ponta do fluxo offline; dados de demonstração. Congelamento de código em 20/11. *US15, US37, US39 (condicionado)* | **Apresentação à Comunidade** |
| **10** | 23/11 – 04/12 | Fechamento | Documento de Software v4; roteiro e ensaio da apresentação final; relatórios da Atividade de Extensão | **Artefato 4 (27/11)** · Relatórios de Extensão (30/11) |

## 11.1 Marcos de avaliação

| Data | Entrega |
|---|---|
| 04/09 | Artefato 3 — Especificação Técnica do Sistema |
| 16/11 | Apresentação para a Comunidade |
| 27/11 | Artefato 4 — Documento Final do Sistema |
| 30/11 | Relatórios de Atividade de Extensão |

> ⚠️ Os Artefatos 1 e 2, com vencimento original em 21/08 e 28/08, são entregues nesta Sprint 4 em conjunto com o Artefato 3, em razão da reformulação de escopo do projeto.

## 11.2 Priorização e plano de contingência

O escopo está organizado em degraus, com ordem de corte definida antecipadamente. Caso a velocidade da equipe fique abaixo do previsto, o corte segue esta ordem:

1. Culturas além das 12 de cobertura prioritária (mantendo o mínimo de 3 doenças nas que permanecerem)
2. Foto anexada à consulta (US37)
3. Registro de manejo e alerta de rotação (US26, US30)
4. Taxa de confirmação dos diagnósticos (US28)

**Núcleo inegociável:** diagnóstico por sintomas offline, API e banco em produção, autenticação, caderno com sincronização, ao menos dois relatórios agregados, e a documentação completa.

**Escopo condicionado:** a identificação automática por imagem (US39) só entra se a auditoria do acervo (US38) demonstrar viabilidade. Caso contrário, é registrada como trabalho futuro no Documento de Software v4, com a justificativa medida — e o sistema continua declarando ao usuário que a funcionalidade não está disponível, em vez de arriscar um palpite.

## 11.3 Riscos e mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R01 | **Volume da curadoria agronômica.** São 75 fichas de doença a produzir, com duas pessoas responsáveis. É a atividade de maior esforço do projeto e a que não pode ser acelerada por decisão técnica | Alta | Alto | Curadoria organizada por família botânica, e não por cultura: uma pesquisa cobre até seis culturas, reduzindo o trabalho a sete levantamentos. Início na Sprint 4, em paralelo à documentação. Ordem de corte definida na seção 11.2. Validação automática impede o ingresso de ficha incompleta |
| R02 | **Descarte do armazenamento local em iOS.** O Safari remove os dados da aplicação após cerca de sete dias sem uso, o que pode apagar o catálogo em cache e as consultas ainda não enviadas — comprometendo justamente a premissa de funcionamento sem conexão | Média | Alto | O catálogo é reconstruído automaticamente na abertura seguinte com conexão, de modo que a perda é recuperável. A fila de envio é esvaziada na abertura do aplicativo, reduzindo a janela de exposição. O aplicativo orienta o usuário de iOS a abri-lo periodicamente (US40). O público-alvo primário utiliza predominantemente Android, onde a restrição não se aplica |
| R03 | **Definição da comunidade parceira da Atividade de Extensão.** A escolha da comunidade condiciona a priorização das hortaliças na curadoria e a apresentação de 16/11 | Alta | Alto | Tratativa imediata com a coordenação da disciplina. A arquitetura da base permite repriorizar quais famílias botânicas são curadas primeiro sem retrabalho técnico |
| R04 | **Indisponibilidade do acervo de imagens para hortaliças.** A identificação automática por imagem depende de um acervo com volume suficiente por classe, ainda não verificado | Alta | Baixo | A funcionalidade é escopo condicionado e não integra o núcleo do produto. A auditoria (US38) ocorre na Sprint 8, com prazo delimitado, e seu resultado — favorável ou não — é registrado no documento final |
| R05 | **Esgotamento de conexões do banco de dados em ambiente serverless.** Cada requisição pode abrir uma conexão nova, e o plano gratuito impõe limite baixo | Média | Médio | Uso de conexão agrupada (pooling) em tempo de execução e conexão direta apenas para migrações; reaproveitamento de conexão entre requisições; tempo limite de consulta configurado |
| R06 | **Concentração de entregas acadêmicas no início do semestre.** Os Artefatos 1, 2 e 3 são produzidos na mesma sprint | Alta | Médio | Os três artefatos são documentais e cumulativos, o que permite produção conjunta. O script de criação do banco serve simultaneamente como artefato de modelagem do Artefato 3 e como primeira entrega técnica da Sprint 5 |

---

# 12. Processo de trabalho

**Metodologia:** Scrum, com sprints de 2 semanas.

| Evento | Momento | Finalidade |
|---|---|---|
| Sprint Planning | Início da sprint | Seleção das histórias e definição da meta |
| Daily | Meio da sprint | Alinhamento de impedimentos |
| Sprint Review | Fim da sprint | Demonstração do incremento |
| Retrospectiva | Fim da sprint | Melhoria do processo |

**Ferramentas:** GitHub para versionamento e gestão do backlog; Vercel para publicação; PostgreSQL gerenciado em nuvem.

## 12.1 Definition of Done

Uma história é considerada concluída quando:

- o código está integrado ao ramo principal, com histórico de commits descritivo;
- os testes automatizados passam e a integração contínua está verde;
- os artefatos gerados estão atualizados em relação às suas fontes;
- a funcionalidade foi verificada em dispositivo móvel real;
- quando aplicável, o comportamento sem conexão foi verificado;
- a documentação afetada foi atualizada.

**Para fichas da base de conhecimento**, acrescenta-se: fonte técnica citada; validação automática aprovada; revisão por outra integrante da equipe.

---

# 13. Referências

- IBGE. **Censo Agropecuário 2017.** Disponível em: https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/21814-2017-censo-agropecuario.html
- EMBRAPA. **Manejo integrado de doenças em hortaliças em cultivo orgânico.** Circular Técnica 111. Disponível em: https://www.infoteca.cnptia.embrapa.br/bitstream/doc/941604/1/ct1111.pdf
- EMBRAPA HORTALIÇAS. **Doenças em hortaliças.** Disponível em: https://www.embrapa.br/hortalicas
- EMBRAPA. **Perdas e desperdício de hortaliças no Brasil.** Disponível em: https://www.embrapa.br/busca-de-publicacoes/-/publicacao/1101593/perdas-e-desperdicio-de-hortalicas-no-brasil
- EMBRAPA INFORMÁTICA AGROPECUÁRIA. **Repositório Digipathos.** Disponível em: https://www.digipathos-rep.cnptia.embrapa.br/
- MAPA. **AGROFIT — Sistema de Agrotóxicos Fitossanitários.** Ministério da Agricultura e Pecuária.
- FILGUEIRA, F. A. R. **Novo manual de olericultura: agrotecnologia moderna na produção e comercialização de hortaliças.** Viçosa: UFV.
- SCHWABER, K.; SUTHERLAND, J. **O Guia do Scrum.** Disponível em: https://scrumguides.org/

> ⚠️ **A PREENCHER** — completar as referências de curadoria agronômica conforme as fontes efetivamente consultadas em cada ficha, com data de acesso.

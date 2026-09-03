# AgroScan — Documento de Software v1

**Artefato 1 — Visão do Sistema**

| | |
|---|---|
| **Projeto** | AgroScan — diagnóstico de doenças em hortaliças |
| **Disciplina** | Projeto Integrador II |
| **Professora** | Adriana Falcomer |
| **Instituição** | CEUB — Centro Universitário de Brasília |
| **Semestre** | 2026/2 |
| **Versão** | 1.0 |
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

Este documento apresenta a visão do sistema: o problema que ele endereça, a justificativa da sua construção, o público a que se destina e a solução proposta.

---

## 2. Problema

**Produtores de hortaliças identificam doenças tarde, ou identificam errado — e as duas coisas custam caro.**

A olericultura brasileira é dominada por pequenos produtores. O Censo Agropecuário de 2017 registrou que **77% dos estabelecimentos agropecuários do país são de agricultura familiar**, e que ela emprega mais de 10 milhões de pessoas — 67% do pessoal ocupado no campo. A agricultura familiar tem participação expressiva na maior parte dos produtos hortícolas.

> ⚠️ **A PREENCHER** — consultar o SIDRA/IBGE para obter o número de estabelecimentos produtores de hortaliças e a participação da agricultura familiar na olericultura especificamente, substituindo o dado geral por um recortado ao domínio do projeto.

Esse perfil de produtor enfrenta três dificuldades que se reforçam:

**2.1 Assistência técnica escassa.** O acesso a um engenheiro agrônomo é caro, esporádico ou inexistente para grande parte dos pequenos produtores. Quando a doença aparece, a decisão precisa ser tomada no mesmo dia — e normalmente é tomada sozinho, com base na experiência própria ou no palpite do vizinho.

**2.2 Sintomas parecidos, doenças diferentes, manejos opostos.** Confundir míldio com oídio numa cucurbitácea, ou alternariose com podridão negra numa brássica, leva à aplicação do produto errado: gasto sem resultado, e a doença real seguindo seu curso. Muitas doenças de hortaliças têm ciclo curto e progressão rápida — dias de atraso mudam o desfecho da safra. Dados da Embrapa indicam, por exemplo, que **as perdas causadas pela requeima na batata podem variar de 10% a 50% da produção**.

**2.3 Uso indiscriminado de defensivos como resposta padrão.** Diante da incerteza, a reação frequente é pulverizar preventivamente, com o produto que estiver à mão. A literatura técnica da Embrapa registra que foi justamente o uso indiscriminado de produtos químicos como única opção de controle que resultou em contaminações, desequilíbrios ambientais, presença de resíduos nos alimentos e intoxicação de aplicadores — problema que deu origem ao conceito de **manejo integrado**, que prioriza medidas culturais e biológicas antes do controle químico.

**2.4 As ferramentas digitais existentes não servem a esse contexto.** As soluções disponíveis tendem a exigir conexão permanente com a internet, a serem construídas sobre bases de dados de clima temperado que não refletem a realidade fitossanitária brasileira, ou a devolver uma resposta única sem indicar seu grau de confiança — o que, para quem vai tomar uma decisão de manejo, pode ser pior do que não responder nada.

**Em síntese:** falta ao pequeno produtor de hortaliças uma ferramenta que funcione onde ele está, no momento em que ele precisa, com informação agronômica confiável, que assuma a incerteza em vez de escondê-la, e que oriente o manejo na ordem tecnicamente correta.

---

## 3. Justificativa

**3.1 Relevância social e econômica.** As hortaliças são cultivadas majoritariamente por agricultura familiar e abastecem o consumo alimentar cotidiano das cidades. Reduzir perdas por doença nesse segmento tem efeito direto sobre a renda de pequenos produtores e sobre a oferta de alimentos. Não se trata de um ganho marginal de eficiência num setor já tecnificado, mas de levar informação técnica a quem hoje não tem acesso a ela.

**3.2 Redução do uso desnecessário de defensivos.** Um diagnóstico mais preciso e a apresentação do manejo na ordem do manejo integrado — medidas culturais primeiro, biológicas em seguida, químicas por último — atacam diretamente a prática de pulverizar por precaução. O benefício é do produtor (custo), do consumidor (resíduos) e do ambiente.

**3.3 Viabilidade técnica demonstrada.** O motor de diagnóstico por sintomas já existe, está implementado e testado, e é independente da cultura: trocar o domínio de commodities para hortaliças é uma mudança na base de conhecimento, não uma reescrita do sistema. Isso permite que o esforço do semestre se concentre onde está o valor — a curadoria agronômica e a arquitetura de três camadas — em vez de reconstruir o que já funciona.

**3.4 Adequação ao Projeto Integrador.** O projeto exercita integralmente as competências avaliadas na disciplina: modelagem e implementação de banco de dados relacional, desenvolvimento de back-end com API, desenvolvimento de front-end responsivo e acessível, versionamento, e a aplicação de Scrum ao longo do semestre. A arquitetura em três camadas não é um enxerto para atender à ementa — ela responde a uma necessidade real do produto, discutida na seção 6.

**3.5 Vínculo com a Atividade de Extensão.** O sistema foi concebido para ser entregue e demonstrado a uma comunidade real de produtores, que participa como usuária e como fonte de validação do que foi construído. A escolha das hortaliças priorizadas na base de conhecimento é orientada pelo que a comunidade parceira efetivamente cultiva.

> ⚠️ **A PREENCHER** — identificação da comunidade parceira, situação do termo de anuência e cronograma de intervenção.

---

## 4. Público-alvo

### 4.1 Usuário primário — produtor de hortaliças

Pequeno ou médio produtor, agricultor familiar, horticultor urbano ou responsável por horta comunitária ou escolar.

- **Contexto de uso:** no canteiro, ao ar livre, sob luz solar direta, com as mãos sujas ou enluvadas, com pressa.
- **Conectividade:** intermitente ou ausente na área de cultivo; conexão disponível apenas na residência ou na sede.
- **Dispositivo:** celular Android de entrada ou intermediário, com armazenamento limitado.
- **Letramento digital:** variável. A interface precisa funcionar sem treinamento prévio.
- **Necessidade:** saber o que a planta tem e o que fazer, agora.

### 4.2 Usuário secundário — técnico agrícola ou extensionista

Profissional que atende várias propriedades ou acompanha um grupo de produtores.

- **Necessidade:** registrar o que encontrou em cada propriedade, acompanhar a evolução ao longo do tempo e identificar o que está circulando na região.
- **Uso diferenciado:** consome os relatórios agregados, que o produtor individual raramente usa.

### 4.3 Usuário terciário — gestor de horta comunitária ou escolar

Responsável por uma área cultivada coletivamente, por várias pessoas.

- **Necessidade:** organizar os canteiros, saber quem registrou o quê, e manter um histórico do que foi aplicado em cada canteiro.
- **Uso diferenciado:** é quem torna necessário o compartilhamento de dados entre usuários — a funcionalidade que justifica a existência do servidor.

### 4.4 Fora do público-alvo

O sistema **não** se destina a substituir o engenheiro agrônomo, a emitir receituário agronômico, nem a atender grandes lavouras de commodities com assistência técnica própria e sistemas de gestão consolidados.

---

## 5. Proposta de solução

### 5.1 O que o sistema faz

O AgroScan é um **PWA instalável no celular** que:

1. **Diagnostica por sintomas, sem internet.** O produtor escolhe a hortaliça, o sistema apresenta os sintomas possíveis organizados pelo órgão da planta onde aparecem (folha, caule, raiz/bulbo, fruto, planta inteira), e ele marca o que observa. O resultado é uma lista de hipóteses ordenada por compatibilidade.

2. **Assume a incerteza em vez de escondê-la.** O sistema não devolve uma resposta única com ares de certeza. Apresenta as hipóteses com seu grau de compatibilidade e, quando duas doenças estão próximas, **faz uma pergunta de desempate**: indica qual sintoma adicional o produtor deve procurar para separar as duas. Se nenhuma hipótese atinge compatibilidade mínima, o sistema diz que não sabe.

3. **Orienta o manejo na ordem tecnicamente correta.** Cada ficha apresenta medidas culturais, depois biológicas, depois químicas — a ordem do manejo integrado. Os ingredientes ativos são apresentados como referência técnica, sempre acompanhados do aviso de que a aquisição e aplicação de defensivos exigem **receituário agronômico** e de que o registro válido para cada combinação de cultura e praga deve ser conferido no AGROFIT/MAPA.

4. **Registra o histórico e organiza a horta.** As consultas ficam salvas no caderno de campo, vinculadas ao canteiro onde foram feitas. O produtor pode registrar o manejo que aplicou e, depois, confirmar se o diagnóstico se sustentou.

5. **Produz relatórios que só existem com histórico acumulado:** incidência de cada doença por período, sintomas mais observados em cada cultura, taxa de confirmação dos diagnósticos e alerta de rotação de culturas quando a mesma família botânica se repete no canteiro.

6. **Captura foto da planta** para anexar à consulta como registro visual. A identificação automática por imagem está prevista como evolução do sistema (seção 5.4).

### 5.2 Escopo agronômico

**24 hortaliças**, organizadas segundo a classificação da Embrapa por parte comestível:

| Grupo | Hortaliças |
|---|---|
| **Fruto** | tomate, pimentão, pepino, berinjela, jiló, abobrinha, abóbora, quiabo |
| **Folha** | alface, couve, repolho, rúcula, espinafre, agrião, salsa |
| **Flor** | brócolis, couve-flor |
| **Haste** | alho-poró, aipo (salsão) |
| **Raiz, tubérculo e bulbo** | batata, cenoura, cebola, beterraba, alho |

Cada hortaliça terá no mínimo **3 doenças cadastradas** — abaixo disso o sistema não consegue oferecer hipótese alternativa nem pergunta de desempate. As culturas de maior peso econômico recebem cobertura mais profunda, com 4 ou mais doenças. A meta é de **88 fichas de doença** ao final do semestre.

A curadoria é organizada **por família botânica**, e não por cultura, porque é assim que a literatura fitopatológica está escrita: míldio, alternariose e podridão negra atingem todas as brássicas: couve, repolho, brócolis, couve-flor, rúcula e agrião. Uma pesquisa cobre seis culturas.

### 5.3 Arquitetura em três camadas

O sistema se organiza segundo um princípio que resolve a tensão entre funcionar offline e ter um servidor:

> **O cliente é autoridade sobre a resposta. O servidor é autoridade sobre o registro.**

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| **Front-end** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 — PWA instalável | Interface, captura de sintomas, **cálculo do diagnóstico**, fila de sincronização offline |
| **Back-end** | FastAPI (Python), API REST | Autenticação, persistência das consultas, gestão de hortas e canteiros, relatórios agregados, publicação do catálogo |
| **Banco de dados** | PostgreSQL | Catálogo agronômico, usuários, hortas, canteiros, consultas, manejos, feedback |

O diagnóstico é calculado **no navegador** porque funcionar sem rede é requisito funcional, não otimização. O servidor guarda o que precisa ser compartilhado entre pessoas e dispositivos, e faz as agregações que só o SQL faz bem.

Quando o produtor registra uma consulta sem sinal, ela entra numa fila local e sobe assim que houver rede, com identificador próprio que impede duplicação em caso de reenvio.

### 5.4 Evolução prevista

A identificação automática de doenças por foto está projetada e parcialmente implementada — a captura da imagem, o pré-processamento e a lógica que decide quando o sistema deve recusar-se a responder já existem. Falta o modelo de visão computacional, cujo treinamento depende de um acervo de imagens de hortaliças brasileiras adequado.

A fonte candidata é o **repositório Digipathos**, da Embrapa Informática Agropecuária, que reúne imagens de doenças de plantas rotuladas por fitopatologistas. Sua cobertura de hortaliças será auditada ao longo do semestre. **Essa funcionalidade é escopo condicionado:** o produto está completo e utilizável sem ela, e o sistema declara abertamente ao usuário que a identificação por imagem ainda não está disponível, em vez de arriscar um palpite.

### 5.5 Sistema de design — "ferramenta de campo"

O contexto de uso dita as decisões visuais:

| Decisão | Razão |
|---|---|
| Fundo branco puro | máximo brilho reflexivo sob sol direto |
| Contraste de texto 17,9:1 | muito acima do mínimo AAA da WCAG |
| Bordas sólidas de 2px, sem sombras | sombra desaparece na luz do sol |
| Corpo de texto de 18px | acima do padrão web de 16px |
| Alvo de toque de 56px | acima da diretriz de 44px, por causa de luvas |
| Tema claro fixo | um app de campo não herda o modo escuro do sistema |

A gravidade da doença nunca é comunicada apenas por cor: usa barra preenchida, escala cromática **e** rótulo textual, para permanecer legível por quem não distingue as cores.

### 5.6 Aviso legal

O AgroScan é um **sistema educativo e de apoio à decisão**. Não substitui a avaliação de um engenheiro agrônomo. No Brasil, a aquisição e a aplicação de defensivos agrícolas exigem receituário agronômico. Os ingredientes ativos citados são referência técnica; o registro válido para cada combinação de cultura, praga e região deve ser conferido no AGROFIT/MAPA. Este aviso é exibido em todo laudo emitido pelo sistema.

---

## 6. Delimitação de escopo

### Incluído nesta entrega

- Diagnóstico por sintomas para 24 hortaliças, funcional sem conexão
- Base de conhecimento curada com meta de 88 fichas de doença
- API REST com autenticação
- Banco de dados relacional PostgreSQL
- Caderno de campo com sincronização offline
- Gestão de hortas, canteiros e manejos
- Relatórios agregados
- PWA instalável

### Não incluído

- Emissão de receituário agronômico
- Comercialização de insumos ou integração com fornecedores
- Identificação de pragas (insetos) — o escopo é doenças de planta
- Recomendação de dose ou calendário de aplicação personalizado
- Aplicativo nativo para lojas de aplicativos

### Escopo condicionado

- Identificação automática de doença por imagem, dependente da auditoria do acervo do Digipathos

---

## 7. Referências

- IBGE. **Censo Agropecuário 2017.** Instituto Brasileiro de Geografia e Estatística. Disponível em: https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/21814-2017-censo-agropecuario.html
- EMBRAPA. **Manejo integrado de doenças em hortaliças em cultivo orgânico.** Circular Técnica. Disponível em: https://www.infoteca.cnptia.embrapa.br/bitstream/doc/941604/1/ct1111.pdf
- EMBRAPA HORTALIÇAS. **Doenças em hortaliças.** Disponível em: https://www.embrapa.br/hortalicas
- EMBRAPA. **Perdas e desperdício de hortaliças no Brasil.** Disponível em: https://www.embrapa.br/busca-de-publicacoes/-/publicacao/1101593/perdas-e-desperdicio-de-hortalicas-no-brasil
- EMBRAPA INFORMÁTICA AGROPECUÁRIA. **Repositório Digipathos.** Disponível em: https://www.digipathos-rep.cnptia.embrapa.br/
- MAPA. **AGROFIT — Sistema de Agrotóxicos Fitossanitários.** Ministério da Agricultura e Pecuária.
- FILGUEIRA, F. A. R. **Novo manual de olericultura: agrotecnologia moderna na produção e comercialização de hortaliças.** Viçosa: UFV.

> ⚠️ **A PREENCHER** — completar as referências de curadoria agronômica conforme as fontes efetivamente consultadas em cada ficha de doença, com data de acesso.

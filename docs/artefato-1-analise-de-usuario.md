# Artefato 1 - Gestão do Negócio/Domínio

## Análise de usuário

| Campo | Informação |
| --- | --- |
| Projeto | AgroScan - PWA para diagnóstico de doenças em hortaliças |
| Disciplina | Projeto Integrador II |
| Turma | B |
| Instituição | CEUB - Centro Universitário de Brasília |
| Professora responsável | Adriana Falcomer Pontes |
| IDProjeto | 20260286 |
| Equipe | Gabriela Pedersoli Caldana (22404253) · Thaís Regina Dias da Mota (22403754) |
| Entrega | 14/09/2026 |
| Sprint | Sprint 1 - Especificação e gestão |
| Repositório institucional | `CampusCEUB/AgroScan` |
| Repositório de código | https://github.com/gabicaldana/AgroScan2 |

> **Nota de revisão.** Esta versão substitui a análise de usuário entregue
> anteriormente, que definia como público-alvo principal o engenheiro agrônomo
> e o técnico agrícola. A definição foi corrigida: o usuário primário do
> AgroScan é o **pequeno produtor de hortaliças**, e o profissional de
> assistência técnica passa a figurar como usuário **secundário**. O motivo da
> correção está registrado na seção 7.

---

## 1. Contexto do domínio

A olericultura brasileira é atividade de pequena escala. O Censo Agropecuário
de 2017 registrou que 77% dos estabelecimentos agropecuários do país são de
agricultura familiar, responsáveis por 67% do pessoal ocupado no campo. É esse
segmento que abastece o consumo cotidiano de hortaliças nas cidades, e é nele
que a assistência técnica especializada é mais escassa.

Doenças fitossanitárias em hortaliças têm duas características que, combinadas,
produzem o problema que este projeto endereça:

1. **Os sintomas se parecem entre si.** Manchas foliares, murchas, lesões e
   apodrecimentos aparecem em doenças de agentes completamente diferentes -
   fungos, bactérias, vírus e ácaros - que exigem manejos distintos e às vezes
   opostos. Míldio e oídio em cucurbitáceas, alternariose e podridão negra em
   brássicas: confundir um par desses leva à aplicação do produto errado.
2. **A progressão é rápida.** Na requeima da batata, dados da Embrapa indicam
   perdas que podem variar de 10% a 50% da produção. A decisão não pode esperar
   a próxima visita técnica, porque frequentemente não há próxima visita
   técnica.

A consequência documentada dessa incerteza é a pulverização por precaução. A
literatura técnica da Embrapa registra que foi o uso indiscriminado de produtos
químicos como única opção de controle que resultou em contaminações,
desequilíbrios ambientais, resíduos nos alimentos e intoxicação de aplicadores -
problema que deu origem ao próprio conceito de manejo integrado.

---

## 2. Usuário primário - produtor de hortaliças

Pequeno ou médio produtor, agricultor familiar, horticultor urbano ou
responsável por horta comunitária ou escolar.

### 2.1 Perfil

| Dimensão | Caracterização |
| --- | --- |
| Conhecimento agronômico | Prático, adquirido por experiência. Reconhece que a planta está doente; tem dificuldade em nomear a doença e em separar doenças de sintomas parecidos |
| Letramento digital | Variável, de básico a intermediário. A interface precisa funcionar sem treinamento prévio |
| Dispositivo | Celular Android de entrada ou intermediário, com armazenamento limitado |
| Conectividade | Intermitente ou ausente na área de cultivo; conexão disponível na residência ou na sede |
| Vínculo com assistência técnica | Esporádico, oneroso ou inexistente |

### 2.2 Contexto de uso

O produtor usa o sistema **no canteiro**, e cada característica desse ambiente
tem consequência direta sobre o projeto da interface:

| Condição do ambiente | Consequência de projeto |
| --- | --- |
| Sol direto sobre a tela | Fundo branco puro, para máximo brilho reflexivo; contraste de texto 17,9:1; bordas sólidas de 2px em vez de sombras, que desaparecem na luz |
| Mãos sujas de terra ou enluvadas | Alvos de toque de 56px, acima da diretriz de 44px |
| Pressa - a decisão é para agora | Fluxo curto: escolher a cultura, marcar sintomas, ler o laudo. Sem cadastro obrigatório para diagnosticar |
| Sem sinal de internet | O diagnóstico é calculado no próprio aparelho. Funcionar offline é requisito funcional, não otimização |
| Leitura ao ar livre, faixa etária ampla | Corpo de texto de 18px, acima do padrão web de 16px |

### 2.3 Necessidades

- Saber **o que a planta tem** a partir do que consegue observar, sem depender de foto nem de rede.
- Saber **o que fazer**, na ordem tecnicamente correta: medidas culturais antes das biológicas, biológicas antes das químicas.
- Entender **o grau de incerteza** da resposta, em vez de receber uma afirmação única.
- Registrar o que observou, para consultar depois e acompanhar a evolução do canteiro.
- Receber a informação em português, com os nomes populares que ele usa.

### 2.4 Dores

| Dor | Como se manifesta hoje |
| --- | --- |
| Ausência de assistência técnica no momento da decisão | A escolha do manejo é feita sozinho, com base na experiência própria ou em informação obtida informalmente |
| Sintomas semelhantes entre doenças diferentes | Identificação incorreta, seguida de manejo que não atinge o agente real |
| Identificação tardia | A doença avança enquanto a dúvida persiste |
| Gasto com defensivo que não resolve | Aplicação preventiva ou por tentativa, frequentemente com o produto que estava disponível |
| Ferramentas digitais que não servem ao contexto | Exigem conexão permanente, ou usam bases de clima temperado que não refletem a realidade fitossanitária brasileira, ou devolvem uma resposta única sem indicar confiança |

### 2.5 Objetivo

Avaliar uma planta com sintomas, obter hipóteses ordenadas por compatibilidade
e decidir o manejo com informação técnica - reduzindo perda de produção e
aplicação desnecessária de defensivo.

---

## 3. Usuário secundário - técnico agrícola ou extensionista

Profissional que atende várias propriedades ou acompanha um grupo de produtores.

- **Perfil:** possui formação técnica e conhece as culturas que avalia. Não usa o sistema para descobrir o que a planta tem, e sim para **registrar** o que encontrou e **acompanhar** a evolução.
- **Necessidade:** registro por propriedade, histórico ao longo do tempo e leitura do que está circulando na região.
- **Uso diferenciado:** é o consumidor dos **relatórios agregados** - incidência por período, taxa de confirmação dos diagnósticos, sintomas mais observados por cultura. O produtor individual raramente usa esses relatórios.

---

## 4. Usuário terciário - gestor de horta comunitária ou escolar

Responsável por uma área cultivada coletivamente, por várias pessoas.

- **Necessidade:** organizar os canteiros, saber quem registrou o quê e manter o histórico do que foi aplicado em cada canteiro.
- **Uso diferenciado:** é este usuário que **torna necessário o compartilhamento de dados entre pessoas e dispositivos** - e, portanto, é ele que justifica a existência do servidor. Sem uso coletivo, um aplicativo puramente local atenderia.

---

## 5. Fora do público-alvo

O sistema **não** se destina a:

- substituir a avaliação do engenheiro agrônomo;
- emitir receituário agronômico;
- atender grandes lavouras de commodities, que possuem assistência técnica própria e sistemas de gestão consolidados;
- identificar pragas insetos, recomendar dose personalizada ou comercializar insumos.

---

## 6. Como a análise determina a solução

Cada característica do usuário produz uma decisão verificável no produto. Esta
tabela é a rastreabilidade entre a análise e o sistema:

| Característica do usuário | Decisão no sistema | Requisito |
| --- | --- | --- |
| Sem sinal no canteiro | Diagnóstico calculado no navegador, sobre base embutida no aplicativo | RNF01, RF32 |
| Precisa decidir agora | Diagnóstico acessível sem cadastro; conta exigida só para salvar histórico | RF14 |
| Não sabe nomear a doença | Entrada por **sintomas observados**, agrupados pelo órgão da planta, e não por nome de doença | RF02, RF03 |
| Sintomas ambíguos entre doenças | Hipóteses ordenadas por compatibilidade, e pergunta de desempate que indica qual sintoma observar em seguida | RF04, RF06 |
| Risco de decidir com base em resposta falsa | O sistema informa que não sabe quando nenhuma hipótese atinge a compatibilidade mínima, em vez de apresentar a menos improvável | RF05, RN03 |
| Tendência à pulverização por precaução | Manejo apresentado na ordem cultural → biológica → química | RF08, RN06 |
| Risco legal e sanitário do defensivo | Aviso de exigência de receituário agronômico em todo laudo | RF09, RN09 |
| Sol direto, luva, pressa | Tema claro fixo, contraste AAA, toque de 56px, texto de 18px | RNF05 a RNF11 |
| Celular com armazenamento limitado | PWA instalável por URL, sem loja de aplicativos | RNF25 |
| Uso coletivo da horta | Hortas, membros e canteiros no servidor, com consultas vinculadas ao canteiro | RF23 a RF26 |
| Acompanhamento ao longo do tempo | Caderno de campo com fila de sincronização offline e identificador que impede duplicação | RF16 a RF19 |

---

## 7. Registro da correção do público-alvo

A primeira versão desta análise definiu como usuário principal o engenheiro
agrônomo e o técnico agrícola em campo. A definição foi revista por três
motivos, todos verificáveis nos demais artefatos:

1. **Contradição interna com a delimitação de escopo.** A mesma documentação
   afirmava que o sistema "não substitui o engenheiro agrônomo" e, ao mesmo
   tempo, que o agrônomo era seu usuário principal. As duas afirmações não se
   sustentam juntas.
2. **Incoerência com a justificativa do projeto.** A relevância social alegada -
   levar informação técnica a quem não tem acesso a ela - pressupõe um usuário
   que **não** é o próprio detentor dessa informação técnica.
3. **Incoerência com as decisões de projeto já implementadas.** Um usuário com
   formação em agronomia não precisa que a entrada seja por sintoma observado em
   vez de nome de doença, nem que o manejo venha ordenado pelo princípio do
   manejo integrado. Essas duas decisões só fazem sentido para um usuário sem
   formação técnica formal.

O profissional de assistência técnica permanece no público-alvo como usuário
secundário, com necessidade distinta e comprovadamente diferente: ele consome
os relatórios agregados, que o produtor individual raramente usa.

---

## 8. Limitações desta análise

- A análise foi construída a partir da literatura técnica do domínio (Embrapa Hortaliças, IBGE) e da documentação do projeto. **Não houve, até esta entrega, pesquisa primária com produtores** - entrevista, questionário ou observação em campo.
- Não foram definidos dados demográficos específicos (idade, gênero, renda, localização), por não haver base empírica que os sustente.
- A validação com a comunidade parceira da Atividade de Extensão está prevista, e é ela que converterá esta análise de hipótese fundamentada em análise verificada.

> ⚠️ **Pendência** - identificação da comunidade parceira da Atividade de
> Extensão. A escolha condiciona a priorização das hortaliças na curadoria, uma
> vez que a base é construída por família botânica e a ordem das famílias é
> orientada pelo que a comunidade efetivamente cultiva. Risco registrado como
> **R03** no Artefato 2.

---

## 9. Próximos passos

1. Validar as decisões de interface com usuários do contexto agrícola, na apresentação à comunidade parceira.
2. Incorporar o resultado dessa validação ao Documento Final do Sistema.
3. Usar a priorização de culturas indicada pela comunidade para ordenar a curadoria por família botânica.

---

## 10. Referências

- IBGE. **Censo Agropecuário 2017.** https://www.ibge.gov.br/estatisticas/economicas/agricultura-e-pecuaria/21814-2017-censo-agropecuario.html
- EMBRAPA. **Manejo integrado de doenças em hortaliças em cultivo orgânico.** Circular Técnica 111. https://www.infoteca.cnptia.embrapa.br/bitstream/doc/941604/1/ct1111.pdf
- EMBRAPA HORTALIÇAS. **Doenças em hortaliças.** https://www.embrapa.br/hortalicas
- EMBRAPA. **Perdas e desperdício de hortaliças no Brasil.** https://www.embrapa.br/busca-de-publicacoes/-/publicacao/1101593/perdas-e-desperdicio-de-hortalicas-no-brasil
- MAPA. **AGROFIT - Sistema de Agrotóxicos Fitossanitários.**
- FILGUEIRA, F. A. R. **Novo manual de olericultura.** Viçosa: UFV.

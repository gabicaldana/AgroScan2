# AgroScan — diagnóstico de doenças em hortaliças

App web que o produtor abre no celular na horta, marca os sintomas que vê na
planta e recebe as hipóteses de doença na hora — com descrição, gravidade,
manejo integrado e as condições climáticas que favorecem o aparecimento.

**▶ [agroscan-blond.vercel.app](https://agroscan-blond.vercel.app)** — instalável
no celular e funcional em modo avião.

> **Estado atual:** o motor de diagnóstico por sintomas funciona ponta a ponta,
> offline, sem foto e sem rede. A base cobre **3 hortaliças e 13 doenças**
> curadas — tomate, batata e pimentão — e cresce por família botânica: as
> brássicas são as próximas. A câmera captura e pré-processa; falta o modelo de
> visão, e até ele existir o app diz isso em vez de chutar. O banco relacional
> está modelado e versionado em `migracoes/`, a **API REST está implementada**
> (catálogo, diagnóstico, conta e caderno de campo) e o front-end já a consome,
> com fila de sincronização offline. Faltam **hortas e canteiros** e os
> **relatórios agregados**: as tabelas existem, as rotas e as telas não.
>
> Verificado em 12/09/2026: **176 testes automatizados, nenhuma falha** — 74 em
> Python e 102 no porte em TypeScript.

---

## Duas restrições que definem a arquitetura

**1. Horta tem sinal ruim ou nenhum.** Se o diagnóstico precisa de uma chamada
de rede, o app falha exatamente onde deveria funcionar. O cálculo roda **no
navegador**, sobre a base embutida no bundle. Isso não é economia de servidor —
é requisito funcional.

**2. Sistema que sempre responde, mente.** Um diagnóstico devolvido com ares de
certeza sobre um quadro incompleto é pior que nenhum: leva à aplicação errada,
que custa dinheiro e não resolve. O motor apresenta compatibilidade, não
probabilidade, e diz que não sabe quando não sabe.

Daí a divisão de responsabilidade que organiza o projeto inteiro:

> **O cliente é autoridade sobre a resposta. O servidor é autoridade sobre o
> registro.**

```
   Produtor ──> PWA instalável, offline-first
                     │
        ┌────────────▼────────────┐
        │  motor por sintomas     │  ✅ pronto · offline · sem foto
        │  + pergunta de desempate│
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  identificação por foto │  ⬜ falta o modelo; o caminho ao redor
        │  + recusa (OOD)         │     (câmera, preproc, recusa) ✅
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  base de conhecimento   │  ✅ curada à mão, embutida no bundle
        └────────────┬────────────┘
                     │
      descrição · manejo · gravidade · clima · aviso legal
                     │
        ┌────────────▼────────────┐
        │  API + PostgreSQL       │  ✅ conta, histórico e sincronização
        └─────────────────────────┘  ⬜ hortas, canteiros e relatórios
```

### Decisões que sustentam o projeto

**A base de conhecimento nunca carrega identidade de dataset.** As fichas
descrevem agronomia — sintomas, agente, manejo — e nada sobre qual acervo de
imagens existe ou qual modelo foi treinado. Quando a identificação por foto
chegar, o acervo aponta *para* a base por uma tabela própria, nunca por dentro
dela. É isso que permite trocar de acervo sem tocar em uma linha de curadoria, e
ter escopo de app maior que o escopo do modelo.

**A curadoria é organizada por família botânica, não por cultura.** A literatura
fitopatológica é escrita nesse nível: míldio, alternariose e podridão negra
atingem *todas* as brássicas. Uma passada de pesquisa cobre couve, repolho,
brócolis, couve-flor, rúcula e agrião. O catálogo de sintomas existe para ser
reaproveitado — `manchas_escuras_aneis` serve à pinta-preta do tomate e à da
batata sem nenhuma entrada nova.

**Compatibilidade não é probabilidade.** Não existe modelo probabilístico por
trás do fluxo por sintomas, e a interface diz "compatibilidade", nunca "92% de
confiança". Se um modelo de imagem entrar, ele produzirá uma confiança de
verdade — e os dois sinais vão conviver rotulados de forma distinta.

**A base valida antes de carregar.** O JSON é curado à mão, e um id de sintoma
com erro de digitação sumiria do perfil da doença em silêncio: o diagnóstico
ficaria errado sem ninguém notar. `python -m app.validacao` recusa a carga e lista
todos os problemas de uma vez — referência quebrada, peso fora da faixa, doença
sem sintoma clássico, sintoma órfão no catálogo. Cultura com menos de três
doenças gera **aviso**, não erro: funciona, mas o motor não tem segunda hipótese
ali, e a pergunta de desempate deixa de existir naquela cultura.

**Python e TypeScript com papéis separados.** Python fica com a validação da
base, o motor de referência e o tooling de dados. TypeScript fica com a
aplicação. O porte em TS é testado contra o Python com fixtures compartilhadas —
ver [Dois motores, um resultado](#dois-motores-um-resultado).

---

## Rodando

### App web

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm test           # motor TS contra as fixtures do Python
npm run base       # regera lib/base-conhecimento.ts e lib/contrato-visao.ts
npm run icones     # regenera os ícones do PWA a partir do código
```

`npm test` usa o runner nativo do Node (`node --test`), que roda TypeScript
direto: nenhuma dependência de teste, nenhum passo de build.

### Motor de diagnóstico (Python)

Sem dependências externas — só a biblioteca padrão.

```bash
python -m app.validacao         # valida a base curada e lista os avisos
python -m app.cli               # diagnóstico interativo no terminal
python -m app.fixtures          # regera as fixtures compartilhadas com o TS
python -m app.preprocessamento  # regera as fixtures de pixel
python -m unittest discover -s tests -t .
```

Sem as dependências do back-end os testes de API, caderno e segurança **se
pulam sozinhos** — a suíte passa, mas verificando menos do que parece. Confira a
linha `skipped=` na saída. Para rodar a suíte inteira:

```bash
pip install -r requirements-dev.txt
python -m unittest discover -s tests -t .   # 74 testes, nenhum pulado
```

`requirements-dev.txt` inclui o `requirements.txt` de produção mais o cliente
HTTP que o `TestClient` do Starlette exige e não declara. O CI instala este
arquivo e **confere explicitamente** que os testes da API vão rodar antes de
executar a suíte: no CI, pular é passar sem verificar.

### API e banco

```bash
pip install -r requirements.txt      # runtime; use requirements-dev.txt p/ testes
cp .env.example .env          # preencha as strings de conexão

python -m app.seed --conferir  # testa a conexão, não escreve nada
python -m app.seed             # aplica migrações e carrega o catálogo

uvicorn app.api.principal:app --reload   # http://localhost:8000/api/v1/docs
```

O catálogo é **carregado**, nunca escrito à mão — `app/seed.py` lê o JSON
curado, valida e aplica em `UPSERT` idempotente. Rodar duas vezes deixa o banco
no mesmo estado.

Duas strings de conexão, e a diferença importa: `DATABASE_URL` é a **pooled**,
usada em tempo de execução; `DATABASE_URL_DIRETA` é a **não-pooled**, usada
para migração, porque DDL não sobrevive a *transaction pooling*.

### Depois de mexer na base ou no pré-processamento

```bash
python -m app.validacao && python -m app.fixtures && python -m app.preprocessamento
cd web && npm run base && npm test
```

São quatro artefatos gerados e versionados — as fixtures do motor, as de pixel e
os dois módulos TypeScript. Todos têm teste de frescor, e o CI roda exatamente
esta sequência e falha se sobrar diferença: nenhum deles pode envelhecer em
silêncio.

---

## Como a pontuação por sintomas funciona

Cada doença tem um perfil de sintomas com **pesos** de 0 a 1: `1.0` para o
sintoma clássico (anéis concêntricos na pinta-preta), `0.3` para o ocasional.

```
                          acertos
compatibilidade = ─────────────────────────────────
                  acertos + faltantes + ruído × 0.5
```

- **acertos** — soma dos pesos dos sintomas marcados que a doença explica
- **faltantes** — soma dos pesos dos sintomas típicos que o usuário não marcou
- **ruído** — quantidade de sintomas marcados que a doença não explica

É uma variante ponderada do índice de Tversky. O denominador penaliza os dois
erros possíveis: quadro incompleto e quadro contaminado. Abaixo de 15% a
hipótese não é apresentada.

**Sintoma de peso zero não existe.** Um sintoma que a doença não apresenta
simplesmente não tem linha no perfil, e essa ausência é informação: é ela que
permite penalizar o sintoma não explicado.

### A pergunta de desempate

Ter os pesos permite fazer algo que contar sintomas não permitiria: dizer ao
produtor **o que ir olhar em seguida**.

Entre os sintomas que a hipótese líder espera e que ainda não foram marcados, o
motor escolhe o de maior `peso na líder − peso na segunda`. Essa diferença é
exatamente o quanto a resposta afasta as duas.

Pegar simplesmente o de maior peso não funciona — o sintoma mais característico
da líder costuma ser característico da concorrente também, que é justamente por
que as duas empataram. Anéis concêntricos não separam pinta-preta de
mancha-alvo: as duas os fazem. A lesão no fruto separa.

A tela só promete "afasta X" quando a segunda hipótese não espera aquele sintoma
de forma alguma. Quando as duas o esperam, ela diz que a observação confirma mas
não desempata — o motor não deixa a interface prometer mais do que ele sabe.

---

## Dois motores, um resultado

O motor existe duas vezes: em Python (`app/diagnostico.py`, a referência) e em
TypeScript (`web/lib/diagnostico.ts`, o que roda no celular). Duas
implementações da mesma regra divergem sozinhas — basta um arredondamento
diferente.

O contrato é um arquivo de fixtures gerado pelo Python e versionado:

```
data/base_conhecimento.json          fonte da verdade, curada à mão
        │
        ├─ python -m app.fixtures ──> tests/fixtures/casos_diagnostico.json
        │                                  │
        │                                  ├──> teste Python: o motor ainda
        │                                  │    produz exatamente este arquivo
        │                                  └──> teste TS: o porte reproduz
        │                                       cada campo de cada caso
        └─ npm run base ───────────> web/lib/base-conhecimento.ts
```

Os casos incluem o perfil completo e o sintoma isolado de **cada** doença da
base, além dos escolhidos à mão para ruído, ambiguidade, desempate e limiar. A
varredura é automática: uma doença nova entra nas fixtures sozinha, sem que
ninguém escreva um caso. Mudar um peso na base sem regerar quebra os dois lados
— que é o objetivo.

Três armadilhas de portabilidade apareceram e estão tratadas no código:

| Armadilha | Sintoma | Solução |
|---|---|---|
| `sum()` do CPython usa soma compensada de Neumaier; `reduce` do JS soma ingenuamente | `0.7+0.6+0.5+0.3` dá 2.1 num lado e 2.0999999999999996 no outro | o porte replica a compensação |
| `round()` do Python arredonda meio para o par; `Math.round` arredonda meio para cima | 12.5% vira 12% num lado e 13% no outro | o porte replica o meio-para-o-par |
| Ordenar strings por código de caractere joga acento para depois do `z` | "Rúcula" depois de "Salsa"; "Ácaros" no fim da lista | os dois removem diacríticos (NFD) antes de comparar |

Nenhuma delas mudaria um número na tela — erram na décima-sexta casa decimal ou
em um ponto percentual isolado. Mas comparar com tolerância deixaria passar
justamente as divergências reais que o teste existe para pegar, então a
igualdade é exata.

Também são comparados o catálogo de sintomas de cada cultura e as fichas
completas. No total, **176 testes**: 102 no porte em TypeScript e 74 em Python —
destes, 28 no motor de referência, 13 no pré-processamento, 11 na segurança, 14
no contrato do caderno e 8 na API.

---

## A base de conhecimento

Hortaliças, suas doenças e o perfil de sintomas de cada uma, com descrição,
condições favoráveis, manejo integrado e ingredientes ativos de referência. É
trabalho de curadoria agronômica, não de programação — e é o gargalo real do
projeto.

Fontes: **Embrapa Hortaliças**, boletins do **IAC** e **AGROFIT/MAPA** para
ingredientes ativos e registro.

### Escopo

As hortaliças são organizadas nos cinco grupos da classificação da Embrapa por
parte comestível — e é assim que o seletor agrupa a lista na tela, porque uma
lista plana de dezenas de culturas num celular sob sol vira rolagem às cegas.

| Grupo | Alvo | Curadas |
|---|---|---|
| **Fruto** | tomate, pimentão, pepino, berinjela, jiló, abobrinha, abóbora, quiabo | tomate, pimentão |
| **Folha** | alface, couve, repolho, rúcula, espinafre, agrião, salsa | — |
| **Flor** | brócolis, couve-flor | — |
| **Haste** | alho-poró, aipo | — |
| **Raiz, tubérculo e bulbo** | batata, cenoura, cebola, beterraba, alho | batata |

### Pares confundíveis, de propósito

Os pesos codificam agronomia, não intuição. Onde duas doenças são genuinamente
confundíveis no campo, a base não força uma separação artificial: pinta-preta e
mancha-alvo do tomate empatam nos anéis concêntricos porque as duas realmente os
fazem, e a descrição diz onde olhar para separá-las. Fingir certeza aqui seria
pior que a dúvida.

Mofo-de-folha e oídio do tomate são o outro caso: as duas causam desfolha de
baixo para cima, então o motor **não** promete descartar a segunda — e a
interface repete o que o motor afirma, sem arredondar para cima.

### Virose não é ausência de manejo

Nenhum defensivo age sobre o vírus dentro da planta. Mas geminivírus é
transmitido pela mosca-branca, e a ficha traz inseticidas com ação declarada
**(vetor)** — controla-se quem transmite. Já o mosaico, de transmissão mecânica,
tem lista de ingredientes vazia e manejo inteiramente cultural. A distinção está
no dado, não numa regra genérica sobre viroses.

---

## O banco de dados

O modelo relacional está em [`docs/modelo-de-dados.md`](docs/modelo-de-dados.md)
e o DDL em [`migracoes/`](migracoes/), numerado e com par de reversão.

O catálogo agronômico é **carregado**, nunca escrito à mão: ninguém digita um
`INSERT` de doença. As tabelas que justificam o banco são as outras — as
transacionais, multiusuário, que produzem junções sem equivalente no cliente:

- `usuario`, `horta`, `membro_horta`, `canteiro` — a área cultivada coletivamente
- `consulta`, `consulta_sintoma`, `consulta_hipotese` — o histórico do diagnóstico
- `feedback`, `manejo`, `anotacao` — o laço *diagnosticou → interveio → confirmou*

Duas decisões que valem destaque:

**`offline_id` com restrição de unicidade.** Cada consulta nasce no aparelho com
um identificador próprio. Reenviar a fila de sincronização é o caso normal, não
a exceção — e a garantia de não duplicar mora no banco, não só no código.

**`versao_catalogo` gravada em cada consulta.** Um diagnóstico feito com a base
v1 e reinterpretado com a v3 é reprodutivelmente diferente. Guardar a versão é o
que torna o histórico auditável quando a curadoria avança.

---

## A foto, do sensor ao laudo

```
câmera (resolução nativa)
  → preprocessamento.ts   redimensiona e normaliza IGUAL ao treino
  → classificador.ts      logits crus                        ⬜ falta o modelo
  → recusa.ts             decide sobre os LOGITS CRUS
  → laudo
```

Tudo isso já roda, menos a caixa marcada.

### Pré-processamento é código do projeto, não `transforms.Resize`

O tensor que o modelo recebe em campo tem que ser **idêntico** ao que ele viu no
treino. Se o app redimensiona de um jeito e o treino de outro, o modelo responde
com a mesma confiança de sempre sobre uma imagem que nunca viu — e a perda de
acurácia some dentro de um número que continua parecendo bom.

O `drawImage` do navegador não serve: ele não redimensiona igual ao PIL nem
igual a si mesmo entre navegadores. Havia duas saídas — reproduzir o PIL bit a
bit em TypeScript, ou definir o algoritmo aqui e mandar o treino usar este. A
primeira acorrentaria o projeto a detalhes internos do PIL. Escolhemos a
segunda, e ela está em `data/contrato_visao.json`.

O algoritmo mora em `app/preprocessamento.py`, é portado em
`web/lib/preprocessamento.ts`, e os dois são comparados por **digest SHA-256 do
tensor float32** sobre imagens geradas por fórmula — nenhuma imagem binária no
repositório. Sete casos, cobrindo ampliação, redução, retrato, paisagem e
tamanhos ímpares. Um único valor diferente no último bit muda o digest.

É um filtro triangular com suporte escalado. Quando a imagem diminui, a janela
do filtro cresce junto: é isso que impede que reduzir uma folha com nervuras
finas produza faixas de moiré que não existem na planta, e que o modelo
classificaria como textura. Os testes provam os dois lados: listras de 1 px
reduzidas viram cinza (desvio 0,06), e ampliadas mantêm o contraste (1,26).

### A recusa vai sobre os logits crus, e isso não é detalhe

Restringir a saída às classes de uma cultura e renormalizar **destrói** a
confiança como sinal de fora-da-distribuição. Renormalizar sobre quatro classes
dá à líder um piso de 25% por pior que seja a foto — e esse piso mede como o
modelo divide a cultura, não o quanto ele reconheceu a imagem. Com uma classe
só, o piso é **100%**: qualquer imagem sai com confiança total.

Por isso `recusa.ts` recebe os logits crus e calcula três pontuações que falham
de formas diferentes: MSP (satura em modelos confiantes), energia livre (não
satura) e margem entre o primeiro e o segundo (pega hesitação entre classes
plausíveis, que é diferente de não reconhecer nada). E por isso o contrato exige
que o modelo exporte **logits, nunca softmax** — com o softmax dentro do grafo,
temperatura e energia ficam impossíveis de calcular no cliente.

**Os limiares estão nulos**, de propósito. Eles saem da curva risco-cobertura
medida sobre imagens de validação; chutar um número daria ao produtor uma recusa
que não significa nada. Até lá o app calcula as pontuações e declara que não
está calibrado.

### O modelo é um buraco com forma

`classificador.ts` é uma interface, não um runtime. Hoje devolve `null`, o app
diz o que falta e oferece o fluxo por sintomas — não é erro, é o estado previsto
do produto. Quando houver um ONNX, ele carrega a própria lista de classes e o
carregador recusa rodar se ela não bater com o acervo declarado: o cenário
provável neste app é o service worker servir um modelo antigo junto de um bundle
novo, e nesse caso os dois carregam, a inferência roda, cada índice aponta para
a doença errada e nenhuma tela quebra.

---

## Sistema de design — "ferramenta de campo"

O contexto de uso dita o visual: sol a pino, mão suja, talvez luva, pressa.

| Decisão | Razão |
|---|---|
| Fundo branco puro | máximo brilho reflexivo sob sol direto |
| Texto `#1C1917` — contraste 17.9:1 | muito acima do mínimo AAA |
| Bordas sólidas de 2px, sem sombras | sombra desaparece na luz do sol |
| Corpo de 18px | acima do padrão web de 16px |
| Alvo de toque de 56px | acima dos 44px de guideline, por causa de luva |
| Tema claro fixo | um app de campo não herda o modo escuro do sistema |

Gravidade nunca depende só de cor: barra preenchida + escala cromática + rótulo
textual, para continuar legível por quem não distingue as cores.

---

## Roteiro

| Entrega | Estado |
|---|---|
| Base curada, motor por sintomas, CLI | ✅ |
| PWA instalável, sistema de design, telas | ✅ |
| Motor portado para TS com paridade exata | ✅ |
| Câmera, pré-processamento com paridade de pixel, recusa | ✅ |
| Modelo de dados relacional e DDL versionado | ✅ |
| API + PostgreSQL: conta, histórico, sincronização offline | ✅ |
| Curadoria por família: brássicas, solanáceas, cucurbitáceas… | 🔄 3 de 24 culturas |
| Horta, canteiros, manejo e relatórios agregados | ⬜ tabelas prontas, rotas e telas não |
| Identificação por imagem — condicionada à auditoria do acervo | ⬜ falta o modelo |

A identificação por foto é **escopo condicionado**: depende de um acervo de
imagens de hortaliças brasileiras com volume suficiente por classe, ainda não
verificado. O candidato é o [repositório
Digipathos](https://www.digipathos-rep.cnptia.embrapa.br/) da Embrapa. O produto
está completo e utilizável sem ela — o fluxo por sintomas é o produto, a câmera
é enriquecimento.

---

## Aviso legal

Sistema **educativo e de apoio à decisão**. Não substitui a avaliação de um
engenheiro agrônomo.

No Brasil, a aquisição e a aplicação de defensivos agrícolas exigem
**receituário agronômico**. Os ingredientes ativos citados são referência
técnica; o registro válido para cada combinação de cultura, praga e região deve
ser conferido no **AGROFIT/MAPA**.

---

## Estrutura

```
data/base_conhecimento.json         fonte da verdade - conteúdo agronômico curado
data/contrato_visao.json            contrato de pixel e de recusa, curado
migracoes/                          DDL do PostgreSQL, numerado e reversível
docs/                               documento de software e modelo de dados
api/index.py                        ponto de entrada da função Python da Vercel
app/                                Python: motor, validação e back-end
  catalogo.py                       a base curada em memória, sem banco
  validacao.py                      recusa base incoerente antes de qualquer carga
  diagnostico.py                    motor - regra pura, sem I/O
  seed.py                           migrações + carga do catálogo no PostgreSQL
  api/                              FastAPI: rotas, esquemas e conexão
  fixtures.py                       gera o contrato compartilhado com o TS
  preprocessamento.py               referência de pixel: resize, crop, normalize
  cli.py                            diagnóstico interativo no terminal
tests/
  test_diagnostico.py               testes do motor de referência
  test_preprocessamento.py          filtro, antisserrilhamento, contrato de pixel
  fixtures/                         entrada + saída esperada, versionadas
web/                                Next.js 16 · TypeScript · Tailwind 4 · PWA
  app/                              rotas (App Router)
  components/                       UI do sistema de design
  lib/
    diagnostico.ts                  porte do motor - roda no navegador
    diagnostico.test.ts             paridade com o Python, via fixtures
    preprocessamento.ts             porte do resize/normalize, paridade por digest
    recusa.ts                       MSP, energia e margem sobre os logits crus
    classificador.ts                a costura do modelo - hoje devolve null
    diagnostico-por-imagem.ts       orquestra foto → laudo
    base-conhecimento.ts            gerado do JSON por `npm run base`
    contrato-visao.ts               gerado do contrato de visão
  components/Camera.tsx             getUserMedia, visor e captura em resolução nativa
  public/sw.js                      service worker escrito à mão
  scripts/gerar-base.mjs            JSON curados → módulos TS embutidos no bundle
```

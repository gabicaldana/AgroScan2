# Auditoria do acervo Digipathos (US38)

**Issue:** [#43](https://github.com/CampusCEUB/AgroScan/issues/43) - US38, auditar o acervo Digipathos.
**Data da consulta:** 09/11/2026.
**Pergunta:** o acervo sustenta a identificação de doença por foto (US39) para as
hortaliças da base, dentro do semestre que termina em 27/11/2026?
**Resposta curta:** não. O acervo cobre **1 das 24 culturas** da base (couve), com
**1 doença** que coincide com as fichas (alternariose), e essa classe vem de
**4 fotos de folhas destacadas, sobre fundo branco**. A licença permite uso não
comercial com atribuição, mas não resolve o problema, que é de cobertura.

---

## 1. O que foi consultado

| Fonte | Como | O que se obteve |
| --- | --- | --- |
| `https://www.digipathos-rep.cnptia.embrapa.br/` | `curl` | O endereço **redireciona** para o Redape, o repositório de dados da Embrapa: `https://www.redape.dados.embrapa.br/dataset.xhtml?persistentId=doi:10.48432/XA1OVL` |
| API do Dataverse do Redape: `/api/datasets/:persistentId/?persistentId=doi:10.48432/XA1OVL` | `curl` | Metadados completos, licença declarada e a lista dos 278 arquivos do conjunto |
| Arquivos do conjunto: `/api/access/datafile/{id}` | `curl` | Download, **sem cadastro**, dos 5 zips de couve, dos 4 zips de meloeiro, do termo de uso (PDF), do arquivo de citação e da lista de autores |
| Conteúdo dos zips | `unzip -l` e leitura das dimensões das imagens | Contagem de imagens por classe, tamanho dos recortes, inspeção visual de amostras |
| Licença do Redape: `https://www.redape.dados.embrapa.br/licenses/embrapa-by-nc-4.0.xhtml` | `curl` | Texto da licença |
| Artigo de referência (PDF no repositório Alice da Embrapa): `https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1094883/1/16TLA627GarciaArnalBarbedo.pdf` | `curl` + `pdftotext` | Tabela I (imagens por planta e desordem), proporção campo × laboratório, método de recorte |
| PlantVillage: `github.com/spMohanty/PlantVillage-Dataset` (API do GitHub), artigo de Mohanty et al. 2016 (PMC5032846), catálogo do TensorFlow Datasets | API do GitHub e leitura das páginas | Contagem por classe das hortaliças, condições de captura, licença declarada |
| PlantDoc: `github.com/pratikkayal/PlantDoc-Dataset` | leitura da página | Volume, licença, origem das imagens |

Os arquivos baixados ficaram fora do repositório, numa pasta temporária. Nada
foi alterado no projeto.

---

## 2. O que é o Digipathos

- **Nome no repositório:** *Base de Imagens de Sintomas de Doenças de Plantas PDDB*
  (em inglês, *Image Database of Plant Disease Symptoms PDDB*). DOI do conjunto:
  [10.48432/XA1OVL](https://doi.org/10.48432/XA1OVL).
- **Instituição:** Embrapa. O termo de uso nomeia a Embrapa Informática
  Agropecuária (hoje Embrapa Agricultura Digital) como mantenedora. Os autores
  vêm de 15 unidades da Embrapa e do Instituto Biológico. Financiamento declarado:
  FAPESP 13/06884-8.
- **Publicação de referência (conferida no PDF):** BARBEDO, J. G. A. et al.
  *Annotated plant pathology databases for image-based detection and recognition
  of diseases.* IEEE Latin America Transactions, v. 16, n. 6, p. 1749-1757, jun.
  2018. DOI [10.1109/TLA.2018.8444395](https://doi.org/10.1109/TLA.2018.8444395).
- **Duas bases:**
  - **PDDB**, as fotos originais: **2.326 imagens de 171 doenças e outras
    desordens em 21 espécies de plantas** (posição de outubro de 2016, segundo o
    artigo). Dessas, **715 foram capturadas em campo e 1.611 sob condições
    controladas** (caixa de papelão como câmara escura e cartão de calibração de
    cor).
  - **XDB**, os recortes: as fotos de folha, já **com o fundo removido à mão**,
    foram subdivididas em lesões ou regiões de sintoma, chegando a **46.513
    imagens**. Folhas sadias e fotos com mais de uma doença não foram recortadas.
- **Formato e download:** no Redape, versão 1.0, publicada em 30/07/2024. São
  **270 arquivos zip** (um por par planta/desordem, e um segundo zip `Cropped`
  para o recorte XDB quando existe, 93 deles), somando **8,32 GB**. Nenhum
  arquivo é restrito, e o download pela API funcionou sem login. O artigo de 2018
  dizia que o acesso exigia cadastro; isso não vale mais.
- **Período de coleta declarado:** 01/08/2013 a 31/12/2018.

---

## 3. Inventário

### 3.1 As 21 espécies do acervo

Abacaxi, algodão, arroz, café, cajueiro, cana, citros, coqueiro, **couve**,
cupuaçu, feijão, mamão, mandioca, maracujá, **meloeiro**, milho, palma de óleo,
pimenta-do-reino, soja, trigo e videira.

São quase todas **culturas de lavoura ou frutíferas**. As únicas hortaliças são
a **couve** e o **meloeiro**, e o meloeiro não está na base do AgroScan.
*Pimenta-do-reino* (*Piper nigrum*) não é pimentão, e *feijão* não é hortaliça
da base.

O próprio artigo deixa a desproporção explícita: na contagem por parte da
planta, *Kale* (couve) tem **8** fotos de folha, contra 471 da soja e 244 do
coqueiro.

### 3.2 Contagem conferida das classes de hortaliça

Contagem feita nos zips baixados, e não só na tabela do artigo. As duas fontes
batem.

| Espécie no acervo | Classe | Agente (Tabela I) | Fotos originais (PDDB) | Recortes (XDB) | Condição de captura (inspeção das fotos) |
| --- | --- | --- | --- | --- | --- |
| Couve (*Brassica oleracea*) | Mancha de alternária | *Alternaria brassicicola* | **4** | 133 | Folha destacada sobre papel branco |
| Couve | Oídio | *Erysiphe polygoni* | **3** | 63 | Folha destacada sobre o cartão de calibração |
| Couve | Sadia | - | **1** | - | Folha destacada sobre o cartão de calibração |
| Meloeiro (*Cucumis melo*) | Oídio | *Podosphaera xanthii* | **5** | 148 | Planta em vaso, ambiente de viveiro |
| Meloeiro | Mancha-aquosa | *Acidovorax avenae* | 2 | - | Não inspecionada |
| Meloeiro | Mosaico | vírus do mosaico | 1 | 1 no artigo, sem zip `Cropped` no Redape | Não inspecionada |
| Meloeiro | Nematoide | *Meloidogyne incognita* | 1 | - | Não inspecionada |

Sobre os recortes, três fatos pesam:

1. **Não são independentes.** Os 133 recortes de alternária saem de 4 folhas;
   os 63 de oídio, de 3. Para o treino, a amostra efetiva é de 4 e 3 folhas, e
   qualquer divisão treino/validação que não separe por folha de origem vaza
   informação e infla a acurácia.
2. **São pequenos.** Nos recortes de alternária da couve, a largura média é de
   111 px, e só **13 de 133** têm o lado menor ≥ 224 px, a entrada do contrato
   (`contrato_visao.json`). No oídio, 15 de 63. O resto teria de ser ampliado.
3. **Não se parecem com a foto do app.** O recorte é uma lesão isolada, sem
   fundo. A câmera do AgroScan fotografa a planta inteira ou a folha presa, no
   canteiro, sob sol.

### 3.3 Cruzamento com a base do AgroScan

A auditoria começou sobre a base `2026.10.24`, com 13 culturas e 53 doenças, e
foi conferida também contra a base completa, `2026.11.09`, com 24 culturas e 88
doenças. Para as 11 culturas que a base completa acrescenta (berinjela, quiabo,
alface, espinafre, salsa, alho-poró, aipo, cenoura, cebola, beterraba e alho),
o acervo **não tem nenhuma imagem**, e isso está conferido na lista completa de
arquivos.

| Cultura da base | Doenças das fichas | Classe correspondente no Digipathos | Fotos originais | Recortes |
| --- | --- | --- | --- | --- |
| **Couve** | Míldio | - | 0 | 0 |
| | **Alternariose** | Mancha de alternária (*A. brassicicola*) | **4** | **133** |
| | Podridão-negra | - | 0 | 0 |
| *(couve, fora da ficha)* | *Oídio, que não está na ficha da couve* | Oídio (*E. polygoni*) | 3 | 63 |
| Repolho, brócolis, couve-flor | Podridão-negra, alternariose, míldio, hérnia | Não há classe para essas variedades. A alternária da couve seria um substituto entre variedades de *B. oleracea*, não verificado | 0 | 0 |
| Rúcula | Míldio, alternariose, oídio (*E. cruciferarum*) | - | 0 | 0 |
| Abóbora, abobrinha, pepino | Oídio (*P. xanthii*) e outras | Só existe o oídio do **meloeiro**, mesmo agente, outra espécie. Seria um substituto entre espécies, não verificado | 0 | 0 (148 do meloeiro) |
| Tomate | 10 doenças | - | 0 | 0 |
| Pimentão | 3 doenças | - | 0 | 0 |
| Batata | 3 doenças | - | 0 | 0 |
| Jiló | 5 doenças | - | 0 | 0 |
| Agrião | 3 doenças | - | 0 | 0 |
| As 11 culturas da base completa | 35 doenças | - | 0 | 0 |

**Saldo:** dos **88 pares cultura × doença** da base completa, **1** tem
imagens no Digipathos (couve × alternariose), com 4 fotos.

---

## 4. Licença

Há **dois textos**, e os dois apontam na mesma direção.

**(a) Licença declarada no registro do conjunto:** *"Embrapa (CC BY-NC 4.0)"*,
URL `https://www.redape.dados.embrapa.br/licenses/embrapa-by-nc-4.0.xhtml`.
Trecho da página:

> "This work is licensed under a Creative Commons Attribution-NonCommercial 4.0
> International License."
>
> "Os dados de pesquisa serão compartilhados de acordo com a licença de uso
> pública padrão, Creative Commons CC BY NC. Essa licença permite que os dados
> publicados sejam utilizados para fins não-comerciais desde que seja atribuído
> o devido crédito ao(s) autor(es) e proprietário(s)."
>
> "São proibidas reproduções, armazenamentos, transmissões, cópias,
> distribuições ou quaisquer outras formas de utilização para fins comerciais
> dos conteúdos do Redape, salvo quando expressamente autorizado pela Embrapa."

**(b) Termo de uso específico do acervo**, arquivo `PDDB-Termo_de_uso.pdf`,
distribuído junto com os dados:

> "A Embrapa: é detentora dos direitos de propriedade intelectual relativos ao
> conteúdo contido na base (imagens e rótulos), conforme estabelece a Lei de
> Direitos Autorais nº 9.610 [...]"
>
> "São proibidas reproduções, armazenamentos, transmissões, cópias,
> distribuições ou quaisquer outras formas de utilização para fins comerciais
> dos conteúdos da PDDB, salvo quando expressamente autorizado pela Embrapa."
>
> "Em caso de publicação dos resultados obtidos utilizando a PDDB, esta deverá
> ser referenciada da seguinte forma: BARBEDO, J. G. A.; KOENIGKAN, L. V.;
> SANTOS, T. T. Identifying multiple plant diseases using digital image
> processing. Biosystems Engineering, v. 147, p. 104-116, July 2016."

O artigo de 2018 diz o mesmo: o conteúdo "pode ser usado livremente no contexto
acadêmico, desde que sem objetivos comerciais".

**Leitura para o AgroScan:**

| Pergunta | Resposta | Confiança |
| --- | --- | --- |
| Pode treinar um modelo? | Sim, para fim não comercial. O AgroScan é projeto acadêmico, gratuito e sem receita | Alta |
| Exige atribuição? | Sim, aos autores e à Embrapa. Há uma **inconsistência na citação exigida**: o termo do PDF pede o artigo de 2016 (*Biosystems Engineering*), enquanto o `como-citar.txt` e o registro pedem o de 2018 (*IEEE LAT*). Se o acervo for usado, citar os dois | Alta |
| Pode distribuir o modelo embarcado num app público? | **Não confirmado.** A CC BY-NC 4.0 permite compartilhar material adaptado para fim não comercial, com atribuição. Se os pesos de um modelo contam como "material adaptado" é questão jurídica em aberto, e nenhum dos dois textos trata de modelos. Para uso não comercial e com atribuição, o risco é baixo, mas não é zero | Média |
| E se o app vier a ter uso comercial (parceria, venda)? | Exige autorização expressa da Embrapa (canal indicado no termo: SAC, `https://www.embrapa.br/fale-conosco/sac/`) | Alta |

A licença **não é o impedimento**. O impedimento é a cobertura.

---

## 5. Viabilidade

### 5.1 O piso de imagens por classe

O piso adotado é de **≥ 100 imagens independentes por classe**, entendidas como
fotos de folhas ou plantas distintas, e não recortes da mesma folha. A
justificativa vem das restrições do próprio projeto, e não de um número da
literatura:

- O contrato de visão e o ADR 0006 exigem que os limiares de recusa saiam da
  **curva risco-cobertura medida em validação**. Com 100 imagens e divisão 80/20,
  sobram 20 imagens de validação por classe, o mínimo para a curva ter mais de um
  punhado de pontos por classe. Abaixo disso, o limiar seria chute, e o ADR 0006
  proíbe chute.
- Com transferência de aprendizado (rede pré-treinada no ImageNet, coerente com a
  normalização do contrato), dezenas de imagens por classe costumam bastar para
  *treinar* a cabeça classificadora. O gargalo é *validar* e *calibrar*, e é isso
  que define o piso.
- É um piso **generoso**. O próprio artigo do Digipathos relata que, nos testes
  com *deep learning*, "apenas doenças contendo mais de 10 representantes poderiam
  ser consideradas". As classes da couve têm 4 e 3. **Não passam nem no piso dos
  autores.**

### 5.2 Classes de hortaliça da base que passam no piso

| Critério | Classes |
| --- | --- |
| ≥ 100 fotos originais independentes | **0** |
| ≥ 10 fotos originais (o piso dos autores) | **0** |
| ≥ 100 recortes, mesmo dependentes | **1**: couve × alternariose (133 recortes de 4 folhas) |

Um classificador precisa de pelo menos duas classes por cultura. Com uma doença
e uma folha sadia na couve, o modelo não teria como distinguir o que a ficha
distingue (míldio, alternariose, podridão-negra).

### 5.3 Viés laboratório × campo

- No acervo inteiro, **69% das fotos (1.611 de 2.326) são de condição
  controlada**.
- Nas classes que interessam, as fotos de couve inspecionadas são **folhas
  destacadas sobre papel branco ou sobre o cartão de calibração**. Os recortes
  XDB tiveram o fundo removido à mão.
- O app fotografa no canteiro, sob sol, com solo, outras folhas e sombra ao
  fundo. É exatamente a situação em que modelos treinados em laboratório
  despencam. A referência mais citada é o PlantVillage: **99,35%** de acurácia no
  teste interno e **31,4%** em imagens de fontes externas (Mohanty, Hughes e
  Salathé, 2016).

### 5.4 Prazo

Hoje é 09/11/2026, e o semestre fecha em 27/11/2026: **18 dias**. A US39 está
estimada em 13 pontos e planejada para a Sprint 7 (24/11 a 07/12), que começa a
3 dias do fim do semestre. O contrato de treino exige pré-processamento com
paridade de *digest*, export de logits, classes no `metadata_props`, limiares
calibrados e **métricas em validação externa**. Mesmo com um acervo adequado,
não cabe com o rigor que o próprio projeto se impôs. Com o Digipathos, não há
nem o que treinar.

### 5.5 Alternativas, em resumo

| Acervo | Cobertura de hortaliças da base (conferida) | Condição | Licença | Veredito |
| --- | --- | --- | --- | --- |
| **Digipathos / PDDB** | Couve × alternariose, 4 fotos | Majoritariamente laboratório | CC BY-NC 4.0 + termo Embrapa (não comercial, atribuição) | Insuficiente |
| **PlantVillage** | **Tomate:** mancha-bacteriana 2.127, pinta-preta 1.000, requeima 1.909, mofo-de-folha 952, septoriose 1.771, ácaro-rajado 1.676, mancha-alvo 1.404, mosaico 373, *yellow leaf curl* 5.357, sadio 1.591. **Pimentão:** mancha-bacteriana 997, sadio 1.478. **Batata:** pinta-preta 1.000, requeima 1.000, sadia 152. **Abóbora (squash, espécie não informada):** oídio 1.835. (Pasta `raw/color` do repositório no GitHub, contada pela API) | Laboratório: folha única, virada para cima, sobre fundo homogêneo, "sob condições controladas" (Mohanty et al., 2016) | **Não está clara.** O repositório no GitHub não tem arquivo de licença. O cartão do Hugging Face no mesmo repositório (`README_HF.md`) declara `cc-by-sa-3.0`. A cópia no Mendeley usada pelo TensorFlow Datasets (`tywbtsjrjv/1`, republicação por terceiros, com aumento de dados) declara CC0 1.0. A origem (plantvillage.org) não está mais disponível, segundo o TFDS | Volume suficiente para tomate (9 das 10 doenças da ficha; falta o oídio), pimentão, batata e oídio de cucurbitácea. Mas o viés de laboratório é documentado (31,4% fora do acervo), e a licença precisa de esclarecimento |
| **PlantDoc** | Não conferida classe a classe | Imagens da internet, cenas reais | CC BY 4.0 (declarada no repositório) | 2.598 imagens, 13 espécies e até 17 classes no total. Útil, no máximo, como **validação externa** de um modelo treinado no PlantVillage, não como acervo de treino |

Duas ressalvas sobre o PlantVillage:

- O *yellow leaf curl* é o TYLCV, um begomovírus. A ficha "Geminivirose" do
  tomate cobre begomovírus transmitidos por mosca-branca. Se o sintoma do vírus
  que predomina no Brasil corresponde ao do TYLCV, isso não foi verificado nesta
  auditoria.
- Nenhum dos três acervos oferece **fotos de campo de hortaliças brasileiras em
  volume** para calibrar a recusa.

---

## 6. Conclusão

1. **Inventário:** 21 espécies, 171 desordens, 2.326 fotos originais e 46.513
   recortes. Hortaliças da base: **só a couve**, com 4 fotos de alternariose, 3
   de oídio (fora da ficha) e 1 sadia.
2. **Licença:** CC BY-NC 4.0, mais o termo de uso da Embrapa: uso não comercial
   com atribuição. Compatível com o AgroScan acadêmico. A distribuição de pesos
   treinados não é tratada explicitamente.
3. **Viabilidade:** **não viável neste semestre** com o Digipathos. Nenhuma
   classe passa no piso, o viés é de laboratório e faltam 18 dias. O PlantVillage
   cobriria o tomate em volume, mas com viés de laboratório documentado e licença
   ambígua, e sem imagens de campo para calibrar a recusa que os ADRs 0006 e 0008
   exigem.

A decisão está proposta no ADR 0015.

---

## 7. Fontes

- Registro do conjunto no Redape: https://doi.org/10.48432/XA1OVL (consultado em 09/11/2026)
- API do Dataverse: https://www.redape.dados.embrapa.br/api/datasets/:persistentId/?persistentId=doi:10.48432/XA1OVL
- Licença Redape: https://www.redape.dados.embrapa.br/licenses/embrapa-by-nc-4.0.xhtml
- Termo de uso da PDDB: arquivo `PDDB-Termo_de_uso.pdf` (fileId 5932) do conjunto acima
- BARBEDO, J. G. A. et al. Annotated plant pathology databases for image-based detection and recognition of diseases. IEEE Latin America Transactions, v. 16, n. 6, p. 1749-1757, 2018. https://doi.org/10.1109/TLA.2018.8444395. PDF: https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1094883/1/16TLA627GarciaArnalBarbedo.pdf
- MOHANTY, S. P.; HUGHES, D. P.; SALATHÉ, M. Using Deep Learning for Image-Based Plant Disease Detection. Frontiers in Plant Science, 2016. https://doi.org/10.3389/fpls.2016.01419 (texto em https://pmc.ncbi.nlm.nih.gov/articles/PMC5032846/)
- HUGHES, D. P.; SALATHÉ, M. An open access repository of images on plant health... arXiv:1511.08060, 2015. https://arxiv.org/abs/1511.08060
- Repositório PlantVillage: https://github.com/spMohanty/PlantVillage-Dataset (contagem pela API do GitHub, pasta `raw/color`)
- TensorFlow Datasets, `plant_village`: https://www.tensorflow.org/datasets/catalog/plant_village
- Mendeley Data, `tywbtsjrjv/1`: https://data.mendeley.com/datasets/tywbtsjrjv/1
- PlantDoc: https://github.com/pratikkayal/PlantDoc-Dataset

**Não confirmado nesta auditoria:** a contagem por classe do PlantDoc; a
correspondência visual entre o TYLCV e os begomovírus brasileiros; o
entendimento da Embrapa sobre distribuir pesos de modelo treinados com a PDDB; a
condição de captura das classes de meloeiro além do oídio.

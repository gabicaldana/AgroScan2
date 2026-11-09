# Curadoria das famílias restantes: a base completa

Curadoria da US05 ([#8](https://github.com/CampusCEUB/AgroScan/issues/8)),
feita em **09/11/2026**, na Sprint 5. A base passa para a versão `2026.11.09`,
com onze culturas e 35 doenças novas: de 13 para **24 culturas** e de 53 para
**88 doenças**, a meta do épico E1. Com as 24 culturas, a US01
([#4](https://github.com/CampusCEUB/AgroScan/issues/4)) também cumpre o último
critério.

| Família | Culturas | Doenças | Seção |
| --- | --- | --- | --- |
| Solanaceae | berinjela | 3 | [Berinjela](#berinjela-solanaceae) |
| Asteraceae e Malvaceae | alface, quiabo | 4 + 3 | [Alface e quiabo](#alface-asteraceae-e-quiabo-malvaceae) |
| Amaranthaceae | beterraba, espinafre | 3 + 3 | [Beterraba e espinafre](#amaranthaceae-beterraba-e-espinafre) |
| Amaryllidaceae | cebola, alho, alho-poró | 4 + 3 + 3 | [Amarilidáceas](#curadoria-das-amarilidáceas-cebola-alho-e-alho-poró) |
| Apiaceae | cenoura, salsa, aipo | 3 + 3 + 3 | [Apiáceas](#apiáceas-cenoura-salsa-e-aipo) |

O método é o das [cucurbitáceas](curadoria-cucurbitaceas-e-jilo.md). Cada
ficha parte de uma publicação técnica que trata daquela doença. Os
ingredientes ativos foram conferidos, cultura a cultura e alvo a alvo, nos
**dados abertos do AGROFIT**, baixados em 09/11/2026, e só entram registros
ativos. Cada família tem a própria lista de fontes, com prefixo próprio: E
para a berinjela, D para alface e quiabo, C para as amarantáceas, B para as
amarilidáceas e A para as apiáceas.

A conferência final, feita sobre a base já unida, cruzou cada ingrediente
citado com o registro ativo naquela cultura. Cinco nomes não bateram de
primeira, e nos cinco era só a grafia do AGROFIT: mandipropamid,
pidiflumetofen (registrado só em mistura com difenoconazol, no alho-poró),
fluopyram e fluazaindolizine. Todos têm registro para o alvo da ficha.

## O que mudou ao unir as famílias

1. **Um sintoma de mofo-branco, não três.** Três curadorias criaram o mesmo
   sinal com ids diferentes: `micelio_branco_com_esclerodios` (alface),
   `mofo_branco_com_esclerodios` (alho) e `mofo_branco_com_escleroides` (salsa
   e aipo). Ficou um só, `mofo_branco_com_esclerodios`, "Mofo branco, como
   algodão, com grãos duros e escuros (escleródios)", no órgão `planta`,
   porque aparece no colo, na haste ou no bulbo, conforme a cultura. As
   seções abaixo já usam o id unificado.
2. **Emojis.** O 🫜 (beterraba, Unicode 16) e o 🫛 (quiabo, Unicode 15)
   aparecem como um quadrado em celulares mais antigos, que são os de boa
   parte do público. Os dois ficaram 🌱, como o alho-poró. O nome da cultura
   vem sempre ao lado.
3. **O catálogo passa de 38 para 56 sintomas.** Os perfis das 53 doenças
   anteriores não mudaram: os 122 casos anteriores das fixtures de paridade
   continuam idênticos, e entram 70 casos novos (192 no total).

## Onde a fonte é mais fraca

Três culturas não têm publicação técnica brasileira que descreva as doenças,
e isso está dito na seção de cada uma:

- **Espinafre** (*Spinacia oleracea*): as fichas se apoiam no guia de manejo
  da Universidade da Califórnia. A única fonte brasileira é o primeiro relato
  do mosaico (CMV) no país.
- **Aipo**: a cercosporiose e a septoriose também se apoiam no guia da
  Universidade da Califórnia. O mofo-branco tem fonte brasileira própria.
- **Alho-poró**: a única fonte brasileira é um ensaio de uma safra em Santa
  Catarina, e o manejo vem das fontes de cebola e alho, que citam o alho-poró
  como hospedeiro.

Essas fichas são as primeiras candidatas à revisão quando houver validação
com produtores.

## Carga no banco de produção

A versão `2026.11.09` precisa ser carregada no Neon **antes** de o app
publicado passar a usá-la. Não há migração nova: os tipos de agente usados
(fungo, oomiceto, bactéria, vírus, nematoide) já existem, e o id `alho_poro`
usa o sublinhado que a migração 003 já aceita.

```powershell
cd src
python -m app.seed --gerar-sql --desde-migracao 4 --separar
```

---

## Berinjela (Solanaceae)

Curadoria feita em **09/11/2026**. Entra uma cultura, a berinjela
(*Solanum melongena*, família `Solanaceae`), com três doenças. Cada ficha parte
de uma publicação técnica que trata daquela doença na berinjela, e os
ingredientes ativos foram conferidos contra os dados abertos do AGROFIT [E4].
Nenhuma ficha cita ingrediente sem registro para aquele alvo na berinjela.

A berinjela é uma solanácea, como tomate, batata, pimentão e jiló: para o
alerta de rotação (US30), plantar berinjela depois de qualquer uma delas é
repetir a família.

### Doenças e fontes

| Doença | Agente | Gravidade | Fonte principal | Apoio |
| --- | --- | --- | --- | --- |
| Podridão-de-fomopsis | *Phomopsis vexans* (fase sexuada *Diaporthe vexans*) | 4 | E1 | E3 |
| Antracnose da berinjela | *Colletotrichum gloeosporioides* e outras espécies | 4 | E1 | E2 |
| Murcha-de-verticílio | *Verticillium dahliae* | 4 | E1 | - |

A circular de doenças da berinjela [E1] é a única publicação da Embrapa
Hortaliças que trata da cultura inteira, e sustenta as três fichas. A antracnose
nas solanáceas [E2] é a mesma circular que já serviu ao jiló (F7 da curadoria
das cucurbitáceas e do jiló) e traz a parte própria da berinjela. A dissertação
de 2024 [E3], orientada na Embrapa Hortaliças, completa a fomopsis com o
tamanho das manchas, a mumificação dos frutos e a temperatura ótima do fungo.

O ciclo ficou sem valor (`ciclo_dias` nulo): nenhuma das fontes dá o ciclo da
cultura.

#### Por que estas três

E1 apresenta a berinjela como cultura rústica, mais tolerante a doenças que
tomate, batata e pimentão, e destaca a murcha-de-verticílio como "uma das
principais doenças da berinjela no Brasil". A fomopsis e a antracnose são as
duas doenças de fruto para as quais a Embrapa lançou o híbrido Ciça, por
limitarem a produção na época chuvosa [E2, E3], e E3 chama a fomopsis de "uma
das principais doenças da berinjela presente nos principais polos produtores".

As três se separam pelos sintomas (ver abaixo), o que não aconteceria com a
murcha-bacteriana ao lado do verticílio: as duas dão murcha e vasos escuros, e
E1 as diferencia pelo teste do copo d'água e pela posição das folhas
murchas, sinais que o catálogo não tem.

#### Doenças da fonte que ficaram de fora

Murcha-bacteriana, *Phytophthora* (murcha, requeima e podridão de fruto),
podridão-de-esclerotínia, podridão-de-esclerócio, tombamento, ferrugem,
manchas de *Alternaria* e *Cercospora*, oídio, nematoide-das-galhas,
podridão-mole, vira-cabeça e cálice gigante [E1]. E1 dá a ferrugem, as manchas
foliares e o oídio como de importância secundária; o oídio, "ainda não é
considerada doença importante". Ficam para uma curadoria seguinte. A cultura já
tem três doenças, o mínimo da RN05.

### Sintomas

Nenhum sintoma novo. As três fichas usam só ids do catálogo:

| Doença | Sintomas (peso) |
| --- | --- |
| Podridão-de-fomopsis | `lesoes_no_fruto` 1,0; `lesoes_no_caule` 0,7; `manchas_escuras_aneis` 0,6; `pontuacoes_pretas_na_lesao` 0,6 |
| Antracnose | `lesoes_no_fruto` 1,0; `massa_rosada_na_lesao` 0,8 |
| Murcha-de-verticílio | `murcha` 1,0; `vasos_escurecidos` 0,8; `manchas_amareladas` 0,6; `lesao_em_v_na_borda` 0,6; `crescimento_reduzido` 0,5 |

Separação pelo motor (fórmula de `diagnosticar`):

- Só "lesões no fruto": antracnose 0,56, fomopsis 0,34. As duas começam assim
  no campo. O segundo sintoma decide: massa rosada leva à antracnose (1,00);
  lesão no caule, manchas em alvo na folha ou pontinhos pretos levam à fomopsis
  (fruto + caule: 0,59).
- Murcha, vasos escuros ou lesão em V só aparecem no verticílio; nenhuma das
  doenças de fruto tem sintoma de murcha no perfil.

### O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [E4] | Na ficha |
| --- | --- | --- | --- |
| Podridão-de-fomopsis | Fungicidas cúpricos registrados [E1]; "apenas quatro produtos cúpricos registrados" (AGROFIT 2023, citado em E3) | Confirmado, todos cúpricos. Quatro produtos para o alvo *Phomopsis vexans* (hidróxido de cobre, hidróxido + oxicloreto, sulfato de cobre, óxido cuproso) e mais quatro para *Diaporthe vexans*, o mesmo fungo na fase sexuada (oxicloreto de cobre, óxido cuproso) | Oxicloreto de cobre, hidróxido de cobre, óxido cuproso e sulfato de cobre |
| Antracnose | Fungicidas cúpricos [E1] | Confirmado, e muito mais: cerca de 40 produtos para *C. gloeosporioides* e *Colletotrichum* spp., entre cúpricos, mancozebe, tiofanato-metílico, azoxistrobina, flutriafol, captana, tiabendazol e misturas | Dois cúpricos, como pede a fonte, mais mancozebe, tiofanato-metílico e azoxistrobina para rodízio de grupo |
| Antracnose, biológico | Não citado [E1, E2] | Produtos de *Bacillus* registrados para *C. gloeosporioides* em "Todas as culturas" | Tratamento `biologico` genérico, sem ingrediente na lista |
| Murcha-de-verticílio | Sem cultivar resistente; só medidas preventivas [E1] | Confirmado: nenhum produto para *Verticillium* na berinjela, nem em "Todas as culturas" | Sem ingrediente ativo |

### Outras decisões

1. **Nome do alvo no AGROFIT.** O registro chama *Diaporthe vexans* de
   "Podridão-de-raiz; Queima". É o mesmo fungo da fomopsis (E3: *P. vexans* é a
   fase assexuada de *D. vexans*), e os produtos registrados para os dois nomes
   foram tomados como válidos para a ficha. O nome comum do registro não
   corresponde ao sintoma descrito pelas fontes.
2. **Pontinhos pretos fora da folha.** `pontuacoes_pretas_na_lesao` está no
   catálogo com órgão `folha`, mas o pimentão já o usa para o fruto. Na fomopsis,
   E1 descreve os picnídios na lesão do caule. Reaproveitar o id evitou um
   sintoma novo quase igual; a ressalva é que o produtor o verá agrupado "Na
   folha".
3. **Sintoma clássico do verticílio.** No jiló, a lesão em V tem peso 1,0. Na
   berinjela, E1 diz que a doença "começa com uma clorose das folhas mais baixas
   e murcha" e que as bordas "podem apresentar" o V. Por isso a murcha ficou com
   1,0 e o V com 0,6.
4. **Antracnose sem lesão no caule.** E1 e E2 dizem que folhas e ramos "são
   pouco afetados". Diferente do jiló (0,3), a lesão no caule ficou fora do
   perfil, o que também ajuda a separar a antracnose da fomopsis.
5. **Gravidade.** As três em 4. A antracnose não foi a 5, como no jiló, porque
   E2 diz que ela "teve sua importância reduzida" com as cultivares resistentes,
   embora atinja de 35% a 100% dos frutos em cultivar suscetível. A fomopsis
   reduz rendimento e comercialização em 20% a 70% [E3]. O verticílio é "uma
   das principais doenças" e pode matar a planta [E1].
6. **Híbrido Ciça.** Lançado como resistente à antracnose e à fomopsis [E2],
   mas E3 relata que ele e outras cultivares têm se mostrado suscetíveis à
   fomopsis em campo. A ficha da fomopsis registra a ressalva; a da antracnose
   mantém a indicação de E2.
7. **Agente da fomopsis.** E3 encontrou um complexo de fungos associados à
   podridão de Phomopsis no Brasil (*Boeremia*, *Stagonosporopsis*, outras
   *Diaporthe*), em primeiro relato. A ficha segue E1 e o registro no MAPA,
   com *P. vexans*, até que o complexo apareça em publicação de manejo.

### Fontes

Publicações acessadas em 09/11/2026. Os dados abertos do AGROFIT foram baixados
em 09/11/2026.

| # | Fonte |
| --- | --- |
| E1 | REIS, A.; BOITEUX, L. S.; LOPES, C. A. *Doenças da berinjela no Brasil*. Brasília, DF: Embrapa Hortaliças, 2011. 8 p. (Circular Técnica, 97). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/916695/1/CT97.pdf> |
| E2 | REIS, A.; BOITEUX, L. S.; HENZ, G. P. *Antracnose em hortaliças da família Solanaceae*. Brasília, DF: Embrapa Hortaliças, 2009. (Circular Técnica, 79). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/783049/1/ct79.pdf> (a mesma F7 da curadoria das cucurbitáceas e do jiló) |
| E3 | SILVA, B. A. *Desvendando a etiologia do complexo de doenças "Podridão de Phomopsis" da berinjela no Brasil e busca por fontes de resistência de amplo espectro em germoplasma de Solanum melongena L.* 2024. 100 f. Dissertação (Mestrado em Fitopatologia) - Universidade Federal Rural de Pernambuco, Recife, 2024. Orientador: Ailton Reis. <https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1172499/1/TS-CNPH-42186.pdf> |
| E4 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`. <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |

---

## Alface (Asteraceae) e quiabo (Malvaceae)

Curadoria feita em **09/11/2026**. Entram duas culturas e sete doenças: alface
com quatro e quiabo com três.

Cada ficha foi escrita a partir de uma publicação técnica da Embrapa Hortaliças
que trata daquela doença naquela cultura. Os ingredientes ativos foram
conferidos contra os dados abertos do AGROFIT [D5], baixados em 09/11/2026,
usando só linhas com situação ativa. Nenhuma ficha cita ingrediente sem
registro para aquele alvo naquela cultura. Os produtos biológicos registrados
para "Todas as culturas" aparecem só como tratamento `biologico`, e só quando o
alvo do registro é o patógeno ou o vetor da ficha.

### Culturas e doenças

| Cultura | Família | Doenças | Fonte principal |
| --- | --- | --- | --- |
| Alface (*Lactuca sativa*) | Asteraceae | míldio, septoriose, podridão-de-esclerotínia, vira-cabeça | D1, D2 |
| Quiabo (*Abelmoschus esculentus*) | Malvaceae | oídio, cercosporiose, nematoide-das-galhas | D3, D4 |

| Ficha | Fonte que a sustenta |
| --- | --- |
| `alface_mildio` | D1, p. 31-32 |
| `alface_septoriose` | D1, p. 33-34 |
| `alface_podridao_de_esclerotinia` | D1, p. 17-18 |
| `alface_vira_cabeca` | D2 (sintomas, epidemiologia, manejo), com D1, p. 46-47 |
| `quiabo_oidio` | D3, p. 5 |
| `quiabo_cercosporiose` | D3, p. 5-6, e medidas gerais, p. 10 |
| `quiabo_nematoide_das_galhas` | D4, com D3, p. 4-5 |

**Por que estas doenças.** Na alface, a tabela de importância relativa do livro
da Embrapa [D1, Tabela 1] dá grau máximo (+++) no campo a míldio, septoriose,
mancha-de-cercóspora, mosaico, vira-cabeça e podridão-de-esclerotínia (esta no
cultivo protegido e na aspersão). A circular do vira-cabeça [D2] aponta os
tospovírus e o LMV como os complexos virais que causam as maiores perdas, e o
vira-cabeça como doença em aumento de incidência entre 2011 e 2015, sem
cultivar resistente no mercado. No quiabo, o comunicado da Embrapa [D3] dá o
oídio como a doença mais comum e a cercosporiose como muito frequente na época
chuvosa; a circular de nematoides [D4] dá o nematoide-das-galhas como o
principal problema de solo, com todas as cultivares comerciais suscetíveis.

**Ciclo.** As duas culturas ficaram com `ciclo_dias` nulo. O livro da alface
[D1, Tabela 3] dá ciclo por cultivar, e não um ciclo da cultura; as fontes do
quiabo não dão ciclo.

#### Doenças das fontes que ficaram de fora

- **Alface:** mancha-de-cercóspora, mosaico (LMV), podridão-de-raiz por
  *Pythium*, murcha-de-fusário, tombamento, podridão-mole, oídio, mancha
  bacteriana e as demais viroses [D1]. A mancha-de-cercóspora é tão comum
  quanto a septoriose e é a principal doença foliar no Norte e no Nordeste
  [D1], e é a primeira candidata a uma próxima curadoria. Ficou de fora porque
  só uma linha do AGROFIT tem registro para *Cercospora longissima* na alface,
  e porque o vira-cabeça e o mosaico pesam mais na lista de quatro. O mosaico
  foi preterido pelo vira-cabeça: há cultivares resistentes ao LMV [D1,
  Tabela 3] e não há ao vira-cabeça [D2].
- **Quiabo:** murcha-de-fusário, murcha-de-verticílio, mancha-de-ascoquita,
  mancha-angular bacteriana, mosaico (*Abutilon mosaic virus*), tombamento e
  as podridões de pós-colheita [D3]. A murcha-de-fusário é "mais comum e
  destrutiva" que a de verticílio [D3] e é a primeira candidata a uma
  próxima curadoria.

### Sintomas novos no catálogo

O catálogo ganha quatro sintomas. Os ids e os nomes não citam a cultura, para
que as outras famílias possam reutilizá-los (podridão-de-esclerotínia em
feijão-vagem, tomate e pimentão; vira-cabeça em tomate e pimentão; septoriose
em salsa e aipo).

| Sintoma (id) | Nome | Órgão | Doenças | Fonte |
| --- | --- | --- | --- | --- |
| `manchas_pardas_irregulares` | Manchas pardas de borda difusa, que crescem e se juntam | folha | septoriose da alface | D1, p. 33 |
| `manchas_necroticas_folhas_novas` | Muitas manchinhas escuras e secas nas folhas novas do centro ou do ponteiro | folha | vira-cabeça | D1, p. 46; D2 |
| `mofo_branco_com_esclerodios` | Mofo branco, como algodão, com grãos duros e pretos (escleródios) | planta | podridão-de-esclerotínia | D1, p. 17-18 |
| `podridao_mole_na_base` | Podridão mole e úmida na base da planta, junto ao solo | planta | podridão-de-esclerotínia | D1, p. 17 |

Por que não serviram os sintomas que já existiam:

- A lesão da septoriose tem borda pouco definida [D1]; `manchas_pequenas_centro_claro`
  descreve justamente a lesão de borda nítida, que o livro usa para separar a
  mancha-de-cercóspora da septoriose.
- No vira-cabeça a lesão começa nas folhas **novas**, do centro [D1, D2]. Nenhum
  sintoma do catálogo marcava esse lugar, e é ele que separa a virose das
  manchas fúngicas, que começam nas folhas velhas.
- O mofo-branco não é mofo da face inferior da folha (`mofo_branco_face_inferior`,
  do míldio), e a podridão não cheira mal, ao contrário de
  `apodrecimento_mole_malcheiroso`, das podridões bacterianas.

Na simulação da fórmula do motor sobre as duas culturas, cada doença fica em
primeiro com o perfil completo, com o sintoma clássico sozinho e com os dois
sintomas mais pesados. A única proximidade é a desfolha a partir das folhas de
baixo no quiabo, comum ao oídio e à cercosporiose (0,37 contra 0,25), como no
campo: pó branco por cima decide pelo oídio, fuligem oliva por baixo pela
cercosporiose.

### O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [D5] | Na ficha |
| --- | --- | --- | --- |
| Míldio da alface | Fenamidona, na tabela de 2010 [D1, Tabela 2] | Fenamidona segue registrada; entraram mandipropamida, dimetomorfe, ciazofamida, oxatiapiprolim e várias misturas | Mandipropamida, dimetomorfe, ciazofamida e oxatiapiprolim |
| Septoriose da alface | Mancozebe, na tabela de 2010 [D1, Tabela 2] | Nenhum mancozebe para *Septoria lactucae*; há difenoconazol (13 produtos), azoxistrobina, misturas com fluxapiroxade e metiram + piraclostrobina | Difenoconazol, azoxistrobina e fluxapiroxade |
| Podridão-de-esclerotínia | "Alguns fungicidas são registrados" [D1] | Procimidona, iprodiona, boscalida, fluazinam, ciprodinil e isofetamida; *Trichoderma harzianum* e outros biológicos em "Todas as culturas" | Procimidona, iprodiona, boscalida e fluazinam; *Trichoderma harzianum* como biológico |
| Vira-cabeça, vetor | Só neonicotinoides para tripes na alface: imidacloprido e tiacloprido [D2, Tabela 1, 2016] | Imidacloprido segue para *F. schultzei*; tiacloprido só para *Thrips tabaci*; entraram espinetoram (*F. occidentalis*) e formetanato (*F. schultzei*); biológicos *Beauveria bassiana* e *Isaria fumosorosea* para *F. schultzei* | Imidacloprido, espinetoram e formetanato; os biológicos como tratamento. A rotação de modos de ação, que em 2016 era impossível [D2], passa a ser possível |
| Oídio do quiabo | Fungicida registrado, sem citar produto [D3] | Flutriafol (10 produtos), imibenconazol, bicarbonato de potássio e misturas para *Erysiphe cichoracearum*; enxofre para *Sphaerotheca fuliginea* | Flutriafol, imibenconazol, bicarbonato de potássio e enxofre |
| Cercosporiose do quiabo | Carbamatos ou cupro-orgânicos [D3] | Nenhum carbamato para as cercosporas do quiabo; cúpricos inorgânicos (hidróxido de cobre, óxido cuproso), azoxistrobina, boscalida, flutriafol e clorotalonil | Hidróxido de cobre, óxido cuproso, boscalida e azoxistrobina |
| Nematoide-das-galhas do quiabo | Nenhum nematicida registrado [D4, 2013]; controle químico não efetivo e a evitar [D3, 2020] | **Ciclobutrifluram** registrado para *M. javanica* no quiabo; vários biológicos para *M. incognita* e *M. javanica* em "Todas as culturas" | Ciclobutrifluram, só como complemento ao manejo cultural, como no jiló; os biológicos como tratamento |

A Tabela 2 do livro da alface [D1] sai com colunas desalinhadas no PDF, e a
correspondência entre doença e produto só se lê com segurança nas linhas de
fenamidona (míldio) e mancozebe (septoriose). As outras linhas não foram usadas.

### Outras decisões

1. **Agente do oídio do quiabo.** A fonte [D3] diz que o fungo é "uma espécie
   ainda não identificada do gênero *Oidium*". O AGROFIT registra produtos sob
   quatro nomes: *Erysiphe cichoracearum*, *Sphaerotheca fuliginea*,
   *Podosphaera* spp. e *Oidiopsis taurica*. A ficha segue a fonte e cita os
   ingredientes registrados para os dois primeiros; *Oidiopsis taurica*
   (*Leveillula taurica*), que causa outro quadro, ficou de fora.
2. **Agente da cercosporiose do quiabo.** Pelo menos quatro espécies de
   *Cercospora* ou *Pseudocercospora*, algumas sinônimas, a mais encontrada
   aparentemente *P. abelmoschi* [D3]. O AGROFIT tem registros para
   *C. abelmoschi*, *P. abelmoschi*, *C. hibiscina* e *Cercospora* spp. Todos
   foram aceitos como o mesmo alvo; *Cercospora capsici*, que é da pimenta,
   não.
3. **Míldio como oomiceto.** O livro trata *Bremia lactucae* como fungo [D1].
   A ficha usa `oomiceto`, como os outros míldios da base.
4. **Vira-cabeça e mosaico como uma ficha por quadro.** O vira-cabeça da alface
   é causado por três tospovírus (GRSV, TCSV, TSWV) de sintomas muito parecidos,
   que só se separam em laboratório [D2]. Uma ficha só, como no mosaico das
   cucurbitáceas. O gênero aparece como *Tospovirus*, como na fonte [D2]; a
   taxonomia atual o chama de *Orthotospovirus*.
5. **Gravidade.** Segue o padrão da base: míldio 4, oídio 3. O vira-cabeça ficou
   em 5, porque causa perdas de 30% a 100% em surtos, pode ser limitante nos
   meses quentes e não tem cultivar resistente [D2]. A podridão-de-esclerotínia
   ficou em 4, pelas grandes perdas em área sem rotação e pelos escleródios que
   duram dez anos no solo [D1]. A septoriose ficou em 3, como a
   mancha-de-estenfílio do jiló: destrói a "saia", mas é regional [D1]. A
   cercosporiose do quiabo ficou em 3: desfolha, mas os frutos não têm
   sintomas [D3]. O nematoide-das-galhas do quiabo ficou em 4, como no jiló,
   embora a fonte diga que pode inviabilizar o cultivo na área [D3]; é dano
   que se acumula de safra em safra, e não perda da lavoura em poucos dias.
6. **Ação dos ingredientes.** A mandipropamida age de forma translaminar; no
   esquema binário da base (protetor ou sistêmico) ficou como sistêmico. A
   procimidona ficou como sistêmico e a iprodiona como protetor, como já está
   na base.
7. **Temperatura do oídio do quiabo.** A fonte [D3] não dá faixa, só diz que o
   oídio é mais severo nos períodos secos. O campo diz isso, sem inventar
   número.
8. **Emoji do quiabo.** Entra 🌱. O 🫛 (vagem, Unicode 15) seria o mais
   próximo, mas aparece como um quadrado em celulares mais antigos.

### Fontes

Publicações acessadas em 09/11/2026. Os dados abertos do AGROFIT foram
baixados em 09/11/2026.

| # | Fonte |
| --- | --- |
| D1 | LOPES, C. A.; QUEZADO-DUVAL, A. M.; REIS, A. *Doenças da alface*. Brasília, DF: Embrapa Hortaliças, 2010. 68 p. ISBN 978-85-86413-20-9. <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/866064/1/CNPHDOEN.DAALFACE10.pdf> |
| D2 | LIMA, M. F.; MICHEREFF FILHO, M.; BOITEUX, L. S.; SUINAGA, F. A. *Doença vira-cabeça em alface: sintomatologia, transmissão, epidemiologia e medidas de controle*. Brasília, DF: Embrapa Hortaliças, 2016. 16 p. (Circular Técnica, 153). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1059924/1/CT153PARAINTERNET.pdf> |
| D3 | LOPES, C. A.; REIS, A. *Doenças do quiabeiro*. Brasília, DF: Embrapa Hortaliças, 2020. 14 p. (Comunicado Técnico, 126). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1124500/1/COT-126-21-ago2020.pdf> |
| D4 | PINHEIRO, J. B.; PEREIRA, R. B.; CARVALHO, A. D. F.; RODRIGUES, C. S. *Manejo de nematoides na cultura do quiabeiro*. Brasília, DF: Embrapa Hortaliças, 2013. 7 p. (Circular Técnica, 127). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/960522/1/ct127.pdf> |
| D5 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`, culturas "Alface", "Quiabo" e "Todas as culturas". <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |

---

## Amaranthaceae: beterraba e espinafre

Curadoria feita em **09/11/2026**. Entram duas culturas da família
Amaranthaceae (antiga Chenopodiaceae), com três doenças cada. Cada ficha parte
de uma publicação técnica que trata daquela doença naquela cultura, e os
ingredientes ativos foram conferidos contra os dados abertos do AGROFIT [C6],
baixados em 09/11/2026. Nenhuma ficha cita ingrediente sem registro ativo para
aquele alvo naquela cultura.

### O espinafre da base é o *Spinacia oleracea*

No Brasil, "espinafre" é muitas vezes o espinafre-da-nova-zelândia
(*Tetragonia tetragonioides*), da família Aizoaceae, mais adaptado ao calor. A
base exige a família Amaranthaceae, e a ficha é do espinafre verdadeiro,
*Spinacia oleracea*. A diferença tem efeito no app: o alerta de rotação (US30)
trata espinafre depois de beterraba como repetição de família, o que só vale
para *Spinacia*. Se o app vier a receber o espinafre-da-nova-zelândia, ele
deve entrar como outra cultura, da família Aizoaceae.

O próprio AGROFIT mistura as duas plantas sob a cultura "Espinafre": há
registro para *Cercospora tetragoniae*, um patógeno da *Tetragonia*, ao lado
de *Peronospora effusa*, que é do *Spinacia* (ver a conferência dos
registros).

**A base brasileira para doenças do *Spinacia* é fraca.** Não foi encontrada
circular, comunicado ou sistema de produção da Embrapa ou do IAC que trate das
doenças dessa espécie, nem artigo em Horticultura Brasileira ou Summa
Phytopathologica. O único trabalho brasileiro confirmado é o primeiro relato
do CMV em espinafre, em São Paulo [C4], do qual só foi possível ler os dados
bibliográficos (o texto da nota está fechado). As três fichas do espinafre
partem das diretrizes de manejo da Universidade da Califórnia [C3], fonte
técnica estrangeira. A escolha das doenças foi cruzada com o que existe de
registro no MAPA para a cultura [C6], que indica os alvos de interesse no
país: míldio, *Pythium* e mofo-branco.

### Culturas e doenças

| Cultura | Família | Doenças | Fonte principal |
| --- | --- | --- | --- |
| Beterraba (*Beta vulgaris*) | Amaranthaceae | cercosporiose, nematoide-das-galhas, tombamento | C2 (as três), C1 (nematoide) |
| Espinafre (*Spinacia oleracea*) | Amaranthaceae | míldio, mosaico-do-pepino (CMV), tombamento e podridão de raiz | C3 (as três), C4 (CMV no Brasil) |

Para a beterraba, o boletim do IAC [C2] diz que as principais doenças são a
mancha-das-folhas (cercosporiose) e os nematoides, e que em alguns locais o
tombamento também é causa de baixo rendimento. As três fichas seguem essa
ordem. A circular da Embrapa [C1] confirma a cercosporiose como a doença
foliar de dano expressivo e dá *M. incognita* e *M. javanica* como os
nematoides de maior dano no Brasil.

**Ciclo.** A beterraba ficou com `ciclo_dias` 90: o boletim do IAC dá o ponto
de colheita de 70 a 110 dias depois da semeadura, conforme o sistema, a época
e a cultivar [C2]. Como a beterraba é colhida de uma vez, a colheita fecha o
ciclo, e 90 é o meio da faixa. O espinafre ficou sem valor: a fonte [C3] não
dá o ciclo.

#### Doenças das fontes que ficaram de fora

- **Beterraba:** mancha-de-phoma (*Phoma betae*), podridão de
  *Sclerotium rolfsii*, mancha-bacteriana (*Xanthomonas campestris* pv.
  *betae*) e murcha-bacteriana, descritas no boletim do IAC [C2] como de
  ocorrência esporádica ou só com controle preventivo. O oídio
  (*Erysiphe polygoni / E. betae*), o míldio e a rizoctoniose aparecem no IAC
  só na lista de resistência das cultivares, sem descrição de sintoma, e
  ficaram de fora por isso, apesar de haver registro para o oídio [C6].
- **Espinafre:** antracnose, mancha-de-estenfílio, mancha-de-cladospório e
  mancha-bacteriana [C3], sem confirmação de ocorrência no Brasil nas fontes
  consultadas. O **mofo-branco** (*Sclerotinia sclerotiorum*) tem registro no
  espinafre [C6], mas o comunicado da Embrapa sobre mofo-branco em hortaliças
  [C5] não lista o espinafre entre as hospedeiras, e o guia da Califórnia [C3]
  não o trata. Fica de fora até haver fonte.

### Sintomas novos no catálogo

Dois sintomas novos, sem equivalente no catálogo. Os nomes são genéricos, sem
a cultura, para que a mesma observação em cenoura, cebola ou alface possa usar
o mesmo id.

| id | Sintoma | Órgão | Doenças | Fonte |
| --- | --- | --- | --- | --- |
| `tombamento_de_mudas` | Mudas tombam, com o colo escuro e afinado rente ao solo | planta | tombamento da beterraba e do espinafre | C2, C3 |
| `raiz_escurecida_podre` | Raízes escurecidas e apodrecidas | raiz | tombamento e podridão de raiz do espinafre | C3 |

O catálogo não tinha sinal de tombamento: até aqui as curadorias deixaram o
tombamento de fora. `raiz_escurecida_podre` é o segundo sintoma de raiz, depois
de `galhas_na_raiz`; se outra família criar um sintoma de podridão de raiz, os
dois devem ser fundidos.

O motor separa as doenças de cada cultura pelo sintoma de peso 1,0, que é
diferente em cada uma. No espinafre, míldio e mosaico dividem dois sintomas
com peso baixo (folha deformada e amarelecimento); o segundo sintoma decide:
mofo arroxeado na face inferior para o míldio, nanismo para o mosaico.

### O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [C6] | Na ficha |
| --- | --- | --- | --- |
| Nematoide-das-galhas da beterraba | Nenhum nematicida registrado para a beterraba [C1, 2011; C2, 2011] | Hoje há **fluopiram**, **ciclobutrifluram**, **fluensulfona** (só *M. javanica*), **fluazaindolizina** e metam-sódico | Os quatro primeiros, como complemento ao manejo cultural. O metam-sódico, fumigante de solo de amplo espectro, ficou fora |
| Nematoide-das-galhas, biológicos | - | Vários produtos com *Bacillus*, *Pochonia chlamydosporia* e *Paecilomyces lilacinus* para *M. incognita* e *M. javanica* em "Todas as culturas" | Citados como `biologico`, sem ingrediente na lista |
| Cercosporiose da beterraba | Fungicidas registrados, intervalo de 7 a 14 dias; cita a calda viçosa [C2] | Mancozebe, clorotalonil, difenoconazol, tebuconazol, azoxistrobina, flutriafol, piraclostrobina, boscalida e outros. A calda viçosa é preparada na propriedade e não tem registro | Mancozebe, clorotalonil, difenoconazol, tebuconazol e azoxistrobina. Calda viçosa não citada |
| Tombamento da beterraba | Só medidas preventivas [C2] | *Pythium* spp.: metalaxil-M + mancozebe. *Fusarium oxysporum* (mal-do-colo): carboxina + tiram. *Rhizoctonia solani*: nenhum químico na beterraba, só biológicos em "Todas as culturas" | Os quatro ingredientes, como complemento; *Trichoderma* e *Bacillus* como `biologico` |
| Tombamento da beterraba, nome do alvo | - | O registro de metalaxil-M + mancozebe para *Pythium* na beterraba traz o nome comum "podridão-mole" | Mantido: o alvo é *Pythium*, um dos agentes do tombamento [C2] |
| Míldio do espinafre | Fungicida protetor, antes da infecção [C3] | **Cimoxanil + zoxamida** para *Peronospora effusa*. Há também mandipropamide, mandipropamide + mancozebe e metalaxil-M + mancozebe para "míldio" no espinafre, mas com o alvo *Peronospora parasitica* / *Hyaloperonospora parasitica*, o míldio das brássicas, que não ataca o espinafre | Só cimoxanil e zoxamida, únicos registrados para o patógeno do espinafre |
| Mosaico (CMV) do espinafre | Inseticida contra o pulgão não impede a infecção [C3] | Há inseticidas para *Myzus persicae* no espinafre (acetamiprido + bifentrina, flonicamida, espiropidiona) | Sem ingrediente, como nos mosaicos das cucurbitáceas: a transmissão é não persistente e o inseticida não substitui as medidas culturais |
| Tombamento e podridão de raiz do espinafre | Semente tratada; mefenoxam só para *Pythium* [C3, EUA] | Mefenoxam (metalaxil-M) não tem registro no espinafre. Há **dimetomorfe** para *Pythium* ("Phytium spp", podridão-radicular) | Dimetomorfe, como complemento. Nota do curador, sem fonte nesta curadoria: o dimetomorfe é conhecido sobretudo contra *Phytophthora* e míldios, e a eficácia sobre *Pythium* merece conferência na bula; ficou porque é o registro existente |
| Espinafre, registros de outra planta | - | *Cercospora tetragoniae* (cercosporiose) é patógeno do espinafre-da-nova-zelândia; *Septoria lactucae* e *Alternaria sonchi* são da alface e da serralha | Não usados |

### Outras decisões

1. **Gravidade.** Segue o padrão das fichas existentes. Cercosporiose da
   beterraba em 4: é a principal doença fúngica da cultura e reduz a produção
   de 15% a 45% [C2] (a do agrião, menos danosa, está em 3). Nematoide-das-galhas
   em 4, como no jiló, embora a circular registre perdas de até 100% em casos
   extremos [C1]. Tombamento em 3 nas duas culturas: o dano é falha de estande
   e é localizado [C2, C3]. Míldio do espinafre em 4, como os demais míldios.
   Mosaico do espinafre em 3, abaixo dos mosaicos das cucurbitáceas e do
   tomate: há um único relato no Brasil [C4] e nenhuma informação de dano no
   país.
2. **Agente do tombamento.** O tombamento é um complexo de fungos
   (*Rhizoctonia*, *Fusarium*) e oomicetos (*Pythium*, *Phytophthora*), e a
   base só aceita um `tipo_agente`. Ficou `fungo`, como o boletim do IAC trata
   o grupo [C2]. Os nomes de todos os agentes estão no campo `agente`.
3. **Cercosporiose e desfolha.** Na beterraba, as folhas velhas atacadas secam
   e se deitam, mas não necessariamente se destacam. O sintoma
   `desfolha_baixo_para_cima` entrou com peso baixo (0,4), porque o ataque
   começa nas folhas mais velhas [C2].
4. **Míldio do espinafre: sintoma clássico.** A mancha amarela (peso 1,0) vem
   antes do mofo na face inferior, como nos míldios das brássicas. O mofo é
   arroxeado [C3], por isso `mofo_arroxeado_face_inferior` (0,9), e não o
   mofo esbranquiçado das brássicas.
5. **Mosaico do espinafre: sintomas.** Vêm da Califórnia [C3]: amarelecimento
   leve e deformação das folhas novas, nanismo e morte do ponto de
   crescimento. A nota brasileira [C4] descreve o quadro como murcha, daí
   `murcha` com peso 0,5. Não foi possível ler a descrição de sintomas da nota.
6. **Fluopiram e grupo químico.** O AGROFIT classifica o fluopiram como
   benzamida e o ciclobutrifluram como fenetilarilamida. Os dois ficaram como
   "Carboxamida", como o ciclobutrifluram já está no jiló: ambos são
   inibidores da succinato desidrogenase (SDHI) do grupo das carboxamidas.

### Fontes

Publicações acessadas em 09/11/2026. Os dados abertos do AGROFIT foram
baixados em 09/11/2026.

| # | Fonte |
| --- | --- |
| C1 | PINHEIRO, J. B. *Nematoides na cultura da beterraba*. Brasília, DF: Embrapa Hortaliças, 2011. (Circular Técnica, 85). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/883594/1/ct85.pdf> |
| C2 | TIVELLI, S. W.; FACTOR, T. L.; TERAMOTO, J. R. S.; FABRI, E. G.; MORAES, A. R. A.; TRANI, P. E.; MAY, A. *Beterraba: do plantio à comercialização*. Campinas: Instituto Agronômico, 2011. 45 p. (Série Tecnologia APTA. Boletim Técnico IAC, 210). Seção 8.5, Doenças, e seção 9, Colheita. <https://ainfo.cnptia.embrapa.br/digital/bitstream/item/48016/1/Andre-May-Boletim-Tec-IAC.pdf> |
| C3 | KOIKE, S. T.; LeSTRANGE, M. *UC IPM Pest Management Guidelines: Spinach*. Oakland: University of California, Agriculture and Natural Resources, UC ANR Publication 3467. Páginas Downy Mildew (texto atualizado em 05/2012) <https://ipm.ucanr.edu/agriculture/spinach/downy-mildew/>, Virus Diseases (05/2012) <https://ipm.ucanr.edu/agriculture/spinach/virus-diseases/> e Damping-off and Root Rot (12/2009) <https://ipm.ucanr.edu/agriculture/spinach/damping-off-and-root-rot/> |
| C4 | YUKI, V. A.; MITUTI, T.; REZENDE, J. A. M.; SALARORI, R. B.; KITAJIMA, E. W.; KITAJIMA, J. P. First report of spinach (*Spinacia oleracea*) wilt caused by cucumber mosaic virus (CMV) in Brazil. *Plant Disease*, v. 101, n. 12, p. 2154, 2017. DOI 10.1094/PDIS-04-17-0560-PDN. <https://apsjournals.apsnet.org/doi/10.1094/PDIS-04-17-0560-PDN>. Usada só para a ocorrência no Brasil; o texto não pôde ser lido. O sobrenome do quarto autor aparece como "Salarori" na editora e "Salaroli" no repositório da USP |
| C5 | REIS, A.; COSTA, H.; LOPES, C. A. *Epidemiologia e manejo do mofo-branco em hortaliças*. Brasília, DF: Embrapa Hortaliças, 2007. (Comunicado Técnico, 45). <https://www.infoteca.cnptia.embrapa.br/bitstream/doc/781613/1/cot45.pdf>. Consultada para o mofo-branco do espinafre; não lista o espinafre entre as hospedeiras |
| C6 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`, culturas "Beterraba", "Espinafre" e "Todas as culturas", situação ativa. <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |

---

## Curadoria das amarilidáceas: cebola, alho e alho-poró

Curadoria feita em **09/11/2026**. Entram três culturas e dez doenças: cebola
(4), alho (3) e alho-poró (3). Cada ficha parte de uma publicação técnica que
trata daquela doença naquela cultura, ou, quando não há publicação da cultura,
da publicação da mesma doença em outra aliácea, e isso fica dito na tabela.
Os ingredientes ativos foram conferidos, cultura a cultura e alvo a alvo, nos
**dados abertos do AGROFIT** [B11], baixados em 09/11/2026. Nenhuma ficha cita
ingrediente sem registro ativo para aquele alvo naquela cultura.

### Família

As fontes falam em **aliáceas**, a família Alliaceae das classificações
antigas. Na classificação atual (APG) o gênero *Allium* está em
**Amaryllidaceae**, subfamília Allioideae, e é esse o nome que entra no campo
`familia`. Para o alerta de rotação (US30), cebola, alho e alho-poró são a
mesma família: as fontes repetem que os patógenos das três passam de uma para
outra e mandam não plantar uma perto das outras [B1, B3].

### Culturas e doenças

| Cultura | Grupo | Doenças | Fonte principal |
| --- | --- | --- | --- |
| Cebola (*Allium cepa*) | raiz | mancha-púrpura, míldio, mal-de-sete-voltas, raiz-rosada | B1, B2 |
| Alho (*Allium sativum*) | raiz | mancha-púrpura, ferrugem, podridão-branca | B3, B4, B5 |
| Alho-poró (*Allium ampeloprasum*, sin. *A. porrum*) | haste | mancha-púrpura, queima-bacteriana, podridão-mole | B10 |

Fonte de cada ficha:

| Ficha | Sintomas e descrição | Condições e manejo |
| --- | --- | --- |
| `cebola_mancha_purpura` | B1, B2 | B1, B3 |
| `cebola_mildio` | B1, B2 | B1 |
| `cebola_mal_de_sete_voltas` | B1, B2 | B1 |
| `cebola_raiz_rosada` | B1, B2 | B1 |
| `alho_mancha_purpura` | B3, B2, B5 | B3, B5, B6 |
| `alho_ferrugem` | B5, B2, B9 | B5, B9, B1, B6, B8 |
| `alho_podridao_branca` | B4, B5, B2 | B4, B5, B1 |
| `alho_poro_mancha_purpura` | B10, B3 | B1, B3 (cebola e alho) |
| `alho_poro_queima_bacteriana` | B10 | B5 (a mesma bactéria no alho) |
| `alho_poro_podridao_mole` | B10 | B10 |

#### Ciclo

- **Cebola:** `ciclo_dias` nulo. As fontes de doenças não dão o ciclo.
- **Alho:** `130`. As cultivares nobres vernalizadas fecham o ciclo em 120 a
  130 dias no Sudeste e no Centro-Oeste, e as comuns são colhidas entre 130 e
  160 dias [B7]. A faixa geral é de 100 a 170 dias, e as tardias chegam a
  210 [B6]. No Sul, o alho nobre sem vernalização passa de 180 dias [B7]. O
  valor único fica no limite comum às duas faixas da Embrapa [B7].
- **Alho-poró:** nulo. A única fonte da cultura [B10] dá as datas de um ensaio
  (mudas transplantadas 60 dias após a semeadura, colheita em novembro), não um
  ciclo de referência.

#### Emoji

🧅 cebola, 🧄 alho. Não há emoji de alho-poró. Entra 🌱, porque 🌿 já é de
agrião e rúcula e 🧅 confundiria com a cebola.

### Sintomas novos no catálogo

Entram dez sintomas, todos usados por pelo menos uma ficha. Os ids não citam a
cultura, para que curadores de outras famílias possam reutilizá-los.

| id | Nome | Órgão | Doenças | Fonte |
| --- | --- | --- | --- | --- |
| `manchas_purpura` | Manchas de centro arroxeado (cor púrpura) na folha | folha | mancha-púrpura (3 culturas) | B1, B3, B10 |
| `seca_das_pontas` | Folhas secando a partir da ponta | folha | mancha-púrpura, raiz-rosada, podridão-branca | B1, B2, B3 |
| `mofo_acinzentado_sobre_lesao` | Mofo acinzentado a violáceo cobrindo as manchas, nas horas úmidas | folha | míldio da cebola | B1 |
| `pustulas_ferrugem` | Pústulas alaranjadas que soltam um pó amarelo cor de ferrugem | folha | ferrugem do alho | B2, B5, B1 |
| `estrias_amarelas_folha` | Estrias amarelas compridas ao longo da folha | folha | queima-bacteriana do alho-poró | B10 |
| `raizes_rosadas` | Raízes rosadas, arroxeadas ou escuras, enrugadas e se desfazendo | raiz | raiz-rosada | B1, B2 |
| `planta_arranca_facil` | Planta sai do chão sem esforço, com poucas raízes | raiz | raiz-rosada, podridão-branca | B1, B2, B4 |
| `mofo_branco_com_esclerodios` | Mofo branco, como algodão, na base da planta ou no bulbo, com grãozinhos escuros | raiz | podridão-branca | B1, B4, B5 |
| `bulbo_alongado_charuto` | Pescoço comprido e bulbo fino, em forma de charuto | raiz | mal-de-sete-voltas | B1, B2 |
| `folhas_velhas_amarelas_secando` | Folhas mais velhas amarelando e secando | planta | podridão-branca | B1, B2, B4 |

#### Sintomas do catálogo reaproveitados

`manchas_escuras_aneis` (os anéis concêntricos da mancha-púrpura),
`manchas_amareladas`, `pontuacoes_pretas_na_lesao` (os acérvulos do
mal-de-sete-voltas, "pontos pretos sobre fundo claro" [B1]),
`folhas_deformadas` (o retorcimento das folhas no mal-de-sete-voltas),
`pontuacoes_finas_cloroticas` (as pontuações esbranquiçadas iniciais da
ferrugem), `manchas_encharcadas`, `crescimento_reduzido`, `lesoes_no_caule` e
`apodrecimento_mole_malcheiroso`.

Dois sintomas parecidos **não** foram reaproveitados:

- `mofo_arroxeado_face_inferior` (míldio das cucurbitáceas): a folha da cebola é
  tubular e não tem face inferior. O mofo do míldio cobre a própria lesão [B1].
  Candidato a fusão se outro curador precisar de "mofo sobre a lesão" sem face.
- `massa_rosada_na_lesao`: está no órgão `fruto`, que a cebola não tem. No
  mal-de-sete-voltas a massa rosada aparece em mudas e folhas [B1]. Para não
  aparecer "No fruto" numa cultura de bulbo, a ficha usa os pontos pretos.

#### Separação pelo motor

Com o sintoma de peso 1,0 marcado sozinho, a doença certa fica em primeiro em
todas as culturas, e nenhuma outra passa de 0. Com os dois sintomas mais
pesados, a doença certa vai de 0,53 a 1,00 de compatibilidade. A única
sobreposição é a esperada: `manchas_amareladas` com mofo dá míldio 0,85
contra 0,10 da mancha-púrpura, porque o míldio pode vir colonizado por
*Alternaria* [B1]. A base mesclada passa em `validar()` sem erro nem aviso.

### O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [B11] | Na ficha |
| --- | --- | --- | --- |
| Mancha-púrpura da cebola | Protetores e sistêmicos, entre eles **procloraz** e **metiram** [B1] | Procloraz sem registro para *A. porri* na cebola; metiram só em mistura com piraclostrobina. Os demais confirmados | Mancozebe, clorotalonil, tebuconazol, azoxistrobina e boscalida |
| Míldio da cebola | Sistêmicos, entre eles **benalaxil** [B1]; clorotalonil "ineficiente" em epidemias fortes [B1] | Benalaxil sem registro. Metalaxil-M e cimoxanil só em mistura pronta. Clorotalonil registrado | Mancozebe, ciazofamida, mandipropamid, metalaxil-M (registro só em mistura, dito no tratamento) e propamocarbe. Clorotalonil fica de fora pela ressalva da fonte |
| Mal-de-sete-voltas | Oxicloreto de cobre, folpete e tiofanato-metílico [B1] | Os três confirmados; também **flutriafol** (10 produtos) | Os três, mais flutriafol |
| Mal-de-sete-voltas, biológico | - | Bacillus registrados para *Colletotrichum gloeosporioides* em "Todas as culturas", sem a forma especial *cepae* | Citado como biológico, com essa ressalva no texto. Sem ensaio na cebola |
| Raiz-rosada da cebola | "Não existem produtos registrados" [B1, 2014] | Nenhum químico. Há **Trichoderma asperelloides** ESALQ 1306 para *Setophoma terrestris*, em "Todas as culturas" | Sem ingrediente ativo; o biológico entra no tratamento |
| Mancha-púrpura do alho | Azoxistrobina, **cresoxim-metílico**, tebuconazol, iprodiona e **pirimetanil** com bom desempenho em ensaio [B3] | Cresoxim-metílico e pirimetanil sem registro para *A. porri* no alho | Mancozebe, iprodiona, tebuconazol, azoxistrobina e boscalida |
| Ferrugem do alho | Mancozebe e oxicloreto de cobre, eficientes na cebola [B1]; tebuconazol e trifloxistrobina + tebuconazol [B8, B9] | Todos registrados para *Puccinia* no alho; trifloxistrobina só em mistura com tebuconazol | Mancozebe, oxicloreto de cobre, tebuconazol e trifloxistrobina (mistura dita no tratamento) |
| Podridão-branca do alho | "Poucas moléculas registradas para o alho", nenhuma para a cebola [B4, 2011] | Alho: procimidona, iprodiona, tiofanato-metílico e ciprodinil + fludioxonil. A cebola hoje tem ciprodinil + fludioxonil | Os quatro do alho. O texto mantém a advertência da fonte: controle químico pouco eficiente |
| Mancha-púrpura do alho-poró | As fontes recomendam para cebola e alho [B1, B3] | No alho-poró só há **azoxistrobina + difenoconazol** e **pidiflumetofem + difenoconazol**, em mistura pronta. Nenhum protetor | Azoxistrobina, difenoconazol e pidiflumetofem, com a mistura dita no tratamento |
| Queima-bacteriana e podridão-mole do alho-poró | Sem recomendação química [B10]; no alho, cobre sem resultado e antibióticos pouco eficientes [B5] | Nenhum registro no alho-poró. Nenhum biológico em "Todas as culturas" para *Pseudomonas marginalis* ou *Pectobacterium* | Sem ingrediente ativo |
| Mancha-púrpura, biológico | - | *Bacillus subtilis* (inclusive QST 713), *B. amyloliquefaciens* e *B. pumilus* para *A. porri* em "Todas as culturas" | Citados como biológico nas três fichas de mancha-púrpura |

### Outras decisões

1. **Gravidade.** Segue o padrão da base: doença foliar fúngica importante 4,
   doença que inviabiliza a área 5, doença de dano moderado 3.
   - Mancha-púrpura 4 nas três culturas. Perdas de até 50% na cebola [B1] e de
     50% a 100% no alho com cultivar suscetível [B3], mas é controlável com
     fungicida e manejo, como a pinta-preta do tomate (4).
   - Míldio da cebola 4, como todos os míldios da base, embora a fonte cite
     perdas de até 75% [B1]. Fica limitado às épocas frias e úmidas.
   - Mal-de-sete-voltas 4. Pode chegar a 100% de perda, mas a fonte o dá como
     esporádico e localizado [B1].
   - Raiz-rosada 3. Reduz o bulbo e raramente mata [B1]; na cebola há
     cultivares resistentes.
   - Ferrugem do alho 4: "uma das mais importantes doenças foliares do alho" [B5].
   - Podridão-branca do alho 5: perdas de até 100%, sobrevivência de 8 a 20 anos
     no solo, sem cultivar resistente e com controle químico pouco eficiente.
     Inviabiliza a área e exige notificação à defesa sanitária [B1, B4, B5].
   - Queima-bacteriana e podridão-mole do alho-poró 3. A fonte descreve as duas
     sem medir perdas [B10].
2. **Agente da raiz-rosada.** B1 e B2 usam *Pyrenochaeta terrestris*, nome
   antigo; o registro no AGROFIT usa *Setophoma terrestris*, o atual. A ficha
   usa o atual e dá o antigo como sinônimo.
3. **Agente da ferrugem.** B5 dá *Puccinia allii*; B1 dá *P. porri*, sinônimo
   de *P. allii*; B8 dá *P. porri*. O AGROFIT tem registros para os dois nomes no
   alho, e a ficha considera os dois.
4. **Mancha-púrpura e *Stemphylium*.** *S. vesicarium* causa lesão igual na
   cebola e no alho [B1, B3], e o produtor não tem como separar as duas. Fica
   citado no agente, sem ficha própria.
5. **Alho-poró: transposição de manejo.** B10 é a única fonte brasileira que
   descreve doenças no alho-poró, e não traz manejo. O manejo da mancha-púrpura
   vem de B1 e B3, escritos para cebola e alho, que já citam o alho-poró como
   hospedeiro. O da queima-bacteriana vem de B5, escrito para o alho, com a
   mesma bactéria (*Pseudomonas marginalis* pv. *marginalis*). As faixas de
   temperatura e umidade da queima-bacteriana também vêm do alho [B5], e a
   ficha diz isso. A podridão-mole ficou com o manejo que B10 sustenta: amontoa
   sem ferir e colheita no ponto. Sua temperatura fica "não definida na fonte".

#### Doenças das fontes que ficaram de fora

- **Cebola:** queima-das-pontas (*Botrytis squamosa*), podridão-branca,
  podridão-basal (*Fusarium*), ferrugem, oídio, Phytophthora e
  antracnose-da-cebola-branca [B1]. A queima-das-pontas é a próxima candidata:
  é importante no Sul [B1] e tem registro (captana, mancozebe + oxicloreto de
  cobre). Ficou de fora porque o sintoma inicial, manchinhas brancas que viram
  queima do ápice, se confunde com a mancha-púrpura e o motor teria dificuldade
  em separar as duas. A podridão-branca já está no alho.
- **Alho:** viroses, queima-bacteriana, fusariose, raiz-rosada e mofo-azul
  [B5]. As **viroses** são o principal problema de produtividade do alho, por
  ser propagado por bulbilho, e o manejo é o alho-semente livre de vírus. Não
  entraram porque são um complexo de vírus, em geral em infecção mista, e a
  ficha não teria um sintoma clássico de peso 1,0 sem uma fonte que descreva os
  sintomas por vírus. Fica para a próxima curadoria, com publicação específica.
- **Alho-poró:** ferrugem e míldio **não ocorreram** no ensaio, mesmo com
  inóculo na área [B10], e por isso não entraram. A mancha de *Botrytis
  squamosa* apareceu só nas mudas de canteiro, com baixa incidência [B10].
  Raiz-rosada e podridão-branca atacam o alho-poró [B1, B4], mas nenhuma fonte
  relata a doença em lavoura de alho-poró no Brasil. O AGROFIT tem registro
  para "septoriose" do alho-poró com *Septoria lactucae*, agente da alface.
  Como nenhuma fonte descreve essa doença no alho-poró, ela não entrou.

### Pontos fracos

- **Alho-poró.** Há uma única fonte da cultura [B10], um ensaio de uma safra
  em Rio do Sul (SC), com inóculo introduzido. É um artigo de divulgação, não
  uma publicação da Embrapa. Ela cita Sediyama et al. (2019, EPAMIG, *101
  culturas*), que dá a mancha-púrpura como a doença mais comum e registra o
  míldio, mas esse capítulo não foi lido.
- **Ferrugem do alho.** A Embrapa trata a doença no sistema de produção [B5] e
  numa circular de diagnose [B2], sem comunicado próprio. A temperatura ótima
  (16 a 21 °C) e as quatro horas de molhamento vêm de B9, artigo de revista
  técnica assinado por pesquisador do IFC.
- **B5 sem data.** A página do sistema de produção de alho não traz ano de
  publicação.

### Fontes

Publicações acessadas em 09/11/2026. Os dados abertos do AGROFIT foram baixados
em 09/11/2026.

| # | Fonte |
| --- | --- |
| B1 | PEREIRA, R. B.; OLIVEIRA, V. R.; PINHEIRO, J. B. *Diagnose e manejo de doenças fúngicas na cultura da cebola*. Brasília, DF: Embrapa Hortaliças, 2014. 20 p. (Circular Técnica, 133). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1007653/1/CT133.pdf> |
| B2 | PEREIRA, R. B.; PINHEIRO, J. B.; CARVALHO, A. D. F. de. *Diagnose e controle alternativo de doenças em alface, alho, cebola e brássicas*. Brasília, DF: Embrapa Hortaliças, 2013. 13 p. (Circular Técnica, 120). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/957550/1/ct120.pdf> |
| B3 | REIS, A.; HENZ, G. P. *Mancha-púrpura do alho e da cebola: doença difícil de controlar*. Brasília, DF: Embrapa Hortaliças, 2009. 6 p. (Comunicado Técnico, 71). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/783048/1/cot71.pdf> |
| B4 | REIS, A. Podridão branca do alho e da cebola. *Nosso Alho*, Brasília, DF, n. 11, p. 46-50, jul. 2011. <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/899810/1/Reis2011.pdf> |
| B5 | RESENDE, F. V.; HABER, L. L.; PINHEIRO, J. B.; LOURENÇO JUNIOR, V.; LIMA, M. F.; MICHEREFF FILHO, M.; MALDONADE, I. R. *Sistema de produção de alho: doenças da cultura do alho*. Brasília, DF: Embrapa Hortaliças, [s.d.]. <https://www.embrapa.br/web/hortalicas/alho/doencas> |
| B6 | MAROUELLI, W. A.; LUCINI, M. A. Manejo de irrigação na cultura do alho. *Revista Agropecuária Catarinense*, Florianópolis, v. 26, n. 3, p. 46-49, nov. 2013/fev. 2014. <https://publicacoes.epagri.sc.gov.br/rac/article/download/617/519/4350> |
| B7 | RESENDE, F. V.; SOUZA, R. B. de; VIDAL, M. C.; GUERRA, J. G. M.; TEIXEIRA, M. G. *Cultivares de alho para agricultura orgânica*. Brasília, DF: Embrapa Hortaliças, 2014. 8 p. (Comunicado Técnico, 104). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1009324/1/COT104.pdf> |
| B8 | DALLA PRIA, M.; ZAGONEL, J.; FERNANDES, E. C. Controle de ferrugem na cultura do alho com uma nova mistura de fungicidas. *Horticultura Brasileira*, v. 26, n. 2, p. 268-270, 2008. <https://ri.uepg.br/items/7867700d-0590-43d4-ace7-84dd8de5f9aa> |
| B9 | MARCUZZO, L. L. Medidas de manejo contra ferrugem em alho. *Cultivar Hortaliças e Frutas*, Pelotas, dez. 2020/jan. 2021. <https://revistacultivar.com.br/noticias/medidas-de-manejo-contra-ferrugem-em-alho> |
| B10 | MARCUZZO, L. L.; SILVA, P. G. da. Ocorrência de doenças em alho-porro. *Revista Agronomia Brasileira*, Jaboticabal, v. 6, 2022. doi: 10.29372/rab202208. <https://www.fcav.unesp.br/Home/ensino/departamentos/cienciasdaproducaoagricola/laboratoriodematologia-labmato/revistaagronomiabrasileira/rab202208.pdf> |
| B11 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`, recorte das culturas Cebola, Alho, Alho porró e Todas as culturas, com situação ativa. <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |

---

## Apiáceas: cenoura, salsa e aipo

Curadoria feita em **09/11/2026**. Entram três culturas da família
**Apiaceae**, com nove doenças, três por cultura, o mínimo da RN05.

Cada ficha foi escrita a partir de uma publicação técnica que trata daquela
doença naquela cultura. Os ingredientes ativos foram conferidos, cultura a
cultura e alvo a alvo, contra os **dados abertos do AGROFIT** [A10], baixados
em 09/11/2026. Só entraram registros em situação ativa. Nenhuma ficha cita
ingrediente sem registro para aquele alvo naquela cultura. As linhas de
registro "Todas as culturas", que são de produtos biológicos, aparecem só como
tratamento `biologico`, e só quando o alvo é o mesmo agente da ficha.

Mandioquinha-salsa e batata-salsa estão em outros registros do AGROFIT e não
foram tomadas como salsa.

### Culturas e doenças

| Cultura | Grupo | Doenças | Fonte principal |
| --- | --- | --- | --- |
| Cenoura (*Daucus carota*) | raiz | queima-de-alternária, queima-de-cercóspora, nematoide-das-galhas | A1, A2, A7 |
| Salsa (*Petroselinum crispum*) | folha | septoriose, queima-de-alternária, mofo-branco | A3, A9 |
| Aipo ou salsão (*Apium graveolens* var. *dulce*) | haste | mancha-de-cercóspora, septoriose, mofo-branco | A5, A6, A4, A8 |

Ficha por ficha:

| Ficha | Sustentada por |
| --- | --- |
| `cenoura_queima_de_alternaria` | A1 (sintomas, epidemiologia, cultivares, resistência à iprodiona); A7 confirma que é a mais comum e a mais danosa |
| `cenoura_queima_de_cercospora` | A1 |
| `cenoura_nematoide_das_galhas` | A2 |
| `salsa_septoriose` | A3 |
| `salsa_queima_de_alternaria` | A3 |
| `salsa_mofo_branco` | A3; A9 confirma a ocorrência na salsa no Brasil |
| `aipo_cercosporiose` | A5 (doença principal do aipo em SP); A8 (registro de *C. apii* no aipo no Brasil); A6 (sintomas, epidemiologia, manejo) |
| `aipo_septoriose` | A5 (doença principal do aipo em SP); A6 (sintomas, epidemiologia, manejo) |
| `aipo_mofo_branco` | A4 (primeiro relato no aipo no Brasil, sintomas e temperatura); A6 (sintomas e manejo no aipo); A3 (manejo em salsa e salsão) |

O `ciclo_dias` das três culturas ficou nulo. A1, A2 e A3 não dão o ciclo. A5
dá a colheita do aipo de 100 a 150 dias **após o transplante**, sem contar os
30 a 60 dias de muda, e isso não é o ciclo. A decisão é a mesma das
cucurbitáceas.

#### A fonte do aipo é a mais fraca

Não existe publicação da Embrapa Hortaliças sobre as doenças do aipo. A
circular da salsa [A3] diz que, para as apiáceas além da cenoura, "há carência
de informações no Brasil". A escolha das três doenças segue a lista de
"principais doenças" do Boletim 200 do IAC [A5]: podridão-mole,
mancha-de-alternária, mancha-de-cercóspora, ferrugem, esclerotínia,
septoriose e mosaico. O boletim só dá os nomes, sem sintomas.

Os sintomas e o manejo das duas manchas foliares vêm, então, das diretrizes de
manejo integrado do aipo da Universidade da Califórnia [A6]. Essa é uma
publicação técnica, com autores e data, mas é estrangeira. O mofo-branco tem
fonte brasileira própria [A4]. A ocorrência de *Cercospora apii* no aipo, no
Brasil (RS, SP, MG e SE), está confirmada em A8, que cita o levantamento de
fungos da Embrapa Cenargen. Para *Septoria apiicola* no aipo, não achei
registro brasileiro além da lista do IAC [A5].

### Doenças da lista das fontes que ficaram de fora

- **Cenoura:** crestamento-bacteriano (*Xanthomonas hortorum* pv. *carotae*),
  que A1 dá como menos frequente e com sintoma igual ao das duas queimas.
  Também ficaram de fora a podridão-mole, que A7 dá como problema sobretudo de
  pós-colheita, e o oídio (*Erysiphe heraclei*), relatado na cenoura só em
  2017. Há registro no AGROFIT para os três, e eles ficam para uma curadoria
  seguinte.
- **Salsa:** tombamento de plântulas, podridão de raiz (*Phytophthora
  nicotianae* e *Pythium*), cercosporiose (*Cercosporidium punctum*), oídio e
  nematoide-das-galhas [A3]. O mofo-branco entrou no lugar da podridão de raiz
  porque o sinal dele (mofo branco com escleródios) separa a doença no motor.
  A podridão de raiz só daria murcha e raiz podre, o que se confunde com o
  mofo-branco.
- **Aipo:** podridão-mole, mancha-de-alternária, ferrugem e mosaico [A5]. Não
  achei fonte técnica que descreva essas doenças no aipo no Brasil. A
  podridão-mole é a primeira da lista do IAC e merece ficha quando houver
  fonte.

### Sintomas novos no catálogo

São quatro. Cada um aparece nas fontes como sinal de diagnóstico e não tinha
equivalente no catálogo. Os ids e os nomes não citam cultura, para que
curadorias paralelas possam reaproveitá-los. O mofo-branco, por exemplo,
aparece também em alface, tomate e outras hortaliças.

| id | Nome | Órgão | Doenças | Fonte |
| --- | --- | --- | --- | --- |
| `manchas_escuras_halo_amarelo` | Manchas pardo-escuras a pretas, com halo amarelo ao redor | folha | queima-de-alternária da cenoura e da salsa | A1, A3, A7 |
| `penugem_cinza_na_lesao` | Penugem cinza fina no centro das manchas, em tempo úmido | folha | cercóspora da cenoura e do aipo | A1, A6 |
| `raiz_bifurcada` | Raiz principal bifurcada, com várias pontas ou rachada | raiz | nematoide-das-galhas da cenoura | A2 |
| `mofo_branco_com_esclerodios` | Mofo branco, como algodão, na base da planta, com corpos pretos e duros | caule | mofo-branco da salsa e do aipo | A3, A4, A6 |

O alvo concêntrico (`manchas_escuras_aneis`) da alternariose das brássicas não
serve para *Alternaria dauci*: nenhuma das fontes descreve anéis. O sinal que
descrevem é a mancha escura com halo amarelo.

`galhas_na_raiz` já cobria as galhas. `raiz_bifurcada` entrou porque, na
cenoura, a raiz é o produto e a bifurcação é o dano comercial mais visível. A2
lembra, porém, que solo compactado, pedras e insetos de solo também bifurcam a
raiz, e que só a galha indica o nematoide. Por isso a bifurcação tem peso 0,8,
e a galha, 1,0.

### Separação no motor

Com um só sintoma marcado, todos os sintomas de peso 1,0 levam a doença certa
à frente, sem segunda hipótese acima do limiar. Com o perfil completo marcado,
a segunda hipótese fica abaixo de 0,35 nas três culturas. Há duas
ambiguidades, as mesmas que existem no campo:

- **Aipo, "Manchas amareladas" sozinho:** a cercosporiose vem à frente
  (0,48), com a septoriose atrás (0,24). As duas começam como manchas
  amarelas [A6]. Quem desempata são os pontinhos pretos (septoriose) ou a
  penugem cinza (cercóspora).
- **Aipo, "Lesões escuras no caule ou haste" sozinho:** o mofo-branco (0,32) e
  a septoriose (0,29) ficam quase empatados. O desempate vem do mofo branco na
  base da planta, ou dos pontinhos pretos na lesão.

Na cenoura, as queimas de alternária e de cercóspora têm sintomas parecidos,
e A1 frisa isso. O motor as separa pelo sintoma principal: mancha escura com
halo amarelo para a alternária, mancha com centro claro para a cercóspora.

### O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [A10] | Na ficha |
| --- | --- | --- | --- |
| Queima-de-alternária da salsa | "Não há fungicidas registrados" [A3, 2018] | **Azoxistrobina + difenoconazol** registrado para *A. dauci* na salsa, só em mistura | Azoxistrobina e difenoconazol, com a nota de que é a mistura registrada |
| Septoriose da salsa | Nenhum fungicida registrado [A3] | Há casugamicina registrada na salsa, mas para o alvo ***Septoria lactucae***, que é o fungo da alface, e não *S. petroselini* | Sem ingrediente ativo. O alvo do registro não é o da ficha. Vale consultar o MAPA para saber se é erro de cadastro |
| Mofo-branco da salsa e do aipo | Nenhum fungicida registrado na salsa [A3] | Nenhum químico para *S. sclerotiorum* na salsa nem no aipo; dezenas de biológicos "Todas as culturas" (*Trichoderma*, *Bacillus*) | Sem ingrediente ativo; biológicos como tratamento `biologico` |
| Nematoide-das-galhas da cenoura, biológico | "Na prática ainda não existe nenhuma medida" biológica comercial [A2, 2012] | Biológicos registrados para *M. incognita* e *M. javanica* em "Todas as culturas" (*Pochonia chlamydosporia*, *Purpureocillium lilacinum*, *Bacillus*) | Tratamento `biologico`, como complemento |
| Nematoide-das-galhas da cenoura, químico | Inexistência de registro torna o controle químico "quase proibitivo" [A2, 2012] | Fluazaindolizina e ciclobutrifluram para as duas espécies; fluensulfona e fluopiram só para *M. javanica*; abamectina e fostiazato só para *M. incognita*; metam-sódico (fumigante) para as duas | Só fluazaindolizina e ciclobutrifluram, os que cobrem as duas espécies da ficha |
| Queima-de-alternária da cenoura | Mancozebe, azoxistrobina, clorotalonil, iprodiona, bromuconazol, captana, manebe, procloraz, tebuconazol, tetraconazol [A1, citando o AGROFIT de 2009] | Confirmados, menos **manebe** e **procloraz**, que não aparecem mais nos registros para este alvo na cenoura. Há muitos outros: difenoconazol, cúpricos, boscalida, piraclostrobina, metconazol etc. | Mancozebe, clorotalonil, azoxistrobina, difenoconazol e tebuconazol. A iprodiona tem registro, mas ficou fora da lista: A1 relata isolados de *A. dauci* resistentes a ela |
| Queima-de-alternária da cenoura e da salsa, biológico | - | *Bacillus subtilis* QST 713 e *B. amyloliquefaciens* registrados para *A. dauci* em "Todas as culturas" | Tratamento `biologico` |
| Queima-de-cercóspora da cenoura | "Os fungicidas recomendados para a queima-de-alternária também controlam esta doença" [A1] | Não é bem assim: difenoconazol e tebuconazol isolados, iprodiona e outros não têm registro para *C. carotae* | Só os registrados para *C. carotae*: mancozebe, clorotalonil, oxicloreto de cobre e azoxistrobina |
| Mancha-de-cercóspora do aipo | Propiconazol, azoxistrobina, trifloxistrobina e clorotalonil, registrados na Califórnia [A6] | No Brasil, só **óxido cuproso** para *C. apii* no aipo, a única linha de aipo no AGROFIT | Óxido cuproso |
| Septoriose do aipo | Os mesmos fungicidas da Califórnia, mais hidróxido de cobre [A6] | Nenhum registro para *S. apiicola* no aipo | Sem ingrediente ativo |
| Cercosporiose da salsa (fora das fichas) | *Cercosporidium punctum* [A3] | Difenoconazol registrado na salsa para *Cercospora beticola*, que é o fungo da beterraba | Não se aplica; anotado para a curadoria que fizer a cercosporiose da salsa |

### Outras decisões

1. **Gravidade.** O padrão das fichas existentes foi seguido. A
   queima-de-alternária ficou em 4 na cenoura e na salsa. As fontes a dão como
   a principal doença da cenoura [A1, A7] e como capaz de causar perda total na
   salsa [A3]. Na cenoura fica acima da alternariose das brássicas (3), porque
   destrói a folhagem e impede a colheita. A septoriose da salsa ficou em 4:
   é "a principal doença da salsa na época das chuvas" e deixa o produto
   "imprestável para o comércio" [A3]. O nematoide-das-galhas da cenoura
   ficou em **5**, um ponto acima do jiló, porque a raiz é o produto e a perda
   de raízes comerciais pode chegar a 100% [A2]. A queima-de-cercóspora ficou
   em 3, por ser menos frequente que a alternária nas principais regiões
   produtoras [A1]. As três doenças do aipo ficaram em 3, porque nenhuma fonte
   brasileira mede o dano. O mofo-branco ficou em 3 na salsa e no aipo: mata a
   planta, mas aparece em reboleiras [A3], e no aipo é relato recente [A4].
2. **Agente da queima-de-alternária da salsa.** A3 cita também *Alternaria
   petroselini*, mas diz que ela "não foi relatada em salsa no Brasil". A ficha
   fica só com *A. dauci*.
3. **Temperatura da queima-de-alternária da cenoura.** A1 (2010) dá 16 a 25 °C
   para a infecção. O capítulo do Manual de Fitopatologia [A7, 1997] dá 24 a
   28 °C. A ficha segue A1, mais recente e da Embrapa.
4. **Mancha-de-cercóspora do aipo com "Manchas amareladas" de peso 1,0.** É o
   primeiro sintoma e aparece nas duas faces da folha [A6]. Esse sintoma é
   genérico. O sinal que separa a doença é a penugem cinza sem pontinhos
   pretos, mas a penugem só aparece em tempo úmido, e por isso não pode ser o
   sintoma clássico. Como a septoriose também começa amarela, ela leva peso
   0,5 nesse sintoma.
5. **Tipo de agente.** Todos são fungos e nematoides, tipos que o banco já
   aceita. Não precisa de migração.
6. **Mistura registrada na salsa.** Azoxistrobina e difenoconazol entram como
   dois ingredientes, como nas fichas existentes. O texto do tratamento químico
   diz que é a mistura registrada para a salsa.

### Fontes

Publicações acessadas em 09/11/2026. Os dados abertos do AGROFIT foram
baixados em 09/11/2026.

| # | Fonte |
| --- | --- |
| A1 | REIS, A. *Queima das folhas da cenoura: uma doença complexa*. Brasília, DF: Embrapa Hortaliças, 2010. 8 p. (Circular Técnica, 91). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/886604/1/ct91.pdf> |
| A2 | PINHEIRO, J. B.; CARVALHO, A. D. F.; PEREIRA, R. B. *Ocorrência e manejo de nematoides em apiáceas*. Brasília, DF: Embrapa Hortaliças, 2012. (Circular Técnica, 103). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/942354/1/ct1031.pdf> |
| A3 | REIS, A.; LOPES, C. A.; HENZ, G. P. *Principais doenças da salsa no Brasil*. Brasília, DF: Embrapa Hortaliças, 2018. (Circular Técnica, 165). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1106556/1/CT165366471LE.pdf> |
| A4 | REIS, A. *Salsão e macaé: duas novas hospedeiras de Sclerotinia sclerotiorum no Brasil*. Brasília, DF: Embrapa Hortaliças, 2011. (Boletim de Pesquisa e Desenvolvimento, 77). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/916779/1/BPD77.pdf>. Atenção: o resumo em inglês troca os locais de coleta; segundo o texto em português, o salsão foi coletado em São José dos Pinhais (PR), em 2010. |
| A5 | AZEVEDO FILHO, J. A.; TRANI, P. E. Aipo ou salsão. In: AGUIAR, A. T. E.; GONÇALVES, C.; PATERNIANI, M. E. A. G. Z.; TUCCI, M. L. S.; CASTRO, C. E. F. (Ed.). *Instruções agrícolas para as principais culturas econômicas*. 7. ed. rev. e atual. Campinas: Instituto Agronômico, 2014. p. 5-7. (Boletim IAC, 200). <https://www.iac.sp.gov.br/media/publicacoes/iacboletim200.pdf> |
| A6 | GREER, C. A.; KOIKE, S. T.; TURINI, T. A. *UC IPM Pest Management Guidelines: Celery*. University of California, Agriculture and Natural Resources, Publication 3439. Texto atualizado em 07/2024. Seções *Early Blight* (<https://ipm.ucanr.edu/agriculture/celery/early-blight/>), *Late Blight* (<https://ipm.ucanr.edu/agriculture/celery/late-blight/>) e *Pink Rot* (<https://ipm.ucanr.edu/agriculture/celery/pink-rot/>). |
| A7 | FANCELLI, M. I. Doenças da cenoura. In: KIMATI, H.; AMORIM, L.; BERGAMIN FILHO, A.; CAMARGO, L. E. A.; REZENDE, J. A. M. (Ed.). *Manual de fitopatologia*, v. 2: doenças das plantas cultivadas. 3. ed. São Paulo: Agronômica Ceres, 1997. p. 232-236. Consultado em cópia digital; não há URL oficial da editora. |
| A8 | COSTA, R. C.; VERZIGNASSI, J. R.; POLTRONIERI, L. S.; BENCHIMOL, R. L.; CARVALHO, E. A. Cercospora apii em mastruz no Pará: primeiro relato. *Summa Phytopathologica*, v. 38, n. 4, p. 341-342, 2012. <https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/950637/1/13.pdf>. Usada só para confirmar o registro de *C. apii* em *Apium graveolens* no Brasil. |
| A9 | REIS, A.; NASCIMENTO, W. M. New apiaceous hosts of *Sclerotinia sclerotiorum* in the Cerrado region of Brazil. *Horticultura Brasileira*, v. 29, p. 122-124, 2011. <https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/886273/1/HB29pp122a124.pdf> |
| A10 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`. <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |

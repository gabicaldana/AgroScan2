# Curadoria das cucurbitáceas e do jiló

Curadoria da US04 ([#7](https://github.com/CampusCEUB/AgroScan/issues/7)),
feita em **24/10/2026**, na Sprint 4. A base passa para a versão `2026.10.24`,
com quatro culturas e 19 doenças novas: de 9 para 13 culturas e de 34 para 53
doenças.

Cada ficha foi escrita a partir de uma publicação técnica que trata daquela
doença, e os ingredientes ativos foram conferidos, cultura a cultura, contra o
registro no MAPA. A conferência dos ingredientes ficou pendente nas
[brássicas](conferencia-brassicas.md) porque o AGROFIT não pôde ser consultado.
Aqui ela foi feita sobre os **dados abertos do AGROFIT** [F9], que trazem uma
linha por produto, cultura e alvo. Nenhuma ficha cita ingrediente sem registro
para aquele alvo naquela cultura.

## O jiló não é cucurbitácea

O critério da US04 agrupa o jiló com as cucurbitáceas. O jiló é uma
**solanácea**, *Solanum aethiopicum* grupo Gilo [F7], citado também como
*S. gilo* [F1]. Ele entrou na base com a família `Solanaceae`. A diferença tem
efeito no app: o alerta de rotação (US30) trata jiló depois de tomate,
pimentão ou batata como repetição de família, e não trata jiló depois de
pepino.

## Culturas e doenças

| Cultura | Família | Doenças | Fonte principal |
| --- | --- | --- | --- |
| Pepino (*Cucumis sativus*) | Cucurbitaceae | míldio, oídio, antracnose, mancha-angular, crestamento-gomoso do caule, mosaico | F2, F3 |
| Abobrinha (*Cucurbita pepo*) | Cucurbitaceae | míldio, oídio, mosaico, antracnose | F4, F5, F6, F10 |
| Abóbora (*Cucurbita moschata*) | Cucurbitaceae | míldio, oídio, mosaico, antracnose | F4, F5, F6, F10 |
| Jiló (*Solanum aethiopicum*) | Solanaceae | antracnose, murcha-de-verticílio, murcha-bacteriana, nematoide-das-galhas, mancha-de-estenfílio | F1, F7 |

Para abobrinha e abóbora não há circular da Embrapa por cultura. As fichas de
míldio, oídio e mosaico partem da circular geral das cucurbitáceas [F4] e do
levantamento nacional de vírus [F5], e a de antracnose parte do comunicado
específico das abóboras [F6]. O PRSV-W é, aparentemente, o vírus mais
encontrado em abobrinha e afeta também as abóboras [F10]. Que os alvos ocorrem
nessas duas culturas é confirmado também pelos registros do AGROFIT para cada
uma [F9].

O ciclo das quatro culturas ficou sem valor (`ciclo_dias` nulo): as fontes dão
o início da colheita, e não o ciclo.

### Doenças da lista das fontes que ficaram de fora

Mancha-zonada, mancha-de-alternária e mancha-de-cercospora das cucurbitáceas,
tombamento de mudas e as podridões de fruto do jiló, por *Phytophthora*,
*Sclerotium* e *Pectobacterium*. Ficam para uma curadoria seguinte. Cada
cultura já tem pelo menos três doenças, o mínimo da RN05.

## Sintomas novos no catálogo

O catálogo passa de 30 para 38 sintomas. Os oito novos aparecem nas fontes como
sinal de diagnóstico e não tinham equivalente:

| Sintoma | Doenças | Fonte |
| --- | --- | --- |
| Manchas angulosas, limitadas pelas nervuras | míldio, mancha-angular | F2, F4 |
| Mofo acinzentado a arroxeado na face inferior, sob as manchas | míldio | F2 |
| Centro da lesão seca e cai, deixando furos na folha | antracnose do pepino, mancha-de-estenfílio | F1, F3 |
| Folhas com bolhas e enrugadas | mosaico de abobrinha e abóbora | F4, F5 |
| Rachadura no caule ou no colo, escorrendo goma parda | crestamento-gomoso | F2, F4 |
| Ao cortar o caule, vasos internos escurecidos | murcha-de-verticílio, murcha-bacteriana | F1 |
| Massa rosada ou alaranjada sobre a lesão, em tempo úmido | antracnoses | F1, F2, F3, F6 |
| Frutos deformados, manchados ou rachados | mosaicos, antracnose das abóboras | F2, F4, F6 |

Os sintomas e os pesos das 34 doenças anteriores não mudaram. Os 84 casos
anteriores das fixtures de paridade continuam idênticos, e entram 38 casos
novos.

O motor separa as doenças de cada cultura pelos sintomas mais pesados. A única
ambiguidade é a que existe no campo: com só "manchas angulosas" marcadas no
pepino, o míldio vem à frente da mancha-angular (0,42 contra 0,36). As duas
começam assim. O segundo sintoma decide: mofo na face inferior para o míldio,
lesão encharcada para a mancha-angular.

## O que a conferência dos registros mudou

| Ponto | Fonte técnica | Registro no MAPA [F9] | Na ficha |
| --- | --- | --- | --- |
| Mancha-angular do pepino | Hidróxido e oxicloreto de cobre [F2, 2013] | Só **casugamicina** e **óxido cuproso** para este alvo no pepino | Casugamicina e óxido cuproso |
| Nematoide-das-galhas do jiló | Nenhum produto [F1, 2012] | **Ciclobutrifluram** registrado para *M. javanica* no jiló | Ciclobutrifluram, como complemento ao manejo cultural |
| Crestamento-gomoso do pepino | Tratamento de sementes com captana e tiram [F2] | Nenhum dos dois para este alvo; há tiofanato-metílico, mancozebe e clorotalonil | Os registrados; o tratamento de sementes ficou como medida cultural |
| Antracnose do pepino | Benomil e tiabendazol, entre os sistêmicos [F2] | Nenhum dos dois para este alvo no pepino | Mancozebe, clorotalonil, tiofanato-metílico e oxicloreto de cobre |
| Antracnose do jiló | Cúpricos [F1, F7] | Confirmado: oxicloreto e hidróxido de cobre, entre outros. Em 2009 eram só três produtos, todos de oxicloreto de cobre [F7] | Mantido |
| Antracnose do jiló, folhas e ramos | "Aparentemente não são afetados" [F7, 2009]; pequenas lesões necróticas [F1, 2012] | - | Segue F1, a mais recente, com peso baixo (0,3) para a lesão no ramo |
| Murcha-de-verticílio e murcha-bacteriana do jiló | Sem controle químico [F1] | Confirmado: nenhum produto para os dois alvos | Sem ingrediente ativo |
| Mancha-de-estenfílio do jiló | Só controle cultural [F1] | Clorotalonil registrado | Clorotalonil |
| Viroses | Controle químico do pulgão é eficaz [F2] ou ineficaz [F4] | - | Segue F4: o vírus passa em picadas de segundos, de forma não persistente, e o inseticida não substitui as medidas culturais |

## Outras decisões

1. **Agente da antracnose das cucurbitáceas.** A circular do pepino [F2] dá
   *Colletotrichum gloeosporioides* f. sp. *cucurbitae*. Os comunicados mais
   recentes da Embrapa [F3, F6] dão *C. orbiculare*, com a ressalva de que, no
   Brasil, ainda não há identificação molecular. As fichas seguem os mais
   recentes, e o AGROFIT registra produtos para os dois nomes.
2. **Mosaico como uma ficha por cultura.** PRSV-W, ZYMV e WMV dão sintomas
   parecidos e só se separam por sorologia [F5]. Uma ficha por vírus
   produziria hipóteses que o produtor não tem como distinguir.
3. **Gravidade.** Segue o padrão das fichas existentes: oídio 3, míldio 4,
   mosaico 5 em abobrinha e abóbora, onde é a principal virose e pode ser
   limitante [F4], e 4 no pepino. A antracnose do jiló ficou em 5, porque a
   fonte a dá como a doença mais importante da cultura, capaz de atingir todos
   os frutos [F1]. A murcha-bacteriana do jiló ficou em 3, porque a fonte diz
   que ela não causa no jiló os danos que causa em tomate e batata [F1].
4. **Fontes dentro da base.** Continua a decisão pendente desde as brássicas,
   para o planejamento da Sprint 5. Até lá, as fontes de cada ficha estão aqui.

## Carga no banco de produção

A versão `2026.10.24` precisa ser carregada no Neon **antes** de o app
publicado passar a usá-la, como nas brássicas. Não há migração nova: os tipos
de agente usados (fungo, oomiceto, bactéria, vírus, nematoide) já existem.

```powershell
cd src
python -m app.seed --gerar-sql --desde-migracao 4 --separar
```

## Fontes

Publicações acessadas em 24/10/2026. Os dados abertos do AGROFIT foram baixados
em 24/10/2026, com última atualização na mesma data.

| # | Fonte |
| --- | --- |
| F1 | PEREIRA, R. B.; PINHEIRO, J. B.; GUIMARÃES, J. A.; REIS, A. *Doenças e pragas do jiloeiro*. Brasília, DF: Embrapa Hortaliças, 2012. 13 p. (Circular Técnica, 106). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/942542/1/ct1061.pdf> |
| F2 | CARVALHO, A. D. F.; AMARO, G. B.; LOPES, J. F.; VILELA, N. J.; MICHEREFF FILHO, M.; ANDRADE, R. *A cultura do pepino*. Brasília, DF: Embrapa Hortaliças, 2013. 18 p. (Circular Técnica, 113). <https://ainfo.cnptia.embrapa.br/digital/bitstream/item/81827/1/ct-113.pdf> |
| F3 | REIS, A.; FEITOSA, M. I. S. *Antracnose da melancia, melão e pepino: identificação e manejo*. Brasília, DF: Embrapa Hortaliças, 2022. (Comunicado Técnico, 134). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1140294/1/COT-134-final.pdf> |
| F4 | LOPES, C. A.; REIS, A.; LIMA, M. F. *Principais doenças da cultura da melancia no Brasil*. Brasília, DF: Embrapa Hortaliças, 2008. 10 p. (Circular Técnica, 61). <https://ainfo.cnptia.embrapa.br/digital/bitstream/item/145915/1/ct-61.pdf> |
| F5 | LIMA, M. F.; ALVES, R. C. *Levantamento de vírus em cucurbitáceas no Brasil, no período 2008-2010*. Brasília, DF: Embrapa Hortaliças, 2011. (Boletim de Pesquisa e Desenvolvimento, 76). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/916776/1/BPD76.pdf> |
| F6 | REIS, A.; SUASTE-DZUL, A. P. *Antracnose em abóboras (Colletotrichum orbiculare)*. Brasília, DF: Embrapa Hortaliças, 2021. 11 p. (Comunicado Técnico, 128). <https://ainfo.cnptia.embrapa.br/digital/bitstream/item/221272/1/COT-128-31-jan-2021.pdf> |
| F7 | REIS, A.; BOITEUX, L. S.; HENZ, G. P. *Antracnose em hortaliças da família Solanaceae*. Brasília, DF: Embrapa Hortaliças, 2009. (Circular Técnica, 79). <https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/783049/1/ct79.pdf> |
| F8 | DIAS, R. C. S.; QUEIROZ, M. A.; MENEZES, M.; BORGES, R. M. E. Avaliação de resistência a *Sphaerotheca fuliginea* e a *Didymella bryoniae* em melancia. *Horticultura Brasileira*, v. 17, supl., p. 13-19, 1999. Usada para a temperatura do crestamento-gomoso: ótimo de 20 a 24 °C, e no pepino maior peso da duração do molhamento. <https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/133836/1/HorticulturaBrasileirav.17p.13191999.pdf> |
| F9 | MAPA. *Sistema de Agrotóxicos Fitossanitários (AGROFIT) - Produto Formulado*. Dados abertos, arquivo `agrofitprodutosformulados.csv`. <https://dados.agricultura.gov.br/dataset/sistema-de-agrotoxicos-fitossanitarios-agrofit> |
| F10 | REZENDE, J. A. M.; PACHECO, D. A.; IEMMA, A. F. Efeitos da premunização da abóbora Menina Brasileira com estirpes fracas do vírus-do-mosaico-do-mamoeiro - estirpe melancia. *Pesquisa Agropecuária Brasileira*, v. 34, n. 8, p. 1481-1489, 1999. <https://seer.sct.embrapa.br/index.php/pab/article/download/5371/2563> |

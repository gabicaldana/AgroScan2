# Conferência agronômica das brássicas

Conferência das 18 fichas da US03 ([#6](https://github.com/CampusCEUB/AgroScan/issues/6))
contra fontes técnicas, feita em **18/10/2026**, na Sprint 4. Era o
encaminhamento pendente desde a
[revisão da Sprint 2](../reunioes/sprint-02-revisao.md) e da
[revisão da Sprint 3](../reunioes/sprint-03-revisao.md).

A validação automática aprova a estrutura da base, não a agronomia. Esta
conferência olhou quatro pontos por ficha: agente causal, perfil de sintomas,
condições favoráveis e ingredientes ativos, este último contra o registro no
MAPA para o alvo.

O resultado é a base `2026.10.18`. As fichas são as mesmas 18, e os sintomas e
os pesos não mudaram: o diagnóstico de cada caso continua idêntico, e as
fixtures de paridade só mudaram no conteúdo das fichas.

## Resultado por doença

| Doença | Culturas | Situação | O que mudou |
| --- | --- | --- | --- |
| Podridão-negra | brócolis, couve, couve-flor, repolho | ❌ Corrigida | Os cúpricos saíram dos ingredientes ativos. Não há produto registrado no MAPA para este alvo em brássicas [F1]; o cobre é só bacteriostático e já há Xanthomonas resistente a ele [F2] |
| Hérnia das crucíferas | couve-flor, repolho | ❌ Corrigida | A ficha dizia que nenhum produto controla o patógeno. A ciazofamida tem registro para a hérnia em brócolis, couve, couve-chinesa, couve-flor e repolho [F3] e foi a mais eficiente em ensaio de campo [F4]. *Trichoderma harzianum* não diferiu da testemunha em couve-flor [F5], e o texto do controle biológico foi corrigido. A frase sobre o dano em cada cultura falava de folha e de cabeça manchada, que não é o quadro de uma doença de raiz |
| Alternariose | brócolis, couve, repolho | 🟡 Ajustada | Agente passa a *Alternaria brassicicola* e *A. brassicae*. Em levantamento com a Embrapa Hortaliças, *A. brassicicola* predominou em repolho, brócolis e couve-flor [F6] |
| Míldio | agrião | 🟡 Ajustada | Agente passa a *Hyaloperonospora nasturtii-aquatici*, espécie descrita sobre *Nasturtium officinale* [F7]. O manejo cultural mandava irrigar de manhã para a folha secar, o que contradiz a própria ficha, já que o agrião é cultivado na água |
| Míldio | brócolis, couve, couve-flor, rúcula | ✅ Conferida | Faixa de 10 a 20 °C compatível com a literatura, que dá ótimo entre 10 e 15 °C [F8] |
| Alternariose | rúcula | ✅ Conferida, com ressalva | Agente mantido. O levantamento [F6] não incluiu rúcula |
| Oídio | rúcula | ✅ Conferida, com ressalva | *Erysiphe cruciferarum* é o agente confirmado em brássicas no Cerrado, favorecido pela estação seca [F9]. O trabalho não incluiu rúcula |
| Cercosporiose | agrião | ✅ Conferida | *Cercospora nasturtii* tem registro de coleta no Brasil [F10]. A descrição das lesões confere [F11] |
| Podridão-mole | agrião | ✅ Conferida, com ressalva | Agente e quadro conferem. O registro do oxicloreto de cobre para agrião não foi confirmado |

## O que fica pendente

1. **Registro por cultura dos demais ingredientes ativos.** O AGROFIT é a fonte
   oficial e não pôde ser consultado nesta conferência. Ficam sem confirmação,
   cultura a cultura: metalaxil-M, mancozebe e fosetil-alumínio (míldio);
   mancozebe, iprodiona e azoxistrobina (alternariose); azoxistrobina
   (cercosporiose do agrião); enxofre e tebuconazol (oídio da rúcula);
   oxicloreto de cobre (podridão-mole do agrião). O risco é maior em rúcula e
   agrião, de pouco suporte fitossanitário. A bula do Ranman, por exemplo, traz
   o agrião só para míldio [F3].
2. **Fontes dentro da própria base.** As fontes desta conferência estão aqui,
   por doença, e não na ficha. O critério da US03 pede fonte por ficha, com
   data de acesso. Levar as fontes para a base exige um campo novo, que passa
   pelo banco, pelo gerador e pelo app. Decisão para o planejamento da Sprint 5.
3. **Carga no banco de produção.** A versão `2026.10.18` precisa ser carregada
   no Neon **antes** de o app publicado passar a usá-la. `consulta.versao_catalogo`
   referencia `versao_catalogo`, e uma consulta feita sobre uma versão que não
   está no banco é recusada. Foi o que causou os 12 dias de erro 500 na Sprint 2.

## Fontes

Todas acessadas em 18/10/2026.

| # | Fonte |
| --- | --- |
| F1 | MACEDO, A. *Pesquisa seleciona cultivares de brócolis com capacidade de resistência à podridão negra*. Revista Cultivar, 11/08/2020, com declaração de Raphael Melo (Embrapa Hortaliças). <https://revistacultivar.com.br/noticias/pesquisa-seleciona-cultivares-de-brocolis-com-capacidade-de-resistencia-a-podridao-negra> |
| F2 | *Alternativas de manejo da podridão negra em couve-flor*. Revista Cultivar, 01/09/2020. <https://revistacultivar.com.br/noticias/alternativas-de-manejo-da-podridao-negra-em-couve-flor> |
| F3 | Bula do Ranman (ciazofamida 400 g/L, registro MAPA 5105), no Agrolink Fito. <https://www.agrolink.com.br/agrolinkfito/produto/ranman_8221.html> |
| F4 | COLOMBARI et al. *Controle químico da hérnia das crucíferas em rúcula cultivada em campo naturalmente infestado*. Revista de Ciências Agrárias, 2018. <https://revistas.rcaap.pt/rca/article/view/16785> |
| F5 | SANTOS et al. *Calagem e biofungicida para o controle de hérnia das crucíferas em couve-flor*. Pesquisa Agropecuária Tropical (UFG). <https://revistas.ufg.br/pat/article/view/46936> |
| F6 | Prevalência de *Alternaria brassicicola* e *A. brassicae* em brássicas. Horticultura Brasileira, v. 30, n. 2. <https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/929848/1/Horticulturav30n2a271.pdf> |
| F7 | VOGLMAYR, H. et al. *Multigene phylogeny, taxonomy and reclassification of Hyaloperonospora on Cardamine*. Mycological Progress, 2013. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3935337/> |
| F8 | NC State Extension. *Downy Mildew on Brassica Crops*. <https://content.ces.ncsu.edu/publication/downy-mildew-on-brassica-crops> |
| F9 | BORGES et al. *Erysiphe cruciferarum* em Brassicaceae no Brasil. Australasian Plant Pathology, 2023. DOI 10.1007/s13313-023-00930-y |
| F10 | JIRCAS. *Some pathogens of cercosporiosis collected in Brazil*. <https://www.jircas.go.jp/en/publication/techtarc/11/1> |
| F11 | Agrolink. *Cercosporiose (Cercospora nasturtii)*. <https://www.agrolink.com.br/problema/cercosporiose_3431.html> |

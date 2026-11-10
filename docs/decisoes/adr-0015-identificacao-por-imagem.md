# ADR 0015 - Identificação por imagem fora do semestre, por falta de acervo de hortaliças

## Status

Proposto em 2026-11-09, como resultado da auditoria do acervo Digipathos (US38).
Aguarda aprovação da equipe.

## Data

2026-11-09

## Contexto

A identificação de doença por foto (US39, RF10) é escopo condicionado desde o
planejamento. O pipeline em volta do modelo já existe e está testado: o
pré-processamento com paridade de *digest* (ADR 0005), a recusa sobre os logits
crus (ADR 0006) e a câmera fora da navegação enquanto não houver modelo
(ADR 0008). Falta o modelo, e o modelo depende de um acervo de imagens com volume
suficiente por classe para as hortaliças da base. O risco R04 registrava que esse
acervo não estava verificado. O candidato era o repositório Digipathos, da
Embrapa.

A [auditoria](../auditoria-digipathos.md) (US38), feita em 09/11/2026 sobre o
registro oficial do acervo no Redape (DOI 10.48432/XA1OVL) e sobre os próprios
arquivos baixados, encontrou o seguinte:

- O acervo tem **2.326 fotos de 171 desordens em 21 espécies**, mais 46.513
  recortes. Quase tudo é lavoura ou frutífera.
- Das 24 culturas da base, só a **couve** aparece. Dos 88 pares cultura × doença
  da base completa, **um** tem imagens: couve × alternariose, com **4 fotos
  originais** (133 recortes dessas mesmas 4 folhas). A couve tem ainda 3 fotos de
  oídio, doença que não está na ficha, e 1 de folha sadia.
- Nenhuma classe de hortaliça passa no piso adotado de 100 imagens independentes
  por classe. Nenhuma passa sequer no piso de 10 representantes que os próprios
  autores usaram nos testes com *deep learning*.
- 69% do acervo foi fotografado sob condição controlada. As fotos de couve
  inspecionadas são folhas destacadas sobre papel branco ou sobre o cartão de
  calibração. O app fotografa no canteiro, sob sol.
- A licença é CC BY-NC 4.0, mais o termo de uso da Embrapa: uso não comercial,
  com atribuição. É compatível com o AgroScan, mas não muda a conclusão. **O
  impedimento é a cobertura, não a licença.**
- O PlantVillage, a alternativa mais óbvia, tem volume para tomate (9 das 10
  doenças da ficha), pimentão, batata e oídio de abóbora. Mas é todo de
  laboratório. O artigo de referência mede 99,35% no teste interno e 31,4% em
  imagens externas. A licença também não está clara: o repositório não tem
  arquivo de licença, o cartão do Hugging Face declara CC BY-SA 3.0 e a cópia no
  Mendeley declara CC0. Nenhum acervo consultado oferece fotos de campo de
  hortaliças brasileiras para calibrar a recusa.
- Restam 18 dias até o fim do semestre (27/11/2026), e a US39 estava planejada
  para a Sprint 7, que começa em 24/11.

## Decisão

**A identificação por imagem não é viável neste semestre, e a US39 sai do escopo
da Sprint 7.**

1. A US39 volta ao backlog como **trabalho posterior ao semestre**, reescrita com
   escopo e critério de entrada explícitos: *"Como produtor, quero que o sistema
   identifique a doença do tomate pela foto"*. Ela só entra numa sprint quando
   houver acervo que cumpra o piso da regra 3.
2. O produto permanece como está. A câmera continua fora da navegação (ADR 0008).
   `modeloDisponivel()` continua devolvendo `false`, e o app continua declarando
   que a identificação por imagem não existe (RF11). O fluxo por sintomas segue
   sendo o produto.
3. O **piso** para reabrir a decisão fica registrado aqui. São
   **≥ 100 fotos independentes por classe** (folhas ou plantas distintas, não
   recortes da mesma folha), **das quais uma parte fotografada em campo**, para
   medir a validação externa e calibrar os limiares de recusa, como exigem o
   `contrato_visao.json` e o ADR 0006. O acervo também precisa ter licença que
   permita distribuir o modelo num app público.
4. O Digipathos **não é adotado** como acervo de treino. Fica registrado como
   fonte consultada, com a citação exigida, caso uma versão futura passe a cobrir
   hortaliças.

## Alternativas consideradas

- **Treinar com o Digipathos mesmo assim, só para couve.** Rejeitada. Uma doença
  com 4 fotos, mais 1 folha sadia, não forma um classificador que distinga o que
  a ficha da couve distingue (míldio, alternariose, podridão-negra). Os 133
  recortes não são amostras independentes e são menores que a entrada de 224 px
  do contrato na maioria dos casos (só 13 têm o lado menor ≥ 224 px).
- **Usar substitutos entre espécies** (o oídio do meloeiro para abóbora,
  abobrinha e pepino, a alternária da couve para repolho e brócolis). Rejeitada.
  O mesmo agente em outra espécie não é a mesma imagem, a transferência não foi
  verificada, e mesmo assim nenhuma classe somaria 10 fotos originais.
- **Treinar o tomate com o PlantVillage ainda neste semestre.** Rejeitada para o
  semestre. O volume existe, mas: (a) o viés de laboratório está documentado pelos
  próprios autores; (b) sem fotos de campo, os limiares de recusa ficariam nulos,
  e um modelo que não sabe recusar contraria o ADR 0006; (c) a licença precisa de
  esclarecimento antes de embarcar pesos num app público; (d) 18 dias não
  comportam treino, export, paridade, calibração e validação externa com o rigor
  que o contrato exige. Continua sendo o **candidato mais forte** para quando a
  US39 for retomada, com validação externa em fotos de campo.
- **Usar o PlantDoc** (imagens da internet, CC BY 4.0). Rejeitada como acervo de
  treino: são 2.598 imagens em 13 espécies e até 17 classes no total, pouco para
  treinar. Pode servir de validação externa no futuro, após conferir a contagem
  por classe, que não foi conferida nesta auditoria.
- **Lançar a câmera sem calibração, com aviso.** Rejeitada pelo ADR 0006: uma
  recusa que não significa nada é pior que nenhuma, e o público decide manejo a
  partir da resposta.

## Consequências

**Positivas**

- A decisão sai de dados conferidos, e não de suposição. O risco R04 se
  materializa de forma controlada: o núcleo do produto não depende dele.
- A Sprint 7 libera 13 pontos para os ativos e a documentação técnica, que são
  avaliados.
- O trabalho já feito (pré-processamento, recusa, carregador que confere as
  classes) não se perde. Fica pronto e testado para quando houver modelo.
- O piso de reabertura fica escrito, e quem retomar sabe o que precisa provar.

**Negativas e custos aceitos**

- O RF10 (desejável) não é entregue no semestre. O produto sai sem a
  identificação por foto, o que precisa ser comunicado à comunidade e na
  avaliação como decisão, e não como falha.
- A promessa de "câmera como enriquecimento" fica adiada por tempo
  indeterminado, já que depende de acervo que ninguém tem hoje.

**Ajustes necessários se a decisão for aprovada**

- `docs/decisoes/README.md`: incluir o ADR 0015 no índice e retirar
  "Viabilidade da identificação por imagem" das decisões pendentes.
- `entregas/artefato-2-gestao-do-projeto.md`: atualizar o R04 (materializado,
  com tratamento registrado neste ADR), a linha da US39 e o planejamento da
  Sprint 7. `sprints/sprint-07.md`: retirar a issue #44 do ciclo.
- `docs/aplicacao.md` (roteiro) e `docs/arquitetura.md` (integrações): trocar
  "candidato, se a auditoria aprovar" pelo resultado da auditoria.
- Issue #44 (US39): reescrever o escopo como "tomate" e registrar o critério de
  entrada da regra 3.

**O que mudaria a decisão no futuro**

- Uma nova versão do acervo no Redape (hoje é a 1.0, de 30/07/2024) com
  hortaliças em volume.
- Um acervo de **campo** de hortaliças, com licença compatível, que cumpra o piso,
  mesmo que só para o tomate.
- **Coleta própria.** As fotos anexadas às consultas na horta comunitária,
  rotuladas por agrônomo, viram acervo de validação de campo. Isso depende da
  decisão pendente sobre o armazenamento das fotos e de consentimento dos
  usuários (LGPD).
- O esclarecimento da licença do PlantVillage, somado a um conjunto de fotos de
  campo para validação externa e calibração da recusa. Esse é o caminho mais curto
  para uma US39 restrita ao tomate.
- Uso comercial do app, a qualquer tempo, exigiria autorização expressa da
  Embrapa para qualquer uso da PDDB.

## Links relacionados

- Issue [#43](https://github.com/CampusCEUB/AgroScan/issues/43) - US38, auditar o acervo Digipathos
- Issue [#44](https://github.com/CampusCEUB/AgroScan/issues/44) - US39, identificação da doença pela foto
- Relatório: [`docs/auditoria-digipathos.md`](../auditoria-digipathos.md) (auditoria de 09/11/2026)
- Requisitos: RF10, RF11
- Riscos: R04 - indisponibilidade do acervo de imagens para hortaliças
- [ADR 0005 - Contrato de pré-processamento](adr-0005-contrato-de-preprocessamento.md)
- [ADR 0006 - Recusa calculada sobre os logits crus](adr-0006-recusa-sobre-logits-crus.md)
- [ADR 0008 - Hierarquia de entrada](adr-0008-hierarquia-de-entrada.md)
- Código: `src/data/contrato_visao.json`, `src/web/lib/diagnostico-por-imagem.ts`, `src/web/lib/recusa.ts`
- Acervo: [Base de Imagens de Sintomas de Doenças de Plantas PDDB](https://doi.org/10.48432/XA1OVL), licença [Embrapa CC BY-NC 4.0](https://www.redape.dados.embrapa.br/licenses/embrapa-by-nc-4.0.xhtml)
- Barbedo et al., IEEE Latin America Transactions, 2018, [10.1109/TLA.2018.8444395](https://doi.org/10.1109/TLA.2018.8444395)
- Mohanty, Hughes e Salathé, Frontiers in Plant Science, 2016, [10.3389/fpls.2016.01419](https://doi.org/10.3389/fpls.2016.01419)

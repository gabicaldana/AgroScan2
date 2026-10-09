# ADR 0005 - Contrato de pré-processamento definido pelo projeto

## Status

Aprovado - implementado e verificado por digest SHA-256 do tensor.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

Quando a identificação por imagem existir, o tensor que o modelo recebe em campo
tem que ser **idêntico** ao que ele viu no treino. Se o aplicativo redimensiona
de um jeito e o treino de outro, o modelo responde com a mesma confiança de
sempre sobre uma imagem que nunca viu - e a acurácia perdida some dentro de um
número que continua parecendo bom. É uma falha silenciosa, e por isso a mais
perigosa.

O `drawImage` do navegador não serve como base: ele não redimensiona igual ao
PIL (a biblioteca usada no treino em Python) nem igual a si mesmo entre
navegadores diferentes.

Havia duas saídas: reproduzir o PIL bit a bit em TypeScript, ou definir o
algoritmo no projeto e obrigar o treino a usar este.

## Decisão

O algoritmo de pré-processamento é **definido pelo projeto**, em
`src/data/contrato_visao.json`, e quem treinar o modelo tem que obedecê-lo - não o
contrário. Os valores existem **antes** do modelo, de propósito.

O algoritmo mora em `src/app/preprocessamento.py`, é portado em
`src/web/lib/preprocessamento.ts`, e os dois são comparados por **digest SHA-256 do
tensor float32** sobre imagens geradas por fórmula - nenhuma imagem binária no
repositório. Sete casos, cobrindo ampliação, redução, retrato, paisagem e
tamanhos ímpares. Um único valor diferente no último bit muda o digest.

Especificação: entrada 224×224, 3 canais, layout NCHW, float32. Redimensiona o
lado menor para 256 mantendo proporção, depois recorta 224 no centro. O filtro é
**triangular com suporte escalado**.

O suporte escalado é a parte que importa: quando a imagem diminui, a janela do
filtro cresce junto. É isso que impede que reduzir uma folha com nervuras finas
produza faixas de moiré que não existem na planta - e que o modelo classificaria
como textura. Os testes provam os dois lados: listras de 1 px reduzidas viram
cinza (desvio 0,06), e ampliadas mantêm o contraste (1,26).

## Alternativas consideradas

**Reproduzir o PIL bit a bit em TypeScript.** Rejeitada: acorrentaria o projeto
a detalhes internos de implementação de uma biblioteca de terceiros, que podem
mudar entre versões sem aviso.

**Usar `drawImage` do navegador e aceitar a diferença.** Rejeitada: é a falha
silenciosa descrita no contexto, e ela varia entre navegadores - o mesmo
aplicativo produziria tensores diferentes em aparelhos diferentes.

**Redimensionar no servidor.** Rejeitada: violaria o princípio do ADR 0001,
tornando a identificação por imagem dependente de rede.

## Consequências

**Positivas**

- O contrato é verificável por igualdade de digest, o que torna impossível uma divergência passar sem ser notada.
- O projeto fica independente de versão de biblioteca de terceiros.
- Quem treinar o modelo recebe uma especificação executável, e não uma descrição em prosa.
- O pré-processamento roda no cliente, preservando o funcionamento sem rede.

**Negativas e custos aceitos**

- O filtro triangular com suporte escalado teve que ser implementado duas vezes, em Python e em TypeScript. É código de baixo nível, e é o trecho mais delicado do projeto.
- Um treinador que ignore o contrato produzirá um modelo incompatível, e o sistema não tem como detectar isso automaticamente antes da inferência. Mitigado pela verificação de lista de classes descrita no ADR 0006.
- O contrato precisa ser mantido estável: alterá-lo depois de um modelo treinado invalida o modelo.

## Links relacionados

- Requisitos: RF10, RNF19
- Código: `src/data/contrato_visao.json`, `src/app/preprocessamento.py`, `src/web/lib/preprocessamento.ts`
- [ADR 0006 - Recusa sobre logits crus](adr-0006-recusa-sobre-logits-crus.md)

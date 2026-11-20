# ADR 0016 - Foto da consulta guardada só no aparelho, sem metadados

## Status

Proposto em 2026-11-19, com a implementação da US37 (#42). Aguarda aprovação
da equipe.

## Data

2026-11-19

## Contexto

A US37 pede que o produtor fotografe a planta e anexe a foto ao registro
(RF10), com a captura pela câmera traseira, em resolução nativa, e a foto
vinculada à consulta. O índice de decisões tinha uma pendência sobre isso: onde
guardar a foto, que dependia da escolha de um serviço de armazenamento de
objetos em camada gratuita. O esquema do banco já tem a tabela `consulta_foto`
(chave do objeto, hash, dimensões), pensada para esse serviço.

Três fatos pesaram:

- **A foto não alimenta o diagnóstico.** A identificação por imagem saiu do
  semestre ([ADR 0015](adr-0015-identificacao-por-imagem.md)). A foto é
  evidência para quem fotografou: o que estava no canteiro naquele dia.
- **O app precisa funcionar sem rede** (RNF01). Um envio de foto depende de
  conexão e de cota no serviço.
- **A foto de celular carrega metadados.** O EXIF costuma trazer a coordenada
  GPS exata e o modelo do aparelho. A revisão LGPD (#75) decidiu guardar o
  local da consulta só com consentimento e arredondado a ~110 m; uma foto com
  EXIF guardaria o ponto exato sem pedir.

## Decisão

1. **A foto fica só no aparelho**, no IndexedDB, num banco próprio
   (`agroscan-fotos`), e não vai para o servidor. A tabela `consulta_foto`
   continua sem uso.
2. **Vínculo pelo `offlineId`** da consulta, que existe desde a fila e se
   mantém depois da sincronização. Uma foto por consulta; anexar de novo
   substitui.
3. **Captura pelo app de câmera do aparelho**: campo de arquivo com
   `accept="image/*"` e `capture="environment"`, que abre a câmera traseira em
   resolução nativa, com foco, flash e HDR do próprio aparelho. O visor de
   `Camera.tsx` fica para o modelo de imagem, que precisa de paridade de
   pixels.
4. **Recodificação obrigatória.** Toda foto passa por um canvas antes de ser
   guardada: sai em JPEG (qualidade 0,85), com até 2048 px no maior lado e
   **sem EXIF**. A orientação gravada pela câmera é aplicada antes.
5. **Apagar.** O caderno mostra a foto com "Apagar a foto", que mantém a
   consulta. Sair da conta e excluir a conta apagam todas as fotos do
   aparelho, como já acontece com a fila e as cópias do caderno
   ([ADR 0014](adr-0014-sair-da-conta-com-a-fila-sem-dono.md)): a foto não
   tem dono gravado, e ficaria para a próxima pessoa que usasse o celular.

## Alternativas consideradas

- **Enviar a um serviço de objetos** (Vercel Blob, por exemplo). Rejeitada
  para o semestre: exige conta e chave no serviço, cota, política de retenção
  e de exclusão no servidor, e um envio que só acontece com rede. É o caminho
  natural se a foto um dia virar acervo de validação de campo para a US39,
  com consentimento de uso, como o ADR 0015 registra.
- **Guardar a foto original.** Rejeitada: carrega o EXIF com a coordenada
  exata, e uma foto de 12 MP tem de 3 a 5 MB. O iOS pode esvaziar o
  armazenamento do site sob pressão de espaço, e fotos grandes aceleram isso.
- **Reutilizar o visor `Camera.tsx`.** Rejeitada: o visor captura um quadro do
  vídeo, em resolução menor que a da foto, sem foco por toque nem flash.
- **Guardar a foto no mesmo banco da fila** (`agroscan`). Rejeitada: criar
  outro depósito exigiria subir a versão do banco, e uma aba com o app antigo
  aberta bloquearia a atualização.

## Consequências

**Positivas**

- Funciona sem rede e sem conta, como o resto do caderno.
- Nenhum dado novo sai do aparelho: a foto não entra no servidor, nos
  operadores (Neon, Vercel) nem nos relatórios.
- O EXIF é descartado sempre, e a revisão LGPD continua valendo.
- Sem custo de serviço e sem chave a guardar.

**Negativas e custos aceitos**

- **A foto não acompanha a conta.** Trocar de celular, limpar os dados do
  navegador ou sair da conta perde as fotos. A tela diz isso ao anexar ("fica
  só neste aparelho") e ao sair.
- O agrônomo que acompanha a horta não vê a foto do produtor.
- A foto guardada tem menos resolução que a capturada (até 2048 px), o que
  basta para evidência, mas não para análise em laboratório.

**O que mudaria a decisão**

- A decisão de usar fotos de campo como acervo de validação da US39, com
  consentimento de uso dos usuários.
- Um serviço de objetos aprovado para o projeto, com retenção e exclusão
  definidas.

## Links relacionados

- Issue [#42](https://github.com/CampusCEUB/AgroScan/issues/42) - US37, fotografar a planta para anexar ao registro
- Requisito: RF10
- [ADR 0008 - Hierarquia de entrada](adr-0008-hierarquia-de-entrada.md)
- [ADR 0014 - Sair da conta com a fila sem dono](adr-0014-sair-da-conta-com-a-fila-sem-dono.md)
- [ADR 0015 - Identificação por imagem fora do semestre](adr-0015-identificacao-por-imagem.md)
- Revisão LGPD: [`docs/lgpd.md`](../lgpd.md)
- Código: `src/web/lib/fotos.ts`, `src/web/components/FotoDaConsulta.tsx`, `src/web/lib/conta.ts`

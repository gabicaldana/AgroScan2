/**
 * A costura do modelo de imagem.
 *
 * Hoje ela é um buraco declarado: `ARQUIVO.nome` é null no contrato porque não
 * existe modelo publicado. Este módulo existe para que o buraco tenha uma
 * forma, um erro nomeado e um teste - em vez de o resto do app ser escrito em
 * volta de uma suposição.
 *
 * Quando houver um ONNX, `carregarClassificador` passa a devolver um objeto que
 * roda o grafo; nada mais no app muda, porque tudo depende desta interface e
 * não do runtime.
 *
 * O classificador é quem sabe traduzir a saída do modelo em uma ficha da base:
 * é ele que carrega a lista de classes do acervo em que foi treinado. Essa
 * tradução NÃO mora na base de conhecimento - a base é conteúdo agronômico e
 * não carrega identidade de nenhum acervo de imagens. Um acervo aponta para a
 * base; nunca o contrário.
 */

import { ARQUIVO } from "./contrato-visao.ts";
import type { Previsao } from "./diagnostico-por-imagem.ts";

/** Um classificador devolve os LOGITS CRUS, nunca probabilidades.
 *
 *  A recusa precisa de temperatura e energia, e as duas são impossíveis de
 *  calcular depois que o softmax já foi aplicado. */
export type Classificador = {
  /** @param tensor NCHW float32, 1×3×224×224, vindo de `preprocessamento.ts` */
  classificar(tensor: Float32Array): Promise<Float32Array>;
  /**
   * Traduz as probabilidades na ficha da base, restrita à cultura que o
   * usuário selecionou. Devolve `null` quando nenhuma classe daquela cultura
   * recebeu massa.
   */
  resolver(probabilidades: Float64Array, culturaId: string): Previsao | null;
};

export class ModeloIndisponivel extends Error {
  // Sem `constructor(readonly detalhe)`: o Node so REMOVE tipos, nao
  // transforma codigo, e propriedade declarada no parametro exigiria gerar o
  // `this.detalhe = detalhe`. Escrevendo a mao, `node --test` roda o arquivo
  // direto e o projeto continua sem dependencia de build nos testes.
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ModeloIndisponivel";
  }
}

/** Há um modelo declarado no contrato? */
export function modeloDisponivel(): boolean {
  return ARQUIVO.nome !== null && ARQUIVO.sha256 !== null;
}

/**
 * Carrega o classificador, ou explica por que não dá.
 *
 * Devolve `null` - e não lança - quando simplesmente ainda não existe modelo:
 * é um estado previsto do produto, não uma falha. A interface mostra o fluxo
 * por sintomas nesse caso.
 */
export async function carregarClassificador(): Promise<Classificador | null> {
  if (!modeloDisponivel()) return null;

  // Aqui entram o onnxruntime-web e a leitura de `metadata_props.classes`.
  //
  // A conferência da lista de classes contra o acervo declarado não é zelo
  // excessivo: o cenário provável neste app é o service worker servir um
  // modelo antigo em cache junto de um bundle novo. Os dois carregam, a
  // inferência roda, cada índice aponta para a doença errada, e nenhuma tela
  // quebra. Por isso o modelo carrega a lista no próprio arquivo e o
  // carregador recusa rodar se ela não bater.
  throw new ModeloIndisponivel(
    `o contrato declara o modelo "${ARQUIVO.nome}", mas o runtime de ` +
      `inferencia ainda nao foi ligado`,
  );
}

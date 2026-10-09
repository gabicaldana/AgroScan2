/**
 * A identificação por foto, ponta a ponta:
 *
 *   pixels da câmera
 *     -> preprocessamento.ts   (tensor idêntico ao do treino)
 *     -> classificador.ts      (logits crus)
 *     -> recusa.ts             (decidir sobre os logits CRUS)
 *     -> laudo
 *
 * A recusa vai sobre os logits crus, antes de qualquer normalização por
 * cultura: renormalizar sobre um subconjunto de classes infla a confiança de
 * qualquer imagem, e recusar depois disso seria nunca recusar. Está escrito
 * assim aqui, num lugar só, para nenhuma tela poder inverter.
 *
 * Recebe o classificador por parâmetro em vez de carregá-lo: é o que permite
 * testar toda a orquestração com um classificador falso, hoje, sem modelo.
 *
 * Enquanto não existir modelo publicado, o único caminho possível é
 * `sem_modelo` - e o app diz isso ao usuário em vez de chutar.
 */

import type { Classificador } from "./classificador.ts";
import { preprocessar } from "./preprocessamento.ts";
import { avaliar, softmax, type Pontuacoes } from "./recusa.ts";

export type ImagemCapturada = {
  data: ArrayLike<number>;
  width: number;
  height: number;
};

/** A classe mais provável, já resolvida contra a base de conhecimento. */
export type Previsao = {
  culturaId: string;
  doencaId: string;
  confianca: number;
};

export type ResultadoDaImagem =
  /** Nenhum modelo carregado - o estado normal enquanto não houver acervo. */
  | { estado: "sem_modelo" }
  /** O modelo respondeu, mas não reconheceu nada do domínio treinado. */
  | { estado: "recusado"; motivo: string; pontuacoes: Pontuacoes }
  /** Respondeu, mas os limiares de recusa ainda não foram medidos. */
  | { estado: "nao_calibrado"; previsao: Previsao; pontuacoes: Pontuacoes }
  /** Respondeu, mas nenhuma classe da cultura recebeu massa. */
  | { estado: "sem_resposta"; pontuacoes: Pontuacoes }
  | { estado: "diagnosticado"; previsao: Previsao; pontuacoes: Pontuacoes };

export async function diagnosticarImagem(
  imagem: ImagemCapturada,
  culturaId: string,
  classificador: Classificador | null,
): Promise<ResultadoDaImagem> {
  if (!classificador) return { estado: "sem_modelo" };

  const tensor = preprocessar(imagem);
  const logitsCrus = await classificador.classificar(tensor);

  // Sobre os logits CRUS. Ver recusa.ts.
  const veredito = avaliar(logitsCrus);
  if (veredito.decisao === "recusar") {
    return {
      estado: "recusado",
      motivo: veredito.motivo,
      pontuacoes: veredito.pontuacoes,
    };
  }

  const previsao = classificador.resolver(softmax(logitsCrus), culturaId);
  if (!previsao) {
    return { estado: "sem_resposta", pontuacoes: veredito.pontuacoes };
  }

  return {
    estado:
      veredito.decisao === "nao_calibrado" ? "nao_calibrado" : "diagnosticado",
    previsao,
    pontuacoes: veredito.pontuacoes,
  };
}

/** Para onde a interface manda o usuário depois de um resultado aceito. */
export function rotaDoLaudo(previsao: Previsao): string {
  const confianca = Math.round(previsao.confianca * 100);
  return `/resultado?doenca=${previsao.doencaId}&confianca=${confianca}`;
}

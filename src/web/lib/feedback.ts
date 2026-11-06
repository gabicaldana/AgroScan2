/**
 * O feedback do diagnóstico (US20): o produtor volta e diz se a hipótese
 * principal se confirmou no campo e, quando não, qual era a doença real.
 *
 * É o único dado do sistema que mede a qualidade do próprio diagnóstico, e é
 * dele que sai a taxa de confirmação (US28). Por isso as regras de coerência
 * moram aqui, sem React, e a tela só as consulta: a mesma resposta que a API
 * recusaria nem chega a ser enviada.
 *
 * Um feedback por consulta. Responder de novo SUBSTITUI a resposta anterior,
 * no servidor (UNIQUE em `feedback.consulta_id`) e aqui.
 */

import type { Cultura } from "./base-conhecimento.ts";

/** A resposta já registrada, como a listagem do caderno a devolve. */
export type Feedback = {
  confirmado: boolean;
  /** Só quando não se confirmou e se sabe qual era. */
  doencaConfirmadaId: string | null;
  doencaConfirmadaNome: string | null;
  comentario: string | null;
};

/** O que a pessoa escolheu na tela, antes de virar pedido. */
export type Escolha =
  | { tipo: "confirmou" }
  /** `doencaId` nulo é "não sei qual era" - uma resposta válida. */
  | { tipo: "nao_confirmou"; doencaId: string | null };

export type PedidoDeFeedback = {
  confirmado: boolean;
  doencaConfirmadaId: string | null;
  comentario: string | null;
};

/** O limite do campo `comentario` na API. */
export const LIMITE_DO_COMENTARIO = 2000;

/** Por que um registro ainda não pode ser avaliado - ou `null` se pode. */
export type Impedimento = "pendente" | "sem_hipotese";

export function impedimento(registro: {
  pendente: boolean;
  id?: number;
  doencaId: string | null;
}): Impedimento | null {
  // O feedback se prende à consulta do servidor, pelo id. Enquanto o registro
  // mora só na fila do aparelho, não há a que prendê-lo.
  if (registro.pendente || registro.id === undefined) return "pendente";
  // Sem hipótese principal não há o que confirmar.
  if (registro.doencaId === null) return "sem_hipotese";
  return null;
}

/**
 * As doenças que podem ter sido a real: as da MESMA cultura, sem a hipótese
 * principal - "não se confirmou, era ela mesma" seria contradição.
 */
export function doencasPossiveis(
  culturas: readonly Cultura[],
  culturaId: string,
  principalId: string | null,
): { id: string; nome: string }[] {
  const cultura = culturas.find((c) => c.id === culturaId);
  if (!cultura) return [];
  return cultura.doencas
    .filter((d) => d.id !== principalId)
    .map((d) => ({ id: d.id, nome: d.nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

/**
 * Transforma a escolha em pedido, ou diz por que ela é incoerente.
 *
 * Mesmas regras da rota `POST /consultas/{id}/feedback`: confirmado não leva
 * outra doença; a doença real é da cultura e não é a hipótese principal.
 */
export function montarPedido(
  escolha: Escolha,
  comentario: string,
  contexto: { principalId: string | null; possiveis: readonly { id: string }[] },
): { ok: true; pedido: PedidoDeFeedback } | { ok: false; motivo: string } {
  const texto = comentario.trim();
  if (texto.length > LIMITE_DO_COMENTARIO) {
    return {
      ok: false,
      motivo: `O comentário passa de ${LIMITE_DO_COMENTARIO} caracteres.`,
    };
  }

  if (escolha.tipo === "confirmou") {
    if (contexto.principalId === null) {
      return { ok: false, motivo: "Esta consulta não tem hipótese a confirmar." };
    }
    return {
      ok: true,
      pedido: { confirmado: true, doencaConfirmadaId: null, comentario: texto || null },
    };
  }

  const { doencaId } = escolha;
  if (doencaId !== null) {
    if (doencaId === contexto.principalId) {
      return {
        ok: false,
        motivo: "Essa é a própria hipótese do diagnóstico: então ele se confirmou.",
      };
    }
    if (!contexto.possiveis.some((d) => d.id === doencaId)) {
      return { ok: false, motivo: "Essa doença não é desta cultura." };
    }
  }
  return {
    ok: true,
    pedido: { confirmado: false, doencaConfirmadaId: doencaId, comentario: texto || null },
  };
}

/** A frase que o caderno mostra para uma resposta já registrada. */
export function resumo(feedback: Feedback): string {
  if (feedback.confirmado) return "Confirmado no campo";
  if (feedback.doencaConfirmadaId === null) return "Não se confirmou";
  const nome = feedback.doencaConfirmadaNome ?? feedback.doencaConfirmadaId;
  return `Não se confirmou: era ${nome}`;
}

/** A escolha que reabre o formulário a partir da resposta registrada. */
export function escolhaDe(feedback: Feedback): Escolha {
  return feedback.confirmado
    ? { tipo: "confirmou" }
    : { tipo: "nao_confirmou", doencaId: feedback.doencaConfirmadaId };
}

/** A listagem da API (snake_case) para o tipo do app; `null` sem feedback. */
export function daListagem(c: {
  tem_feedback: boolean;
  confirmado?: boolean | null;
  doenca_confirmada_id?: string | null;
  doenca_confirmada_nome?: string | null;
  feedback_comentario?: string | null;
}): Feedback | null {
  // Uma cópia guardada antes desta versão traz só `tem_feedback`: há resposta,
  // mas não se sabe qual. Melhor não mostrar nada do que inventar.
  if (!c.tem_feedback || typeof c.confirmado !== "boolean") return null;
  return {
    confirmado: c.confirmado,
    doencaConfirmadaId: c.doenca_confirmada_id ?? null,
    doencaConfirmadaNome: c.doenca_confirmada_nome ?? null,
    comentario: c.feedback_comentario ?? null,
  };
}

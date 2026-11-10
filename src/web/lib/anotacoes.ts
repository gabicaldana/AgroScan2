/**
 * Regras das anotações livres (US21) que a tela aplica antes de chamar a API.
 *
 * A API é a autoridade: recusa texto vazio e devolve 403 a quem não escreveu a
 * anotação. Aqui a tela só evita oferecer o que vai ser recusado.
 */

import type { Anotacao } from "./api.ts";

/** O mesmo limite da API e do campo de texto. */
export const LIMITE_DE_TEXTO = 2000;

/** Só quem escreveu edita ou apaga. Os outros membros da horta só leem. */
export function podeAlterar(anotacao: Anotacao, usuarioId: number | null): boolean {
  return usuarioId !== null && anotacao.autor_id === usuarioId;
}

/**
 * Foi editada depois de escrita? O banco mantém `atualizada_em` por gatilho, e
 * na criação as duas datas saem da mesma transação. Um minuto de folga evita
 * marcar como editada a anotação corrigida logo em seguida.
 */
export function foiEditada(anotacao: Anotacao): boolean {
  const criada = Date.parse(anotacao.criada_em);
  const atualizada = Date.parse(anotacao.atualizada_em);
  if (Number.isNaN(criada) || Number.isNaN(atualizada)) return false;
  return atualizada - criada > 60_000;
}

/** O texto que vai para a API, ou `null` quando não há o que enviar. */
export function textoParaEnviar(bruto: string): string | null {
  const texto = bruto.trim();
  if (texto.length === 0 || texto.length > LIMITE_DE_TEXTO) return null;
  return texto;
}

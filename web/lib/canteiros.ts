/**
 * Os canteiros da pessoa, guardados no aparelho.
 *
 * A consulta nasce no canteiro, muitas vezes sem sinal. Para o produtor poder
 * dizer EM QUAL canteiro viu o sintoma (US25), a lista precisa estar no
 * aparelho antes de faltar rede: ela é atualizada sempre que há conexão e
 * lida da cópia quando não há.
 */

import * as api from "./api.ts";
import * as sessao from "./sessao.ts";

/** Busca no servidor e guarda; sem rede, devolve a última cópia. */
export async function atualizar(): Promise<api.Canteiro[]> {
  if (!sessao.autenticado()) return [];
  try {
    const lista = await api.listarMeusCanteiros();
    sessao.guardarCanteiros(lista);
    return lista;
  } catch {
    return guardados();
  }
}

export function guardados(): api.Canteiro[] {
  return sessao.canteirosGuardados<api.Canteiro>();
}

/**
 * Os canteiros que fazem sentido para uma consulta desta cultura.
 *
 * Só os da mesma cultura: o caso real é marcar sintomas de tomate e escolher
 * entre os canteiros de tomate. Oferecer o de alface só convida ao toque errado.
 */
export function daCultura(
  lista: readonly api.Canteiro[],
  culturaId: string,
): api.Canteiro[] {
  return lista.filter((c) => c.ativo && c.cultura_id === culturaId);
}

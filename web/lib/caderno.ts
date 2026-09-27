/**
 * O caderno de campo, costurando fila local, sessão e API.
 *
 * A ordem de leitura é sempre **local primeiro**. A tela mostra o que está no
 * aparelho, e só então enriquece com o que o servidor tem. Nunca o contrário:
 * um histórico que só aparece com rede não é um caderno de campo.
 *
 * Salvar também é local primeiro. `salvar` grava na fila e devolve na hora; o
 * envio é uma tentativa oportunista que pode falhar sem que o produtor perca
 * nada. Se a tela esperasse a resposta do servidor para confirmar, o app
 * pararia de funcionar exatamente onde precisa funcionar.
 */

import * as api from "./api.ts";
import * as fila from "./fila.ts";
import * as sessao from "./sessao.ts";
import { VERSAO_DA_BASE } from "./base-conhecimento.ts";
import type { Hipotese } from "./diagnostico.ts";

let armazenamento: fila.Armazenamento | null = null;

/** O armazenamento do app. Trocável nos testes. */
export function deposito(): fila.Armazenamento {
  if (armazenamento === null) armazenamento = fila.armazenamentoIndexedDB();
  return armazenamento;
}

export function usarDeposito(novo: fila.Armazenamento): void {
  armazenamento = novo;
}

/** Uma linha do histórico, venha ela da fila local ou do servidor. */
export type RegistroDoCaderno = {
  offlineId: string;
  culturaId: string;
  culturaNome: string;
  emoji: string | null;
  registradaEm: string;
  doencaId: string | null;
  doencaNome: string | null;
  compatibilidade: number | null;
  /** Ainda não confirmada pelo servidor: mostra o aviso de pendência. */
  pendente: boolean;
  /** Só existe depois de sincronizada. */
  id?: number;
  temFeedback?: boolean;
};

/**
 * Salva uma consulta.
 *
 * Grava na fila e tenta enviar. O retorno diz se subiu, mas a tela não deve
 * tratar `enviada: false` como erro: é o estado normal em campo.
 */
export async function salvar(
  culturaId: string,
  sintomas: Iterable<string>,
  hipoteses: readonly Hipotese[],
  coordenada?: { latitude: number; longitude: number } | null,
): Promise<{ offlineId: string; enviada: boolean }> {
  const offlineId = fila.novoOfflineId();

  await fila.enfileirar(deposito(), {
    offlineId,
    culturaId,
    sintomas: [...sintomas],
    hipoteses: hipoteses.map((h) => ({
      doencaId: h.doencaId,
      compatibilidade: h.compatibilidade,
    })),
    registradaEm: new Date().toISOString(),
    versaoCatalogo: VERSAO_DA_BASE,
    latitude: coordenada?.latitude ?? null,
    longitude: coordenada?.longitude ?? null,
  });

  if (!sessao.autenticado()) return { offlineId, enviada: false };

  const resultado = await sincronizar();
  return { offlineId, enviada: resultado.enviadas > 0 };
}

/**
 * Sobe a fila, se houver sessão.
 *
 * Chamada quando o app abre e quando a conexão volta. Não há sincronização em
 * segundo plano: o iOS não oferece Background Sync, e prometer o que a
 * plataforma não entrega seria pior que não prometer.
 */
export async function sincronizar(): Promise<fila.ResultadoDoDespacho> {
  if (!sessao.autenticado()) {
    return {
      enviadas: 0,
      duplicadas: 0,
      rejeitadas: [],
      restantes: await fila.quantasPendentes(deposito()),
      adiado: true,
    };
  }

  return fila.despachar(deposito(), (lote) =>
    api.sincronizar(
      lote.map((c) => ({
        offlineId: c.offlineId,
        culturaId: c.culturaId,
        sintomas: c.sintomas,
        hipoteses: c.hipoteses,
        registradaEm: c.registradaEm,
        versaoCatalogo: c.versaoCatalogo,
        latitude: c.latitude,
        longitude: c.longitude,
      })),
    ),
  );
}

/**
 * O histórico para a tela: o que está na fila mais o que o servidor tem.
 *
 * A fila entra primeiro e sempre — mesmo sem rede, mesmo sem conta. O servidor
 * é consultado só se houver sessão, e a falha dele não impede a listagem.
 */
export async function historico(
  detalhar: (culturaId: string, doencaId: string) => {
    culturaNome: string;
    emoji: string | null;
    doencaNome: string;
  } | null,
): Promise<{ registros: RegistroDoCaderno[]; servidorRespondeu: boolean }> {
  const locais = await fila.pendentes(deposito());

  const registros: RegistroDoCaderno[] = locais.map((c) => {
    const principal = c.hipoteses[0];
    const ficha = principal ? detalhar(c.culturaId, principal.doencaId) : null;
    return {
      offlineId: c.offlineId,
      culturaId: c.culturaId,
      culturaNome: ficha?.culturaNome ?? c.culturaId,
      emoji: ficha?.emoji ?? null,
      registradaEm: c.registradaEm,
      doencaId: principal?.doencaId ?? null,
      doencaNome: ficha?.doencaNome ?? null,
      compatibilidade: principal?.compatibilidade ?? null,
      pendente: true,
    };
  });

  if (!sessao.autenticado()) {
    return { registros: ordenar(registros), servidorRespondeu: false };
  }

  try {
    const remotas = await api.listarConsultas({ limite: 100 });
    const jaNaFila = new Set(registros.map((r) => r.offlineId));

    for (const c of remotas) {
      // A fila vence: se o mesmo registro está nos dois lugares, o local é o
      // que o produtor acabou de criar e ainda não teve confirmação lida.
      if (jaNaFila.has(c.offline_id)) continue;
      registros.push({
        id: c.id,
        offlineId: c.offline_id,
        culturaId: c.cultura_id,
        culturaNome: c.cultura_nome,
        emoji: c.emoji,
        registradaEm: c.registrada_em,
        doencaId: c.doenca_id,
        doencaNome: c.doenca_nome,
        compatibilidade: c.compatibilidade,
        pendente: false,
        temFeedback: c.tem_feedback,
      });
    }
    return { registros: ordenar(registros), servidorRespondeu: true };
  } catch {
    // Sem rede ou servidor fora: o caderno continua mostrando o que é local.
    return { registros: ordenar(registros), servidorRespondeu: false };
  }
}

function ordenar(registros: RegistroDoCaderno[]): RegistroDoCaderno[] {
  return [...registros].sort((a, b) =>
    b.registradaEm.localeCompare(a.registradaEm),
  );
}

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
import * as canteiros from "./canteiros.ts";
import * as feedback from "./feedback.ts";
import * as fila from "./fila.ts";
import * as sessao from "./sessao.ts";
import { catalogoAtivo } from "./catalogo.ts";
import type { Hipotese } from "./diagnostico.ts";

let armazenamento: fila.Armazenamento | null = null;

const LIMITE_DO_SERVIDOR = 200;

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
  /** O canteiro da consulta (US25); `null` quando foi feita sem canteiro. */
  canteiroId: number | null;
  canteiroNome: string | null;
  doencaId: string | null;
  doencaNome: string | null;
  compatibilidade: number | null;
  /** Ainda não confirmada pelo servidor: mostra o aviso de pendência. */
  pendente: boolean;
  /** Só existe depois de sincronizada. */
  id?: number;
  temFeedback?: boolean;
  /** O que foi respondido sobre o diagnóstico (US20), quando se sabe. */
  feedback?: feedback.Feedback | null;
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
  canteiroId?: number | null,
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
    // A versao do catalogo ATIVO, nao a embutida no bundle: a consulta pode
    // ter sido diagnosticada sobre uma base baixada depois do deploy (US36), e
    // registrar a versao errada quebraria a rastreabilidade entre o laudo
    // guardado e as fichas que o produziram.
    versaoCatalogo: catalogoAtivo().versao,
    latitude: coordenada?.latitude ?? null,
    longitude: coordenada?.longitude ?? null,
    canteiroId: canteiroId ?? null,
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
        canteiroId: c.canteiroId ?? null,
      })),
    ),
  );
}

/**
 * O histórico para a tela: o que está na fila mais o que o servidor tem.
 *
 * A fila entra primeiro e sempre - mesmo sem rede, mesmo sem conta. O servidor
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
  // O nome do canteiro de uma consulta que ainda não subiu vem da lista
  // guardada no aparelho, a mesma em que ele foi escolhido.
  const nomeDoCanteiro = new Map(
    canteiros.guardados().map((c) => [c.id, c.identificacao]),
  );

  const registros: RegistroDoCaderno[] = locais.map((c) => {
    const principal = c.hipoteses[0];
    const ficha = principal ? detalhar(c.culturaId, principal.doencaId) : null;
    return {
      offlineId: c.offlineId,
      culturaId: c.culturaId,
      culturaNome: ficha?.culturaNome ?? c.culturaId,
      emoji: ficha?.emoji ?? null,
      registradaEm: c.registradaEm,
      canteiroId: c.canteiroId ?? null,
      canteiroNome:
        c.canteiroId != null ? (nomeDoCanteiro.get(c.canteiroId) ?? null) : null,
      doencaId: principal?.doencaId ?? null,
      doencaNome: ficha?.doencaNome ?? null,
      compatibilidade: principal?.compatibilidade ?? null,
      pendente: true,
    };
  });

  if (!sessao.autenticado()) {
    return { registros: ordenar(registros), servidorRespondeu: false };
  }

  let remotas: api.ConsultaResumida[];
  let servidorRespondeu: boolean;
  try {
    // O limite máximo da API. O filtro roda no aparelho sobre esta lista, para
    // funcionar igual com e sem rede; registros além dela não aparecem.
    remotas = await api.listarConsultas({ limite: LIMITE_DO_SERVIDOR });
    sessao.guardarHistorico(remotas);
    servidorRespondeu = true;
  } catch {
    // Sem rede ou servidor fora: a última cópia que o servidor devolveu.
    remotas = sessao.historicoGuardado<api.ConsultaResumida>();
    servidorRespondeu = false;
  }

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
      canteiroId: c.canteiro_id ?? null,
      canteiroNome: c.canteiro_nome ?? null,
      doencaId: c.doenca_id,
      doencaNome: c.doenca_nome,
      compatibilidade: c.compatibilidade,
      pendente: false,
      temFeedback: c.tem_feedback,
      feedback: feedback.daListagem(c),
    });
  }
  return { registros: ordenar(registros), servidorRespondeu };
}

/**
 * Registra se o diagnóstico se confirmou (US20).
 *
 * Ao contrário de salvar uma consulta, precisa de rede: o feedback se prende
 * ao id que o servidor deu à consulta. Sem resposta, a falha sobe para a tela
 * dizer que é para tentar com sinal - nada se perde, a consulta continua lá.
 */
export async function responder(
  consultaId: number,
  pedido: feedback.PedidoDeFeedback,
): Promise<feedback.Feedback> {
  const salvo = await api.registrarFeedback(
    consultaId,
    pedido.confirmado,
    pedido.doencaConfirmadaId,
    pedido.comentario,
  );
  return {
    confirmado: salvo.confirmado,
    doencaConfirmadaId: salvo.doenca_confirmada_id,
    // O POST não devolve o nome; a tela o completa pelo catálogo.
    doencaConfirmadaNome: null,
    comentario: salvo.comentario,
  };
}

function ordenar(registros: RegistroDoCaderno[]): RegistroDoCaderno[] {
  return [...registros].sort((a, b) =>
    b.registradaEm.localeCompare(a.registradaEm),
  );
}

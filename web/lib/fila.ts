/**
 * A fila de consultas registradas sem rede.
 *
 * A regra que organiza tudo: **o aparelho é a fonte do registro até o servidor
 * confirmar**. O produtor marca sintomas no canteiro, recebe o laudo e salva —
 * e nada disso pode depender de sinal. A consulta entra aqui, e sobe depois.
 *
 * O envio NÃO acontece em segundo plano. No iOS não existe Background Sync, e
 * fingir que existe daria uma promessa que o app não cumpre. A fila é
 * despachada quando o app abre e quando a conexão volta com o app em uso —
 * momentos em que há JavaScript rodando de verdade.
 *
 * Cada consulta nasce com um `offlineId` (UUID) gerado aqui. É a chave de
 * idempotência: reenviar é o caso NORMAL, porque o aparelho não tem como saber
 * se a tentativa anterior chegou antes de a conexão cair. O servidor devolve
 * `criada: false` e nada duplica.
 *
 * O armazenamento entra por parâmetro em vez de ser importado: é o que permite
 * testar a fila inteira sem IndexedDB, do mesmo jeito que o classificador
 * falso permite testar a orquestração da imagem sem modelo.
 */

export type ConsultaPendente = {
  offlineId: string;
  culturaId: string;
  sintomas: string[];
  hipoteses: { doencaId: string; compatibilidade: number }[];
  registradaEm: string;
  versaoCatalogo: string;
  latitude?: number | null;
  longitude?: number | null;
  /** Quantas vezes já se tentou enviar. Só para diagnóstico na tela. */
  tentativas: number;
};

/** O mínimo que a fila precisa. IndexedDB no navegador, memória nos testes. */
export type Armazenamento = {
  ler(): Promise<ConsultaPendente[]>;
  gravar(consultas: ConsultaPendente[]): Promise<void>;
};

export function armazenamentoEmMemoria(
  inicial: ConsultaPendente[] = [],
): Armazenamento {
  let dados = [...inicial];
  return {
    async ler() {
      return [...dados];
    },
    async gravar(consultas) {
      dados = [...consultas];
    },
  };
}

const BANCO = "agroscan";
const DEPOSITO = "fila";
const CHAVE = "pendentes";

/**
 * IndexedDB, e não `localStorage`: a fila pode crescer com o produtor dias sem
 * sinal, e `localStorage` é síncrono e limitado a alguns megabytes — ele
 * travaria a interface justamente no aparelho mais fraco.
 */
export function armazenamentoIndexedDB(): Armazenamento {
  function abrir(): Promise<IDBDatabase> {
    return new Promise((resolver, rejeitar) => {
      const pedido = indexedDB.open(BANCO, 1);
      pedido.onupgradeneeded = () => {
        const bd = pedido.result;
        if (!bd.objectStoreNames.contains(DEPOSITO)) bd.createObjectStore(DEPOSITO);
      };
      pedido.onsuccess = () => resolver(pedido.result);
      pedido.onerror = () => rejeitar(pedido.error);
    });
  }

  return {
    async ler() {
      const bd = await abrir();
      try {
        return await new Promise<ConsultaPendente[]>((resolver, rejeitar) => {
          const pedido = bd
            .transaction(DEPOSITO, "readonly")
            .objectStore(DEPOSITO)
            .get(CHAVE);
          pedido.onsuccess = () => resolver(pedido.result ?? []);
          pedido.onerror = () => rejeitar(pedido.error);
        });
      } finally {
        bd.close();
      }
    },

    async gravar(consultas) {
      const bd = await abrir();
      try {
        await new Promise<void>((resolver, rejeitar) => {
          const transacao = bd.transaction(DEPOSITO, "readwrite");
          transacao.objectStore(DEPOSITO).put(consultas, CHAVE);
          transacao.oncomplete = () => resolver();
          transacao.onerror = () => rejeitar(transacao.error);
        });
      } finally {
        bd.close();
      }
    },
  };
}

/** UUID v4. `randomUUID` não existe em contexto inseguro nem em Safari antigo. */
export function novoOfflineId(): string {
  const fonte = globalThis.crypto;
  if (typeof fonte?.randomUUID === "function") return fonte.randomUUID();

  const bytes = new Uint8Array(16);
  fonte.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function pendentes(
  armazenamento: Armazenamento,
): Promise<ConsultaPendente[]> {
  return armazenamento.ler();
}

export async function quantasPendentes(
  armazenamento: Armazenamento,
): Promise<number> {
  return (await armazenamento.ler()).length;
}

/**
 * Coloca uma consulta na fila.
 *
 * Enfileirar a mesma `offlineId` duas vezes substitui em vez de duplicar: a
 * tela pode chamar isto de novo depois de uma falha de envio sem sujar a fila.
 */
export async function enfileirar(
  armazenamento: Armazenamento,
  consulta: Omit<ConsultaPendente, "tentativas">,
): Promise<ConsultaPendente> {
  const nova: ConsultaPendente = { ...consulta, tentativas: 0 };
  const atuais = await armazenamento.ler();
  const semDuplicata = atuais.filter((c) => c.offlineId !== nova.offlineId);
  await armazenamento.gravar([...semDuplicata, nova]);
  return nova;
}

export async function remover(
  armazenamento: Armazenamento,
  offlineIds: string[],
): Promise<void> {
  const remover = new Set(offlineIds);
  const atuais = await armazenamento.ler();
  await armazenamento.gravar(atuais.filter((c) => !remover.has(c.offlineId)));
}

export type ResultadoDoDespacho = {
  enviadas: number;
  duplicadas: number;
  rejeitadas: { offlineId: string; motivo: string }[];
  restantes: number;
  /** Sem rede: a fila ficou intacta e será tentada de novo. */
  adiado: boolean;
};

/**
 * Sobe a fila. Devolve o que aconteceu com cada item.
 *
 * O contrato de quem chama é `enviar`, que recebe o lote e devolve a partição
 * feita pelo servidor. Injetá-lo mantém esta função testável sem rede.
 */
export async function despachar(
  armazenamento: Armazenamento,
  enviar: (consultas: ConsultaPendente[]) => Promise<{
    aceitas: string[];
    duplicadas: string[];
    rejeitadas: { offline_id: string; motivo: string }[];
  }>,
): Promise<ResultadoDoDespacho> {
  const fila = await armazenamento.ler();
  if (fila.length === 0) {
    return { enviadas: 0, duplicadas: 0, rejeitadas: [], restantes: 0, adiado: false };
  }

  let resultado;
  try {
    resultado = await enviar(fila);
  } catch {
    // Falhou o lote inteiro — sem rede, ou servidor fora. A fila NÃO é
    // esvaziada nem alterada: perder o registro do produtor por causa de uma
    // falha de rede seria o pior desfecho possível deste app.
    const comTentativa = fila.map((c) => ({
      ...c,
      tentativas: c.tentativas + 1,
    }));
    await armazenamento.gravar(comTentativa);
    return {
      enviadas: 0,
      duplicadas: 0,
      rejeitadas: [],
      restantes: comTentativa.length,
      adiado: true,
    };
  }

  // Aceita e duplicada saem da fila pelo mesmo motivo: o servidor já tem.
  // Rejeitada FICA — o motivo é um defeito a corrigir, e descartar em silêncio
  // apagaria a observação de campo sem ninguém notar.
  const resolvidas = [...resultado.aceitas, ...resultado.duplicadas];
  await remover(armazenamento, resolvidas);

  const rejeitadas = resultado.rejeitadas.map((r) => ({
    offlineId: r.offline_id,
    motivo: r.motivo,
  }));

  return {
    enviadas: resultado.aceitas.length,
    duplicadas: resultado.duplicadas.length,
    rejeitadas,
    restantes: await quantasPendentes(armazenamento),
    adiado: false,
  };
}

/**
 * A foto anexada à consulta (US37, RF10; ADR 0016).
 *
 * A foto fica **só no aparelho**. Ela não sobe para o servidor: é evidência
 * para quem fotografou, e não insumo do diagnóstico, que continua sendo pelos
 * sintomas. O que decide isso está no ADR 0016; as regras que saem dele:
 *
 * - **Vínculo pelo `offlineId`.** A consulta nasce com ele na fila e o mantém
 *   depois de sincronizada, então a foto continua presa ao mesmo registro
 *   antes e depois de subir.
 * - **Sem metadados.** A foto do celular carrega EXIF, muitas vezes com a
 *   coordenada GPS exata. Ela é sempre recodificada num canvas antes de ser
 *   guardada, o que descarta o EXIF. Sem isso, a foto guardaria o ponto exato
 *   que a revisão LGPD (#75) decidiu não guardar.
 * - **Tamanho contido.** A captura é na resolução nativa da câmera; o que fica
 *   guardado tem até 2048 px no maior lado, em JPEG. Uma foto de 12 MP vira
 *   uns 500 kB, e o IndexedDB, que o iOS pode esvaziar sob pressão de espaço,
 *   não enche com algumas dezenas de consultas.
 * - **Banco próprio** (`agroscan-fotos`). A fila usa o banco `agroscan` na
 *   versão 1; criar outro depósito ali exigiria subir a versão, e um aparelho
 *   com o app antigo aberto em outra aba travaria a atualização.
 *
 * O armazenamento entra por parâmetro, como na fila: os testes rodam em
 * memória. A redução de imagem usa canvas e só roda no navegador.
 */

export type FotoGuardada = {
  offlineId: string;
  imagem: Blob;
  largura: number;
  altura: number;
  tiradaEm: string;
};

export type DepositoDeFotos = {
  ler(offlineId: string): Promise<FotoGuardada | null>;
  gravar(foto: FotoGuardada): Promise<void>;
  apagar(offlineId: string): Promise<void>;
  /** Os ids com foto, para o caderno marcar quais registros têm uma. */
  ids(): Promise<string[]>;
  apagarTodas(): Promise<void>;
};

/** O maior lado guardado, em pixels. */
export const LADO_MAXIMO = 2048;
export const QUALIDADE_JPEG = 0.85;

/** As dimensões depois da redução, mantendo a proporção. Nunca amplia. */
export function dimensoesReduzidas(
  largura: number,
  altura: number,
  maximo: number = LADO_MAXIMO,
): { largura: number; altura: number } {
  const maior = Math.max(largura, altura);
  if (maior <= maximo) return { largura, altura };
  const fator = maximo / maior;
  return {
    largura: Math.max(1, Math.round(largura * fator)),
    altura: Math.max(1, Math.round(altura * fator)),
  };
}

export function depositoEmMemoria(): DepositoDeFotos {
  const dados = new Map<string, FotoGuardada>();
  return {
    async ler(id) {
      return dados.get(id) ?? null;
    },
    async gravar(foto) {
      dados.set(foto.offlineId, foto);
    },
    async apagar(id) {
      dados.delete(id);
    },
    async ids() {
      return [...dados.keys()];
    },
    async apagarTodas() {
      dados.clear();
    },
  };
}

const BANCO = "agroscan-fotos";
const DEPOSITO = "fotos";

export function depositoIndexedDB(): DepositoDeFotos {
  function abrir(): Promise<IDBDatabase> {
    return new Promise((resolver, rejeitar) => {
      const pedido = indexedDB.open(BANCO, 1);
      pedido.onupgradeneeded = () => {
        const bd = pedido.result;
        if (!bd.objectStoreNames.contains(DEPOSITO)) {
          bd.createObjectStore(DEPOSITO, { keyPath: "offlineId" });
        }
      };
      pedido.onsuccess = () => resolver(pedido.result);
      pedido.onerror = () => rejeitar(pedido.error);
    });
  }

  async function transacao<T>(
    modo: IDBTransactionMode,
    operar: (deposito: IDBObjectStore) => IDBRequest | null,
  ): Promise<T> {
    const bd = await abrir();
    try {
      return await new Promise<T>((resolver, rejeitar) => {
        const t = bd.transaction(DEPOSITO, modo);
        const pedido = operar(t.objectStore(DEPOSITO));
        t.oncomplete = () => resolver((pedido?.result ?? null) as T);
        t.onerror = () => rejeitar(t.error);
      });
    } finally {
      bd.close();
    }
  }

  return {
    ler: (id) => transacao<FotoGuardada | null>("readonly", (d) => d.get(id)),
    gravar: (foto) => transacao<void>("readwrite", (d) => d.put(foto)),
    apagar: (id) => transacao<void>("readwrite", (d) => d.delete(id)),
    ids: async () =>
      ((await transacao<IDBValidKey[]>("readonly", (d) => d.getAllKeys())) ?? []).map(String),
    apagarTodas: () => transacao<void>("readwrite", (d) => d.clear()),
  };
}

let deposito: DepositoDeFotos | null = null;

/** O depósito do app. Trocável nos testes. */
export function depositoDoApp(): DepositoDeFotos {
  if (deposito === null) deposito = depositoIndexedDB();
  return deposito;
}

export function usarDeposito(novo: DepositoDeFotos): void {
  deposito = novo;
}

/**
 * Reduz e recodifica a foto da câmera. Só no navegador.
 *
 * `createImageBitmap` respeita a orientação gravada pela câmera, e o canvas
 * sai sem EXIF: é aqui que a coordenada embutida na foto é descartada.
 */
export async function prepararFoto(
  arquivo: Blob,
): Promise<{ imagem: Blob; largura: number; altura: number }> {
  const bitmap = await createImageBitmap(arquivo, { imageOrientation: "from-image" });
  try {
    const { largura, altura } = dimensoesReduzidas(bitmap.width, bitmap.height);
    const tela = document.createElement("canvas");
    tela.width = largura;
    tela.height = altura;
    const contexto = tela.getContext("2d");
    if (!contexto) throw new Error("canvas indisponível");
    contexto.drawImage(bitmap, 0, 0, largura, altura);
    const imagem = await new Promise<Blob>((resolver, rejeitar) =>
      tela.toBlob(
        (b) => (b ? resolver(b) : rejeitar(new Error("falha ao gerar a imagem"))),
        "image/jpeg",
        QUALIDADE_JPEG,
      ),
    );
    return { imagem, largura, altura };
  } finally {
    bitmap.close();
  }
}

/** Guarda a foto já preparada, presa à consulta. Substitui a anterior. */
export async function anexar(
  offlineId: string,
  preparada: { imagem: Blob; largura: number; altura: number },
  agora: Date = new Date(),
  alvo: DepositoDeFotos = depositoDoApp(),
): Promise<void> {
  await alvo.gravar({ offlineId, ...preparada, tiradaEm: agora.toISOString() });
}

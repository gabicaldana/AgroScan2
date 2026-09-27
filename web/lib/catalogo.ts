/**
 * Catalogo ativo: o embutido no bundle, ou um mais novo baixado da API.
 *
 * O app nasce com a base embutida (`base-conhecimento.ts`), gerada em tempo de
 * build. Isso e o que faz o diagnostico funcionar em modo aviao na primeira
 * abertura, sem nunca ter visto a rede. Mas a curadoria agronomica continua
 * depois do deploy, e obrigar o produtor a reinstalar o app para receber uma
 * ficha de doenca nova seria perder justamente quem tem sinal ruim.
 *
 * Dai este modulo: guarda um catalogo baixado em `localStorage` e o entrega no
 * lugar do embutido quando for mais novo.
 *
 * `localStorage`, e nao IndexedDB como a fila do caderno: o catalogo e um
 * documento so, limitado pelo escopo do projeto (24 culturas, 88 doencas), e
 * precisa ser lido de forma SINCRONA na montagem dos indices do motor. A fila
 * escolheu IndexedDB pelo motivo oposto - ela cresce sem teto enquanto o
 * produtor fica sem sinal.
 *
 * Tres invariantes que este modulo nao pode quebrar:
 *
 *   1. Sem rede, o app funciona. Toda a sincronizacao e oportunista: falha em
 *      silencio e o diagnostico segue sobre o catalogo que ja existe.
 *   2. Um catalogo guardado corrompido nunca derruba o app. Qualquer leitura
 *      suspeita volta para o embutido.
 *   3. O servidor NAO e autoridade sobre a resposta, so sobre o conteudo. O
 *      calculo continua no aparelho (ADR 0001).
 */

import {
  CULTURAS,
  ORGAOS,
  SINTOMAS,
  VERSAO_DA_BASE,
  type Cultura,
  type Orgao,
  type Sintoma,
} from "./base-conhecimento.ts";

export type Catalogo = {
  versao: string;
  orgaos: readonly Orgao[];
  sintomas: readonly Sintoma[];
  culturas: readonly Cultura[];
};

/** O que veio no bundle. Nunca muda, e e o piso de que o app dispoe. */
export const EMBUTIDO: Catalogo = {
  versao: VERSAO_DA_BASE,
  orgaos: ORGAOS,
  sintomas: SINTOMAS,
  culturas: CULTURAS,
};

const CHAVE = "agroscan:catalogo";

/* ------------------------------------------------------------- conversao */

/**
 * snake_case -> camelCase, recursivo.
 *
 * A MESMA conversao que `web/scripts/gerar-base.mjs` aplica em tempo de build.
 * Ela precisa existir duas vezes porque as duas entradas do catalogo sao
 * diferentes: o gerador le o JSON curado do repositorio, e este modulo le a
 * resposta da API - que serve os objetos crus do Python, em snake_case.
 *
 * Sem isto, `nomeCientifico`, `tipoAgente` e `ingredientesAtivos` chegariam
 * como `undefined` e a falha apareceria so na tela do laudo, longe da causa.
 */
export function paraCamel(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(paraCamel);
  if (valor === null || typeof valor !== "object") return valor;

  return Object.fromEntries(
    Object.entries(valor as Record<string, unknown>)
      .filter(([chave]) => !chave.startsWith("_"))
      .map(([chave, v]) => [
        chave.replace(/_([a-z])/g, (_, letra: string) => letra.toUpperCase()),
        paraCamel(v),
      ]),
  );
}

/* -------------------------------------------------------------- validacao */

/**
 * Um catalogo so e aceito se tiver a forma esperada e conteudo nao vazio.
 *
 * Nao e validacao agronomica - essa e do `app/validacao.py`, no servidor, e
 * roda antes de a base virar release. Aqui a pergunta e outra: isto que chegou
 * do `localStorage` ou da rede pode substituir a base sem quebrar o motor?
 */
export function pareceCatalogo(valor: unknown): valor is Catalogo {
  if (valor === null || typeof valor !== "object") return false;
  const c = valor as Partial<Catalogo>;

  if (typeof c.versao !== "string" || c.versao === "") return false;
  if (!Array.isArray(c.orgaos) || c.orgaos.length === 0) return false;
  if (!Array.isArray(c.sintomas) || c.sintomas.length === 0) return false;
  if (!Array.isArray(c.culturas) || c.culturas.length === 0) return false;

  // Uma amostra de cada lista: id presente, e a cultura com o formato de
  // doencas que o motor indexa. Conferir tudo seria varrer a base inteira a
  // cada abertura, por um ganho que o servidor ja garantiu.
  const s = c.sintomas[0] as Partial<Sintoma>;
  if (typeof s?.id !== "string" || typeof s?.orgao !== "string") return false;

  const cultura = c.culturas[0] as Partial<Cultura>;
  if (typeof cultura?.id !== "string") return false;
  if (!Array.isArray(cultura?.doencas)) return false;

  return true;
}

/**
 * `a` e mais nova que `b`?
 *
 * As versoes tem o formato `AAAA.MM.DD`, com mes e dia sempre em dois digitos
 * - garantido pelo `atualizado_em` da base curada. Nesse formato a ordem
 * lexicografica coincide com a cronologica, e comparar string basta.
 */
export function maisNova(a: string, b: string): boolean {
  return a > b;
}

/* ------------------------------------------------------------ persistencia */

/**
 * Le o catalogo guardado. Devolve `null` em qualquer sinal de problema.
 *
 * `localStorage` lanca em janela anonima com dados de site bloqueados, e
 * durante a captura de miniatura - o mesmo cuidado que `sessao.ts` toma.
 */
export function lerGuardado(): Catalogo | null {
  let cru: string | null;
  try {
    if (typeof localStorage === "undefined") return null;
    cru = localStorage.getItem(CHAVE);
  } catch {
    // Armazenamento bloqueado. Nao ha o que ler nem o que limpar.
    return null;
  }
  if (!cru) return null;

  try {
    const valor = JSON.parse(cru);
    if (pareceCatalogo(valor)) return valor;
  } catch {
    // JSON truncado - escrita interrompida, cota estourada no meio do
    // `setItem`, aba fechada. Cai no descarte abaixo, junto com o caso de
    // forma invalida: os dois deixam lixo que nunca sera usado e que seria
    // reparseado a cada abertura do app.
  }

  esquecerGuardado();
  return null;
}

export function guardar(catalogo: Catalogo): boolean {
  try {
    if (typeof localStorage === "undefined") return false;
    localStorage.setItem(CHAVE, JSON.stringify(catalogo));
    return true;
  } catch {
    // Cota estourada ou armazenamento bloqueado. O app segue com o embutido.
    return false;
  }
}

export function esquecerGuardado(): void {
  try {
    localStorage?.removeItem(CHAVE);
  } catch {
    /* nada a fazer */
  }
}

/* ------------------------------------------------------------------ ativo */

let ativo: Catalogo = EMBUTIDO;
const ouvintes = new Set<() => void>();

/**
 * Promove o catalogo guardado, se houver um mais novo que o embutido.
 *
 * Chamada uma vez na abertura, pelo cliente. NAO roda no import: o modulo e
 * avaliado tambem na geracao estatica das paginas, onde `localStorage` nao
 * existe e onde usar um catalogo diferente do embutido produziria HTML
 * divergente do que o navegador monta na hidratacao.
 */
export function promoverGuardado(): void {
  const guardado = lerGuardado();
  if (guardado && maisNova(guardado.versao, EMBUTIDO.versao)) {
    definirAtivo(guardado);
  }
}

export function catalogoAtivo(): Catalogo {
  return ativo;
}

function definirAtivo(novo: Catalogo): void {
  if (novo === ativo || novo.versao === ativo.versao) return;
  ativo = novo;
  for (const ouvinte of ouvintes) ouvinte();
}

/** Assinatura no formato que `useSyncExternalStore` espera. */
export function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/** Volta ao embutido e apaga o guardado. Existe para os testes e para o caso
 *  de um catalogo baixado se revelar problematico em campo. */
export function reverterAoEmbutido(): void {
  esquecerGuardado();
  definirAtivo(EMBUTIDO);
}

/* ------------------------------------------------------------ sincronizacao */

export type ResultadoDaSincronizacao =
  | { estado: "atualizado"; de: string; para: string }
  | { estado: "ja-atual"; versao: string }
  | { estado: "sem-rede" }
  | { estado: "recusado"; motivo: string };

type Buscar = typeof fetch;

/**
 * Verifica a versao publicada e baixa o catalogo so se for mais nova.
 *
 * Duas requisicoes, e a primeira e barata de proposito: `/catalogo/versao`
 * devolve meia duzia de campos, enquanto `/catalogo` traz a base inteira. Na
 * maioria das aberturas a resposta e "ja atual" e nada mais trafega - o que
 * importa para quem paga a internet por megabyte.
 *
 * Nunca lanca. Sem rede, com a API fora do ar ou com resposta malformada, o
 * app continua sobre o catalogo que ja tem. A atualizacao e uma melhoria
 * oportunista, nao um passo do fluxo de diagnostico.
 */
export async function sincronizar(
  buscar: Buscar = fetch,
): Promise<ResultadoDaSincronizacao> {
  let versaoPublicada: string;
  try {
    const r = await buscar("/api/v1/catalogo/versao");
    if (!r.ok) return { estado: "recusado", motivo: `HTTP ${r.status}` };
    const corpo = await r.json();
    if (typeof corpo?.versao !== "string") {
      return { estado: "recusado", motivo: "resposta sem versao" };
    }
    versaoPublicada = corpo.versao;
  } catch {
    return { estado: "sem-rede" };
  }

  const atual = catalogoAtivo().versao;
  if (!maisNova(versaoPublicada, atual)) {
    return { estado: "ja-atual", versao: atual };
  }

  let baixado: unknown;
  try {
    const r = await buscar("/api/v1/catalogo");
    if (!r.ok) return { estado: "recusado", motivo: `HTTP ${r.status}` };
    baixado = paraCamel(await r.json());
  } catch {
    return { estado: "sem-rede" };
  }

  if (!pareceCatalogo(baixado)) {
    return { estado: "recusado", motivo: "catalogo malformado" };
  }

  // A versao do corpo tem que bater com a que foi anunciada. Divergir aqui
  // significa que o servidor trocou de release entre as duas requisicoes, e
  // guardar o resultado gravaria um estado que ninguem prometeu.
  if (baixado.versao !== versaoPublicada) {
    return { estado: "recusado", motivo: "versao divergente entre as rotas" };
  }

  guardar(baixado);
  definirAtivo(baixado);
  return { estado: "atualizado", de: atual, para: baixado.versao };
}

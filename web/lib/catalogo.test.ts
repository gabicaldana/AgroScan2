/**
 * Testes da atualizacao de catalogo sem reinstalacao (US36).
 *
 * O que esta sob teste nao e o conteudo agronomico - disso cuida
 * `app/validacao.py` antes de a base virar release. Aqui a pergunta e a da
 * robustez: o app sobrevive a uma resposta ruim, a `localStorage` bloqueado e
 * a ausencia de rede, e continua diagnosticando?
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  EMBUTIDO,
  catalogoAtivo,
  esquecerGuardado,
  guardar,
  lerGuardado,
  maisNova,
  paraCamel,
  pareceCatalogo,
  promoverGuardado,
  reverterAoEmbutido,
  sincronizar,
  type Catalogo,
} from "./catalogo.ts";

/* ------------------------------------------------- dubles de localStorage */

type Loja = { [k: string]: string };

function fingirLocalStorage(inicial: Loja = {}, quebrado = false) {
  const loja: Loja = { ...inicial };
  const falso = {
    getItem(k: string) {
      if (quebrado) throw new Error("bloqueado");
      return k in loja ? loja[k] : null;
    },
    setItem(k: string, v: string) {
      if (quebrado) throw new Error("cota estourada");
      loja[k] = v;
    },
    removeItem(k: string) {
      if (quebrado) throw new Error("bloqueado");
      delete loja[k];
    },
  };
  (globalThis as { localStorage?: unknown }).localStorage = falso;
  return loja;
}

function semLocalStorage() {
  delete (globalThis as { localStorage?: unknown }).localStorage;
}

/** Catalogo minimo valido, com versao controlada. */
function catalogoFalso(versao: string): Catalogo {
  return {
    versao,
    orgaos: [{ id: "folha", rotulo: "Na folha", ordem: 1 }],
    sintomas: [{ id: "s1", nome: "Sintoma", orgao: "folha" }],
    culturas: [
      {
        id: "c1",
        nome: "Cultura",
        nomeCientifico: "Testus testus",
        grupo: "folha",
        familia: "Testaceae",
        emoji: "\u{1F33F}",
        cicloDias: 30,
        doencas: [
          {
            id: "d1",
            nome: "Doenca",
            agente: "Agente",
            tipoAgente: "fungo",
            gravidade: 3,
            descricao: ".",
            sintomas: [{ id: "s1", peso: 1.0 }],
            condicoesFavoraveis: {
              temperatura: ".",
              umidade: ".",
              observacao: ".",
            },
            tratamentos: [{ tipo: "cultural", descricao: "." }],
            ingredientesAtivos: [],
          },
        ],
      },
    ],
  } as unknown as Catalogo;
}

function respostaJson(corpo: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => corpo,
  } as unknown as Response;
}

afterEach(() => {
  reverterAoEmbutido();
  semLocalStorage();
});

/* --------------------------------------------------------------- conversao */

describe("paraCamel", () => {
  it("converte snake_case recursivamente, como o gerador do build", () => {
    const entrada = {
      nome_cientifico: "Brassica oleracea",
      ciclo_dias: 70,
      doencas: [{ tipo_agente: "fungo", ingredientes_ativos: [] }],
    };
    assert.deepEqual(paraCamel(entrada), {
      nomeCientifico: "Brassica oleracea",
      cicloDias: 70,
      doencas: [{ tipoAgente: "fungo", ingredientesAtivos: [] }],
    });
  });

  it("descarta as chaves de comentario do JSON curado", () => {
    assert.deepEqual(paraCamel({ _comentario: "nota", versao: "1" }), {
      versao: "1",
    });
  });
});

/* -------------------------------------------------------------- comparacao */

describe("maisNova", () => {
  it("ordena o formato AAAA.MM.DD cronologicamente", () => {
    assert.equal(maisNova("2026.09.27", "2026.09.03"), true);
    assert.equal(maisNova("2026.10.01", "2026.09.30"), true);
    assert.equal(maisNova("2027.01.01", "2026.12.31"), true);
  });

  it("nao considera a mesma versao mais nova", () => {
    assert.equal(maisNova("2026.09.27", "2026.09.27"), false);
    assert.equal(maisNova("2026.09.03", "2026.09.27"), false);
  });
});

/* -------------------------------------------------------------- validacao */

describe("pareceCatalogo", () => {
  it("aceita um catalogo bem formado", () => {
    assert.equal(pareceCatalogo(catalogoFalso("2027.01.01")), true);
  });

  it("recusa o que nao tem forma de catalogo", () => {
    for (const ruim of [
      null,
      undefined,
      "texto",
      42,
      {},
      { versao: "" },
      { versao: "1", orgaos: [], sintomas: [], culturas: [] },
      { ...catalogoFalso("1"), culturas: [] },
      { ...catalogoFalso("1"), sintomas: [{ semId: true }] },
      { ...catalogoFalso("1"), culturas: [{ id: "c", doencas: "nao-e-lista" }] },
    ]) {
      assert.equal(pareceCatalogo(ruim), false, `deveria recusar: ${JSON.stringify(ruim)}`);
    }
  });
});

/* ------------------------------------------------------------ persistencia */

describe("armazenamento local", () => {
  it("guarda e le de volta", () => {
    fingirLocalStorage();
    const cat = catalogoFalso("2027.01.01");
    assert.equal(guardar(cat), true);
    assert.deepEqual(lerGuardado(), cat);
  });

  it("devolve null quando nao ha nada guardado", () => {
    fingirLocalStorage();
    assert.equal(lerGuardado(), null);
  });

  it("descarta e apaga um guardado corrompido", () => {
    const loja = fingirLocalStorage({ "agroscan:catalogo": "{ nao e json" });
    assert.equal(lerGuardado(), null);
    assert.equal("agroscan:catalogo" in loja, false);
  });

  it("descarta um guardado com forma invalida", () => {
    const loja = fingirLocalStorage({
      "agroscan:catalogo": JSON.stringify({ versao: "9999.99.99" }),
    });
    assert.equal(lerGuardado(), null);
    assert.equal("agroscan:catalogo" in loja, false);
  });

  it("nao quebra quando localStorage lanca", () => {
    fingirLocalStorage({}, true);
    assert.equal(lerGuardado(), null);
    assert.equal(guardar(catalogoFalso("2027.01.01")), false);
    assert.doesNotThrow(() => esquecerGuardado());
  });

  it("nao quebra quando localStorage nem existe", () => {
    semLocalStorage();
    assert.equal(lerGuardado(), null);
    assert.equal(guardar(catalogoFalso("2027.01.01")), false);
  });
});

/* ----------------------------------------------------------------- ativo */

describe("promoverGuardado", () => {
  it("promove um catalogo guardado mais novo que o embutido", () => {
    fingirLocalStorage();
    guardar(catalogoFalso("2999.12.31"));
    promoverGuardado();
    assert.equal(catalogoAtivo().versao, "2999.12.31");
  });

  it("ignora um guardado mais velho que o embutido", () => {
    fingirLocalStorage();
    guardar(catalogoFalso("1999.01.01"));
    promoverGuardado();
    assert.equal(catalogoAtivo().versao, EMBUTIDO.versao);
  });

  it("sem localStorage, mantem o embutido", () => {
    semLocalStorage();
    promoverGuardado();
    assert.equal(catalogoAtivo(), EMBUTIDO);
  });
});

/* ----------------------------------------------------------- sincronizacao */

describe("sincronizar", () => {
  beforeEach(() => fingirLocalStorage());

  it("baixa e aplica quando a versao publicada e mais nova", async () => {
    const novo = catalogoFalso("2999.12.31");
    const r = await sincronizar(async (url) =>
      String(url).endsWith("/versao")
        ? respostaJson({ versao: "2999.12.31" })
        : respostaJson(novo),
    );
    assert.deepEqual(r, {
      estado: "atualizado",
      de: EMBUTIDO.versao,
      para: "2999.12.31",
    });
    assert.equal(catalogoAtivo().versao, "2999.12.31");
    assert.equal(lerGuardado()?.versao, "2999.12.31");
  });

  it("nao baixa a base inteira quando ja esta atual", async () => {
    let baixouTudo = false;
    const r = await sincronizar(async (url) => {
      if (String(url).endsWith("/versao")) {
        return respostaJson({ versao: EMBUTIDO.versao });
      }
      baixouTudo = true;
      return respostaJson(catalogoFalso("1"));
    });
    assert.deepEqual(r, { estado: "ja-atual", versao: EMBUTIDO.versao });
    assert.equal(baixouTudo, false, "a rota cara nao devia ser chamada");
  });

  it("sem rede, nao lanca e mantem o catalogo em uso", async () => {
    const r = await sincronizar(async () => {
      throw new TypeError("Failed to fetch");
    });
    assert.deepEqual(r, { estado: "sem-rede" });
    assert.equal(catalogoAtivo(), EMBUTIDO);
  });

  it("recusa resposta HTTP de erro", async () => {
    const r = await sincronizar(async () => respostaJson(null, false, 503));
    assert.deepEqual(r, { estado: "recusado", motivo: "HTTP 503" });
    assert.equal(catalogoAtivo(), EMBUTIDO);
  });

  it("recusa catalogo malformado sem guardar nada", async () => {
    const r = await sincronizar(async (url) =>
      String(url).endsWith("/versao")
        ? respostaJson({ versao: "2999.12.31" })
        : respostaJson({ versao: "2999.12.31", culturas: "nao-e-lista" }),
    );
    assert.deepEqual(r, { estado: "recusado", motivo: "catalogo malformado" });
    assert.equal(catalogoAtivo(), EMBUTIDO);
    assert.equal(lerGuardado(), null);
  });

  it("recusa quando o corpo nao confere com a versao anunciada", async () => {
    // O servidor trocou de release entre as duas requisicoes. Guardar isso
    // gravaria um estado que ninguem prometeu.
    const r = await sincronizar(async (url) =>
      String(url).endsWith("/versao")
        ? respostaJson({ versao: "2999.12.31" })
        : respostaJson(catalogoFalso("2999.12.30")),
    );
    assert.deepEqual(r, {
      estado: "recusado",
      motivo: "versao divergente entre as rotas",
    });
    assert.equal(lerGuardado(), null);
  });

  it("com localStorage bloqueado, ainda aplica na sessao corrente", async () => {
    // Guardar falha, mas a atualizacao vale para esta sessao: recusar tudo
    // porque o disco nao aceita seria punir o usuario duas vezes.
    fingirLocalStorage({}, true);
    const r = await sincronizar(async (url) =>
      String(url).endsWith("/versao")
        ? respostaJson({ versao: "2999.12.31" })
        : respostaJson(catalogoFalso("2999.12.31")),
    );
    assert.equal(r.estado, "atualizado");
    assert.equal(catalogoAtivo().versao, "2999.12.31");
  });
});

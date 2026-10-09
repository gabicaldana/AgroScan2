/**
 * Testes da fila offline.
 *
 * Nenhum deles usa IndexedDB nem rede: o armazenamento e o envio entram por
 * parâmetro. O que está sob teste é a REGRA — o que sai da fila, o que fica, e
 * o que acontece quando o envio falha inteiro.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  armazenamentoEmMemoria,
  despachar,
  enfileirar,
  novoOfflineId,
  pendentes,
  quantasPendentes,
  remover,
  type ConsultaPendente,
} from "./fila.ts";

function consulta(offlineId: string): Omit<ConsultaPendente, "tentativas"> {
  return {
    offlineId,
    culturaId: "tomate",
    sintomas: ["manchas_escuras_aneis"],
    hipoteses: [{ doencaId: "tomate_pinta_preta", compatibilidade: 0.48276 }],
    registradaEm: "2026-09-08T12:00:00.000Z",
    versaoCatalogo: "2026.09.03",
  };
}

const respostaVazia = { aceitas: [], duplicadas: [], rejeitadas: [] };

describe("enfileirar", () => {
  test("a consulta entra na fila", async () => {
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    assert.equal(await quantasPendentes(arm), 1);
  });

  test("a mesma offlineId substitui em vez de duplicar", async () => {
    // A tela pode reenfileirar depois de uma falha de envio; isso nao pode
    // sujar a fila com copias do mesmo registro.
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await enfileirar(arm, consulta("a"));
    assert.equal(await quantasPendentes(arm), 1);
  });

  test("a consulta nasce com zero tentativas", async () => {
    const arm = armazenamentoEmMemoria();
    const nova = await enfileirar(arm, consulta("a"));
    assert.equal(nova.tentativas, 0);
  });
});

describe("novoOfflineId", () => {
  test("gera UUID no formato esperado pelo servidor", () => {
    const id = novoOfflineId();
    assert.match(
      id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  test("nao repete", () => {
    const ids = new Set(Array.from({ length: 500 }, novoOfflineId));
    assert.equal(ids.size, 500);
  });
});

describe("despachar", () => {
  test("fila vazia nao chama o servidor", async () => {
    const arm = armazenamentoEmMemoria();
    let chamou = false;
    const r = await despachar(arm, async () => {
      chamou = true;
      return respostaVazia;
    });
    assert.equal(chamou, false);
    assert.equal(r.enviadas, 0);
  });

  test("aceitas saem da fila", async () => {
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await enfileirar(arm, consulta("b"));

    const r = await despachar(arm, async () => ({
      aceitas: ["a", "b"],
      duplicadas: [],
      rejeitadas: [],
    }));

    assert.equal(r.enviadas, 2);
    assert.equal(r.restantes, 0);
    assert.equal(await quantasPendentes(arm), 0);
  });

  test("duplicadas tambem saem: o servidor ja tem", async () => {
    // Reenvio e o caso normal - o aparelho nao sabe se a tentativa anterior
    // chegou antes de a conexao cair. Duplicada nao e erro.
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));

    const r = await despachar(arm, async () => ({
      aceitas: [],
      duplicadas: ["a"],
      rejeitadas: [],
    }));

    assert.equal(r.duplicadas, 1);
    assert.equal(await quantasPendentes(arm), 0);
  });

  test("rejeitada FICA na fila, com o motivo", async () => {
    // Descartar em silencio apagaria a observacao de campo sem ninguem notar.
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await enfileirar(arm, consulta("ruim"));

    const r = await despachar(arm, async () => ({
      aceitas: ["a"],
      duplicadas: [],
      rejeitadas: [{ offline_id: "ruim", motivo: "cultura desconhecida" }],
    }));

    assert.equal(r.enviadas, 1);
    assert.equal(r.rejeitadas.length, 1);
    assert.equal(r.rejeitadas[0].motivo, "cultura desconhecida");
    assert.equal(r.restantes, 1);

    const restou = await pendentes(arm);
    assert.deepEqual(restou.map((c) => c.offlineId), ["ruim"]);
  });

  test("sem rede, a fila fica INTACTA e o despacho e adiado", async () => {
    // ESTE e o teste que justifica a fila existir. Perder o registro do
    // produtor por causa de uma falha de rede seria o pior desfecho do app.
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await enfileirar(arm, consulta("b"));

    const r = await despachar(arm, async () => {
      throw new Error("sem conexão");
    });

    assert.equal(r.adiado, true);
    assert.equal(r.enviadas, 0);
    assert.equal(r.restantes, 2);
    assert.equal(await quantasPendentes(arm), 2);
  });

  test("a falha de rede conta a tentativa, sem perder o conteudo", async () => {
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));

    await despachar(arm, async () => {
      throw new Error("sem conexão");
    });
    await despachar(arm, async () => {
      throw new Error("sem conexão");
    });

    const [pendente] = await pendentes(arm);
    assert.equal(pendente.tentativas, 2);
    assert.deepEqual(pendente.sintomas, ["manchas_escuras_aneis"]);
    assert.equal(pendente.culturaId, "tomate");
  });

  test("o lote enviado preserva o que o motor calculou", async () => {
    // O servidor registra, nao recalcula: a compatibilidade que sobe e a que
    // o produtor viu na tela, apurada contra a versao daquele catalogo.
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));

    let recebido: ConsultaPendente[] = [];
    await despachar(arm, async (lote) => {
      recebido = lote;
      return { aceitas: ["a"], duplicadas: [], rejeitadas: [] };
    });

    assert.equal(recebido.length, 1);
    assert.equal(recebido[0].hipoteses[0].compatibilidade, 0.48276);
    assert.equal(recebido[0].versaoCatalogo, "2026.09.03");
    assert.equal(recebido[0].registradaEm, "2026-09-08T12:00:00.000Z");
  });
});

describe("remover", () => {
  test("tira so o que foi pedido", async () => {
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await enfileirar(arm, consulta("b"));
    await enfileirar(arm, consulta("c"));

    await remover(arm, ["a", "c"]);

    const restou = await pendentes(arm);
    assert.deepEqual(restou.map((x) => x.offlineId), ["b"]);
  });

  test("remover id inexistente nao quebra", async () => {
    const arm = armazenamentoEmMemoria();
    await enfileirar(arm, consulta("a"));
    await remover(arm, ["nao_existe"]);
    assert.equal(await quantasPendentes(arm), 1);
  });
});

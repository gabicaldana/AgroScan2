/**
 * Testes do filtro do caderno.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  SEM_FILTRO,
  culturasPresentes,
  filtrar,
  inicioDoPeriodo,
} from "./filtro-caderno.ts";

const AGORA = new Date("2026-10-08T12:00:00.000Z");

function registro(offlineId: string, culturaId: string, registradaEm: string) {
  const nomes: Record<string, string> = {
    tomate: "Tomate",
    batata: "Batata",
    pimentao: "Pimentão",
  };
  return {
    offlineId,
    culturaId,
    culturaNome: nomes[culturaId] ?? culturaId,
    emoji: null,
    registradaEm,
  };
}

const REGISTROS = [
  registro("a", "tomate", "2026-10-07T09:00:00.000Z"), // ontem
  registro("b", "batata", "2026-09-20T09:00:00+00:00"), // 18 dias, formato do servidor
  registro("c", "tomate", "2026-08-01T09:00:00.000Z"), // 68 dias
  registro("d", "pimentao", "2026-05-01T09:00:00.000Z"), // mais de 90 dias
];

const ids = (lista: { offlineId: string }[]) => lista.map((r) => r.offlineId);

describe("filtrar", () => {
  test("sem filtro, tudo passa", () => {
    assert.deepEqual(ids(filtrar(REGISTROS, SEM_FILTRO, AGORA)), ["a", "b", "c", "d"]);
  });

  test("por período", () => {
    const f = (periodo: "7d" | "30d" | "90d") =>
      ids(filtrar(REGISTROS, { periodo, culturaId: null }, AGORA));
    assert.deepEqual(f("7d"), ["a"]);
    assert.deepEqual(f("30d"), ["a", "b"]);
    assert.deepEqual(f("90d"), ["a", "b", "c"]);
  });

  test("por cultura", () => {
    const r = filtrar(REGISTROS, { periodo: "tudo", culturaId: "tomate" }, AGORA);
    assert.deepEqual(ids(r), ["a", "c"]);
  });

  test("período e cultura combinados", () => {
    const r = filtrar(REGISTROS, { periodo: "30d", culturaId: "tomate" }, AGORA);
    assert.deepEqual(ids(r), ["a"]);
  });

  test("o limite do período é inclusivo", () => {
    const exato = registro("x", "tomate", "2026-10-01T12:00:00.000Z");
    const r = filtrar([exato], { periodo: "7d", culturaId: null }, AGORA);
    assert.deepEqual(ids(r), ["x"]);
  });

  test("compara instantes, não texto: offset diferente de Z", () => {
    // 2026-10-01T09:00-03:00 é 12:00Z, exatamente no limite de 7 dias.
    const comFuso = registro("y", "tomate", "2026-10-01T09:00:00-03:00");
    const r = filtrar([comFuso], { periodo: "7d", culturaId: null }, AGORA);
    assert.deepEqual(ids(r), ["y"]);
  });
});

describe("inicioDoPeriodo", () => {
  test("'tudo' não tem início", () => {
    assert.equal(inicioDoPeriodo("tudo", AGORA), null);
  });

  test("30 dias antes de agora", () => {
    assert.equal(
      inicioDoPeriodo("30d", AGORA)?.toISOString(),
      "2026-09-08T12:00:00.000Z",
    );
  });
});

describe("culturasPresentes", () => {
  test("só as que têm registro, sem repetir, em ordem alfabética com acento", () => {
    const r = culturasPresentes(REGISTROS);
    assert.deepEqual(
      r.map((c) => c.nome),
      ["Batata", "Pimentão", "Tomate"],
    );
  });
});

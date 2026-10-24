/**
 * Testes do filtro do caderno.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  SEM_FILTRO,
  canteirosPresentes,
  culturasPresentes,
  filtrar,
  inicioDoPeriodo,
} from "./filtro-caderno.ts";

const AGORA = new Date("2026-10-08T12:00:00.000Z");

function registro(
  offlineId: string,
  culturaId: string,
  registradaEm: string,
  canteiroId: number | null = null,
  canteiroNome: string | null = null,
) {
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
    canteiroId,
    canteiroNome,
  };
}

const REGISTROS = [
  registro("a", "tomate", "2026-10-07T09:00:00.000Z", 3, "Canteiro 3"), // ontem
  registro("b", "batata", "2026-09-20T09:00:00+00:00", 10, "Canteiro 10"), // 18 dias, formato do servidor
  registro("c", "tomate", "2026-08-01T09:00:00.000Z", 3, "Canteiro 3"), // 68 dias
  registro("d", "pimentao", "2026-05-01T09:00:00.000Z"), // mais de 90 dias, sem canteiro
];

const ids = (lista: { offlineId: string }[]) => lista.map((r) => r.offlineId);

describe("filtrar", () => {
  test("sem filtro, tudo passa", () => {
    assert.deepEqual(ids(filtrar(REGISTROS, SEM_FILTRO, AGORA)), ["a", "b", "c", "d"]);
  });

  test("por período", () => {
    const f = (periodo: "7d" | "30d" | "90d") =>
      ids(filtrar(REGISTROS, { ...SEM_FILTRO, periodo }, AGORA));
    assert.deepEqual(f("7d"), ["a"]);
    assert.deepEqual(f("30d"), ["a", "b"]);
    assert.deepEqual(f("90d"), ["a", "b", "c"]);
  });

  test("por cultura", () => {
    const r = filtrar(REGISTROS, { ...SEM_FILTRO, culturaId: "tomate" }, AGORA);
    assert.deepEqual(ids(r), ["a", "c"]);
  });

  test("período e cultura combinados", () => {
    const r = filtrar(REGISTROS, { ...SEM_FILTRO, periodo: "30d", culturaId: "tomate" }, AGORA);
    assert.deepEqual(ids(r), ["a"]);
  });

  test("por canteiro (RF19): só as consultas vinculadas a ele", () => {
    const r = filtrar(REGISTROS, { ...SEM_FILTRO, canteiroId: 3 }, AGORA);
    assert.deepEqual(ids(r), ["a", "c"]);
  });

  test("canteiro e período combinados", () => {
    const r = filtrar(REGISTROS, { ...SEM_FILTRO, periodo: "30d", canteiroId: 3 }, AGORA);
    assert.deepEqual(ids(r), ["a"]);
  });

  test("sem filtro de canteiro, a consulta sem canteiro continua aparecendo", () => {
    const r = filtrar(REGISTROS, { ...SEM_FILTRO, culturaId: "pimentao" }, AGORA);
    assert.deepEqual(ids(r), ["d"]);
  });

  test("o limite do período é inclusivo", () => {
    const exato = registro("x", "tomate", "2026-10-01T12:00:00.000Z");
    const r = filtrar([exato], { ...SEM_FILTRO, periodo: "7d" }, AGORA);
    assert.deepEqual(ids(r), ["x"]);
  });

  test("compara instantes, não texto: offset diferente de Z", () => {
    // 2026-10-01T09:00-03:00 é 12:00Z, exatamente no limite de 7 dias.
    const comFuso = registro("y", "tomate", "2026-10-01T09:00:00-03:00");
    const r = filtrar([comFuso], { ...SEM_FILTRO, periodo: "7d" }, AGORA);
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

describe("canteirosPresentes", () => {
  test("só os que têm registro, sem repetir, em ordem numérica", () => {
    // "Canteiro 10" depois de "Canteiro 3": ordem de quem lê, não de texto.
    assert.deepEqual(canteirosPresentes(REGISTROS), [
      { id: 3, nome: "Canteiro 3" },
      { id: 10, nome: "Canteiro 10" },
    ]);
  });

  test("sem nome na fila, usa o nome que o servidor trouxe", () => {
    const r = canteirosPresentes([
      registro("p", "tomate", "2026-10-07T09:00:00.000Z", 5, null),
      registro("q", "tomate", "2026-10-06T09:00:00.000Z", 5, "Estufa A"),
    ]);
    assert.deepEqual(r, [{ id: 5, nome: "Estufa A" }]);
  });

  test("sem nome nenhum, aparece pelo número em vez de sumir", () => {
    const r = canteirosPresentes([registro("p", "tomate", "2026-10-07T09:00:00.000Z", 8, null)]);
    assert.deepEqual(r, [{ id: 8, nome: "Canteiro nº 8" }]);
  });
});

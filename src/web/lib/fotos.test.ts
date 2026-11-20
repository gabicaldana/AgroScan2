/**
 * Testes da foto anexada à consulta (US37, ADR 0016).
 *
 * A redução e a recodificação usam canvas e são conferidas no navegador, pelo
 * teste ponta a ponta. Aqui fica o que não depende dele.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { anexar, depositoEmMemoria, dimensoesReduzidas, LADO_MAXIMO } from "./fotos.ts";

describe("dimensoesReduzidas", () => {
  test("foto de 12 MP deitada vira 2048 no maior lado, na mesma proporção", () => {
    assert.deepEqual(dimensoesReduzidas(4032, 3024), { largura: 2048, altura: 1536 });
  });

  test("em pé, o maior lado é a altura", () => {
    assert.deepEqual(dimensoesReduzidas(3024, 4032), { largura: 1536, altura: 2048 });
  });

  test("foto menor que o limite não é ampliada", () => {
    assert.deepEqual(dimensoesReduzidas(1280, 960), { largura: 1280, altura: 960 });
    assert.deepEqual(dimensoesReduzidas(LADO_MAXIMO, 10), { largura: LADO_MAXIMO, altura: 10 });
  });

  test("tira estreita não chega a zero pixel", () => {
    assert.deepEqual(dimensoesReduzidas(10000, 1), { largura: 2048, altura: 1 });
  });
});

describe("anexar", () => {
  const preparada = { imagem: new Blob(["x"], { type: "image/jpeg" }), largura: 2048, altura: 1536 };

  test("prende a foto ao offlineId da consulta, com a data", async () => {
    const deposito = depositoEmMemoria();
    await anexar("consulta-1", preparada, new Date("2026-11-12T15:00:00Z"), deposito);

    const foto = await deposito.ler("consulta-1");
    assert.equal(foto?.largura, 2048);
    assert.equal(foto?.tiradaEm, "2026-11-12T15:00:00.000Z");
    assert.deepEqual(await deposito.ids(), ["consulta-1"]);
  });

  test("uma consulta tem uma foto: anexar de novo substitui", async () => {
    const deposito = depositoEmMemoria();
    await anexar("consulta-1", preparada, new Date(), deposito);
    await anexar("consulta-1", { ...preparada, largura: 800 }, new Date(), deposito);
    assert.equal((await deposito.ler("consulta-1"))?.largura, 800);
    assert.equal((await deposito.ids()).length, 1);
  });
});

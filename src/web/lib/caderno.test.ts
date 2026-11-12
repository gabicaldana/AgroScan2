/**
 * Testes do caderno: apagar o local de uma consulta (revisão LGPD #75).
 *
 * Só o caminho da fila, que não depende de rede nem de sessão. O caminho do
 * servidor é a rota `DELETE /consultas/{id}/localizacao`, testada na API.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { apagarLocalizacao, usarDeposito } from "./caderno.ts";
import * as fila from "./fila.ts";

function consulta(offlineId: string): fila.ConsultaPendente {
  return {
    offlineId,
    culturaId: "tomate",
    sintomas: ["manchas_escuras_aneis"],
    hipoteses: [{ doencaId: "tomate_pinta_preta", compatibilidade: 0.48 }],
    registradaEm: "2026-11-12T12:00:00.000Z",
    versaoCatalogo: "2026.11.09",
    latitude: -15.794,
    longitude: -47.883,
    tentativas: 0,
  };
}

describe("apagarLocalizacao na fila", () => {
  test("tira a coordenada só da consulta escolhida, e o resto fica", async () => {
    const deposito = fila.armazenamentoEmMemoria([consulta("a"), consulta("b")]);
    usarDeposito(deposito);

    assert.equal(await apagarLocalizacao({ offlineId: "a", pendente: true }), true);

    const [a, b] = await deposito.ler();
    assert.equal(a.latitude, null);
    assert.equal(a.longitude, null);
    assert.deepEqual(a.sintomas, ["manchas_escuras_aneis"]);
    assert.equal(b.latitude, -15.794);
  });

  test("se a consulta já saiu da fila, avisa em vez de dizer que apagou", async () => {
    usarDeposito(fila.armazenamentoEmMemoria([consulta("b")]));
    assert.equal(await apagarLocalizacao({ offlineId: "a", pendente: true }), false);
  });
});

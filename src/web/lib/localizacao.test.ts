/**
 * Testes da localização da consulta (RF22, RNF15, RNF16; revisão LGPD #75).
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { arredondar, explicar, localizar } from "./localizacao.ts";

/** Um aparelho de mentira que responde com uma posição ou com um erro. */
function aparelho(
  resposta: { latitude: number; longitude: number } | { code: number },
) {
  const pedidos: PositionOptions[] = [];
  return {
    pedidos,
    geo: {
      getCurrentPosition(
        sucesso: PositionCallback,
        falha?: PositionErrorCallback | null,
        opcoes?: PositionOptions,
      ) {
        pedidos.push(opcoes ?? {});
        if ("code" in resposta) {
          falha?.({ code: resposta.code } as GeolocationPositionError);
        } else {
          sucesso({ coords: resposta } as GeolocationPosition);
        }
      },
    },
  };
}

describe("arredondar", () => {
  test("guarda 3 casas decimais, uns 110 m, e nunca o ponto exato", () => {
    assert.deepEqual(arredondar({ latitude: -15.793889, longitude: -47.882778 }), {
      latitude: -15.794,
      longitude: -47.883,
    });
  });

  test("não devolve -0", () => {
    const c = arredondar({ latitude: -0.0001, longitude: -0.0004 });
    assert.ok(Object.is(c.latitude, 0));
    assert.ok(Object.is(c.longitude, 0));
  });
});

describe("localizar", () => {
  test("devolve a coordenada já arredondada", async () => {
    const { geo } = aparelho({ latitude: -15.7801234, longitude: -47.9298765 });
    assert.deepEqual(await localizar(geo), {
      coordenada: { latitude: -15.78, longitude: -47.93 },
      motivo: null,
    });
  });

  test("não pede precisão alta: o ponto seria arredondado de qualquer jeito", async () => {
    const { geo, pedidos } = aparelho({ latitude: 0, longitude: 0 });
    await localizar(geo, 5000);
    assert.equal(pedidos[0].enableHighAccuracy, false);
    assert.equal(pedidos[0].timeout, 5000);
  });

  test("permissão negada vira motivo, sem rejeitar", async () => {
    const { geo } = aparelho({ code: 1 });
    assert.deepEqual(await localizar(geo), { coordenada: null, motivo: "negada" });
  });

  test("posição indisponível e demora têm motivos próprios", async () => {
    assert.equal((await localizar(aparelho({ code: 2 }).geo)).motivo, "indisponivel");
    assert.equal((await localizar(aparelho({ code: 3 }).geo)).motivo, "demorou");
  });

  test("sem geolocalização no navegador", async () => {
    assert.deepEqual(await localizar(undefined), {
      coordenada: null,
      motivo: "sem-suporte",
    });
  });

  test("todo motivo tem explicação para a tela", () => {
    for (const m of ["negada", "demorou", "indisponivel", "sem-suporte"] as const) {
      assert.ok(explicar(m).length > 0);
    }
  });
});

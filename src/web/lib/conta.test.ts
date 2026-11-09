/**
 * Testes da saída da conta (US42, ADR 0014).
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { sair } from "./conta.ts";
import * as fila from "./fila.ts";

function consulta(offlineId: string): fila.ConsultaPendente {
  return {
    offlineId,
    culturaId: "tomate",
    sintomas: ["manchas_escuras_aneis"],
    hipoteses: [{ doencaId: "tomate_pinta_preta", compatibilidade: 0.48 }],
    registradaEm: "2026-11-06T12:00:00.000Z",
    versaoCatalogo: "2026.10.24",
    tentativas: 0,
  };
}

/** Um app de mentira: a fila em memória e um servidor configurável. */
function cenario(
  naFila: string[],
  servidor: "aceita" | "sem_rede" | "recusa" = "aceita",
) {
  const armazenamento = fila.armazenamentoEmMemoria(naFila.map(consulta));
  let encerrou = 0;
  let envios = 0;
  return {
    armazenamento,
    encerrou: () => encerrou,
    envios: () => envios,
    deps: {
      armazenamento,
      encerrar: () => {
        encerrou += 1;
      },
      sincronizar: () => {
        envios += 1;
        return fila.despachar(armazenamento, async (lote) => {
          if (servidor === "sem_rede") throw new Error("sem rede");
          const ids = lote.map((c) => c.offlineId);
          return servidor === "aceita"
            ? { aceitas: ids, duplicadas: [], rejeitadas: [] }
            : {
                aceitas: [],
                duplicadas: [],
                rejeitadas: ids.map((id) => ({ offline_id: id, motivo: "cultura desconhecida" })),
              };
        });
      },
    },
  };
}

describe("sair da conta", () => {
  test("com a fila vazia, sai sem tentar enviar", async () => {
    const c = cenario([]);
    assert.deepEqual(await sair(c.deps), { saiu: true, apagados: 0 });
    assert.equal(c.encerrou(), 1);
    assert.equal(c.envios(), 0);
  });

  test("com fila e rede, envia tudo e sai", async () => {
    const c = cenario(["a", "b"]);
    assert.deepEqual(await sair(c.deps), { saiu: true, apagados: 0 });
    assert.equal(c.envios(), 1);
    assert.equal(await fila.quantasPendentes(c.armazenamento), 0);
    assert.equal(c.encerrou(), 1);
  });

  test("sem rede, NÃO sai e diz quantos ficaram", async () => {
    const c = cenario(["a", "b", "c"], "sem_rede");
    assert.deepEqual(await sair(c.deps), { saiu: false, pendentes: 3, semRede: true });
    assert.equal(c.encerrou(), 0);
    // A fila fica intacta: nada se perde sem a escolha da pessoa.
    assert.equal(await fila.quantasPendentes(c.armazenamento), 3);
  });

  test("com registros recusados pelo servidor, também não sai", async () => {
    const c = cenario(["a"], "recusa");
    assert.deepEqual(await sair(c.deps), { saiu: false, pendentes: 1, semRede: false });
    assert.equal(c.encerrou(), 0);
  });

  test("com a escolha de apagar, esvazia a fila e sai", async () => {
    const c = cenario(["a", "b"], "sem_rede");
    assert.deepEqual(await sair(c.deps, { apagarPendentes: true }), {
      saiu: true,
      apagados: 2,
    });
    assert.equal(await fila.quantasPendentes(c.armazenamento), 0);
    assert.equal(c.encerrou(), 1);
    // Apagar não tenta enviar: a pessoa já decidiu.
    assert.equal(c.envios(), 0);
  });
});

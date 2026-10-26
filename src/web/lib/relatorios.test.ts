/**
 * Testes da apresentação dos relatórios.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  agruparPorMes,
  descreverConfirmacao,
  descreverRepeticao,
  paraIso,
  periodo,
  rotuloDoMes,
} from "./relatorios.ts";

function linha(mes: string, doencaId: string, ocorrencias: number) {
  return {
    mes,
    doenca_id: doencaId,
    doenca_nome: doencaId,
    cultura_id: "tomate",
    cultura_nome: "Tomate",
    ocorrencias,
  };
}

describe("rotuloDoMes", () => {
  test("mês por extenso, com acento", () => {
    assert.equal(rotuloDoMes("2026-03"), "março de 2026");
    assert.equal(rotuloDoMes("2026-12"), "dezembro de 2026");
  });
});

describe("periodo", () => {
  test("meses inteiros: do dia 1, N - 1 meses atrás, até hoje", () => {
    const hoje = new Date(2026, 9, 24); // 24/10/2026, hora local
    assert.deepEqual(periodo("3m", hoje), { de: "2026-08-01", ate: "2026-10-24" });
    assert.deepEqual(periodo("12m", hoje), { de: "2025-11-01", ate: "2026-10-24" });
  });

  test("atravessa a virada do ano", () => {
    assert.deepEqual(periodo("6m", new Date(2026, 1, 10)), {
      de: "2025-09-01",
      ate: "2026-02-10",
    });
  });

  test("data local, não UTC: 23h do dia 31 continua sendo o dia 31", () => {
    assert.equal(paraIso(new Date(2026, 4, 31, 23, 30)), "2026-05-31");
  });
});

describe("agruparPorMes", () => {
  test("agrupa na ordem que veio e soma o total do mês", () => {
    const meses = agruparPorMes([
      linha("2026-06", "tomate_requeima", 2),
      linha("2026-06", "tomate_pinta_preta", 1),
      linha("2026-05", "tomate_oidio", 1),
    ]);
    assert.deepEqual(
      meses.map((m) => [m.mes, m.total, m.linhas.length]),
      [
        ["2026-06", 3, 2],
        ["2026-05", 1, 1],
      ],
    );
    assert.equal(meses[0].rotulo, "junho de 2026");
  });

  test("sem linhas, sem meses", () => {
    assert.deepEqual(agruparPorMes([]), []);
  });
});

describe("descreverConfirmacao", () => {
  const base = { doenca_id: "x", doenca_nome: "X", cultura_nome: "Tomate" };

  test("com amostra, mostra a contagem e a taxa", () => {
    const r = descreverConfirmacao(
      { ...base, avaliadas: 7, confirmadas: 6, taxa_pct: 85.7 },
      5,
    );
    assert.equal(r.contagem, "6 de 7 confirmadas");
    assert.equal(r.taxa, "85,7%");
  });

  test("taxa redonda mantém a casa decimal", () => {
    const r = descreverConfirmacao(
      { ...base, avaliadas: 5, confirmadas: 3, taxa_pct: 60 },
      5,
    );
    assert.equal(r.taxa, "60,0%");
  });

  test("sem amostra, não inventa percentual", () => {
    const r = descreverConfirmacao(
      { ...base, avaliadas: 1, confirmadas: 1, taxa_pct: null },
      5,
    );
    assert.equal(r.contagem, "1 de 1 confirmada");
    assert.match(r.taxa, /poucas avaliações/);
    assert.doesNotMatch(r.taxa, /%/);
  });
});

describe("descreverRepeticao", () => {
  test("ciclo anterior, ciclos atrás e em cultivo", () => {
    const r = { cultura_nome: "Tomate", data_plantio: null };
    assert.equal(descreverRepeticao({ ...r, ciclos_atras: 1 }), "Tomate no ciclo anterior");
    assert.equal(descreverRepeticao({ ...r, ciclos_atras: 2 }), "Tomate dois ciclos atrás");
    assert.equal(
      descreverRepeticao({ ...r, ciclos_atras: 1, ativo: true }),
      "Tomate, em cultivo agora",
    );
  });
});

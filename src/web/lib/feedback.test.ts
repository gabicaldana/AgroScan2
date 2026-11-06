/**
 * Testes do feedback do diagnóstico (US20).
 *
 * As mesmas regras de coerência da rota `POST /consultas/{id}/feedback`
 * (TI21, TI22), conferidas no aparelho antes do envio.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { CULTURAS } from "./base-conhecimento.ts";
import {
  daListagem,
  doencasPossiveis,
  escolhaDe,
  impedimento,
  montarPedido,
  resumo,
  LIMITE_DO_COMENTARIO,
} from "./feedback.ts";

const PRINCIPAL = "tomate_pinta_preta";
const possiveis = doencasPossiveis(CULTURAS, "tomate", PRINCIPAL);
const contexto = { principalId: PRINCIPAL, possiveis };

describe("quando um registro pode ser avaliado", () => {
  test("registro da fila ainda não tem id do servidor", () => {
    assert.equal(
      impedimento({ pendente: true, doencaId: PRINCIPAL }),
      "pendente",
    );
  });

  test("consulta sem hipótese não tem o que confirmar", () => {
    assert.equal(
      impedimento({ pendente: false, id: 7, doencaId: null }),
      "sem_hipotese",
    );
  });

  test("consulta sincronizada com hipótese pode", () => {
    assert.equal(impedimento({ pendente: false, id: 7, doencaId: PRINCIPAL }), null);
  });
});

describe("doenças que podem ter sido a real", () => {
  test("só as da mesma cultura, sem a hipótese principal", () => {
    const tomate = CULTURAS.find((c) => c.id === "tomate")!;
    assert.equal(possiveis.length, tomate.doencas.length - 1);
    assert.ok(possiveis.every((d) => d.id.startsWith("tomate_")));
    assert.ok(!possiveis.some((d) => d.id === PRINCIPAL));
  });

  test("em ordem alfabética", () => {
    const nomes = possiveis.map((d) => d.nome);
    assert.deepEqual(nomes, [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  test("cultura que o catálogo não conhece não oferece nada", () => {
    assert.deepEqual(doencasPossiveis(CULTURAS, "nao_existe", null), []);
  });
});

describe("montar o pedido", () => {
  test("confirmado vai sem outra doença", () => {
    const r = montarPedido({ tipo: "confirmou" }, "", contexto);
    assert.deepEqual(r, {
      ok: true,
      pedido: { confirmado: true, doencaConfirmadaId: null, comentario: null },
    });
  });

  test("TI22: não confirmado com a doença real é aceito", () => {
    const real = possiveis[0].id;
    const r = montarPedido(
      { tipo: "nao_confirmou", doencaId: real },
      "  era outra  ",
      contexto,
    );
    assert.deepEqual(r, {
      ok: true,
      pedido: { confirmado: false, doencaConfirmadaId: real, comentario: "era outra" },
    });
  });

  test("não confirmado sem saber qual era é aceito", () => {
    const r = montarPedido({ tipo: "nao_confirmou", doencaId: null }, "", contexto);
    assert.equal(r.ok, true);
  });

  test("a própria hipótese como doença real é incoerente", () => {
    const r = montarPedido(
      { tipo: "nao_confirmou", doencaId: PRINCIPAL },
      "",
      contexto,
    );
    assert.equal(r.ok, false);
  });

  test("doença de outra cultura é recusada", () => {
    const r = montarPedido(
      { tipo: "nao_confirmou", doencaId: "batata_requeima" },
      "",
      contexto,
    );
    assert.equal(r.ok, false);
  });

  test("confirmar consulta sem hipótese é recusado", () => {
    const r = montarPedido({ tipo: "confirmou" }, "", {
      principalId: null,
      possiveis,
    });
    assert.equal(r.ok, false);
  });

  test("comentário acima do limite da API é recusado", () => {
    const r = montarPedido(
      { tipo: "confirmou" },
      "x".repeat(LIMITE_DO_COMENTARIO + 1),
      contexto,
    );
    assert.equal(r.ok, false);
  });
});

describe("mostrar a resposta registrada", () => {
  const base = { doencaConfirmadaNome: null, comentario: null };

  test("confirmado", () => {
    assert.equal(
      resumo({ ...base, confirmado: true, doencaConfirmadaId: null }),
      "Confirmado no campo",
    );
  });

  test("não confirmado, com a doença real", () => {
    assert.equal(
      resumo({
        confirmado: false,
        doencaConfirmadaId: "tomate_requeima",
        doencaConfirmadaNome: "Requeima",
        comentario: null,
      }),
      "Não se confirmou: era Requeima",
    );
  });

  test("não confirmado, sem saber qual era", () => {
    assert.equal(
      resumo({ ...base, confirmado: false, doencaConfirmadaId: null }),
      "Não se confirmou",
    );
  });

  test("a resposta reabre o formulário com a mesma escolha", () => {
    assert.deepEqual(
      escolhaDe({ ...base, confirmado: false, doencaConfirmadaId: "tomate_requeima" }),
      { tipo: "nao_confirmou", doencaId: "tomate_requeima" },
    );
    assert.deepEqual(escolhaDe({ ...base, confirmado: true, doencaConfirmadaId: null }), {
      tipo: "confirmou",
    });
  });
});

describe("ler a listagem da API", () => {
  test("sem feedback", () => {
    assert.equal(daListagem({ tem_feedback: false }), null);
  });

  test("com a resposta completa", () => {
    assert.deepEqual(
      daListagem({
        tem_feedback: true,
        confirmado: false,
        doenca_confirmada_id: "tomate_requeima",
        doenca_confirmada_nome: "Requeima",
        feedback_comentario: "o técnico confirmou",
      }),
      {
        confirmado: false,
        doencaConfirmadaId: "tomate_requeima",
        doencaConfirmadaNome: "Requeima",
        comentario: "o técnico confirmou",
      },
    );
  });

  test("cópia guardada antiga, só com tem_feedback, não inventa resposta", () => {
    assert.equal(daListagem({ tem_feedback: true }), null);
  });
});

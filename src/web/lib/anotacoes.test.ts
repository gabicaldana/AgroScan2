/**
 * Testes das anotações livres (US21).
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import type { Anotacao } from "./api.ts";
import { LIMITE_DE_TEXTO, foiEditada, podeAlterar, textoParaEnviar } from "./anotacoes.ts";

function anotacao(campos: Partial<Anotacao> = {}): Anotacao {
  return {
    id: 1,
    canteiro_id: 3,
    consulta_id: null,
    texto: "choveu forte na terça",
    criada_em: "2026-11-09T10:00:00Z",
    atualizada_em: "2026-11-09T10:00:00Z",
    autor_id: 7,
    autor_nome: "Thaís",
    ...campos,
  };
}

describe("quem pode alterar", () => {
  test("quem escreveu edita e apaga", () => {
    assert.equal(podeAlterar(anotacao(), 7), true);
  });

  test("outro membro da horta só lê", () => {
    assert.equal(podeAlterar(anotacao(), 8), false);
  });

  test("sem conta, ninguém altera", () => {
    assert.equal(podeAlterar(anotacao(), null), false);
  });
});

describe("marca de editada", () => {
  test("recém-criada não é editada", () => {
    assert.equal(foiEditada(anotacao()), false);
  });

  test("corrigida no mesmo minuto não ganha a marca", () => {
    assert.equal(foiEditada(anotacao({ atualizada_em: "2026-11-09T10:00:40Z" })), false);
  });

  test("alterada depois ganha a marca", () => {
    assert.equal(foiEditada(anotacao({ atualizada_em: "2026-11-10T08:00:00Z" })), true);
  });

  test("data ilegível não marca", () => {
    assert.equal(foiEditada(anotacao({ atualizada_em: "?" })), false);
  });
});

describe("texto para enviar", () => {
  test("apara os espaços", () => {
    assert.equal(textoParaEnviar("  a muda veio do vizinho \n"), "a muda veio do vizinho");
  });

  test("vazio ou só espaços não é enviado", () => {
    assert.equal(textoParaEnviar(""), null);
    assert.equal(textoParaEnviar("   \n "), null);
  });

  test("acima do limite não é enviado", () => {
    assert.equal(textoParaEnviar("x".repeat(LIMITE_DE_TEXTO)), "x".repeat(LIMITE_DE_TEXTO));
    assert.equal(textoParaEnviar("x".repeat(LIMITE_DE_TEXTO + 1)), null);
  });
});

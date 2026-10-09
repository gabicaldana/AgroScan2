/**
 * Testes da seleção de canteiro para a consulta.
 *
 * Rodar:  npm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { daCultura } from "./canteiros.ts";
import type { Canteiro } from "./api.ts";

function canteiro(id: number, cultura_id: string, ativo = true): Canteiro {
  return {
    id,
    horta_id: 1,
    identificacao: `Canteiro ${id}`,
    cultura_id,
    cultura_nome: cultura_id,
    emoji: null,
    familia: "",
    data_plantio: null,
    area_m2: null,
    ativo,
  };
}

test("só os canteiros ativos da cultura da consulta", () => {
  const lista = [
    canteiro(1, "tomate"),
    canteiro(2, "alface"),
    canteiro(3, "tomate", false),
    canteiro(4, "tomate"),
  ];
  assert.deepEqual(
    daCultura(lista, "tomate").map((c) => c.id),
    [1, 4],
  );
});

test("cultura sem canteiro devolve lista vazia", () => {
  assert.deepEqual(daCultura([canteiro(1, "tomate")], "couve"), []);
});

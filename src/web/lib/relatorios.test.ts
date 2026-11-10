/**
 * Testes da apresentação dos relatórios.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  SINTOMAS_VISIVEIS,
  agruparPorMes,
  confirmacaoGeral,
  descreverConfirmacao,
  descreverMarcacao,
  descreverRepeticao,
  doencaMaisFrequente,
  paraIso,
  periodo,
  poucasFichas,
  resumoDaCultura,
  resumoDaRotacao,
  rotuloDoMes,
  serieMensal,
  sintomasEmDestaque,
  veOSistema,
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

function sintoma(marcacoes: number, doencas: number, pct: number | null = null) {
  return {
    sintoma_id: "manchas_escuras_aneis",
    sintoma_nome: "Manchas escuras com anéis",
    orgao_id: "folha",
    marcacoes,
    doencas_com_o_sintoma: doencas,
    pct_das_consultas: pct,
  };
}

describe("sintomas mais marcados (US29)", () => {
  test("contagem sempre, percentual só quando a API manda", () => {
    assert.deepEqual(descreverMarcacao(sintoma(3, 2, 18.8), 16), {
      contagem: "marcado em 3 de 16 consultas",
      pct: "18,8%",
    });
    assert.deepEqual(descreverMarcacao(sintoma(1, 2), 1), {
      contagem: "marcado em 1 de 1 consulta",
      pct: null,
    });
  });

  test("percentual redondo mostra a casa decimal", () => {
    assert.equal(descreverMarcacao(sintoma(8, 2, 50), 16).pct, "50,0%");
  });

  test("sintoma entre os mais marcados com uma ficha só é sinal para a curadoria", () => {
    assert.equal(poucasFichas(sintoma(5, 1), 0), "só 1 doença cadastrada tem este sintoma");
    assert.equal(poucasFichas(sintoma(5, 0), 2), "nenhuma doença cadastrada tem este sintoma");
  });

  test("com duas fichas ou mais, ou fora dos principais, não há sinal", () => {
    assert.equal(poucasFichas(sintoma(5, 2), 0), null);
    assert.equal(poucasFichas(sintoma(1, 1), SINTOMAS_VISIVEIS), null);
  });

  test("resumo da cultura no singular e no plural", () => {
    const cultura = {
      cultura_id: "tomate",
      cultura_nome: "Tomate",
      consultas: 16,
      doencas_cadastradas: 10,
      sintomas: [],
    };
    assert.equal(resumoDaCultura(cultura), "16 consultas · 10 doenças cadastradas");
    assert.equal(
      resumoDaCultura({ ...cultura, consultas: 1, doencas_cadastradas: 1 }),
      "1 consulta · 1 doença cadastrada",
    );
  });

  test("só agrônomo e administração veem o recorte do sistema", () => {
    assert.equal(veOSistema("agronomo"), true);
    assert.equal(veOSistema("admin"), true);
    assert.equal(veOSistema("produtor"), false);
    assert.equal(veOSistema(null), false);
  });
});

describe("painel da horta (US41)", () => {
  test("série mensal preenche os meses sem diagnóstico com zero", () => {
    const serie = serieMensal(
      [linha("2026-10", "a", 2), linha("2026-10", "b", 1), linha("2026-08", "a", 4)],
      { de: "2026-07-01", ate: "2026-10-24" },
    );
    assert.deepEqual(
      serie.map((p) => [p.mes, p.rotulo, p.total]),
      [["2026-07", "jul", 0], ["2026-08", "ago", 4], ["2026-09", "set", 0], ["2026-10", "out", 3]],
    );
  });

  test("série mensal atravessa a virada do ano", () => {
    const serie = serieMensal([], { de: "2025-11-01", ate: "2026-02-10" });
    assert.deepEqual(serie.map((p) => p.mes), ["2025-11", "2025-12", "2026-01", "2026-02"]);
  });

  test("doença mais frequente soma os meses", () => {
    const linhas = [linha("2026-10", "b", 3), linha("2026-09", "a", 2), linha("2026-10", "a", 2)];
    assert.equal(doencaMaisFrequente(linhas)?.nome, "a");
    assert.equal(doencaMaisFrequente(linhas)?.ocorrencias, 4);
    assert.equal(doencaMaisFrequente([]), null);
  });

  test("empate na doença mais frequente vai pela ordem alfabética", () => {
    const linhas = [linha("2026-10", "b", 2), linha("2026-10", "a", 2)];
    assert.equal(doencaMaisFrequente(linhas)?.nome, "a");
  });

  test("confirmação geral só mostra a taxa com amostra suficiente", () => {
    const pouca = confirmacaoGeral(3, 2, 5);
    assert.equal(pouca.contagem, "2 de 3 diagnósticos avaliados confirmados");
    assert.equal(pouca.taxa, null);
    const bastante = confirmacaoGeral(8, 6, 5);
    assert.equal(bastante.taxa, "75%");
    assert.equal(bastante.fracao, 0.75);
    assert.equal(confirmacaoGeral(1, 1, 5).contagem, "1 de 1 diagnóstico avaliado confirmado");
    assert.equal(confirmacaoGeral(0, 0, 5).fracao, 0);
  });

  test("sintomas em destaque somam as culturas", () => {
    const sintoma = (id: string, marcacoes: number) => ({
      sintoma_id: id,
      sintoma_nome: id,
      orgao_id: "folha",
      marcacoes,
      doencas_com_o_sintoma: 1,
      pct_das_consultas: null,
    });
    const cultura = (id: string, sintomas: ReturnType<typeof sintoma>[]) => ({
      cultura_id: id,
      cultura_nome: id,
      consultas: 5,
      doencas_cadastradas: 3,
      sintomas,
    });
    const destaque = sintomasEmDestaque([
      cultura("tomate", [sintoma("murcha", 3), sintoma("manchas", 2)]),
      cultura("pepino", [sintoma("manchas", 4), sintoma("po", 1), sintoma("galhas", 1)]),
    ]);
    assert.deepEqual(
      destaque.map((s) => [s.id, s.marcacoes]),
      [["manchas", 6], ["murcha", 3], ["galhas", 1]],
    );
  });

  test("rotação diz o resultado com símbolo e texto", () => {
    assert.deepEqual(resumoDaRotacao(0), {
      simbolo: "✓",
      texto: "Nenhum canteiro repete a família botânica",
    });
    assert.equal(resumoDaRotacao(1).texto, "1 canteiro repete a família botânica");
    assert.equal(resumoDaRotacao(2).simbolo, "⚠");
  });
});

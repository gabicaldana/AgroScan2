/**
 * Apresentação dos relatórios da horta: agrupar, rotular e dizer o tamanho da
 * amostra.
 *
 * A agregação roda no banco (US27, US28, US30). O que fica aqui é o que a
 * tela faz com o resultado, em funções puras, para o teste não depender de
 * rede nem da data em que roda.
 */

import type {
  LinhaDeConfirmacao,
  LinhaDeIncidencia,
  Repeticao,
  SintomaMarcado,
  SintomasDaCultura,
} from "./api.ts";

export const PERIODOS_DO_RELATORIO = [
  { id: "3m", rotulo: "3 meses", meses: 3 },
  { id: "6m", rotulo: "6 meses", meses: 6 },
  { id: "12m", rotulo: "12 meses", meses: 12 },
] as const;

export type PeriodoDoRelatorio = (typeof PERIODOS_DO_RELATORIO)[number]["id"];

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** `2026-05` -> `maio de 2026`. */
export function rotuloDoMes(mes: string): string {
  const [ano, numero] = mes.split("-");
  return `${MESES[Number(numero) - 1]} de ${ano}`;
}

/** `AAAA-MM-DD` de uma data no calendário local, sem passar por UTC. */
export function paraIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/**
 * O período de "últimos N meses": do dia 1 do mês, N - 1 meses atrás, até
 * hoje. Meses inteiros, para a primeira barra não aparecer pela metade.
 */
export function periodo(id: PeriodoDoRelatorio, hoje: Date): { de: string; ate: string } {
  const meses = PERIODOS_DO_RELATORIO.find((p) => p.id === id)!.meses;
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - (meses - 1), 1);
  return { de: paraIso(inicio), ate: paraIso(hoje) };
}

export type Mes = {
  mes: string;
  rotulo: string;
  total: number;
  linhas: LinhaDeIncidencia[];
};

/** As linhas da API, uma por (mês, doença), agrupadas por mês na ordem em
 *  que vieram - do mais recente para o mais antigo. */
export function agruparPorMes(linhas: readonly LinhaDeIncidencia[]): Mes[] {
  const meses: Mes[] = [];
  for (const linha of linhas) {
    let atual = meses.at(-1);
    if (atual?.mes !== linha.mes) {
      atual = { mes: linha.mes, rotulo: rotuloDoMes(linha.mes), total: 0, linhas: [] };
      meses.push(atual);
    }
    atual.linhas.push(linha);
    atual.total += linha.ocorrencias;
  }
  return meses;
}

/**
 * "6 de 7 confirmadas", e a taxa só quando a amostra sustenta.
 *
 * A taxa vem nula da API abaixo da amostra mínima, e a frase diz por quê:
 * 1 de 1 confirmada não é "100% de acerto".
 */
export function descreverConfirmacao(linha: LinhaDeConfirmacao, minimo: number): {
  contagem: string;
  taxa: string;
} {
  const palavra = linha.confirmadas === 1 ? "confirmada" : "confirmadas";
  const contagem = `${linha.confirmadas} de ${linha.avaliadas} ${palavra}`;
  const taxa =
    linha.taxa_pct === null
      ? `poucas avaliações para calcular a taxa (mínimo ${minimo})`
      : `${linha.taxa_pct.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`;
  return { contagem, taxa };
}

/** "Tomate no ciclo anterior", "Repolho dois ciclos atrás". */
export function descreverRepeticao(r: Repeticao & { ativo?: boolean }): string {
  if (r.ativo) return `${r.cultura_nome}, em cultivo agora`;
  if (r.ciclos_atras === 1) return `${r.cultura_nome} no ciclo anterior`;
  const extenso = ["", "um", "dois", "três"][r.ciclos_atras] ?? String(r.ciclos_atras);
  return `${r.cultura_nome} ${extenso} ciclos atrás`;
}

/** Quantos sintomas cada cultura mostra antes de "ver todos". */
export const SINTOMAS_VISIVEIS = 5;

/** Os papéis que veem o recorte de todo o sistema (US29). */
export const PAPEIS_DA_CURADORIA = ["agronomo", "admin"] as const;

export function veOSistema(papel: string | null | undefined): boolean {
  return (PAPEIS_DA_CURADORIA as readonly string[]).includes(papel ?? "");
}

/**
 * "marcado em 3 de 16 consultas", e o percentual só quando a cultura tem
 * consultas suficientes - a API o manda nulo abaixo da amostra mínima.
 */
export function descreverMarcacao(
  sintoma: SintomaMarcado,
  consultasDaCultura: number,
): { contagem: string; pct: string | null } {
  const palavra = consultasDaCultura === 1 ? "consulta" : "consultas";
  return {
    contagem: `marcado em ${sintoma.marcacoes} de ${consultasDaCultura} ${palavra}`,
    pct:
      sintoma.pct_das_consultas === null
        ? null
        : `${sintoma.pct_das_consultas.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`,
  };
}

/**
 * O sinal para a curadoria: sintoma que aparece muito e que no máximo uma
 * ficha da cultura usa. Ali o diagnóstico tem pouco com que separar uma
 * doença de outra, e é onde a base precisa crescer (`modelo-de-dados.md`
 * §6.3). "Muito" é estar entre os mais marcados da cultura.
 */
export function poucasFichas(
  sintoma: SintomaMarcado,
  posicao: number,
): string | null {
  if (posicao >= SINTOMAS_VISIVEIS) return null;
  if (sintoma.doencas_com_o_sintoma > 1) return null;
  return sintoma.doencas_com_o_sintoma === 1
    ? "só 1 doença cadastrada tem este sintoma"
    : "nenhuma doença cadastrada tem este sintoma";
}

/** "16 consultas · 10 doenças cadastradas". */
export function resumoDaCultura(c: SintomasDaCultura): string {
  const consultas = `${c.consultas} ${c.consultas === 1 ? "consulta" : "consultas"}`;
  const doencas = `${c.doencas_cadastradas} ${
    c.doencas_cadastradas === 1 ? "doença cadastrada" : "doenças cadastradas"
  }`;
  return `${consultas} · ${doencas}`;
}

// =============================================================================
// US41 - painel da horta
// =============================================================================
//
// O painel resume os quatro relatórios em quadros que se leem de relance no
// celular. Cada número está escrito; a barra e a coluna só o repetem, para que
// nada dependa de cor (RNF08).

const MESES_CURTOS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export type PontoMensal = { mes: string; rotulo: string; total: number };

/**
 * Diagnósticos por mês, do mais antigo ao mais recente, com os meses sem
 * nenhum diagnóstico como zero - um buraco no gráfico também é informação.
 */
export function serieMensal(
  linhas: readonly LinhaDeIncidencia[],
  intervalo: { de: string; ate: string },
): PontoMensal[] {
  const totais = new Map<string, number>();
  for (const l of linhas) totais.set(l.mes, (totais.get(l.mes) ?? 0) + l.ocorrencias);

  const [anoDe, mesDe] = intervalo.de.split("-").map(Number);
  const [anoAte, mesAte] = intervalo.ate.split("-").map(Number);
  const serie: PontoMensal[] = [];
  let ano = anoDe;
  let mes = mesDe;
  while (ano < anoAte || (ano === anoAte && mes <= mesAte)) {
    const chave = `${ano}-${String(mes).padStart(2, "0")}`;
    serie.push({ mes: chave, rotulo: MESES_CURTOS[mes - 1], total: totais.get(chave) ?? 0 });
    mes += 1;
    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
  }
  return serie;
}

/** A doença que mais ocorreu no período, somando os meses. */
export function doencaMaisFrequente(
  linhas: readonly LinhaDeIncidencia[],
): { nome: string; cultura: string; ocorrencias: number } | null {
  const somas = new Map<string, { nome: string; cultura: string; ocorrencias: number }>();
  for (const l of linhas) {
    const atual = somas.get(l.doenca_id) ?? { nome: l.doenca_nome, cultura: l.cultura_nome, ocorrencias: 0 };
    atual.ocorrencias += l.ocorrencias;
    somas.set(l.doenca_id, atual);
  }
  let melhor: { nome: string; cultura: string; ocorrencias: number } | null = null;
  for (const d of somas.values()) {
    if (!melhor || d.ocorrencias > melhor.ocorrencias ||
        (d.ocorrencias === melhor.ocorrencias && d.nome.localeCompare(melhor.nome, "pt-BR") < 0)) {
      melhor = d;
    }
  }
  return melhor;
}

/**
 * A confirmação da horta inteira: a contagem sempre, a taxa só a partir da
 * mesma amostra mínima que a API usa por doença.
 */
export function confirmacaoGeral(
  avaliadas: number,
  confirmadas: number,
  minimo: number,
): { contagem: string; taxa: string | null; fracao: number } {
  const palavra = confirmadas === 1 ? "confirmado" : "confirmados";
  const contagem = `${confirmadas} de ${avaliadas} ${avaliadas === 1 ? "diagnóstico avaliado" : "diagnósticos avaliados"} ${palavra}`;
  const fracao = avaliadas === 0 ? 0 : confirmadas / avaliadas;
  const taxa =
    avaliadas < minimo
      ? null
      : `${(fracao * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`;
  return { contagem, taxa, fracao };
}

export type SintomaEmDestaque = { id: string; nome: string; marcacoes: number };

/**
 * Os sintomas mais marcados na horta, somando todas as culturas. O relatório
 * detalhado separa por cultura; o painel quer a resposta curta.
 */
export function sintomasEmDestaque(
  culturas: readonly SintomasDaCultura[],
  quantos = 3,
): SintomaEmDestaque[] {
  const somas = new Map<string, SintomaEmDestaque>();
  for (const c of culturas) {
    for (const s of c.sintomas) {
      const atual = somas.get(s.sintoma_id) ?? { id: s.sintoma_id, nome: s.sintoma_nome, marcacoes: 0 };
      atual.marcacoes += s.marcacoes;
      somas.set(s.sintoma_id, atual);
    }
  }
  return [...somas.values()]
    .sort((a, b) => b.marcacoes - a.marcacoes || a.nome.localeCompare(b.nome, "pt-BR"))
    .slice(0, quantos);
}

/** "2 canteiros repetem a família", com símbolo, e não só cor. */
export function resumoDaRotacao(alertas: number): { simbolo: string; texto: string } {
  if (alertas === 0) {
    return { simbolo: "✓", texto: "Nenhum canteiro repete a família botânica" };
  }
  return {
    simbolo: "⚠",
    texto: `${alertas} ${alertas === 1 ? "canteiro repete" : "canteiros repetem"} a família botânica`,
  };
}

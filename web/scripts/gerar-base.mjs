/**
 * Gera os modulos de dados do app a partir dos JSON do projeto:
 *
 *   data/base_conhecimento.json  ->  lib/base-conhecimento.ts
 *   data/contrato_visao.json     ->  lib/contrato-visao.ts
 *
 * Os dois JSON vivem fora de web/, porque sao do projeto e nao do app: o
 * Python os valida, carrega no SQLite e gera as fixtures a partir deles. O
 * app, por outro lado, precisa deles DENTRO do bundle - sao o conteudo do
 * laudo, e um app que busca o conteudo por rede nao funciona no meio do
 * talhao, que e o unico lugar onde ele precisa funcionar.
 *
 * Copiar a mao criaria duas fontes da verdade que divergem no primeiro
 * ajuste. Entao os arquivos sao gerados, e `npm test` confere que as copias
 * geradas batem com os JSON - se alguem editar a base e esquecer de regerar,
 * o teste quebra.
 *
 * Rodar:  npm run base
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const dados = (nome) => join(AQUI, "..", "..", "data", nome);
const saida = (nome) => join(AQUI, "..", "lib", nome);

export const CAMINHO_JSON_BASE = dados("base_conhecimento.json");
export const CAMINHO_JSON_CONTRATO = dados("contrato_visao.json");
export const CAMINHO_SAIDA_BASE = saida("base-conhecimento.ts");
export const CAMINHO_SAIDA_CONTRATO = saida("contrato-visao.ts");

/** snake_case -> camelCase, recursivo. Os JSON sao escritos na convencao do
 *  Python; o TypeScript le na dele. A conversao acontece num lugar so.
 *
 *  Chaves iniciadas por `_` sao comentarios do JSON curado e nao entram no
 *  modulo gerado: sao explicacao para quem edita a fonte, nao dado do app. */
export function paraCamel(valor) {
  if (Array.isArray(valor)) return valor.map(paraCamel);
  if (valor === null || typeof valor !== "object") return valor;

  return Object.fromEntries(
    Object.entries(valor)
      .filter(([chave]) => !chave.startsWith("_"))
      .map(([chave, v]) => [
        chave.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase()),
        paraCamel(v),
      ]),
  );
}

const bloco = (nome, tipo, valor) =>
  `export const ${nome}: ${tipo} = ${JSON.stringify(valor, null, 2)};\n`;

const CABECALHO_BASE = `/**
 * GERADO AUTOMATICAMENTE por \`npm run base\` a partir de
 * data/base_conhecimento.json. Nao editar a mao: a proxima geracao
 * sobrescreve.
 *
 * Este modulo e o conteudo do laudo, embutido no bundle. Um app que busca o
 * conteudo por rede nao funciona no meio do talhao, que e o unico lugar onde
 * ele precisa funcionar.
 */

export type OrgaoId = "folha" | "caule" | "raiz" | "fruto" | "planta";
export type GrupoHortalica = "fruto" | "folha" | "flor" | "haste" | "raiz";
export type TipoTratamento = "cultural" | "biologico" | "quimico";
export type Gravidade = 1 | 2 | 3 | 4 | 5;

export type Orgao = {
  id: OrgaoId;
  /** Rotulo do grupo na tela de sintomas ("Na folha"). */
  rotulo: string;
  /** Ordem em que o produtor olha a planta - nao e a ordem alfabetica. */
  ordem: number;
};

export type Sintoma = { id: string; nome: string; orgao: OrgaoId };

/** Peso de 0 a 1: 1.0 e o sintoma classico da doenca, 0.3 o ocasional. */
export type SintomaDoPerfil = { id: string; peso: number };

export type Tratamento = { tipo: TipoTratamento; descricao: string };

export type IngredienteAtivo = { nome: string; grupo: string; acao: string };

export type CondicoesFavoraveis = {
  temperatura: string;
  umidade: string;
  observacao: string;
};

export type Doenca = {
  id: string;
  nome: string;
  agente: string;
  tipoAgente: string;
  gravidade: Gravidade;
  descricao: string;
  sintomas: SintomaDoPerfil[];
  condicoesFavoraveis: CondicoesFavoraveis;
  tratamentos: Tratamento[];
  ingredientesAtivos: IngredienteAtivo[];
};

export type Cultura = {
  id: string;
  nome: string;
  nomeCientifico: string;
  /** Classificacao da Embrapa por parte comestivel. Agrupa o seletor na tela:
   *  com dezenas de hortalicas, uma lista plana seria ilegivel no celular. */
  grupo: GrupoHortalica;
  /** Familia botanica. Sustenta o alerta de rotacao e explica por que o
   *  catalogo de sintomas se reaproveita entre culturas da mesma familia. */
  familia: string;
  emoji: string;
  /** Ciclo medio ate a colheita, em dias. Nulo quando nao cadastrado. */
  cicloDias: number | null;
  doencas: Doenca[];
};
`;

const CABECALHO_CONTRATO = `/**
 * GERADO AUTOMATICAMENTE por \`npm run base\` a partir de
 * data/contrato_visao.json. Nao editar a mao.
 *
 * O contrato do pipeline de imagem: como um pixel vira tensor, e quando o app
 * deve dizer "nao sei" em vez de responder. Existe ANTES do modelo de
 * proposito - quem treinar obedece a estes valores, e nao o contrario. Se o
 * app redimensionar de um jeito e o treino de outro, o modelo recebe um tensor
 * que nunca viu e mesmo assim responde com confianca alta.
 */

export type Preprocessamento = {
  entrada: {
    largura: number;
    altura: number;
    canais: number;
    layout: string;
    tipo: string;
  };
  redimensionamento: {
    ladoMenor: number;
    recorte: string;
    metodo: string;
    cantosAlinhados: boolean;
  };
  normalizacao: { escala: number; media: number[]; desvio: number[] };
  saida: { tipo: string };
};

/**
 * Limiares de recusa. Nulos ate existir um modelo treinado e a curva
 * risco-cobertura ser medida: chutar um numero daria ao produtor uma recusa
 * que nao significa nada.
 */
export type Recusa = {
  temperatura: number | null;
  limiarMsp: number | null;
  limiarEnergia: number | null;
  calibradoEm: string | null;
  /** Lembrete de que a pontuacao vai sobre os logits CRUS. */
  medirSobre: string;
  saboresDeForaDaDistribuicao: string[];
};
`;

export function gerarFonteBase(
  json = JSON.parse(readFileSync(CAMINHO_JSON_BASE, "utf8")),
) {
  const base = paraCamel(json);
  return [
    CABECALHO_BASE,
    bloco("VERSAO_DA_BASE", "string", base.versao),
    bloco("ORGAOS", "readonly Orgao[]", base.orgaos),
    bloco("SINTOMAS", "readonly Sintoma[]", base.sintomas),
    bloco("CULTURAS", "readonly Cultura[]", base.culturas),
  ].join("\n");
}

export function gerarFonteContrato(
  json = JSON.parse(readFileSync(CAMINHO_JSON_CONTRATO, "utf8")),
) {
  const contrato = paraCamel(json);
  return [
    CABECALHO_CONTRATO,
    bloco("PREPROCESSAMENTO", "Preprocessamento", contrato.preprocessamento),
    bloco("RECUSA", "Recusa", contrato.recusa),
    bloco(
      "ARQUIVO",
      "{ nome: string | null; sha256: string | null }",
      contrato.arquivo,
    ),
  ].join("\n");
}

const executadoDireto =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (executadoDireto) {
  writeFileSync(CAMINHO_SAIDA_BASE, gerarFonteBase(), "utf8");
  writeFileSync(CAMINHO_SAIDA_CONTRATO, gerarFonteContrato(), "utf8");

  const base = paraCamel(JSON.parse(readFileSync(CAMINHO_JSON_BASE, "utf8")));
  const doencas = base.culturas.flatMap((c) => c.doencas);
  console.log(`Gerado ${CAMINHO_SAIDA_BASE}`);
  console.log(
    `  ${base.culturas.length} hortalicas, ${doencas.length} doencas, ` +
      `${base.sintomas.length} sintomas (base ${base.versao})`,
  );
  console.log(`Gerado ${CAMINHO_SAIDA_CONTRATO}`);
}

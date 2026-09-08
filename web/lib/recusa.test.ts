/**
 * Testes da recusa.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { RECUSA } from "./contrato-visao.ts";
import { avaliar, estaCalibrado, pontuar, softmax } from "./recusa.ts";

/** Quantas saidas um modelo teria. O numero real sai do acervo escolhido; aqui
 *  vale qualquer um, porque a recusa e agnostica ao tamanho da saida. */
const N = 24;

/** Logits com um pico numa classe: um modelo seguro do que viu. */
function logitsCom(indice: number, altura = 12): Float32Array {
  const v = new Float32Array(N);
  v[indice] = altura;
  return v;
}

const soma = (v: ArrayLike<number>) => {
  let t = 0;
  for (let i = 0; i < v.length; i++) t += v[i];
  return t;
};

describe("softmax", () => {
  test("soma 1", () => {
    assert.ok(Math.abs(soma(softmax(logitsCom(0))) - 1) < 1e-12);
  });

  test("nao estoura com logit gigante", () => {
    // Sem subtrair o maximo antes de exponenciar, Math.exp(800) e Infinity e
    // o softmax inteiro vira NaN - que compararia falso com qualquer limiar
    // e faria a recusa nunca disparar, em silencio.
    const p = softmax(logitsCom(0, 800));
    assert.ok(![...p].some(Number.isNaN), "nao pode ter NaN");
    assert.ok(Math.abs(soma(p) - 1) < 1e-12);
  });

  test("temperatura maior achata a distribuicao", () => {
    const logits = logitsCom(0, 6);
    const quente = pontuarCom(logits, 4);
    const fria = pontuarCom(logits, 1);
    assert.ok(quente < fria, "temperatura alta tem que reduzir a confianca");
  });

  test("temperatura invalida e erro", () => {
    assert.throws(() => softmax([1, 2, 3], 0), /positiva/);
    assert.throws(() => softmax([1, 2, 3], -1), /positiva/);
  });
});

function pontuarCom(logits: ArrayLike<number>, temperatura: number): number {
  const p = softmax(logits, temperatura);
  return Math.max(...p);
}

describe("pontuacoes sobre os logits crus", () => {
  test("modelo seguro pontua alto, modelo indeciso pontua baixo", () => {
    const seguro = pontuar(logitsCom(0, 12));
    const indeciso = pontuar(new Float32Array(N)); // tudo zero

    assert.ok(seguro.msp > 0.99, `msp seguro deu ${seguro.msp}`);
    assert.ok(
      Math.abs(indeciso.msp - 1 / N) < 1e-9,
      "uniforme tem que dar 1/38",
    );
    assert.ok(seguro.margem > indeciso.margem);
    assert.ok(
      seguro.energia < indeciso.energia,
      "energia menor = o modelo reconhece melhor",
    );
  });

  test("sem logits e erro", () => {
    assert.throws(() => pontuar([]), /sem logits/);
  });
});

describe("renormalizar num subconjunto destroi a confianca como sinal", () => {
  test("a confianca renormalizada tem piso, e o piso nao depende da imagem", () => {
    // ESTE e o teste que justifica o desenho inteiro do modulo.
    //
    // Uma planta de outra especie fotografada com uma cultura selecionada
    // produz logits quase uniformes: o modelo nao reconhece nada, e a MSP crua
    // denuncia isso caindo para 1/N. Mas restringir a saida as classes de uma
    // cultura e renormalizar da a lider um piso de 1/k - por pior que seja a
    // foto. O numero renormalizado mede como o modelo divide aquela cultura,
    // nao o quanto ele reconheceu a imagem, e por isso nao serve de recusa.
    const logitsCrus = new Float32Array(N); // tudo zero
    const cru = pontuar(logitsCrus);

    const k = 4; // uma cultura com quatro classes
    const p = softmax(logitsCrus);
    const subconjunto = [...p].slice(0, k);
    const total = subconjunto.reduce((a, b) => a + b, 0);
    const maiorRenormalizado = Math.max(...subconjunto.map((v) => v / total));

    assert.ok(cru.msp < 1 / N + 1e-6, `a MSP crua denuncia: ${cru.msp}`);
    assert.ok(
      maiorRenormalizado >= 1 / k - 1e-6,
      `o piso e 1/${k}, deu ${maiorRenormalizado}`,
    );
    assert.ok(
      maiorRenormalizado / cru.msp > 3,
      "renormalizar infla a confianca de uma imagem irreconhecivel",
    );
  });

  test("com uma classe so, a confianca renormalizada e 1, sempre", () => {
    // Caso extremo e real: uma cultura com uma unica classe. Qualquer imagem
    // apontada como ela sai com 100% depois da renormalizacao, inclusive a
    // folha de outra especie. So a pontuacao crua pode recusar.
    const p = softmax(new Float32Array(N));
    const unica = [p[0]];
    assert.equal(unica[0] / unica[0], 1);
    assert.ok(pontuar(new Float32Array(N)).msp < 1 / N + 1e-6);
  });
});

describe("estado de calibracao", () => {
  test("sem limiares medidos, o app nao finge que decide", () => {
    // Enquanto a fase 4b nao rodar, o contrato traz limiares nulos. Aceitar
    // tudo seria pior que nao ter recusa: o agronomo veria um app que diz
    // "verifiquei" sem ter verificado nada.
    assert.equal(RECUSA.temperatura, null);
    assert.equal(RECUSA.limiarMsp, null);
    assert.equal(estaCalibrado(), false);

    const veredito = avaliar(logitsCom(0));
    assert.equal(veredito.decisao, "nao_calibrado");
    assert.ok(veredito.pontuacoes.msp > 0.99, "as pontuacoes existem mesmo assim");
  });

  test("o contrato lembra onde medir, e nao e depois da mascara", () => {
    assert.match(RECUSA.medirSobre, /LOGITS CRUS/);
    assert.equal(RECUSA.saboresDeForaDaDistribuicao.length, 3);
    // O ultimo e o mais perigoso: cultura que o modelo conhece, doenca que
    // ele nao conhece. E o unico que nenhuma checagem de cultura pega.
    assert.match(RECUSA.saboresDeForaDaDistribuicao[2], /doenca desconhecida/);
  });
});

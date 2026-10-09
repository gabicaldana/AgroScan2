/**
 * Testes da detecção de plataforma.
 *
 * Rodar:  npm test
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { deveMostrarInstrucaoIOS, ehIOS } from "./plataforma.ts";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  ipadComoMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  android:
    "Mozilla/5.0 (Linux; Android 14; SM-A146M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
};

describe("ehIOS", () => {
  test("iPhone", () => {
    assert.equal(ehIOS({ userAgent: UA.iphone, toques: 5, instalado: false }), true);
  });

  test("iPad que se apresenta como Mac é reconhecido pela tela de toque", () => {
    assert.equal(ehIOS({ userAgent: UA.ipadComoMac, toques: 5, instalado: false }), true);
  });

  test("Mac de verdade não é iOS", () => {
    assert.equal(ehIOS({ userAgent: UA.ipadComoMac, toques: 0, instalado: false }), false);
  });

  test("Android não é iOS", () => {
    assert.equal(ehIOS({ userAgent: UA.android, toques: 5, instalado: false }), false);
  });
});

describe("deveMostrarInstrucaoIOS", () => {
  test("iPhone no navegador: mostra", () => {
    assert.equal(
      deveMostrarInstrucaoIOS({ userAgent: UA.iphone, toques: 5, instalado: false }),
      true,
    );
  });

  test("depois de instalado, não reaparece", () => {
    assert.equal(
      deveMostrarInstrucaoIOS({ userAgent: UA.iphone, toques: 5, instalado: true }),
      false,
    );
  });

  test("Android tem o botão do próprio navegador: não mostra", () => {
    assert.equal(
      deveMostrarInstrucaoIOS({ userAgent: UA.android, toques: 5, instalado: false }),
      false,
    );
  });
});

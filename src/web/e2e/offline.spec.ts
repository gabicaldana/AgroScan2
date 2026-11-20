/**
 * O fluxo offline de ponta a ponta (#77, RNF01).
 *
 * Até aqui, "funciona sem rede" era verificado à mão num celular. Estes testes
 * fazem o mesmo caminho no Chromium, sobre o build de produção:
 *
 * 1. a PRIMEIRA consulta depois da instalação, já sem rede: o app é visitado
 *    uma vez com rede (é quando o service worker se instala e guarda a casca),
 *    a rede cai, e daí em diante tudo tem que funcionar - abrir, diagnosticar,
 *    ler o laudo, salvar e ver no caderno;
 * 2. a fila de sincronização: o que foi salvo sem rede sobe sozinho quando a
 *    conexão volta, com os dados da consulta, e sai da fila.
 *
 * A API é interceptada: o que está sob teste é o aparelho.
 *
 * Rodar:  npm run build && npm run e2e
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";

const SINTOMA = "Manchas escuras com anéis concêntricos, como um alvo";
const DOENCA = "Pinta-preta";

/**
 * Espera o service worker terminar a instalação e assumir a página.
 *
 * A instalação só acaba depois de a casca inteira estar no cache
 * (`preencherCasca`), e a ativação chama `clients.claim()`. Com o controlador
 * presente, a casca está guardada: é o momento em que o app está "instalado".
 */
async function esperarInstalacao(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((ok) =>
        navigator.serviceWorker.addEventListener("controllerchange", ok, { once: true }),
      );
    }
  });
}

async function diagnosticarESalvar(page: Page) {
  await page.getByLabel(SINTOMA).check();
  await expect(page.getByRole("heading", { name: DOENCA, level: 3 })).toBeVisible();
  await page.getByRole("button", { name: "Salvar no caderno" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Salvo no caderno" }))
    .toContainText("Guardado neste aparelho");
}

/** Uma sessão aberta, sem passar pela tela de entrar (que precisa da API). */
async function entrarSemApi(context: BrowserContext) {
  const exp = Math.floor(Date.now() / 1000) + 86_400;
  const carga = Buffer.from(JSON.stringify({ sub: "1", exp })).toString("base64url");
  await context.addInitScript(
    ([token, usuario]) => {
      localStorage.setItem("agroscan.token", token);
      localStorage.setItem("agroscan.usuario", usuario);
    },
    [
      `cabecalho.${carga}.assinatura`,
      JSON.stringify({ id: 1, nome: "Teste", email: "teste@exemplo.br", papel: "produtor", ativo: true }),
    ],
  );
}

test("a primeira consulta depois da instalação funciona inteira sem rede", async ({ page, context }) => {
  // Sem conta: o diagnóstico não depende de cadastro (RF14).
  await context.route("**/api/v1/**", (rota) => rota.abort());

  await page.goto("/");
  await esperarInstalacao(page);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Diagnosticar planta" })).toBeVisible();

  // Diagnosticar: o ranking sai do motor no aparelho, sobre a base embutida.
  await page.getByLabel(SINTOMA).check();
  const cartao = page.getByRole("link").filter({ has: page.getByRole("heading", { name: DOENCA }) });
  await expect(cartao).toBeVisible();

  // O laudo é outra rota, aberta pela casca guardada.
  await cartao.click();
  await expect(page).toHaveURL(/\/resultado\?doenca=tomate_pinta_preta/);
  await expect(page.getByRole("heading", { name: DOENCA, level: 1 })).toBeVisible();
  await expect(page.getByText("Aviso", { exact: true })).toBeVisible();

  // Salvar e achar no caderno, ainda sem rede.
  await page.goto("/");
  await diagnosticarESalvar(page);

  await page.goto("/caderno");
  await expect(page.getByText(DOENCA)).toBeVisible();
  await expect(page.getByText("● Guardado neste aparelho")).toBeVisible();
});

test("o que foi salvo sem rede sobe sozinho quando a conexão volta", async ({ page, context }) => {
  await entrarSemApi(context);

  // Um servidor de mentira: guarda o que recebe e devolve na listagem.
  // A interceptação do Playwright responde mesmo com `setOffline(true)`, então
  // o "sem rede" é repetido aqui: com a rede cortada, a chamada falha como
  // falharia no campo.
  let semRede = false;
  const recebidas: { offline_id: string; cultura_id: string; sintomas: string[] }[] = [];
  await context.route("**/api/v1/**", async (rota) => {
    if (semRede) return rota.abort("internetdisconnected");
    const pedido = rota.request();
    const caminho = new URL(pedido.url()).pathname.replace("/api/v1", "");

    if (caminho === "/consultas/sincronizar" && pedido.method() === "POST") {
      const { consultas } = pedido.postDataJSON();
      recebidas.push(...consultas);
      return rota.fulfill({
        json: { aceitas: consultas.map((c: { offline_id: string }) => c.offline_id), duplicadas: [], rejeitadas: [] },
      });
    }
    if (caminho === "/consultas") {
      return rota.fulfill({
        json: recebidas.map((c, i) => ({
          id: i + 1, offline_id: c.offline_id, cultura_id: c.cultura_id, cultura_nome: "Tomate",
          emoji: "🍅", canteiro_id: null, canteiro_nome: null, origem: "sintomas",
          registrada_em: new Date().toISOString(), versao_catalogo: "2026.11.09",
          doenca_id: "tomate_pinta_preta", doenca_nome: DOENCA, compatibilidade: 0.5,
          tem_feedback: false,
        })),
      });
    }
    if (caminho === "/canteiros") return rota.fulfill({ json: [] });
    return rota.fulfill({ status: 404, json: { detail: "fora do teste" } });
  });

  await page.goto("/");
  await esperarInstalacao(page);

  semRede = true;
  await context.setOffline(true);
  await diagnosticarESalvar(page);
  expect(recebidas).toHaveLength(0);

  await page.goto("/caderno");
  await expect(page.getByText("● Guardado neste aparelho")).toBeVisible();

  // A conexão volta com o caderno aberto: o evento `online` despacha a fila.
  semRede = false;
  await context.setOffline(false);
  await expect(page.getByText("● Guardado neste aparelho")).toBeHidden();
  await expect(page.getByText(DOENCA)).toBeVisible();

  expect(recebidas).toHaveLength(1);
  expect(recebidas[0].cultura_id).toBe("tomate");
  expect(recebidas[0].sintomas).toEqual(["manchas_escuras_aneis"]);

  // E a fila ficou vazia: o registro não sobe duas vezes.
  const naFila = await page.evaluate(
    () =>
      new Promise<number>((ok) => {
        const pedido = indexedDB.open("agroscan", 1);
        pedido.onsuccess = () => {
          const leitura = pedido.result.transaction("fila").objectStore("fila").get("pendentes");
          leitura.onsuccess = () => ok((leitura.result ?? []).length);
        };
      }),
  );
  expect(naFila).toBe(0);
});

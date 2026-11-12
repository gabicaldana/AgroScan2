import { defineConfig, devices } from "@playwright/test";

/**
 * Testes ponta a ponta do fluxo offline (#77, RNF01).
 *
 * Rodam sobre o build de PRODUÇÃO (`next start`), e não sobre o `next dev`: o
 * service worker só é registrado em produção (`RegistroServiceWorker`), e é
 * ele que faz o app abrir sem rede. Testar no modo de desenvolvimento seria
 * testar outro app.
 *
 * Por isso o build vem antes: `npm run build && npm run e2e`. No CI, o passo
 * de build já existe e este roda depois dele.
 *
 * A API não sobe: as chamadas a `/api/v1` são interceptadas em cada teste. O
 * que está sob teste é o aparelho - casca em cache, fila, sincronização -, e
 * o contrato do servidor já tem os testes dele em `src/tests`.
 */
const PORTA = 3210;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORTA}`,
    // O celular é o alvo (RNF10). Chromium, e não o WebKit do perfil do
    // iPhone: o service worker e o modo offline do Playwright são estáveis
    // nele, e o comportamento offline que importa é o do app, não o do motor.
    ...devices["Pixel 7"],
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx next start -p ${PORTA}`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

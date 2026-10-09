import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O diagnostico por sintomas era /sintomas e virou a raiz (ADR 0008). O
  // redirecionamento existe porque a rota antiga esta em tres lugares fora do
  // nosso alcance: o atalho que quem ja instalou o PWA tem na tela inicial, o
  // cache do service worker de quem ainda nao atualizou, e qualquer link ja
  // compartilhado. Sem ele, todos batem em 404.
  async redirects() {
    return [{ source: "/sintomas", destination: "/", permanent: true }];
  },

  // O navegador fala com /api/v1 na PROPRIA ORIGEM e o Next encaminha. Assim
  // o CORS deixa de existir, a regra do service worker que nunca cacheia
  // /api/ continua valendo (ela olha o caminho, nao o host), e trocar o
  // endereco da API vira variavel de ambiente em vez de novo deploy do app.
  async rewrites() {
    const api = process.env.API_URL;
    if (!api) return [];
    return [
      { source: "/api/v1/:caminho*", destination: `${api}/api/v1/:caminho*` },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // A câmera é o núcleo do app e roda só na própria origem;
          // nada mais precisa de permissão de hardware.
          {
            key: "Permissions-Policy",
            value: "camera=(self), geolocation=(self), microphone=()",
          },
        ],
      },
      {
        // O service worker nunca pode ser servido de um cache velho: seria
        // um app preso numa versão antiga sem forma de se atualizar.
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

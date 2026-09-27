"use client";

import { useEffect } from "react";

import {
  catalogoAtivo,
  promoverGuardado,
  sincronizar,
} from "@/lib/catalogo.ts";
import { reconstruirIndices } from "@/lib/diagnostico.ts";

/**
 * Mantem o catalogo agronomico em dia sem exigir reinstalacao do app (US36).
 *
 * Nao renderiza nada - existe so pelo efeito, como o registro do service
 * worker. E roda DEPOIS da montagem, de proposito: durante a geracao estatica
 * e na primeira renderizacao do cliente o app usa o catalogo embutido, que e o
 * mesmo dos dois lados. Promover um catalogo guardado antes disso produziria
 * HTML divergente do que o React monta na hidratacao.
 *
 * Duas etapas, nesta ordem:
 *
 *   1. `promoverGuardado` - instantaneo, sem rede. Se uma abertura anterior
 *      baixou uma base mais nova, ela entra em uso agora. E isto que faz a
 *      atualizacao sobreviver ao modo aviao.
 *   2. `sincronizar` - oportunista. Pergunta a versao publicada e so baixa se
 *      for mais nova. Falha em silencio: sem rede o app segue com o que tem.
 *
 * O diagnostico NUNCA espera por isto. O motor ja esta operante sobre o
 * catalogo embutido antes de este efeito rodar (ADR 0001: o cliente e
 * autoridade sobre a resposta).
 */
export function SincronizacaoDoCatalogo() {
  useEffect(() => {
    let vivo = true;

    const aplicar = () => reconstruirIndices(catalogoAtivo());

    promoverGuardado();
    aplicar();

    sincronizar()
      .then((resultado) => {
        if (!vivo) return;
        if (resultado.estado === "atualizado") {
          aplicar();
          // A tela ja montada continua com a lista antiga ate a proxima
          // navegacao. Trocar o catalogo sob o dedo de quem esta no meio de
          // uma marcacao de sintomas seria pior do que esperar.
          console.info(
            `Catálogo atualizado: ${resultado.de} → ${resultado.para}.`,
          );
        }
      })
      .catch(() => {
        /* `sincronizar` ja nao lanca; isto e a ultima rede de seguranca. */
      });

    return () => {
      vivo = false;
    };
  }, []);

  return null;
}

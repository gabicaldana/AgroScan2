"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  EMBUTIDO,
  assinar,
  catalogoAtivo,
  promoverGuardado,
  sincronizar,
} from "@/lib/catalogo.ts";

/**
 * Re-renderiza o componente quando o catalogo ativo troca.
 *
 * Todo componente que leia conteudo do catalogo - lista de culturas, de
 * sintomas, nomes no historico - precisa chamar isto. Sem a assinatura, a
 * tela fica congelada na base com que foi montada, enquanto o motor ja
 * responde pela nova: o pior dos dois mundos, porque nada avisa.
 *
 * Assinamos a VERSAO, e nao o catalogo: `useSyncExternalStore` exige um
 * instantaneo de identidade estavel, e uma string satisfaz isso. O
 * instantaneo do servidor e sempre o embutido, o mesmo que a geracao
 * estatica produziu, o que evita divergencia na hidratacao.
 */
export function useVersaoDoCatalogo(): string {
  return useSyncExternalStore(
    assinar,
    () => catalogoAtivo().versao,
    () => EMBUTIDO.versao,
  );
}

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
 * Nenhuma das duas precisa de tratamento aqui: `catalogo.ts` reconstroi os
 * indices do motor e avisa os assinantes por conta propria, nessa ordem. Este
 * componente so dispara - e por isso e seguro que o StrictMode o monte duas
 * vezes, e que o efeito nao guarde estado nem se cancele.
 *
 * O diagnostico NUNCA espera por isto. O motor ja esta operante sobre o
 * catalogo embutido antes de este efeito rodar (ADR 0001: o cliente e
 * autoridade sobre a resposta).
 */
export function SincronizacaoDoCatalogo() {
  useEffect(() => {
    promoverGuardado();

    sincronizar()
      .then((resultado) => {
        if (resultado.estado === "atualizado") {
          console.info(
            `Catálogo atualizado: ${resultado.de} → ${resultado.para}.`,
          );
        }
      })
      .catch(() => {
        /* `sincronizar` ja nao lanca; isto e a ultima rede de seguranca. */
      });
  }, []);

  return null;
}

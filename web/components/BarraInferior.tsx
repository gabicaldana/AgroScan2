"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navegacao ancorada na base - zona alcancavel pelo polegar com o celular
 * numa mao so, que e como o produtor usa no canteiro.
 *
 * A captura por foto saiu da navegacao enquanto nao houver modelo de visao
 * (ADR 0008): uma aba que so leva a um aviso de indisponibilidade gasta a
 * zona mais valiosa da tela. Hortas entrou com o epico E5, porque e onde os
 * canteiros e o manejo vivem.
 *
 * `prefixos` marca a aba ativa tambem nas telas que estao dentro dela: a
 * horta e o canteiro pertencem a aba Hortas.
 */
const ABAS = [
  { href: "/", rotulo: "Diagnosticar", icone: IconeLista, prefixos: [] },
  { href: "/caderno", rotulo: "Caderno", icone: IconeCaderno, prefixos: [] },
  {
    href: "/hortas",
    rotulo: "Hortas",
    icone: IconeHorta,
    prefixos: ["/horta", "/canteiro"],
  },
] as const;

export function BarraInferior() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="border-borda bg-fundo fixed inset-x-0 bottom-0 z-10 border-t-2 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl">
        {ABAS.map(({ href, rotulo, icone: Icone, prefixos }) => {
          const ativa =
            caminho === href ||
            (prefixos as readonly string[]).includes(caminho);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativa ? "page" : undefined}
                className={`flex h-toque flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                  ativa ? "text-primaria" : "text-texto-suave"
                }`}
              >
                <Icone />
                {rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Ícones inline: sem dependência externa, sem requisição de rede.
   `currentColor` faz cada um herdar o estado ativo/inativo do link. */

function IconeLista() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6.5h3M4 12h3M4 17.5h3M10 6.5h10M10 12h10M10 17.5h10" />
    </svg>
  );
}

/** Três canteiros com brotos: a área cultivada, não uma folha isolada. */
function IconeHorta() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 20h18M4 16h16" />
      <path d="M7 16v-3m0 0c0-2-1.5-3-3-3 0 2 1.5 3 3 3Zm0 0c0-2 1.5-3 3-3 0 2-1.5 3-3 3Z" />
      <path d="M17 16v-4m0 0c0-2.5-2-4-4-4 0 2.5 2 4 4 4Zm0 0c0-2.5 2-4 4-4 0 2.5-2 4-4 4Z" />
    </svg>
  );
}

function IconeCaderno() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h13v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M9 3v18M12.5 8.5h3.5M12.5 12.5h3.5" />
    </svg>
  );
}

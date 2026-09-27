"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navegacao ancorada na base - zona alcancavel pelo polegar com o celular
 * numa mao so, que e como o produtor usa no canteiro.
 *
 * Duas abas, nao tres: a captura por foto saiu da navegacao enquanto nao
 * houver modelo de visao (ADR 0008). Uma aba que so leva a um aviso de
 * indisponibilidade gasta a zona mais valiosa da tela.
 */
const ABAS = [
  { href: "/", rotulo: "Diagnosticar", icone: IconeLista },
  { href: "/caderno", rotulo: "Caderno", icone: IconeCaderno },
] as const;

export function BarraInferior() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="border-borda bg-fundo fixed inset-x-0 bottom-0 z-10 border-t-2 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl">
        {ABAS.map(({ href, rotulo, icone: Icone }) => {
          const ativa = caminho === href;
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

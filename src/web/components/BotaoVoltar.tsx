"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A seta de voltar do cabeçalho, em todas as telas menos a inicial.
 *
 * Volta para a tela anterior quando ela é do próprio app. Quando a pessoa
 * chegou direto - por um link, pelo ícone instalado, por um recarregamento -,
 * o "anterior" do navegador seria outro site ou nada, e a seta leva à tela
 * de onde aquela costuma ser aberta.
 */
const TELA_DE_ORIGEM: Record<string, string> = {
  "/horta": "/hortas",
  "/canteiro": "/hortas",
  "/relatorios": "/hortas",
};

export function BotaoVoltar() {
  const caminho = usePathname();
  const router = useRouter();
  // Quantas telas do app há atrás desta. O layout não desmonta entre telas,
  // então a contagem sobrevive à navegação.
  const profundidade = useRef(-1);
  const voltando = useRef(false);

  useEffect(() => {
    if (voltando.current) {
      voltando.current = false;
      profundidade.current = Math.max(0, profundidade.current - 1);
    } else {
      profundidade.current += 1;
    }
  }, [caminho]);

  if (caminho === "/") return null;

  function voltar() {
    if (profundidade.current > 0) {
      voltando.current = true;
      router.back();
    } else {
      router.push(TELA_DE_ORIGEM[caminho] ?? "/");
    }
  }

  return (
    <button
      type="button"
      onClick={voltar}
      aria-label="Voltar"
      title="Voltar"
      className="text-texto active:bg-superficie -ml-3 flex size-toque items-center justify-center rounded-lg"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

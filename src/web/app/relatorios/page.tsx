import type { Metadata } from "next";
import { Suspense } from "react";
import { PainelRelatorios } from "@/components/PainelRelatorios";

export const metadata: Metadata = {
  title: "Relatórios - AgroScan",
};

/** Os relatórios de uma horta, pela query string (`?horta=`), como a horta e
 *  o canteiro: uma casca só no cache do service worker. */
export default function PaginaRelatorios() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Suspense fallback={<p className="text-texto-suave">Abrindo relatórios…</p>}>
        <PainelRelatorios />
      </Suspense>
    </div>
  );
}

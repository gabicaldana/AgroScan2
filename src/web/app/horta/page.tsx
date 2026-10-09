import type { Metadata } from "next";
import { Suspense } from "react";
import { PainelHorta } from "@/components/PainelHorta";

export const metadata: Metadata = {
  title: "Horta - AgroScan",
};

/**
 * Uma horta, pela query string (`?id=`), e não por rota dinâmica: como o
 * laudo, é uma casca só no cache do service worker.
 */
export default function PaginaHorta() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Suspense fallback={<p className="text-texto-suave">Abrindo horta…</p>}>
        <PainelHorta />
      </Suspense>
    </div>
  );
}

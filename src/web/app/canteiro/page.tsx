import type { Metadata } from "next";
import { Suspense } from "react";
import { PainelCanteiro } from "@/components/PainelCanteiro";

export const metadata: Metadata = {
  title: "Canteiro - AgroScan",
};

export default function PaginaCanteiro() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Suspense fallback={<p className="text-texto-suave">Abrindo canteiro…</p>}>
        <PainelCanteiro />
      </Suspense>
    </div>
  );
}

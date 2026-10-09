import type { Metadata } from "next";
import { PainelCaderno } from "@/components/PainelCaderno";

export const metadata: Metadata = {
  title: "Caderno de campo - AgroScan",
};

export default function PaginaCaderno() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Caderno de campo</h1>
      <p className="text-texto-suave mt-1">
        Cada diagnóstico fica salvo no aparelho na hora, mesmo sem sinal, e sobe
        para a sua conta quando houver rede.
      </p>
      <PainelCaderno />
    </div>
  );
}

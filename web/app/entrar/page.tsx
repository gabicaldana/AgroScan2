import type { Metadata } from "next";
import { PainelEntrar } from "@/components/PainelEntrar";

export const metadata: Metadata = {
  title: "Entrar - AgroScan",
};

export default function PaginaEntrar() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Sua conta</h1>
      <p className="text-texto-suave mt-1 mb-6">
        Para o histórico não se perder e para compartilhar a horta.
      </p>
      <PainelEntrar />
    </div>
  );
}

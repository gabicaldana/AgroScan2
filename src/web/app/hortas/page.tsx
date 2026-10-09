import type { Metadata } from "next";
import { PainelHortas } from "@/components/PainelHortas";

export const metadata: Metadata = {
  title: "Hortas - AgroScan",
};

export default function PaginaHortas() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Hortas</h1>
      <p className="text-texto-suave mt-1">
        Organize os canteiros e o que foi aplicado em cada um, junto com as
        pessoas que cultivam com você.
      </p>
      <PainelHortas />
    </div>
  );
}

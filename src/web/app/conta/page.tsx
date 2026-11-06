import type { Metadata } from "next";
import { PainelConta } from "@/components/PainelConta";

export const metadata: Metadata = {
  title: "Sua conta - AgroScan",
};

export default function PaginaConta() {
  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Sua conta</h1>
      <PainelConta />
    </div>
  );
}

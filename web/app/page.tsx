import type { Metadata } from "next";
import { PainelSintomas } from "@/components/PainelSintomas";

export const metadata: Metadata = {
  title: "Diagnosticar - AgroScan",
};

/**
 * Tela inicial: diagnostico por sintomas.
 *
 * Esta rota ja foi a captura por foto. A troca e deliberada e esta registrada
 * no ADR 0008: o modelo de visao nao existe, entao oferecer a camera primeiro
 * fazia a primeira acao do app terminar num aviso de indisponibilidade,
 * enquanto o unico caminho que entrega resposta aparecia como alternativa.
 *
 * O caminho da imagem continua no repositorio - camera, pre-processamento e
 * recusa -, fora da navegacao ate existir modelo. Ver components/PainelScanner.
 */
export default function PaginaDiagnostico() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Diagnosticar planta</h1>
      <p className="text-texto-suave mt-1">
        Escolha a hortaliça e marque o que você observa na planta. O sistema
        ordena as doenças compatíveis e indica qual sintoma verificar para
        desempatar.
      </p>

      <PainelSintomas />
    </div>
  );
}

import type { Metadata } from "next";
import { BotaoLink } from "@/components/Botao";

export const metadata: Metadata = {
  title: "Página não encontrada - AgroScan",
};

/**
 * A página de endereço inexistente.
 *
 * A padrão do Next sai em inglês e com texto de 14 px, o que fere o RNF09
 * (interface em português) e o RNF07 (corpo de 18 px). Auditoria WCAG (#76).
 */
export default function NaoEncontrada() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Página não encontrada</h1>
      <p>
        Este endereço não existe no AgroScan. O diagnóstico continua na tela
        inicial.
      </p>
      <BotaoLink href="/" variante="primario">
        Ir para o início
      </BotaoLink>
    </div>
  );
}

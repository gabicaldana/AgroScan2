"use client";

import { listarCulturas } from "@/lib/diagnostico.ts";

/**
 * As hortalicas vem da base de conhecimento, nao de uma lista escrita aqui.
 *
 * Informar a cultura restringe o diagnostico as doencas que realmente ocorrem
 * nela - o produtor *sabe* o que plantou, e essa informacao vale mais do que
 * qualquer inferencia.
 */
const TODAS = listarCulturas();
const COM_DOENCA = listarCulturas(true);

/**
 * Classificacao da Embrapa por parte comestivel. A ordem e a que faz sentido
 * na horta: o que se colhe acima do solo primeiro, a raiz por ultimo.
 */
const ROTULO_DO_GRUPO: Record<string, string> = {
  fruto: "Hortaliças-fruto",
  folha: "Folhosas",
  flor: "Hortaliças-flor",
  haste: "Hortaliças-haste",
  raiz: "Raízes, tubérculos e bulbos",
};
const ORDEM_DOS_GRUPOS = ["fruto", "folha", "flor", "haste", "raiz"];

export function SeletorCultura({
  valor,
  aoTrocar,
  apenasComDoencas = false,
  ajuda,
}: {
  valor: string;
  aoTrocar: (culturaId: string) => void;
  /** No fluxo por sintomas, cultura sem doenca cadastrada e beco sem saida. */
  apenasComDoencas?: boolean;
  ajuda?: string;
}) {
  const culturas = apenasComDoencas ? COM_DOENCA : TODAS;

  // Agrupar nao e enfeite: com dezenas de hortalicas, uma lista plana num
  // celular sob sol vira rolagem as cegas. Os grupos vazios somem sozinhos,
  // entao a tela acompanha a curadoria sem precisar ser mexida.
  const grupos = ORDEM_DOS_GRUPOS.map((g) => ({
    id: g,
    rotulo: ROTULO_DO_GRUPO[g],
    itens: culturas.filter((c) => c.grupo === g),
  })).filter((g) => g.itens.length > 0);

  return (
    <div>
      <label htmlFor="cultura" className="mb-2 block text-base font-bold">
        Cultura
      </label>
      <select
        id="cultura"
        value={valor}
        onChange={(e) => aoTrocar(e.target.value)}
        className="border-borda-forte bg-fundo h-toque w-full rounded-lg border-2 px-4 text-base font-semibold"
      >
        {grupos.length === 1
          ? grupos[0].itens.map((c) => <Opcao key={c.id} cultura={c} />)
          : grupos.map((g) => (
              <optgroup key={g.id} label={g.rotulo}>
                {g.itens.map((c) => (
                  <Opcao key={c.id} cultura={c} />
                ))}
              </optgroup>
            ))}
      </select>
      {ajuda && <p className="text-texto-suave mt-2 text-sm">{ajuda}</p>}
    </div>
  );
}

function Opcao({ cultura }: { cultura: (typeof TODAS)[number] }) {
  return (
    <option value={cultura.id}>
      {cultura.emoji}  {cultura.nome}
    </option>
  );
}

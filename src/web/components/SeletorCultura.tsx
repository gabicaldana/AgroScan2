"use client";

import { useEffect } from "react";

import { useVersaoDoCatalogo } from "@/components/SincronizacaoDoCatalogo";
import { listarCulturas, type CulturaResumida } from "@/lib/diagnostico.ts";

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

/**
 * As hortalicas vem da base de conhecimento, nao de uma lista escrita aqui.
 *
 * Informar a cultura restringe o diagnostico as doencas que realmente ocorrem
 * nela - o produtor *sabe* o que plantou, e essa informacao vale mais do que
 * qualquer inferencia.
 */
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
  // A lista acompanha o catalogo ativo, que pode ter sido atualizado sem
  // reinstalacao (US36).
  useVersaoDoCatalogo();

  // Sem memo, de proposito. `listarCulturas` filtra e ordena no maximo 24
  // itens, e o resultado depende de estado mutavel de modulo - os indices do
  // motor, que trocam quando um catalogo mais novo entra em uso. Memorizar
  // exigiria declarar a versao como chave de invalidacao de um calculo que
  // nao a menciona, e o custo evitado nao paga a confusao.
  const culturas = listarCulturas(apenasComDoencas);

  // Agrupar nao e enfeite: com dezenas de hortalicas, uma lista plana num
  // celular sob sol vira rolagem as cegas. Os grupos vazios somem sozinhos,
  // entao a tela acompanha a curadoria sem precisar ser mexida.
  const grupos = ORDEM_DOS_GRUPOS.map((g) => ({
    id: g,
    rotulo: ROTULO_DO_GRUPO[g],
    itens: culturas.filter((c) => c.grupo === g),
  })).filter((g) => g.itens.length > 0);

  const selecionada = culturas.find((c) => c.id === valor);

  // Um catalogo novo pode nao trazer mais a cultura selecionada - curadoria
  // corrige um `id`, ou a cultura sai da base. Sem isto, o `select` exibiria
  // a primeira opcao da lista enquanto o estado do pai continua apontando
  // para a cultura sumida, e a tela de sintomas viria vazia sem explicar por
  // que. Avisar o pai reconcilia os dois.
  useEffect(() => {
    if (!selecionada && culturas.length > 0) {
      aoTrocar(culturas[0].id);
    }
  }, [selecionada, culturas, aoTrocar]);

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
      {/* O nome cientifico fica aqui, e nao dentro da `option`: no seletor
          nativo do celular o texto longo trunca, e "Brassica oleracea var.
          acephala" some justamente na parte que o distingue de outra
          variedade. Embaixo, ele cabe inteiro e acompanha a selecao. */}
      {selecionada && (
        <p className="text-texto-suave mt-2 text-sm">
          <i>{selecionada.nomeCientifico}</i>
          {selecionada.familia && ` · ${selecionada.familia}`}
        </p>
      )}
      {ajuda && <p className="text-texto-suave mt-2 text-sm">{ajuda}</p>}
    </div>
  );
}

function Opcao({ cultura }: { cultura: CulturaResumida }) {
  return (
    <option value={cultura.id}>
      {cultura.emoji}  {cultura.nome}
    </option>
  );
}

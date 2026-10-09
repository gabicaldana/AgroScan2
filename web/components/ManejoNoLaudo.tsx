"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Canteiro } from "@/lib/api.ts";
import * as canteiros from "@/lib/canteiros.ts";
import { catalogoAtivo } from "@/lib/catalogo.ts";

/**
 * Do laudo para o registro do que foi feito (US26).
 *
 * Oferece os canteiros da cultura da doença. O formulário de manejo abre com
 * a doença já marcada: é o laço "diagnosticou → interveio" do caderno de
 * campo. Sem conta ou sem canteiro dessa cultura, não aparece nada - o laudo
 * continua sendo o laudo.
 */
export function ManejoNoLaudo({ doencaId }: { doencaId: string }) {
  const [lista, setLista] = useState<Canteiro[]>([]);

  useEffect(() => {
    let vivo = true;
    void canteiros.atualizar().then((l) => vivo && setLista(l));
    return () => {
      vivo = false;
    };
  }, []);

  const culturaId = catalogoAtivo().culturas.find((c) =>
    c.doencas.some((d) => d.id === doencaId),
  )?.id;
  const opcoes = culturaId ? canteiros.daCultura(lista, culturaId) : [];

  if (opcoes.length === 0) return null;

  return (
    <section aria-labelledby="titulo-manejo-laudo" className="mt-6">
      <h2 id="titulo-manejo-laudo" className="text-lg font-bold">
        Registrar o manejo aplicado
      </h2>
      <p className="text-texto-suave mt-1 text-sm">
        Em qual canteiro você interveio?
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {opcoes.map((c) => (
          <li key={c.id}>
            <Link
              href={`/canteiro?id=${c.id}&doenca=${encodeURIComponent(doencaId)}#manejo`}
              className="border-borda-forte h-toque flex items-center justify-between rounded-lg border-2 px-4 font-bold"
            >
              <span>{c.identificacao}</span>
              <span className="text-texto-suave text-sm font-normal">
                {c.horta_nome}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

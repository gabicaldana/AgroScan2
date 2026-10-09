"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Botao } from "@/components/Botao";
import {
  AreaDeTexto,
  Campo,
  MensagemDeErro,
  PrecisaDeConta,
  Selecao,
  descreverFalha,
  formatarData,
  hojeISO,
  useAutenticado,
} from "@/components/Formulario";
import * as api from "@/lib/api.ts";
import * as canteiros from "@/lib/canteiros.ts";
import { catalogoAtivo } from "@/lib/catalogo.ts";

const ROTULO_TIPO: Record<api.TipoManejo, string> = {
  cultural: "Cultural",
  biologico: "Biológico",
  quimico: "Químico",
};

/**
 * Um canteiro e o que foi aplicado nele (US26).
 *
 * Chega aqui também a partir do laudo, com `?doenca=` na URL: o formulário de
 * manejo abre já com a doença marcada, que é o caminho "diagnosticou →
 * interveio" que o caderno de campo existe para registrar.
 */
export function PainelCanteiro() {
  const autenticado = useAutenticado();
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const doencaDoLaudo = params.get("doenca");
  const [canteiro, setCanteiro] = useState<api.CanteiroDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [encerrando, setEncerrando] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      setCanteiro(await api.detalharCanteiro(id));
      setErro(null);
    } catch (falha) {
      setErro(descreverFalha(falha));
    }
  }, [id]);

  useEffect(() => {
    if (!autenticado || !id) return;
    let vivo = true;
    api
      .detalharCanteiro(id)
      .then((c) => vivo && setCanteiro(c))
      .catch((falha) => vivo && setErro(descreverFalha(falha)));
    return () => {
      vivo = false;
    };
  }, [autenticado, id]);

  if (!autenticado) return <PrecisaDeConta />;
  if (!id) return <MensagemDeErro>Canteiro não informado.</MensagemDeErro>;
  if (erro && !canteiro) return <MensagemDeErro>{erro}</MensagemDeErro>;
  if (!canteiro) return <p className="text-texto-suave">Abrindo canteiro…</p>;

  async function encerrar() {
    if (!confirm(
      "Encerrar este ciclo? O canteiro e o histórico ficam guardados. Para " +
      "plantar de novo no mesmo lugar, cadastre um canteiro novo.")) return;
    setEncerrando(true);
    try {
      await api.encerrarCanteiro(id);
      await canteiros.atualizar();
      await recarregar();
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setEncerrando(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link href={`/horta?id=${canteiro.horta_id}`}
          className="text-primaria text-sm font-bold underline">
          ← {canteiro.horta_nome ?? "Horta"}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {canteiro.identificacao}
        </h1>
        <p className="text-texto-suave">
          {canteiro.emoji} {canteiro.cultura_nome}
          {canteiro.data_plantio && ` · plantio em ${formatarData(canteiro.data_plantio)}`}
          {!canteiro.ativo && " · ciclo encerrado"}
        </p>
      </header>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

      {canteiro.ativo && (
        <FormularioManejo
          canteiro={canteiro}
          doencaInicial={doencaDoLaudo}
          aoRegistrar={recarregar}
        />
      )}

      <section aria-labelledby="titulo-manejos" className="flex flex-col gap-3">
        <h2 id="titulo-manejos" className="text-xl font-bold">Manejos aplicados</h2>
        {canteiro.manejos.length === 0 ? (
          <p className="text-texto-suave">Nenhum manejo registrado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {canteiro.manejos.map((m) => (
              <li key={m.id} className="border-borda rounded-lg border-2 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold">{ROTULO_TIPO[m.tipo]}</span>
                  <span className="text-texto-suave text-sm">
                    {formatarData(m.aplicado_em)}
                  </span>
                </div>
                <p className="mt-1">{m.descricao}</p>
                {m.produto && (
                  <p className="mt-1 text-sm">
                    <strong>Produto:</strong> {m.produto}
                    {m.dose && ` · ${m.dose}`}
                  </p>
                )}
                <p className="text-texto-suave mt-1 text-sm">
                  {m.doenca_nome && `Contra ${m.doenca_nome} · `}
                  {m.responsavel_nome ?? "autor removido"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canteiro.ativo && (
        <Botao type="button" variante="secundario" onClick={encerrar}
          disabled={encerrando}>
          {encerrando ? "Encerrando…" : "Encerrar ciclo deste canteiro"}
        </Botao>
      )}
    </div>
  );
}

function FormularioManejo({
  canteiro,
  doencaInicial,
  aoRegistrar,
}: {
  canteiro: api.Canteiro;
  doencaInicial: string | null;
  aoRegistrar: () => Promise<void>;
}) {
  const doencas =
    catalogoAtivo().culturas.find((c) => c.id === canteiro.cultura_id)?.doencas ?? [];
  const doencaValida = doencas.some((d) => d.id === doencaInicial)
    ? doencaInicial ?? ""
    : "";

  const [tipo, setTipo] = useState<api.TipoManejo>("cultural");
  const [descricao, setDescricao] = useState("");
  const [produto, setProduto] = useState("");
  const [dose, setDose] = useState("");
  const [aplicadoEm, setAplicadoEm] = useState(hojeISO());
  const [doencaId, setDoencaId] = useState(doencaValida);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setOcupado(true);
    try {
      await api.registrarManejo(canteiro.id, {
        tipo,
        descricao,
        // Produto e dose só existem no manejo químico: a API recusa o
        // contrário, e a tela nem os envia.
        produto: tipo === "quimico" ? produto || null : null,
        dose: tipo === "quimico" ? dose || null : null,
        aplicado_em: aplicadoEm,
        doenca_id: doencaId || null,
      });
      setDescricao("");
      setProduto("");
      setDose("");
      setRegistrado(true);
      await aoRegistrar();
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <form id="manejo" onSubmit={enviar}
      className="border-borda flex flex-col gap-4 rounded-xl border-2 p-4">
      <h2 className="text-xl font-bold">Registrar manejo</h2>

      <fieldset>
        <legend className="mb-2 text-base font-bold">Tipo</legend>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(ROTULO_TIPO) as api.TipoManejo[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
              className={`h-toque rounded-lg border-2 px-1 text-sm font-bold ${
                tipo === t ? "border-primaria bg-primaria text-white" : "border-borda-forte"
              }`}
            >
              {ROTULO_TIPO[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <AreaDeTexto id="manejo-descricao" rotulo="O que foi feito" valor={descricao}
        aoMudar={setDescricao} obrigatorio
        ajuda="Ex.: retirada e destruição das folhas baixeiras atacadas." />

      {tipo === "quimico" && (
        <>
          <Campo id="manejo-produto" rotulo="Produto" valor={produto}
            aoMudar={setProduto} maxLength={200}
            ajuda="Nome comercial ou ingrediente ativo, como está no receituário." />
          <Campo id="manejo-dose" rotulo="Dose" valor={dose} aoMudar={setDose}
            maxLength={200} ajuda="Ex.: 2 g/L de água." />
          <p className="text-texto-suave text-sm">
            A aplicação de defensivo exige receituário agronômico. O registro
            aqui serve para controlar a carência e o histórico do canteiro.
          </p>
        </>
      )}

      <Campo id="manejo-data" rotulo="Data da aplicação" tipo="date"
        valor={aplicadoEm} aoMudar={setAplicadoEm} obrigatorio />

      {doencas.length > 0 && (
        <Selecao id="manejo-doenca" rotulo="Contra qual doença (opcional)"
          valor={doencaId} aoMudar={setDoencaId}>
          <option value="">Nenhuma em particular</option>
          {doencas.map((d) => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </Selecao>
      )}

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {registrado && !erro && (
        <p role="status" className="border-borda-forte rounded-lg border-2 p-3 font-semibold">
          Manejo registrado.
        </p>
      )}

      <Botao type="submit" disabled={ocupado}>
        {ocupado ? "Salvando…" : "Registrar manejo"}
      </Botao>
    </form>
  );
}

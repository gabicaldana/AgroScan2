"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Botao } from "@/components/Botao";
import {
  Campo,
  MensagemDeErro,
  PrecisaDeConta,
  descreverFalha,
  useAutenticado,
} from "@/components/Formulario";
import * as api from "@/lib/api.ts";
import * as canteiros from "@/lib/canteiros.ts";

/**
 * As hortas da pessoa e o cadastro de uma nova (US22).
 *
 * Quem cria vira responsável. Hortas em que a pessoa entrou como membro
 * aparecem na mesma lista, com o papel ao lado.
 */
export function PainelHortas() {
  const autenticado = useAutenticado();
  const [hortas, setHortas] = useState<api.Horta[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    if (!autenticado) return;
    let vivo = true;
    api
      .listarHortas()
      .then((lista) => vivo && setHortas(lista))
      .catch((falha) => vivo && setErro(descreverFalha(falha)));
    // Aproveita a rede para renovar a lista que a consulta usa offline.
    void canteiros.atualizar();
    return () => {
      vivo = false;
    };
  }, [autenticado]);

  if (!autenticado) return <div className="mt-6"><PrecisaDeConta /></div>;

  function aoCriar(horta: api.Horta) {
    setHortas((atual) =>
      [...(atual ?? []), horta].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    );
    setCriando(false);
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

      {hortas === null && !erro && (
        <p className="text-texto-suave">Carregando hortas…</p>
      )}

      {hortas !== null && hortas.length === 0 && !criando && (
        <div className="border-borda bg-superficie rounded-xl border-2 border-dashed p-6 text-center">
          <p className="font-bold">Nenhuma horta ainda</p>
          <p className="text-texto-suave mt-1 text-sm">
            Cadastre a sua, ou peça a quem cuida de uma horta comunitária para
            adicionar você pelo e-mail desta conta.
          </p>
        </div>
      )}

      {hortas !== null && hortas.length > 0 && (
        <ul className="flex flex-col gap-3">
          {hortas.map((h) => (
            <li key={h.id}>
              <Link
                href={`/horta?id=${h.id}`}
                className="border-borda block rounded-lg border-2 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold">{h.nome}</span>
                  <span className="text-texto-suave text-sm">
                    {h.papel === "responsavel" ? "Responsável" : "Membro"}
                  </span>
                </div>
                <p className="text-texto-suave text-sm">
                  {h.municipio} - {h.uf}
                  {h.canteiros_ativos !== undefined &&
                    ` · ${h.canteiros_ativos} ${h.canteiros_ativos === 1 ? "canteiro" : "canteiros"}`}
                  {h.membros !== undefined &&
                    ` · ${h.membros} ${h.membros === 1 ? "pessoa" : "pessoas"}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {criando ? (
        <FormularioHorta aoCriar={aoCriar} aoCancelar={() => setCriando(false)} />
      ) : (
        hortas !== null && (
          <Botao type="button" onClick={() => setCriando(true)}>
            Cadastrar horta
          </Botao>
        )
      )}
    </div>
  );
}

function FormularioHorta({
  aoCriar,
  aoCancelar,
}: {
  aoCriar: (horta: api.Horta) => void;
  aoCancelar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setOcupado(true);
    try {
      aoCriar(await api.criarHorta({ nome, municipio, uf }));
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="border-borda flex flex-col gap-4 rounded-xl border-2 p-4"
    >
      <h2 className="text-lg font-bold">Nova horta</h2>
      <Campo id="horta-nome" rotulo="Nome" valor={nome} aoMudar={setNome}
        obrigatorio maxLength={120} ajuda="Ex.: Horta da Escola, Sítio Boa Vista." />
      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <Campo id="horta-municipio" rotulo="Município" valor={municipio}
          aoMudar={setMunicipio} obrigatorio maxLength={120} />
        <Campo id="horta-uf" rotulo="UF" valor={uf}
          aoMudar={(v) => setUf(v.toUpperCase().slice(0, 2))} obrigatorio maxLength={2} />
      </div>
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      <Botao type="submit" disabled={ocupado}>
        {ocupado ? "Salvando…" : "Cadastrar horta"}
      </Botao>
      <Botao type="button" variante="secundario" onClick={aoCancelar}>
        Cancelar
      </Botao>
    </form>
  );
}

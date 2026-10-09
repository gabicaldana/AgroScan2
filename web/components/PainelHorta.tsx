"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Botao } from "@/components/Botao";
import {
  Campo,
  MensagemDeErro,
  PrecisaDeConta,
  descreverFalha,
  formatarData,
  useAutenticado,
} from "@/components/Formulario";
import { SeletorCultura } from "@/components/SeletorCultura";
import * as api from "@/lib/api.ts";
import * as canteiros from "@/lib/canteiros.ts";
import * as sessao from "@/lib/sessao.ts";

/**
 * Uma horta: canteiros (US24) e membros (US23).
 *
 * O que cada pessoa pode fazer é decidido pela API; a tela só esconde o que
 * a API recusaria, para não oferecer um botão que dá erro.
 */
export function PainelHorta() {
  const autenticado = useAutenticado();
  const id = Number(useSearchParams().get("id"));
  const [horta, setHorta] = useState<api.HortaDetalhada | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setHorta(await api.detalharHorta(id));
      setErro(null);
    } catch (falha) {
      setErro(descreverFalha(falha));
    }
  }, [id]);

  useEffect(() => {
    if (!autenticado || !id) return;
    let vivo = true;
    api
      .detalharHorta(id)
      .then((h) => vivo && setHorta(h))
      .catch((falha) => vivo && setErro(descreverFalha(falha)));
    return () => {
      vivo = false;
    };
  }, [autenticado, id]);

  if (!autenticado) return <PrecisaDeConta />;
  if (!id) return <MensagemDeErro>Horta não informada.</MensagemDeErro>;
  if (erro && !horta) return <MensagemDeErro>{erro}</MensagemDeErro>;
  if (!horta) return <p className="text-texto-suave">Abrindo horta…</p>;

  const responsavel = horta.papel === "responsavel";
  const ativos = horta.canteiros.filter((c) => c.ativo);
  const encerrados = horta.canteiros.filter((c) => !c.ativo);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link href="/hortas" className="text-primaria text-sm font-bold underline">
          ← Hortas
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{horta.nome}</h1>
        <p className="text-texto-suave">
          {horta.municipio} - {horta.uf} ·{" "}
          {responsavel ? "você é a pessoa responsável" : "você é membro"}
        </p>
      </header>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

      <section aria-labelledby="titulo-canteiros" className="flex flex-col gap-3">
        <h2 id="titulo-canteiros" className="text-xl font-bold">Canteiros</h2>
        {ativos.length === 0 ? (
          <p className="text-texto-suave">Nenhum canteiro em cultivo.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ativos.map((c) => (
              <li key={c.id}><CartaoCanteiro canteiro={c} /></li>
            ))}
          </ul>
        )}
        <NovoCanteiro hortaId={horta.id} aoCriar={recarregar} />
        {encerrados.length > 0 && (
          <details className="mt-2">
            <summary className="h-toque flex cursor-pointer items-center font-bold">
              Ciclos encerrados ({encerrados.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-3">
              {encerrados.map((c) => (
                <li key={c.id}><CartaoCanteiro canteiro={c} /></li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section aria-labelledby="titulo-membros" className="flex flex-col gap-3">
        <h2 id="titulo-membros" className="text-xl font-bold">Pessoas</h2>
        <Membros horta={horta} aoMudar={recarregar} />
      </section>
    </div>
  );
}

function CartaoCanteiro({ canteiro }: { canteiro: api.Canteiro }) {
  return (
    <Link
      href={`/canteiro?id=${canteiro.id}`}
      className={`border-borda block rounded-lg border-2 p-4 ${canteiro.ativo ? "" : "bg-superficie"}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold">{canteiro.identificacao}</span>
        {!canteiro.ativo && (
          <span className="text-texto-suave text-sm">Encerrado</span>
        )}
      </div>
      <p className="text-texto-suave text-sm">
        {canteiro.emoji} {canteiro.cultura_nome}
        {canteiro.data_plantio && ` · plantio em ${formatarData(canteiro.data_plantio)}`}
      </p>
    </Link>
  );
}

function NovoCanteiro({
  hortaId,
  aoCriar,
}: {
  hortaId: number;
  aoCriar: () => Promise<void>;
}) {
  const [aberto, setAberto] = useState(false);
  const [identificacao, setIdentificacao] = useState("");
  const [culturaId, setCulturaId] = useState("tomate");
  const [dataPlantio, setDataPlantio] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) {
    return (
      <Botao type="button" variante="secundario" onClick={() => setAberto(true)}>
        Cadastrar canteiro
      </Botao>
    );
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setOcupado(true);
    try {
      await api.criarCanteiro(hortaId, {
        identificacao,
        cultura_id: culturaId,
        data_plantio: dataPlantio || null,
      });
      // O canteiro novo precisa estar no aparelho antes de faltar rede, para
      // a consulta feita nele poder ser vinculada offline.
      await canteiros.atualizar();
      await aoCriar();
      setAberto(false);
      setIdentificacao("");
      setDataPlantio("");
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <form onSubmit={enviar} className="border-borda flex flex-col gap-4 rounded-xl border-2 p-4">
      <h3 className="text-lg font-bold">Novo canteiro</h3>
      <Campo id="canteiro-id" rotulo="Identificação" valor={identificacao}
        aoMudar={setIdentificacao} obrigatorio maxLength={120}
        ajuda="Como vocês chamam este canteiro: Canteiro 3, Estufa A…" />
      <SeletorCultura valor={culturaId} aoTrocar={setCulturaId}
        ajuda="Para plantar outra cultura no mesmo lugar depois, encerre este canteiro e cadastre outro: é o histórico que permite avisar sobre rotação." />
      <Campo id="canteiro-plantio" rotulo="Data de plantio" tipo="date"
        valor={dataPlantio} aoMudar={setDataPlantio} />
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      <Botao type="submit" disabled={ocupado}>
        {ocupado ? "Salvando…" : "Cadastrar canteiro"}
      </Botao>
      <Botao type="button" variante="secundario" onClick={() => setAberto(false)}>
        Cancelar
      </Botao>
    </form>
  );
}

function Membros({
  horta,
  aoMudar,
}: {
  horta: api.HortaDetalhada;
  aoMudar: () => Promise<void>;
}) {
  const router = useRouter();
  const responsavel = horta.papel === "responsavel";
  const euId = sessao.usuario()?.id;
  const [email, setEmail] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function executar(acao: () => Promise<unknown>, depois?: () => void) {
    setErro(null);
    setOcupado(true);
    try {
      await acao();
      if (depois) depois();
      else await aoMudar();
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  async function adicionar(evento: React.FormEvent) {
    evento.preventDefault();
    await executar(async () => {
      await api.adicionarMembro(horta.id, email);
      setEmail("");
    });
  }

  const sozinho = horta.membros.length === 1;

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {horta.membros.map((m) => (
          <li key={m.id} className="border-borda rounded-lg border-2 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold">
                {m.nome}
                {m.id === euId && " (você)"}
              </span>
              <span className="text-texto-suave text-sm">
                {m.papel === "responsavel" ? "Responsável" : "Membro"}
              </span>
            </div>
            <p className="text-texto-suave text-sm break-all">{m.email}</p>
            {responsavel && m.papel !== "responsavel" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => {
                    if (confirm(`Passar a responsabilidade da horta para ${m.nome}? Você continua como membro.`))
                      void executar(() => api.transferirHorta(horta.id, m.id));
                  }}
                  className="border-borda-forte h-toque rounded-lg border-2 px-2 text-sm font-bold"
                >
                  Tornar responsável
                </button>
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => {
                    if (confirm(`Remover ${m.nome} da horta?`))
                      void executar(() => api.removerMembro(horta.id, m.id));
                  }}
                  className="border-borda-forte h-toque rounded-lg border-2 px-2 text-sm font-bold"
                >
                  Remover
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

      {responsavel && (
        <form onSubmit={adicionar} className="flex flex-col gap-3">
          <Campo id="membro-email" rotulo="Adicionar pessoa pelo e-mail" tipo="email"
            valor={email} aoMudar={setEmail} obrigatorio autoComplete="off"
            ajuda="A pessoa precisa ter criado a conta no AgroScan antes." />
          <Botao type="submit" variante="secundario" disabled={ocupado}>
            Adicionar à horta
          </Botao>
        </form>
      )}

      {!responsavel && euId !== undefined && (
        <Botao
          type="button"
          variante="secundario"
          disabled={ocupado}
          onClick={() => {
            if (confirm("Sair desta horta? Você deixa de ver os canteiros dela."))
              void executar(() => api.removerMembro(horta.id, euId),
                () => router.push("/hortas"));
          }}
        >
          Sair da horta
        </Botao>
      )}

      {responsavel && sozinho && (
        <Botao
          type="button"
          variante="secundario"
          disabled={ocupado}
          onClick={() => {
            if (confirm(`Apagar a horta “${horta.nome}” com todos os canteiros e manejos? Não dá para desfazer.`))
              void executar(async () => {
                await api.apagarHorta(horta.id);
                await canteiros.atualizar();
              }, () => router.push("/hortas"));
          }}
        >
          Apagar horta
        </Botao>
      )}
    </div>
  );
}

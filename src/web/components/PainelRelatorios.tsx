"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { EstadoVazio } from "@/components/EstadoVazio";
import {
  MensagemDeErro,
  PrecisaDeConta,
  descreverFalha,
  formatarData,
  useAutenticado,
} from "@/components/Formulario";
import * as api from "@/lib/api.ts";
import * as relatorios from "@/lib/relatorios.ts";
import * as sessao from "@/lib/sessao.ts";

/**
 * Os relatórios de uma horta (épico E6): o que mais ocorreu, quanto do
 * diagnóstico se confirmou, que sintomas mais se observam e onde a rotação de
 * família não está acontecendo.
 *
 * Os números saem do banco, sobre as consultas vinculadas aos canteiros da
 * horta, de todas as pessoas. Consulta sem canteiro é do caderno de quem a
 * fez e não entra aqui - a tela diz isso, para a conta não parecer errada.
 */
export function PainelRelatorios() {
  const autenticado = useAutenticado();
  const id = Number(useSearchParams().get("horta"));

  if (!autenticado) return <PrecisaDeConta />;
  if (!id) return <MensagemDeErro>Horta não informada.</MensagemDeErro>;

  return (
    <div className="flex flex-col gap-10">
      <header>
        <Link href={`/horta?id=${id}`} className="text-primaria text-sm font-bold underline">
          ← Horta
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Relatórios da horta</h1>
        <p className="text-texto-suave">
          Sobre as consultas feitas nos canteiros desta horta, por todas as
          pessoas dela. Consultas sem canteiro ficam só no caderno de quem as fez.
        </p>
      </header>
      <Incidencia hortaId={id} />
      <Confirmacao hortaId={id} />
      <Sintomas hortaId={id} />
      <Rotacao hortaId={id} />
    </div>
  );
}

/** Busca ao montar e quando `chave` muda; descarta resposta que chegou tarde. */
function useRelatorio<T>(buscar: () => Promise<T>, chave: string) {
  const [estado, setEstado] = useState<{ chave: string; dado?: T; erro?: string } | null>(null);

  useEffect(() => {
    let vivo = true;
    buscar()
      .then((dado) => vivo && setEstado({ chave, dado }))
      .catch((falha) => vivo && setEstado({ chave, erro: descreverFalha(falha) }));
    return () => {
      vivo = false;
    };
    // `buscar` muda a cada render; a chave é o que diz se a pergunta mudou.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const atual = estado?.chave === chave ? estado : null;
  return { dado: atual?.dado, erro: atual?.erro, carregando: atual === null };
}

// =============================================================================
// US27 - incidência por período
// =============================================================================

function Incidencia({ hortaId }: { hortaId: number }) {
  const [periodoId, setPeriodoId] = useState<relatorios.PeriodoDoRelatorio>("6m");
  const intervalo = useMemo(() => relatorios.periodo(periodoId, new Date()), [periodoId]);
  const { dado, erro, carregando } = useRelatorio(
    () => api.relatorioDeIncidencia(hortaId, intervalo),
    `${hortaId}:${intervalo.de}:${intervalo.ate}`,
  );
  const meses = useMemo(() => relatorios.agruparPorMes(dado?.linhas ?? []), [dado]);
  const maior = Math.max(1, ...(dado?.linhas ?? []).map((l) => l.ocorrencias));

  return (
    <section aria-labelledby="titulo-incidencia" className="flex flex-col gap-4">
      <div>
        <h2 id="titulo-incidencia" className="text-xl font-bold">
          Doenças que mais ocorreram
        </h2>
        <p className="text-texto-suave text-sm">
          Pela hipótese principal de cada diagnóstico, mês a mês.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Período</legend>
        <div className="grid grid-cols-3 gap-2">
          {relatorios.PERIODOS_DO_RELATORIO.map((p) => {
            const ativo = p.id === periodoId;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setPeriodoId(p.id)}
                className={`h-toque rounded-lg border-2 px-1 text-sm font-bold ${
                  ativo ? "border-primaria bg-primaria text-white" : "border-borda-forte"
                }`}
              >
                {p.rotulo}
              </button>
            );
          })}
        </div>
      </fieldset>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {carregando && <p className="text-texto-suave">Contando…</p>}

      {dado && (
        <>
          <p className="text-texto-suave text-sm" role="status">
            {dado.consultas} {dado.consultas === 1 ? "consulta" : "consultas"} de{" "}
            {formatarData(dado.de)} a {formatarData(dado.ate)}
            {dado.sem_hipotese > 0 &&
              `, das quais ${dado.sem_hipotese} sem doença compatível`}
          </p>

          {meses.length === 0 ? (
            <EstadoVazio titulo="Nenhum diagnóstico neste período">
              <p>
                Ao salvar um diagnóstico, escolha o canteiro em que ele foi
                feito: é assim que ele entra no relatório da horta.
              </p>
            </EstadoVazio>
          ) : (
            <ol className="flex flex-col gap-4">
              {meses.map((m) => (
                <li key={m.mes} className="border-borda rounded-lg border-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold first-letter:uppercase">{m.rotulo}</h3>
                    <span className="text-texto-suave text-sm">
                      {m.total} {m.total === 1 ? "ocorrência" : "ocorrências"}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-3">
                    {m.linhas.map((l) => (
                      <li key={l.doenca_id}>
                        <div className="flex items-baseline justify-between gap-2 text-sm">
                          <span>
                            <span className="font-semibold">{l.doenca_nome}</span>{" "}
                            <span className="text-texto-suave">· {l.cultura_nome}</span>
                          </span>
                          <span className="font-bold tabular-nums">{l.ocorrencias}</span>
                        </div>
                        {/* A barra repete o número, que já está escrito ao lado. */}
                        <div aria-hidden="true" className="bg-superficie mt-1 h-2 rounded">
                          <div
                            className="bg-primaria h-2 rounded"
                            style={{ width: `${(l.ocorrencias / maior) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </section>
  );
}

// =============================================================================
// US28 - taxa de confirmação
// =============================================================================

function Confirmacao({ hortaId }: { hortaId: number }) {
  const { dado, erro, carregando } = useRelatorio(
    () => api.relatorioDeConfirmacao(hortaId),
    String(hortaId),
  );

  return (
    <section aria-labelledby="titulo-confirmacao" className="flex flex-col gap-4">
      <div>
        <h2 id="titulo-confirmacao" className="text-xl font-bold">
          Quanto do diagnóstico se confirmou
        </h2>
        <p className="text-texto-suave text-sm">
          Pelo retorno de quem voltou ao canteiro depois do diagnóstico. As
          doenças com menor taxa aparecem primeiro: são as que a curadoria
          precisa revisar.
        </p>
      </div>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {carregando && <p className="text-texto-suave">Contando…</p>}

      {dado && dado.avaliadas === 0 && (
        <EstadoVazio titulo="Nenhum diagnóstico avaliado ainda">
          <p>
            A taxa aparece quando as pessoas da horta informarem se o
            diagnóstico se confirmou no campo.
          </p>
        </EstadoVazio>
      )}

      {dado && dado.avaliadas > 0 && (
        <>
          <p className="text-texto-suave text-sm" role="status">
            {dado.avaliadas} de {dado.consultas}{" "}
            {dado.consultas === 1 ? "consulta avaliada" : "consultas avaliadas"},{" "}
            {dado.confirmadas} {dado.confirmadas === 1 ? "confirmada" : "confirmadas"}.
            A taxa só é calculada a partir de {dado.amostra_minima} avaliações da
            mesma doença.
          </p>
          <ul className="flex flex-col gap-3">
            {dado.linhas.map((l) => {
              const texto = relatorios.descreverConfirmacao(l, dado.amostra_minima);
              return (
                <li key={l.doenca_id} className="border-borda rounded-lg border-2 p-4">
                  <p className="font-bold">{l.doenca_nome}</p>
                  <p className="text-texto-suave text-sm">{l.cultura_nome}</p>
                  <p className="mt-2 flex items-baseline justify-between gap-2">
                    <span>{texto.contagem}</span>
                    <span
                      className={
                        l.taxa_pct === null
                          ? "text-texto-suave text-right text-sm"
                          : "text-lg font-bold tabular-nums"
                      }
                    >
                      {texto.taxa}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

// =============================================================================
// US29 - sintomas mais marcados por cultura
// =============================================================================

const semAssinatura = () => () => {};
const papelDaSessao = () => sessao.usuario()?.papel ?? null;

type Recorte = "horta" | "sistema";

function Sintomas({ hortaId }: { hortaId: number }) {
  // O papel vem do localStorage: no servidor, ninguém é da curadoria.
  const papel = useSyncExternalStore(semAssinatura, papelDaSessao, () => null);
  const podeVerOSistema = relatorios.veOSistema(papel);
  const [escolhido, setEscolhido] = useState<Recorte>("horta");
  const recorte: Recorte = podeVerOSistema ? escolhido : "horta";

  const { dado, erro, carregando } = useRelatorio(
    () =>
      recorte === "sistema"
        ? api.relatorioDeSintomasDoSistema()
        : api.relatorioDeSintomas(hortaId),
    `${recorte}:${hortaId}`,
  );

  return (
    <section aria-labelledby="titulo-sintomas" className="flex flex-col gap-4">
      <div>
        <h2 id="titulo-sintomas" className="text-xl font-bold">
          Sintomas mais marcados
        </h2>
        <p className="text-texto-suave text-sm">
          O que as pessoas mais observaram em cada cultura. Sintoma muito
          marcado que poucas doenças cadastradas têm mostra onde a base de
          conhecimento precisa crescer.
        </p>
      </div>

      {podeVerOSistema && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Consultas</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["horta", "Desta horta"],
                ["sistema", "De todo o sistema"],
              ] as const
            ).map(([id, rotulo]) => (
              <button
                key={id}
                type="button"
                aria-pressed={recorte === id}
                onClick={() => setEscolhido(id)}
                className={`h-toque rounded-lg border-2 px-1 text-sm font-bold ${
                  recorte === id ? "border-primaria bg-primaria text-white" : "border-borda-forte"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {carregando && <p className="text-texto-suave">Contando…</p>}

      {dado && dado.culturas.length === 0 && (
        <EstadoVazio titulo="Nenhuma consulta ainda">
          <p>
            Os sintomas aparecem aqui quando houver diagnósticos salvos
            {recorte === "horta" ? " nos canteiros desta horta" : ""}.
          </p>
        </EstadoVazio>
      )}

      {dado && dado.culturas.length > 0 && (
        <>
          <p className="text-texto-suave text-sm" role="status">
            {dado.consultas} {dado.consultas === 1 ? "consulta" : "consultas"}
            {recorte === "sistema" ? " em todo o sistema" : ""}. O percentual só
            aparece para culturas com {dado.amostra_minima} consultas ou mais.
          </p>
          <ul className="flex flex-col gap-4">
            {dado.culturas.map((c) => (
              <li key={c.cultura_id}>
                <SintomasDaCultura cultura={c} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function SintomasDaCultura({ cultura }: { cultura: api.SintomasDaCultura }) {
  const [todos, setTodos] = useState(false);
  const visiveis = todos ? cultura.sintomas : cultura.sintomas.slice(0, relatorios.SINTOMAS_VISIVEIS);
  const maior = Math.max(1, ...cultura.sintomas.map((s) => s.marcacoes));
  const escondidos = cultura.sintomas.length - visiveis.length;

  return (
    <div className="border-borda rounded-lg border-2 p-4">
      <h3 className="font-bold">{cultura.cultura_nome}</h3>
      <p className="text-texto-suave text-sm">{relatorios.resumoDaCultura(cultura)}</p>

      {cultura.sintomas.length === 0 ? (
        <p className="text-texto-suave mt-3 text-sm">Nenhum sintoma marcado.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-3">
          {visiveis.map((s, posicao) => {
            const texto = relatorios.descreverMarcacao(s, cultura.consultas);
            const alerta = relatorios.poucasFichas(s, posicao);
            return (
              <li key={s.sintoma_id}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-semibold">{s.sintoma_nome}</span>
                  <span className="font-bold tabular-nums">{texto.pct ?? s.marcacoes}</span>
                </div>
                {/* A barra repete o número, que já está escrito ao lado. */}
                <div aria-hidden="true" className="bg-superficie mt-1 h-2 rounded">
                  <div
                    className="bg-primaria h-2 rounded"
                    style={{ width: `${(s.marcacoes / maior) * 100}%` }}
                  />
                </div>
                <p className="text-texto-suave mt-1 text-sm">{texto.contagem}</p>
                {alerta && <p className="mt-1 text-sm font-semibold">⚠ {alerta}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {(escondidos > 0 || todos) && cultura.sintomas.length > relatorios.SINTOMAS_VISIVEIS && (
        <button
          type="button"
          onClick={() => setTodos((v) => !v)}
          aria-expanded={todos}
          className="text-primaria h-toque mt-2 px-1 text-sm font-bold underline"
        >
          {todos ? "Mostrar só os principais" : `Ver todos (${cultura.sintomas.length})`}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// US30 - repetição de família botânica
// =============================================================================

function Rotacao({ hortaId }: { hortaId: number }) {
  const { dado, erro, carregando } = useRelatorio(
    () => api.relatorioDeRotacao(hortaId),
    String(hortaId),
  );

  return (
    <section aria-labelledby="titulo-rotacao" className="flex flex-col gap-4">
      <div>
        <h2 id="titulo-rotacao" className="text-xl font-bold">Rotação de culturas</h2>
        <p className="text-texto-suave text-sm">
          Plantar a mesma família botânica no mesmo canteiro mantém no solo os
          patógenos dela: tomate depois de pimentão é, para a doença, a mesma
          planta.
        </p>
      </div>

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {carregando && <p className="text-texto-suave">Conferindo os canteiros…</p>}

      {dado && dado.alertas.length === 0 && (
        <p className="border-borda rounded-lg border-2 p-4">
          Nenhum canteiro em cultivo repete a família dos últimos{" "}
          {dado.ciclos_recentes} ciclos do mesmo lugar.
        </p>
      )}

      {dado && dado.alertas.length > 0 && (
        <ul className="flex flex-col gap-3">
          {dado.alertas.map((a) => (
            <li key={a.canteiro_id}>
              <Link
                href={`/canteiro?id=${a.canteiro_id}`}
                className="border-borda-forte block rounded-lg border-2 p-4"
              >
                <p className="font-bold">
                  ⚠ {a.identificacao}: {a.cultura_nome}
                </p>
                <p className="text-texto-suave text-sm">Família {a.familia}</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {a.repeticoes.map((r) => (
                    <li key={r.ciclos_atras}>
                      {relatorios.descreverRepeticao(r)}
                      {r.data_plantio && ` (plantio em ${formatarData(r.data_plantio)})`}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  No próximo ciclo deste canteiro, prefira uma cultura de outra família.
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

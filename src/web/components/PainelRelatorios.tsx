"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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
  // Uma resposta por pergunta enquanto a tela está aberta: o painel do topo e
  // as seções detalhadas pedem os mesmos relatórios.
  const [respostas] = useState(() => new Map<string, Promise<unknown>>());

  if (!autenticado) return <PrecisaDeConta />;
  if (!id) return <MensagemDeErro>Horta não informada.</MensagemDeErro>;

  return (
    <RespostasDaTela.Provider value={respostas}>
    <div className="flex flex-col gap-10">
      <header>
        <Link href={`/horta?id=${id}`} className="text-primaria min-h-toque inline-flex items-center text-sm font-bold underline">
          ← Horta
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Relatórios da horta</h1>
        <p className="text-texto-suave">
          Sobre as consultas feitas nos canteiros desta horta, por todas as
          pessoas dela. Consultas sem canteiro ficam só no caderno de quem as fez.
        </p>
      </header>
      <PainelDaHorta hortaId={id} />
      <Incidencia hortaId={id} />
      <Confirmacao hortaId={id} />
      <Sintomas hortaId={id} />
      <Rotacao hortaId={id} />
    </div>
    </RespostasDaTela.Provider>
  );
}

const RespostasDaTela = createContext<Map<string, Promise<unknown>> | null>(null);

/**
 * Busca ao montar e quando `chave` muda; descarta resposta que chegou tarde.
 * A mesma chave na mesma tela reaproveita a resposta, e a chave precisa dizer
 * qual relatório é, não só de qual horta.
 */
function useRelatorio<T>(buscar: () => Promise<T>, chave: string) {
  const respostas = useContext(RespostasDaTela);
  const [estado, setEstado] = useState<{ chave: string; dado?: T; erro?: string } | null>(null);

  useEffect(() => {
    let vivo = true;
    let pedido = respostas?.get(chave) as Promise<T> | undefined;
    if (!pedido) {
      pedido = buscar();
      respostas?.set(chave, pedido);
      // Falha não fica guardada: voltar à seção tenta de novo.
      pedido.catch(() => respostas?.delete(chave));
    }
    pedido
      .then((dado) => vivo && setEstado({ chave, dado }))
      .catch((falha) => vivo && setEstado({ chave, erro: descreverFalha(falha) }));
    return () => {
      vivo = false;
    };
    // `buscar` muda a cada render; a chave é o que diz se a pergunta mudou.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, respostas]);

  const atual = estado?.chave === chave ? estado : null;
  return { dado: atual?.dado, erro: atual?.erro, carregando: atual === null };
}

function chaveDaIncidencia(hortaId: number, intervalo: { de: string; ate: string }) {
  return `incidencia:${hortaId}:${intervalo.de}:${intervalo.ate}`;
}

// =============================================================================
// US41 - painel da horta
// =============================================================================

/**
 * Os quatro indicadores em quadros que se leem de relance no celular (RF37).
 *
 * Cada quadro diz o número por escrito e leva ao relatório detalhado logo
 * abaixo. As colunas e barras só repetem o que está escrito: nada aqui depende
 * de cor (RNF08). O período é o padrão da incidência, os últimos 6 meses, e a
 * resposta é a mesma que a seção detalhada usa.
 */
function PainelDaHorta({ hortaId }: { hortaId: number }) {
  const intervalo = useMemo(() => relatorios.periodo("6m", new Date()), []);
  const incidencia = useRelatorio(
    () => api.relatorioDeIncidencia(hortaId, intervalo),
    chaveDaIncidencia(hortaId, intervalo),
  );
  const confirmacao = useRelatorio(
    () => api.relatorioDeConfirmacao(hortaId),
    `confirmacao:${hortaId}`,
  );
  const sintomas = useRelatorio(
    () => api.relatorioDeSintomas(hortaId),
    `sintomas:horta:${hortaId}`,
  );
  const rotacao = useRelatorio(
    () => api.relatorioDeRotacao(hortaId),
    `rotacao:${hortaId}`,
  );

  return (
    <section aria-labelledby="titulo-painel" className="flex flex-col gap-4">
      <div>
        <h2 id="titulo-painel" className="text-xl font-bold">Painel da horta</h2>
        <p className="text-texto-suave text-sm">
          O resumo dos quatro relatórios. Cada quadro leva ao detalhe.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Quadro titulo="Diagnósticos por mês" destino="titulo-incidencia" estado={incidencia}>
          {(dado) => <QuadroIncidencia dado={dado} intervalo={intervalo} />}
        </Quadro>
        <Quadro titulo="Confirmação no campo" destino="titulo-confirmacao" estado={confirmacao}>
          {(dado) => <QuadroConfirmacao dado={dado} />}
        </Quadro>
        <Quadro titulo="Sintomas mais marcados" destino="titulo-sintomas" estado={sintomas}>
          {(dado) => <QuadroSintomas dado={dado} />}
        </Quadro>
        <Quadro titulo="Rotação de culturas" destino="titulo-rotacao" estado={rotacao}>
          {(dado) => <QuadroRotacao dado={dado} />}
        </Quadro>
      </div>
    </section>
  );
}

function Quadro<T>({
  titulo,
  destino,
  estado,
  children,
}: {
  titulo: string;
  destino: string;
  estado: { dado?: T; erro?: string; carregando: boolean };
  children: (dado: T) => ReactNode;
}) {
  return (
    <article className="border-borda flex flex-col gap-3 rounded-lg border-2 p-4">
      <h3 className="font-bold">{titulo}</h3>
      {estado.carregando && <p className="text-texto-suave text-sm">Contando…</p>}
      {estado.erro && <p className="text-texto-suave text-sm">{estado.erro}</p>}
      {estado.dado !== undefined && children(estado.dado)}
      <a href={`#${destino}`} className="text-primaria min-h-toque mt-auto inline-flex items-center text-sm font-bold underline">
        Ver detalhes
      </a>
    </article>
  );
}

function QuadroIncidencia({
  dado,
  intervalo,
}: {
  dado: api.RelatorioDeIncidencia;
  intervalo: { de: string; ate: string };
}) {
  const serie = relatorios.serieMensal(dado.linhas, intervalo);
  const maior = Math.max(1, ...serie.map((p) => p.total));
  const frequente = relatorios.doencaMaisFrequente(dado.linhas);
  // Os rotulos ficam em 17,5 unidades do viewBox: o grafico escala com a
  // largura, e assim nao descem de 18 px nem no celular de 320 px (RNF07).
  const largura = 40;
  const altura = 72;
  const descricao = serie.map((p) => `${p.rotulo}: ${p.total}`).join(", ");

  return (
    <>
      <p>
        <span className="text-2xl font-bold tabular-nums">{dado.consultas}</span>{" "}
        {dado.consultas === 1 ? "diagnóstico" : "diagnósticos"} em 6 meses
      </p>
      <svg
        role="img"
        aria-label={`Diagnósticos com doença por mês. ${descricao}.`}
        viewBox={`0 0 ${serie.length * largura} ${altura + 46}`}
        className="w-full"
      >
        {serie.map((p, i) => {
          const h = (p.total / maior) * altura;
          const x = i * largura;
          return (
            <g key={p.mes}>
              <rect x={x + 8} y={16 + altura - h} width={largura - 16} height={h}
                className="fill-primaria" rx={2} />
              <rect x={x + 4} y={16 + altura} width={largura - 8} height={2}
                className="fill-borda-forte" />
              <text x={x + largura / 2} y={11 + altura - h} textAnchor="middle"
                className="fill-texto text-[17.5px] font-bold">
                {p.total}
              </text>
              <text x={x + largura / 2} y={altura + 40} textAnchor="middle"
                className="fill-texto-suave text-[17.5px]">
                {p.rotulo}
              </text>
            </g>
          );
        })}
      </svg>
      {frequente ? (
        <p className="text-sm">
          Mais frequente: <strong>{frequente.nome}</strong>{" "}
          <span className="text-texto-suave">
            ({frequente.cultura}, {frequente.ocorrencias})
          </span>
        </p>
      ) : (
        <p className="text-texto-suave text-sm">Nenhum diagnóstico com doença no período.</p>
      )}
    </>
  );
}

function QuadroConfirmacao({ dado }: { dado: api.RelatorioDeConfirmacao }) {
  if (dado.avaliadas === 0) {
    return (
      <p className="text-texto-suave text-sm">
        Nenhum diagnóstico avaliado ainda. A taxa aparece quando as pessoas
        informarem se o diagnóstico se confirmou.
      </p>
    );
  }
  const geral = relatorios.confirmacaoGeral(dado.avaliadas, dado.confirmadas, dado.amostra_minima);
  return (
    <>
      <p>
        <span className="text-2xl font-bold tabular-nums">
          {geral.taxa ?? `${dado.confirmadas} de ${dado.avaliadas}`}
        </span>{" "}
        confirmados
      </p>
      {/* A barra repete a fração, que já está escrita acima e abaixo. */}
      <div aria-hidden="true" className="bg-superficie border-borda-forte h-4 rounded border">
        <div className="bg-primaria h-full rounded-l" style={{ width: `${geral.fracao * 100}%` }} />
      </div>
      <p className="text-texto-suave text-sm">
        {geral.contagem}.
        {!geral.taxa && ` A taxa aparece a partir de ${dado.amostra_minima} avaliações.`}
      </p>
    </>
  );
}

function QuadroSintomas({ dado }: { dado: api.RelatorioDeSintomas }) {
  const destaque = relatorios.sintomasEmDestaque(dado.culturas);
  if (destaque.length === 0) {
    return <p className="text-texto-suave text-sm">Nenhum sintoma marcado ainda.</p>;
  }
  const maior = Math.max(1, ...destaque.map((s) => s.marcacoes));
  return (
    <ol className="flex flex-col gap-2">
      {destaque.map((s, posicao) => (
        <li key={s.id}>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span>
              <span className="font-bold">{posicao + 1}.</span> {s.nome}
            </span>
            <span className="font-bold tabular-nums">{s.marcacoes}</span>
          </div>
          {/* A barra repete o número, que já está escrito ao lado. */}
          <div aria-hidden="true" className="bg-superficie mt-1 h-2 rounded">
            <div className="bg-primaria h-2 rounded" style={{ width: `${(s.marcacoes / maior) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function QuadroRotacao({ dado }: { dado: api.RelatorioDeRotacao }) {
  const resumo = relatorios.resumoDaRotacao(dado.alertas.length);
  return (
    <>
      <p className="flex items-center gap-3">
        <span aria-hidden="true" className="text-3xl">{resumo.simbolo}</span>
        <span className="font-semibold">{resumo.texto}</span>
      </p>
      {dado.alertas.length > 0 && (
        <ul className="list-disc pl-5 text-sm">
          {dado.alertas.slice(0, 3).map((a) => (
            <li key={a.canteiro_id}>
              {a.identificacao}: {a.cultura_nome}
            </li>
          ))}
        </ul>
      )}
      <p className="text-texto-suave text-sm">
        Nos últimos {dado.ciclos_recentes} ciclos de cada canteiro em cultivo.
      </p>
    </>
  );
}

// =============================================================================
// US27 - incidência por período
// =============================================================================

function Incidencia({ hortaId }: { hortaId: number }) {
  const [periodoId, setPeriodoId] = useState<relatorios.PeriodoDoRelatorio>("6m");
  const intervalo = useMemo(() => relatorios.periodo(periodoId, new Date()), [periodoId]);
  const { dado, erro, carregando } = useRelatorio(
    () => api.relatorioDeIncidencia(hortaId, intervalo),
    chaveDaIncidencia(hortaId, intervalo),
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
    `confirmacao:${hortaId}`,
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
    `sintomas:${recorte}:${hortaId}`,
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
    `rotacao:${hortaId}`,
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BotaoLink } from "@/components/Botao";
import { EstadoVazio } from "@/components/EstadoVazio";
import * as caderno from "@/lib/caderno.ts";
import * as filtro from "@/lib/filtro-caderno.ts";
import * as sessao from "@/lib/sessao.ts";
import { useVersaoDoCatalogo } from "@/components/SincronizacaoDoCatalogo";
import { catalogoAtivo } from "@/lib/catalogo.ts";

/**
 * O histórico de diagnósticos.
 *
 * Lê SEMPRE do aparelho primeiro, e só então busca o que o servidor tem. Um
 * caderno de campo que só aparece com rede não é um caderno de campo.
 *
 * O que está na fila aparece marcado como pendente. Isso não é um erro a
 * esconder: é a informação de que aquele registro ainda mora só ali, e o
 * produtor precisa saber disso antes de trocar de celular.
 */

/** Quantos registros a tela mostra de cada vez. */
const POR_PAGINA = 20;

/** A ficha vem da base local, não do servidor - funciona em modo avião.
 *
 *  Do catálogo ATIVO, e não do embutido: uma consulta feita sobre uma base
 *  baixada depois do deploy (US36) citaria cultura e doença que o bundle não
 *  conhece, e a linha do histórico apareceria sem nome nenhum. */
function detalhar(culturaId: string, doencaId: string) {
  const cultura = catalogoAtivo().culturas.find((c) => c.id === culturaId);
  if (!cultura) return null;
  const doenca = cultura.doencas.find((d) => d.id === doencaId);
  return {
    culturaNome: cultura.nome,
    emoji: cultura.emoji ?? null,
    doencaNome: doenca?.nome ?? doencaId,
  };
}

export function PainelCaderno() {
  // O historico nomeia cultura e doenca a partir do catalogo ativo; sem a
  // assinatura, as linhas ficariam sem nome ate a proxima navegacao quando um
  // catalogo mais novo entrasse em uso (US36).
  useVersaoDoCatalogo();

  const [registros, setRegistros] = useState<caderno.RegistroDoCaderno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [temConta, setTemConta] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [copiaLocal, setCopiaLocal] = useState(false);
  const [filtroAtual, setFiltroAtual] = useState<filtro.Filtro>(filtro.SEM_FILTRO);
  const [visiveis, setVisiveis] = useState(POR_PAGINA);

  const recarregar = useCallback(async () => {
    // `sessao` le do localStorage, que nao existe durante a renderizacao no
    // servidor. A leitura acontece depois do primeiro await, ja no cliente -
    // e nunca de forma sincrona dentro do efeito.
    const { registros, servidorRespondeu } = await caderno.historico(detalhar);
    setTemConta(sessao.autenticado());
    setCopiaLocal(sessao.autenticado() && !servidorRespondeu);
    setRegistros(registros);
    setCarregando(false);
  }, []);

  useEffect(() => {
    // A fila sobe quando o app abre e quando a conexao volta - nao em segundo
    // plano, porque o iOS nao oferece Background Sync e prometer o que a
    // plataforma nao entrega seria pior que nao prometer.
    async function abrir() {
      if (sessao.autenticado()) await caderno.sincronizar();
      await recarregar();
    }

    void abrir();
    window.addEventListener("online", abrir);
    return () => window.removeEventListener("online", abrir);
  }, [recarregar]);

  async function sincronizarAgora() {
    setSincronizando(true);
    setAviso(null);
    try {
      const r = await caderno.sincronizar();
      if (r.adiado) {
        setAviso(
          "Sem conexão agora. Seus registros continuam salvos no aparelho e " +
            "sobem sozinhos quando a rede voltar.",
        );
      } else if (r.rejeitadas.length > 0) {
        setAviso(
          `${r.rejeitadas.length} registro(s) não foram aceitos: ` +
            r.rejeitadas.map((x) => x.motivo).join("; "),
        );
      }
      await recarregar();
    } finally {
      setSincronizando(false);
    }
  }

  const pendentes = registros.filter((r) => r.pendente).length;

  const culturas = useMemo(() => filtro.culturasPresentes(registros), [registros]);
  const filtrados = useMemo(
    () => filtro.filtrar(registros, filtroAtual, new Date()),
    [registros, filtroAtual],
  );

  function filtrarPor(novo: Partial<filtro.Filtro>) {
    setFiltroAtual((atual) => ({ ...atual, ...novo }));
    setVisiveis(POR_PAGINA);
  }

  const filtrando =
    filtroAtual.periodo !== filtro.SEM_FILTRO.periodo ||
    filtroAtual.culturaId !== filtro.SEM_FILTRO.culturaId;

  if (carregando) {
    return <p className="text-texto-suave mt-6">Abrindo o caderno…</p>;
  }

  if (registros.length === 0) {
    return (
      <div className="mt-6">
        <EstadoVazio
          titulo="Nenhum diagnóstico salvo ainda"
          acao={
            <BotaoLink href="/" variante="primario">
              Marcar sintomas
            </BotaoLink>
          }
        >
          <p>
            Depois de diagnosticar, salve aqui para acompanhar o que aconteceu
            em cada canteiro ao longo da safra.
          </p>
        </EstadoVazio>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {pendentes > 0 && (
        <div className="border-borda-forte rounded-lg border-2 p-4">
          <p className="font-bold">
            {pendentes} {pendentes === 1 ? "registro guardado" : "registros guardados"}{" "}
            só neste aparelho
          </p>
          <p className="text-texto-suave mt-1 text-sm">
            {temConta
              ? "Eles sobem sozinhos quando houver rede."
              : "Crie uma conta para que não se percam se você trocar de celular."}
          </p>
          <div className="mt-3">
            {temConta ? (
              <button
                type="button"
                onClick={sincronizarAgora}
                disabled={sincronizando}
                className="border-borda-forte h-toque w-full rounded-lg border-2 px-4 text-base font-bold"
              >
                {sincronizando ? "Enviando…" : "Enviar agora"}
              </button>
            ) : (
              <BotaoLink href="/entrar" variante="secundario">
                Criar conta
              </BotaoLink>
            )}
          </div>
        </div>
      )}

      {aviso && (
        <p role="status" className="border-borda rounded-lg border-2 p-3 text-sm">
          {aviso}
        </p>
      )}

      {copiaLocal && (
        <p className="text-texto-suave text-sm">
          Sem conexão: mostrando a última cópia salva neste aparelho.
        </p>
      )}

      <Filtros
        atual={filtroAtual}
        culturas={culturas}
        aoMudar={filtrarPor}
      />

      {filtrados.length === 0 ? (
        <div className="border-borda rounded-lg border-2 border-dashed p-6 text-center">
          <p className="font-bold">Nenhum registro neste filtro</p>
          {filtrando && (
            <button
              type="button"
              onClick={() => filtrarPor(filtro.SEM_FILTRO)}
              className="text-primaria h-toque mt-2 px-4 font-bold underline"
            >
              Ver todos
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-texto-suave text-sm" role="status">
            {filtrados.length}{" "}
            {filtrados.length === 1 ? "registro" : "registros"}
            {filtrando && ` de ${registros.length}`}
          </p>

          <ul className="flex flex-col gap-3">
            {filtrados.slice(0, visiveis).map((r) => (
              <li key={r.offlineId}>
                <Registro registro={r} />
              </li>
            ))}
          </ul>

          {filtrados.length > visiveis && (
            <button
              type="button"
              onClick={() => setVisiveis((v) => v + POR_PAGINA)}
              className="border-borda-forte h-toque w-full rounded-lg border-2 px-4 text-base font-bold"
            >
              Mostrar mais ({filtrados.length - visiveis})
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Filtros({
  atual,
  culturas,
  aoMudar,
}: {
  atual: filtro.Filtro;
  culturas: { id: string; nome: string; emoji: string | null }[];
  aoMudar: (novo: Partial<filtro.Filtro>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Período</legend>
        <div className="grid grid-cols-4 gap-2">
          {filtro.PERIODOS.map((p) => {
            const ativo = atual.periodo === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => aoMudar({ periodo: p.id })}
                className={`h-toque rounded-lg border-2 px-1 text-sm font-bold ${
                  ativo
                    ? "border-primaria bg-primaria text-white"
                    : "border-borda-forte"
                }`}
              >
                {p.rotulo}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Com uma cultura só, o seletor não teria o que escolher. */}
      {culturas.length > 1 && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Cultura</span>
          <select
            value={atual.culturaId ?? ""}
            onChange={(e) => aoMudar({ culturaId: e.target.value || null })}
            className="border-borda-forte bg-fundo h-toque rounded-lg border-2 px-3 text-base"
          >
            <option value="">Todas as culturas</option>
            {culturas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ""}
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

function Registro({ registro }: { registro: caderno.RegistroDoCaderno }) {
  const quando = new Date(registro.registradaEm);
  const data = quando.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = quando.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const conteudo = (
    <>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-base font-bold">
          {registro.emoji} {registro.culturaNome}
        </span>
        <span className="text-texto-suave text-sm">
          {data} · {hora}
        </span>
      </div>

      <p className="mt-1 text-lg font-bold">
        {registro.doencaNome ?? "Sem hipótese registrada"}
      </p>

      {registro.compatibilidade !== null && (
        <p className="text-texto-suave text-sm">
          {Math.round(registro.compatibilidade * 100)}% de compatibilidade
        </p>
      )}

      {registro.pendente && (
        <p className="mt-2 text-sm font-semibold">
          ● Guardado neste aparelho
        </p>
      )}
    </>
  );

  const classe = "border-borda block rounded-lg border-2 p-4";

  return registro.doencaId ? (
    <a href={`/resultado?doenca=${registro.doencaId}`} className={classe}>
      {conteudo}
    </a>
  ) : (
    <div className={classe}>{conteudo}</div>
  );
}

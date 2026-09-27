"use client";

import { useCallback, useEffect, useState } from "react";
import { BotaoLink } from "@/components/Botao";
import { EstadoVazio } from "@/components/EstadoVazio";
import * as caderno from "@/lib/caderno.ts";
import * as sessao from "@/lib/sessao.ts";
import { CULTURAS } from "@/lib/base-conhecimento.ts";

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

/** A ficha vem da base embutida, não do servidor - funciona em modo avião. */
function detalhar(culturaId: string, doencaId: string) {
  const cultura = CULTURAS.find((c) => c.id === culturaId);
  if (!cultura) return null;
  const doenca = cultura.doencas.find((d) => d.id === doencaId);
  return {
    culturaNome: cultura.nome,
    emoji: cultura.emoji ?? null,
    doencaNome: doenca?.nome ?? doencaId,
  };
}

export function PainelCaderno() {
  const [registros, setRegistros] = useState<caderno.RegistroDoCaderno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [temConta, setTemConta] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    // `sessao` le do localStorage, que nao existe durante a renderizacao no
    // servidor. A leitura acontece depois do primeiro await, ja no cliente -
    // e nunca de forma sincrona dentro do efeito.
    const { registros } = await caderno.historico(detalhar);
    setTemConta(sessao.autenticado());
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

      <ul className="flex flex-col gap-3">
        {registros.map((r) => (
          <li key={r.offlineId}>
            <Registro registro={r} />
          </li>
        ))}
      </ul>
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

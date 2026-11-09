"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/Botao";
import { PrecisaDeConta, useUsuario } from "@/components/Formulario";
import * as caderno from "@/lib/caderno.ts";
import * as conta from "@/lib/conta.ts";
import * as sessao from "@/lib/sessao.ts";

/**
 * Quem está conectado, e a saída (US42).
 *
 * Num celular dividido com a família ou com a horta, sair é o que impede a
 * próxima pessoa de ver este caderno e de salvar consultas em nome de quem
 * saiu. A regra da fila está em `lib/conta.ts` (ADR 0014): só se sai com a
 * fila vazia, ou apagando de propósito o que não subiu.
 *
 * A exclusão de conta (US15) entra nesta mesma tela.
 */
export function PainelConta() {
  const router = useRouter();
  const usuario = useUsuario();
  const [saindo, setSaindo] = useState(false);
  const [bloqueio, setBloqueio] = useState<{ pendentes: number; semRede: boolean } | null>(
    null,
  );

  if (!usuario) return <div className="mt-6"><PrecisaDeConta /></div>;

  async function sair(apagarPendentes: boolean) {
    setSaindo(true);
    try {
      // A fila só é aberta aqui, no toque: nunca durante a renderização.
      const dependencias: conta.Dependencias = {
        armazenamento: caderno.deposito(),
        sincronizar: caderno.sincronizar,
        encerrar: sessao.encerrar,
      };
      const r = await conta.sair(dependencias, { apagarPendentes });
      if (r.saiu) {
        router.push("/");
        return;
      }
      setBloqueio({ pendentes: r.pendentes, semRede: r.semRede });
    } finally {
      setSaindo(false);
    }
  }

  const n = bloqueio?.pendentes ?? 0;
  const registros = n === 1 ? "1 diagnóstico" : `${n} diagnósticos`;

  return (
    <div className="mt-6 flex flex-col gap-6">
      <dl className="border-borda rounded-lg border-2 p-4">
        <dt className="text-texto-suave text-sm">Você entrou como</dt>
        <dd className="text-lg font-bold">{usuario.nome || usuario.email}</dd>
        {usuario.nome && <dd className="text-texto-suave break-all">{usuario.email}</dd>}
      </dl>

      {bloqueio === null ? (
        <div className="flex flex-col gap-2">
          <Botao variante="secundario" onClick={() => sair(false)} disabled={saindo}>
            {saindo ? "Enviando o que falta…" : "Sair da conta"}
          </Botao>
          <p className="text-texto-suave text-sm">
            Antes de sair, o AgroScan envia para a sua conta os diagnósticos que
            ainda estão só neste aparelho.
          </p>
        </div>
      ) : (
        <div role="alert" className="border-borda-forte flex flex-col gap-3 rounded-lg border-2 p-4">
          <p className="font-bold">
            ⚠ {registros} ainda não {n === 1 ? "subiu" : "subiram"} para a sua conta
          </p>
          <p className="text-sm">
            {bloqueio.semRede
              ? "Sem conexão agora. "
              : `O servidor não aceitou ${n === 1 ? "esse registro" : "esses registros"}; veja o motivo no caderno. `}
            Se você sair, {n === 1 ? "ele subiria" : "eles subiriam"} para a
            próxima conta que entrar neste aparelho. Por isso, para sair agora,
            é preciso apagá-{n === 1 ? "lo" : "los"}.
          </p>
          <Botao onClick={() => setBloqueio(null)} disabled={saindo}>
            Ficar e enviar depois
          </Botao>
          <Botao variante="secundario" onClick={() => sair(true)} disabled={saindo}>
            Apagar {registros} e sair
          </Botao>
        </div>
      )}
    </div>
  );
}

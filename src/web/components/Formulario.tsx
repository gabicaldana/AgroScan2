"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { BotaoLink } from "@/components/Botao";
import { EstadoVazio } from "@/components/EstadoVazio";
import * as api from "@/lib/api.ts";
import * as sessao from "@/lib/sessao.ts";

/**
 * Peças de formulário das telas de horta.
 *
 * Mesmo sistema de design da tela de conta: rótulo acima, campo de 56px de
 * altura (alvo de toque com luva), borda sólida de 2px.
 */

const CLASSE_CAMPO =
  "border-borda-forte bg-fundo h-toque w-full rounded-lg border-2 px-4 text-base";

export function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo = "text",
  ajuda,
  obrigatorio,
  autoComplete,
  maxLength,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  ajuda?: string;
  obrigatorio?: boolean;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold">
        {rotulo}
        {!obrigatorio && (
          <span className="text-texto-suave font-normal"> (opcional)</span>
        )}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        required={obrigatorio}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={CLASSE_CAMPO}
      />
      {ajuda && <p className="text-texto-suave mt-1 text-sm">{ajuda}</p>}
    </div>
  );
}

export function AreaDeTexto({
  id,
  rotulo,
  valor,
  aoMudar,
  obrigatorio,
  ajuda,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  obrigatorio?: boolean;
  ajuda?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold">
        {rotulo}
      </label>
      <textarea
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        required={obrigatorio}
        rows={3}
        maxLength={2000}
        className="border-borda-forte bg-fundo w-full rounded-lg border-2 px-4 py-3 text-base"
      />
      {ajuda && <p className="text-texto-suave mt-1 text-sm">{ajuda}</p>}
    </div>
  );
}

export function Selecao({
  id,
  rotulo,
  valor,
  aoMudar,
  children,
  ajuda,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  children: ReactNode;
  ajuda?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold">
        {rotulo}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className={CLASSE_CAMPO}
      >
        {children}
      </select>
      {ajuda && <p className="text-texto-suave mt-1 text-sm">{ajuda}</p>}
    </div>
  );
}

export function MensagemDeErro({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="border-alerta bg-alerta-fundo rounded-lg border-2 p-3 text-base font-semibold"
    >
      {children}
    </p>
  );
}

/** O texto que a tela mostra para uma falha da API. */
export function descreverFalha(falha: unknown): string {
  if (falha instanceof api.SemResposta) {
    return (
      "Sem conexão agora. Hortas e canteiros são compartilhados e precisam " +
      "de rede; o diagnóstico continua funcionando offline."
    );
  }
  if (falha instanceof api.ErroDaApi) return falha.detalhe;
  return "Algo deu errado. Tente de novo.";
}

// O token só existe no navegador. Ler pelo useSyncExternalStore, com falso no
// servidor, evita que a casca prerenderizada e a do cliente divirjam.
const semAssinatura = () => () => {};

export function useAutenticado(): boolean {
  return useSyncExternalStore(semAssinatura, sessao.autenticado, () => false);
}

/** O que as telas de horta mostram para quem ainda não tem conta. */
export function PrecisaDeConta() {
  return (
    <EstadoVazio
      titulo="Entre na sua conta"
      acao={
        <BotaoLink href="/entrar" variante="primario">
          Entrar ou criar conta
        </BotaoLink>
      }
    >
      <p>
        A horta é compartilhada entre as pessoas que cultivam nela, e por isso
        precisa de conta. O diagnóstico continua funcionando sem cadastro.
      </p>
    </EstadoVazio>
  );
}

/** Hoje, no formato que o `<input type="date">` e a API esperam. */
export function hojeISO(): string {
  const agora = new Date();
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatarData(iso: string | null): string {
  if (!iso) return "";
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

"use client";

import Link from "next/link";
import { useUsuario } from "@/components/Formulario";

/**
 * No cabeçalho: quem está conectado, e o caminho para sair (US42).
 *
 * Sem conta, leva a entrar. Num celular compartilhado, ver o nome de quem
 * está conectado antes de salvar um diagnóstico evita registrá-lo na conta
 * de outra pessoa.
 */
export function BotaoConta() {
  const usuario = useUsuario();
  const primeiroNome = usuario?.nome.trim().split(/\s+/)[0] || usuario?.email;

  return (
    <Link
      href={usuario ? "/conta" : "/entrar"}
      aria-label={usuario ? `Sua conta: ${usuario.nome || usuario.email}` : "Entrar na conta"}
      className="border-borda-forte flex min-h-11 max-w-36 items-center gap-2 rounded-lg border-2 px-3 text-sm font-bold"
    >
      <IconePessoa />
      <span className="truncate">{usuario ? primeiroNome : "Entrar"}</span>
    </Link>
  );
}

function IconePessoa() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

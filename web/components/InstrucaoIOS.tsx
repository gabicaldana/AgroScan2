"use client";

import { useState, useSyncExternalStore } from "react";
import { ambienteAtual, deveMostrarInstrucaoIOS } from "@/lib/plataforma.ts";

/**
 * Como instalar no iPhone, que não oferece o botão de instalação.
 *
 * Só aparece no iOS e fora do app instalado: aberto pelo ícone da tela de
 * início, some sozinho. Junto vai o aviso que mais importa para o offline — o
 * iPhone apaga os dados de um site não aberto por cerca de sete dias, e com
 * eles os registros que ainda não subiram.
 */

const CHAVE_DISPENSADA = "agroscan.instrucao-ios-dispensada";

function dispensada(): boolean {
  try {
    return localStorage.getItem(CHAVE_DISPENSADA) === "1";
  } catch {
    return false;
  }
}

// O ambiente não muda durante a visita: não há o que assinar.
const semAssinatura = () => () => {};

export function InstrucaoIOS() {
  const mostrar = useSyncExternalStore(
    semAssinatura,
    () => deveMostrarInstrucaoIOS(ambienteAtual()) && !dispensada(),
    () => false,
  );
  const [fechada, setFechada] = useState(false);

  if (!mostrar || fechada) return null;

  function dispensar() {
    try {
      localStorage.setItem(CHAVE_DISPENSADA, "1");
    } catch {
      /* sem armazenamento: fecha só nesta visita */
    }
    setFechada(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4">
      <section
        aria-labelledby="instrucao-ios-titulo"
        className="border-primaria bg-primaria-clara rounded-xl border-2 p-4"
      >
        <h2 id="instrucao-ios-titulo" className="text-lg font-bold">
          Instale o AgroScan no seu iPhone
        </h2>
        <p className="mt-1 text-sm">
          Instalado, ele abre direto da tela de início e funciona sem internet.
        </p>

        <ol className="mt-3 flex flex-col gap-3">
          <li className="flex items-center gap-3">
            <Passo n={1} />
            <span>
              No Safari, toque em <strong>Compartilhar</strong>{" "}
              <IconeCompartilhar />
            </span>
          </li>
          <li className="flex items-center gap-3">
            <Passo n={2} />
            <span>
              Role e toque em <strong>Adicionar à Tela de Início</strong>{" "}
              <IconeAdicionar />
            </span>
          </li>
          <li className="flex items-center gap-3">
            <Passo n={3} />
            <span>
              Toque em <strong>Adicionar</strong>, no canto de cima
            </span>
          </li>
        </ol>

        <p className="border-alerta bg-alerta-fundo mt-4 rounded-lg border-2 p-3 text-sm">
          <strong>Abra o app pelo menos uma vez por semana.</strong> O iPhone apaga
          os dados de quem fica cerca de sete dias sem abrir, inclusive os
          registros que ainda não foram enviados.
        </p>

        <button
          type="button"
          onClick={dispensar}
          className="border-borda-forte bg-fundo h-toque mt-4 w-full rounded-lg border-2 px-4 text-base font-bold"
        >
          Entendi
        </button>
      </section>
    </div>
  );
}

function Passo({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="bg-primaria flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white"
    >
      {n}
    </span>
  );
}

/** O ícone que o Safari usa: quadrado aberto com seta para cima. */
function IconeCompartilhar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      className="inline-block align-text-bottom"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" />
      <path d="M12 15V3" />
      <path d="M8 7l4-4 4 4" />
    </svg>
  );
}

function IconeAdicionar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      className="inline-block align-text-bottom"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

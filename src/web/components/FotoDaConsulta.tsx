"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as fotos from "@/lib/fotos.ts";

/** A foto pronta para guardar: reduzida e sem EXIF (`fotos.prepararFoto`). */
export type FotoPreparada = { imagem: Blob; largura: number; altura: number };

/** Uma URL temporária para mostrar o Blob, liberada ao trocar ou sair da tela. */
function useUrlDaImagem(imagem: Blob | null): string | null {
  const url = useMemo(() => (imagem ? URL.createObjectURL(imagem) : null), [imagem]);
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

/**
 * Anexar uma foto à consulta (US37, ADR 0016), antes de salvar.
 *
 * Usa o campo de arquivo com `capture="environment"`, que abre o app de câmera
 * do aparelho na câmera traseira e em resolução nativa, com foco e flash. O
 * visor de `Camera.tsx` existe para a paridade de pixels do modelo de imagem,
 * que esta foto não usa: ela é evidência para quem fotografou.
 *
 * O campo fica visualmente escondido dentro de um rótulo com cara de botão.
 * Ele continua focável pelo teclado, e o anel de foco aparece no rótulo.
 */
export function AnexarFoto({
  foto,
  aoMudar,
}: {
  foto: FotoPreparada | null;
  aoMudar: (foto: FotoPreparada | null) => void;
}) {
  const id = useId();
  const campo = useRef<HTMLInputElement>(null);
  const [preparando, setPreparando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const url = useUrlDaImagem(foto?.imagem ?? null);

  async function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro(null);
    setPreparando(true);
    try {
      aoMudar(await fotos.prepararFoto(arquivo));
    } catch {
      setErro("Não foi possível abrir esta foto. Tente tirar outra.");
    } finally {
      setPreparando(false);
      // Permite escolher o mesmo arquivo de novo depois de remover.
      if (campo.current) campo.current.value = "";
    }
  }

  return (
    <div className="border-borda mb-3 flex flex-col gap-3 rounded-lg border-2 p-3">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- Blob local, sem otimização do Next
        <img
          src={url}
          alt="Foto da planta que vai junto com esta consulta"
          className="border-borda max-h-64 w-full rounded-lg border-2 object-contain"
        />
      )}

      <label
        htmlFor={id}
        className="border-borda-forte min-h-toque flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 px-4 text-base font-bold focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-primaria"
      >
        <span aria-hidden="true">📷</span>
        {preparando ? "Preparando a foto…" : foto ? "Trocar a foto" : "Fotografar a planta"}
        <input
          ref={campo}
          id={id}
          type="file"
          accept="image/*"
          capture="environment"
          aria-describedby={`${id}-ajuda`}
          className="sr-only"
          disabled={preparando}
          onChange={(e) => void escolher(e.target.files?.[0])}
        />
      </label>

      {foto && (
        <button
          type="button"
          onClick={() => aoMudar(null)}
          className="text-texto-suave min-h-toque text-base font-semibold underline"
        >
          Tirar a foto da consulta
        </button>
      )}

      <p id={`${id}-ajuda`} className="text-texto-suave text-sm">
        Opcional. A foto fica só neste aparelho, junto do registro no caderno,
        e não vai para a internet. Ela não muda o diagnóstico, que continua
        sendo pelos sintomas.
      </p>

      {erro && (
        <p role="alert" className="border-alerta bg-alerta-fundo rounded-lg border-2 p-3 text-sm font-semibold">
          {erro}
        </p>
      )}
    </div>
  );
}

/**
 * A foto de uma consulta no caderno, com o caminho para apagá-la.
 *
 * Lida do aparelho só quando o registro aparece. Se a foto não estiver mais
 * lá (dados do navegador apagados), o componente some sem erro.
 */
export function FotoNoCaderno({
  offlineId,
  aoApagar,
}: {
  offlineId: string;
  aoApagar: () => void;
}) {
  const [guardada, setGuardada] = useState<fotos.FotoGuardada | null>(null);
  const [apagando, setApagando] = useState(false);
  const url = useUrlDaImagem(guardada?.imagem ?? null);

  useEffect(() => {
    let vivo = true;
    void fotos
      .depositoDoApp()
      .ler(offlineId)
      .then((f) => vivo && setGuardada(f))
      .catch(() => vivo && setGuardada(null));
    return () => {
      vivo = false;
    };
  }, [offlineId]);

  if (!guardada || !url) return null;

  const quando = new Date(guardada.tiradaEm).toLocaleDateString("pt-BR");

  async function apagar() {
    setApagando(true);
    try {
      await fotos.depositoDoApp().apagar(offlineId);
      aoApagar();
    } finally {
      setApagando(false);
    }
  }

  return (
    <figure className="mt-3 flex flex-col gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- Blob local, sem otimização do Next */}
      <img
        src={url}
        alt={`Foto da planta, tirada em ${quando}`}
        className="border-borda max-h-64 w-full rounded-lg border-2 object-contain"
      />
      <figcaption className="text-texto-suave text-sm">
        Foto guardada só neste aparelho
      </figcaption>
      <button
        type="button"
        onClick={apagar}
        disabled={apagando}
        className="border-borda-forte h-toque rounded-lg border-2 px-4 text-base font-semibold"
      >
        {apagando ? "Apagando…" : "Apagar a foto"}
      </button>
    </figure>
  );
}

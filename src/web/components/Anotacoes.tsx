"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Botao } from "@/components/Botao";
import {
  AreaDeTexto,
  MensagemDeErro,
  descreverFalha,
  formatarData,
  useUsuario,
} from "@/components/Formulario";
import * as api from "@/lib/api.ts";
import { foiEditada, podeAlterar, textoParaEnviar } from "@/lib/anotacoes.ts";

/**
 * Anotações livres do caderno de campo (US21, RF21).
 *
 * O que não cabe no diagnóstico nem no manejo: "choveu forte na terça", "a
 * muda veio do vizinho". No canteiro, a lista fica aberta e é de todos os
 * membros da horta. Na consulta do caderno, fica fechada até a pessoa pedir,
 * como a confirmação do diagnóstico: com vinte registros na tela, vinte
 * listas abertas seriam ruído, e cada uma é uma chamada à API.
 *
 * Precisa de rede: a anotação é guardada no servidor, presa ao canteiro ou à
 * consulta já sincronizada.
 */
export function Anotacoes({
  alvo,
  recolhida = false,
}: {
  alvo: api.AlvoDaAnotacao;
  recolhida?: boolean;
}) {
  const [aberta, setAberta] = useState(!recolhida);

  if (!aberta) {
    return (
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="text-primaria min-h-toque mt-1 inline-flex items-center text-sm font-bold underline"
      >
        Anotações
      </button>
    );
  }

  return <ListaDeAnotacoes alvo={alvo} recolhida={recolhida} aoFechar={() => setAberta(false)} />;
}

function ListaDeAnotacoes({
  alvo,
  recolhida,
  aoFechar,
}: {
  alvo: api.AlvoDaAnotacao;
  recolhida: boolean;
  aoFechar: () => void;
}) {
  // O pai monta `alvo` a cada render; as dependências usam os primitivos,
  // senão a lista recarregaria em laço.
  const { tipo, id } = alvo;
  const estavel = useMemo<api.AlvoDaAnotacao>(() => ({ tipo, id }), [tipo, id]);
  const usuario = useUsuario();
  const [anotacoes, setAnotacoes] = useState<api.Anotacao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const idTitulo = `titulo-anotacoes-${tipo}-${id}`;

  const recarregar = useCallback(async () => {
    try {
      setAnotacoes(await api.listarAnotacoes(estavel));
      setErro(null);
    } catch (falha) {
      setErro(descreverFalha(falha));
    }
  }, [estavel]);

  useEffect(() => {
    let vivo = true;
    api
      .listarAnotacoes(estavel)
      .then((lista) => vivo && setAnotacoes(lista))
      .catch((falha) => vivo && setErro(descreverFalha(falha)));
    return () => {
      vivo = false;
    };
  }, [estavel]);

  const Titulo = recolhida ? "h3" : "h2";

  return (
    <section aria-labelledby={idTitulo}
      className={`flex flex-col gap-3 ${recolhida ? "border-borda mt-3 border-t-2 pt-3" : ""}`}>
      <div className="flex items-baseline justify-between gap-2">
        <Titulo id={idTitulo} className={recolhida ? "text-base font-bold" : "text-xl font-bold"}>
          Anotações
        </Titulo>
        {recolhida && (
          <button type="button" onClick={aoFechar}
            className="text-primaria text-sm font-bold underline">
            Fechar
          </button>
        )}
      </div>

      <NovaAnotacao alvo={estavel} aoSalvar={recarregar} />

      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

      {anotacoes === null && !erro && (
        <p className="text-texto-suave text-sm">Abrindo anotações…</p>
      )}
      {anotacoes !== null && anotacoes.length === 0 && (
        <p className="text-texto-suave text-sm">Nenhuma anotação ainda.</p>
      )}
      {anotacoes !== null && anotacoes.length > 0 && (
        <ul className="flex flex-col gap-3">
          {anotacoes.map((a) => (
            <ItemDeAnotacao
              key={a.id}
              anotacao={a}
              editavel={podeAlterar(a, usuario?.id ?? null)}
              aoMudar={recarregar}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function NovaAnotacao({
  alvo,
  aoSalvar,
}: {
  alvo: api.AlvoDaAnotacao;
  aoSalvar: () => Promise<void>;
}) {
  const [texto, setTexto] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const limpo = textoParaEnviar(texto);
    if (limpo === null) {
      setErro("Escreva a anotação antes de salvar.");
      return;
    }
    setErro(null);
    setOcupado(true);
    try {
      await api.criarAnotacao(alvo, limpo);
      setTexto("");
      await aoSalvar();
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <AreaDeTexto
        id={`anotacao-nova-${alvo.tipo}-${alvo.id}`}
        rotulo="Nova anotação"
        valor={texto}
        aoMudar={setTexto}
        obrigatorio
        ajuda="O que não cabe no diagnóstico: o tempo, a origem da muda, onde a doença começou."
      />
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      <Botao type="submit" variante="secundario" disabled={ocupado}>
        {ocupado ? "Salvando…" : "Salvar anotação"}
      </Botao>
    </form>
  );
}

function ItemDeAnotacao({
  anotacao,
  editavel,
  aoMudar,
}: {
  anotacao: api.Anotacao;
  editavel: boolean;
  aoMudar: () => Promise<void>;
}) {
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(anotacao.texto);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    const limpo = textoParaEnviar(texto);
    if (limpo === null) {
      setErro("A anotação não pode ficar vazia. Para tirá-la, use Apagar.");
      return;
    }
    setErro(null);
    setOcupado(true);
    try {
      await api.alterarAnotacao(anotacao.id, limpo);
      setEditando(false);
      await aoMudar();
    } catch (falha) {
      setErro(descreverFalha(falha));
    } finally {
      setOcupado(false);
    }
  }

  async function apagar() {
    if (!confirm("Apagar esta anotação? Não dá para desfazer.")) return;
    setErro(null);
    setOcupado(true);
    try {
      await api.apagarAnotacao(anotacao.id);
      await aoMudar();
    } catch (falha) {
      setErro(descreverFalha(falha));
      setOcupado(false);
    }
  }

  const rodape = (
    <p className="text-texto-suave mt-1 text-sm">
      {anotacao.autor_nome} · {formatarData(anotacao.criada_em)}
      {foiEditada(anotacao) && ` · editada em ${formatarData(anotacao.atualizada_em)}`}
    </p>
  );

  if (editando) {
    return (
      <li className="border-borda rounded-lg border-2 p-4">
        <form onSubmit={salvar} className="flex flex-col gap-3">
          <AreaDeTexto id={`anotacao-${anotacao.id}`} rotulo="Editar anotação"
            valor={texto} aoMudar={setTexto} obrigatorio />
          {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
          <div className="grid grid-cols-2 gap-2">
            <Botao type="submit" disabled={ocupado}>
              {ocupado ? "Salvando…" : "Salvar"}
            </Botao>
            <Botao type="button" variante="secundario" disabled={ocupado}
              onClick={() => {
                setTexto(anotacao.texto);
                setErro(null);
                setEditando(false);
              }}>
              Cancelar
            </Botao>
          </div>
        </form>
        {rodape}
      </li>
    );
  }

  return (
    <li className="border-borda rounded-lg border-2 p-4">
      <p className="whitespace-pre-line">{anotacao.texto}</p>
      {rodape}
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      {editavel && (
        <div className="mt-2 flex gap-4">
          <button type="button" onClick={() => setEditando(true)} disabled={ocupado}
            className="text-primaria min-h-toque min-w-toque px-2 text-sm font-bold underline">
            Editar
          </button>
          <button type="button" onClick={apagar} disabled={ocupado}
            className="text-primaria min-h-toque min-w-toque px-2 text-sm font-bold underline">
            {ocupado ? "Apagando…" : "Apagar"}
          </button>
        </div>
      )}
    </li>
  );
}

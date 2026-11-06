"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Botao } from "@/components/Botao";
import { ErroDaApi, SemResposta } from "@/lib/api.ts";
import * as caderno from "@/lib/caderno.ts";
import { catalogoAtivo } from "@/lib/catalogo.ts";
import * as fb from "@/lib/feedback.ts";

/**
 * "O diagnóstico se confirmou?" - o fecho do laço (US20, RF20).
 *
 * Fica dentro do registro do caderno, fechado até a pessoa pedir: com vinte
 * registros na tela, vinte perguntas abertas seriam ruído. Depois de
 * respondida, a resposta aparece no lugar da pergunta e pode ser trocada -
 * continua um feedback só por consulta.
 *
 * Nada aqui depende de cor: confirmado e não confirmado se distinguem pelo
 * texto e pelo símbolo.
 */
export function FeedbackDaConsulta({
  registro,
  temConta,
  aoResponder,
}: {
  registro: caderno.RegistroDoCaderno;
  temConta: boolean;
  aoResponder: (offlineId: string, resposta: fb.Feedback) => void;
}) {
  const [aberto, setAberto] = useState(false);

  const impedimento = fb.impedimento(registro);
  if (impedimento === "sem_hipotese") return null;
  if (impedimento === "pendente") {
    return temConta ? (
      <p className="text-texto-suave mt-3 text-sm">
        Quando este registro subir para a sua conta, você poderá dizer se o
        diagnóstico se confirmou.
      </p>
    ) : null;
  }

  const id = registro.id as number;
  const resposta = registro.feedback ?? null;

  if (aberto) {
    return (
      <Formulario
        consultaId={id}
        registro={registro}
        inicial={resposta}
        aoCancelar={() => setAberto(false)}
        aoSalvar={(nova) => {
          setAberto(false);
          aoResponder(registro.offlineId, nova);
        }}
      />
    );
  }

  return (
    <div className="border-borda mt-3 flex flex-col gap-2 border-t-2 pt-3">
      {resposta ? (
        <p className="font-semibold" role="status">
          <span aria-hidden="true">{resposta.confirmado ? "✓ " : "✗ "}</span>
          {fb.resumo(resposta)}
        </p>
      ) : registro.temFeedback ? (
        // Cópia guardada sem o conteúdo da resposta: sabe-se que existe.
        <p className="font-semibold">Resultado já informado</p>
      ) : null}
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="border-borda-forte h-toque w-full rounded-lg border-2 px-4 text-base font-bold"
      >
        {resposta || registro.temFeedback
          ? "Mudar a resposta"
          : "O diagnóstico se confirmou?"}
      </button>
    </div>
  );
}

function Formulario({
  consultaId,
  registro,
  inicial,
  aoCancelar,
  aoSalvar,
}: {
  consultaId: number;
  registro: caderno.RegistroDoCaderno;
  inicial: fb.Feedback | null;
  aoCancelar: () => void;
  aoSalvar: (resposta: fb.Feedback) => void;
}) {
  const principalId = registro.doencaId;
  const possiveis = fb.doencasPossiveis(
    catalogoAtivo().culturas,
    registro.culturaId,
    principalId,
  );

  const [escolha, setEscolha] = useState<fb.Escolha | null>(
    inicial ? fb.escolhaDe(inicial) : null,
  );
  const [comentario, setComentario] = useState(inicial?.comentario ?? "");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const prefixo = `feedback-${registro.offlineId}`;
  const doencaNome = registro.doencaNome ?? "a doença indicada";

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (escolha === null) {
      setErro("Escolha se a doença se confirmou ou não.");
      return;
    }
    const montado = fb.montarPedido(escolha, comentario, { principalId, possiveis });
    if (!montado.ok) {
      setErro(montado.motivo);
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      const salvo = await caderno.responder(consultaId, montado.pedido);
      const nome = possiveis.find((d) => d.id === salvo.doencaConfirmadaId)?.nome ?? null;
      aoSalvar({ ...salvo, doencaConfirmadaNome: nome });
    } catch (e) {
      if (e instanceof SemResposta) {
        setErro(
          "Sem conexão agora. A resposta precisa de sinal para ser enviada; " +
            "tente de novo quando a rede voltar.",
        );
      } else if (e instanceof ErroDaApi) {
        setErro(e.status === 401 ? "Entre na conta de novo para responder." : e.detalhe);
      } else {
        setErro("Não foi possível enviar a resposta.");
      }
    } finally {
      setEnviando(false);
    }
  }

  const naoConfirmou = escolha?.tipo === "nao_confirmou";

  return (
    <form
      onSubmit={salvar}
      className="border-borda mt-3 flex flex-col gap-4 border-t-2 pt-3"
      noValidate
    >
      <fieldset>
        <legend className="mb-2 text-base font-bold">
          A doença era mesmo {doencaNome}?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <Opcao
            ativa={escolha?.tipo === "confirmou"}
            aoEscolher={() => setEscolha({ tipo: "confirmou" })}
          >
            ✓ Sim, era
          </Opcao>
          <Opcao
            ativa={naoConfirmou}
            aoEscolher={() =>
              setEscolha({
                tipo: "nao_confirmou",
                doencaId: escolha?.tipo === "nao_confirmou" ? escolha.doencaId : null,
              })
            }
          >
            ✗ Não era
          </Opcao>
        </div>
      </fieldset>

      {naoConfirmou && (
        <div>
          <label htmlFor={`${prefixo}-doenca`} className="mb-2 block text-base font-bold">
            Qual era a doença?
          </label>
          <select
            id={`${prefixo}-doenca`}
            value={escolha.doencaId ?? ""}
            onChange={(e) =>
              setEscolha({ tipo: "nao_confirmou", doencaId: e.target.value || null })
            }
            className="border-borda-forte bg-fundo h-toque w-full rounded-lg border-2 px-3 text-base"
          >
            <option value="">Não sei qual era</option>
            {possiveis.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
          <p className="text-texto-suave mt-1 text-sm">
            Só as doenças de {registro.culturaNome.toLowerCase()} que o AgroScan conhece.
          </p>
        </div>
      )}

      <div>
        <label htmlFor={`${prefixo}-comentario`} className="mb-2 block text-base font-bold">
          Comentário <span className="text-texto-suave font-normal">(opcional)</span>
        </label>
        <textarea
          id={`${prefixo}-comentario`}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={2}
          maxLength={fb.LIMITE_DO_COMENTARIO}
          placeholder="Ex.: confirmado pelo técnico da cooperativa"
          className="border-borda-forte bg-fundo w-full rounded-lg border-2 px-4 py-3 text-base"
        />
      </div>

      {erro && (
        <p role="alert" className="border-borda-forte rounded-lg border-2 p-3 text-sm font-semibold">
          {erro}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Botao type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Salvar resposta"}
        </Botao>
        <Botao type="button" variante="secundario" onClick={aoCancelar} disabled={enviando}>
          Cancelar
        </Botao>
      </div>
    </form>
  );
}

function Opcao({
  ativa,
  aoEscolher,
  children,
}: {
  ativa: boolean;
  aoEscolher: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativa}
      onClick={aoEscolher}
      className={`h-toque rounded-lg border-2 px-2 text-base font-bold ${
        ativa ? "border-primaria bg-primaria text-white" : "border-borda-forte"
      }`}
    >
      {children}
    </button>
  );
}

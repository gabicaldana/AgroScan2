"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao, BotaoLink } from "@/components/Botao";
import {
  Campo,
  MensagemDeErro,
  PrecisaDeConta,
  descreverFalha,
  useUsuario,
} from "@/components/Formulario";
import * as api from "@/lib/api.ts";
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
 * E a exclusão da conta (US15), no fim da tela e atrás de uma confirmação
 * digitada: é a única ação do app que não tem volta.
 */
export function PainelConta() {
  const router = useRouter();
  const usuario = useUsuario();
  const [saindo, setSaindo] = useState(false);
  const [bloqueio, setBloqueio] = useState<{ pendentes: number; semRede: boolean } | null>(
    null,
  );
  const [excluida, setExcluida] = useState(false);

  // Vem antes de `usuario`: a exclusão encerra a sessão, e sem isto a tela
  // cairia em "Entre na sua conta" sem dizer que a exclusão deu certo.
  if (excluida) {
    return (
      <div role="status" className="border-borda-forte mt-6 flex flex-col gap-3 rounded-lg border-2 p-4">
        <p className="text-lg font-bold">✓ Sua conta foi excluída</p>
        <p>
          A conta e os seus dados foram apagados do AgroScan e deste aparelho.
          O diagnóstico continua funcionando sem conta.
        </p>
        <BotaoLink href="/" variante="secundario">Ir para o início</BotaoLink>
      </div>
    );
  }

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

      <ExcluirConta aoExcluir={() => setExcluida(true)} />
    </div>
  );
}

/** A palavra que a pessoa digita para confirmar a exclusão. */
const CONFIRMACAO = "EXCLUIR";

function ExcluirConta({ aoExcluir }: { aoExcluir: () => void }) {
  const [aberta, setAberta] = useState(false);
  const [digitado, setDigitado] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const confirmado = digitado.trim().toUpperCase() === CONFIRMACAO;

  async function excluir() {
    if (!confirmado) return;
    setErro(null);
    setExcluindo(true);
    try {
      const r = await conta.excluir({
        armazenamento: caderno.deposito(),
        excluirNaApi: api.excluirConta,
        encerrar: sessao.encerrar,
      });
      if (r.excluida) {
        aoExcluir();
        return;
      }
      setErro(descreverFalha(r.falha));
    } finally {
      setExcluindo(false);
    }
  }

  if (!aberta) {
    return (
      <section aria-labelledby="titulo-excluir" className="border-borda mt-4 flex flex-col gap-2 border-t-2 pt-6">
        <h2 id="titulo-excluir" className="text-lg font-bold">Excluir a conta</h2>
        <p className="text-texto-suave text-sm">
          Apaga a sua conta e os seus dados. Não dá para desfazer.
        </p>
        <Botao variante="secundario" onClick={() => setAberta(true)}>
          Quero excluir minha conta
        </Botao>
      </section>
    );
  }

  return (
    <section aria-labelledby="titulo-excluir"
      className="border-borda-forte mt-4 flex flex-col gap-4 rounded-lg border-2 p-4">
      <h2 id="titulo-excluir" className="text-lg font-bold">⚠ Excluir a conta</h2>
      <div className="flex flex-col gap-2 text-sm">
        <p className="font-semibold">O que é apagado:</p>
        <ul className="list-disc pl-5">
          <li>a conta: nome, e-mail e senha;</li>
          <li>o caderno: diagnósticos, confirmações e anotações;</li>
          <li>a sua participação nas hortas;</li>
          <li>as hortas de que você é responsável e em que só você participa, com os canteiros delas;</li>
          <li>neste aparelho, a sessão e os diagnósticos que ainda não tinham subido.</li>
        </ul>
        <p>
          Se você é responsável por uma horta com outras pessoas, a exclusão é
          recusada: passe a responsabilidade para alguém da horta antes.
        </p>
        <p>
          Os manejos que você registrou numa horta ficam para quem continua
          nela, porque o registro de aplicação controla carência e resíduo.
          Eles passam a aparecer como de &quot;Conta excluída&quot;, sem o seu nome.
        </p>
      </div>
      <Campo
        id="confirmar-exclusao"
        rotulo={`Para confirmar, digite ${CONFIRMACAO}`}
        valor={digitado}
        aoMudar={setDigitado}
        maxLength={20}
        autoComplete="off"
        obrigatorio
      />
      {erro && <MensagemDeErro>{erro}</MensagemDeErro>}
      <Botao onClick={excluir} disabled={!confirmado || excluindo}>
        {excluindo ? "Excluindo…" : "Excluir minha conta e meus dados"}
      </Botao>
      <Botao variante="secundario" disabled={excluindo}
        onClick={() => {
          setAberta(false);
          setDigitado("");
          setErro(null);
        }}>
        Cancelar
      </Botao>
    </section>
  );
}

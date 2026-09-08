"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/Botao";
import * as api from "@/lib/api.ts";

/**
 * Entrar ou criar conta.
 *
 * A conta existe para o histórico sobreviver à troca de aparelho e para a
 * horta ser compartilhada — não para usar o app. Diagnosticar continua
 * funcionando sem cadastro, e a tela diz isso, porque exigir conta para
 * responder o que a planta tem afastaria justamente quem o app atende.
 */
export function PainelEntrar() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const criando = modo === "criar";

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setOcupado(true);

    try {
      if (criando) await api.registrar(nome, email, senha);
      await api.entrar(email, senha);
      router.push("/caderno");
    } catch (falha) {
      if (falha instanceof api.SemResposta) {
        setErro(
          "Não foi possível falar com o servidor. O diagnóstico continua " +
            "funcionando sem conta - só o histórico é que precisa de rede.",
        );
      } else if (falha instanceof api.ErroDaApi) {
        setErro(falha.detalhe);
      } else {
        setErro("Algo deu errado. Tente de novo.");
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-borda flex rounded-lg border-2 p-1" role="tablist">
        {(["entrar", "criar"] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            role="tab"
            aria-selected={modo === opcao}
            onClick={() => {
              setModo(opcao);
              setErro(null);
            }}
            className={`h-toque flex-1 rounded-md text-base font-bold ${
              modo === opcao ? "bg-acento text-white" : "text-texto-suave"
            }`}
          >
            {opcao === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-4">
        {criando && (
          <Campo
            id="nome"
            rotulo="Nome"
            valor={nome}
            aoMudar={setNome}
            tipo="text"
            autoComplete="name"
            obrigatorio
          />
        )}

        <Campo
          id="email"
          rotulo="E-mail"
          valor={email}
          aoMudar={setEmail}
          tipo="email"
          autoComplete="email"
          obrigatorio
        />

        <Campo
          id="senha"
          rotulo="Senha"
          valor={senha}
          aoMudar={setSenha}
          tipo="password"
          autoComplete={criando ? "new-password" : "current-password"}
          ajuda={criando ? "Pelo menos 8 caracteres." : undefined}
          obrigatorio
        />

        {erro && (
          <p
            role="alert"
            className="border-gravidade-alta bg-gravidade-alta/10 rounded-lg border-2 p-3 text-base font-semibold"
          >
            {erro}
          </p>
        )}

        <Botao type="submit" variante="primario" disabled={ocupado}>
          {ocupado ? "Aguarde…" : criando ? "Criar conta" : "Entrar"}
        </Botao>
      </form>

      <p className="text-texto-suave text-sm">
        Você não precisa de conta para diagnosticar: o app funciona sem
        cadastro e sem internet. A conta serve para o histórico não se perder e
        para compartilhar a horta com outras pessoas.
      </p>
    </div>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo,
  autoComplete,
  ajuda,
  obrigatorio,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo: string;
  autoComplete?: string;
  ajuda?: string;
  obrigatorio?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        autoComplete={autoComplete}
        required={obrigatorio}
        className="border-borda-forte bg-fundo h-toque w-full rounded-lg border-2 px-4 text-base"
      />
      {ajuda && <p className="text-texto-suave mt-1 text-sm">{ajuda}</p>}
    </div>
  );
}

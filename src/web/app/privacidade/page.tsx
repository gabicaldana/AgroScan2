import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidade - AgroScan",
};

/**
 * O aviso de privacidade (LGPD, art. 9), da revisão de conformidade (#75).
 *
 * Texto estático, na casca do service worker: o consentimento da localização
 * aponta para cá, e a pessoa precisa conseguir ler o aviso no canteiro, sem
 * rede. O detalhamento técnico, com as tabelas e os testes, fica em
 * `docs/lgpd.md`; aqui vai só o que quem usa o app precisa saber.
 */
export default function PaginaPrivacidade() {
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Privacidade</h1>

      <p>
        O diagnóstico funciona sem conta e sem internet. Nesse uso, nada sai do
        seu aparelho e o AgroScan não sabe quem você é.
      </p>

      <Secao titulo="O que o AgroScan guarda quando você cria uma conta">
        <ul className="list-disc pl-5">
          <li>
            <strong>Nome, e-mail e senha.</strong> O nome e o e-mail servem para
            você entrar e para as pessoas da sua horta saberem quem é você. A
            senha é guardada de forma que nem a equipe consegue lê-la.
          </li>
          <li>
            <strong>O caderno:</strong> as consultas que você salva (cultura,
            sintomas marcados, hipóteses, canteiro), se o diagnóstico se
            confirmou e as suas anotações.
          </li>
          <li>
            <strong>Hortas e canteiros</strong> de que você participa, e os
            manejos que você registra neles.
          </li>
          <li>
            <strong>O local da consulta, só se você pedir.</strong> Ao salvar,
            a opção &quot;Registrar onde fiz esta consulta&quot; vem desmarcada.
            Marcada, o AgroScan guarda o local aproximado (uns 100 metros), e
            não o ponto exato.
          </li>
        </ul>
        <p>
          O AgroScan não guarda fotos, não usa propaganda nem rastreadores e não
          vende nem repassa dados a ninguém.
        </p>
      </Secao>

      <Secao titulo="Para que os dados servem">
        <p>
          Para guardar o seu histórico, compartilhar a horta com quem você
          escolher e montar os relatórios da horta. Os relatórios mostram
          contagens da horta, sem o nome de quem fez cada consulta.
        </p>
      </Secao>

      <Secao titulo="Quem vê o quê">
        <ul className="list-disc pl-5">
          <li>O seu caderno é só seu. Outra conta não vê as suas consultas.</li>
          <li>
            Quem participa da mesma horta vê o seu nome e o seu e-mail, os
            canteiros da horta e os manejos, com o nome de quem registrou cada um.
          </li>
        </ul>
      </Secao>

      <Secao titulo="Neste aparelho">
        <p>
          O que você salva sem rede fica no aparelho até subir para a sua conta.
          Ao sair da conta, o AgroScan pede para enviar ou apagar o que ainda não
          subiu, para a próxima pessoa que usar o celular não ver nem enviar
          registros seus.
        </p>
      </Secao>

      <Secao titulo="Seus direitos, dentro do app">
        <ul className="list-disc pl-5">
          <li>
            <strong>Ver</strong> o que está guardado: o{" "}
            <Link href="/caderno" className="font-semibold underline">caderno</Link>{" "}
            mostra todas as suas consultas.
          </li>
          <li>
            <strong>Apagar o local</strong> de uma consulta, no caderno, sem
            apagar a consulta.
          </li>
          <li>
            <strong>Excluir a conta e os dados</strong>, em{" "}
            <Link href="/conta" className="font-semibold underline">Sua conta</Link>.
            Os manejos que você registrou numa horta com outras pessoas ficam,
            porque controlam carência e resíduo, mas passam a aparecer como de
            &quot;Conta excluída&quot;, sem o seu nome.
          </li>
        </ul>
      </Secao>

      <Secao titulo="Quem cuida dos dados">
        <p>
          A equipe do projeto AgroScan, desenvolvido no CEUB. Os dados ficam num
          banco PostgreSQL hospedado na Neon, e o app é publicado na Vercel.
        </p>
      </Secao>
    </article>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{titulo}</h2>
      {children}
    </section>
  );
}

/**
 * Sair da conta (US42, ADR 0014).
 *
 * A fila offline é do aparelho, e não da conta: o diagnóstico feito sem conta
 * sobe para a conta em que a pessoa entrar depois (RF14). A consequência é que
 * um registro que ficou na fila quando alguém saiu subiria para a PRÓXIMA
 * conta que entrar no aparelho, misturando o caderno de duas pessoas.
 *
 * Por isso sair tenta enviar a fila primeiro, e só encerra a sessão com a
 * fila vazia - ou com a escolha explícita de apagar o que sobrou. Não há
 * caminho que saia deixando a fila para a próxima pessoa.
 *
 * Tudo entra por parâmetro, para o teste rodar sem IndexedDB nem rede.
 */

import * as fila from "./fila.ts";

export type Dependencias = {
  armazenamento: fila.Armazenamento;
  /** Sobe a fila; é `caderno.sincronizar` no app. */
  sincronizar: () => Promise<fila.ResultadoDoDespacho>;
  /** Apaga a sessão e as cópias guardadas; é `sessao.encerrar` no app. */
  encerrar: () => void;
};

export type ResultadoDaSaida =
  | { saiu: true; apagados: number }
  | {
      saiu: false;
      /** Quantos registros continuam só no aparelho. */
      pendentes: number;
      /** `true` sem rede; `false` quando o servidor recusou registros. */
      semRede: boolean;
    };

export async function sair(
  deps: Dependencias,
  opcoes: { apagarPendentes: boolean } = { apagarPendentes: false },
): Promise<ResultadoDaSaida> {
  if (opcoes.apagarPendentes) {
    const restantes = await fila.pendentes(deps.armazenamento);
    await fila.remover(
      deps.armazenamento,
      restantes.map((c) => c.offlineId),
    );
    deps.encerrar();
    return { saiu: true, apagados: restantes.length };
  }

  if ((await fila.quantasPendentes(deps.armazenamento)) > 0) {
    const envio = await deps.sincronizar();
    const pendentes = await fila.quantasPendentes(deps.armazenamento);
    if (pendentes > 0) return { saiu: false, pendentes, semRede: envio.adiado };
  }

  deps.encerrar();
  return { saiu: true, apagados: 0 };
}

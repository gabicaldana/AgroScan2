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

// =============================================================================
// Excluir a conta (US15, RF15, RNF17)
// =============================================================================

export type DependenciasDaExclusao = {
  armazenamento: fila.Armazenamento;
  /** `DELETE /autenticacao/eu`; é `api.excluirConta` no app. */
  excluirNaApi: () => Promise<void>;
  /** Apaga a sessão e as cópias guardadas; é `sessao.encerrar` no app. */
  encerrar: () => void;
};

export type ResultadoDaExclusao =
  | { excluida: true; apagados: number }
  | { excluida: false; falha: unknown };

/**
 * Exclusão é eliminação (LGPD, art. 18): o servidor apaga a conta e o que é
 * dela, e o aparelho apaga o que guardava - a sessão, as cópias do caderno e
 * os diagnósticos que ainda não tinham subido. Ao contrário da saída, a fila
 * não é enviada antes: enviar seria gravar no servidor justamente o que a
 * pessoa pediu para apagar.
 *
 * O servidor vem primeiro. Se ele recusa - sem rede, ou hortas com outras
 * pessoas sob a responsabilidade dela (409) -, nada é apagado no aparelho e a
 * pessoa continua conectada, para resolver e tentar de novo.
 */
export async function excluir(deps: DependenciasDaExclusao): Promise<ResultadoDaExclusao> {
  try {
    await deps.excluirNaApi();
  } catch (falha) {
    return { excluida: false, falha };
  }
  const restantes = await fila.pendentes(deps.armazenamento);
  await fila.remover(
    deps.armazenamento,
    restantes.map((c) => c.offlineId),
  );
  deps.encerrar();
  return { excluida: true, apagados: restantes.length };
}

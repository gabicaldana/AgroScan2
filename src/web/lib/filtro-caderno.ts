/**
 * Filtro do caderno de campo: por período e por cultura.
 *
 * Roda sobre o que já está carregado no aparelho, e não no servidor, porque o
 * caderno precisa filtrar em modo avião também. Quando há rede, o mesmo filtro
 * é repassado à API para que registros antigos fora das últimas páginas
 * apareçam — mas a regra que decide o que a tela mostra é esta.
 *
 * Função pura: recebe o relógio por parâmetro, para o teste não depender da
 * data em que roda.
 */

export const PERIODOS = [
  { id: "tudo", rotulo: "Tudo", dias: null },
  { id: "7d", rotulo: "7 dias", dias: 7 },
  { id: "30d", rotulo: "30 dias", dias: 30 },
  { id: "90d", rotulo: "90 dias", dias: 90 },
] as const;

export type PeriodoId = (typeof PERIODOS)[number]["id"];

export type Filtro = {
  periodo: PeriodoId;
  /** `null` = todas as culturas. */
  culturaId: string | null;
};

export const SEM_FILTRO: Filtro = { periodo: "tudo", culturaId: null };

const UM_DIA = 24 * 60 * 60 * 1000;

/** Início do período, ou `null` quando não há limite. */
export function inicioDoPeriodo(periodo: PeriodoId, agora: Date): Date | null {
  const dias = PERIODOS.find((p) => p.id === periodo)?.dias ?? null;
  return dias === null ? null : new Date(agora.getTime() - dias * UM_DIA);
}

type Filtravel = { registradaEm: string; culturaId: string };

export function filtrar<T extends Filtravel>(
  registros: readonly T[],
  filtro: Filtro,
  agora: Date,
): T[] {
  const inicio = inicioDoPeriodo(filtro.periodo, agora);
  return registros.filter((r) => {
    if (filtro.culturaId !== null && r.culturaId !== filtro.culturaId) {
      return false;
    }
    // Compara instantes, não strings: o servidor devolve `+00:00` e a fila
    // grava `Z`, e as duas formas não se ordenam como texto.
    if (inicio !== null && Date.parse(r.registradaEm) < inicio.getTime()) {
      return false;
    }
    return true;
  });
}

/**
 * As culturas que aparecem no histórico, para o seletor.
 *
 * Só as que têm registro: oferecer uma cultura que filtra para uma lista vazia
 * é fazer o produtor tocar à toa.
 */
export function culturasPresentes(
  registros: readonly { culturaId: string; culturaNome: string; emoji: string | null }[],
): { id: string; nome: string; emoji: string | null }[] {
  const vistas = new Map<string, { id: string; nome: string; emoji: string | null }>();
  for (const r of registros) {
    if (!vistas.has(r.culturaId)) {
      vistas.set(r.culturaId, { id: r.culturaId, nome: r.culturaNome, emoji: r.emoji });
    }
  }
  return [...vistas.values()].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }),
  );
}

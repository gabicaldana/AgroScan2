/**
 * A localização da consulta (RF22), só com consentimento explícito (RNF16).
 *
 * As regras que a revisão de conformidade com a LGPD (#75) fixou:
 *
 * - **Nada é pedido sem a pessoa marcar a opção.** O app não chama a
 *   geolocalização ao abrir, nem ao diagnosticar: só no toque em "Salvar no
 *   caderno" com "Registrar onde fiz esta consulta" marcado. A opção começa
 *   desmarcada em toda consulta, e não há lembrança da escolha anterior: o
 *   consentimento é dado a cada registro, e não uma vez para sempre.
 * - **Só o necessário à finalidade (RNF15).** A finalidade é saber em que
 *   horta ou região a consulta foi feita, e não o ponto exato do canteiro. A
 *   coordenada sai daqui arredondada para 3 casas decimais, uns 110 m no
 *   Brasil, antes de ir para a fila ou para o servidor. O ponto preciso nunca
 *   é gravado.
 * - **Falhar não impede salvar.** Permissão negada, GPS desligado ou demora
 *   viram consulta salva sem localização, com o motivo na tela. O caderno é o
 *   produto; a localização é um complemento.
 *
 * A geolocalização entra por parâmetro, como o armazenamento da fila: é o que
 * permite testar sem navegador.
 */

export type Coordenada = { latitude: number; longitude: number };

export type MotivoSemLocalizacao =
  | "negada"
  | "indisponivel"
  | "demorou"
  | "sem-suporte";

export type ResultadoDaLocalizacao =
  | { coordenada: Coordenada; motivo: null }
  | { coordenada: null; motivo: MotivoSemLocalizacao };

/** 3 casas: 0,001° de latitude são uns 111 m. */
export const CASAS_DECIMAIS = 3;

/** O GPS em campo pode levar alguns segundos para a primeira posição. */
const LIMITE_MS = 15_000;

/** Uma posição de até 10 minutos atrás serve: a pessoa não saiu da horta. */
const IDADE_MAXIMA_MS = 10 * 60_000;

export function arredondar(c: Coordenada): Coordenada {
  const fator = 10 ** CASAS_DECIMAIS;
  // `+ 0` troca o -0 por 0: um "-0" no registro só confundiria quem lê.
  const r = (n: number) => Math.round(n * fator) / fator + 0;
  return { latitude: r(c.latitude), longitude: r(c.longitude) };
}

type Geolocalizador = Pick<Geolocation, "getCurrentPosition">;

/**
 * Pede a posição ao aparelho. Nunca rejeita: a falha volta como motivo.
 *
 * Precisão alta fica desligada de propósito. Ela liga o GPS fino, gasta
 * bateria e demora mais, para um ponto que seria arredondado para 110 m de
 * qualquer jeito.
 */
export function localizar(
  geo: Geolocalizador | undefined = globalThis.navigator?.geolocation,
  limiteMs: number = LIMITE_MS,
): Promise<ResultadoDaLocalizacao> {
  if (!geo) return Promise.resolve({ coordenada: null, motivo: "sem-suporte" });

  return new Promise((resolver) => {
    geo.getCurrentPosition(
      (posicao) =>
        resolver({
          coordenada: arredondar({
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
          }),
          motivo: null,
        }),
      (erro) =>
        resolver({
          coordenada: null,
          // Os códigos da especificação: 1 permissão, 2 posição, 3 tempo.
          motivo: erro.code === 1 ? "negada" : erro.code === 3 ? "demorou" : "indisponivel",
        }),
      { enableHighAccuracy: false, timeout: limiteMs, maximumAge: IDADE_MAXIMA_MS },
    );
  });
}

/** O que a tela diz quando a consulta foi salva sem a localização pedida. */
export function explicar(motivo: MotivoSemLocalizacao): string {
  switch (motivo) {
    case "negada":
      return "O aparelho não deu permissão para a localização. Para registrar o local nas próximas consultas, libere a localização para o AgroScan nos ajustes do navegador.";
    case "demorou":
      return "O aparelho demorou para achar a posição. Em campo aberto, com o GPS ligado, costuma ser mais rápido.";
    case "indisponivel":
      return "O aparelho não conseguiu achar a posição agora. Confira se a localização está ligada.";
    case "sem-suporte":
      return "Este navegador não oferece localização.";
  }
}

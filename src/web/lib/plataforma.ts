/**
 * Em que aparelho o app está, para o que a plataforma não diz sozinha.
 *
 * No Android o navegador oferece o botão de instalar. No iPhone, não: o único
 * caminho é Compartilhar → Adicionar à Tela de Início, e o produtor precisa ser
 * levado até lá. É também no iOS que o Safari apaga os dados de um site não
 * aberto por cerca de sete dias — catálogo em cache e fila de envio juntos.
 *
 * Funções puras sobre o que o navegador informa, para o teste não precisar de
 * um iPhone.
 */

export type Ambiente = {
  userAgent: string;
  /** `navigator.maxTouchPoints` */
  toques: number;
  /** Aberto pelo ícone da tela de início, e não pelo navegador. */
  instalado: boolean;
};

export function ehIOS({ userAgent, toques }: Ambiente): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // O iPadOS 13+ se apresenta como Mac. A diferença é a tela de toque, que
  // nenhum Mac tem.
  return /Macintosh/.test(userAgent) && toques > 1;
}

export function deveMostrarInstrucaoIOS(ambiente: Ambiente): boolean {
  return ehIOS(ambiente) && !ambiente.instalado;
}

/** Lê o ambiente do navegador. Só no cliente. */
export function ambienteAtual(): Ambiente {
  const nav = navigator as Navigator & { standalone?: boolean };
  return {
    userAgent: nav.userAgent,
    toques: nav.maxTouchPoints ?? 0,
    // `navigator.standalone` é do Safari; a media query cobre o resto.
    instalado:
      nav.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches,
  };
}

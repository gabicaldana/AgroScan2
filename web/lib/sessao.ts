/**
 * A sessão do usuário, guardada no próprio aparelho.
 *
 * Fica em `localStorage`, e não em cookie: o app é um PWA que precisa ler o
 * token com o service worker no meio do caminho e, às vezes, sem rede nenhuma.
 * Cookie `HttpOnly` seria mais seguro contra XSS, mas exigiria que toda leitura
 * passasse pelo servidor — o oposto do que este app faz.
 *
 * A mitigação do risco de XSS mora em outro lugar: nenhuma parte do app injeta
 * HTML vindo de fora, e o conteúdo do laudo sai da base curada, embutida no
 * bundle.
 *
 * Toda leitura e escrita é protegida: em aba anônima, com dados do site
 * bloqueados, ou durante a captura de miniatura, o acesso ao `localStorage`
 * pode simplesmente lançar. Um app de campo não pode quebrar por causa disso.
 */

const CHAVE_TOKEN = "agroscan.token";
const CHAVE_USUARIO = "agroscan.usuario";

export type UsuarioDaSessao = {
  id: number;
  nome: string;
  email: string;
  papel: string;
};

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    // Sem armazenamento: a sessão vale só enquanto a aba estiver aberta.
    // É pior que persistir, mas melhor que impedir o uso do app.
  }
}

function apagar(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    /* ver `gravar` */
  }
}

export function token(): string | null {
  return ler(CHAVE_TOKEN);
}

export function usuario(): UsuarioDaSessao | null {
  const bruto = ler(CHAVE_USUARIO);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as UsuarioDaSessao;
  } catch {
    // Guardado por uma versão anterior, com outro formato. Descarta em vez de
    // deixar a tela quebrar tentando ler um campo que não existe.
    apagar(CHAVE_USUARIO);
    return null;
  }
}

export function autenticado(): boolean {
  return token() !== null;
}

export function iniciar(novoToken: string, dono: UsuarioDaSessao): void {
  gravar(CHAVE_TOKEN, novoToken);
  gravar(CHAVE_USUARIO, JSON.stringify(dono));
}

export function encerrar(): void {
  apagar(CHAVE_TOKEN);
  apagar(CHAVE_USUARIO);
}

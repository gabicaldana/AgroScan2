/**
 * O cliente HTTP da API.
 *
 * Fala com `/api/v1` na PRÓPRIA ORIGEM, nunca com o host da API diretamente.
 * O rewrite do Next encaminha. Três motivos:
 *
 *   1. CORS deixa de existir;
 *   2. a regra do service worker que nunca cacheia `/api/` continua valendo
 *      sem exceção — ela olha o caminho, não o host;
 *   3. trocar o endereço da API vira variável de ambiente, e não um novo
 *      deploy do app.
 *
 * NENHUMA função daqui está no caminho do diagnóstico. O motor roda no
 * aparelho, sobre a base embutida no bundle, e continua respondendo em modo
 * avião. Isto aqui é o REGISTRO — histórico, conta, sincronização — e toda
 * chamada pode falhar sem que o produtor perca o que observou.
 */

import * as sessao from "./sessao.ts";

export const BASE = "/api/v1";

/** Falha vinda do servidor, com o código para a tela poder distinguir. */
export class ErroDaApi extends Error {
  status: number;
  detalhe: string;

  constructor(status: number, detalhe: string) {
    super(detalhe);
    this.name = "ErroDaApi";
    this.status = status;
    this.detalhe = detalhe;
  }
}

/** Não houve resposta: sem rede, servidor fora, DNS. Diferente de 4xx/5xx. */
export class SemResposta extends Error {
  constructor(causa?: unknown) {
    super("não foi possível falar com o servidor");
    this.name = "SemResposta";
    this.cause = causa;
  }
}

type Opcoes = {
  metodo?: "GET" | "POST" | "PATCH" | "DELETE";
  corpo?: unknown;
  /** Envia o token da sessão. Rota pública dispensa. */
  autenticado?: boolean;
  /** Formulário em vez de JSON — só o /autenticacao/token usa. */
  formulario?: Record<string, string>;
  sinal?: AbortSignal;
};

export async function chamar<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const {
    metodo = "GET",
    corpo,
    autenticado = false,
    formulario,
    sinal,
  } = opcoes;

  const cabecalhos: Record<string, string> = {};

  if (autenticado) {
    const token = sessao.token();
    if (!token) throw new ErroDaApi(401, "é preciso entrar na conta");
    cabecalhos["Authorization"] = `Bearer ${token}`;
  }

  let dados: BodyInit | undefined;
  if (formulario) {
    cabecalhos["Content-Type"] = "application/x-www-form-urlencoded";
    dados = new URLSearchParams(formulario).toString();
  } else if (corpo !== undefined) {
    cabecalhos["Content-Type"] = "application/json";
    dados = JSON.stringify(corpo);
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: dados,
      signal: sinal,
    });
  } catch (causa) {
    // `fetch` só rejeita quando não houve resposta nenhuma. Distinguir isto de
    // um 500 importa: sem rede a ação vai para a fila e será reenviada; um
    // erro do servidor não deve ser reenviado em laço.
    throw new SemResposta(causa);
  }

  if (resposta.status === 401) {
    // Token vencido ou conta removida. Encerrar aqui evita que a tela fique
    // tentando em laço com uma credencial que já não vale.
    sessao.encerrar();
    throw new ErroDaApi(401, "sessão expirada, entre novamente");
  }

  if (!resposta.ok) {
    throw new ErroDaApi(resposta.status, await extrairDetalhe(resposta));
  }

  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

async function extrairDetalhe(resposta: Response): Promise<string> {
  try {
    const corpo = await resposta.json();
    if (typeof corpo?.detail === "string") return corpo.detail;
    // Erro de validação do FastAPI: lista de problemas por campo.
    if (Array.isArray(corpo?.detail)) {
      return corpo.detail
        .map((p: { loc?: unknown[]; msg?: string }) =>
          `${(p.loc ?? []).slice(1).join(".")}: ${p.msg ?? "inválido"}`)
        .join("; ");
    }
  } catch {
    /* resposta sem JSON */
  }
  return `erro ${resposta.status}`;
}

// =============================================================================
// Conta
// =============================================================================

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
};

export async function registrar(
  nome: string,
  email: string,
  senha: string,
): Promise<Usuario> {
  return chamar<Usuario>("/autenticacao/registro", {
    metodo: "POST",
    corpo: { nome, email, senha },
  });
}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  const { access_token } = await chamar<{ access_token: string }>(
    "/autenticacao/token",
    // O endpoint segue o fluxo `password` do OAuth2, que é form-encoded e usa
    // `username` para o que aqui é o e-mail.
    { metodo: "POST", formulario: { username: email, password: senha } },
  );

  // A sessão precisa existir antes da próxima chamada, que já vai autenticada.
  sessao.iniciar(access_token, {
    id: 0, nome: "", email, papel: "produtor",
  });

  const usuario = await chamar<Usuario>("/autenticacao/eu", {
    autenticado: true,
  });
  sessao.iniciar(access_token, usuario);
  return usuario;
}

export async function excluirConta(): Promise<void> {
  await chamar<void>("/autenticacao/eu", {
    metodo: "DELETE",
    autenticado: true,
  });
  sessao.encerrar();
}

// =============================================================================
// Caderno
// =============================================================================

export type HipoteseRegistrada = {
  doencaId: string;
  compatibilidade: number;
};

export type ConsultaParaEnviar = {
  offlineId: string;
  culturaId: string;
  sintomas: string[];
  hipoteses: HipoteseRegistrada[];
  registradaEm: string;
  versaoCatalogo: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type ConsultaResumida = {
  id: number;
  offline_id: string;
  cultura_id: string;
  cultura_nome: string;
  emoji: string | null;
  origem: string;
  registrada_em: string;
  doenca_id: string | null;
  doenca_nome: string | null;
  compatibilidade: number | null;
  tem_feedback: boolean;
};

export type ResultadoDaSincronizacao = {
  aceitas: string[];
  duplicadas: string[];
  rejeitadas: { offline_id: string; motivo: string }[];
};

/** camelCase do app -> snake_case da API. A conversão acontece num lugar só. */
function paraApi(c: ConsultaParaEnviar) {
  return {
    offline_id: c.offlineId,
    cultura_id: c.culturaId,
    sintomas: c.sintomas,
    hipoteses: c.hipoteses.map((h) => ({
      doenca_id: h.doencaId,
      compatibilidade: h.compatibilidade,
    })),
    registrada_em: c.registradaEm,
    versao_catalogo: c.versaoCatalogo,
    latitude: c.latitude ?? null,
    longitude: c.longitude ?? null,
  };
}

export async function enviarConsulta(consulta: ConsultaParaEnviar) {
  return chamar<{ criada: boolean }>("/consultas", {
    metodo: "POST",
    corpo: paraApi(consulta),
    autenticado: true,
  });
}

export async function sincronizar(
  consultas: ConsultaParaEnviar[],
): Promise<ResultadoDaSincronizacao> {
  return chamar<ResultadoDaSincronizacao>("/consultas/sincronizar", {
    metodo: "POST",
    corpo: { consultas: consultas.map(paraApi) },
    autenticado: true,
  });
}

export async function listarConsultas(
  parametros: { limite?: number; culturaId?: string } = {},
): Promise<ConsultaResumida[]> {
  const busca = new URLSearchParams();
  if (parametros.limite) busca.set("limite", String(parametros.limite));
  if (parametros.culturaId) busca.set("cultura_id", parametros.culturaId);
  const consulta = busca.toString();

  return chamar<ConsultaResumida[]>(
    `/consultas${consulta ? `?${consulta}` : ""}`,
    { autenticado: true },
  );
}

export async function registrarFeedback(
  consultaId: number,
  confirmado: boolean,
  doencaConfirmadaId?: string | null,
  comentario?: string | null,
) {
  return chamar(`/consultas/${consultaId}/feedback`, {
    metodo: "POST",
    corpo: {
      confirmado,
      doenca_confirmada_id: doencaConfirmadaId ?? null,
      comentario: comentario ?? null,
    },
    autenticado: true,
  });
}

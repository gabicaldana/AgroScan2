/**
 * GERADO AUTOMATICAMENTE por `npm run base` a partir de
 * data/contrato_visao.json. Nao editar a mao.
 *
 * O contrato do pipeline de imagem: como um pixel vira tensor, e quando o app
 * deve dizer "nao sei" em vez de responder. Existe ANTES do modelo de
 * proposito - quem treinar obedece a estes valores, e nao o contrario. Se o
 * app redimensionar de um jeito e o treino de outro, o modelo recebe um tensor
 * que nunca viu e mesmo assim responde com confianca alta.
 */

export type Preprocessamento = {
  entrada: {
    largura: number;
    altura: number;
    canais: number;
    layout: string;
    tipo: string;
  };
  redimensionamento: {
    ladoMenor: number;
    recorte: string;
    metodo: string;
    cantosAlinhados: boolean;
  };
  normalizacao: { escala: number; media: number[]; desvio: number[] };
  saida: { tipo: string };
};

/**
 * Limiares de recusa. Nulos ate existir um modelo treinado e a curva
 * risco-cobertura ser medida: chutar um numero daria ao produtor uma recusa
 * que nao significa nada.
 */
export type Recusa = {
  temperatura: number | null;
  limiarMsp: number | null;
  limiarEnergia: number | null;
  calibradoEm: string | null;
  /** Lembrete de que a pontuacao vai sobre os logits CRUS. */
  medirSobre: string;
  saboresDeForaDaDistribuicao: string[];
};

export const PREPROCESSAMENTO: Preprocessamento = {
  "entrada": {
    "largura": 224,
    "altura": 224,
    "canais": 3,
    "layout": "NCHW",
    "tipo": "float32"
  },
  "redimensionamento": {
    "ladoMenor": 256,
    "recorte": "central",
    "metodo": "bilinear",
    "cantosAlinhados": false
  },
  "normalizacao": {
    "escala": 255,
    "media": [
      0.485,
      0.456,
      0.406
    ],
    "desvio": [
      0.229,
      0.224,
      0.225
    ]
  },
  "saida": {
    "tipo": "logits"
  }
};

export const RECUSA: Recusa = {
  "temperatura": null,
  "limiarMsp": null,
  "limiarEnergia": null,
  "calibradoEm": null,
  "medirSobre": "LOGITS CRUS, antes de qualquer mascara por cultura. Mascarar renormaliza sobre as classes de uma cultura so, e isso faz QUALQUER imagem - inclusive uma folha de outra especie apontada como tomate - sair com confianca alta. Calcular a recusa depois da mascara e o mesmo que nao ter recusa.",
  "saboresDeForaDaDistribuicao": [
    "hortalica da base que o acervo de imagens nao cobre: o fluxo por sintomas a alcanca inteira, mas a camera nao. So a recusa protege quem fotografar assim mesmo.",
    "especie fora da base inteira - uma arvore, uma planta ornamental. So a recusa pega.",
    "cultura conhecida e doenca desconhecida. E o caso mais perigoso: a foto cai numa classe vizinha com confianca alta, e o laudo precisa dizer isso em voz alta."
  ]
};

export const ARQUIVO: { nome: string | null; sha256: string | null } = {
  "nome": null,
  "sha256": null
};

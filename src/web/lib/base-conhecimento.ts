/**
 * GERADO AUTOMATICAMENTE por `npm run base` a partir de
 * data/base_conhecimento.json. Nao editar a mao: a proxima geracao
 * sobrescreve.
 *
 * Este modulo e o conteudo do laudo, embutido no bundle. Um app que busca o
 * conteudo por rede nao funciona no meio do talhao, que e o unico lugar onde
 * ele precisa funcionar.
 */

export type OrgaoId = "folha" | "caule" | "raiz" | "fruto" | "planta";
export type GrupoHortalica = "fruto" | "folha" | "flor" | "haste" | "raiz";
export type TipoTratamento = "cultural" | "biologico" | "quimico";
export type Gravidade = 1 | 2 | 3 | 4 | 5;

export type Orgao = {
  id: OrgaoId;
  /** Rotulo do grupo na tela de sintomas ("Na folha"). */
  rotulo: string;
  /** Ordem em que o produtor olha a planta - nao e a ordem alfabetica. */
  ordem: number;
};

export type Sintoma = { id: string; nome: string; orgao: OrgaoId };

/** Peso de 0 a 1: 1.0 e o sintoma classico da doenca, 0.3 o ocasional. */
export type SintomaDoPerfil = { id: string; peso: number };

export type Tratamento = { tipo: TipoTratamento; descricao: string };

export type IngredienteAtivo = { nome: string; grupo: string; acao: string };

export type CondicoesFavoraveis = {
  temperatura: string;
  umidade: string;
  observacao: string;
};

export type Doenca = {
  id: string;
  nome: string;
  agente: string;
  tipoAgente: string;
  gravidade: Gravidade;
  descricao: string;
  sintomas: SintomaDoPerfil[];
  condicoesFavoraveis: CondicoesFavoraveis;
  tratamentos: Tratamento[];
  ingredientesAtivos: IngredienteAtivo[];
};

export type Cultura = {
  id: string;
  nome: string;
  nomeCientifico: string;
  /** Classificacao da Embrapa por parte comestivel. Agrupa o seletor na tela:
   *  com dezenas de hortalicas, uma lista plana seria ilegivel no celular. */
  grupo: GrupoHortalica;
  /** Familia botanica. Sustenta o alerta de rotacao e explica por que o
   *  catalogo de sintomas se reaproveita entre culturas da mesma familia. */
  familia: string;
  emoji: string;
  /** Ciclo medio ate a colheita, em dias. Nulo quando nao cadastrado. */
  cicloDias: number | null;
  doencas: Doenca[];
};

export const VERSAO_DA_BASE: string = "2026.10.24";

export const ORGAOS: readonly Orgao[] = [
  {
    "id": "folha",
    "rotulo": "Na folha",
    "ordem": 1
  },
  {
    "id": "caule",
    "rotulo": "No caule, ramo ou haste",
    "ordem": 2
  },
  {
    "id": "raiz",
    "rotulo": "Na raiz, bulbo ou tuberculo",
    "ordem": 3
  },
  {
    "id": "fruto",
    "rotulo": "No fruto",
    "ordem": 4
  },
  {
    "id": "planta",
    "rotulo": "Na planta inteira",
    "ordem": 5
  }
];

export const SINTOMAS: readonly Sintoma[] = [
  {
    "id": "manchas_escuras_aneis",
    "nome": "Manchas escuras com anéis concêntricos, como um alvo",
    "orgao": "folha"
  },
  {
    "id": "manchas_amareladas",
    "nome": "Manchas amareladas (cloróticas)",
    "orgao": "folha"
  },
  {
    "id": "manchas_encharcadas",
    "nome": "Lesões encharcadas, com aspecto de queimadura",
    "orgao": "folha"
  },
  {
    "id": "manchas_pequenas_centro_claro",
    "nome": "Manchas pequenas com centro claro e borda escura",
    "orgao": "folha"
  },
  {
    "id": "pontuacoes_pretas_na_lesao",
    "nome": "Pontinhos pretos dentro da lesão",
    "orgao": "folha"
  },
  {
    "id": "mofo_branco_face_inferior",
    "nome": "Mofo esbranquiçado na face inferior da folha",
    "orgao": "folha"
  },
  {
    "id": "mofo_oliva_face_inferior",
    "nome": "Mofo aveludado verde-oliva a pardo na face inferior",
    "orgao": "folha"
  },
  {
    "id": "po_branco_superficie",
    "nome": "Pó branco, farináceo, na superfície da folha",
    "orgao": "folha"
  },
  {
    "id": "manchas_angulares_halo_amarelo",
    "nome": "Manchas angulares com halo amarelo ao redor",
    "orgao": "folha"
  },
  {
    "id": "mosaico_verde_claro_escuro",
    "nome": "Mosaico de verde claro e verde escuro",
    "orgao": "folha"
  },
  {
    "id": "nervuras_amareladas",
    "nome": "Amarelecimento entre as nervuras",
    "orgao": "folha"
  },
  {
    "id": "folhas_deformadas",
    "nome": "Folhas deformadas, enroladas ou reduzidas",
    "orgao": "folha"
  },
  {
    "id": "folhas_filiformes",
    "nome": "Folhas estreitas e filiformes, com aspecto de samambaia",
    "orgao": "folha"
  },
  {
    "id": "pontuacoes_finas_cloroticas",
    "nome": "Pontuações finas e claras, como picadas de agulha",
    "orgao": "folha"
  },
  {
    "id": "bronzeamento_folha",
    "nome": "Folha bronzeada, cor de palha",
    "orgao": "folha"
  },
  {
    "id": "teia_fina",
    "nome": "Teia fina entre as folhas e hastes",
    "orgao": "folha"
  },
  {
    "id": "acaros_face_inferior",
    "nome": "Ácaros minúsculos na face inferior (visíveis com lupa)",
    "orgao": "folha"
  },
  {
    "id": "insetos_face_inferior",
    "nome": "Insetos pequenos na face inferior da folha",
    "orgao": "folha"
  },
  {
    "id": "lesoes_no_caule",
    "nome": "Lesões escuras no caule ou haste",
    "orgao": "caule"
  },
  {
    "id": "lesoes_no_fruto",
    "nome": "Lesões deprimidas ou podridão no fruto",
    "orgao": "fruto"
  },
  {
    "id": "manchas_salientes_fruto",
    "nome": "Manchas ásperas e salientes, tipo verruga, no fruto",
    "orgao": "fruto"
  },
  {
    "id": "queda_de_frutos",
    "nome": "Queda prematura de frutos",
    "orgao": "fruto"
  },
  {
    "id": "desfolha_baixo_para_cima",
    "nome": "Queda de folhas começando pelas mais baixas",
    "orgao": "planta"
  },
  {
    "id": "queda_precoce_folhas",
    "nome": "Queda precoce de folhas por toda a planta",
    "orgao": "planta"
  },
  {
    "id": "murcha",
    "nome": "Murcha da planta",
    "orgao": "planta"
  },
  {
    "id": "crescimento_reduzido",
    "nome": "Crescimento reduzido / nanismo",
    "orgao": "planta"
  },
  {
    "id": "lesao_em_v_na_borda",
    "orgao": "folha",
    "nome": "Lesão amarela em forma de V, começando na borda da folha"
  },
  {
    "id": "nervuras_escurecidas",
    "orgao": "folha",
    "nome": "Nervuras escurecidas, quase pretas"
  },
  {
    "id": "galhas_na_raiz",
    "orgao": "raiz",
    "nome": "Raízes engrossadas e deformadas, com galhas"
  },
  {
    "id": "apodrecimento_mole_malcheiroso",
    "orgao": "planta",
    "nome": "Apodrecimento mole e malcheiroso"
  },
  {
    "id": "manchas_angulares_entre_nervuras",
    "nome": "Manchas angulosas, limitadas pelas nervuras",
    "orgao": "folha"
  },
  {
    "id": "mofo_arroxeado_face_inferior",
    "nome": "Mofo acinzentado a arroxeado na face inferior, sob as manchas",
    "orgao": "folha"
  },
  {
    "id": "furos_na_folha",
    "nome": "Centro da lesão seca e cai, deixando furos na folha",
    "orgao": "folha"
  },
  {
    "id": "folhas_com_bolhas",
    "nome": "Folhas com bolhas e enrugadas",
    "orgao": "folha"
  },
  {
    "id": "goma_no_caule",
    "nome": "Rachadura no caule ou no colo, escorrendo goma parda",
    "orgao": "caule"
  },
  {
    "id": "vasos_escurecidos",
    "nome": "Ao cortar o caule, vasos internos escurecidos",
    "orgao": "caule"
  },
  {
    "id": "massa_rosada_na_lesao",
    "nome": "Massa rosada ou alaranjada sobre a lesão, em tempo úmido",
    "orgao": "fruto"
  },
  {
    "id": "frutos_deformados",
    "nome": "Frutos deformados, manchados ou rachados",
    "orgao": "fruto"
  }
];

export const CULTURAS: readonly Cultura[] = [
  {
    "id": "abobora",
    "nome": "Abóbora",
    "nomeCientifico": "Cucurbita moschata",
    "grupo": "fruto",
    "familia": "Cucurbitaceae",
    "emoji": "🎃",
    "cicloDias": null,
    "doencas": [
      {
        "id": "abobora_mildio",
        "nome": "Míldio da abóbora",
        "agente": "Pseudoperonospora cubensis",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Começa na face de cima da folha, como manchas amarelas e angulosas, limitadas pelas nervuras, que se multiplicam e tomam o limbo. Embaixo delas, na face inferior, aparece um mofo acinzentado a arroxeado nas horas úmidas. As manchas necrosam e a folhagem queima, com séria redução da produção.",
        "sintomas": [
          {
            "id": "manchas_angulares_entre_nervuras",
            "peso": 1
          },
          {
            "id": "mofo_arroxeado_face_inferior",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "16 a 22 °C",
          "umidade": "Alta, com orvalho, chuva ou irrigação por aspersão",
          "observacao": "Parasita obrigatório, que ataca muitas cucurbitáceas. Aparece nas épocas de temperatura mais amena e se espalha pelo vento e pelos respingos de chuva."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes e evitar plantar em locais e épocas de orvalho prolongado."
          },
          {
            "tipo": "cultural",
            "descricao": "Preferir irrigação localizada à aspersão."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de outras cucurbitáceas e eliminar os restos culturais depois da última colheita."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva e sistêmicos quando a doença se instala, com rodízio de grupo químico. Só produtos registrados para a cultura."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Dimetomorfe",
            "grupo": "Amida do ácido cinâmico",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "abobora_oidio",
        "nome": "Oídio da abóbora",
        "agente": "Podosphaera xanthii",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Pó branco e farináceo, formado pelo próprio fungo, aparece em manchas na folha e, ao se juntarem, cobre toda a área foliar. As folhas mais atacadas, a começar pelas mais velhas, secam das bordas para o centro. É a principal doença de parte aérea das cucurbitáceas.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.4
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Altas",
          "umidade": "Baixa: clima seco agrava a doença",
          "observacao": "Ao contrário do míldio, é mais severo em clima seco e quente. É mais frequente em abóboras, pepinos e melões do que em melancia."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes, quando houver: é a forma mais econômica de controle."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de lavouras velhas de cucurbitáceas e eliminar os restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Começar nos primeiros sintomas, que surgem na face inferior da folha. Enxofre dá bons resultados; em condições muito favoráveis, triazóis sistêmicos são mais eficientes."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "abobora_mosaico",
        "nome": "Mosaico da abóbora",
        "agente": "Potyvírus, sobretudo o PRSV-W (Papaya ringspot virus - tipo W), o ZYMV e o WMV, transmitidos por pulgões",
        "tipoAgente": "vírus",
        "gravidade": 5,
        "descricao": "Mosqueado e mosaico de verde-claro e verde-escuro, com bolhas, enrugamento e deformação das folhas. O ZYMV também descolore a folha entre as nervuras e pode necrosar o tecido. A planta fica enfezada, e os frutos saem malformados e rachados, sem valor comercial. A infecção nos estádios iniciais é a que mais compromete a produção.",
        "sintomas": [
          {
            "id": "mosaico_verde_claro_escuro",
            "peso": 1
          },
          {
            "id": "folhas_com_bolhas",
            "peso": 0.8
          },
          {
            "id": "folhas_deformadas",
            "peso": 0.8
          },
          {
            "id": "frutos_deformados",
            "peso": 0.7
          },
          {
            "id": "nervuras_amareladas",
            "peso": 0.5
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Ampla: acompanha a população de pulgões",
          "umidade": "Não é fator direto",
          "observacao": "Dezenas de espécies de pulgão transmitem o vírus de forma não persistente, e também passa por contato mecânico. O PRSV-W e o WMV não passam pela semente. É a principal virose das cucurbitáceas no Brasil, presente em lavouras de todos os estados levantados pela Embrapa entre 2008 e 2010."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Não há cura para a planta infectada. Não plantar ao lado de lavouras de cucurbitáceas em produção, abandonadas ou infectadas, e eliminar os restos culturais logo após a colheita."
          },
          {
            "tipo": "cultural",
            "descricao": "Escolher a época de plantio fora dos picos de pulgão e eliminar plantas invasoras que abrigam o vetor e o vírus."
          },
          {
            "tipo": "quimico",
            "descricao": "Inseticida contra pulgão tem efeito limitado: o vírus passa em picadas de segundos, antes de o inseto morrer. Não substitui as medidas culturais."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "abobora_antracnose",
        "nome": "Antracnose da abóbora",
        "agente": "Colletotrichum orbiculare (sin. C. lagenarium)",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Nas abóboras o ataque aparece sobretudo nos frutos: lesões circulares, deprimidas e encharcadas, que crescem à medida que o fruto amadurece e, em tempo úmido, escurecem e se cobrem de uma massa de esporos rosa ou salmão. Pode haver placas brancas na casca e, por dentro, podridão seca. Nas folhas, manchas amareladas ou encharcadas que ficam marrons e quebradiças; no pecíolo e na rama, manchas alongadas e escuras, de centro claro. O fruto infectado cedo pode abortar ou se deformar.",
        "sintomas": [
          {
            "id": "lesoes_no_fruto",
            "peso": 1
          },
          {
            "id": "massa_rosada_na_lesao",
            "peso": 0.9
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.4
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.4
          },
          {
            "id": "frutos_deformados",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "21 a 27 °C",
          "umidade": "Alta, com água livre sobre folhas e frutos",
          "observacao": "Sobrevive em restos de cucurbitáceas cultivadas ou silvestres e na semente, e se espalha por respingos de chuva, irrigação por aspersão, insetos e ferramentas. Os sintomas podem aparecer quatro dias depois da infecção, ainda no campo ou só na pós-colheita."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes e mudas certificadas, livres do patógeno, e rotação de três anos ou mais."
          },
          {
            "tipo": "cultural",
            "descricao": "Manter a lavoura arejada; evitar irrigação por aspersão ou fazê-la de manhã; em estufa, gotejamento."
          },
          {
            "tipo": "cultural",
            "descricao": "Remover e destruir os restos culturais e controlar as cucurbitáceas silvestres e voluntárias."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas registrados para a cultura. Não há cultivar comercial de abóbora resistente à antracnose no Brasil."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Flutriafol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "abobrinha",
    "nome": "Abobrinha",
    "nomeCientifico": "Cucurbita pepo",
    "grupo": "fruto",
    "familia": "Cucurbitaceae",
    "emoji": "🥒",
    "cicloDias": null,
    "doencas": [
      {
        "id": "abobrinha_mildio",
        "nome": "Míldio da abobrinha",
        "agente": "Pseudoperonospora cubensis",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Começa na face de cima da folha, como manchas amarelas e angulosas, limitadas pelas nervuras, que se multiplicam e tomam o limbo. Embaixo delas, na face inferior, aparece um mofo acinzentado a arroxeado nas horas úmidas. As manchas necrosam e a folhagem queima, com séria redução da produção.",
        "sintomas": [
          {
            "id": "manchas_angulares_entre_nervuras",
            "peso": 1
          },
          {
            "id": "mofo_arroxeado_face_inferior",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "16 a 22 °C",
          "umidade": "Alta, com orvalho, chuva ou irrigação por aspersão",
          "observacao": "Parasita obrigatório, que ataca muitas cucurbitáceas. Aparece nas épocas de temperatura mais amena e se espalha pelo vento e pelos respingos de chuva."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes e evitar plantar em locais e épocas de orvalho prolongado."
          },
          {
            "tipo": "cultural",
            "descricao": "Preferir irrigação localizada à aspersão."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de outras cucurbitáceas e eliminar os restos culturais depois da última colheita."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva e sistêmicos quando a doença se instala, com rodízio de grupo químico. Só produtos registrados para a cultura."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Dimetomorfe",
            "grupo": "Amida do ácido cinâmico",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "abobrinha_oidio",
        "nome": "Oídio da abobrinha",
        "agente": "Podosphaera xanthii",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Pó branco e farináceo, formado pelo próprio fungo, aparece em manchas na folha e, ao se juntarem, cobre toda a área foliar. As folhas mais atacadas, a começar pelas mais velhas, secam das bordas para o centro. É a principal doença de parte aérea das cucurbitáceas.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.4
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Altas",
          "umidade": "Baixa: clima seco agrava a doença",
          "observacao": "Ao contrário do míldio, é mais severo em clima seco e quente. É mais frequente em abóboras, pepinos e melões do que em melancia."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes, quando houver: é a forma mais econômica de controle."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de lavouras velhas de cucurbitáceas e eliminar os restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Começar nos primeiros sintomas, que surgem na face inferior da folha. Enxofre dá bons resultados; em condições muito favoráveis, triazóis sistêmicos são mais eficientes."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "abobrinha_mosaico",
        "nome": "Mosaico da abobrinha",
        "agente": "Potyvírus, sobretudo o PRSV-W (Papaya ringspot virus - tipo W), o ZYMV e o WMV, transmitidos por pulgões",
        "tipoAgente": "vírus",
        "gravidade": 5,
        "descricao": "Mosqueado e mosaico de verde-claro e verde-escuro, com bolhas, enrugamento e deformação das folhas. O ZYMV também descolore a folha entre as nervuras e pode necrosar o tecido. A planta fica enfezada, e os frutos saem malformados e rachados, sem valor comercial. A infecção nos estádios iniciais é a que mais compromete a produção.",
        "sintomas": [
          {
            "id": "mosaico_verde_claro_escuro",
            "peso": 1
          },
          {
            "id": "folhas_com_bolhas",
            "peso": 0.8
          },
          {
            "id": "folhas_deformadas",
            "peso": 0.8
          },
          {
            "id": "frutos_deformados",
            "peso": 0.7
          },
          {
            "id": "nervuras_amareladas",
            "peso": 0.5
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Ampla: acompanha a população de pulgões",
          "umidade": "Não é fator direto",
          "observacao": "Dezenas de espécies de pulgão transmitem o vírus de forma não persistente, e também passa por contato mecânico. O PRSV-W e o WMV não passam pela semente. É a principal virose das cucurbitáceas no Brasil, presente em lavouras de todos os estados levantados pela Embrapa entre 2008 e 2010."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Não há cura para a planta infectada. Não plantar ao lado de lavouras de cucurbitáceas em produção, abandonadas ou infectadas, e eliminar os restos culturais logo após a colheita."
          },
          {
            "tipo": "cultural",
            "descricao": "Escolher a época de plantio fora dos picos de pulgão e eliminar plantas invasoras que abrigam o vetor e o vírus."
          },
          {
            "tipo": "quimico",
            "descricao": "Inseticida contra pulgão tem efeito limitado: o vírus passa em picadas de segundos, antes de o inseto morrer. Não substitui as medidas culturais."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "abobrinha_antracnose",
        "nome": "Antracnose da abobrinha",
        "agente": "Colletotrichum orbiculare (sin. C. lagenarium)",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Nas abóboras o ataque aparece sobretudo nos frutos: lesões circulares, deprimidas e encharcadas, que crescem à medida que o fruto amadurece e, em tempo úmido, escurecem e se cobrem de uma massa de esporos rosa ou salmão. Pode haver placas brancas na casca e, por dentro, podridão seca. Nas folhas, manchas amareladas ou encharcadas que ficam marrons e quebradiças; no pecíolo e na rama, manchas alongadas e escuras, de centro claro. O fruto infectado cedo pode abortar ou se deformar.",
        "sintomas": [
          {
            "id": "lesoes_no_fruto",
            "peso": 1
          },
          {
            "id": "massa_rosada_na_lesao",
            "peso": 0.9
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.4
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.4
          },
          {
            "id": "frutos_deformados",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "21 a 27 °C",
          "umidade": "Alta, com água livre sobre folhas e frutos",
          "observacao": "Sobrevive em restos de cucurbitáceas cultivadas ou silvestres e na semente, e se espalha por respingos de chuva, irrigação por aspersão, insetos e ferramentas. Os sintomas podem aparecer quatro dias depois da infecção, ainda no campo ou só na pós-colheita."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes e mudas certificadas, livres do patógeno, e rotação de três anos ou mais."
          },
          {
            "tipo": "cultural",
            "descricao": "Manter a lavoura arejada; evitar irrigação por aspersão ou fazê-la de manhã; em estufa, gotejamento."
          },
          {
            "tipo": "cultural",
            "descricao": "Remover e destruir os restos culturais e controlar as cucurbitáceas silvestres e voluntárias."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas registrados para a cultura. Não há cultivar comercial de abóbora resistente à antracnose no Brasil."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Flutriafol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      }
    ]
  },
  {
    "id": "agriao",
    "nome": "Agrião",
    "nomeCientifico": "Nasturtium officinale",
    "grupo": "folha",
    "familia": "Brassicaceae",
    "emoji": "🌿",
    "cicloDias": 60,
    "doencas": [
      {
        "id": "agriao_mildio",
        "nome": "Míldio do agrião",
        "agente": "Hyaloperonospora nasturtii-aquatici",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Manchas amareladas de contorno anguloso na face superior da folha e, embaixo delas, um mofo branco-acinzentado na face inferior - é o sinal que confirma o diagnóstico. No agrião, cultivado em água corrente, a umidade é permanente por definição do sistema de cultivo - o manejo não pode contar com a folha secar. Avança rápido em tempo fresco e úmido, e é a doença que mais aparece em plantio adensado.",
        "sintomas": [
          {
            "id": "manchas_amareladas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "10 a 20 °C",
          "umidade": "Alta - orvalho ou molhamento foliar prolongado",
          "observacao": "Noites frias com orvalho pela manhã são a condição clássica. Plantio adensado segura a umidade entre as folhas e prolonga o molhamento."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Evitar o adensamento e renovar as touceiras; manter a água corrente e limpa; retirar e destruir as plantas com sintoma; formar o canteiro com mudas sadias, longe de restos de cultivo doente."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, iniciada antes do período de maior umidade."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas específicos para oomicetos, em aplicação preventiva. Produto para fungo verdadeiro não tem efeito aqui."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Fosetil-alumínio",
            "grupo": "Fosfonato",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "agriao_cercosporiose",
        "nome": "Cercosporiose do agrião",
        "agente": "Cercospora nasturtii",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas pequenas e arredondadas, de centro claro e borda escura, espalhadas pela folha. No agrião, cultivado em água corrente, a umidade é permanente por definição do sistema de cultivo - o manejo não pode contar com a folha secar. Quando numerosas, as manchas se juntam e a folha seca, o que inviabiliza a venda de um produto que é consumido justamente pela folha.",
        "sintomas": [
          {
            "id": "manchas_pequenas_centro_claro",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "22 a 28 °C",
          "umidade": "Alta - constante no cultivo em água corrente",
          "observacao": "O cultivo alagado mantém a umidade sempre alta, o que torna a doença recorrente e exige manejo preventivo contínuo."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Renovar a água do canteiro e garantir circulação; evitar adensamento; colher as folhas mais velhas primeiro; eliminar restos vegetais da área de cultivo."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, respeitando o intervalo de segurança curto exigido por hortaliça folhosa."
          },
          {
            "tipo": "quimico",
            "descricao": "Uso restrito: o agrião tem ciclo curto e é consumido cru. Conferir registro para a cultura no AGROFIT e respeitar rigorosamente o intervalo de segurança."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "agriao_podridao_mole",
        "nome": "Podridão-mole do agrião",
        "agente": "Pectobacterium carotovorum",
        "tipoAgente": "bactéria",
        "gravidade": 4,
        "descricao": "O tecido amolece, encharca e apodrece, com cheiro forte e desagradável que identifica a doença sem exame. No agrião, cultivado em água corrente, a umidade é permanente por definição do sistema de cultivo - o manejo não pode contar com a folha secar. A bactéria entra por ferimento, e por isso a colheita e o manuseio são o momento de maior risco.",
        "sintomas": [
          {
            "id": "apodrecimento_mole_malcheiroso",
            "peso": 1
          },
          {
            "id": "murcha",
            "peso": 0.6
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 30 °C",
          "umidade": "Muito alta - água parada é o fator decisivo",
          "observacao": "Calor com encharcamento é a combinação clássica. Ferimentos de colheita abrem a porta de entrada."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Evitar encharcamento e garantir renovação da água; colher com cuidado, sem ferir o tecido; não colher com a planta molhada; resfriar rapidamente após a colheita; descartar o material doente longe da área."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico com eficácia comprovada. O controle é de manejo e de higiene na colheita."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há bactericida curativo. Produtos cúpricos têm ação apenas preventiva e de superfície."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "batata",
    "nome": "Batata",
    "nomeCientifico": "Solanum tuberosum",
    "grupo": "raiz",
    "familia": "Solanaceae",
    "emoji": "🥔",
    "cicloDias": 100,
    "doencas": [
      {
        "id": "batata_pinta_preta",
        "nome": "Pinta-preta da batata",
        "agente": "Alternaria solani",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Mesmo fungo da pinta-preta do tomate. Começa pelas folhas mais velhas, próximas ao solo, com lesões escuras de anéis concêntricos que lembram um alvo, e progride para cima. A desfolha reduz a área fotossintética justamente na fase de tuberização, cortando a produtividade.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.8
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 29 °C",
          "umidade": "Orvalho ou molhamento foliar alternando com períodos secos",
          "observacao": "Ataca preferencialmente a planta debilitada, no fim do ciclo e sob deficiência de nitrogênio. Adubação equilibrada é uma medida de controle, não só de produtividade."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação de culturas evitando solanáceas (tomate, berinjela, pimentão)."
          },
          {
            "tipo": "cultural",
            "descricao": "Batata-semente sadia e eliminação de restos culturais e plantas voluntárias."
          },
          {
            "tipo": "cultural",
            "descricao": "Manter a nutrição equilibrada ao longo de todo o ciclo."
          },
          {
            "tipo": "quimico",
            "descricao": "Protetores em programa preventivo, alternando com sistêmicos para retardar resistência."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "batata_requeima",
        "nome": "Requeima da batata",
        "agente": "Phytophthora infestans",
        "tipoAgente": "oomiceto",
        "gravidade": 5,
        "descricao": "A doença mais destrutiva da batata. Lesões grandes de aspecto encharcado, verde-escuras a pardas, com mofo esbranquiçado na face inferior em manhãs úmidas. Em condições ideais o ciclo se fecha em quatro a cinco dias e a lavoura vai a zero em duas semanas.",
        "sintomas": [
          {
            "id": "manchas_encharcadas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.6
          },
          {
            "id": "murcha",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "12 a 20 °C (noites frias)",
          "umidade": "Acima de 90%, com neblina ou chuva frequente",
          "observacao": "É o patógeno que causou a Grande Fome Irlandesa e continua sendo a principal ameaça da cultura. Noite fria e úmida seguida de dia ameno é o cenário de epidemia explosiva. Controle curativo praticamente não existe: ou se protege antes, ou se perde."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Batata-semente sadia e cultivares com resistência quando disponíveis."
          },
          {
            "tipo": "cultural",
            "descricao": "Amontoa bem-feita, que protege os tubérculos dos esporos que descem com a água."
          },
          {
            "tipo": "cultural",
            "descricao": "Eliminar montes de descarte e plantas voluntárias, que são a ponte entre safras."
          },
          {
            "tipo": "quimico",
            "descricao": "Programa estritamente preventivo, guiado por previsão climática e não por calendário."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Cimoxanil",
            "grupo": "Cianoacetamida-oxima",
            "acao": "sistêmico"
          },
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Fluazinam",
            "grupo": "Fenilpiridinilamina",
            "acao": "protetor"
          }
        ]
      },
      {
        "id": "batata_canela_preta",
        "nome": "Canela-preta da batata",
        "agente": "Pectobacterium atrosepticum",
        "tipoAgente": "bactéria",
        "gravidade": 4,
        "descricao": "Apodrecimento escuro e mole que começa na base da haste, junto ao tubérculo-semente, e sobe pelo caule. A planta amarelece, murcha e tomba. A bactéria entra por ferimento ou pelo próprio tubérculo infectado, e o encharcamento do solo é o que decide se o foco se espalha. Não há controle curativo: o manejo é de prevenção e de eliminação do foco.",
        "sintomas": [
          {
            "id": "lesoes_no_caule",
            "peso": 1
          },
          {
            "id": "murcha",
            "peso": 0.8
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "18 a 24 °C",
          "umidade": "Alta - solo encharcado é o fator determinante",
          "observacao": "Plantio em solo frio e úmido logo após o corte do tubérculo-semente é a situação de maior risco. Excesso de irrigação e drenagem ruim espalham o foco pela água."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar tubérculo-semente sadio e certificado; evitar cortar a semente, ou deixá-la cicatrizar antes do plantio; não plantar em solo encharcado; melhorar a drenagem; arrancar e retirar da área as plantas doentes; não irrigar em excesso."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico registrado com eficácia comprovada para esta bacteriose. A prevenção pela sanidade da semente é o que funciona."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há bactericida curativo. Produtos cúpricos têm ação apenas preventiva e de superfície, e não alcançam a bactéria dentro do caule."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Hidróxido de cobre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "brocolis",
    "nome": "Brócolis",
    "nomeCientifico": "Brassica oleracea var. italica",
    "grupo": "flor",
    "familia": "Brassicaceae",
    "emoji": "🥦",
    "cicloDias": 90,
    "doencas": [
      {
        "id": "brocolis_mildio",
        "nome": "Míldio do brócolis",
        "agente": "Hyaloperonospora brassicae",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Manchas amareladas de contorno anguloso na face superior da folha e, embaixo delas, um mofo branco-acinzentado na face inferior - é o sinal que confirma o diagnóstico. No brócolis, a perda de área foliar antes da formação da inflorescência resulta em cabeça pequena e de baixo valor. Avança rápido em tempo fresco e úmido, e é a doença que mais aparece em plantio adensado.",
        "sintomas": [
          {
            "id": "manchas_amareladas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "10 a 20 °C",
          "umidade": "Alta - orvalho ou molhamento foliar prolongado",
          "observacao": "Noites frias com orvalho pela manhã são a condição clássica. Plantio adensado segura a umidade entre as folhas e prolonga o molhamento."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Ampliar o espaçamento para arejar a folhagem; irrigar de manhã, para a folha secar durante o dia; preferir irrigação localizada à aspersão; eliminar restos culturais; fazer rotação com espécies fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, iniciada antes do período de maior umidade."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas específicos para oomicetos, em aplicação preventiva. Produto para fungo verdadeiro não tem efeito aqui."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Fosetil-alumínio",
            "grupo": "Fosfonato",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "brocolis_alternariose",
        "nome": "Alternariose do brócolis",
        "agente": "Alternaria brassicicola e A. brassicae",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas escuras e arredondadas com anéis concêntricos, como um alvo, que crescem e se juntam até secar a folha. No brócolis, a perda de área foliar antes da formação da inflorescência resulta em cabeça pequena e de baixo valor. O fungo sobrevive na semente e em restos culturais, o que faz da semente sadia a primeira medida de controle.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 28 °C",
          "umidade": "Alta - exige molhamento foliar para infectar",
          "observacao": "Chuva frequente e irrigação por aspersão favorecem. Plantas mal nutridas adoecem mais."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou tratada; fazer rotação por dois anos com espécies fora das brássicas; eliminar restos culturais logo após a colheita; evitar irrigação por aspersão no fim da tarde."
          },
          {
            "tipo": "biologico",
            "descricao": "Trichoderma spp. aplicado ao solo reduz o inóculo dos restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva, com rodízio de grupo químico."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Iprodiona",
            "grupo": "Dicarboximida",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "brocolis_podridao_negra",
        "nome": "Podridão-negra do brócolis",
        "agente": "Xanthomonas campestris pv. campestris",
        "tipoAgente": "bactéria",
        "gravidade": 5,
        "descricao": "A lesão começa na borda da folha e avança para dentro em forma de V, amarela, com as nervuras escurecendo até ficarem pretas - a bactéria caminha pelos vasos. No brócolis, a perda de área foliar antes da formação da inflorescência resulta em cabeça pequena e de baixo valor. É a doença mais destrutiva das brássicas e não tem controle curativo: tudo se decide na sanidade da semente e na rotação.",
        "sintomas": [
          {
            "id": "lesao_em_v_na_borda",
            "peso": 1
          },
          {
            "id": "nervuras_escurecidas",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "murcha",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 30 °C",
          "umidade": "Alta - chuva com vento espalha a bactéria",
          "observacao": "A bactéria entra pelos hidatódios da borda da folha e por ferimentos. Trabalhar no canteiro com a folhagem molhada espalha o foco planta a planta."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou submetida a tratamento térmico; fazer rotação de dois a três anos com espécies fora das brássicas; não trabalhar no canteiro com as plantas molhadas; arrancar e retirar da área as plantas doentes; eliminar plantas daninhas da família."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico com eficácia comprovada contra esta bacteriose. O controle é preventivo."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há produto registrado no MAPA para a podridão-negra em brássicas, e nenhum bactericida cura a planta já infectada. O cobre tem só efeito bacteriostático, de superfície, e já há relato de Xanthomonas resistente a ele. O controle é preventivo."
          }
        ],
        "ingredientesAtivos": []
      }
    ]
  },
  {
    "id": "couve",
    "nome": "Couve",
    "nomeCientifico": "Brassica oleracea var. acephala",
    "grupo": "folha",
    "familia": "Brassicaceae",
    "emoji": "🥬",
    "cicloDias": 70,
    "doencas": [
      {
        "id": "couve_mildio",
        "nome": "Míldio da couve",
        "agente": "Hyaloperonospora brassicae",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Manchas amareladas de contorno anguloso na face superior da folha e, embaixo delas, um mofo branco-acinzentado na face inferior - é o sinal que confirma o diagnóstico. Na couve, que é colhida folha a folha ao longo de meses, cada folha perdida é produto que não vai para a feira. Avança rápido em tempo fresco e úmido, e é a doença que mais aparece em plantio adensado.",
        "sintomas": [
          {
            "id": "manchas_amareladas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "10 a 20 °C",
          "umidade": "Alta - orvalho ou molhamento foliar prolongado",
          "observacao": "Noites frias com orvalho pela manhã são a condição clássica. Plantio adensado segura a umidade entre as folhas e prolonga o molhamento."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Ampliar o espaçamento para arejar a folhagem; irrigar de manhã, para a folha secar durante o dia; preferir irrigação localizada à aspersão; eliminar restos culturais; fazer rotação com espécies fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, iniciada antes do período de maior umidade."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas específicos para oomicetos, em aplicação preventiva. Produto para fungo verdadeiro não tem efeito aqui."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Fosetil-alumínio",
            "grupo": "Fosfonato",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "couve_alternariose",
        "nome": "Alternariose da couve",
        "agente": "Alternaria brassicicola e A. brassicae",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas escuras e arredondadas com anéis concêntricos, como um alvo, que crescem e se juntam até secar a folha. Na couve, que é colhida folha a folha ao longo de meses, cada folha perdida é produto que não vai para a feira. O fungo sobrevive na semente e em restos culturais, o que faz da semente sadia a primeira medida de controle.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 28 °C",
          "umidade": "Alta - exige molhamento foliar para infectar",
          "observacao": "Chuva frequente e irrigação por aspersão favorecem. Plantas mal nutridas adoecem mais."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou tratada; fazer rotação por dois anos com espécies fora das brássicas; eliminar restos culturais logo após a colheita; evitar irrigação por aspersão no fim da tarde."
          },
          {
            "tipo": "biologico",
            "descricao": "Trichoderma spp. aplicado ao solo reduz o inóculo dos restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva, com rodízio de grupo químico."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Iprodiona",
            "grupo": "Dicarboximida",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "couve_podridao_negra",
        "nome": "Podridão-negra da couve",
        "agente": "Xanthomonas campestris pv. campestris",
        "tipoAgente": "bactéria",
        "gravidade": 5,
        "descricao": "A lesão começa na borda da folha e avança para dentro em forma de V, amarela, com as nervuras escurecendo até ficarem pretas - a bactéria caminha pelos vasos. Na couve, que é colhida folha a folha ao longo de meses, cada folha perdida é produto que não vai para a feira. É a doença mais destrutiva das brássicas e não tem controle curativo: tudo se decide na sanidade da semente e na rotação.",
        "sintomas": [
          {
            "id": "lesao_em_v_na_borda",
            "peso": 1
          },
          {
            "id": "nervuras_escurecidas",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "murcha",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 30 °C",
          "umidade": "Alta - chuva com vento espalha a bactéria",
          "observacao": "A bactéria entra pelos hidatódios da borda da folha e por ferimentos. Trabalhar no canteiro com a folhagem molhada espalha o foco planta a planta."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou submetida a tratamento térmico; fazer rotação de dois a três anos com espécies fora das brássicas; não trabalhar no canteiro com as plantas molhadas; arrancar e retirar da área as plantas doentes; eliminar plantas daninhas da família."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico com eficácia comprovada contra esta bacteriose. O controle é preventivo."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há produto registrado no MAPA para a podridão-negra em brássicas, e nenhum bactericida cura a planta já infectada. O cobre tem só efeito bacteriostático, de superfície, e já há relato de Xanthomonas resistente a ele. O controle é preventivo."
          }
        ],
        "ingredientesAtivos": []
      }
    ]
  },
  {
    "id": "couve_flor",
    "nome": "Couve-flor",
    "nomeCientifico": "Brassica oleracea var. botrytis",
    "grupo": "flor",
    "familia": "Brassicaceae",
    "emoji": "🥦",
    "cicloDias": 110,
    "doencas": [
      {
        "id": "couve_flor_mildio",
        "nome": "Míldio da couve-flor",
        "agente": "Hyaloperonospora brassicae",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Manchas amareladas de contorno anguloso na face superior da folha e, embaixo delas, um mofo branco-acinzentado na face inferior - é o sinal que confirma o diagnóstico. Na couve-flor, o ciclo longo expõe a planta por mais tempo, e a cabeça manchada perde valor comercial mesmo quando o dano é superficial. Avança rápido em tempo fresco e úmido, e é a doença que mais aparece em plantio adensado.",
        "sintomas": [
          {
            "id": "manchas_amareladas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "10 a 20 °C",
          "umidade": "Alta - orvalho ou molhamento foliar prolongado",
          "observacao": "Noites frias com orvalho pela manhã são a condição clássica. Plantio adensado segura a umidade entre as folhas e prolonga o molhamento."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Ampliar o espaçamento para arejar a folhagem; irrigar de manhã, para a folha secar durante o dia; preferir irrigação localizada à aspersão; eliminar restos culturais; fazer rotação com espécies fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, iniciada antes do período de maior umidade."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas específicos para oomicetos, em aplicação preventiva. Produto para fungo verdadeiro não tem efeito aqui."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Fosetil-alumínio",
            "grupo": "Fosfonato",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "couve_flor_podridao_negra",
        "nome": "Podridão-negra da couve-flor",
        "agente": "Xanthomonas campestris pv. campestris",
        "tipoAgente": "bactéria",
        "gravidade": 5,
        "descricao": "A lesão começa na borda da folha e avança para dentro em forma de V, amarela, com as nervuras escurecendo até ficarem pretas - a bactéria caminha pelos vasos. Na couve-flor, o ciclo longo expõe a planta por mais tempo, e a cabeça manchada perde valor comercial mesmo quando o dano é superficial. É a doença mais destrutiva das brássicas e não tem controle curativo: tudo se decide na sanidade da semente e na rotação.",
        "sintomas": [
          {
            "id": "lesao_em_v_na_borda",
            "peso": 1
          },
          {
            "id": "nervuras_escurecidas",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "murcha",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 30 °C",
          "umidade": "Alta - chuva com vento espalha a bactéria",
          "observacao": "A bactéria entra pelos hidatódios da borda da folha e por ferimentos. Trabalhar no canteiro com a folhagem molhada espalha o foco planta a planta."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou submetida a tratamento térmico; fazer rotação de dois a três anos com espécies fora das brássicas; não trabalhar no canteiro com as plantas molhadas; arrancar e retirar da área as plantas doentes; eliminar plantas daninhas da família."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico com eficácia comprovada contra esta bacteriose. O controle é preventivo."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há produto registrado no MAPA para a podridão-negra em brássicas, e nenhum bactericida cura a planta já infectada. O cobre tem só efeito bacteriostático, de superfície, e já há relato de Xanthomonas resistente a ele. O controle é preventivo."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "couve_flor_hernia",
        "nome": "Hérnia das crucíferas da couve-flor",
        "agente": "Plasmodiophora brassicae",
        "tipoAgente": "protista",
        "gravidade": 5,
        "descricao": "A parte de cima da planta murcha nas horas quentes e se recupera à noite, cresce pouco e amarelece - e a causa não está na folha. Ao arrancar, as raízes aparecem engrossadas e deformadas, com galhas. Na couve-flor, o ciclo longo expõe a planta por mais tempo, e a raiz comprometida resulta em cabeça pequena ou em nenhuma cabeça. O patógeno persiste no solo por até vinte anos, o que torna a área contaminada um problema de longo prazo.",
        "sintomas": [
          {
            "id": "galhas_na_raiz",
            "peso": 1
          },
          {
            "id": "murcha",
            "peso": 0.8
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.7
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "18 a 25 °C",
          "umidade": "Alta - solo úmido e mal drenado",
          "observacao": "Solo ácido, abaixo de pH 6,5, é o fator que mais favorece. A calagem elevando o pH é a medida de maior efeito, e é preventiva: não cura a planta já infectada."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Fazer calagem para elevar o pH do solo acima de 7,0; melhorar a drenagem; usar mudas produzidas em substrato sadio; não transitar com máquinas e implementos da área contaminada para a área limpa; rotação longa, de pelo menos sete anos, fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Resultados inconsistentes. Em couve-flor, Trichoderma harzianum não diferiu da testemunha em ensaio de campo. Não substitui a calagem."
          },
          {
            "tipo": "quimico",
            "descricao": "Ciazofamida tem registro para esta doença em brássicas: uma aplicação na bandeja de mudas e mais duas ou três no campo, de forma preventiva. Não elimina o patógeno do solo nem cura a planta já com galhas - a calagem e a rotação continuam sendo a base do manejo."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Ciazofamida",
            "grupo": "Cianoimidazol",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "jilo",
    "nome": "Jiló",
    "nomeCientifico": "Solanum aethiopicum (sin. S. gilo)",
    "grupo": "fruto",
    "familia": "Solanaceae",
    "emoji": "🍆",
    "cicloDias": null,
    "doencas": [
      {
        "id": "jilo_antracnose",
        "nome": "Antracnose do jiló",
        "agente": "Colletotrichum gloeosporioides e C. acutatum",
        "tipoAgente": "fungo",
        "gravidade": 5,
        "descricao": "A doença mais importante do jiló. Nos frutos, lesões deprimidas, de formato e tamanho variáveis, com uma massa rosada de esporos no centro sob alta umidade. Muitas vezes aparece só depois da colheita, no transporte, e deprecia quase todo o produto. Nas folhas e nos ramos, pequenas lesões necróticas, circulares a alongadas. Em época chuvosa e com muito inóculo, pode atingir todos os frutos.",
        "sintomas": [
          {
            "id": "lesoes_no_fruto",
            "peso": 1
          },
          {
            "id": "massa_rosada_na_lesao",
            "peso": 0.8
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Clima ameno a quente; temperaturas altas favorecem",
          "umidade": "Alta, com chuva ou irrigação por aspersão",
          "observacao": "O fungo sobrevive em restos culturais e em frutos mumificados, e a semente contaminada o leva para longe. Os esporos se espalham na lavoura pelos respingos de água."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes sadias e cultivar tolerante, como a Tinguá."
          },
          {
            "tipo": "cultural",
            "descricao": "Plantar longe de outras solanáceas, de preferência em áreas mais altas e menos úmidas; ralear para arejar as plantas."
          },
          {
            "tipo": "cultural",
            "descricao": "Eliminar frutos doentes e partes infectadas, destruir os restos culturais e fazer rotação de culturas."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas cúpricos, que a Embrapa recomenda e têm registro para a antracnose do jiló, em aplicação preventiva."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Hidróxido de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Flutriafol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "jilo_murcha_de_verticilio",
        "nome": "Murcha-de-verticílio",
        "agente": "Verticillium dahliae",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Começa nas folhas mais velhas, que murcham e amarelam a partir da borda, numa lesão em forma de V com a ponta voltada para a nervura principal, e depois necrosam. A murcha fica mais evidente nas horas quentes. Ao cortar a haste ou o pecíolo, os vasos estão marrons ou pretos. Aparece em reboleiras; a planta raramente morre, mas cresce menos e dá menos frutos, e menores.",
        "sintomas": [
          {
            "id": "lesao_em_v_na_borda",
            "peso": 1
          },
          {
            "id": "murcha",
            "peso": 0.8
          },
          {
            "id": "vasos_escurecidos",
            "peso": 0.8
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "22 a 26 °C",
          "umidade": "Não é limitante: a umidade do solo boa para a planta também serve ao fungo",
          "observacao": "O fungo fica no solo por muitos anos como microescleródios, mesmo sem hospedeiro, e ataca também tomate, berinjela, batata, quiabo e plantas daninhas como beldroega, guanxuma, joá e maria-pretinha. Chega pela semente e pela muda, e se espalha por máquinas e água."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes sadias e plantio em área sem histórico de tomateiro e de outras hospedeiras."
          },
          {
            "tipo": "cultural",
            "descricao": "Destruir os restos culturais e controlar com rigor as plantas voluntárias e invasoras, dentro e perto da área."
          },
          {
            "tipo": "cultural",
            "descricao": "Rotação de culturas, principalmente com gramíneas, e adubação equilibrada."
          },
          {
            "tipo": "cultural",
            "descricao": "Não há cultivar resistente nem fungicida registrado para esta doença no jiló: o controle é só preventivo."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "jilo_murcha_bacteriana",
        "nome": "Murcha-bacteriana do jiló",
        "agente": "Ralstonia solanacearum",
        "tipoAgente": "bactéria",
        "gravidade": 3,
        "descricao": "A parte aérea murcha nas horas mais quentes do dia e recupera quando a temperatura cai. Às vezes a planta não murcha e só cresce menos. No colo, um corte no sentido do caule mostra os vasos escurecidos. Aparece em reboleiras. No jiló causa menos dano que no tomate e na batata, mas há relatos de lavouras destruídas no Norte e no Nordeste.",
        "sintomas": [
          {
            "id": "murcha",
            "peso": 1
          },
          {
            "id": "vasos_escurecidos",
            "peso": 0.8
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "28 a 30 °C",
          "umidade": "Alta umidade do solo",
          "observacao": "A bactéria sobrevive no solo por longos períodos e, instalada, é praticamente impossível de erradicar. Espalha-se com solo, enxurrada e implementos, e entra por ferimentos de nematoides e outras pragas de solo."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Mudas sadias e plantio longe de áreas cultivadas antes com hospedeiras da bactéria; cuidar da origem da água de irrigação."
          },
          {
            "tipo": "cultural",
            "descricao": "Em área infestada, solarizar o solo e fazer rotação com gramíneas por mais de dois anos, eliminando as plantas daninhas."
          },
          {
            "tipo": "cultural",
            "descricao": "Não há produto registrado para esta doença no jiló: a prevenção é a única medida."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "jilo_nematoide_das_galhas",
        "nome": "Nematoide-das-galhas",
        "agente": "Meloidogyne incognita e M. javanica",
        "tipoAgente": "nematoide",
        "gravidade": 4,
        "descricao": "As raízes ficam com galhas, inchaços alongados ou grandes e irregulares, que podem apodrecer pela entrada de outros fungos e bactérias. Com a raiz comprometida, a planta não leva água e nutrientes à parte aérea: murcha, amarela e mostra deficiências. No campo, aparece em reboleiras irregulares de plantas raquíticas.",
        "sintomas": [
          {
            "id": "galhas_na_raiz",
            "peso": 1
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.6
          },
          {
            "id": "murcha",
            "peso": 0.5
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Acima de 27 °C",
          "umidade": "Solos arenosos favorecem a multiplicação",
          "observacao": "Espalha-se pela água de irrigação contaminada, pelas mudas, pelos animais, pelas máquinas e pelas pessoas que circulam na lavoura. Daninhas como arrebenta-cavalo, caruru-de-espinho, maria-pretinha e melão-de-são-caetano mantêm o nematoide na área."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Escolher bem a área de plantio e produzir mudas sadias."
          },
          {
            "tipo": "cultural",
            "descricao": "Rotação com não hospedeiras, como amendoim, braquiárias e mamona; plantas antagonistas, como Crotalaria spectabilis, C. breviflora, cravo-de-defunto e mucunas."
          },
          {
            "tipo": "cultural",
            "descricao": "Revolver o solo de 15 a 20 dias antes do plantio para expor os nematoides ao sol; incorporar matéria orgânica e eliminar as daninhas hospedeiras."
          },
          {
            "tipo": "quimico",
            "descricao": "Nematicida registrado para o jiló, só como complemento ao manejo cultural."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Ciclobutrifluram",
            "grupo": "Carboxamida",
            "acao": "nematicida"
          }
        ]
      },
      {
        "id": "jilo_mancha_de_estenfilio",
        "nome": "Mancha-de-estenfílio",
        "agente": "Stemphylium solani",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Lesões necróticas, irregulares e pardas, de centro mais claro, em folhas velhas e novas; o centro pode se romper. Ataca da muda à planta adulta e reduz a área de folha. Dá prejuízo em anos muito chuvosos.",
        "sintomas": [
          {
            "id": "manchas_pequenas_centro_claro",
            "peso": 1
          },
          {
            "id": "furos_na_folha",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 27 °C",
          "umidade": "Alta umidade relativa",
          "observacao": "Sobrevive em restos culturais, plantas voluntárias e outras hospedeiras, inclusive daninhas como lobeira e joá-bravo. Espalha-se pela muda contaminada e pelo vento, e com água e calor cresce muito numa única noite."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação com espécies não hospedeiras e plantio longe de outras solanáceas."
          },
          {
            "tipo": "cultural",
            "descricao": "Destruir os restos culturais e eliminar as plantas daninhas perto da área."
          },
          {
            "tipo": "cultural",
            "descricao": "Evitar irrigações frequentes, principalmente por aspersão."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicida registrado para o alvo no jiló, em aplicação preventiva nos períodos chuvosos."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "pepino",
    "nome": "Pepino",
    "nomeCientifico": "Cucumis sativus",
    "grupo": "fruto",
    "familia": "Cucurbitaceae",
    "emoji": "🥒",
    "cicloDias": null,
    "doencas": [
      {
        "id": "pepino_mildio",
        "nome": "Míldio do pepino",
        "agente": "Pseudoperonospora cubensis",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Começa na face de cima da folha, como manchas amarelas e angulosas, limitadas pelas nervuras, que se multiplicam e tomam o limbo. Embaixo delas, na face inferior, aparece um mofo acinzentado a arroxeado nas horas úmidas. As manchas necrosam e a folhagem queima, com séria redução da produção.",
        "sintomas": [
          {
            "id": "manchas_angulares_entre_nervuras",
            "peso": 1
          },
          {
            "id": "mofo_arroxeado_face_inferior",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "16 a 22 °C",
          "umidade": "Alta, com orvalho, chuva ou irrigação por aspersão",
          "observacao": "Parasita obrigatório, que ataca muitas cucurbitáceas. Aparece nas épocas de temperatura mais amena e se espalha pelo vento e pelos respingos de chuva."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes e evitar plantar em locais e épocas de orvalho prolongado."
          },
          {
            "tipo": "cultural",
            "descricao": "Preferir irrigação localizada à aspersão."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de outras cucurbitáceas e eliminar os restos culturais depois da última colheita."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva e sistêmicos quando a doença se instala, com rodízio de grupo químico. Só produtos registrados para a cultura."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Metalaxil-M",
            "grupo": "Fenilamida",
            "acao": "sistêmico"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "pepino_oidio",
        "nome": "Oídio do pepino",
        "agente": "Podosphaera xanthii",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Pó branco e farináceo, formado pelo próprio fungo, aparece em manchas na folha e, ao se juntarem, cobre toda a área foliar. As folhas mais atacadas, a começar pelas mais velhas, secam das bordas para o centro. É a principal doença de parte aérea das cucurbitáceas.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.4
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Altas",
          "umidade": "Baixa: clima seco agrava a doença",
          "observacao": "Ao contrário do míldio, é mais severo em clima seco e quente. É mais frequente em abóboras, pepinos e melões do que em melancia. No pepino, é mais comum em cultivo protegido."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares resistentes, quando houver: é a forma mais econômica de controle."
          },
          {
            "tipo": "cultural",
            "descricao": "Não plantar ao lado de lavouras velhas de cucurbitáceas e eliminar os restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Começar nos primeiros sintomas, que surgem na face inferior da folha. Enxofre dá bons resultados; em condições muito favoráveis, triazóis sistêmicos são mais eficientes."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Tebuconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "pepino_antracnose",
        "nome": "Antracnose do pepino",
        "agente": "Colletotrichum orbiculare (sin. C. lagenarium)",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Começa nas folhas mais velhas, com lesões pequenas e encharcadas que necrosam e escurecem. No pepino o centro da lesão seca e se destaca, deixando a folha furada, e a lesão avança em ponta ao longo das nervuras. Em ataque severo a folhagem fica toda queimada. Nos frutos, hastes e pecíolos as lesões são circulares a alongadas, escuras e deprimidas, e no centro delas, em tempo úmido, aparece uma massa de esporos rosa-alaranjada. No fruto o sintoma pode surgir só depois da colheita.",
        "sintomas": [
          {
            "id": "lesoes_no_fruto",
            "peso": 1
          },
          {
            "id": "massa_rosada_na_lesao",
            "peso": 0.9
          },
          {
            "id": "furos_na_folha",
            "peso": 0.8
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.5
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "21 a 27 °C",
          "umidade": "Alta; bastam duas horas de folha molhada",
          "observacao": "O fungo sobrevive até dois anos em restos culturais, em cucurbitáceas silvestres e na semente, que é a principal forma de chegar a uma área nova. Espalha-se pelo respingo de chuva e de irrigação e pelos implementos."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Cultivares resistentes: Runner (tipo aodai) e os de conserva Colônia, Guaíra, Prêmio e Supremo."
          },
          {
            "tipo": "cultural",
            "descricao": "Sementes sadias; rotação de dois a três anos sem cucurbitáceas; destruição dos restos culturais e das cucurbitáceas silvestres."
          },
          {
            "tipo": "cultural",
            "descricao": "Irrigar sem molhar a folhagem e desinfestar equipamentos e máquinas."
          },
          {
            "tipo": "biologico",
            "descricao": "Trichoderma harzianum reduziu a severidade da doença em ensaio no pepino, mas ainda não há produto biológico registrado para antracnose em cucurbitáceas."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores ou sistêmicos registrados para o pepino, em aplicação preventiva."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Tiofanato-metílico",
            "grupo": "Benzimidazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          }
        ]
      },
      {
        "id": "pepino_mancha_angular",
        "nome": "Mancha-angular do pepino",
        "agente": "Pseudomonas syringae pv. lachrymans",
        "tipoAgente": "bactéria",
        "gravidade": 4,
        "descricao": "Nas folhas, manchas encharcadas e angulosas, limitadas pelas nervuras, que necrosam, ficam cinza e depois pardas e podem tomar grandes áreas de aspecto brilhante. Ataca também pecíolos, ramos e frutos: no fruto começa com pequenas manchas encharcadas que necrosam e, por dentro, chegam aos vasos e às sementes; depois o fruto apodrece por bactérias oportunistas. Não há cultivar resistente e o controle químico é pouco eficiente, por isso a prevenção é o que funciona.",
        "sintomas": [
          {
            "id": "manchas_angulares_entre_nervuras",
            "peso": 1
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.9
          },
          {
            "id": "lesoes_no_fruto",
            "peso": 0.6
          },
          {
            "id": "apodrecimento_mole_malcheiroso",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 28 °C",
          "umidade": "Alta: chuva frequente, orvalho e, em estufa, água condensada na folhagem",
          "observacao": "A bactéria chega às sementes do fruto atacado, e por isso o tratamento da semente faz parte do controle."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação de no mínimo dois anos sem cucurbitáceas."
          },
          {
            "tipo": "cultural",
            "descricao": "Tratar as sementes com ácido lático a 2% por 20 minutos."
          },
          {
            "tipo": "cultural",
            "descricao": "Em estufa, arejar e evitar excesso de água; manejar a irrigação e não exagerar no nitrogênio."
          },
          {
            "tipo": "quimico",
            "descricao": "Bactericidas com registro para a mancha-angular no pepino, de forma preventiva. Cobre fora da dose da bula causa fitotoxidez no pepino."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Casugamicina",
            "grupo": "Antibiótico agrícola",
            "acao": "bactericida"
          },
          {
            "nome": "Óxido cuproso",
            "grupo": "Cúprico",
            "acao": "protetor"
          }
        ]
      },
      {
        "id": "pepino_crestamento_gomoso",
        "nome": "Crestamento-gomoso do caule",
        "agente": "Didymella bryoniae",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "O sintoma mais típico é no caule e no colo: o tecido fica encharcado, racha e escorre uma goma parda, que passa a cinza e se cobre de pontinhos pretos, as frutificações do fungo. A lesão pode envolver o caule e matar a parte da planta acima dela. Nas folhas, manchas circulares pardas, de milímetros a centímetros, também com pontinhos pretos. No colo, o quadro se confunde com o de outros fungos, como Fusarium; a confirmação só vem em laboratório.",
        "sintomas": [
          {
            "id": "goma_no_caule",
            "peso": 1
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.8
          },
          {
            "id": "pontuacoes_pretas_na_lesao",
            "peso": 0.7
          },
          {
            "id": "murcha",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 24 °C, ótimo de crescimento do fungo",
          "umidade": "Alta; no pepino, a duração do molhamento de folhas e pecíolos pesa mais que a temperatura",
          "observacao": "Sobrevive em restos culturais, sementes e solo. A água espalha o inóculo a curta distância, e o vento, a longa. É mais grave em regiões úmidas e em estufa com água sobre os tecidos."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação com culturas de fora das cucurbitáceas e plantio longe de outras lavouras de cucurbitáceas."
          },
          {
            "tipo": "cultural",
            "descricao": "Sementes tratadas; evitar locais com excesso de umidade e, em estufa, controlar rigorosamente a água de irrigação."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas registrados para o alvo no pepino, em aplicação preventiva nos períodos úmidos."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Tiofanato-metílico",
            "grupo": "Benzimidazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          }
        ]
      },
      {
        "id": "pepino_mosaico",
        "nome": "Mosaico do pepino",
        "agente": "Potyvírus, sobretudo o PRSV-W (Papaya ringspot virus - tipo W), o ZYMV e o WMV, transmitidos por pulgões",
        "tipoAgente": "vírus",
        "gravidade": 4,
        "descricao": "Começa com amarelecimento entre as nervuras, seguido de mosaico de verde-claro e verde-escuro e deformação das folhas. A planta definha, e os frutos podem sair deformados e com a cor alterada. Não há cura para a planta infectada.",
        "sintomas": [
          {
            "id": "mosaico_verde_claro_escuro",
            "peso": 1
          },
          {
            "id": "nervuras_amareladas",
            "peso": 0.7
          },
          {
            "id": "folhas_deformadas",
            "peso": 0.7
          },
          {
            "id": "frutos_deformados",
            "peso": 0.6
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Ampla: acompanha a população de pulgões",
          "umidade": "Não é fator direto",
          "observacao": "Dezenas de espécies de pulgão transmitem o vírus de forma não persistente, e também passa por contato mecânico. O PRSV-W e o WMV não passam pela semente. É a principal virose das cucurbitáceas no Brasil, presente em lavouras de todos os estados levantados pela Embrapa entre 2008 e 2010."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar cultivares de pepino resistentes ao PRSV-W, que já existem no mercado; cobertura do solo com material repelente, de preferência associada a óleo mineral."
          },
          {
            "tipo": "cultural",
            "descricao": "Não há cura para a planta infectada. Não plantar ao lado de lavouras de cucurbitáceas em produção, abandonadas ou infectadas, e eliminar os restos culturais logo após a colheita."
          },
          {
            "tipo": "cultural",
            "descricao": "Escolher a época de plantio fora dos picos de pulgão e eliminar plantas invasoras que abrigam o vetor e o vírus."
          },
          {
            "tipo": "quimico",
            "descricao": "Inseticida contra pulgão tem efeito limitado: o vírus passa em picadas de segundos, antes de o inseto morrer. Não substitui as medidas culturais."
          }
        ],
        "ingredientesAtivos": []
      }
    ]
  },
  {
    "id": "pimentao",
    "nome": "Pimentão",
    "nomeCientifico": "Capsicum annuum",
    "grupo": "fruto",
    "familia": "Solanaceae",
    "emoji": "🫑",
    "cicloDias": 150,
    "doencas": [
      {
        "id": "pimentao_mancha_bacteriana",
        "nome": "Mancha-bacteriana do pimentão",
        "agente": "Xanthomonas euvesicatoria",
        "tipoAgente": "bactéria",
        "gravidade": 4,
        "descricao": "Manchas angulares de aspecto encharcado, com halo amarelo, que depois secam e ficam pardas. A desfolha expõe os frutos ao sol e causa escaldadura. No fruto surgem manchas ásperas e salientes, tipo verruga, que inviabilizam a venda mesmo em ataques leves.",
        "sintomas": [
          {
            "id": "manchas_angulares_halo_amarelo",
            "peso": 1
          },
          {
            "id": "manchas_salientes_fruto",
            "peso": 0.9
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.8
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.7
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 30 °C",
          "umidade": "Muito alta, com chuva ou irrigação por aspersão",
          "observacao": "Semente e muda contaminadas são a principal porta de entrada. Depois de instalada, a bactéria se espalha em horas pelos respingos de chuva e pelo manuseio das plantas molhadas - por isso a regra de nunca entrar na lavoura com a folhagem úmida."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes certificadas ou tratadas termicamente; mudas de viveiro idôneo."
          },
          {
            "tipo": "cultural",
            "descricao": "Não manusear nem pulverizar com as plantas molhadas."
          },
          {
            "tipo": "cultural",
            "descricao": "Rotação de dois anos com não solanáceas e eliminação dos restos culturais."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em programa preventivo, como complemento aos cúpricos."
          },
          {
            "tipo": "quimico",
            "descricao": "Cúpricos preventivos, geralmente associados a mancozebe. Não existe curativo para bacteriose: o que se faz é proteger o tecido sadio."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Hidróxido de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Casugamicina",
            "grupo": "Antibiótico agrícola",
            "acao": "bactericida"
          }
        ]
      },
      {
        "id": "pimentao_antracnose",
        "nome": "Antracnose do pimentão",
        "agente": "Colletotrichum spp.",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Ataca principalmente o fruto, sobretudo o maduro. A lesão é circular e deprimida, como se o fruto tivesse sido pressionado, e dentro dela aparecem pontinhos pretos dispostos em círculos concêntricos - as estruturas de frutificação do fungo. É a doença que mais compromete o produto na fase de colheita, porque a lesão só se revela quando o fruto já está formado.",
        "sintomas": [
          {
            "id": "lesoes_no_fruto",
            "peso": 1
          },
          {
            "id": "pontuacoes_pretas_na_lesao",
            "peso": 0.8
          },
          {
            "id": "queda_de_frutos",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "22 a 28 °C",
          "umidade": "Alta - molhamento do fruto por chuva ou aspersão",
          "observacao": "O fungo sobrevive em restos culturais e na semente. Chuva e irrigação por aspersão respingam o inóculo do solo para o fruto."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia; fazer rotação com espécies fora das solanáceas; eliminar restos culturais e frutos doentes da área; preferir irrigação localizada à aspersão; colher os frutos no ponto, sem deixar amadurecer demais na planta."
          },
          {
            "tipo": "biologico",
            "descricao": "Aplicações preventivas de Trichoderma spp. e de Bacillus subtilis reduzem o inóculo, com efeito melhor quando associadas ao manejo cultural."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva, desde o início da frutificação, com rodízio de grupo químico para evitar resistência."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "pimentao_oidio",
        "nome": "Oídio do pimentão",
        "agente": "Leveillula taurica",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas amareladas na face superior da folha e pó esbranquiçado na face inferior. A desfolha começa pelas folhas mais velhas e expõe os frutos ao sol, causando queima. Como o oídio do tomateiro, é a exceção entre os fungos foliares: prospera no tempo seco, e água livre na folha atrapalha a germinação do esporo.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.7
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.6
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 27 °C",
          "umidade": "Moderada a baixa - não exige molhamento foliar",
          "observacao": "Comum em cultivo protegido e em períodos secos. Ao contrário das demais doenças fúngicas desta base, molhar a folha não favorece o patógeno."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Melhorar a ventilação, sobretudo em estufa; evitar adubação nitrogenada em excesso, que deixa o tecido mais suscetível; eliminar folhas muito atacadas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva tem bom efeito, e é compatível com o cultivo protegido."
          },
          {
            "tipo": "quimico",
            "descricao": "Enxofre em aplicação preventiva, respeitando o limite de temperatura para não causar fitotoxidez; triazóis quando a doença já se instalou."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Tebuconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      }
    ]
  },
  {
    "id": "repolho",
    "nome": "Repolho",
    "nomeCientifico": "Brassica oleracea var. capitata",
    "grupo": "folha",
    "familia": "Brassicaceae",
    "emoji": "🥬",
    "cicloDias": 100,
    "doencas": [
      {
        "id": "repolho_podridao_negra",
        "nome": "Podridão-negra do repolho",
        "agente": "Xanthomonas campestris pv. campestris",
        "tipoAgente": "bactéria",
        "gravidade": 5,
        "descricao": "A lesão começa na borda da folha e avança para dentro em forma de V, amarela, com as nervuras escurecendo até ficarem pretas - a bactéria caminha pelos vasos. No repolho, o ataque às folhas externas compromete a formação da cabeça, que é o produto. É a doença mais destrutiva das brássicas e não tem controle curativo: tudo se decide na sanidade da semente e na rotação.",
        "sintomas": [
          {
            "id": "lesao_em_v_na_borda",
            "peso": 1
          },
          {
            "id": "nervuras_escurecidas",
            "peso": 0.9
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "murcha",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 30 °C",
          "umidade": "Alta - chuva com vento espalha a bactéria",
          "observacao": "A bactéria entra pelos hidatódios da borda da folha e por ferimentos. Trabalhar no canteiro com a folhagem molhada espalha o foco planta a planta."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou submetida a tratamento térmico; fazer rotação de dois a três anos com espécies fora das brássicas; não trabalhar no canteiro com as plantas molhadas; arrancar e retirar da área as plantas doentes; eliminar plantas daninhas da família."
          },
          {
            "tipo": "biologico",
            "descricao": "Não há produto biológico com eficácia comprovada contra esta bacteriose. O controle é preventivo."
          },
          {
            "tipo": "quimico",
            "descricao": "Não há produto registrado no MAPA para a podridão-negra em brássicas, e nenhum bactericida cura a planta já infectada. O cobre tem só efeito bacteriostático, de superfície, e já há relato de Xanthomonas resistente a ele. O controle é preventivo."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "repolho_alternariose",
        "nome": "Alternariose do repolho",
        "agente": "Alternaria brassicicola e A. brassicae",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas escuras e arredondadas com anéis concêntricos, como um alvo, que crescem e se juntam até secar a folha. No repolho, o ataque às folhas externas compromete a formação da cabeça, que é o produto. O fungo sobrevive na semente e em restos culturais, o que faz da semente sadia a primeira medida de controle.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 28 °C",
          "umidade": "Alta - exige molhamento foliar para infectar",
          "observacao": "Chuva frequente e irrigação por aspersão favorecem. Plantas mal nutridas adoecem mais."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou tratada; fazer rotação por dois anos com espécies fora das brássicas; eliminar restos culturais logo após a colheita; evitar irrigação por aspersão no fim da tarde."
          },
          {
            "tipo": "biologico",
            "descricao": "Trichoderma spp. aplicado ao solo reduz o inóculo dos restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva, com rodízio de grupo químico."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Iprodiona",
            "grupo": "Dicarboximida",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "repolho_hernia",
        "nome": "Hérnia das crucíferas do repolho",
        "agente": "Plasmodiophora brassicae",
        "tipoAgente": "protista",
        "gravidade": 5,
        "descricao": "A parte de cima da planta murcha nas horas quentes e se recupera à noite, cresce pouco e amarelece - e a causa não está na folha. Ao arrancar, as raízes aparecem engrossadas e deformadas, com galhas. No repolho, a raiz deformada não sustenta a formação da cabeça, que sai pequena ou não chega a fechar. O patógeno persiste no solo por até vinte anos, o que torna a área contaminada um problema de longo prazo.",
        "sintomas": [
          {
            "id": "galhas_na_raiz",
            "peso": 1
          },
          {
            "id": "murcha",
            "peso": 0.8
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.7
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "18 a 25 °C",
          "umidade": "Alta - solo úmido e mal drenado",
          "observacao": "Solo ácido, abaixo de pH 6,5, é o fator que mais favorece. A calagem elevando o pH é a medida de maior efeito, e é preventiva: não cura a planta já infectada."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Fazer calagem para elevar o pH do solo acima de 7,0; melhorar a drenagem; usar mudas produzidas em substrato sadio; não transitar com máquinas e implementos da área contaminada para a área limpa; rotação longa, de pelo menos sete anos, fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Resultados inconsistentes. Em couve-flor, Trichoderma harzianum não diferiu da testemunha em ensaio de campo. Não substitui a calagem."
          },
          {
            "tipo": "quimico",
            "descricao": "Ciazofamida tem registro para esta doença em brássicas: uma aplicação na bandeja de mudas e mais duas ou três no campo, de forma preventiva. Não elimina o patógeno do solo nem cura a planta já com galhas - a calagem e a rotação continuam sendo a base do manejo."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Ciazofamida",
            "grupo": "Cianoimidazol",
            "acao": "protetor"
          }
        ]
      }
    ]
  },
  {
    "id": "rucula",
    "nome": "Rúcula",
    "nomeCientifico": "Eruca vesicaria",
    "grupo": "folha",
    "familia": "Brassicaceae",
    "emoji": "🌿",
    "cicloDias": 40,
    "doencas": [
      {
        "id": "rucula_mildio",
        "nome": "Míldio da rúcula",
        "agente": "Hyaloperonospora brassicae",
        "tipoAgente": "oomiceto",
        "gravidade": 4,
        "descricao": "Manchas amareladas de contorno anguloso na face superior da folha e, embaixo delas, um mofo branco-acinzentado na face inferior - é o sinal que confirma o diagnóstico. Na rúcula, de ciclo muito curto e folha consumida crua, a margem para intervenção química é mínima e o manejo preventivo é quase tudo. Avança rápido em tempo fresco e úmido, e é a doença que mais aparece em plantio adensado.",
        "sintomas": [
          {
            "id": "manchas_amareladas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "10 a 20 °C",
          "umidade": "Alta - orvalho ou molhamento foliar prolongado",
          "observacao": "Noites frias com orvalho pela manhã são a condição clássica. Plantio adensado segura a umidade entre as folhas e prolonga o molhamento."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Ampliar o espaçamento para arejar a folhagem; irrigar de manhã, para a folha secar durante o dia; preferir irrigação localizada à aspersão; eliminar restos culturais; fazer rotação com espécies fora das brássicas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva, iniciada antes do período de maior umidade."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas específicos para oomicetos, em aplicação preventiva. Produto para fungo verdadeiro não tem efeito aqui."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Fosetil-alumínio",
            "grupo": "Fosfonato",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "rucula_alternariose",
        "nome": "Alternariose da rúcula",
        "agente": "Alternaria brassicae",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas escuras e arredondadas com anéis concêntricos, como um alvo, que crescem e se juntam até secar a folha. Na rúcula, de ciclo muito curto e folha consumida crua, a margem para intervenção química é mínima e o manejo preventivo é quase tudo. O fungo sobrevive na semente e em restos culturais, o que faz da semente sadia a primeira medida de controle.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.5
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 28 °C",
          "umidade": "Alta - exige molhamento foliar para infectar",
          "observacao": "Chuva frequente e irrigação por aspersão favorecem. Plantas mal nutridas adoecem mais."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar semente sadia ou tratada; fazer rotação por dois anos com espécies fora das brássicas; eliminar restos culturais logo após a colheita; evitar irrigação por aspersão no fim da tarde."
          },
          {
            "tipo": "biologico",
            "descricao": "Trichoderma spp. aplicado ao solo reduz o inóculo dos restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicação preventiva, com rodízio de grupo químico."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Iprodiona",
            "grupo": "Dicarboximida",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "rucula_oidio",
        "nome": "Oídio da rúcula",
        "agente": "Erysiphe cruciferarum",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Pó branco e farináceo sobre a folha, que se espalha até cobrir a superfície e reduzir a fotossíntese. Na rúcula, de ciclo muito curto e folha consumida crua, a margem para intervenção química é mínima e o manejo preventivo é quase tudo. Como os demais oídios, é a exceção entre os fungos foliares: prospera no tempo seco, e água livre na folha atrapalha a germinação do esporo.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.6
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "18 a 26 °C",
          "umidade": "Moderada a baixa - não exige molhamento foliar",
          "observacao": "Períodos secos com noites amenas favorecem. Cultivo protegido concentra o problema."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Melhorar a ventilação; evitar excesso de adubação nitrogenada; eliminar folhas muito atacadas; espaçar as plantas."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis em aplicação preventiva tem bom resultado nesta doença."
          },
          {
            "tipo": "quimico",
            "descricao": "Enxofre em aplicação preventiva, respeitando o limite de temperatura para não causar fitotoxidez."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Tebuconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      }
    ]
  },
  {
    "id": "tomate",
    "nome": "Tomate",
    "nomeCientifico": "Solanum lycopersicum",
    "grupo": "fruto",
    "familia": "Solanaceae",
    "emoji": "🍅",
    "cicloDias": 120,
    "doencas": [
      {
        "id": "tomate_mancha_bacteriana",
        "nome": "Mancha-bacteriana do tomateiro",
        "agente": "Xanthomonas spp.",
        "tipoAgente": "bactéria",
        "gravidade": 4,
        "descricao": "Manchas pequenas, angulares e encharcadas, com halo amarelo, que depois secam e ficam pardas. Sob alta umidade avançam rápido e provocam desfolha, expondo os frutos à escaldadura. No fruto surgem manchas ásperas e salientes, tipo verruga, que derrubam a classificação da caixa.",
        "sintomas": [
          {
            "id": "manchas_angulares_halo_amarelo",
            "peso": 1
          },
          {
            "id": "manchas_encharcadas",
            "peso": 0.8
          },
          {
            "id": "manchas_salientes_fruto",
            "peso": 0.8
          },
          {
            "id": "queda_precoce_folhas",
            "peso": 0.5
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 30 °C",
          "umidade": "Muito alta, com chuva ou irrigação por aspersão",
          "observacao": "Semente e muda contaminadas são a principal porta de entrada. Respingos de chuva e o manuseio das plantas molhadas espalham a bactéria pela lavoura em poucas horas."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes tratadas termicamente e mudas de viveiro idôneo."
          },
          {
            "tipo": "cultural",
            "descricao": "Não realizar desbrota, amarrio ou pulverização com as plantas molhadas."
          },
          {
            "tipo": "cultural",
            "descricao": "Rotação de dois anos com não solanáceas e eliminação dos restos culturais."
          },
          {
            "tipo": "biologico",
            "descricao": "Bacillus subtilis como complemento preventivo aos cúpricos."
          },
          {
            "tipo": "quimico",
            "descricao": "Cúpricos preventivos, em geral associados a mancozebe. Bacteriose não tem curativo: o que se faz é proteger o tecido ainda sadio."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Oxicloreto de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Hidróxido de cobre",
            "grupo": "Cúprico",
            "acao": "protetor"
          },
          {
            "nome": "Casugamicina",
            "grupo": "Antibiótico agrícola",
            "acao": "bactericida"
          }
        ]
      },
      {
        "id": "tomate_pinta_preta",
        "nome": "Pinta-preta (mancha-de-alternária)",
        "agente": "Alternaria solani",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Doença foliar muito comum no tomateiro. Começa pelas folhas mais velhas, próximas ao solo, e progride para cima. As lesões são escuras e apresentam anéis concêntricos característicos, que lembram um alvo. Em ataques severos causa desfolha intensa, expondo os frutos ao sol e reduzindo drasticamente a produtividade.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.8
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.4
          },
          {
            "id": "lesoes_no_fruto",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "24 a 29 °C",
          "umidade": "Alta, com molhamento foliar prolongado (acima de 8 h)",
          "observacao": "Alternância de períodos úmidos e secos favorece o ciclo. Comum em lavouras com adubação nitrogenada deficiente e plantas debilitadas após a frutificação."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação de culturas por no mínimo 2 anos, evitando solanáceas (batata, berinjela, pimentão)."
          },
          {
            "tipo": "cultural",
            "descricao": "Eliminar restos culturais e plantas voluntárias, que são fonte de inóculo."
          },
          {
            "tipo": "cultural",
            "descricao": "Irrigação por gotejamento em vez de aspersão, para reduzir o molhamento foliar."
          },
          {
            "tipo": "cultural",
            "descricao": "Manter nutrição equilibrada; plantas bem nutridas toleram melhor a doença."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em aplicações preventivas, alternando com sistêmicos para evitar resistência."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "tomate_requeima",
        "nome": "Requeima (míldio)",
        "agente": "Phytophthora infestans",
        "tipoAgente": "oomiceto",
        "gravidade": 5,
        "descricao": "A doença mais destrutiva do tomateiro. Em condições favoráveis pode destruir uma lavoura inteira em poucos dias. As lesões são grandes, de aspecto encharcado, com coloração verde-escura a marrom, e frequentemente apresentam um mofo branco acinzentado na face inferior da folha em manhãs úmidas.",
        "sintomas": [
          {
            "id": "manchas_encharcadas",
            "peso": 1
          },
          {
            "id": "mofo_branco_face_inferior",
            "peso": 0.9
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.6
          },
          {
            "id": "lesoes_no_fruto",
            "peso": 0.6
          },
          {
            "id": "murcha",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "12 a 20 °C (noites frias)",
          "umidade": "Muito alta, acima de 90%, com neblina ou chuvas frequentes",
          "observacao": "Época clássica: outono e inverno em regiões serranas. A combinação de noite fria e úmida com dia ameno é o cenário ideal para epidemia explosiva."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Usar mudas sadias e cultivares com resistência quando disponíveis."
          },
          {
            "tipo": "cultural",
            "descricao": "Aumentar espaçamento e melhorar a condução para ventilar o dossel."
          },
          {
            "tipo": "cultural",
            "descricao": "Eliminar e destruir plantas doentes imediatamente - não deixar no campo."
          },
          {
            "tipo": "quimico",
            "descricao": "Controle estritamente preventivo. O curativo raramente funciona: aplicar antes do período de risco climático."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Cimoxanil",
            "grupo": "Cianoacetamida-oxima",
            "acao": "sistêmico"
          },
          {
            "nome": "Metalaxil-M",
            "grupo": "Acilalaninato",
            "acao": "sistêmico"
          },
          {
            "nome": "Fluazinam",
            "grupo": "Fenilpiridinilamina",
            "acao": "protetor"
          }
        ]
      },
      {
        "id": "tomate_mofo_de_folha",
        "nome": "Mofo-de-folha (cladosporiose)",
        "agente": "Passalora fulva (Fulvia fulva)",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Manchas amarelas difusas, de contorno indefinido, na face superior da folha. Virando a folha, embaixo de cada mancha aparece um mofo aveludado verde-oliva a pardo - é esse contraste entre as duas faces que fecha o diagnóstico. Praticamente exclusiva de cultivo protegido.",
        "sintomas": [
          {
            "id": "mofo_oliva_face_inferior",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.9
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 25 °C",
          "umidade": "Acima de 85% - abaixo disso o fungo não esporula",
          "observacao": "Doença de estufa: em campo aberto raramente é problema. O gatilho é umidade relativa alta e constante, e ventilação noturna resolve mais que fungicida. Como o patógeno tem raças, cultivares com genes Cf perdem eficácia com o tempo."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Ventilar e desumidificar a estufa, sobretudo no fim da tarde e à noite."
          },
          {
            "tipo": "cultural",
            "descricao": "Aumentar espaçamento e fazer desbrota para abrir o dossel."
          },
          {
            "tipo": "cultural",
            "descricao": "Cultivares com genes de resistência Cf, alternando os disponíveis."
          },
          {
            "tipo": "quimico",
            "descricao": "Protetores preventivos, alternando grupos por causa da variabilidade de raças."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "tomate_septoriose",
        "nome": "Septoriose (mancha-de-septória)",
        "agente": "Septoria lycopersici",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Provoca grande número de manchas pequenas e circulares nas folhas, com centro acinzentado ou pálido e borda escura bem definida. Dentro do centro claro veem-se pontinhos pretos, os picnídios. É frequentemente confundida com a pinta-preta, mas as lesões são menores, muito mais numerosas e não apresentam anéis concêntricos.",
        "sintomas": [
          {
            "id": "manchas_pequenas_centro_claro",
            "peso": 1
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.7
          },
          {
            "id": "pontuacoes_pretas_na_lesao",
            "peso": 0.6
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 25 °C",
          "umidade": "Alta, com chuvas frequentes e respingos de solo",
          "observacao": "Dissemina-se principalmente por respingos de água da chuva ou de irrigação por aspersão, que levam esporos do solo para as folhas baixeiras."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Cobertura morta no solo para reduzir respingos."
          },
          {
            "tipo": "cultural",
            "descricao": "Rotação de culturas e eliminação de restos culturais."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas protetores em programa preventivo, iniciando antes do fechamento do dossel."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "tomate_mancha_alvo",
        "nome": "Mancha-alvo",
        "agente": "Corynespora cassiicola",
        "tipoAgente": "fungo",
        "gravidade": 4,
        "descricao": "Lesões com anéis concêntricos, muito parecidas com as da pinta-preta. As diferenças práticas: aqui as lesões são menores e mais numerosas, aparecem cedo também no terço médio e superior da planta, e o ataque ao fruto é bem mais agressivo. Na dúvida entre as duas, olhe o fruto e a altura das primeiras lesões.",
        "sintomas": [
          {
            "id": "manchas_escuras_aneis",
            "peso": 1
          },
          {
            "id": "lesoes_no_fruto",
            "peso": 0.7
          },
          {
            "id": "manchas_pequenas_centro_claro",
            "peso": 0.6
          },
          {
            "id": "lesoes_no_caule",
            "peso": 0.5
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.5
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "22 a 28 °C",
          "umidade": "Alta, com molhamento foliar prolongado",
          "observacao": "Vem ganhando importância em tomate de mesa e industrial. Já existem relatos de resistência a estrobilurinas, então repetir o mesmo grupo é receita para perder a ferramenta."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Rotação de culturas e destruição dos restos culturais."
          },
          {
            "tipo": "cultural",
            "descricao": "Condução e desbrota que arejem o dossel e encurtem o molhamento foliar."
          },
          {
            "tipo": "quimico",
            "descricao": "Protetores como base, associados a carboxamidas ou estrobilurinas, sempre alternando grupos."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Clorotalonil",
            "grupo": "Isoftalonitrila",
            "acao": "protetor"
          },
          {
            "nome": "Mancozebe",
            "grupo": "Ditiocarbamato",
            "acao": "protetor"
          },
          {
            "nome": "Boscalida",
            "grupo": "Carboxamida",
            "acao": "sistêmico"
          },
          {
            "nome": "Difenoconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          }
        ]
      },
      {
        "id": "tomate_acaro_rajado",
        "nome": "Ácaro-rajado",
        "agente": "Tetranychus urticae",
        "tipoAgente": "ácaro",
        "gravidade": 3,
        "descricao": "Não é doença: é praga. O ácaro raspa a face inferior da folha e o dano aparece na face superior como pontuações finas e claras, do tamanho de picadas de agulha. Com a população alta a folha bronzeia, aparece uma teia fina entre folhas e hastes, e a planta seca de baixo para cima.",
        "sintomas": [
          {
            "id": "pontuacoes_finas_cloroticas",
            "peso": 1
          },
          {
            "id": "acaros_face_inferior",
            "peso": 0.9
          },
          {
            "id": "teia_fina",
            "peso": 0.8
          },
          {
            "id": "bronzeamento_folha",
            "peso": 0.7
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "27 a 35 °C",
          "umidade": "Baixa, abaixo de 60% - quanto mais seco e quente, mais rápido o ciclo",
          "observacao": "Surtos clássicos aparecem logo depois de aplicações de piretroides ou de inseticidas de largo espectro, que matam os ácaros predadores e liberam a população. Poeira de carreador também favorece. Aqui, pulverizar errado é o que cria o problema."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Evitar poeira nos carreadores e manter a lavoura bem irrigada; planta com estresse hídrico agrava o ataque."
          },
          {
            "tipo": "cultural",
            "descricao": "Eliminar plantas daninhas hospedeiras nas bordaduras."
          },
          {
            "tipo": "biologico",
            "descricao": "Soltura de ácaros predadores (Neoseiulus californicus, Phytoseiulus persimilis) e uso de Beauveria bassiana."
          },
          {
            "tipo": "quimico",
            "descricao": "Acaricidas específicos, alternando grupos. Evitar piretroides de largo espectro, que agravam o surto ao eliminar os predadores."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Abamectina",
            "grupo": "Avermectina",
            "acao": "acaricida"
          },
          {
            "nome": "Espiromesifeno",
            "grupo": "Cetoenol",
            "acao": "acaricida"
          },
          {
            "nome": "Ciflumetofem",
            "grupo": "Benzoilacetonitrila",
            "acao": "acaricida"
          },
          {
            "nome": "Óleo mineral",
            "grupo": "Mineral",
            "acao": "acaricida de contato"
          }
        ]
      },
      {
        "id": "tomate_geminivirus",
        "nome": "Geminivirose (vírus do enrolamento amarelo)",
        "agente": "Begomovirus, transmitido pela mosca-branca (Bemisia tabaci)",
        "tipoAgente": "vírus",
        "gravidade": 5,
        "descricao": "Doença viral sem controle curativo. As folhas ficam reduzidas, enroladas para cima e amareladas entre as nervuras, e a planta apresenta forte nanismo. Plantas infectadas ainda jovens praticamente não produzem. O controle é feito exclusivamente sobre o inseto vetor, a mosca-branca.",
        "sintomas": [
          {
            "id": "folhas_deformadas",
            "peso": 1
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.9
          },
          {
            "id": "nervuras_amareladas",
            "peso": 0.8
          },
          {
            "id": "insetos_face_inferior",
            "peso": 0.8
          },
          {
            "id": "queda_de_frutos",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "25 a 32 °C",
          "umidade": "Baixa a moderada - clima seco e quente favorece a mosca-branca",
          "observacao": "Epidemias acompanham a população do vetor. Proximidade de lavouras de soja, feijão ou algodão em fim de ciclo aumenta muito o risco, porque a mosca-branca migra em massa quando aquela cultura seca."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Não há controle curativo. Arrancar e destruir as plantas infectadas para reduzir a fonte de vírus."
          },
          {
            "tipo": "cultural",
            "descricao": "Produção de mudas em ambiente protegido com tela antiafídeo."
          },
          {
            "tipo": "cultural",
            "descricao": "Vazio sanitário e evitar plantios escalonados próximos entre si."
          },
          {
            "tipo": "biologico",
            "descricao": "Preservar inimigos naturais da mosca-branca, como Encarsia formosa e fungos entomopatogênicos."
          },
          {
            "tipo": "quimico",
            "descricao": "Controle do vetor com inseticidas, alternando modos de ação para retardar a resistência."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Imidacloprido",
            "grupo": "Neonicotinoide",
            "acao": "inseticida sistêmico (vetor)"
          },
          {
            "nome": "Espiromesifeno",
            "grupo": "Cetoenol",
            "acao": "inseticida (vetor)"
          },
          {
            "nome": "Piriproxifem",
            "grupo": "Regulador de crescimento",
            "acao": "inseticida (vetor)"
          }
        ]
      },
      {
        "id": "tomate_mosaico",
        "nome": "Mosaico do tomateiro (ToMV)",
        "agente": "Tomato mosaic virus",
        "tipoAgente": "vírus",
        "gravidade": 4,
        "descricao": "Mosaico de verde claro e verde escuro nas folhas, muitas vezes acompanhado de folhas estreitas e filiformes, com aspecto de samambaia. Ao contrário da geminivirose, não tem inseto vetor: a transmissão é mecânica, pelas mãos e ferramentas de quem trabalha na lavoura, e por semente.",
        "sintomas": [
          {
            "id": "mosaico_verde_claro_escuro",
            "peso": 1
          },
          {
            "id": "folhas_filiformes",
            "peso": 0.7
          },
          {
            "id": "folhas_deformadas",
            "peso": 0.6
          },
          {
            "id": "crescimento_reduzido",
            "peso": 0.5
          },
          {
            "id": "lesoes_no_fruto",
            "peso": 0.3
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "Indiferente - o vírus não depende de clima",
          "umidade": "Indiferente",
          "observacao": "O vírus é extremamente estável: sobrevive meses em restos culturais secos e em fumo processado. Trabalhador que fuma e manuseia planta sem lavar as mãos é fonte documentada de contaminação. Como não há vetor, tudo se resolve com higiene e semente sadia."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Sementes sadias e cultivares com o gene de resistência Tm-2²."
          },
          {
            "tipo": "cultural",
            "descricao": "Lavar as mãos e desinfetar ferramentas entre plantas; leite desnatado ou fosfato trissódico inativam o vírus."
          },
          {
            "tipo": "cultural",
            "descricao": "Proibir o uso de fumo dentro da lavoura e do viveiro."
          },
          {
            "tipo": "cultural",
            "descricao": "Arrancar e destruir as plantas doentes, sem sacudir a folhagem das vizinhas."
          },
          {
            "tipo": "quimico",
            "descricao": "Não existe: nenhum defensivo age sobre vírus de planta. Qualquer produto vendido com essa promessa é fraude."
          }
        ],
        "ingredientesAtivos": []
      },
      {
        "id": "tomate_oidio",
        "nome": "Oídio do tomateiro",
        "agente": "Leveillula taurica (Oidiopsis taurica)",
        "tipoAgente": "fungo",
        "gravidade": 3,
        "descricao": "Caracteriza-se por manchas amareladas na face superior da folha e crescimento de um pó esbranquiçado, geralmente na face inferior. Diferente da maioria dos fungos foliares, o oídio se desenvolve bem em condições de baixa umidade relativa.",
        "sintomas": [
          {
            "id": "po_branco_superficie",
            "peso": 1
          },
          {
            "id": "manchas_amareladas",
            "peso": 0.7
          },
          {
            "id": "desfolha_baixo_para_cima",
            "peso": 0.4
          }
        ],
        "condicoesFavoraveis": {
          "temperatura": "20 a 27 °C",
          "umidade": "Moderada a baixa - não exige molhamento foliar",
          "observacao": "Comum em cultivo protegido e em períodos secos. É a exceção entre as doenças fúngicas: água livre na folha atrapalha a germinação dos esporos."
        },
        "tratamentos": [
          {
            "tipo": "cultural",
            "descricao": "Melhorar a ventilação, especialmente em estufas."
          },
          {
            "tipo": "biologico",
            "descricao": "Aplicações de Bacillus subtilis têm bom efeito preventivo."
          },
          {
            "tipo": "quimico",
            "descricao": "Fungicidas à base de enxofre ou triazóis em aplicações preventivas."
          }
        ],
        "ingredientesAtivos": [
          {
            "nome": "Enxofre",
            "grupo": "Inorgânico",
            "acao": "protetor"
          },
          {
            "nome": "Tebuconazol",
            "grupo": "Triazol",
            "acao": "sistêmico"
          },
          {
            "nome": "Azoxistrobina",
            "grupo": "Estrobilurina",
            "acao": "sistêmico"
          }
        ]
      }
    ]
  }
];

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

export const VERSAO_DA_BASE: string = "2026.09.03";

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
  }
];

export const CULTURAS: readonly Cultura[] = [
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

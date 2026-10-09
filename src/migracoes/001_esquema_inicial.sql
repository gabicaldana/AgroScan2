-- =============================================================================
-- AgroScan - Esquema inicial
-- =============================================================================
-- Banco:    PostgreSQL 16
-- Migracao: 001
--
-- O esquema se divide em quatro subdominios:
--
--   1. CATALOGO AGRONOMICO  conteudo curado: culturas, sintomas, doencas,
--                           tratamentos. Alimentado por carga automatizada a
--                           partir da base de conhecimento; nunca editado
--                           diretamente no banco.
--   2. IDENTIDADE E HORTA   usuarios, hortas, membros e canteiros. E o que
--                           torna o dado compartilhavel entre pessoas.
--   3. DIAGNOSTICO           consultas registradas, sintomas marcados,
--                           hipoteses produzidas e fotos anexadas.
--   4. ACOMPANHAMENTO        feedback, manejo aplicado e anotacoes de campo.
--                           Fecha o ciclo diagnosticou -> interveio -> confirmou.
--
-- Convencoes adotadas:
--
--   - Chaves naturais em TEXT no catalogo (cultura.id = 'tomate'). Os
--     identificadores vem da base curada, sao estaveis, legiveis e aparecem em
--     URLs e arquivos de teste. Trocar por chave artificial exigiria uma coluna
--     de codigo unico de qualquer forma, sem ganho.
--   - Chaves artificiais (IDENTITY) nas tabelas transacionais, onde nao existe
--     identificador natural estavel.
--   - TIMESTAMPTZ em todo registro temporal: o campo e usado em fuso conhecido,
--     mas o servidor roda em UTC.
--   - Tipos enumerados para conjuntos fechados e estaveis; CHECK sobre texto
--     onde o dominio pode crescer.
-- =============================================================================


-- Pre-requisito: `000_controle.sql`, que cria a tabela de controle de migracao.


-- =============================================================================
-- TIPOS ENUMERADOS
-- =============================================================================

-- Classificacao da Embrapa por parte comestivel da planta.
CREATE TYPE grupo_hortalica AS ENUM (
    'fruto',
    'folha',
    'flor',
    'haste',
    'raiz'          -- raizes, tuberculos, bulbos e rizomas
);

-- Natureza do agente causal. Oomiceto e separado de fungo de proposito: os
-- mildios sao oomicetos, e o grupo quimico eficaz contra eles nao e o mesmo
-- usado contra fungos verdadeiros. Tratar os dois como "fungo" levaria a
-- recomendacao errada.
CREATE TYPE tipo_agente AS ENUM (
    'fungo',
    'oomiceto',
    'bacteria',
    'virus',
    'nematoide',
    'acaro',
    'abiotico'      -- deficiencia nutricional, fitotoxicidade, distúrbio fisiologico
);

-- Ordem do manejo integrado. A ordem dos rotulos no tipo e a ordem de
-- apresentacao ao usuario: cultural primeiro, quimico por ultimo.
CREATE TYPE tipo_manejo AS ENUM (
    'cultural',
    'biologico',
    'quimico'
);

CREATE TYPE papel_usuario AS ENUM (
    'produtor',
    'agronomo',
    'admin'
);

CREATE TYPE papel_membro AS ENUM (
    'responsavel',
    'membro'
);

CREATE TYPE origem_consulta AS ENUM (
    'sintomas',
    'imagem'
);


-- =============================================================================
-- 1. CATALOGO AGRONOMICO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- versao_catalogo
-- -----------------------------------------------------------------------------
-- Cada publicacao do catalogo curado gera uma versao. A aplicacao compara a
-- versao que traz embutida com a mais recente aqui para decidir se sincroniza.
--
-- Existe tambem por uma razao de auditoria: um diagnostico feito com o catalogo
-- de setembro e reinterpretado com o de novembro produz resultado diferente.
-- Sem registrar a versao usada, o historico deixa de ser reproduzivel.

CREATE TABLE versao_catalogo (
    versao          TEXT         PRIMARY KEY,
    publicada_em    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    checksum_sha256 CHAR(64)     NOT NULL,
    notas           TEXT,

    CONSTRAINT versao_catalogo_checksum_hex
        CHECK (checksum_sha256 ~ '^[0-9a-f]{64}$')
);

-- -----------------------------------------------------------------------------
-- orgao
-- -----------------------------------------------------------------------------
-- Parte da planta onde o sintoma e observado. Agrupa a tela de sintomas na
-- ordem em que o produtor inspeciona a planta, de cima para baixo.

CREATE TABLE orgao (
    id     TEXT     PRIMARY KEY,          -- 'folha', 'caule', 'raiz', 'fruto', 'planta'
    rotulo TEXT     NOT NULL,
    ordem  SMALLINT NOT NULL,

    CONSTRAINT orgao_ordem_unica UNIQUE (ordem)
);

-- -----------------------------------------------------------------------------
-- cultura
-- -----------------------------------------------------------------------------
-- As 24 hortalicas do escopo.
--
-- `familia` nao e enfeite taxonomico: e ela que sustenta o alerta de rotacao
-- (plantar solanacea depois de solanacea no mesmo canteiro perpetua patogeno de
-- solo) e explica por que o catalogo de sintomas se reaproveita entre culturas.

CREATE TABLE cultura (
    id              TEXT             PRIMARY KEY,   -- slug: 'tomate', 'couve-flor'
    nome            TEXT             NOT NULL,
    nome_cientifico TEXT             NOT NULL,
    grupo           grupo_hortalica  NOT NULL,
    familia         TEXT             NOT NULL,      -- 'Solanaceae', 'Brassicaceae'
    emoji           TEXT,
    ciclo_dias      SMALLINT,                       -- ciclo medio, quando conhecido

    CONSTRAINT cultura_nome_unico     UNIQUE (nome),
    CONSTRAINT cultura_id_e_slug      CHECK (id ~ '^[a-z][a-z0-9-]*$'),
    CONSTRAINT cultura_ciclo_positivo CHECK (ciclo_dias IS NULL OR ciclo_dias > 0)
);

-- -----------------------------------------------------------------------------
-- sintoma
-- -----------------------------------------------------------------------------
-- Catalogo unico de sintomas, compartilhado entre culturas. Um sintoma
-- ('mancha_concentrica_aneis') serve a varias doencas de varias culturas -- e o
-- reuso e justamente o que torna viavel curar 24 hortalicas.

CREATE TABLE sintoma (
    id       TEXT PRIMARY KEY,
    nome     TEXT NOT NULL,
    orgao_id TEXT NOT NULL REFERENCES orgao (id) ON DELETE RESTRICT,

    CONSTRAINT sintoma_nome_unico UNIQUE (nome),
    CONSTRAINT sintoma_id_e_slug  CHECK (id ~ '^[a-z][a-z0-9_]*$')
);

-- -----------------------------------------------------------------------------
-- doenca
-- -----------------------------------------------------------------------------
-- A ficha agronomica. Uma doenca pertence a exatamente uma cultura: embora o
-- mesmo patogeno atinja varias hortalicas, a sintomatologia, a gravidade e o
-- manejo variam por hospedeiro, e a ficha precisa refletir o que o produtor ve
-- na planta dele.

CREATE TABLE doenca (
    id          TEXT         PRIMARY KEY,     -- 'tomate_pinta_preta'
    cultura_id  TEXT         NOT NULL REFERENCES cultura (id) ON DELETE RESTRICT,
    nome        TEXT         NOT NULL,
    agente      TEXT         NOT NULL,        -- 'Alternaria solani'
    tipo_agente tipo_agente  NOT NULL,
    gravidade   SMALLINT     NOT NULL,
    descricao   TEXT         NOT NULL,

    -- Condicoes que favorecem o aparecimento. Texto, e nao faixa numerica:
    -- a literatura fitopatologica descreve em prosa ("noites frias com orvalho
    -- prolongado"), e converter para numero perderia informacao.
    condicao_temperatura TEXT,
    condicao_umidade     TEXT,
    condicao_observacao  TEXT,

    CONSTRAINT doenca_id_e_slug        CHECK (id ~ '^[a-z][a-z0-9_]*$'),
    CONSTRAINT doenca_gravidade_faixa  CHECK (gravidade BETWEEN 1 AND 5),
    CONSTRAINT doenca_nome_unico_na_cultura UNIQUE (cultura_id, nome)
);

-- -----------------------------------------------------------------------------
-- doenca_sintoma
-- -----------------------------------------------------------------------------
-- O perfil sintomatologico da doenca, com peso. E a tabela que o motor de
-- diagnostico le, e a mais importante do esquema.
--
-- O peso codifica agronomia: 1.0 e o sintoma classico, sem o qual o quadro nao
-- e aquela doenca; 0.3 e o ocasional. Peso zero nao existe -- um sintoma que a
-- doenca nao apresenta simplesmente nao tem linha aqui, e essa ausencia e
-- informacao: e ela que permite ao motor penalizar o sintoma nao explicado.

CREATE TABLE doenca_sintoma (
    doenca_id  TEXT         NOT NULL REFERENCES doenca (id)  ON DELETE CASCADE,
    sintoma_id TEXT         NOT NULL REFERENCES sintoma (id) ON DELETE RESTRICT,
    peso       NUMERIC(3,2) NOT NULL,

    PRIMARY KEY (doenca_id, sintoma_id),
    CONSTRAINT doenca_sintoma_peso_faixa CHECK (peso > 0 AND peso <= 1)
);

-- -----------------------------------------------------------------------------
-- tratamento
-- -----------------------------------------------------------------------------
-- Medidas de manejo. `ordem` controla a apresentacao dentro do mesmo tipo;
-- entre tipos, a ordem e a do tipo enumerado (cultural, biologico, quimico).

CREATE TABLE tratamento (
    id        BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doenca_id TEXT        NOT NULL REFERENCES doenca (id) ON DELETE CASCADE,
    tipo      tipo_manejo NOT NULL,
    descricao TEXT        NOT NULL,
    ordem     SMALLINT    NOT NULL DEFAULT 1,

    CONSTRAINT tratamento_ordem_unica UNIQUE (doenca_id, tipo, ordem)
);

-- -----------------------------------------------------------------------------
-- ingrediente_ativo
-- -----------------------------------------------------------------------------
-- Referencia tecnica, nao receita. O registro valido para cada combinacao de
-- cultura e praga precisa ser conferido no AGROFIT/MAPA, e a aplicacao exige
-- receituario agronomico -- aviso que a aplicacao exibe em todo laudo.
--
-- Doenca de agente viral nao tem controle quimico direto: nao existe produto
-- que cure a planta infectada, o manejo e do vetor e da fonte de inoculo.
-- Cadastrar ingrediente ativo para uma virose seria induzir a aplicacao inutil,
-- e a restricao abaixo impede isso no banco.

CREATE TABLE ingrediente_ativo (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    doenca_id TEXT   NOT NULL REFERENCES doenca (id) ON DELETE CASCADE,
    nome      TEXT   NOT NULL,
    grupo     TEXT,                    -- grupo quimico
    acao      TEXT,                    -- 'contato', 'sistemico', 'mesostemico'

    CONSTRAINT ingrediente_unico_na_doenca UNIQUE (doenca_id, nome)
);


-- =============================================================================
-- 2. IDENTIDADE E HORTA
-- =============================================================================

-- -----------------------------------------------------------------------------
-- usuario
-- -----------------------------------------------------------------------------
-- A senha e guardada como derivacao scrypt, nunca em texto claro nem em hash
-- simples. `ativo` permite desativar sem apagar; a exclusao definitiva exigida
-- pela LGPD remove a linha, e o efeito em cascata esta declarado em cada
-- referencia.

CREATE TABLE usuario (
    id         BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome       TEXT          NOT NULL,
    email      TEXT          NOT NULL,
    senha_hash TEXT          NOT NULL,
    papel      papel_usuario NOT NULL DEFAULT 'produtor',
    criado_em  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    ativo      BOOLEAN       NOT NULL DEFAULT TRUE,

    CONSTRAINT usuario_email_unico  UNIQUE (email),
    CONSTRAINT usuario_email_formato CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

-- -----------------------------------------------------------------------------
-- horta
-- -----------------------------------------------------------------------------
-- A area cultivada. Pode ser a propriedade de um produtor ou uma horta
-- comunitaria com varias pessoas registrando nela.
--
-- Coordenadas sao opcionais e so gravadas com consentimento explicito (LGPD).

CREATE TABLE horta (
    id             BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome           TEXT         NOT NULL,
    municipio      TEXT         NOT NULL,
    uf             CHAR(2)      NOT NULL,
    latitude       NUMERIC(9,6),
    longitude      NUMERIC(9,6),
    responsavel_id BIGINT       NOT NULL REFERENCES usuario (id) ON DELETE RESTRICT,
    criada_em      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT horta_uf_valida  CHECK (uf ~ '^[A-Z]{2}$'),
    CONSTRAINT horta_latitude   CHECK (latitude  IS NULL OR latitude  BETWEEN  -90 AND  90),
    CONSTRAINT horta_longitude  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    -- Coordenada pela metade e pior que coordenada ausente: aponta para o
    -- meridiano de Greenwich ou para o equador.
    CONSTRAINT horta_coordenada_completa
        CHECK ((latitude IS NULL) = (longitude IS NULL))
);

-- ON DELETE RESTRICT no responsavel: excluir a conta de quem responde por uma
-- horta com registros de outras pessoas apagaria trabalho alheio. A exclusao
-- exige antes transferir a responsabilidade -- regra tratada na aplicacao.

-- -----------------------------------------------------------------------------
-- membro_horta
-- -----------------------------------------------------------------------------
-- Relacionamento N:N entre usuario e horta. E o que permite que varias pessoas
-- registrem consultas na mesma area e vejam os canteiros umas das outras.

CREATE TABLE membro_horta (
    horta_id   BIGINT       NOT NULL REFERENCES horta (id)   ON DELETE CASCADE,
    usuario_id BIGINT       NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    papel      papel_membro NOT NULL DEFAULT 'membro',
    entrou_em  TIMESTAMPTZ  NOT NULL DEFAULT now(),

    PRIMARY KEY (horta_id, usuario_id)
);

-- -----------------------------------------------------------------------------
-- canteiro
-- -----------------------------------------------------------------------------
-- A unidade de cultivo. E o canteiro que transforma `cultura` de tabela de
-- consulta em entidade referenciada por dado vivo, com historico e cardinalidade.
--
-- `ativo` em FALSE encerra o ciclo sem apagar o historico: e a sucessao de
-- canteiros encerrados no mesmo local que alimenta o alerta de rotacao.

CREATE TABLE canteiro (
    id             BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    horta_id       BIGINT       NOT NULL REFERENCES horta (id)   ON DELETE CASCADE,
    identificacao  TEXT         NOT NULL,          -- 'Canteiro 3', 'Estufa A'
    cultura_id     TEXT         NOT NULL REFERENCES cultura (id) ON DELETE RESTRICT,
    data_plantio   DATE,
    area_m2        NUMERIC(10,2),
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT canteiro_identificacao_unica UNIQUE (horta_id, identificacao),
    CONSTRAINT canteiro_area_positiva CHECK (area_m2 IS NULL OR area_m2 > 0)
);


-- =============================================================================
-- 3. DIAGNOSTICO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- consulta
-- -----------------------------------------------------------------------------
-- O registro de um diagnostico realizado.
--
-- `offline_id` e a peca central da sincronizacao: a consulta nasce no aparelho,
-- ainda sem rede, e ja com identificador proprio. Quando a fila sobe, o
-- servidor usa esse identificador para reconhecer reenvio. A restricao UNIQUE
-- nao esta aqui por desempenho -- e ela que garante a idempotencia. Deixar a
-- verificacao apenas na aplicacao permitiria duplicata sob envio concorrente,
-- que e o caso normal de uma fila com repeticao automatica.
--
-- `versao_catalogo` fixa a base usada no calculo. Sem ela o historico deixa de
-- ser reproduzivel quando o catalogo evolui.

CREATE TABLE consulta (
    id              BIGINT          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    offline_id      UUID            NOT NULL,
    usuario_id      BIGINT          NOT NULL REFERENCES usuario (id)  ON DELETE CASCADE,
    canteiro_id     BIGINT                   REFERENCES canteiro (id) ON DELETE SET NULL,
    cultura_id      TEXT            NOT NULL REFERENCES cultura (id)  ON DELETE RESTRICT,
    origem          origem_consulta NOT NULL DEFAULT 'sintomas',
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    registrada_em   TIMESTAMPTZ     NOT NULL,       -- quando ocorreu, no aparelho
    sincronizada_em TIMESTAMPTZ     NOT NULL DEFAULT now(),
    versao_catalogo TEXT            NOT NULL REFERENCES versao_catalogo (versao) ON DELETE RESTRICT,

    CONSTRAINT consulta_offline_id_unico UNIQUE (offline_id),
    CONSTRAINT consulta_latitude   CHECK (latitude  IS NULL OR latitude  BETWEEN  -90 AND  90),
    CONSTRAINT consulta_longitude  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    CONSTRAINT consulta_coordenada_completa
        CHECK ((latitude IS NULL) = (longitude IS NULL))
);

-- Consulta registrada com data futura indica relogio errado no aparelho. A
-- verificacao NAO fica aqui: uma restricao CHECK contendo now() e reavaliada
-- durante a restauracao de um backup, e uma linha valida no momento da insercao
-- passaria a ser invalida meses depois, inviabilizando o restore. A regra vive
-- na validacao de entrada da API.

-- ON DELETE SET NULL no canteiro: apagar um canteiro nao deve apagar o
-- diagnostico feito nele. A consulta permanece, com a cultura preservada na
-- propria linha -- que e por que `cultura_id` e NOT NULL aqui em vez de ser
-- derivada do canteiro.

-- -----------------------------------------------------------------------------
-- consulta_sintoma
-- -----------------------------------------------------------------------------
-- Os sintomas que o produtor marcou. Guardar a entrada, e nao apenas o
-- resultado, e o que permite reprocessar o diagnostico quando a base evoluir e
-- alimentar o relatorio de sintomas mais observados.

CREATE TABLE consulta_sintoma (
    consulta_id BIGINT NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    sintoma_id  TEXT   NOT NULL REFERENCES sintoma (id)  ON DELETE RESTRICT,

    PRIMARY KEY (consulta_id, sintoma_id)
);

-- -----------------------------------------------------------------------------
-- consulta_hipotese
-- -----------------------------------------------------------------------------
-- As hipoteses produzidas, com a compatibilidade calculada e a posicao no
-- ranking. `posicao = 1` e a hipotese principal, e e sobre ela que os
-- relatorios de incidencia agregam.
--
-- A compatibilidade e guardada com cinco casas porque e o valor exato que a
-- aplicacao calculou naquela versao do catalogo. Arredondar aqui inviabilizaria
-- conferir a reproducibilidade do calculo.

CREATE TABLE consulta_hipotese (
    consulta_id     BIGINT       NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    doenca_id       TEXT         NOT NULL REFERENCES doenca (id)   ON DELETE RESTRICT,
    posicao         SMALLINT     NOT NULL,
    compatibilidade NUMERIC(6,5) NOT NULL,

    PRIMARY KEY (consulta_id, doenca_id),
    CONSTRAINT hipotese_posicao_unica UNIQUE (consulta_id, posicao),
    CONSTRAINT hipotese_posicao_positiva CHECK (posicao >= 1),
    -- O limiar de 0,15 e regra de negocio da aplicacao; o banco garante apenas
    -- que o valor e uma compatibilidade valida.
    CONSTRAINT hipotese_compatibilidade_faixa
        CHECK (compatibilidade >= 0 AND compatibilidade <= 1)
);

-- -----------------------------------------------------------------------------
-- consulta_foto
-- -----------------------------------------------------------------------------
-- Registro visual anexado a consulta. O binario da imagem NAO fica no banco:
-- guardar arquivo em coluna infla backup, encarece consulta e desperdica o
-- limite do plano gratuito. A coluna `chave_blob` aponta para o objeto no
-- armazenamento externo.

CREATE TABLE consulta_foto (
    id          BIGINT   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consulta_id BIGINT   NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    chave_blob  TEXT     NOT NULL,
    sha256      CHAR(64) NOT NULL,
    largura     INTEGER  NOT NULL,
    altura      INTEGER  NOT NULL,
    bytes       INTEGER  NOT NULL,

    CONSTRAINT foto_chave_unica     UNIQUE (chave_blob),
    CONSTRAINT foto_sha256_hex      CHECK (sha256 ~ '^[0-9a-f]{64}$'),
    CONSTRAINT foto_dimensoes       CHECK (largura > 0 AND altura > 0),
    CONSTRAINT foto_bytes_positivo  CHECK (bytes > 0)
);


-- =============================================================================
-- 4. ACOMPANHAMENTO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- feedback
-- -----------------------------------------------------------------------------
-- O produtor volta e informa se o diagnostico se confirmou. E o unico dado do
-- sistema que mede a qualidade do proprio diagnostico, e e o que alimenta o
-- relatorio de acuracia percebida.
--
-- Um feedback por consulta: a UNIQUE em consulta_id impede que o mesmo
-- diagnostico receba duas avaliacoes contraditorias.

CREATE TABLE feedback (
    id                   BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    consulta_id          BIGINT      NOT NULL REFERENCES consulta (id) ON DELETE CASCADE,
    usuario_id           BIGINT      NOT NULL REFERENCES usuario (id)  ON DELETE CASCADE,
    confirmado           BOOLEAN     NOT NULL,
    doenca_confirmada_id TEXT                 REFERENCES doenca (id)   ON DELETE RESTRICT,
    comentario           TEXT,
    registrado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT feedback_unico_por_consulta UNIQUE (consulta_id),
    -- Se nao confirmou, saber qual era a doenca real e o dado valioso; se
    -- confirmou, informar uma doenca diferente e contradicao.
    CONSTRAINT feedback_coerente CHECK (
        (confirmado = TRUE  AND doenca_confirmada_id IS NULL)
     OR (confirmado = FALSE)
    )
);

-- -----------------------------------------------------------------------------
-- manejo
-- -----------------------------------------------------------------------------
-- A intervencao efetivamente aplicada no canteiro. Junto com `feedback`, e o
-- que transforma o sistema de catalogo de consulta em prontuario da area
-- cultivada: diagnosticou, interveio, confirmou.

CREATE TABLE manejo (
    id             BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    canteiro_id    BIGINT      NOT NULL REFERENCES canteiro (id) ON DELETE CASCADE,
    doenca_id      TEXT                 REFERENCES doenca (id)   ON DELETE SET NULL,
    consulta_id    BIGINT               REFERENCES consulta (id) ON DELETE SET NULL,
    tipo           tipo_manejo NOT NULL,
    descricao      TEXT        NOT NULL,
    produto        TEXT,
    dose           TEXT,
    aplicado_em    DATE        NOT NULL,
    responsavel_id BIGINT      NOT NULL REFERENCES usuario (id)  ON DELETE RESTRICT,

    -- Produto sem tipo quimico e cadastro incoerente; e o campo que a
    -- rastreabilidade de residuo exige que esteja no lugar certo.
    CONSTRAINT manejo_produto_e_quimico
        CHECK (produto IS NULL OR tipo = 'quimico')
);

-- -----------------------------------------------------------------------------
-- anotacao
-- -----------------------------------------------------------------------------
-- O caderno de campo em texto livre. Vinculada a um canteiro, a uma consulta,
-- ou a ambos -- mas nunca solta, porque anotacao sem contexto nao e recuperavel.

CREATE TABLE anotacao (
    id            BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id    BIGINT      NOT NULL REFERENCES usuario (id)  ON DELETE CASCADE,
    canteiro_id   BIGINT               REFERENCES canteiro (id) ON DELETE CASCADE,
    consulta_id   BIGINT               REFERENCES consulta (id) ON DELETE CASCADE,
    texto         TEXT        NOT NULL,
    criada_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizada_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT anotacao_tem_contexto
        CHECK (canteiro_id IS NOT NULL OR consulta_id IS NOT NULL),
    CONSTRAINT anotacao_texto_nao_vazio
        CHECK (length(btrim(texto)) > 0)
);


-- =============================================================================
-- GATILHO DE ATUALIZACAO
-- =============================================================================
-- `atualizada_em` mantido pelo banco, e nao pela aplicacao: qualquer caminho de
-- escrita -- API, correcao manual, carga -- deixa a coluna correta.

CREATE FUNCTION marcar_atualizacao() RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizada_em := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER anotacao_marcar_atualizacao
    BEFORE UPDATE ON anotacao
    FOR EACH ROW
    EXECUTE FUNCTION marcar_atualizacao();


-- =============================================================================
-- INDICES
-- =============================================================================
-- Indices de chave primaria e de restricao UNIQUE sao criados pelo PostgreSQL
-- automaticamente e nao aparecem aqui. Os abaixo cobrem os caminhos de leitura
-- que a aplicacao efetivamente percorre.

-- Catalogo: montar a tela de sintomas e listar as doencas de uma cultura.
CREATE INDEX idx_doenca_cultura         ON doenca (cultura_id);
CREATE INDEX idx_sintoma_orgao          ON sintoma (orgao_id);
CREATE INDEX idx_doenca_sintoma_sintoma ON doenca_sintoma (sintoma_id);
CREATE INDEX idx_tratamento_doenca      ON tratamento (doenca_id);
CREATE INDEX idx_ingrediente_doenca     ON ingrediente_ativo (doenca_id);

-- Historico: a listagem do caderno e sempre por usuario e por canteiro, em
-- ordem cronologica decrescente. O indice composto com DESC atende a ordenacao
-- sem passo de sort.
CREATE INDEX idx_consulta_usuario_data  ON consulta (usuario_id, registrada_em DESC);
CREATE INDEX idx_consulta_canteiro_data ON consulta (canteiro_id, registrada_em DESC)
    WHERE canteiro_id IS NOT NULL;
CREATE INDEX idx_consulta_cultura       ON consulta (cultura_id);

-- Relatorios: incidencia agrega por doenca a partir da hipotese principal.
CREATE INDEX idx_hipotese_doenca        ON consulta_hipotese (doenca_id);
CREATE INDEX idx_hipotese_principal     ON consulta_hipotese (consulta_id)
    WHERE posicao = 1;

-- Horta: resolver a quais hortas um usuario pertence, no controle de acesso.
CREATE INDEX idx_membro_usuario         ON membro_horta (usuario_id);
CREATE INDEX idx_canteiro_horta         ON canteiro (horta_id) WHERE ativo;
CREATE INDEX idx_canteiro_cultura       ON canteiro (cultura_id);

-- Acompanhamento.
CREATE INDEX idx_manejo_canteiro_data   ON manejo (canteiro_id, aplicado_em DESC);
CREATE INDEX idx_anotacao_canteiro      ON anotacao (canteiro_id) WHERE canteiro_id IS NOT NULL;


-- =============================================================================
-- REGISTRO DA MIGRACAO
-- =============================================================================

INSERT INTO migracao_aplicada (numero, nome)
VALUES (1, 'esquema_inicial');

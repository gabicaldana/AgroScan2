-- =============================================================================
-- AgroScan - Controle de migracao
-- =============================================================================
-- Banco:    PostgreSQL 16
-- Migracao: 000 (bootstrap)
--
-- Nao faz parte do modelo de dados da aplicacao. Registra quais migracoes ja
-- foram aplicadas, para que o runner nao reaplique nem pule nenhuma.
--
-- Fica separada da 001 de proposito: reverter o esquema da aplicacao nao deve
-- destruir o registro de quais migracoes passaram pelo banco.
-- =============================================================================

CREATE TABLE IF NOT EXISTS migracao_aplicada (
    numero      SMALLINT     PRIMARY KEY,
    nome        TEXT         NOT NULL,
    aplicada_em TIMESTAMPTZ  NOT NULL DEFAULT now()
);

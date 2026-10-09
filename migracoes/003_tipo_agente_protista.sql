-- =============================================================================
-- AgroScan - Migracao 003: protista como tipo de agente
-- =============================================================================
-- Banco:    PostgreSQL 16
--
-- A curadoria das brassicas trouxe a hernia das cruciferas, causada por
-- Plasmodiophora brassicae - um protista, que nao e fungo, nem oomiceto, nem
-- bacteria. O tipo da 001 nao o previa, e a carga do catalogo 2026.09.27
-- abortava inteira nessa doenca: o banco ficou no catalogo anterior, e toda
-- consulta gravada com a versao nova violava a chave estrangeira.
--
-- O valor novo NAO pode ser usado na mesma transacao que o cria. Por isso o
-- seed confirma as migracoes antes de carregar o catalogo.
--
-- Idempotente (IF NOT EXISTS): `--gerar-sql` reexecuta o DDL.
-- =============================================================================

ALTER TYPE tipo_agente ADD VALUE IF NOT EXISTS 'protista';

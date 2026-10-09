-- =============================================================================
-- AgroScan - Migracao 003: id de cultura aceita sublinhado
-- =============================================================================
-- Banco:    PostgreSQL 16
--
-- Na 001, o id de cultura aceitava so hifen ('couve-flor'), enquanto sintoma
-- e doenca aceitavam so sublinhado. A curadoria das brassicas cadastrou
-- `couve_flor`, no padrao dos outros ids da base, e a carga abortava nessa
-- linha. Renomear na base quebraria as consultas de couve-flor ja guardadas
-- na fila dos aparelhos; o banco passa a aceitar os dois separadores.
--
-- A validacao da base (`python -m app.validacao`) confere os ids contra estas
-- mesmas regras, para a divergencia aparecer no CI e nao na carga.
--
-- Idempotente: `--gerar-sql` reexecuta o DDL.
-- =============================================================================

ALTER TABLE cultura DROP CONSTRAINT IF EXISTS cultura_id_e_slug;
ALTER TABLE cultura
    ADD CONSTRAINT cultura_id_e_slug CHECK (id ~ '^[a-z][a-z0-9_-]*$');

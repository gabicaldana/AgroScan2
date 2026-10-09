-- =============================================================================
-- AgroScan - Migracao 002: manejo sobrevive a exclusao de quem o registrou
-- =============================================================================
-- Banco:    PostgreSQL 16
--
-- Na 001, `manejo.responsavel_id` era NOT NULL com ON DELETE RESTRICT. Isso
-- impedia de excluir a conta qualquer pessoa que tivesse registrado um manejo
-- -- inclusive na horta de outra pessoa. A LGPD garante ao titular a
-- eliminacao dos proprios dados, e um registro alheio nao pode servir de trava.
--
-- O manejo e historico do CANTEIRO, nao de quem o registrou: quem continua na
-- horta precisa saber o que foi aplicado ali, para a carencia e para a rotacao.
-- Por isso SET NULL, e nao CASCADE - o mesmo raciocinio de
-- `consulta.canteiro_id`. O registro fica, sem autor.
--
-- Idempotente: `python -m app.seed --gerar-sql` reexecuta o DDL inteiro.
-- =============================================================================

ALTER TABLE manejo ALTER COLUMN responsavel_id DROP NOT NULL;

ALTER TABLE manejo DROP CONSTRAINT IF EXISTS manejo_responsavel_id_fkey;
ALTER TABLE manejo
    ADD CONSTRAINT manejo_responsavel_id_fkey
    FOREIGN KEY (responsavel_id) REFERENCES usuario (id) ON DELETE SET NULL;

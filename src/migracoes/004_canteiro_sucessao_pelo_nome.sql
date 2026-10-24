-- =============================================================================
-- AgroScan - Migracao 004: a sucessao de canteiros se reconhece pelo nome
-- =============================================================================
-- Banco:    PostgreSQL 16
--
-- O ADR 0012 decidiu que canteiro nao muda de cultura: plantar outra coisa no
-- mesmo lugar e encerrar o canteiro e cadastrar outro. E essa sucessao, no
-- mesmo lugar, que alimenta o alerta de rotacao de familia (US30).
--
-- Mas a 001 declarou `UNIQUE (horta_id, identificacao)` sobre TODOS os
-- canteiros, inclusive os encerrados. O canteiro novo nao podia repetir o nome
-- do anterior, e a sucessao nunca era reconhecivel: a consulta do alerta, que
-- junta o canteiro ativo aos encerrados de mesma identificacao, nao encontrava
-- nada em banco nenhum. A conferencia do modelo-de-dados.md, secao 6, achou o
-- problema na Sprint 4.
--
-- A unicidade passa a valer so entre os canteiros ATIVOS: dois canteiros em
-- cultivo com o mesmo nome continuam recusados, e o nome volta a ficar livre
-- quando o ciclo encerra. Reativar um canteiro encerrado cujo nome ja foi
-- reaproveitado esbarra no indice, e a API responde 409.
--
-- Idempotente: `--gerar-sql` reexecuta o DDL.
-- =============================================================================

ALTER TABLE canteiro DROP CONSTRAINT IF EXISTS canteiro_identificacao_unica;

CREATE UNIQUE INDEX IF NOT EXISTS canteiro_identificacao_ativa
    ON canteiro (horta_id, identificacao)
    WHERE ativo;

-- O caminho de leitura do alerta: os ciclos anteriores do mesmo lugar, do
-- mais recente para o mais antigo. O id e a ordem da sucessao - o canteiro
-- novo so pode ser cadastrado depois de o anterior, de mesmo nome, encerrar.
CREATE INDEX IF NOT EXISTS idx_canteiro_sucessao
    ON canteiro (horta_id, identificacao, id DESC);

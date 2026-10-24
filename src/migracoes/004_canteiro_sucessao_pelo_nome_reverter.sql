-- Reverte a 004. Falha se houver dois canteiros com o mesmo nome na mesma
-- horta - e deve falhar: a alternativa seria renomear ciclos encerrados e
-- perder a sucessao que o alerta de rotacao le.

DROP INDEX IF EXISTS idx_canteiro_sucessao;
DROP INDEX IF EXISTS canteiro_identificacao_ativa;
ALTER TABLE canteiro
    ADD CONSTRAINT canteiro_identificacao_unica UNIQUE (horta_id, identificacao);

DELETE FROM migracao_aplicada WHERE numero = 4;

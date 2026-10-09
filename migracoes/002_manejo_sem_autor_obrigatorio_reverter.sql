-- Reverte a 002. Falha se houver manejo sem autor: nesse caso nao ha a quem
-- devolver a autoria, e a reversao precisa de decisao humana antes.

ALTER TABLE manejo DROP CONSTRAINT IF EXISTS manejo_responsavel_id_fkey;
ALTER TABLE manejo
    ADD CONSTRAINT manejo_responsavel_id_fkey
    FOREIGN KEY (responsavel_id) REFERENCES usuario (id) ON DELETE RESTRICT;

ALTER TABLE manejo ALTER COLUMN responsavel_id SET NOT NULL;

DELETE FROM migracao_aplicada WHERE numero = 2;

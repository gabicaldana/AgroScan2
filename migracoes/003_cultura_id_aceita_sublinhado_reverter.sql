-- Reverte a 003. Falha se houver cultura com sublinhado no id - e deve falhar:
-- a alternativa seria apagar a cultura e tudo o que a referencia.

ALTER TABLE cultura DROP CONSTRAINT IF EXISTS cultura_id_e_slug;
ALTER TABLE cultura
    ADD CONSTRAINT cultura_id_e_slug CHECK (id ~ '^[a-z][a-z0-9-]*$');

DELETE FROM migracao_aplicada WHERE numero = 3;

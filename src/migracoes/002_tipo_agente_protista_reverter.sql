-- Reverte a 002. O PostgreSQL nao remove valor de ENUM: a reversao exige
-- recriar o tipo, e so e segura se nenhuma doenca usar 'protista'. Falha de
-- proposito enquanto houver - apagar a hernia das cruciferas em silencio
-- seria pior que nao reverter.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM doenca WHERE tipo_agente = 'protista') THEN
        RAISE EXCEPTION 'ha doencas com tipo_agente protista; remova-as antes';
    END IF;
END $$;

ALTER TYPE tipo_agente RENAME TO tipo_agente_antigo;
CREATE TYPE tipo_agente AS ENUM (
    'fungo', 'oomiceto', 'bacteria', 'virus', 'nematoide', 'acaro', 'abiotico'
);
ALTER TABLE doenca
    ALTER COLUMN tipo_agente TYPE tipo_agente
    USING tipo_agente::text::tipo_agente;
DROP TYPE tipo_agente_antigo;

DELETE FROM migracao_aplicada WHERE numero = 2;

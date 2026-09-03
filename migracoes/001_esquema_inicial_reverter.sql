-- =============================================================================
-- AgroScan - Reversao da migracao 001
-- =============================================================================
-- A ordem e a inversa da criacao: primeiro as tabelas que referenciam outras,
-- depois as referenciadas, e por fim os tipos.
--
-- DROP TABLE sem CASCADE de proposito: se uma dependencia criada por migracao
-- posterior ainda existir, esta reversao deve falhar e nao apagar em silencio
-- algo que nao criou.
-- =============================================================================

DROP TRIGGER IF EXISTS anotacao_marcar_atualizacao ON anotacao;
DROP FUNCTION IF EXISTS marcar_atualizacao();

-- 4. Acompanhamento
DROP TABLE IF EXISTS anotacao;
DROP TABLE IF EXISTS manejo;
DROP TABLE IF EXISTS feedback;

-- 3. Diagnostico
DROP TABLE IF EXISTS consulta_foto;
DROP TABLE IF EXISTS consulta_hipotese;
DROP TABLE IF EXISTS consulta_sintoma;
DROP TABLE IF EXISTS consulta;

-- 2. Identidade e horta
DROP TABLE IF EXISTS canteiro;
DROP TABLE IF EXISTS membro_horta;
DROP TABLE IF EXISTS horta;
DROP TABLE IF EXISTS usuario;

-- 1. Catalogo agronomico
DROP TABLE IF EXISTS ingrediente_ativo;
DROP TABLE IF EXISTS tratamento;
DROP TABLE IF EXISTS doenca_sintoma;
DROP TABLE IF EXISTS doenca;
DROP TABLE IF EXISTS sintoma;
DROP TABLE IF EXISTS cultura;
DROP TABLE IF EXISTS orgao;
DROP TABLE IF EXISTS versao_catalogo;

-- Tipos enumerados
DROP TYPE IF EXISTS origem_consulta;
DROP TYPE IF EXISTS papel_membro;
DROP TYPE IF EXISTS papel_usuario;
DROP TYPE IF EXISTS tipo_manejo;
DROP TYPE IF EXISTS tipo_agente;
DROP TYPE IF EXISTS grupo_hortalica;

DELETE FROM migracao_aplicada WHERE numero = 1;

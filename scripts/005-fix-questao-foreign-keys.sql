-- Primeiro, vamos verificar se a tabela provas existe
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'provas') THEN
        -- Se existir, vamos renomear para prova
        ALTER TABLE provas RENAME TO prova;
    END IF;
END $$;

-- Agora vamos corrigir as foreign keys da tabela questao
ALTER TABLE questao
    DROP CONSTRAINT IF EXISTS questao_prova_id_fkey,
    DROP CONSTRAINT IF EXISTS questao_disciplina_id_fkey;

-- Recriar as foreign keys com os nomes corretos das tabelas e campos
ALTER TABLE questao
    ADD CONSTRAINT questao_prova_id_fkey 
    FOREIGN KEY (prova_id) 
    REFERENCES prova(id) 
    ON DELETE CASCADE;

ALTER TABLE questao
    ADD CONSTRAINT questao_disciplina_id_fkey 
    FOREIGN KEY (disciplina_id) 
    REFERENCES disciplina(id) 
    ON DELETE CASCADE;

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_questao_prova_id ON questao(prova_id);
CREATE INDEX IF NOT EXISTS idx_questao_disciplina_id ON questao(disciplina_id);

-- Verificar se a coluna prova_id existe na tabela questao
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'questao' 
        AND column_name = 'prova_id'
    ) THEN
        -- Se não existir, adicionar a coluna
        ALTER TABLE questao ADD COLUMN prova_id bigint;
    END IF;
END $$; 
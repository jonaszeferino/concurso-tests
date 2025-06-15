-- Adicionar coluna status na tabela questao
ALTER TABLE questao
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'revisao'));

-- Adicionar índice para melhorar performance de consultas por status
CREATE INDEX idx_questao_status ON questao(status);

-- Comentário na coluna
COMMENT ON COLUMN questao.status IS 'Status da questão: ativa, inativa ou em revisão'; 
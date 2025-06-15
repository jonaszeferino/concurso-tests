-- Corrigir a estrutura da tabela provas
DROP TABLE IF EXISTS public.prova;

CREATE TABLE IF NOT EXISTS public.provas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    concurso_id INTEGER REFERENCES concursos(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
    cargo_id INTEGER REFERENCES cargos(id) ON DELETE CASCADE,
    codigo_interno VARCHAR(50) NOT NULL,
    tipo_prova VARCHAR(50) DEFAULT 'objetiva' CHECK (tipo_prova IN ('objetiva', 'discursiva', 'pratica')),
    turno_data VARCHAR(100),
    versao VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_provas_concurso_id ON provas(concurso_id);
CREATE INDEX IF NOT EXISTS idx_provas_disciplina_id ON provas(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_provas_cargo_id ON provas(cargo_id);

-- Inserir dados de exemplo
INSERT INTO provas (titulo, concurso_id, disciplina_id, cargo_id, codigo_interno, tipo_prova, turno_data, versao) VALUES
('Prova de Conhecimentos Básicos', 1, 1, 1, 'INSS-TEC-2023', 'objetiva', 'Manhã - 26/03/2023', 'BRANCA'),
('Prova de Conhecimentos Específicos', 1, 2, 2, 'INSS-ANA-2023', 'objetiva', 'Tarde - 26/03/2023', 'BRANCA'),
('Prova de Matemática', 2, 3, 3, 'BB-ESC-2022', 'objetiva', 'Manhã - 16/10/2022', 'AZUL'),
('Prova de Português', 3, 4, 4, 'TJRS-ANA-2023', 'objetiva', 'Manhã - 18/02/2024', 'VERDE'),
('Prova de Direito', 3, 5, 5, 'TJRS-TEC-2023', 'objetiva', 'Tarde - 18/02/2024', 'VERDE'); 
-- Criação das tabelas para o sistema de concursos públicos

-- Tabela de Concursos
CREATE TABLE IF NOT EXISTS concursos (
    id SERIAL PRIMARY KEY,
    orgao VARCHAR(255) NOT NULL,
    ano INTEGER NOT NULL,
    edital VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'previsto',
    data_prova DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Bancas Examinadoras
CREATE TABLE IF NOT EXISTS bancas_examinadoras (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    site_oficial VARCHAR(255),
    estilo_prova VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Cargos
CREATE TABLE IF NOT EXISTS cargos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2),
    requisitos TEXT,
    lotacao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Provas
CREATE TABLE IF NOT EXISTS provas (
    id SERIAL PRIMARY KEY,
    concurso_id INTEGER REFERENCES concursos(id) ON DELETE CASCADE,
    cargo_id INTEGER REFERENCES cargos(id) ON DELETE CASCADE,
    codigo_interno VARCHAR(50) NOT NULL,
    tipo_prova VARCHAR(50) DEFAULT 'objetiva',
    turno_data VARCHAR(100),
    versao VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Disciplinas
CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    area_conhecimento VARCHAR(100) DEFAULT 'Geral',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Questões
CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    alternativas JSONB NOT NULL,
    resposta_correta INTEGER NOT NULL,
    comentario TEXT,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
    prova_id INTEGER REFERENCES provas(id) ON DELETE CASCADE,
    banca_id INTEGER REFERENCES bancas_examinadoras(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Gabaritos
CREATE TABLE IF NOT EXISTS gabaritos (
    id SERIAL PRIMARY KEY,
    prova_id INTEGER REFERENCES provas(id) ON DELETE CASCADE,
    respostas_corretas JSONB NOT NULL,
    formato_original VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_questoes_prova_id ON questoes(prova_id);
CREATE INDEX IF NOT EXISTS idx_questoes_disciplina_id ON questoes(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_provas_concurso_id ON provas(concurso_id);
CREATE INDEX IF NOT EXISTS idx_provas_cargo_id ON provas(cargo_id);

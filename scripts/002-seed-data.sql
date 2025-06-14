-- Dados iniciais para o sistema

-- Inserir Bancas Examinadoras
INSERT INTO bancas_examinadoras (nome, sigla, site_oficial, estilo_prova) VALUES
('Centro de Seleção e de Promoção de Eventos UnB', 'CESPE/Cebraspe', 'https://www.cebraspe.org.br', 'Certo/Errado e Múltipla Escolha'),
('Fundação Getulio Vargas', 'FGV', 'https://www.fgv.br', 'Múltipla Escolha'),
('Fundação para o Desenvolvimento de Recursos Humanos', 'Fundatec', 'https://www.fundatec.org.br', 'Múltipla Escolha'),
('Fundação Carlos Chagas', 'FCC', 'https://www.concursosfcc.com.br', 'Múltipla Escolha'),
('Instituto Brasileiro de Formação e Capacitação', 'IBFC', 'https://www.ibfc.org.br', 'Múltipla Escolha');

-- Inserir Disciplinas
INSERT INTO disciplinas (nome, area_conhecimento) VALUES
('Língua Portuguesa', 'Geral'),
('Matemática', 'Geral'),
('Raciocínio Lógico', 'Geral'),
('Informática', 'Geral'),
('Inglês', 'Geral'),
('Direito Constitucional', 'Específica'),
('Direito Administrativo', 'Específica'),
('Direito Civil', 'Específica'),
('Direito Processual Civil', 'Específica'),
('Direito Previdenciário', 'Específica'),
('Conhecimentos Bancários', 'Específica'),
('Contabilidade', 'Específica'),
('Economia', 'Específica'),
('Administração Pública', 'Específica'),
('Estatística', 'Específica');

-- Inserir Cargos
INSERT INTO cargos (nome, nivel, salario, requisitos, lotacao) VALUES
('Técnico do Seguro Social', 'Médio', 5281.00, 'Ensino Médio Completo', 'Nacional'),
('Analista do Seguro Social', 'Superior', 7356.00, 'Ensino Superior Completo', 'Nacional'),
('Escriturário', 'Médio', 3022.00, 'Ensino Médio Completo', 'Nacional'),
('Analista Judiciário', 'Superior', 12455.00, 'Ensino Superior em Direito', 'RS'),
('Técnico Judiciário', 'Médio', 7591.00, 'Ensino Médio Completo', 'RS'),
('Auditor Fiscal', 'Superior', 21029.00, 'Ensino Superior Completo', 'Nacional');

-- Inserir Concursos
INSERT INTO concursos (orgao, ano, edital, status, data_prova) VALUES
('Instituto Nacional do Seguro Social', 2023, 'EDITAL Nº 1/2023', 'encerrado', '2023-03-26'),
('Banco do Brasil S.A.', 2022, 'EDITAL Nº 1/2022', 'encerrado', '2022-10-16'),
('Tribunal de Justiça do Estado do Rio Grande do Sul', 2023, 'EDITAL Nº 1/2023', 'em andamento', '2024-02-18'),
('Receita Federal do Brasil', 2023, 'EDITAL Nº 1/2023', 'previsto', '2024-06-15');

-- Inserir Provas
INSERT INTO provas (concurso_id, cargo_id, codigo_interno, tipo_prova, turno_data, versao) VALUES
(1, 1, 'INSS-TEC-2023', 'objetiva', 'Manhã - 26/03/2023', 'BRANCA'),
(1, 2, 'INSS-ANA-2023', 'objetiva', 'Tarde - 26/03/2023', 'BRANCA'),
(2, 3, 'BB-ESC-2022', 'objetiva', 'Manhã - 16/10/2022', 'AZUL'),
(3, 4, 'TJRS-ANA-2023', 'objetiva', 'Manhã - 18/02/2024', 'VERDE'),
(3, 5, 'TJRS-TEC-2023', 'objetiva', 'Tarde - 18/02/2024', 'VERDE');

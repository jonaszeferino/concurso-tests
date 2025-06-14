-- Inserir questões de exemplo para testar o sistema

-- Questões de Português para INSS 2023
INSERT INTO questoes (numero, enunciado, alternativas, resposta_correta, comentario, disciplina_id, prova_id, banca_id) VALUES
(1, 'Assinale a alternativa que apresenta concordância verbal correta:', 
 '["Fazem dois anos que ele partiu.", "Faz dois anos que ele partiu.", "Fazem dois anos desde que ele partiu.", "Faz dois anos desde que ele partiu.", "Fazem dois anos quando ele partiu."]',
 1, 
 'O verbo "fazer" no sentido de tempo decorrido é impessoal, portanto fica sempre na 3ª pessoa do singular.',
 1, 1, 1),

(2, 'Indique a opção em que há erro de regência verbal:',
 '["Aspirou ao cargo de diretor.", "Assistiu ao filme ontem.", "Obedeceu aos pais.", "Pagou o funcionário.", "Perdoou ao amigo."]',
 3,
 'O verbo "pagar" quando se refere a pessoa é transitivo indireto, exigindo preposição: "Pagou ao funcionário".',
 1, 1, 1),

-- Questões de Matemática para INSS 2023  
(3, 'Se x + y = 10 e x - y = 4, qual o valor de x?',
 '["3", "5", "7", "9", "11"]',
 2,
 'Somando as duas equações: (x + y) + (x - y) = 10 + 4, logo 2x = 14, portanto x = 7.',
 2, 1, 1),

(4, 'Uma mercadoria custava R$ 80,00 e teve um aumento de 25%. Qual o novo preço?',
 '["R$ 95,00", "R$ 100,00", "R$ 105,00", "R$ 110,00", "R$ 120,00"]',
 1,
 'Aumento de 25% sobre R$ 80,00: 80 + (25% de 80) = 80 + 20 = R$ 100,00.',
 2, 1, 1),

-- Questões de Direito Constitucional para INSS 2023
(5, 'São direitos sociais previstos no art. 6º da Constituição Federal:',
 '["educação, saúde, alimentação, trabalho, moradia", "vida, liberdade, igualdade, segurança", "voto, elegibilidade, iniciativa popular", "propriedade, herança, sucessão", "nacionalidade, cidadania, domicílio"]',
 0,
 'O art. 6º da CF/88 estabelece como direitos sociais: educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, assistência aos desamparados.',
 6, 1, 1);

-- Questões para Banco do Brasil 2022
INSERT INTO questoes (numero, enunciado, alternativas, resposta_correta, comentario, disciplina_id, prova_id, banca_id) VALUES
(1, 'Em relação aos produtos bancários, é correto afirmar que:',
 '["CDB é um título de renda variável", "Poupança tem rentabilidade fixa", "Conta corrente não cobra tarifas", "Cartão de crédito é uma modalidade de empréstimo", "Todas as alternativas estão corretas"]',
 3,
 'O cartão de crédito funciona como uma modalidade de empréstimo rotativo, onde o banco disponibiliza um limite de crédito para o cliente.',
 11, 2, 2),

(2, 'The bank offers several services to its customers. Choose the correct translation:',
 '["O banco oferece vários serviços para seus clientes.", "O banco oferece alguns serviços para seus clientes.", "O banco oferece poucos serviços para seus clientes.", "O banco oferece todos serviços para seus clientes.", "O banco oferece nenhum serviço para seus clientes."]',
 0,
 '"Several" significa "vários" em português. A tradução correta é "O banco oferece vários serviços para seus clientes."',
 5, 2, 2);

-- Questões para TJ-RS 2023
INSERT INTO questoes (numero, enunciado, alternativas, resposta_correta, comentario, disciplina_id, prova_id, banca_id) VALUES
(1, 'Sobre o processo civil, é correto afirmar que:',
 '["A petição inicial deve conter apenas o pedido", "O réu tem 15 dias para contestar", "A sentença sempre encerra o processo", "O juiz pode indeferir a inicial por inépcia", "Não há possibilidade de recurso"]',
 3,
 'Conforme o CPC, o juiz pode indeferir a petição inicial quando ela for inepta, ou seja, quando não atender aos requisitos legais.',
 9, 3, 3),

(2, 'No direito civil, a capacidade civil plena é adquirida aos:',
 '["16 anos", "18 anos", "21 anos", "25 anos", "Não há idade específica"]',
 1,
 'Segundo o Código Civil brasileiro, a capacidade civil plena é adquirida aos 18 anos completos.',
 8, 3, 3);

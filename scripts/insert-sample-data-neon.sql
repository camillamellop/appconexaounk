-- Inserir dados de exemplo no banco Neon
-- Execute este script após criar a estrutura
-- Projeto ID: napi_9rnlvwm21b44xpscbut7u4vt96rrc5dmvkkdys53kwmpk228p25hv7b4aj1fftcr

-- Inserir usuários de exemplo
INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, telefone, instagram, bio, generos_musicais, localizacao, preco_show) VALUES
('Jack Silva', 'jack@example.com', '123456', 'dj', true, '(11) 99999-9999', '@jacksilva', 'DJ profissional especializado em house e techno', ARRAY['House', 'Techno', 'Progressive'], 'São Paulo, SP', 2500.00),
('Maria Santos', 'maria@example.com', '123456', 'produtor', true, '(11) 88888-8888', '@mariasantos', 'Produtora musical com foco em música eletrônica', ARRAY['Electronic', 'Ambient', 'Downtempo'], 'Rio de Janeiro, RJ', 3000.00),
('Carlos Oliveira', 'carlos@example.com', '123456', 'dj', true, '(11) 77777-7777', '@carlosoliveira', 'DJ de funk e hip hop', ARRAY['Funk', 'Hip Hop', 'Rap'], 'Belo Horizonte, MG', 1800.00),
('Ana Costa', 'ana@example.com', '123456', 'manager', true, '(11) 66666-6666', '@anacosta', 'Manager de artistas eletrônicos', ARRAY[], 'São Paulo, SP', 0),
('Admin User', 'admin@example.com', '123456', 'admin', true, '(11) 55555-5555', '@admin', 'Administrador do sistema', ARRAY[], 'São Paulo, SP', 0)
ON CONFLICT (email) DO NOTHING;

-- Inserir eventos na agenda
INSERT INTO agenda (usuario_id, titulo, descricao, data_inicio, data_fim, local, tipo, status, preco, contato_nome, contato_telefone, cor) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Show na Festa Eletrônica', 'Apresentação no festival de música eletrônica', '2024-02-15 22:00:00+00', '2024-02-16 04:00:00+00', 'Club XYZ - São Paulo', 'show', 'confirmado', 2500.00, 'João Promoter', '(11) 91234-5678', '#10B981'),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Reunião com Produtor', 'Discussão sobre novo EP', '2024-02-10 14:00:00+00', '2024-02-10 16:00:00+00', 'Estúdio ABC', 'reuniao', 'agendado', 0, 'Maria Santos', '(11) 88888-8888', '#3B82F6'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Sessão de Gravação', 'Gravação de nova faixa', '2024-02-12 10:00:00+00', '2024-02-12 18:00:00+00', 'Estúdio DEF', 'estudio', 'agendado', 800.00, 'Carlos Técnico', '(11) 92345-6789', '#8B5CF6'),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Show Funk Carioca', 'Apresentação em festa de rua', '2024-02-20 20:00:00+00', '2024-02-21 02:00:00+00', 'Quadra da Escola', 'show', 'confirmado', 1800.00, 'Pedro Organizador', '(21) 93456-7890', '#F59E0B');

-- Inserir tarefas
INSERT INTO tarefas (usuario_id, titulo, descricao, status, prioridade, data_vencimento, categoria, progresso) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Finalizar remix do track "Midnight"', 'Completar a mixagem e masterização', 'em_andamento', 'alta', '2024-02-08 23:59:59+00', 'Produção', 75),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Atualizar redes sociais', 'Postar conteúdo novo no Instagram e TikTok', 'pendente', 'media', '2024-02-05 18:00:00+00', 'Marketing', 0),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Comprar novos plugins VST', 'Adquirir Serum e Massive X', 'pendente', 'baixa', '2024-02-15 23:59:59+00', 'Equipamentos', 0),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Preparar setlist para show', 'Organizar músicas para apresentação', 'concluida', 'alta', '2024-02-01 12:00:00+00', 'Performance', 100),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Negociar contrato novo', 'Revisar termos com advogado', 'em_andamento', 'urgente', '2024-02-07 17:00:00+00', 'Negócios', 50);

-- Inserir documentos
INSERT INTO documentos (usuario_id, nome, tipo, categoria, url, descricao, tags) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Contrato Show Eletrônico', 'PDF', 'Contratos', '/docs/contrato-show-eletronico.pdf', 'Contrato para apresentação no festival', ARRAY['contrato', 'show', 'legal']),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Rider Técnico', 'PDF', 'Técnico', '/docs/rider-tecnico-jack.pdf', 'Especificações técnicas para shows', ARRAY['rider', 'tecnico', 'equipamentos']),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Portfolio Musical', 'PDF', 'Portfolio', '/docs/portfolio-maria.pdf', 'Portfólio com trabalhos realizados', ARRAY['portfolio', 'musicas', 'trabalhos']),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Certificado Curso Produção', 'PDF', 'Certificados', '/docs/certificado-producao.pdf', 'Certificado de curso de produção musical', ARRAY['certificado', 'curso', 'producao']),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Press Kit', 'PDF', 'Marketing', '/docs/press-kit-carlos.pdf', 'Material de divulgação', ARRAY['press-kit', 'marketing', 'divulgacao']);

-- Inserir transações financeiras
INSERT INTO transacoes (usuario_id, tipo, categoria, descricao, valor, data_transacao, metodo_pagamento) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'receita', 'Shows', 'Apresentação Club XYZ', 2500.00, '2024-01-15', 'PIX'),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'despesa', 'Equipamentos', 'Compra de fones Pioneer', 800.00, '2024-01-10', 'Cartão de Crédito'),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'despesa', 'Transporte', 'Uber para show', 45.00, '2024-01-15', 'Cartão de Débito'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'receita', 'Produção', 'Produção de track para cliente', 1200.00, '2024-01-20', 'Transferência'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'despesa', 'Software', 'Licença Ableton Live', 350.00, '2024-01-05', 'Cartão de Crédito'),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'receita', 'Shows', 'Show festa de rua', 1800.00, '2024-01-25', 'Dinheiro'),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'despesa', 'Marketing', 'Impulsionamento Instagram', 100.00, '2024-01-22', 'PIX');

-- Inserir gastos fixos
INSERT INTO gastos_fixos (usuario_id, nome, categoria, valor, dia_vencimento) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Aluguel Estúdio', 'Estúdio', 800.00, 5),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Spotify Premium', 'Streaming', 16.90, 15),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Internet Fibra', 'Utilidades', 89.90, 10),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Assinatura Splice', 'Software', 9.99, 20),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Seguro Equipamentos', 'Seguro', 120.00, 1),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Combustível', 'Transporte', 300.00, 25),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Celular', 'Comunicação', 79.90, 8);

-- Inserir metas financeiras
INSERT INTO metas_financeiras (usuario_id, titulo, descricao, valor_meta, valor_atual, data_inicio, data_fim, categoria, status) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Comprar Mesa Pioneer', 'Economizar para nova mesa de DJ', 8000.00, 3200.00, '2024-01-01', '2024-06-30', 'Equipamentos', 'ativa'),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Reserva de Emergência', 'Criar reserva para 6 meses', 15000.00, 4500.00, '2024-01-01', '2024-12-31', 'Reserva', 'ativa'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Estúdio Próprio', 'Montar estúdio em casa', 25000.00, 8000.00, '2024-01-01', '2024-12-31', 'Estúdio', 'ativa'),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Carro Novo', 'Trocar carro para shows', 45000.00, 12000.00, '2024-01-01', '2025-06-30', 'Transporte', 'ativa');

-- Inserir projetos
INSERT INTO projetos (usuario_id, nome, descricao, status, prioridade, data_inicio, data_fim, progresso, categoria) VALUES
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'EP "Midnight Sessions"', 'Produção de EP com 4 faixas', 'em_andamento', 'alta', '2024-01-15', '2024-03-15', 60, 'Produção Musical'),
((SELECT id FROM usuarios WHERE email = 'jack@example.com'), 'Tour Nacional 2024', 'Organizar turnê por 10 cidades', 'planejamento', 'media', '2024-03-01', '2024-08-31', 25, 'Shows'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Colaboração com Jack', 'Produzir track em parceria', 'em_andamento', 'alta', '2024-02-01', '2024-02-28', 40, 'Colaboração'),
((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 'Curso Online Produção', 'Criar curso de produção musical', 'planejamento', 'media', '2024-04-01', '2024-07-31', 10, 'Educação'),
((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 'Mixtape Funk 2024', 'Compilação de funks autorais', 'em_andamento', 'alta', '2024-01-20', '2024-03-20', 70, 'Produção Musical');

-- Verificar dados inseridos
SELECT 'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'agenda' as tabela, COUNT(*) as total FROM agenda
UNION ALL
SELECT 'tarefas' as tabela, COUNT(*) as total FROM tarefas
UNION ALL
SELECT 'documentos' as tabela, COUNT(*) as total FROM documentos
UNION ALL
SELECT 'transacoes' as tabela, COUNT(*) as total FROM transacoes
UNION ALL
SELECT 'gastos_fixos' as tabela, COUNT(*) as total FROM gastos_fixos
UNION ALL
SELECT 'metas_financeiras' as tabela, COUNT(*) as total FROM metas_financeiras
UNION ALL
SELECT 'projetos' as tabela, COUNT(*) as total FROM projetos
ORDER BY tabela;

-- Mensagem de sucesso
SELECT 'Dados de exemplo inseridos com sucesso! ✅' as status;

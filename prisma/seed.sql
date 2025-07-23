-- Inserir usuários de teste
INSERT INTO usuarios (nome, email, senha, ativo) VALUES
('Jack Silva', 'jack@unk.com', '123456', true),
('Maria Santos', 'maria@unk.com', '123456', true),
('Pedro Costa', 'pedro@unk.com', '123456', true),
('Ana Oliveira', 'ana@unk.com', '123456', true),
('Carlos Ferreira', 'carlos@unk.com', '123456', true);

-- Inserir projetos de exemplo
INSERT INTO projetos (nome, descricao, status, data_inicio, data_fim, usuario_id) VALUES
('Álbum Novo 2024', 'Produção do novo álbum com 12 faixas', 'ativo', '2024-01-01', '2024-06-30', 1),
('Tour Nacional', 'Turnê por 15 cidades brasileiras', 'ativo', '2024-03-01', '2024-08-31', 1),
('Colaboração DJ Mars', 'Remix colaborativo com DJ Mars', 'ativo', '2024-02-01', '2024-04-30', 1),
('EP Acústico', 'Versões acústicas dos maiores hits', 'planejamento', '2024-05-01', '2024-07-31', 1);

-- Inserir tarefas de exemplo
INSERT INTO tarefas (titulo, descricao, prioridade, status, data_vencimento, usuario_id, projeto_id) VALUES
('Finalizar mixagem da faixa 3', 'Ajustar graves e agudos da terceira música', 'alta', 'em_andamento', '2024-01-25', 1, 1),
('Contratar equipe de som', 'Buscar empresa de som para a turnê', 'alta', 'pendente', '2024-01-30', 1, 2),
('Gravar vocal principal', 'Sessão de gravação no estúdio XYZ', 'media', 'pendente', '2024-02-05', 1, 3),
('Criar arte do álbum', 'Desenvolver capa e material gráfico', 'media', 'pendente', '2024-02-15', 1, 1),
('Agendar ensaios', 'Marcar ensaios com a banda', 'baixa', 'pendente', '2024-02-20', 1, 2);

-- Inserir eventos na agenda
INSERT INTO agenda (titulo, descricao, data_evento, hora_inicio, hora_fim, local, tipo, status, usuario_id) VALUES
('Show no Clube do Rock', 'Apresentação solo com repertório novo', '2024-01-26', '22:00', '02:00', 'Clube do Rock - São Paulo', 'show', 'confirmado', 1),
('Sessão de Gravação', 'Gravação das vocais principais', '2024-01-27', '14:00', '18:00', 'Estúdio XYZ - Rio de Janeiro', 'gravacao', 'confirmado', 1),
('Reunião com Produtora', 'Discussão sobre o lançamento do álbum', '2024-01-28', '10:00', '12:00', 'Escritório da Produtora - São Paulo', 'reuniao', 'agendado', 1),
('Festival de Verão', 'Participação no maior festival do país', '2024-02-15', '20:00', '21:30', 'Parque Ibirapuera - São Paulo', 'festival', 'confirmado', 1);

-- Inserir transações financeiras
INSERT INTO transacoes (descricao, valor, tipo, categoria, data, usuario_id) VALUES
('Cachê Show Clube do Rock', 5000.00, 'receita', 'shows', '2024-01-20', 1),
('Aluguel Estúdio', 800.00, 'despesa', 'producao', '2024-01-15', 1),
('Venda de Merchandising', 1200.00, 'receita', 'produtos', '2024-01-18', 1),
('Equipamento de Som', 2500.00, 'despesa', 'equipamentos', '2024-01-10', 1),
('Streaming Royalties', 350.00, 'receita', 'royalties', '2024-01-22', 1);

-- Inserir gastos fixos
INSERT INTO gastos_fixos (descricao, valor, categoria, dia_vencimento, ativo, usuario_id) VALUES
('Aluguel do Estúdio', 1500.00, 'infraestrutura', 5, true, 1),
('Plano de Internet', 120.00, 'servicos', 10, true, 1),
('Seguro dos Equipamentos', 300.00, 'seguros', 15, true, 1),
('Assinatura Spotify for Artists', 50.00, 'marketing', 20, true, 1);

-- Inserir metas financeiras
INSERT INTO metas_financeiras (nome, valor_meta, valor_atual, data_inicio, data_fim, status, usuario_id) VALUES
('Comprar Nova Mesa de Som', 15000.00, 3500.00, '2024-01-01', '2024-06-30', 'ativa', 1),
('Reserva de Emergência', 20000.00, 8000.00, '2024-01-01', '2024-12-31', 'ativa', 1),
('Investir em Marketing Digital', 5000.00, 1200.00, '2024-02-01', '2024-05-31', 'ativa', 1);

-- Inserir documentos
INSERT INTO documentos (nome, tipo, url, conteudo, usuario_id, projeto_id) VALUES
('Contrato Clube do Rock', 'contrato', NULL, 'Contrato de apresentação musical...', 1, NULL),
('Letra - Faixa 3', 'letra', NULL, 'Verso 1: Na batida do coração...', 1, 1),
('Rider Técnico', 'tecnico', NULL, 'Especificações técnicas para shows...', 1, 2),
('Orçamento Estúdio', 'orcamento', NULL, 'Valores para gravação do EP...', 1, 4);

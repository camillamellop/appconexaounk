-- Insert sample financial data for Jack (usuario_id = 1)
-- This script can be run multiple times safely

-- Clear existing data for Jack to avoid duplicates
DELETE FROM public.transacoes WHERE usuario_id = 1;
DELETE FROM public.gastos_fixos WHERE usuario_id = 1;
DELETE FROM public.metas_financeiras WHERE usuario_id = 1;
DELETE FROM public.projetos WHERE usuario_id = 1;

-- Insert sample transactions (receitas e despesas)
INSERT INTO public.transacoes (usuario_id, tipo, categoria, descricao, valor, data_transacao) VALUES
-- Receitas
(1, 'receita', 'Shows', 'Show no Club XYZ', 2500.00, '2025-01-15'),
(1, 'receita', 'Shows', 'Festa privada - Aniversário', 1800.00, '2025-01-10'),
(1, 'receita', 'Shows', 'Show corporativo', 3200.00, '2025-01-05'),
(1, 'receita', 'Shows', 'Festival de verão', 2500.00, '2024-12-28'),
(1, 'receita', 'Produção', 'Remix para artista X', 800.00, '2025-01-12'),
(1, 'receita', 'Aulas', 'Aulas de DJ - Janeiro', 600.00, '2025-01-01'),
(1, 'receita', 'Streaming', 'Royalties Spotify/Apple', 150.00, '2025-01-01'),

-- Despesas
(1, 'despesa', 'Equipamentos', 'Cabo XLR novo', 89.00, '2025-01-14'),
(1, 'despesa', 'Equipamentos', 'Fones de ouvido backup', 380.00, '2025-01-08'),
(1, 'despesa', 'Software', 'Serato DJ Pro - licença anual', 189.00, '2025-01-01'),
(1, 'despesa', 'Marketing', 'Impulsionamento Instagram', 100.00, '2025-01-10'),
(1, 'despesa', 'Transporte', 'Uber para shows', 120.00, '2025-01-15'),
(1, 'despesa', 'Alimentação', 'Refeições durante shows', 200.00, '2025-01-15'),
(1, 'despesa', 'Outros', 'Manutenção equipamentos', 200.00, '2025-01-05');

-- Insert fixed expenses (gastos mensais)
INSERT INTO public.gastos_fixos (usuario_id, nome, categoria, valor, dia_vencimento) VALUES
(1, 'Aluguel do estúdio', 'Moradia', 800.00, 5),
(1, 'Spotify Premium', 'Entretenimento', 19.90, 15),
(1, 'Adobe Creative Suite', 'Software', 89.00, 10),
(1, 'Internet fibra', 'Utilidades', 99.90, 20),
(1, 'Seguro equipamentos', 'Seguros', 150.00, 25),
(1, 'Plano celular', 'Comunicação', 79.90, 8),
(1, 'Academia', 'Saúde', 89.90, 12),
(1, 'Streaming services', 'Entretenimento', 45.00, 18);

-- Insert financial goals
INSERT INTO public.metas_financeiras (usuario_id, nome, descricao, valor_objetivo, valor_atual, data_limite, status) VALUES
(1, 'Mesa Pioneer DDJ-FLX10', 'Nova mesa de DJ profissional para shows', 8500.00, 3200.00, '2025-06-01', 'ativa'),
(1, 'Reserva de emergência', 'Fundo para 6 meses de gastos', 15000.00, 5800.00, '2025-12-31', 'ativa'),
(1, 'Tour nacional', 'Recursos para turnê em 10 cidades', 25000.00, 8500.00, '2025-08-01', 'ativa'),
(1, 'Estúdio próprio', 'Equipar estúdio de produção completo', 35000.00, 12000.00, '2026-03-01', 'ativa'),
(1, 'Curso de produção', 'Especialização em produção musical', 2500.00, 2500.00, '2024-12-01', 'concluida');

-- Insert projects
INSERT INTO public.projetos (usuario_id, nome, descricao, status, prioridade, progresso, data_inicio, data_fim) VALUES
(1, 'Finalizar remix do Track A', 'Remix para artista internacional - deadline apertado', 'em_andamento', 'urgente', 75, '2025-01-10', '2025-01-25'),
(1, 'Campanha redes sociais', 'Estratégia de marketing para próximo EP', 'em_andamento', 'alta', 40, '2025-01-05', '2025-02-15'),
(1, 'Comprar cabo XLR', 'Substituir cabo defeituoso para shows', 'planejamento', 'media', 0, '2025-01-20', '2025-01-22'),
(1, 'EP "Midnight Vibes"', 'Produção de 5 faixas autorais', 'em_andamento', 'alta', 60, '2024-12-01', '2025-03-01'),
(1, 'Setup novo estúdio', 'Organizar e otimizar espaço de trabalho', 'em_andamento', 'media', 30, '2025-01-01', '2025-02-01'),
(1, 'Canal YouTube', 'Criar conteúdo educativo sobre DJing', 'planejamento', 'baixa', 10, '2025-02-01', '2025-06-01');

-- Verify data insertion
SELECT 'TRANSAÇÕES:' as tipo, COUNT(*) as total FROM public.transacoes WHERE usuario_id = 1
UNION ALL
SELECT 'GASTOS FIXOS:', COUNT(*) FROM public.gastos_fixos WHERE usuario_id = 1
UNION ALL
SELECT 'METAS FINANCEIRAS:', COUNT(*) FROM public.metas_financeiras WHERE usuario_id = 1
UNION ALL
SELECT 'PROJETOS:', COUNT(*) FROM public.projetos WHERE usuario_id = 1;

-- Show financial summary
SELECT 
    'RECEITAS' as tipo,
    COALESCE(SUM(valor), 0) as total
FROM public.transacoes 
WHERE usuario_id = 1 AND tipo = 'receita'
UNION ALL
SELECT 
    'DESPESAS',
    COALESCE(SUM(valor), 0)
FROM public.transacoes 
WHERE usuario_id = 1 AND tipo = 'despesa'
UNION ALL
SELECT 
    'SALDO',
    COALESCE(
        (SELECT SUM(valor) FROM public.transacoes WHERE usuario_id = 1 AND tipo = 'receita') -
        (SELECT SUM(valor) FROM public.transacoes WHERE usuario_id = 1 AND tipo = 'despesa'),
        0
    );

-- Show projects summary
SELECT 
    status,
    COUNT(*) as quantidade,
    ROUND(AVG(progresso), 1) as progresso_medio
FROM public.projetos 
WHERE usuario_id = 1 
GROUP BY status
ORDER BY status;

SELECT 'Sample financial data inserted successfully for Jack!' as status;

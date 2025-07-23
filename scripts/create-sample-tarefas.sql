-- Criar tabela de tarefas se não existir
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    prioridade VARCHAR(20) DEFAULT 'media',
    status VARCHAR(50) DEFAULT 'pendente',
    data_vencimento DATE,
    data_conclusao DATE,
    tempo_estimado INTEGER, -- em minutos
    tempo_gasto INTEGER, -- em minutos
    valor_associado DECIMAL(10,2),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Limpar dados existentes
DELETE FROM tarefas;

-- Inserir tarefas de exemplo para cada usuário
INSERT INTO tarefas (
    usuario_id,
    titulo,
    descricao,
    categoria,
    prioridade,
    status,
    data_vencimento,
    data_conclusao,
    tempo_estimado,
    tempo_gasto,
    valor_associado,
    observacoes
) VALUES 
-- Tarefas para Camilla (Admin)
(
    (SELECT id FROM usuarios WHERE email = 'camilla@conexaounk.com' LIMIT 1),
    'Revisar contratos dos DJs',
    'Analisar e atualizar contratos de todos os DJs para 2024',
    'Administrativo',
    'alta',
    'em_andamento',
    '2024-01-26',
    NULL,
    180,
    90,
    0.00,
    'Focar nos termos de pagamento e exclusividade'
),
(
    (SELECT id FROM usuarios WHERE email = 'camilla@conexaounk.com' LIMIT 1),
    'Relatório mensal de performance',
    'Compilar dados de performance de todos os DJs do mês',
    'Relatórios',
    'alta',
    'pendente',
    '2024-01-31',
    NULL,
    120,
    0,
    0.00,
    'Incluir métricas de satisfação do cliente'
),
(
    (SELECT id FROM usuarios WHERE email = 'camilla@conexaounk.com' LIMIT 1),
    'Negociar parceria com novo fornecedor',
    'Avaliar proposta de equipamentos de som da empresa SoundTech',
    'Negócios',
    'media',
    'pendente',
    '2024-02-05',
    NULL,
    90,
    0,
    15000.00,
    'Solicitar demonstração dos equipamentos'
),

-- Tarefas para Suzy (DJ)
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Preparar playlist para casamento Marina & João',
    'Criar playlist personalizada com músicas solicitadas pelos noivos',
    'Preparação',
    'alta',
    'concluida',
    '2024-01-25',
    '2024-01-24',
    120,
    135,
    0.00,
    'Playlist aprovada pelos noivos. Backup criado.'
),
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Testar equipamentos para Tech Summit',
    'Verificar funcionamento de todos os equipamentos para o evento',
    'Técnico',
    'alta',
    'pendente',
    '2024-02-02',
    NULL,
    60,
    0,
    0.00,
    'Levar equipamentos reserva'
),
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Atualizar repertório de música eletrônica',
    'Adicionar novas faixas de house e techno ao repertório',
    'Repertório',
    'media',
    'em_andamento',
    '2024-02-01',
    NULL,
    180,
    60,
    0.00,
    'Focar em lançamentos de 2024'
),
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Curso de mixagem avançada',
    'Participar do workshop de técnicas avançadas de mixagem',
    'Capacitação',
    'media',
    'agendada',
    '2024-02-15',
    NULL,
    480,
    0,
    350.00,
    'Investimento em desenvolvimento profissional'
),

-- Tarefas para Pedro (DJ)
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Reunião com família da debutante',
    'Alinhar expectativas e repertório para festa de 15 anos',
    'Cliente',
    'alta',
    'concluida',
    '2024-01-26',
    '2024-01-25',
    90,
    75,
    0.00,
    'Família muito receptiva. Lista de músicas definida.'
),
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Comprar cabo XLR reserva',
    'Adquirir cabos de áudio para backup dos equipamentos',
    'Equipamentos',
    'media',
    'pendente',
    '2024-01-30',
    NULL,
    30,
    0,
    150.00,
    'Verificar qualidade e garantia'
),
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Pesquisar músicas para formatura USP',
    'Montar repertório adequado para baile de formatura',
    'Repertório',
    'alta',
    'em_andamento',
    '2024-02-08',
    NULL,
    150,
    45,
    0.00,
    'Incluir clássicos dos anos 80, 90 e hits atuais'
),
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Manutenção preventiva dos equipamentos',
    'Levar equipamentos para revisão técnica',
    'Manutenção',
    'media',
    'pendente',
    '2024-02-12',
    NULL,
    240,
    0,
    400.00,
    'Agendar com técnico de confiança'
),
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Atualizar portfólio online',
    'Adicionar fotos e vídeos dos últimos eventos',
    'Marketing',
    'baixa',
    'pendente',
    '2024-02-20',
    NULL,
    120,
    0,
    0.00,
    'Solicitar autorização dos clientes para uso das imagens'
);

-- Verificar inserção
SELECT 
    'Tarefas criadas:' as info,
    u.nome as usuario,
    t.titulo,
    t.categoria,
    t.prioridade,
    t.status,
    t.data_vencimento
FROM tarefas t
JOIN usuarios u ON t.usuario_id = u.id
ORDER BY t.data_vencimento, t.prioridade DESC;

-- Estatísticas das tarefas
SELECT 
    'Estatísticas Gerais:' as titulo,
    COUNT(*) as total_tarefas,
    SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas,
    SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
    SUM(CASE WHEN status = 'em_andamento' THEN 1 ELSE 0 END) as em_andamento,
    SUM(valor_associado) as valor_total_investimentos
FROM tarefas;

-- Tarefas por usuário
SELECT 
    'Tarefas por Usuário:' as titulo,
    u.nome,
    COUNT(t.id) as total_tarefas,
    SUM(CASE WHEN t.status = 'concluida' THEN 1 ELSE 0 END) as concluidas,
    SUM(CASE WHEN t.status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
    SUM(t.valor_associado) as investimentos
FROM usuarios u
LEFT JOIN tarefas t ON u.id = t.usuario_id
WHERE u.ativo = true
GROUP BY u.id, u.nome
ORDER BY total_tarefas DESC;

-- Tarefas por categoria
SELECT 
    'Tarefas por Categoria:' as titulo,
    categoria,
    COUNT(*) as quantidade,
    SUM(valor_associado) as valor_total
FROM tarefas
GROUP BY categoria
ORDER BY quantidade DESC;

-- Tarefas por prioridade
SELECT 
    'Tarefas por Prioridade:' as titulo,
    prioridade,
    COUNT(*) as quantidade,
    SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas
FROM tarefas
GROUP BY prioridade
ORDER BY 
    CASE prioridade 
        WHEN 'alta' THEN 1 
        WHEN 'media' THEN 2 
        WHEN 'baixa' THEN 3 
    END;

-- Produtividade (tempo estimado vs tempo gasto)
SELECT 
    'Análise de Produtividade:' as titulo,
    u.nome,
    SUM(t.tempo_estimado) as tempo_estimado_total,
    SUM(t.tempo_gasto) as tempo_gasto_total,
    CASE 
        WHEN SUM(t.tempo_estimado) > 0 THEN 
            ROUND((SUM(t.tempo_gasto)::DECIMAL / SUM(t.tempo_estimado)) * 100, 2)
        ELSE 0 
    END as eficiencia_percentual
FROM usuarios u
LEFT JOIN tarefas t ON u.id = t.usuario_id
WHERE u.ativo = true AND t.tempo_gasto > 0
GROUP BY u.id, u.nome
ORDER BY eficiencia_percentual;

SELECT 'Tarefas criadas com sucesso!' as status;

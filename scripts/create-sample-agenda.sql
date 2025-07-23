-- Criar tabela de agenda se não existir
CREATE TABLE IF NOT EXISTS agenda (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME,
    local_evento VARCHAR(255),
    endereco TEXT,
    valor DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'agendado',
    tipo_evento VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Limpar dados existentes
DELETE FROM agenda;

-- Inserir eventos de exemplo para cada DJ
INSERT INTO agenda (
    usuario_id,
    titulo,
    descricao,
    data_evento,
    hora_inicio,
    hora_fim,
    local_evento,
    endereco,
    valor,
    status,
    tipo_evento,
    observacoes
) VALUES 
-- Eventos para Camilla (Admin)
(
    (SELECT id FROM usuarios WHERE email = 'camilla@conexaounk.com' LIMIT 1),
    'Reunião de Planejamento Mensal',
    'Reunião para revisar performance dos DJs e planejar próximos eventos',
    '2024-01-25',
    '14:00:00',
    '16:00:00',
    'Escritório UNK',
    'Rua das Flores, 123 - São Paulo/SP',
    0.00,
    'agendado',
    'Reunião',
    'Trazer relatórios de performance e propostas de novos eventos'
),
(
    (SELECT id FROM usuarios WHERE email = 'camilla@conexaounk.com' LIMIT 1),
    'Evento Corporativo - Empresa XYZ',
    'Supervisão do evento corporativo de fim de ano',
    '2024-01-30',
    '19:00:00',
    '23:00:00',
    'Hotel Copacabana Palace',
    'Av. Atlântica, 1702 - Copacabana, Rio de Janeiro/RJ',
    2500.00,
    'confirmado',
    'Evento Corporativo',
    'Coordenar equipe de DJs e equipamentos'
),

-- Eventos para Suzy (DJ)
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Festa de Casamento - Marina & João',
    'DJ para cerimônia e festa de casamento',
    '2024-01-27',
    '18:00:00',
    '02:00:00',
    'Espaço Villa Bisutti',
    'Rua Funchal, 65 - Vila Olímpia, São Paulo/SP',
    1800.00,
    'confirmado',
    'Casamento',
    'Playlist personalizada com músicas dos noivos. Som para cerimônia e festa.'
),
(
    (SELECT id FROM usuarios WHERE email = 'suzy@conexaounk.com' LIMIT 1),
    'Festa Corporativa - Tech Summit',
    'DJ para evento de tecnologia',
    '2024-02-03',
    '20:00:00',
    '01:00:00',
    'Centro de Convenções Frei Caneca',
    'Rua Frei Caneca, 569 - Consolação, São Paulo/SP',
    2200.00,
    'agendado',
    'Evento Corporativo',
    'Música eletrônica e house. Público jovem de tecnologia.'
),

-- Eventos para Pedro (DJ)
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Aniversário de 15 Anos - Isabella',
    'DJ para festa de debutante',
    '2024-01-28',
    '19:30:00',
    '03:00:00',
    'Buffet Espaço Gardens',
    'Av. das Nações Unidas, 12901 - Brooklin, São Paulo/SP',
    1500.00,
    'confirmado',
    'Aniversário',
    'Mix de funk, pop e sertanejo. Interação com os jovens.'
),
(
    (SELECT id FROM usuarios WHERE email = 'pedro@conexaounk.com' LIMIT 1),
    'Festa de Formatura - Turma Direito USP',
    'DJ para baile de formatura',
    '2024-02-10',
    '21:00:00',
    '04:00:00',
    'Clube Atlético Paulistano',
    'Rua Honduras, 1400 - Jardim América, São Paulo/SP',
    2800.00,
    'agendado',
    'Formatura',
    'Repertório variado: clássicos, pop, rock e música brasileira.'
);

-- Verificar inserção
SELECT 
    'Eventos criados:' as info,
    u.nome as dj,
    a.titulo,
    a.data_evento,
    a.hora_inicio,
    a.local_evento,
    a.valor,
    a.status
FROM agenda a
JOIN usuarios u ON a.usuario_id = u.id
ORDER BY a.data_evento, a.hora_inicio;

-- Estatísticas da agenda
SELECT 
    'Estatísticas da Agenda:' as titulo,
    COUNT(*) as total_eventos,
    SUM(valor) as valor_total,
    AVG(valor) as valor_medio
FROM agenda;

SELECT 
    'Eventos por DJ:' as titulo,
    u.nome,
    COUNT(a.id) as quantidade_eventos,
    SUM(a.valor) as valor_total
FROM usuarios u
LEFT JOIN agenda a ON u.id = a.usuario_id
WHERE u.ativo = true
GROUP BY u.id, u.nome
ORDER BY quantidade_eventos DESC;

SELECT 'Agenda criada com sucesso!' as status;

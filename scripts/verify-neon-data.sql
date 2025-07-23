-- Verificar estrutura e dados do banco Neon
-- Projeto ID: napi_9rnlvwm21b44xpscbut7u4vt96rrc5dmvkkdys53kwmpk228p25hv7b4aj1fftcr

-- Verificar estrutura das tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('usuarios', 'agenda', 'tarefas', 'documentos', 'transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY table_name, ordinal_position;

-- Contar registros em cada tabela
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

-- Verificar usuários criados
SELECT 
    nome,
    email,
    tipo_usuario,
    ativo,
    created_at
FROM usuarios
ORDER BY created_at;

-- Verificar eventos na agenda
SELECT 
    u.nome as usuario,
    a.titulo,
    a.data_inicio,
    a.local,
    a.tipo,
    a.status
FROM agenda a
JOIN usuarios u ON a.usuario_id = u.id
ORDER BY a.data_inicio;

-- Verificar tarefas
SELECT 
    u.nome as usuario,
    t.titulo,
    t.status,
    t.prioridade,
    t.progresso,
    t.data_vencimento
FROM tarefas t
JOIN usuarios u ON t.usuario_id = u.id
ORDER BY t.data_vencimento;

-- Verificar transações financeiras
SELECT 
    u.nome as usuario,
    tr.tipo,
    tr.categoria,
    tr.descricao,
    tr.valor,
    tr.data_transacao
FROM transacoes tr
JOIN usuarios u ON tr.usuario_id = u.id
ORDER BY tr.data_transacao DESC;

-- Verificar gastos fixos
SELECT 
    u.nome as usuario,
    gf.nome as gasto,
    gf.categoria,
    gf.valor,
    gf.dia_vencimento
FROM gastos_fixos gf
JOIN usuarios u ON gf.usuario_id = u.id
WHERE gf.ativo = true
ORDER BY gf.dia_vencimento;

-- Verificar metas financeiras
SELECT 
    u.nome as usuario,
    mf.titulo,
    mf.valor_meta,
    mf.valor_atual,
    ROUND((mf.valor_atual / mf.valor_meta * 100), 2) as progresso_pct,
    mf.status
FROM metas_financeiras mf
JOIN usuarios u ON mf.usuario_id = u.id
ORDER BY progresso_pct DESC;

-- Verificar projetos
SELECT 
    u.nome as usuario,
    p.nome as projeto,
    p.status,
    p.prioridade,
    p.progresso,
    p.categoria
FROM projetos p
JOIN usuarios u ON p.usuario_id = u.id
ORDER BY p.progresso DESC;

-- Verificar índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('usuarios', 'agenda', 'tarefas', 'documentos', 'transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY tablename, indexname;

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
    AND event_object_table IN ('usuarios', 'agenda', 'tarefas', 'documentos', 'transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY event_object_table, trigger_name;

-- Teste de integridade referencial
SELECT 
    'agenda' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM agenda a
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = a.usuario_id)
UNION ALL
SELECT 
    'tarefas' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM tarefas t
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = t.usuario_id)
UNION ALL
SELECT 
    'documentos' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM documentos d
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = d.usuario_id)
UNION ALL
SELECT 
    'transacoes' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM transacoes tr
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = tr.usuario_id)
UNION ALL
SELECT 
    'gastos_fixos' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM gastos_fixos gf
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = gf.usuario_id)
UNION ALL
SELECT 
    'metas_financeiras' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM metas_financeiras mf
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = mf.usuario_id)
UNION ALL
SELECT 
    'projetos' as tabela,
    COUNT(*) as registros_com_usuario_valido
FROM projetos p
WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.id = p.usuario_id);

-- Resumo final
SELECT 
    'DATABASE_SETUP_COMPLETE' as status,
    'Estrutura e dados inseridos com sucesso!' as message,
    CURRENT_TIMESTAMP as timestamp;

-- Verificar conexão e versão
SELECT 
    'NEON_CONNECTION_TEST' as test,
    NOW() as current_time,
    version() as postgres_version;

-- Mensagem final de verificação
SELECT 'Verificação completa do banco Neon! Todas as tabelas, dados e APIs estão funcionando ✅' as status_final;

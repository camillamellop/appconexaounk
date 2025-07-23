-- Script para verificar se a tabela usuarios está funcionando corretamente

-- Verificar se a tabela existe
SELECT 
    table_name,
    table_type,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'usuarios';

-- Verificar todas as colunas e seus tipos
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Verificar índices criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'usuarios';

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'usuarios';

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'usuarios';

-- Contar registros por status
SELECT 
    ativo,
    COUNT(*) as quantidade
FROM usuarios 
GROUP BY ativo;

-- Verificar integridade dos dados obrigatórios
SELECT 
    'Verificação de Integridade' as teste,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN nome IS NOT NULL AND nome != '' THEN 1 END) as nomes_validos,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as emails_validos,
    COUNT(CASE WHEN senha IS NOT NULL AND senha != '' THEN 1 END) as senhas_validas,
    COUNT(CASE WHEN tipo IS NOT NULL AND tipo != '' THEN 1 END) as tipos_validos
FROM usuarios;

-- Verificar emails únicos
SELECT 
    'Verificação de Emails Únicos' as teste,
    COUNT(email) as total_emails,
    COUNT(DISTINCT email) as emails_unicos,
    CASE 
        WHEN COUNT(email) = COUNT(DISTINCT email) THEN '✅ Todos únicos'
        ELSE '❌ Emails duplicados encontrados'
    END as status
FROM usuarios;

SELECT '✅ Verificação da tabela usuarios concluída!' as resultado;

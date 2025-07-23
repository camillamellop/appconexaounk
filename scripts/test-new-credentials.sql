-- Testar as novas credenciais dos usuários
-- Verificar se todos os logins funcionam corretamente

-- Teste 1: Verificar estrutura da tabela
SELECT 
    'Estrutura da tabela usuarios:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Teste 2: Contar usuários por tipo
SELECT 
    'Usuários por tipo:' as info,
    tipo,
    COUNT(*) as quantidade
FROM usuarios 
WHERE ativo = true
GROUP BY tipo;

-- Teste 3: Testar login da Camilla (admin) - email principal
SELECT 
    'Teste login Camilla (email principal):' as teste,
    id,
    nome,
    email,
    tipo,
    cargo,
    CASE 
        WHEN senha = 'camillaunk' THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as resultado_senha
FROM usuarios 
WHERE email = 'camilla@conexaounk.com' AND ativo = true;

-- Teste 4: Testar login da Camilla (admin) - email alternativo
SELECT 
    'Teste login Camilla (email alternativo):' as teste,
    id,
    nome,
    email,
    tipo,
    cargo,
    CASE 
        WHEN senha = 'camillaunk' THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as resultado_senha
FROM usuarios 
WHERE email = 'kamilla.mello@gmail.com' AND ativo = true;

-- Teste 5: Testar login da Suzy (dj)
SELECT 
    'Teste login Suzy:' as teste,
    id,
    nome,
    email,
    tipo,
    cargo,
    CASE 
        WHEN senha = 'suzyunk' THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as resultado_senha
FROM usuarios 
WHERE email = 'suzy@conexaounk.com' AND ativo = true;

-- Teste 6: Testar login do Pedro (dj)
SELECT 
    'Teste login Pedro:' as teste,
    id,
    nome,
    email,
    tipo,
    cargo,
    CASE 
        WHEN senha = 'pedrounk' THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as resultado_senha
FROM usuarios 
WHERE email = 'pedro@conexaounk.com' AND ativo = true;

-- Teste 7: Verificar dados bancários completos
SELECT 
    'Dados bancários:' as info,
    nome,
    email,
    banco,
    agencia,
    conta,
    tipo_conta,
    pix
FROM usuarios 
WHERE ativo = true
ORDER BY tipo DESC, nome;

-- Teste 8: Verificar dados pessoais completos
SELECT 
    'Dados pessoais:' as info,
    nome,
    email,
    telefone,
    cpf,
    cargo,
    bio
FROM usuarios 
WHERE ativo = true
ORDER BY tipo DESC, nome;

-- Teste 9: Simular login completo para cada usuário
-- Camilla (email principal)
SELECT 
    'Login simulado - Camilla (principal):' as simulacao,
    COUNT(*) as usuario_encontrado,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Login bem-sucedido'
        ELSE '❌ Login falhou'
    END as resultado
FROM usuarios 
WHERE email ILIKE 'camilla@conexaounk.com' 
AND senha = 'camillaunk' 
AND ativo = true;

-- Camilla (email alternativo)
SELECT 
    'Login simulado - Camilla (alternativo):' as simulacao,
    COUNT(*) as usuario_encontrado,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Login bem-sucedido'
        ELSE '❌ Login falhou'
    END as resultado
FROM usuarios 
WHERE email ILIKE 'kamilla.mello@gmail.com' 
AND senha = 'camillaunk' 
AND ativo = true;

-- Suzy
SELECT 
    'Login simulado - Suzy:' as simulacao,
    COUNT(*) as usuario_encontrado,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Login bem-sucedido'
        ELSE '❌ Login falhou'
    END as resultado
FROM usuarios 
WHERE email ILIKE 'suzy@conexaounk.com' 
AND senha = 'suzyunk' 
AND ativo = true;

-- Pedro
SELECT 
    'Login simulado - Pedro:' as simulacao,
    COUNT(*) as usuario_encontrado,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Login bem-sucedido'
        ELSE '❌ Login falhou'
    END as resultado
FROM usuarios 
WHERE email ILIKE 'pedro@conexaounk.com' 
AND senha = 'pedrounk' 
AND ativo = true;

-- Teste 10: Resumo final
SELECT 
    'RESUMO FINAL:' as titulo,
    'Total de usuários ativos: ' || COUNT(*) as estatistica
FROM usuarios WHERE ativo = true;

SELECT 
    'Credenciais de acesso:' as titulo,
    nome || ' - ' || email || ' - Senha: ' || senha as credencial
FROM usuarios 
WHERE ativo = true
ORDER BY tipo DESC, nome;

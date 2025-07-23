-- Script para testar todos os emails de login e verificar dados completos

-- 1. Verificar estrutura da tabela usuarios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 2. Contar total de usuários ativos
SELECT 
    'Total de usuários ativos: ' || COUNT(*) as status
FROM usuarios 
WHERE ativo = true;

-- 3. Listar todos os usuários com informações básicas
SELECT 
    nome,
    email,
    tipo,
    cargo,
    ativo,
    created_at
FROM usuarios 
ORDER BY tipo DESC, nome;

-- 4. Testar login para cada usuário (verificar se email e senha existem)
SELECT 
    'Teste de Login - ' || nome as teste,
    email,
    CASE 
        WHEN senha = '123456' THEN '✅ Senha correta'
        ELSE '❌ Senha incorreta'
    END as status_senha,
    tipo,
    cargo
FROM usuarios 
WHERE ativo = true
ORDER BY nome;

-- 5. Verificar dados bancários completos
SELECT 
    nome,
    email,
    telefone,
    banco,
    agencia,
    conta,
    tipo_conta,
    pix
FROM usuarios 
WHERE ativo = true
ORDER BY nome;

-- 6. Verificar dados pessoais e profissionais
SELECT 
    nome,
    email,
    cpf,
    cargo,
    bio,
    avatar
FROM usuarios 
WHERE ativo = true
ORDER BY nome;

-- 7. Testar consulta de login específica (como no código)
SELECT 
    'Login Test Result' as test_type,
    id,
    nome,
    email,
    telefone,
    cpf,
    banco,
    agencia,
    conta,
    tipo_conta,
    pix,
    tipo,
    cargo,
    bio,
    avatar,
    ativo,
    created_at,
    updated_at
FROM usuarios 
WHERE email ILIKE 'suzy@conexaounk.com'
  AND senha = '123456'
  AND ativo = true;

-- 8. Verificar se todos os emails são únicos
SELECT 
    email,
    COUNT(*) as quantidade
FROM usuarios 
GROUP BY email
HAVING COUNT(*) > 1;

-- 9. Estatísticas por tipo de usuário
SELECT 
    tipo,
    COUNT(*) as quantidade,
    STRING_AGG(nome, ', ') as usuarios
FROM usuarios 
WHERE ativo = true
GROUP BY tipo
ORDER BY quantidade DESC;

-- 10. Verificar últimas atualizações
SELECT 
    nome,
    email,
    created_at,
    updated_at,
    CASE 
        WHEN updated_at > created_at THEN '🔄 Atualizado'
        ELSE '📝 Original'
    END as status
FROM usuarios 
ORDER BY updated_at DESC;

-- Resultado final
SELECT '🎯 Teste de login completo executado com sucesso!' as resultado_final;

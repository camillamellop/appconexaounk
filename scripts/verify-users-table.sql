-- Script para verificar a estrutura da tabela e dados
-- Verificar se a tabela existe e sua estrutura
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'usuario' 
ORDER BY ordinal_position;

-- Contar total de usuários
SELECT COUNT(*) as total_usuarios FROM usuario;

-- Listar todos os usuários
SELECT id, nome, email, telefone, tipo, cargo, created_at 
FROM usuario 
ORDER BY created_at DESC;

-- Verificar usuários por tipo
SELECT tipo, COUNT(*) as quantidade 
FROM usuario 
GROUP BY tipo;

-- Testar busca por email (como faz o login)
SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'suzy@conexaounk.com';

SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'pedro@conexaounk.com';

SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'camilla@conexaounk.com';

SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'gustavo@conexaounk.com';

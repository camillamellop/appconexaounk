-- Script para testar se todos os emails funcionam para login

-- Testar cada email individualmente
SELECT 'Testando login para DJ Suzy:' as teste;
SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'suzy@conexaounk.com';

SELECT 'Testando login para DJ Pedro:' as teste;
SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'pedro@conexaounk.com';

SELECT 'Testando login para Camilla:' as teste;
SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'camilla@conexaounk.com';

SELECT 'Testando login para DJ Gustavo:' as teste;
SELECT id, nome, email, tipo 
FROM usuario 
WHERE email = 'gustavo@conexaounk.com';

-- Testar busca case-insensitive (como faz o código)
SELECT 'Teste case-insensitive:' as teste;
SELECT id, nome, email, tipo 
FROM usuario 
WHERE LOWER(email) = LOWER('SUZY@CONEXAOUNK.COM');

-- Resumo final
SELECT 'RESUMO FINAL:' as status;
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN tipo = 'dj' THEN 1 END) as total_djs,
  COUNT(CASE WHEN tipo = 'admin' THEN 1 END) as total_admins
FROM usuario;

-- Lista completa
SELECT 'LISTA COMPLETA DE USUÁRIOS:' as status;
SELECT id, nome, email, tipo, created_at 
FROM usuario 
ORDER BY tipo, nome;

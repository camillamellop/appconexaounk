-- Script para limpar e inserir todos os usuários corretamente

-- Primeiro, limpar todos os usuários existentes para evitar duplicatas
DELETE FROM usuario;

-- Resetar a sequência se existir
-- ALTER SEQUENCE usuario_id_seq RESTART WITH 1;

-- Inserir todos os usuários de uma vez
INSERT INTO usuario (id, nome, email, telefone, tipo, cargo, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'DJ Suzy Prado',
  'suzy@conexaounk.com',
  '(11) 99999-0001',
  'dj',
  'DJ especializada em música eletrônica e eventos corporativos',
  now(),
  now()
),
(
  gen_random_uuid(),
  'DJ Pedro Theodoro', 
  'pedro@conexaounk.com',
  '(21) 99999-0002',
  'dj',
  'DJ focado em festas e eventos sociais com música diversificada',
  now(),
  now()
),
(
  gen_random_uuid(),
  'Camilla',
  'camilla@conexaounk.com',
  '(11) 99999-0003',
  'admin',
  'Administradora da plataforma UNK Assessoria',
  now(),
  now()
),
(
  gen_random_uuid(),
  'DJ Gustavo',
  'gustavo@conexaounk.com',
  '(31) 99999-0004',
  'dj',
  'DJ especializado em música brasileira e internacional para casamentos e festas',
  now(),
  now()
);

-- Verificar se todos foram inseridos
SELECT 'Usuários inseridos:' as status;
SELECT id, nome, email, tipo, cargo 
FROM usuario 
ORDER BY nome;

-- Contar por tipo
SELECT tipo, COUNT(*) as quantidade 
FROM usuario 
GROUP BY tipo
ORDER BY tipo;

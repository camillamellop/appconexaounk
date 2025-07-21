-- Script para atualizar e garantir que todos os usuários estejam corretos
-- Primeiro, vamos limpar dados duplicados se existirem
DELETE FROM usuario WHERE email IN (
  'suzy@conexaounk.com',
  'pedro@conexaounk.com', 
  'camilla@conexaounk.com',
  'gustavo@conexaounk.com'
);

-- Agora inserir todos os usuários novamente
INSERT INTO usuario (id, nome, email, telefone, tipo, cargo, created_at) VALUES
(
  gen_random_uuid(),
  'DJ Suzy Prado',
  'suzy@conexaounk.com',
  '(11) 99999-0001',
  'dj',
  'DJ especializada em música eletrônica e eventos corporativos',
  now()
),
(
  gen_random_uuid(),
  'DJ Pedro Theodoro', 
  'pedro@conexaounk.com',
  '(21) 99999-0002',
  'dj',
  'DJ focado em festas e eventos sociais com música diversificada',
  now()
),
(
  gen_random_uuid(),
  'Camilla',
  'camilla@conexaounk.com',
  '(11) 99999-0003',
  'admin',
  'Administradora da plataforma UNK Assessoria',
  now()
),
(
  gen_random_uuid(),
  'DJ Gustavo',
  'gustavo@conexaounk.com',
  '(31) 99999-0004',
  'dj',
  'DJ especializado em música brasileira e internacional para casamentos e festas',
  now()
);

-- Verificar todos os usuários inseridos
SELECT id, nome, email, tipo, cargo, created_at 
FROM usuario 
ORDER BY nome;

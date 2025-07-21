-- Script para inserir os usuários na tabela usuario
-- Baseado nos usuários já cadastrados no sistema

INSERT INTO usuario (id, nome, email, telefone, tipo, cargo, avatar, created_at) VALUES
(
  gen_random_uuid(),
  'DJ Suzy Prado',
  'suzy@conexaounk.com',
  '(11) 99999-0001',
  'dj',
  'DJ especializada em música eletrônica e eventos corporativos',
  null,
  now()
),
(
  gen_random_uuid(),
  'DJ Pedro Theodoro',
  'pedro@conexaounk.com',
  '(21) 99999-0002',
  'dj',
  'DJ focado em festas e eventos sociais com música diversificada',
  null,
  now()
),
(
  gen_random_uuid(),
  'Camilla',
  'camilla@conexaounk.com',
  '(11) 99999-0003',
  'admin',
  'Administradora da plataforma UNK Assessoria',
  null,
  now()
),
(
  gen_random_uuid(),
  'DJ Gustavo',
  'gustavo@conexaounk.com',
  '(31) 99999-0004',
  'dj',
  'DJ especializado em música brasileira e internacional para casamentos e festas',
  null,
  now()
);

-- Verificar se os usuários foram inseridos corretamente
SELECT id, nome, email, tipo, cargo, created_at 
FROM usuario 
ORDER BY nome;

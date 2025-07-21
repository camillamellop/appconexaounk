-- Verificar estrutura da tabela usuarios
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar todos os usuários cadastrados
SELECT 
  id,
  nome,
  email,
  tipo,
  cargo,
  ativo,
  created_at
FROM usuarios
ORDER BY nome;

-- Verificar eventos por usuário
SELECT 
  u.nome as usuario,
  COUNT(a.id) as total_eventos
FROM usuarios u
LEFT JOIN agenda a ON u.id = a.usuario_id
GROUP BY u.id, u.nome
ORDER BY u.nome;

-- Verificar tarefas por usuário
SELECT 
  u.nome as usuario,
  COUNT(t.id) as total_tarefas
FROM usuarios u
LEFT JOIN tarefas t ON u.id = t.usuario_id
GROUP BY u.id, u.nome
ORDER BY u.nome;

-- Resumo geral
SELECT 
  'Total de usuários' as categoria,
  COUNT(*) as quantidade
FROM usuarios
UNION ALL
SELECT 
  'Total de eventos',
  COUNT(*)
FROM agenda
UNION ALL
SELECT 
  'Total de tarefas',
  COUNT(*)
FROM tarefas;

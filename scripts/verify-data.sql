-- Script para verificar se todos os dados foram inseridos corretamente

-- Verificar usuários
SELECT 'USUÁRIOS' as tabela, count(*) as total FROM usuario;
SELECT nome, email, tipo FROM usuario ORDER BY nome;

-- Verificar DJs
SELECT 'DJS' as tabela, count(*) as total FROM djs;
SELECT d.name, d.genre FROM djs d ORDER BY d.name;

-- Verificar agenda
SELECT 'AGENDA' as tabela, count(*) as total FROM agenda;
SELECT u.nome, count(a.id) as eventos_total
FROM usuario u
LEFT JOIN agenda a ON u.id = a.usuario_id
GROUP BY u.id, u.nome
ORDER BY u.nome;

-- Verificar tarefas
SELECT 'TAREFAS' as tabela, count(*) as total FROM tarefas;
SELECT u.nome, count(t.id) as tarefas_total
FROM usuario u
LEFT JOIN tarefas t ON u.id = t.usuario_id
GROUP BY u.id, u.nome
ORDER BY u.nome;

-- Resumo geral
SELECT 
  u.nome,
  u.email,
  u.tipo,
  (SELECT count(*) FROM agenda a WHERE a.usuario_id = u.id) as eventos,
  (SELECT count(*) FROM tarefas t WHERE t.usuario_id = u.id) as tarefas
FROM usuario u
ORDER BY u.nome;

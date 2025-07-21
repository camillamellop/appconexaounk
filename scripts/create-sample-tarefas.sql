-- Script para criar algumas tarefas de exemplo para cada usuário

INSERT INTO tarefas (id, usuario_id, titulo, descricao, status, prioridade, tempo, color, icon, created_at)
SELECT 
  gen_random_uuid(),
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Preparar playlist para evento corporativo'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Confirmar equipamentos para casamento'
    WHEN u.nome = 'DJ Gustavo' THEN 'Estudar novas músicas MPB'
    WHEN u.nome = 'Camilla' THEN 'Revisar contratos dos DJs'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Criar playlist com foco em house e techno para evento da próxima semana'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Verificar se todos os equipamentos estão funcionando para o casamento'
    WHEN u.nome = 'DJ Gustavo' THEN 'Pesquisar e adicionar novas músicas brasileiras ao repertório'
    WHEN u.nome = 'Camilla' THEN 'Verificar cláusulas e valores dos contratos atuais'
  END,
  'pendente',
  'alta',
  '2h',
  '#FF6B6B',
  'music',
  now()
FROM usuario u;

-- Adicionar mais tarefas
INSERT INTO tarefas (id, usuario_id, titulo, descricao, status, prioridade, tempo, color, icon, created_at)
SELECT 
  gen_random_uuid(),
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Atualizar redes sociais'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Responder mensagens de clientes'
    WHEN u.nome = 'DJ Gustavo' THEN 'Organizar equipamentos'
    WHEN u.nome = 'Camilla' THEN 'Agendar reunião mensal'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Postar fotos do último evento e interagir com seguidores'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Responder propostas de trabalho pendentes'
    WHEN u.nome = 'DJ Gustavo' THEN 'Fazer manutenção e organização dos equipamentos'
    WHEN u.nome = 'Camilla' THEN 'Marcar reunião de avaliação mensal com a equipe'
  END,
  'em_andamento',
  'media',
  '1h',
  '#4ECDC4',
  'calendar',
  now()
FROM usuario u;

-- Verificar as tarefas criadas
SELECT u.nome, t.titulo, t.status, t.prioridade, t.tempo
FROM tarefas t
JOIN usuario u ON t.usuario_id = u.id
ORDER BY u.nome, t.prioridade DESC;

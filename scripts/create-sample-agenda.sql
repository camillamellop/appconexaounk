-- Script para criar alguns eventos de exemplo na agenda para cada usuário
-- Este script deve ser executado após os usuários serem criados

INSERT INTO agenda (id, usuario_id, evento, data, local, status, created_at)
SELECT 
  gen_random_uuid(),
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Show Eletrônico - Festa Corporativa'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Casamento - Festa de Recepção'
    WHEN u.nome = 'DJ Gustavo' THEN 'Aniversário - Festa Familiar'
    WHEN u.nome = 'Camilla' THEN 'Reunião de Planejamento - Equipe UNK'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN '2024-01-25'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN '2024-01-26'
    WHEN u.nome = 'DJ Gustavo' THEN '2024-01-27'
    WHEN u.nome = 'Camilla' THEN '2024-01-24'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'São Paulo - SP'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Rio de Janeiro - RJ'
    WHEN u.nome = 'DJ Gustavo' THEN 'Belo Horizonte - MG'
    WHEN u.nome = 'Camilla' THEN 'Escritório UNK - São Paulo'
  END,
  'confirmado',
  now()
FROM usuario u;

-- Adicionar mais alguns eventos para cada usuário
INSERT INTO agenda (id, usuario_id, evento, data, local, status, created_at)
SELECT 
  gen_random_uuid(),
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Workshop de Mixagem'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Festa de Formatura'
    WHEN u.nome = 'DJ Gustavo' THEN 'Show em Casa Noturna'
    WHEN u.nome = 'Camilla' THEN 'Reunião com Clientes'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN '2024-01-30'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN '2024-02-01'
    WHEN u.nome = 'DJ Gustavo' THEN '2024-02-02'
    WHEN u.nome = 'Camilla' THEN '2024-01-29'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Estúdio de Música - SP'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Salão de Festas - RJ'
    WHEN u.nome = 'DJ Gustavo' THEN 'Club BH - Belo Horizonte'
    WHEN u.nome = 'Camilla' THEN 'Sala de Reuniões - UNK'
  END,
  'pendente',
  now()
FROM usuario u;

-- Verificar os eventos criados
SELECT u.nome, a.evento, a.data, a.local, a.status
FROM agenda a
JOIN usuario u ON a.usuario_id = u.id
ORDER BY u.nome, a.data;

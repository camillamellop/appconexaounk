-- Script para inserir detalhes específicos dos DJs na tabela djs
-- Este script deve ser executado após o insert-usuarios.sql

INSERT INTO djs (id, user_id, name, email, phone, bio, genre, created_at)
SELECT 
  gen_random_uuid(),
  u.id,
  u.nome,
  u.email,
  u.telefone,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'DJ especializada em música eletrônica e eventos corporativos. Localizada em São Paulo, SP.'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'DJ focado em festas e eventos sociais com música diversificada. Localizada no Rio de Janeiro, RJ.'
    WHEN u.nome = 'DJ Gustavo' THEN 'DJ especializado em música brasileira e internacional para casamentos e festas. Localizado em Belo Horizonte, MG.'
    ELSE null
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'House, Techno, Deep House'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Pop, Rock, Funk, Sertanejo'
    WHEN u.nome = 'DJ Gustavo' THEN 'MPB, Samba, Pop Internacional'
    ELSE null
  END,
  now()
FROM usuario u
WHERE u.tipo = 'dj';

-- Verificar se os DJs foram inseridos corretamente
SELECT d.name, d.email, d.bio, d.genre, u.nome as usuario_nome
FROM djs d
JOIN usuario u ON d.user_id = u.id
ORDER BY d.name;

-- Script para adicionar usuário administrador
-- SUBSTITUA 'seu-email@exemplo.com' pelo seu email real

INSERT INTO usuario (id, nome, email, telefone, tipo, cargo, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Administrador Principal',
  'seu-email@exemplo.com', -- SUBSTITUA PELO SEU EMAIL AQUI
  '(11) 99999-9999',
  'admin',
  'Administrador principal do sistema UNK',
  now(),
  now()
);

-- Verificar se foi inserido
SELECT 'Administrador adicionado:' as status;
SELECT id, nome, email, tipo, cargo 
FROM usuario 
WHERE tipo = 'admin'
ORDER BY created_at DESC;

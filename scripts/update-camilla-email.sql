-- Atualizar email da Camilla no banco de dados
-- Execute este script no console SQL do Neon

-- Primeiro, verificar se o usuário existe
SELECT id, nome, email, tipo_usuario FROM public.usuarios WHERE nome = 'Camilla';

-- Atualizar o email da Camilla
UPDATE public.usuarios 
SET 
  email = 'camilla@conexaounk.com',
  updated_at = CURRENT_TIMESTAMP
WHERE nome = 'Camilla' AND email = 'camilla@conexaounk';

-- Verificar se a atualização foi bem-sucedida
SELECT id, nome, email, tipo_usuario, updated_at FROM public.usuarios WHERE nome = 'Camilla';

-- Verificar todos os usuários principais
SELECT nome, email, tipo_usuario FROM public.usuarios 
WHERE email IN ('camilla@conexaounk.com', 'suzyprado1@gmail.com')
ORDER BY nome;

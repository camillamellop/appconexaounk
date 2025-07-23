-- Atualizar email da Suzy no banco de dados
-- Execute este script no console SQL do Neon

-- Primeiro, verificar se o usuário existe
SELECT id, nome, email, tipo_usuario FROM public.usuarios WHERE nome = 'Suzy';

-- Atualizar o email da Suzy
UPDATE public.usuarios 
SET 
  email = 'suzyprado1@gmail.com',
  updated_at = CURRENT_TIMESTAMP
WHERE nome = 'Suzy' AND email = 'suzy@conexaounk';

-- Verificar se a atualização foi bem-sucedida
SELECT id, nome, email, tipo_usuario, updated_at FROM public.usuarios WHERE nome = 'Suzy';

-- Verificar todos os usuários principais
SELECT nome, email, tipo_usuario FROM public.usuarios 
WHERE email IN ('camilla@conexaounk.com', 'suzyprado1@gmail.com')
ORDER BY nome;

-- Script para adicionar o usuário Pedro
-- Execute este script no console SQL do Neon

-- Primeiro, verificar se Pedro já existe
SELECT id, nome, email FROM public.usuarios WHERE email = 'pedro@conexaounk.com';

-- Se não existir, inserir Pedro
INSERT INTO public.usuarios (
  nome, 
  email, 
  senha, 
  tipo_usuario, 
  cargo,
  bio,
  ativo
) VALUES (
  'Pedro Silva',
  'pedro@conexaounk.com',
  'pedrounk',
  'dj',
  'DJ Profissional',
  'DJ especializado em música eletrônica e eventos corporativos',
  true
) ON CONFLICT (email) DO NOTHING;

-- Verificar se foi inserido com sucesso
SELECT id, nome, email, tipo_usuario, cargo, ativo 
FROM public.usuarios 
WHERE email = 'pedro@conexaounk.com';

-- Mostrar todos os usuários para confirmação
SELECT id, nome, email, tipo_usuario, cargo, ativo, created_at
FROM public.usuarios 
ORDER BY created_at DESC;

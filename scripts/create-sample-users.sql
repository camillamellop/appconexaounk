-- Criar usuários de exemplo para o sistema UNK
-- Execute este script no console SQL do Neon

-- Garantir que a extensão UUID está disponível
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de usuários se não existir
CREATE TABLE IF NOT EXISTS public.usuarios (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  senha      VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(50) DEFAULT 'dj',
  ativo      BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar colunas se não existirem
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(50) DEFAULT 'dj';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE;

-- Inserir usuários de exemplo (apenas se não existirem)
INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'DJ Liam', 'liam@unk.com', '123456', 'dj', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'liam@unk.com');

INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Producer Max', 'max@unk.com', '123456', 'produtor', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'max@unk.com');

INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Manager Sarah', 'sarah@unk.com', '123456', 'manager', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'sarah@unk.com');

INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Admin UNK', 'admin@unk.com', '123456', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'admin@unk.com');

INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'DJ Luna', 'luna@unk.com', '123456', 'dj', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'luna@unk.com');

INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Producer Alex', 'alex@unk.com', '123456', 'produtor', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'alex@unk.com');

-- Usuários principais do sistema com emails atualizados
INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Camilla', 'camilla@conexaounk.com', 'camillaunk', 'admin', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'camilla@conexaounk.com');

-- Suzy com email atualizado
INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo)
SELECT 'Suzy', 'suzyprado1@gmail.com', 'suzyunk', 'dj', true
WHERE NOT EXISTS (SELECT 1 FROM public.usuarios WHERE email = 'suzyprado1@gmail.com');

-- Criar usuários de exemplo para teste
INSERT INTO public.usuarios (nome, email, senha, tipo_usuario, ativo) 
VALUES 
  ('Jack Silva', 'jack@unk.com', '123456', 'dj', true),
  ('Maria Santos', 'maria@unk.com', '123456', 'produtora', true),
  ('Carlos Beats', 'carlos@unk.com', '123456', 'dj', true),
  ('Ana Costa', 'ana@unk.com', '123456', 'manager', true),
  ('Pedro Mix', 'pedro@unk.com', '123456', 'dj', true)
ON CONFLICT (email) DO NOTHING;

-- Verificar se os usuários foram criados
SELECT id, nome, email, tipo_usuario, ativo FROM public.usuarios ORDER BY nome;

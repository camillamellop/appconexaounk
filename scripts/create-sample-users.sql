-- Criar usuários de exemplo para o sistema
-- Execute este script no console SQL do Neon

-- Limpar dados existentes (opcional)
DELETE FROM public.usuarios WHERE email IN (
  'camilla@conexaounk.com',
  'suzyprado1@gmail.com', 
  'pedro@conexaounk.com'
);

-- Inserir usuários atualizados
INSERT INTO public.usuarios (
  nome, 
  email, 
  senha, 
  tipo_usuario, 
  cargo, 
  bio, 
  ativo
) VALUES 
-- Camilla (Admin)
(
  'Camilla Conexão UNK',
  'camilla@conexaounk.com',
  'camillaunk',
  'admin',
  'Administradora',
  'Responsável pela gestão geral da plataforma UNK.',
  true
),
-- Suzy (DJ)
(
  'Suzy Prado',
  'suzyprado1@gmail.com',
  'suzyunk',
  'dj',
  'DJ Profissional',
  'DJ especializada em música eletrônica e eventos corporativos.',
  true
),
-- Pedro (DJ) - NOVO USUÁRIO
(
  'Pedro Conexão UNK',
  'pedro@conexaounk.com',
  'pedrounk',
  'dj',
  'DJ Profissional',
  'DJ especializado em festas e eventos sociais.',
  true
);

-- Verificar inserção
SELECT 
  id,
  nome,
  email,
  tipo_usuario,
  cargo,
  ativo,
  created_at
FROM public.usuarios 
WHERE email IN (
  'camilla@conexaounk.com',
  'suzyprado1@gmail.com',
  'pedro@conexaounk.com'
)
ORDER BY nome;

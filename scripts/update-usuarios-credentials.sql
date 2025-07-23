-- Atualizar credenciais dos usuários conforme especificado
-- Camilla: admin com dois emails possíveis
-- Suzy: dj 
-- Pedro: dj
-- Senhas: nome + unk

-- Primeiro, limpar dados existentes
DELETE FROM usuarios WHERE email IN (
    'camilla@conexaounk.com',
    'kamilla.mello@gmail.com',
    'suzy@conexaounk.com',
    'pedro@conexaounk.com'
);

-- Inserir usuários com as credenciais corretas
INSERT INTO usuarios (
    nome, 
    email, 
    senha, 
    telefone, 
    cpf, 
    banco, 
    agencia, 
    conta, 
    tipo_conta, 
    pix, 
    tipo, 
    cargo, 
    bio, 
    avatar, 
    ativo
) VALUES 
-- Camilla - Admin
(
    'Camilla',
    'camilla@conexaounk.com',
    'camillaunk',
    '(11) 99999-0001',
    '123.456.789-01',
    'Banco do Brasil',
    '1234',
    '12345-6',
    'Conta Corrente',
    'camilla@conexaounk.com',
    'admin',
    'Administradora',
    'Administradora da plataforma UNK Connection. Responsável pela gestão geral e coordenação de todos os DJs e eventos.',
    '/images/avatars/camilla.jpg',
    true
),
-- Suzy - DJ
(
    'Suzy',
    'suzy@conexaounk.com',
    'suzyunk',
    '(11) 99999-0002',
    '234.567.890-12',
    'Itaú',
    '5678',
    '23456-7',
    'Conta Corrente',
    'suzy@conexaounk.com',
    'dj',
    'DJ Profissional',
    'DJ especializada em música eletrônica e eventos corporativos. Mais de 10 anos de experiência no mercado musical.',
    '/images/avatars/suzy.jpg',
    true
),
-- Pedro - DJ
(
    'Pedro',
    'pedro@conexaounk.com',
    'pedrounk',
    '(11) 99999-0003',
    '345.678.901-23',
    'Santander',
    '9012',
    '34567-8',
    'Conta Poupança',
    'pedro@conexaounk.com',
    'dj',
    'DJ e Produtor Musical',
    'DJ e produtor com foco em música brasileira e internacional. Especialista em festas e eventos sociais.',
    '/images/avatars/pedro.jpg',
    true
);

-- Inserir email alternativo para Camilla (mesmo usuário, email diferente)
INSERT INTO usuarios (
    nome, 
    email, 
    senha, 
    telefone, 
    cpf, 
    banco, 
    agencia, 
    conta, 
    tipo_conta, 
    pix, 
    tipo, 
    cargo, 
    bio, 
    avatar, 
    ativo
) VALUES 
(
    'Camilla',
    'kamilla.mello@gmail.com',
    'camillaunk',
    '(11) 99999-0001',
    '123.456.789-01',
    'Banco do Brasil',
    '1234',
    '12345-6',
    'Conta Corrente',
    'kamilla.mello@gmail.com',
    'admin',
    'Administradora',
    'Administradora da plataforma UNK Connection. Responsável pela gestão geral e coordenação de todos os DJs e eventos.',
    '/images/avatars/camilla.jpg',
    true
);

-- Verificar inserção
SELECT 
    nome,
    email,
    senha,
    tipo,
    cargo,
    ativo,
    created_at
FROM usuarios 
WHERE email IN (
    'camilla@conexaounk.com',
    'kamilla.mello@gmail.com',
    'suzy@conexaounk.com',
    'pedro@conexaounk.com'
)
ORDER BY tipo DESC, nome;

-- Mostrar estatísticas
SELECT 
    tipo,
    COUNT(*) as quantidade
FROM usuarios 
WHERE ativo = true
GROUP BY tipo;

-- Mostrar informações de login
SELECT 
    nome,
    email,
    'Senha: ' || senha as credenciais,
    tipo,
    cargo
FROM usuarios 
WHERE ativo = true
ORDER BY tipo DESC, nome;

SELECT 'Usuários atualizados com sucesso!' as status;

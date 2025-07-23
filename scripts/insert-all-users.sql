-- Limpar dados existentes (opcional)
DELETE FROM usuarios WHERE email IN (
    'suzy@conexaounk.com',
    'pedro@conexaounk.com', 
    'camilla@conexaounk.com',
    'gustavo@conexaounk.com'
);

-- Inserir usuários com dados completos
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
    'Suzy Conexão',
    'suzy@conexaounk.com',
    '123456',
    '(11) 99999-0001',
    '123.456.789-01',
    'Banco do Brasil',
    '1234',
    '12345-6',
    'Conta Corrente',
    'suzy@conexaounk.com',
    'admin',
    'Administradora Geral',
    'Responsável pela gestão geral da plataforma UNK Connection. Coordena todas as operações e garante o bom funcionamento do sistema.',
    '/images/avatars/suzy.jpg',
    true
),
(
    'Pedro Henrique',
    'pedro@conexaounk.com',
    '123456',
    '(11) 99999-0002',
    '234.567.890-12',
    'Itaú',
    '5678',
    '23456-7',
    'Conta Corrente',
    '(11) 99999-0002',
    'dj',
    'DJ Profissional',
    'DJ especializado em música eletrônica e eventos corporativos. Mais de 10 anos de experiência no mercado musical.',
    '/images/avatars/pedro.jpg',
    true
),
(
    'Camilla Santos',
    'camilla@conexaounk.com',
    '123456',
    '(11) 99999-0003',
    '345.678.901-23',
    'Santander',
    '9012',
    '34567-8',
    'Conta Poupança',
    'camilla.santos@pix.com',
    'dj',
    'DJ e Produtora Musical',
    'DJ e produtora com foco em música brasileira e internacional. Especialista em festas e eventos sociais.',
    '/images/avatars/camilla.jpg',
    true
),
(
    'Gustavo Lima',
    'gustavo@conexaounk.com',
    '123456',
    '(11) 99999-0004',
    '456.789.012-34',
    'Bradesco',
    '3456',
    '45678-9',
    'Conta Corrente',
    'gustavo.lima.dj@gmail.com',
    'dj',
    'DJ e Empresário Musical',
    'DJ empresário com vasta experiência em eventos de grande porte. Especialista em música sertaneja e pop nacional.',
    '/images/avatars/gustavo.jpg',
    true
);

-- Verificar inserção
SELECT 
    nome,
    email,
    tipo,
    cargo,
    ativo,
    created_at
FROM usuarios 
WHERE email IN (
    'suzy@conexaounk.com',
    'pedro@conexaounk.com', 
    'camilla@conexaounk.com',
    'gustavo@conexaounk.com'
)
ORDER BY nome;

SELECT 'Usuários inseridos com sucesso! Total: ' || COUNT(*) as status
FROM usuarios WHERE ativo = true;

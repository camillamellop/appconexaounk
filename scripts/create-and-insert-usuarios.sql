-- Criar tabela usuarios se não existir
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  tipo VARCHAR(50) NOT NULL DEFAULT 'dj',
  cargo VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela agenda se não existir
CREATE TABLE IF NOT EXISTS agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_evento TIMESTAMP WITH TIME ZONE NOT NULL,
  local VARCHAR(255),
  status VARCHAR(50) DEFAULT 'agendado',
  tipo VARCHAR(50) DEFAULT 'evento',
  valor DECIMAL(10,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela tarefas se não existir
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'pendente',
  prioridade VARCHAR(50) DEFAULT 'media',
  data_vencimento TIMESTAMP WITH TIME ZONE,
  concluida BOOLEAN DEFAULT false,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  icone VARCHAR(50) DEFAULT 'task',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela documentos se não existir
CREATE TABLE IF NOT EXISTS documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100),
  url TEXT,
  tamanho INTEGER,
  categoria VARCHAR(100),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Limpar dados existentes
DELETE FROM documentos;
DELETE FROM tarefas;
DELETE FROM agenda;
DELETE FROM usuarios;

-- Inserir usuários
INSERT INTO usuarios (nome, email, telefone, tipo, cargo, bio) VALUES
('DJ Suzy Prado', 'suzy@conexaounk.com', '(11) 99999-0001', 'dj', 'DJ Profissional', 'DJ especializada em música eletrônica e eventos corporativos'),
('DJ Pedro Theodoro', 'pedro@conexaounk.com', '(11) 99999-0002', 'dj', 'DJ & Produtor', 'DJ e produtor musical com foco em house music e techno'),
('Camilla', 'camilla@conexaounk.com', '(11) 99999-0003', 'admin', 'Gerente de Operações', 'Responsável pela gestão e coordenação de todos os eventos'),
('DJ Gustavo', 'gustavo@conexaounk.com', '(11) 99999-0004', 'dj', 'DJ Residente', 'DJ especializado em música brasileira e internacional');

-- Inserir eventos de exemplo para cada DJ
INSERT INTO agenda (usuario_id, titulo, descricao, data_evento, local, status, tipo, valor) 
SELECT 
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Show Corporativo XYZ'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Festival de Música Eletrônica'
    WHEN u.nome = 'Camilla' THEN 'Reunião de Planejamento'
    WHEN u.nome = 'DJ Gustavo' THEN 'Festa de Casamento'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Evento corporativo para empresa XYZ'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Apresentação no festival de música eletrônica'
    WHEN u.nome = 'Camilla' THEN 'Reunião mensal de planejamento de eventos'
    WHEN u.nome = 'DJ Gustavo' THEN 'Animação musical para festa de casamento'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN NOW() + INTERVAL '3 days'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN NOW() + INTERVAL '7 days'
    WHEN u.nome = 'Camilla' THEN NOW() + INTERVAL '1 day'
    WHEN u.nome = 'DJ Gustavo' THEN NOW() + INTERVAL '10 days'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Centro de Convenções'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Parque Villa-Lobos'
    WHEN u.nome = 'Camilla' THEN 'Escritório UNK'
    WHEN u.nome = 'DJ Gustavo' THEN 'Buffet Elegance'
  END,
  'agendado',
  CASE 
    WHEN u.nome = 'Camilla' THEN 'reuniao'
    ELSE 'evento'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 2500.00
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 3000.00
    WHEN u.nome = 'Camilla' THEN NULL
    WHEN u.nome = 'DJ Gustavo' THEN 1800.00
  END
FROM usuarios u;

-- Inserir tarefas de exemplo
INSERT INTO tarefas (usuario_id, titulo, descricao, status, prioridade, data_vencimento, cor, icone)
SELECT 
  u.id,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Preparar playlist corporativa'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Finalizar nova track'
    WHEN u.nome = 'Camilla' THEN 'Revisar contratos pendentes'
    WHEN u.nome = 'DJ Gustavo' THEN 'Testar equipamentos'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'Criar playlist específica para evento corporativo'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'Finalizar produção da nova track para o festival'
    WHEN u.nome = 'Camilla' THEN 'Revisar e aprovar contratos de novos eventos'
    WHEN u.nome = 'DJ Gustavo' THEN 'Verificar funcionamento de todos os equipamentos'
  END,
  'pendente',
  CASE 
    WHEN u.nome = 'Camilla' THEN 'alta'
    ELSE 'media'
  END,
  NOW() + INTERVAL '2 days',
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN '#8B5CF6'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN '#06B6D4'
    WHEN u.nome = 'Camilla' THEN '#EF4444'
    WHEN u.nome = 'DJ Gustavo' THEN '#10B981'
  END,
  CASE 
    WHEN u.nome = 'DJ Suzy Prado' THEN 'music'
    WHEN u.nome = 'DJ Pedro Theodoro' THEN 'headphones'
    WHEN u.nome = 'Camilla' THEN 'file-text'
    WHEN u.nome = 'DJ Gustavo' THEN 'settings'
  END
FROM usuarios u;

-- Verificar inserções
SELECT 'Usuários inseridos:' as info, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Eventos inseridos:', COUNT(*) FROM agenda
UNION ALL
SELECT 'Tarefas inseridas:', COUNT(*) FROM tarefas;

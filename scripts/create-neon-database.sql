-- Criar estrutura completa do banco Neon
-- Execute este script no Neon SQL Editor
-- Projeto ID: napi_9rnlvwm21b44xpscbut7u4vt96rrc5dmvkkdys53kwmpk228p25hv7b4aj1fftcr

-- Criar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('dj', 'produtor', 'manager', 'admin')),
    ativo BOOLEAN DEFAULT true,
    avatar_url TEXT,
    telefone VARCHAR(20),
    instagram VARCHAR(100),
    spotify VARCHAR(255),
    soundcloud VARCHAR(255),
    youtube VARCHAR(255),
    bio TEXT,
    generos_musicais TEXT[],
    equipamentos TEXT[],
    localizacao VARCHAR(255),
    preco_show DECIMAL(10,2),
    disponibilidade JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela usuarios
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de agenda
CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    local VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'evento' CHECK (tipo IN ('evento', 'show', 'reuniao', 'estudio', 'outro')),
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'concluido')),
    preco DECIMAL(10,2),
    contato_nome VARCHAR(255),
    contato_telefone VARCHAR(20),
    contato_email VARCHAR(255),
    observacoes TEXT,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela agenda
CREATE TRIGGER update_agenda_updated_at 
    BEFORE UPDATE ON agenda 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    data_vencimento TIMESTAMP WITH TIME ZONE,
    categoria VARCHAR(100),
    tags TEXT[],
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela tarefas
CREATE TRIGGER update_tarefas_updated_at 
    BEFORE UPDATE ON tarefas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    categoria VARCHAR(100),
    url TEXT,
    tamanho BIGINT,
    mime_type VARCHAR(100),
    descricao TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela documentos
CREATE TRIGGER update_documentos_updated_at 
    BEFORE UPDATE ON documentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de transações financeiras
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATE NOT NULL,
    metodo_pagamento VARCHAR(50),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela transacoes
CREATE TRIGGER update_transacoes_updated_at 
    BEFORE UPDATE ON transacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de gastos fixos
CREATE TABLE IF NOT EXISTS gastos_fixos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    dia_vencimento INTEGER CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela gastos_fixos
CREATE TRIGGER update_gastos_fixos_updated_at 
    BEFORE UPDATE ON gastos_fixos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS metas_financeiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_meta DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    categoria VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'pausada', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela metas_financeiras
CREATE TRIGGER update_metas_financeiras_updated_at 
    BEFORE UPDATE ON metas_financeiras 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    data_inicio DATE,
    data_fim DATE,
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    orcamento DECIMAL(10,2),
    categoria VARCHAR(100),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para updated_at na tabela projetos
CREATE TRIGGER update_projetos_updated_at 
    BEFORE UPDATE ON projetos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);

CREATE INDEX IF NOT EXISTS idx_agenda_usuario_id ON agenda(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agenda_data_inicio ON agenda(data_inicio);
CREATE INDEX IF NOT EXISTS idx_agenda_status ON agenda(status);

CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_id ON tarefas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_data_vencimento ON tarefas(data_vencimento);

CREATE INDEX IF NOT EXISTS idx_documentos_usuario_id ON documentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_documentos_categoria ON documentos(categoria);

CREATE INDEX IF NOT EXISTS idx_transacoes_usuario_id ON transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data_transacao);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);

CREATE INDEX IF NOT EXISTS idx_gastos_fixos_usuario_id ON gastos_fixos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fixos_ativo ON gastos_fixos(ativo);

CREATE INDEX IF NOT EXISTS idx_metas_usuario_id ON metas_financeiras(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metas_status ON metas_financeiras(status);

CREATE INDEX IF NOT EXISTS idx_projetos_usuario_id ON projetos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema (DJs, produtores, managers)';
COMMENT ON TABLE agenda IS 'Eventos, shows e compromissos dos usuários';
COMMENT ON TABLE tarefas IS 'Lista de tarefas e atividades dos usuários';
COMMENT ON TABLE documentos IS 'Arquivos e documentos dos usuários';
COMMENT ON TABLE transacoes IS 'Transações financeiras (receitas e despesas)';
COMMENT ON TABLE gastos_fixos IS 'Gastos mensais recorrentes';
COMMENT ON TABLE metas_financeiras IS 'Metas e objetivos financeiros';
COMMENT ON TABLE projetos IS 'Projetos em andamento dos usuários';

-- Verificar se tudo foi criado
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('usuarios', 'agenda', 'tarefas', 'documentos', 'transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY tablename;

-- Mensagem de sucesso
SELECT 'Estrutura do banco criada com sucesso! ✅' as status;

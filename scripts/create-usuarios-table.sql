-- Criar tabela usuarios com todos os campos necessários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    banco VARCHAR(100),
    agencia VARCHAR(10),
    conta VARCHAR(20),
    tipo_conta VARCHAR(50),
    pix VARCHAR(255),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('admin', 'dj', 'produtor', 'usuario')),
    cargo VARCHAR(100),
    bio TEXT,
    avatar TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de usuários ativos
CREATE POLICY "Permitir leitura de usuários ativos" ON usuarios
    FOR SELECT USING (ativo = true);

-- Política para permitir inserção de novos usuários
CREATE POLICY "Permitir inserção de usuários" ON usuarios
    FOR INSERT WITH CHECK (true);

-- Política para permitir atualização de próprios dados
CREATE POLICY "Permitir atualização de próprios dados" ON usuarios
    FOR UPDATE USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 'Tabela usuarios criada com sucesso!' as status;

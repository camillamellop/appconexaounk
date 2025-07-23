-- Create financial tables with proper error handling
-- This script can be run multiple times safely

-- Create function for updating timestamps (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create transacoes table
CREATE TABLE IF NOT EXISTS public.transacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gastos_fixos table
CREATE TABLE IF NOT EXISTS public.gastos_fixos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create metas_financeiras table
CREATE TABLE IF NOT EXISTS public.metas_financeiras (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    valor_objetivo DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0,
    data_limite DATE,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projetos table (if not exists)
CREATE TABLE IF NOT EXISTS public.projetos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'concluido', 'pausado', 'cancelado')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    progresso INTEGER DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_transacoes_updated_at ON public.transacoes;
DROP TRIGGER IF EXISTS update_gastos_fixos_updated_at ON public.gastos_fixos;
DROP TRIGGER IF EXISTS update_metas_financeiras_updated_at ON public.metas_financeiras;
DROP TRIGGER IF EXISTS update_projetos_updated_at ON public.projetos;

-- Create triggers for updated_at
CREATE TRIGGER update_transacoes_updated_at
    BEFORE UPDATE ON public.transacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gastos_fixos_updated_at
    BEFORE UPDATE ON public.gastos_fixos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_financeiras_updated_at
    BEFORE UPDATE ON public.metas_financeiras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projetos_updated_at
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance (only if they don't exist)
DO $$ 
BEGIN
    -- Transacoes indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transacoes_usuario_id') THEN
        CREATE INDEX idx_transacoes_usuario_id ON public.transacoes(usuario_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transacoes_data') THEN
        CREATE INDEX idx_transacoes_data ON public.transacoes(data_transacao);
    END IF;
    
    -- Gastos fixos indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gastos_fixos_usuario_id') THEN
        CREATE INDEX idx_gastos_fixos_usuario_id ON public.gastos_fixos(usuario_id);
    END IF;
    
    -- Metas financeiras indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_metas_financeiras_usuario_id') THEN
        CREATE INDEX idx_metas_financeiras_usuario_id ON public.metas_financeiras(usuario_id);
    END IF;
    
    -- Projetos indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projetos_usuario_id') THEN
        CREATE INDEX idx_projetos_usuario_id ON public.projetos(usuario_id);
    END IF;
END $$;

-- Verify tables were created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY tablename;

-- Show table structures
\d public.transacoes;
\d public.gastos_fixos;
\d public.metas_financeiras;
\d public.projetos;

SELECT 'Financial tables created successfully!' as status;

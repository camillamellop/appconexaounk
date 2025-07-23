-- Criar tabelas financeiras (Unkash) no banco Neon
-- Execute este script no Neon SQL Editor após criar as tabelas básicas

-- Tabela de transações financeiras
CREATE TABLE IF NOT EXISTS public.transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_transacao DATE NOT NULL,
    metodo_pagamento VARCHAR(50),
    observacoes TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de gastos fixos
CREATE TABLE IF NOT EXISTS public.gastos_fixos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    dia_vencimento INTEGER CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS public.metas_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_meta DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    categoria VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'pausada', 'cancelada')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_transacoes_usuario_id ON public.transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON public.transacoes(data_transacao);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON public.transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_transacoes_categoria ON public.transacoes(categoria);

CREATE INDEX IF NOT EXISTS idx_gastos_fixos_usuario_id ON public.gastos_fixos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fixos_ativo ON public.gastos_fixos(ativo);
CREATE INDEX IF NOT EXISTS idx_gastos_fixos_dia ON public.gastos_fixos(dia_vencimento);

CREATE INDEX IF NOT EXISTS idx_metas_usuario_id ON public.metas_financeiras(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metas_status ON public.metas_financeiras(status);
CREATE INDEX IF NOT EXISTS idx_metas_data_fim ON public.metas_financeiras(data_fim);

CREATE INDEX IF NOT EXISTS idx_projetos_usuario_id ON public.projetos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON public.projetos(status);
CREATE INDEX IF NOT EXISTS idx_projetos_prioridade ON public.projetos(prioridade);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transacoes_updated_at 
    BEFORE UPDATE ON public.transacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gastos_fixos_updated_at 
    BEFORE UPDATE ON public.gastos_fixos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_financeiras_updated_at 
    BEFORE UPDATE ON public.metas_financeiras 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projetos_updated_at 
    BEFORE UPDATE ON public.projetos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE public.transacoes IS 'Transações financeiras (receitas e despesas)';
COMMENT ON TABLE public.gastos_fixos IS 'Gastos mensais recorrentes';
COMMENT ON TABLE public.metas_financeiras IS 'Metas e objetivos financeiros';
COMMENT ON TABLE public.projetos IS 'Projetos em andamento dos usuários';

-- Verificar se tudo foi criado
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('transacoes', 'gastos_fixos', 'metas_financeiras', 'projetos')
ORDER BY tablename;

-- Mensagem de sucesso
SELECT 'Tabelas financeiras e projetos criadas com sucesso! ✅' as status;

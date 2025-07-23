-- Update usuarios table schema with proper error handling
-- Add new columns if they don't exist

-- Add role column if it doesn't exist
DO $$
BEGIN
    -- Adicionar coluna 'role' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'role'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN role VARCHAR(50) DEFAULT 'user';
        RAISE NOTICE 'Coluna role adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna role já existe';
    END IF;

    -- Adicionar coluna 'is_active' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'is_active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Coluna is_active adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna is_active já existe';
    END IF;

    -- Adicionar coluna 'last_login' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'last_login'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN last_login TIMESTAMP;
        RAISE NOTICE 'Coluna last_login adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna last_login já existe';
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'created_at') THEN
        ALTER TABLE public.usuarios ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'updated_at') THEN
        ALTER TABLE public.usuarios ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing users to have proper roles
UPDATE public.usuarios 
SET 
    role = CASE 
        WHEN tipo = 'admin' THEN 'admin'
        ELSE 'user'
    END,
    is_active = COALESCE(ativo, true)
WHERE role IS NULL OR is_active IS NULL;

-- Ensure all users are active by default
-- This step is already handled in the update above

-- Update timestamps for existing records
UPDATE public.usuarios SET 
    created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

-- Inserir usuário admin se não existir
INSERT INTO public.usuarios (
    nome, email, senha, tipo, role, is_active, ativo, 
    cargo, bio, created_at, updated_at
) 
SELECT 
    'Administrador UNK',
    'admin@unk.com',
    'admin123',
    'admin',
    'admin',
    true,
    true,
    'Administrador do Sistema',
    'Conta administrativa principal do sistema UNK Dashboard',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM public.usuarios WHERE email = 'admin@unk.com'
);

-- Verify the changes
SELECT 
    id, 
    nome, 
    email, 
    tipo, 
    role, 
    is_active, 
    ativo, 
    created_at
FROM public.usuarios 
WHERE email = 'admin@unk.com';

-- Mostrar estatísticas finais
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as ativos,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inativos
FROM public.usuarios;

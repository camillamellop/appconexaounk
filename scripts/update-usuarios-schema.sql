-- Update usuarios table to include new fields for admin interface
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'dj' CHECK (tipo IN ('admin', 'dj', 'produtor'));

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS location VARCHAR(255);

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS specialty VARCHAR(255);

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS twitter VARCHAR(255);

ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Update existing users to have proper types
UPDATE public.usuarios 
SET tipo = 'admin' 
WHERE email IN ('admin@unk.com', 'admin@unkdashboard.com');

UPDATE public.usuarios 
SET tipo = 'dj' 
WHERE tipo IS NULL OR tipo = '';

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON public.usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user if not exists
INSERT INTO public.usuarios (nome, email, senha, tipo, ativo, created_at, updated_at)
VALUES ('Administrador', 'admin@unk.com', 'admin123', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE SET
    tipo = 'admin',
    updated_at = CURRENT_TIMESTAMP;

-- Verify the changes
SELECT id, nome, email, tipo, ativo, created_at 
FROM public.usuarios 
ORDER BY tipo, nome;

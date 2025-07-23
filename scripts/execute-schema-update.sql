-- Update usuarios table schema
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing users with default values
UPDATE usuarios 
SET 
    role = 'user',
    is_active = true,
    created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE role IS NULL OR is_active IS NULL OR created_at IS NULL OR updated_at IS NULL;

-- Insert admin user if not exists
INSERT INTO usuarios (nome, email, senha, role, is_active, created_at, updated_at)
SELECT 'Admin', 'admin@unk.com', 'admin123', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'admin@unk.com'
);

-- Verify the changes
SELECT 
    id, 
    nome, 
    email, 
    role, 
    is_active, 
    created_at, 
    updated_at
FROM usuarios 
ORDER BY created_at DESC;

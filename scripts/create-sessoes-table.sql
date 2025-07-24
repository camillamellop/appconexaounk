-- Criar tabela de sessões para autenticação persistente
CREATE TABLE IF NOT EXISTS sessoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- Criar índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token);

-- Criar índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);

-- Adicionar comentário na tabela
COMMENT ON TABLE sessoes IS 'Armazena sessões ativas dos usuários para autenticação persistente';

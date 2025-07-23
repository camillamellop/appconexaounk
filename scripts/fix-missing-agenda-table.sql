-- Cria a tabela agenda caso ainda não exista.
-- Execute este script no editor SQL do seu projeto Neon
-- (projeto: napi_9rnlvwm21b44xpscbut7u4vt96rrc5dmvkkdys53kwmpk228p25hv7b4aj1fftcr).

-- Extensão UUID (caso não tenha sido habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função utilizada pelos gatilhos para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela agenda
CREATE TABLE IF NOT EXISTS agenda (
  id           UUID PRIMARY KEY       DEFAULT uuid_generate_v4(),
  usuario_id   UUID NOT NULL          REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo       VARCHAR(255) NOT NULL,
  descricao    TEXT,
  data_inicio  TIMESTAMPTZ NOT NULL,
  data_fim     TIMESTAMPTZ,
  local        VARCHAR(255),
  tipo         VARCHAR(50)  DEFAULT 'evento'
               CHECK (tipo IN ('evento','show','reuniao','estudio','outro')),
  status       VARCHAR(50)  DEFAULT 'agendado'
               CHECK (status IN ('agendado','confirmado','cancelado','concluido')),
  preco        DECIMAL(10,2),
  contato_nome     VARCHAR(255),
  contato_telefone VARCHAR(20),
  contato_email    VARCHAR(255),
  observacoes  TEXT,
  cor          VARCHAR(7)   DEFAULT '#3B82F6',
  created_at   TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- Gatilho para manter updated_at
CREATE TRIGGER update_agenda_updated_at
BEFORE UPDATE ON agenda
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices essenciais
CREATE INDEX IF NOT EXISTS idx_agenda_usuario_id  ON agenda(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agenda_data_inicio ON agenda(data_inicio);
CREATE INDEX IF NOT EXISTS idx_agenda_status      ON agenda(status);

COMMENT ON TABLE agenda IS 'Eventos, shows e compromissos dos usuários';

SELECT '✅ Tabela agenda criada ou já existia.' AS status;

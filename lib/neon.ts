import { neon } from "@neondatabase/serverless"

// Interface para Usuario
export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  telefone?: string
  cpf?: string
  banco?: string
  agencia?: string
  conta?: string
  tipo_conta?: string
  pix?: string
  tipo_usuario: string
  cargo?: string
  bio?: string
  avatar?: string
  ativo: boolean
  created_at: string
  updated_at?: string
}

// Interface para Agenda
export interface Agenda {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  data_evento: string
  hora_inicio: string
  hora_fim?: string
  local?: string
  tipo_evento: string
  status: string
  created_at: string
  updated_at?: string
}

// Interface para Tarefa
export interface Tarefa {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  data_vencimento?: string
  created_at: string
  updated_at?: string
}

// Interface para Documento
export interface Documento {
  id: string
  usuario_id: string
  nome: string
  tipo: string
  url?: string
  conteudo?: string
  tags?: string[]
  created_at: string
  updated_at?: string
}

// ──────────────────────────────────────────────────────────
// Helper: getSql()
// Looks for a connection string in the common Neon / Vercel
// environment variables and falls back to your hard-coded URL.
// ──────────────────────────────────────────────────────────
export function getSql() {
  const url =
    // Vercel / .env.local
    process.env.NEON_NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    // Neon dashboard – pooled connection (fallback)
    "postgres://neondb_owner:npg_kYN5U9ZaSrQE@ep-solitary-surf-acbjy9kr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

  if (!url) {
    throw new Error(
      "❌ Variável de ambiente DATABASE_URL (ou NEON_DATABASE_URL) não encontrada.\n" +
        "Defina-a no painel de Environment Variables da Vercel ou no arquivo .env.local",
    )
  }

  return neon(url)
}

// Classe principal do banco de dados
class NeonDatabase {
  private sql = getSql()
  private tablesCreated = false

  // Método para garantir que as tabelas existam
  async ensureTablesExist(): Promise<void> {
    if (this.tablesCreated) return

    try {
      // Criar tabela usuarios
      await this.sql`
        CREATE TABLE IF NOT EXISTS public.usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          senha VARCHAR(255) NOT NULL,
          telefone VARCHAR(20),
          cpf VARCHAR(14),
          banco VARCHAR(100),
          agencia VARCHAR(20),
          conta VARCHAR(30),
          tipo_conta VARCHAR(20),
          pix VARCHAR(255),
          tipo_usuario VARCHAR(50) DEFAULT 'dj',
          cargo VARCHAR(100),
          bio TEXT,
          avatar TEXT,
          ativo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Adicionar colunas se não existirem
      await this.sql`
        ALTER TABLE public.usuarios 
        ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(50) DEFAULT 'dj'
      `

      await this.sql`
        ALTER TABLE public.usuarios 
        ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE
      `

      // Criar tabela agenda
      await this.sql`
        CREATE TABLE IF NOT EXISTS public.agenda (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          data_evento DATE NOT NULL,
          hora_inicio TIME NOT NULL,
          hora_fim TIME,
          local VARCHAR(255),
          tipo_evento VARCHAR(50) DEFAULT 'show',
          status VARCHAR(20) DEFAULT 'agendado',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela tarefas
      await this.sql`
        CREATE TABLE IF NOT EXISTS public.tarefas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          status VARCHAR(20) DEFAULT 'pendente',
          prioridade VARCHAR(20) DEFAULT 'media',
          data_vencimento DATE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar tabela documentos
      await this.sql`
        CREATE TABLE IF NOT EXISTS public.documentos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          url TEXT,
          conteudo TEXT,
          tags TEXT[],
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Criar índices para performance
      await this.sql`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON public.usuarios(tipo_usuario)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_agenda_usuario ON public.agenda(usuario_id)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_agenda_data ON public.agenda(data_evento)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON public.tarefas(usuario_id)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status)`
      await this.sql`CREATE INDEX IF NOT EXISTS idx_documentos_usuario ON public.documentos(usuario_id)`

      this.tablesCreated = true
      console.log("✅ Tabelas verificadas/criadas com sucesso")
    } catch (error) {
      console.error("❌ Erro ao criar tabelas:", error)
      throw error
    }
  }

  // Métodos para Usuários
  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT * FROM public.usuarios 
        WHERE email = ${email} AND ativo = true
        LIMIT 1
      `

      return result.length > 0 ? (result[0] as Usuario) : null
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error)
      throw error
    }
  }

  async getUsuarioById(id: string): Promise<Usuario | null> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT * FROM public.usuarios 
        WHERE id = ${id} AND ativo = true
        LIMIT 1
      `

      return result.length > 0 ? (result[0] as Usuario) : null
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error)
      throw error
    }
  }

  async getUsuarios(): Promise<Usuario[]> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT id, nome, email, tipo_usuario, cargo, bio, avatar, ativo, created_at
        FROM public.usuarios 
        WHERE ativo = true
        ORDER BY nome
      `

      return result as Usuario[]
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error)
      throw error
    }
  }

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.getUsuarios()
  }

  async createUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        INSERT INTO public.usuarios (
          nome, email, senha, tipo_usuario, ativo
        ) VALUES (
          ${usuario.nome}, 
          ${usuario.email}, 
          ${usuario.senha}, 
          ${usuario.tipo_usuario || "dj"}, 
          ${usuario.ativo !== false}
        )
        RETURNING *
      `

      return result[0] as Usuario
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      throw error
    }
  }

  // Métodos para Agenda
  async getAgendasByUsuario(usuarioId: string): Promise<Agenda[]> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT * FROM public.agenda 
        WHERE usuario_id = ${usuarioId}
        ORDER BY data_evento DESC, hora_inicio DESC
      `

      return result as Agenda[]
    } catch (error) {
      console.error("Erro ao buscar agendas:", error)
      throw error
    }
  }

  // Alias para compatibilidade
  async getAgendaByUsuario(usuarioId: string): Promise<Agenda[]> {
    return this.getAgendasByUsuario(usuarioId)
  }

  async createAgenda(agenda: Partial<Agenda>): Promise<Agenda> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        INSERT INTO public.agenda (
          usuario_id, titulo, descricao, data_evento, hora_inicio, 
          hora_fim, local, tipo_evento, status
        ) VALUES (
          ${agenda.usuario_id}, ${agenda.titulo}, ${agenda.descricao},
          ${agenda.data_evento}, ${agenda.hora_inicio}, ${agenda.hora_fim},
          ${agenda.local}, ${agenda.tipo_evento || "show"}, 
          ${agenda.status || "agendado"}
        )
        RETURNING *
      `

      return result[0] as Agenda
    } catch (error) {
      console.error("Erro ao criar agenda:", error)
      throw error
    }
  }

  // Métodos para Tarefas
  async getTarefasByUsuario(usuarioId: string): Promise<Tarefa[]> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT * FROM public.tarefas 
        WHERE usuario_id = ${usuarioId}
        ORDER BY created_at DESC
      `

      return result as Tarefa[]
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      throw error
    }
  }

  async createTarefa(tarefa: Partial<Tarefa>): Promise<Tarefa> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        INSERT INTO public.tarefas (
          usuario_id, titulo, descricao, status, prioridade, data_vencimento
        ) VALUES (
          ${tarefa.usuario_id}, ${tarefa.titulo}, ${tarefa.descricao},
          ${tarefa.status || "pendente"}, ${tarefa.prioridade || "media"},
          ${tarefa.data_vencimento}
        )
        RETURNING *
      `

      return result[0] as Tarefa
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      throw error
    }
  }

  // Métodos para Documentos
  async getDocumentosByUsuario(usuarioId: string): Promise<Documento[]> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        SELECT * FROM public.documentos 
        WHERE usuario_id = ${usuarioId}
        ORDER BY created_at DESC
      `

      return result as Documento[]
    } catch (error) {
      console.error("Erro ao buscar documentos:", error)
      throw error
    }
  }

  async createDocumento(documento: Partial<Documento>): Promise<Documento> {
    try {
      await this.ensureTablesExist()

      const result = await this.sql`
        INSERT INTO public.documentos (
          usuario_id, nome, tipo, url, conteudo, tags
        ) VALUES (
          ${documento.usuario_id}, ${documento.nome}, ${documento.tipo},
          ${documento.url}, ${documento.conteudo}, ${documento.tags}
        )
        RETURNING *
      `

      return result[0] as Documento
    } catch (error) {
      console.error("Erro ao criar documento:", error)
      throw error
    }
  }

  // Método de teste de conexão
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.sql`SELECT 1 as test`
      return result.length > 0
    } catch (error) {
      console.error("Erro no teste de conexão:", error)
      return false
    }
  }
}

// Instância singleton
export const neonDB = new NeonDatabase()

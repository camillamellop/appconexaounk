import { neon } from "@neondatabase/serverless"

// Types
export interface Usuario {
  id: number
  nome: string
  email: string
  senha: string
  tipo: "admin" | "dj" | "produtor"
  cargo?: string
  bio?: string
  phone?: string
  location?: string
  specialty?: string
  instagram?: string
  twitter?: string
  avatar?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface AgendaEvent {
  id: number
  usuario_id: number
  titulo: string
  descricao?: string
  data_inicio: string
  data_fim: string
  local?: string
  tipo: string
  status: string
  created_at: string
  updated_at: string
}

export interface Tarefa {
  id: number
  usuario_id: number
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  progresso: number
  data_vencimento?: string
  projeto_id?: number
  created_at: string
  updated_at: string
}

export interface Documento {
  id: number
  usuario_id: number
  nome: string
  tipo: string
  url: string
  tamanho?: number
  created_at: string
  updated_at: string
}

export interface Transacao {
  id: number
  usuario_id: number
  tipo: "receita" | "despesa"
  categoria: string
  descricao?: string
  valor: number
  data_transacao: string
  created_at: string
  updated_at: string
}

export interface GastoFixo {
  id: number
  usuario_id: number
  nome: string
  categoria: string
  valor: number
  dia_vencimento: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface MetaFinanceira {
  id: number
  usuario_id: number
  nome: string
  descricao?: string
  valor_objetivo: number
  valor_atual: number
  data_limite?: string
  status: "ativa" | "concluida" | "cancelada"
  created_at: string
  updated_at: string
}

export interface Projeto {
  id: number
  usuario_id: number
  nome: string
  descricao?: string
  status: "planejamento" | "em_andamento" | "concluido" | "pausado" | "cancelado"
  prioridade: "baixa" | "media" | "alta" | "urgente"
  progresso: number
  data_inicio?: string
  data_fim?: string
  created_at: string
  updated_at: string
}

export function getSql() {
  // Priority order for database URLs
  const url =
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.NEON_POSTGRES_URL ||
    process.env.POSTGRES_URL

  if (!url) {
    throw new Error(
      "❌ Nenhuma variável de ambiente de banco encontrada. " +
        "Configure DATABASE_URL, NEON_DATABASE_URL, ou POSTGRES_URL",
    )
  }

  console.log("🔗 [NEON] Using database URL:", url.substring(0, 20) + "...")
  return neon(url)
}

class NeonDB {
  private sql = getSql()

  async ensureSchema() {
    console.log("🔧 [NEON] Ensuring database schema...")

    try {
      await this.sql`
        CREATE TABLE IF NOT EXISTS public.usuarios (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          senha VARCHAR(255) NOT NULL,
          tipo VARCHAR(50) DEFAULT 'dj' CHECK (tipo IN ('admin', 'dj', 'produtor')),
          cargo VARCHAR(100),
          bio TEXT,
          phone VARCHAR(20),
          location VARCHAR(255),
          specialty VARCHAR(255),
          instagram VARCHAR(255),
          twitter VARCHAR(255),
          avatar TEXT,
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.agenda (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          data_inicio TIMESTAMP NOT NULL,
          data_fim TIMESTAMP NOT NULL,
          local VARCHAR(255),
          tipo VARCHAR(50) DEFAULT 'evento',
          status VARCHAR(50) DEFAULT 'agendado',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.tarefas (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT,
          status VARCHAR(50) DEFAULT 'pendente',
          prioridade VARCHAR(50) DEFAULT 'media',
          progresso INTEGER DEFAULT 0,
          data_vencimento DATE,
          projeto_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.documentos (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          tipo VARCHAR(100) NOT NULL,
          url TEXT NOT NULL,
          tamanho INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.transacoes (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
          categoria VARCHAR(100) NOT NULL,
          descricao TEXT,
          valor DECIMAL(10,2) NOT NULL,
          data_transacao DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.gastos_fixos (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          valor DECIMAL(10,2) NOT NULL,
          dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.metas_financeiras (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          descricao TEXT,
          valor_objetivo DECIMAL(10,2) NOT NULL,
          valor_atual DECIMAL(10,2) DEFAULT 0,
          data_limite DATE,
          status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await this.sql`
        CREATE TABLE IF NOT EXISTS public.projetos (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          descricao TEXT,
          status VARCHAR(50) DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'em_andamento', 'concluido', 'pausado', 'cancelado')),
          prioridade VARCHAR(50) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
          progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
          data_inicio DATE,
          data_fim DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      console.log("✅ [NEON] Database schema ensured successfully")
    } catch (error) {
      console.error("❌ [NEON] Error ensuring schema:", error)
      throw error
    }
  }

  async testConnection(): Promise<boolean> {
    console.log("🧪 [NEON] Testing database connection...")

    try {
      const result = await this.sql`SELECT 1 as test`
      console.log("✅ [NEON] Connection test successful:", result)
      return true
    } catch (error) {
      console.error("❌ [NEON] Connection test failed:", error)
      return false
    }
  }

  // Usuario methods
  async getUsuarios(): Promise<Usuario[]> {
    console.log("👥 [NEON] Fetching all users...")

    try {
      await this.ensureSchema()
      const users = await this.sql`SELECT * FROM public.usuarios ORDER BY nome`
      console.log(`✅ [NEON] Found ${users.length} users`)
      return users as Usuario[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching users:", error)
      throw error
    }
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    console.log(`🔍 [NEON] Finding user by ID: ${id}`)

    try {
      await this.ensureSchema()
      const users = await this.sql`SELECT * FROM public.usuarios WHERE id = ${id}`
      const user = (users[0] as Usuario) || null
      console.log(`${user ? "✅" : "❌"} [NEON] User ${user ? "found" : "not found"}`)
      return user
    } catch (error) {
      console.error("❌ [NEON] Error finding user by ID:", error)
      throw error
    }
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    console.log(`🔍 [NEON] Finding user by email: ${email}`)

    try {
      await this.ensureSchema()
      const users = await this.sql`SELECT * FROM public.usuarios WHERE email = ${email} AND ativo = true`
      const user = (users[0] as Usuario) || null
      console.log(`${user ? "✅" : "❌"} [NEON] User ${user ? "found" : "not found"}`)
      return user
    } catch (error) {
      console.error("❌ [NEON] Error finding user by email:", error)
      throw error
    }
  }

  async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    console.log("👤 [NEON] Creating new user...")

    try {
      await this.ensureSchema()
      const result = await this.sql`
        INSERT INTO public.usuarios (
          nome, email, senha, tipo, cargo, bio, phone, location, specialty, instagram, twitter, avatar, ativo
        )
        VALUES (
          ${data.nome}, ${data.email}, ${data.senha}, ${data.tipo || "dj"}, 
          ${data.cargo || null}, ${data.bio || null}, ${data.phone || null}, 
          ${data.location || null}, ${data.specialty || null}, ${data.instagram || null}, 
          ${data.twitter || null}, ${data.avatar || null}, ${data.ativo !== false}
        )
        RETURNING *
      `
      console.log("✅ [NEON] User created successfully")
      return result[0] as Usuario
    } catch (error) {
      console.error("❌ [NEON] Error creating user:", error)
      throw error
    }
  }

  async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario> {
    console.log(`👤 [NEON] Updating user ${id}...`)

    try {
      await this.ensureSchema()

      const updateFields = []
      const values = []

      if (data.nome !== undefined) {
        updateFields.push(`nome = $${updateFields.length + 1}`)
        values.push(data.nome)
      }
      if (data.email !== undefined) {
        updateFields.push(`email = $${updateFields.length + 1}`)
        values.push(data.email)
      }
      if (data.senha !== undefined) {
        updateFields.push(`senha = $${updateFields.length + 1}`)
        values.push(data.senha)
      }
      if (data.tipo !== undefined) {
        updateFields.push(`tipo = $${updateFields.length + 1}`)
        values.push(data.tipo)
      }
      if (data.cargo !== undefined) {
        updateFields.push(`cargo = $${updateFields.length + 1}`)
        values.push(data.cargo)
      }
      if (data.bio !== undefined) {
        updateFields.push(`bio = $${updateFields.length + 1}`)
        values.push(data.bio)
      }
      if (data.phone !== undefined) {
        updateFields.push(`phone = $${updateFields.length + 1}`)
        values.push(data.phone)
      }
      if (data.location !== undefined) {
        updateFields.push(`location = $${updateFields.length + 1}`)
        values.push(data.location)
      }
      if (data.specialty !== undefined) {
        updateFields.push(`specialty = $${updateFields.length + 1}`)
        values.push(data.specialty)
      }
      if (data.instagram !== undefined) {
        updateFields.push(`instagram = $${updateFields.length + 1}`)
        values.push(data.instagram)
      }
      if (data.twitter !== undefined) {
        updateFields.push(`twitter = $${updateFields.length + 1}`)
        values.push(data.twitter)
      }
      if (data.avatar !== undefined) {
        updateFields.push(`avatar = $${updateFields.length + 1}`)
        values.push(data.avatar)
      }
      if (data.ativo !== undefined) {
        updateFields.push(`ativo = $${updateFields.length + 1}`)
        values.push(data.ativo)
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

      const result = await this.sql`
        UPDATE public.usuarios 
        SET ${this.sql.unsafe(updateFields.join(", "))}
        WHERE id = ${id}
        RETURNING *
      `

      if (result.length === 0) {
        throw new Error("Usuário não encontrado")
      }

      console.log("✅ [NEON] User updated successfully")
      return result[0] as Usuario
    } catch (error) {
      console.error("❌ [NEON] Error updating user:", error)
      throw error
    }
  }

  async deleteUsuario(id: number): Promise<void> {
    console.log(`🗑️ [NEON] Deleting user ${id}...`)

    try {
      await this.ensureSchema()
      const result = await this.sql`DELETE FROM public.usuarios WHERE id = ${id}`

      if (result.count === 0) {
        throw new Error("Usuário não encontrado")
      }

      console.log("✅ [NEON] User deleted successfully")
    } catch (error) {
      console.error("❌ [NEON] Error deleting user:", error)
      throw error
    }
  }

  // Agenda methods
  async getAgendasByUsuario(usuarioId: number): Promise<AgendaEvent[]> {
    console.log(`📅 [NEON] Fetching agenda for user ${usuarioId}...`)

    try {
      await this.ensureSchema()
      const events = await this.sql`
        SELECT * FROM public.agenda 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY data_inicio ASC
      `
      console.log(`✅ [NEON] Found ${events.length} agenda events`)
      return events as AgendaEvent[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching agenda:", error)
      throw error
    }
  }

  async getAgendaByUsuario(usuarioId: number): Promise<AgendaEvent[]> {
    return this.getAgendasByUsuario(usuarioId)
  }

  async getAgendaHoje(usuarioId: number): Promise<AgendaEvent[]> {
    console.log(`📅 [NEON] Fetching today's agenda for user ${usuarioId}...`)

    try {
      await this.ensureSchema()
      const today = new Date().toISOString().split("T")[0]
      const events = await this.sql`
        SELECT * FROM public.agenda 
        WHERE usuario_id = ${usuarioId} 
        AND DATE(data_inicio) = ${today}
        ORDER BY data_inicio ASC
      `
      console.log(`✅ [NEON] Found ${events.length} events for today`)
      return events as AgendaEvent[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching today agenda:", error)
      throw error
    }
  }

  // Tarefas methods
  async getTarefasByUsuario(usuarioId: number): Promise<Tarefa[]> {
    console.log(`✅ [NEON] Fetching tasks for user ${usuarioId}...`)

    try {
      await this.ensureSchema()
      const tasks = await this.sql`
        SELECT * FROM public.tarefas 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY 
          CASE prioridade 
            WHEN 'urgente' THEN 1 
            WHEN 'alta' THEN 2 
            WHEN 'media' THEN 3 
            WHEN 'baixa' THEN 4 
          END,
          created_at DESC
      `
      console.log(`✅ [NEON] Found ${tasks.length} tasks`)
      return tasks as Tarefa[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching tasks:", error)
      throw error
    }
  }

  // Documentos methods
  async getDocumentosByUsuario(usuarioId: number): Promise<Documento[]> {
    console.log(`📄 [NEON] Fetching documents for user ${usuarioId}...`)

    try {
      await this.ensureSchema()
      const docs = await this.sql`
        SELECT * FROM public.documentos 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY created_at DESC
      `
      console.log(`✅ [NEON] Found ${docs.length} documents`)
      return docs as Documento[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching documents:", error)
      throw error
    }
  }

  // Financial methods
  async getTransacoesByUsuario(usuarioId: number): Promise<Transacao[]> {
    console.log(`💰 [NEON] Fetching transactions for user ${usuarioId}...`)

    try {
      const transactions = await this.sql`
        SELECT * FROM public.transacoes 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY data_transacao DESC, created_at DESC
      `
      console.log(`✅ [NEON] Found ${transactions.length} transactions`)
      return transactions as Transacao[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching transactions:", error)
      throw error
    }
  }

  async getGastosFixosByUsuario(usuarioId: number): Promise<GastoFixo[]> {
    console.log(`🔄 [NEON] Fetching fixed expenses for user ${usuarioId}...`)

    try {
      const expenses = await this.sql`
        SELECT * FROM public.gastos_fixos 
        WHERE usuario_id = ${usuarioId} AND ativo = true
        ORDER BY dia_vencimento ASC
      `
      console.log(`✅ [NEON] Found ${expenses.length} fixed expenses`)
      return expenses as GastoFixo[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching fixed expenses:", error)
      throw error
    }
  }

  async getMetasFinanceirasByUsuario(usuarioId: number): Promise<MetaFinanceira[]> {
    console.log(`🎯 [NEON] Fetching financial goals for user ${usuarioId}...`)

    try {
      const goals = await this.sql`
        SELECT * FROM public.metas_financeiras 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY 
          CASE status 
            WHEN 'ativa' THEN 1 
            WHEN 'concluida' THEN 2 
            WHEN 'cancelada' THEN 3 
          END,
          data_limite ASC NULLS LAST
      `
      console.log(`✅ [NEON] Found ${goals.length} financial goals`)
      return goals as MetaFinanceira[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching financial goals:", error)
      throw error
    }
  }

  async getProjetosByUsuario(usuarioId: number): Promise<Projeto[]> {
    console.log(`🚀 [NEON] Fetching projects for user ${usuarioId}...`)

    try {
      const projects = await this.sql`
        SELECT * FROM public.projetos 
        WHERE usuario_id = ${usuarioId} 
        ORDER BY 
          CASE prioridade 
            WHEN 'urgente' THEN 1 
            WHEN 'alta' THEN 2 
            WHEN 'media' THEN 3 
            WHEN 'baixa' THEN 4 
          END,
          CASE status 
            WHEN 'em_andamento' THEN 1 
            WHEN 'planejamento' THEN 2 
            WHEN 'pausado' THEN 3 
            WHEN 'concluido' THEN 4 
            WHEN 'cancelado' THEN 5 
          END,
          created_at DESC
      `
      console.log(`✅ [NEON] Found ${projects.length} projects`)
      return projects as Projeto[]
    } catch (error) {
      console.error("❌ [NEON] Error fetching projects:", error)
      throw error
    }
  }

  // CRUD operations for transactions
  async createTransacao(data: Omit<Transacao, "id" | "created_at" | "updated_at">): Promise<Transacao> {
    console.log("💰 [NEON] Creating new transaction...")

    try {
      const result = await this.sql`
        INSERT INTO public.transacoes (usuario_id, tipo, categoria, descricao, valor, data_transacao)
        VALUES (${data.usuario_id}, ${data.tipo}, ${data.categoria}, ${data.descricao || null}, ${data.valor}, ${data.data_transacao})
        RETURNING *
      `
      console.log("✅ [NEON] Transaction created successfully")
      return result[0] as Transacao
    } catch (error) {
      console.error("❌ [NEON] Error creating transaction:", error)
      throw error
    }
  }

  // CRUD operations for fixed expenses
  async createGastoFixo(data: Omit<GastoFixo, "id" | "created_at" | "updated_at">): Promise<GastoFixo> {
    console.log("🔄 [NEON] Creating new fixed expense...")

    try {
      const result = await this.sql`
        INSERT INTO public.gastos_fixos (usuario_id, nome, categoria, valor, dia_vencimento, ativo)
        VALUES (${data.usuario_id}, ${data.nome}, ${data.categoria}, ${data.valor}, ${data.dia_vencimento}, ${data.ativo})
        RETURNING *
      `
      console.log("✅ [NEON] Fixed expense created successfully")
      return result[0] as GastoFixo
    } catch (error) {
      console.error("❌ [NEON] Error creating fixed expense:", error)
      throw error
    }
  }

  // CRUD operations for financial goals
  async createMetaFinanceira(data: Omit<MetaFinanceira, "id" | "created_at" | "updated_at">): Promise<MetaFinanceira> {
    console.log("🎯 [NEON] Creating new financial goal...")

    try {
      const result = await this.sql`
        INSERT INTO public.metas_financeiras (usuario_id, nome, descricao, valor_objetivo, valor_atual, data_limite, status)
        VALUES (${data.usuario_id}, ${data.nome}, ${data.descricao || null}, ${data.valor_objetivo}, ${data.valor_atual}, ${data.data_limite || null}, ${data.status})
        RETURNING *
      `
      console.log("✅ [NEON] Financial goal created successfully")
      return result[0] as MetaFinanceira
    } catch (error) {
      console.error("❌ [NEON] Error creating financial goal:", error)
      throw error
    }
  }

  // CRUD operations for projects
  async createProjeto(data: Omit<Projeto, "id" | "created_at" | "updated_at">): Promise<Projeto> {
    console.log("🚀 [NEON] Creating new project...")

    try {
      const result = await this.sql`
        INSERT INTO public.projetos (usuario_id, nome, descricao, status, prioridade, progresso, data_inicio, data_fim)
        VALUES (${data.usuario_id}, ${data.nome}, ${data.descricao || null}, ${data.status}, ${data.prioridade}, ${data.progresso}, ${data.data_inicio || null}, ${data.data_fim || null})
        RETURNING *
      `
      console.log("✅ [NEON] Project created successfully")
      return result[0] as Projeto
    } catch (error) {
      console.error("❌ [NEON] Error creating project:", error)
      throw error
    }
  }
}

export const neonDB = new NeonDB()
export default neonDB

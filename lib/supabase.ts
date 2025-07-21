import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types baseados no schema do Supabase
export interface Usuario {
  id: string
  nome: string
  email: string
  telefone?: string
  cpf?: string
  banco?: string
  agencia?: string
  conta?: string
  tipo_conta?: string
  pix?: string
  tipo: string
  cargo?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface AgendaEvent {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  data_evento: string
  hora_inicio?: string
  hora_fim?: string
  local?: string
  status: string
  tipo: string
  valor?: number
  observacoes?: string
  created_at?: string
  updated_at?: string
}

export interface Tarefa {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  data_vencimento?: string
  categoria?: string
  cor?: string
  icone?: string
  created_at?: string
  updated_at?: string
}

export interface Documento {
  id: string
  usuario_id: string
  nome: string
  tipo: string
  url?: string
  tamanho?: number
  categoria?: string
  descricao?: string
  created_at?: string
  updated_at?: string
}

export interface DJ {
  id: string
  usuario_id: string
  generos_musicais?: string[]
  equipamentos?: string[]
  experiencia_anos?: number
  preco_hora?: number
  disponibilidade?: string[]
  portfolio_url?: string
  created_at?: string
  updated_at?: string
}

export interface Event {
  id: string
  usuario_id: string
  nome: string
  data_evento: string
  local: string
  tipo: string
  status: string
  valor?: number
  descricao?: string
  contato_cliente?: string
  observacoes?: string
  created_at?: string
  updated_at?: string
}

export interface Negotiation {
  id: string
  usuario_id: string
  event_id?: string
  cliente_nome: string
  cliente_contato: string
  valor_proposto: number
  status: string
  data_proposta: string
  observacoes?: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  usuario_id: string
  bio?: string
  website?: string
  social_links?: Record<string, string>
  skills?: string[]
  achievements?: string[]
  created_at?: string
  updated_at?: string
}

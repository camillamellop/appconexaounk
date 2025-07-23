"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

// Tipos básicos
interface Usuario {
  id: string
  nome: string
  email: string
  tipo_usuario: string
  cargo?: string
  bio?: string
  avatar?: string
  ativo: boolean
  created_at: string
}

interface AgendaEvent {
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
}

interface Tarefa {
  id: string
  usuario_id: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  data_vencimento?: string
  created_at: string
}

interface Documento {
  id: string
  usuario_id: string
  nome: string
  tipo: string
  url?: string
  conteudo?: string
  tags?: string[]
  created_at: string
}

// Hook para gerenciar usuários
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = async () => {
    try {
      console.log("🔍 Hook useUsuarios - Iniciando fetch...")
      setLoading(true)
      setError(null)

      const response = await fetch("/api/users")
      const data = await response.json()

      console.log("📦 Hook useUsuarios - Resposta da API:", data)

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`)
      }

      setUsuarios(data.usuarios || [])
      console.log("✅ Hook useUsuarios - Usuários carregados:", data.usuarios?.length || 0)
    } catch (err) {
      console.error("❌ Hook useUsuarios - Erro:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return { usuarios, loading, error, refetch: fetchUsuarios }
}

// Hook para gerenciar agenda
export function useAgendaEvents() {
  const [agenda, setAgenda] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgenda = async (usuario_id?: string) => {
    try {
      console.log("🔍 Hook useAgendaEvents - Iniciando fetch...")
      setLoading(true)
      setError(null)

      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const userId = usuario_id || currentUser.id
      console.log("👤 Hook useAgendaEvents - Usuario ID:", userId)

      const response = await fetch(`/api/agenda?usuario_id=${userId}`)
      const data = await response.json()

      console.log("📦 Hook useAgendaEvents - Resposta da API:", data)

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`)
      }

      setAgenda(data.agenda || [])
      console.log("✅ Hook useAgendaEvents - Eventos carregados:", data.agenda?.length || 0)
    } catch (err) {
      console.error("❌ Hook useAgendaEvents - Erro:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar agenda")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgenda()
  }, [])

  return { agenda, loading, error, refetch: fetchAgenda }
}

// Hook para buscar eventos de HOJE
export function useAgendaHoje() {
  const [eventos, setEventos] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchToday = async () => {
    try {
      console.log("🔍 Hook useAgendaHoje - Iniciando fetch...")
      setLoading(true)
      setError(null)

      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const today = new Date().toISOString().split("T")[0]
      console.log("📅 Hook useAgendaHoje - Data de hoje:", today)
      console.log("👤 Hook useAgendaHoje - Usuario ID:", currentUser.id)

      const response = await fetch(`/api/agenda?usuario_id=${currentUser.id}&date=${today}`)
      const data = await response.json()

      console.log("📦 Hook useAgendaHoje - Resposta da API:", data)

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`)
      }

      setEventos(data.agenda || [])
      console.log("✅ Hook useAgendaHoje - Eventos de hoje carregados:", data.agenda?.length || 0)
    } catch (err) {
      console.error("❌ Hook useAgendaHoje - Erro:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar agenda de hoje")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchToday()
  }, [])

  return { eventos, loading, error, refetch: fetchToday }
}

// Hook para gerenciar tarefas
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTarefas = async (usuario_id?: string) => {
    try {
      console.log("🔍 Hook useTarefas - Iniciando fetch...")
      setLoading(true)
      setError(null)

      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const userId = usuario_id || currentUser.id
      console.log("👤 Hook useTarefas - Usuario ID:", userId)

      const response = await fetch(`/api/tarefas?usuario_id=${userId}`)
      const data = await response.json()

      console.log("📦 Hook useTarefas - Resposta da API:", data)

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`)
      }

      setTarefas(data.tarefas || [])
      console.log("✅ Hook useTarefas - Tarefas carregadas:", data.tarefas?.length || 0)
    } catch (err) {
      console.error("❌ Hook useTarefas - Erro:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTarefas()
  }, [])

  return { tarefas, loading, error, refetch: fetchTarefas }
}

// Hook para gerenciar documentos
export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocumentos = async (usuario_id?: string) => {
    try {
      console.log("🔍 Hook useDocumentos - Iniciando fetch...")
      setLoading(true)
      setError(null)

      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error("Usuário não autenticado")
      }

      const userId = usuario_id || currentUser.id
      console.log("👤 Hook useDocumentos - Usuario ID:", userId)

      const response = await fetch(`/api/documentos?usuario_id=${userId}`)
      const data = await response.json()

      console.log("📦 Hook useDocumentos - Resposta da API:", data)

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`)
      }

      setDocumentos(data.documentos || [])
      console.log("✅ Hook useDocumentos - Documentos carregados:", data.documentos?.length || 0)
    } catch (err) {
      console.error("❌ Hook useDocumentos - Erro:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar documentos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentos()
  }, [])

  return { documentos, loading, error, refetch: fetchDocumentos }
}

// Hook para autenticação
export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 Hook useAuth - Verificando usuário logado...")
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
    console.log("👤 Hook useAuth - Usuário atual:", currentUser?.email || "Nenhum")
  }, [])

  const login = async (email: string, senha: string) => {
    try {
      console.log("🔍 Hook useAuth - Tentativa de login:", email)

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()
      console.log("📦 Hook useAuth - Resposta do login:", data)

      if (!response.ok) {
        throw new Error(data.error || "Erro no login")
      }

      setUser(data.user)
      localStorage.setItem("currentUser", JSON.stringify(data.user))
      console.log("✅ Hook useAuth - Login bem-sucedido:", data.user.email)

      return { success: true, user: data.user }
    } catch (err) {
      console.error("❌ Hook useAuth - Erro no login:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Erro desconhecido",
      }
    }
  }

  const logout = () => {
    console.log("🚪 Hook useAuth - Fazendo logout...")
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return { user, loading, login, logout }
}

// Exports com alias
export { useUsuarios as useUsers }
export { useAgendaEvents as useEvents }
export { useAgendaHoje as useTodayEvents }
export { useTarefas as useTasks }
export { useDocumentos as useDocuments }

// Hook agregado
export function useNeon() {
  const usuarios = useUsuarios()
  const agendaAll = useAgendaEvents()
  const agendaHoje = useAgendaHoje()
  const tarefas = useTarefas()
  const documentos = useDocumentos()

  const loading = usuarios.loading || agendaAll.loading || agendaHoje.loading || tarefas.loading || documentos.loading
  const error = usuarios.error || agendaAll.error || agendaHoje.error || tarefas.error || documentos.error || null

  return {
    usuarios: usuarios.usuarios,
    agenda: agendaAll.agenda,
    agendaHoje: agendaHoje.eventos,
    tarefas: tarefas.tarefas,
    documentos: documentos.documentos,
    loading,
    error,
    refetch: {
      usuarios: usuarios.refetch,
      agenda: agendaAll.refetch,
      agendaHoje: agendaHoje.refetch,
      tarefas: tarefas.refetch,
      documentos: documentos.refetch,
    },
  }
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"

// Unified types
export interface Usuario {
  id: string
  nome: string
  email: string
  tipo: string
  ativo: boolean
  created_at: string
}

export interface AgendaEvent {
  id: string
  titulo: string
  descricao?: string
  data_evento: string
  hora_inicio: string
  hora_fim?: string
  local?: string
  tipo: string
  status: string
}

export interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  data_vencimento?: string
}

// Generic hook for paginated data
function useDataFetch<T>(endpoint: string, dependencies: any[] = []) {
  const api = useApi<T[]>()
  const [items, setItems] = useState<T[]>([])

  const fetchData = useCallback(async () => {
    const result = await api.execute(endpoint)
    if (result) {
      setItems(result)
    }
  }, [api, endpoint])

  useEffect(() => {
    fetchData()
  }, dependencies)

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    items,
    loading: api.loading,
    error: api.error,
    refetch,
  }
}

// Specific hooks
export function useUsuarios() {
  return useDataFetch<Usuario>("/api/users")
}

export function useAgenda(userId?: string) {
  const endpoint = userId ? `/api/agenda?usuario_id=${userId}` : "/api/agenda"
  return useDataFetch<AgendaEvent>(endpoint, [userId])
}

export function useTarefas(userId?: string) {
  const endpoint = userId ? `/api/tarefas?usuario_id=${userId}` : "/api/tarefas"
  return useDataFetch<Tarefa>(endpoint, [userId])
}

export function useAgendaHoje() {
  const today = new Date().toISOString().split("T")[0]
  return useDataFetch<AgendaEvent>(`/api/agenda?date=${today}`, [today])
}

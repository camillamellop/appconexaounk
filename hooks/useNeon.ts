"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { isToday } from "date-fns"
import type { AgendaEvent, Tarefa, Documento, Usuario } from "@/lib/neon"

/* ------------------------------------------------------------------
 * AGENDA
 * -----------------------------------------------------------------*/

interface UseAgendaOptions {
  search?: string // filtro de texto opcional
}

/**
 * Retorna todos os eventos da agenda do usuário logado
 * (ou de outro usuário, se o backend permitir).
 */
export function useAgendaEvents({ search = "" }: UseAgendaOptions = {}) {
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!currentUser?.id) return // ainda não logado

    const fetchEvents = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({ usuario_id: currentUser.id })
        if (search.trim()) params.set("search", search.trim())

        const res = await fetch(`/api/agenda?${params.toString()}`)
        const json = await res.json()

        if (!res.ok) throw new Error(json.message || "Erro ao carregar agenda")
        setEvents(json.data as AgendaEvent[])
      } catch (err) {
        console.error("Erro ao buscar agenda:", err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [currentUser?.id, search])

  return { events, loading, error, refetch: () => setEvents([]) }
}

/**
 * Apenas os eventos do dia atual – wrapper sobre useAgendaEvents.
 */
export function useAgendaHoje() {
  const { events, loading, error } = useAgendaEvents()
  const [hoje, setHoje] = useState<AgendaEvent[]>([])

  useEffect(() => {
    if (!loading) {
      setHoje(events.filter((ev) => isToday(new Date(ev.data_inicio))))
    }
  }, [events, loading])

  return { eventos: hoje, loading, error }
}

/* ------------------------------------------------------------------
 * TAREFAS
 * -----------------------------------------------------------------*/

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!currentUser?.id) return

    const fetchTarefas = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/tarefas?usuario_id=${currentUser.id}`)
        const json = await res.json()

        if (!res.ok) throw new Error(json.message || "Erro ao carregar tarefas")
        setTarefas(json.data as Tarefa[])
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchTarefas()
  }, [currentUser?.id])

  return { tarefas, loading, error }
}

/* ------------------------------------------------------------------
 * DOCUMENTOS
 * -----------------------------------------------------------------*/

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!currentUser?.id) return

    const fetchDocs = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/documentos?usuario_id=${currentUser.id}`)
        const json = await res.json()

        if (!res.ok) throw new Error(json.message || "Erro ao carregar documentos")
        setDocumentos(json.data as Documento[])
      } catch (err) {
        console.error("Erro ao buscar documentos:", err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [currentUser?.id])

  return { documentos, loading, error }
}

/* ------------------------------------------------------------------
 * USUÁRIOS (admin)
 * -----------------------------------------------------------------*/

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const admin = isAdmin()

  useEffect(() => {
    if (!admin) {
      setError("Acesso negado: apenas administradores")
      return
    }

    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/users")
        const json = await res.json()

        if (!res.ok) throw new Error(json.message || "Erro ao carregar usuários")
        setUsuarios(json.data as Usuario[])
      } catch (err) {
        console.error("Erro ao buscar usuários:", err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [admin])

  return { usuarios, loading, error }
}

/**
 * Convenience hook that bundles and returns all Neon-related hooks.
 * Components that expect a single "useNeon" entry point can import this.
 */
export function useNeon() {
  return {
    useAgendaEvents,
    useAgendaHoje,
    useTarefas,
    useDocumentos,
    useUsuarios,
  }
}

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import type { AgendaEvent, Tarefa, Documento } from "@/lib/types"

// Hook para eventos da agenda
export function useAgendaEvents() {
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const currentUser = getCurrentUser()

      if (!currentUser) {
        setError("Usuário não autenticado")
        return
      }

      let query = supabase.from("agenda").select(`
          *,
          usuario:usuarios(nome, email, tipo)
        `)

      // Se não for admin, filtrar apenas eventos do usuário
      if (!isAdmin()) {
        query = query.eq("usuario_id", currentUser.id)
      }

      const { data, error: fetchError } = await query.order("data_evento", { ascending: true })

      if (fetchError) {
        console.error("Erro ao buscar eventos:", fetchError)
        setError("Erro ao carregar eventos")
        return
      }

      setEvents(data || [])
      setError(null)
    } catch (err) {
      console.error("Erro no useAgendaEvents:", err)
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const addEvent = async (eventData: Omit<AgendaEvent, "id" | "created_at" | "updated_at">) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from("agenda")
        .insert([{ ...eventData, usuario_id: currentUser.id }])
        .select()

      if (error) throw error

      await fetchEvents() // Recarregar eventos
      return data[0]
    } catch (err) {
      console.error("Erro ao adicionar evento:", err)
      throw err
    }
  }

  const updateEvent = async (id: string, updates: Partial<AgendaEvent>) => {
    try {
      const { error } = await supabase.from("agenda").update(updates).eq("id", id)

      if (error) throw error

      await fetchEvents() // Recarregar eventos
    } catch (err) {
      console.error("Erro ao atualizar evento:", err)
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from("agenda").delete().eq("id", id)

      if (error) throw error

      await fetchEvents() // Recarregar eventos
    } catch (err) {
      console.error("Erro ao deletar evento:", err)
      throw err
    }
  }

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}

// Hook para tarefas
export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTarefas = async () => {
    try {
      setLoading(true)
      const currentUser = getCurrentUser()

      if (!currentUser) {
        setError("Usuário não autenticado")
        return
      }

      let query = supabase.from("tarefas").select(`
          *,
          usuario:usuarios(nome, email, tipo)
        `)

      // Se não for admin, filtrar apenas tarefas do usuário
      if (!isAdmin()) {
        query = query.eq("usuario_id", currentUser.id)
      }

      const { data, error: fetchError } = await query.order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Erro ao buscar tarefas:", fetchError)
        setError("Erro ao carregar tarefas")
        return
      }

      setTarefas(data || [])
      setError(null)
    } catch (err) {
      console.error("Erro no useTarefas:", err)
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTarefas()
  }, [])

  const addTarefa = async (tarefaData: Omit<Tarefa, "id" | "created_at" | "updated_at">) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from("tarefas")
        .insert([{ ...tarefaData, usuario_id: currentUser.id }])
        .select()

      if (error) throw error

      await fetchTarefas() // Recarregar tarefas
      return data[0]
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err)
      throw err
    }
  }

  const updateTarefa = async (id: string, updates: Partial<Tarefa>) => {
    try {
      const { error } = await supabase.from("tarefas").update(updates).eq("id", id)

      if (error) throw error

      await fetchTarefas() // Recarregar tarefas
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err)
      throw err
    }
  }

  const deleteTarefa = async (id: string) => {
    try {
      const { error } = await supabase.from("tarefas").delete().eq("id", id)

      if (error) throw error

      await fetchTarefas() // Recarregar tarefas
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err)
      throw err
    }
  }

  return {
    tarefas,
    loading,
    error,
    addTarefa,
    updateTarefa,
    deleteTarefa,
    refetch: fetchTarefas,
  }
}

// Hook para documentos
export function useDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocumentos = async () => {
    try {
      setLoading(true)
      const currentUser = getCurrentUser()

      if (!currentUser) {
        setError("Usuário não autenticado")
        return
      }

      let query = supabase.from("documentos").select(`
          *,
          usuario:usuarios(nome, email, tipo)
        `)

      // Se não for admin, filtrar apenas documentos do usuário
      if (!isAdmin()) {
        query = query.eq("usuario_id", currentUser.id)
      }

      const { data, error: fetchError } = await query.order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Erro ao buscar documentos:", fetchError)
        setError("Erro ao carregar documentos")
        return
      }

      setDocumentos(data || [])
      setError(null)
    } catch (err) {
      console.error("Erro no useDocumentos:", err)
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentos()
  }, [])

  const addDocumento = async (documentoData: Omit<Documento, "id" | "created_at" | "updated_at">) => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) throw new Error("Usuário não autenticado")

      const { data, error } = await supabase
        .from("documentos")
        .insert([{ ...documentoData, usuario_id: currentUser.id }])
        .select()

      if (error) throw error

      await fetchDocumentos() // Recarregar documentos
      return data[0]
    } catch (err) {
      console.error("Erro ao adicionar documento:", err)
      throw err
    }
  }

  const updateDocumento = async (id: string, updates: Partial<Documento>) => {
    try {
      const { error } = await supabase.from("documentos").update(updates).eq("id", id)

      if (error) throw error

      await fetchDocumentos() // Recarregar documentos
    } catch (err) {
      console.error("Erro ao atualizar documento:", err)
      throw err
    }
  }

  const deleteDocumento = async (id: string) => {
    try {
      const { error } = await supabase.from("documentos").delete().eq("id", id)

      if (error) throw error

      await fetchDocumentos() // Recarregar documentos
    } catch (err) {
      console.error("Erro ao deletar documento:", err)
      throw err
    }
  }

  return {
    documentos,
    loading,
    error,
    addDocumento,
    updateDocumento,
    deleteDocumento,
    refetch: fetchDocumentos,
  }
}

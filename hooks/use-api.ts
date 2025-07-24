"use client"

import { useState, useCallback } from "react"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      const result: ApiResponse<T> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP ${response.status}`)
      }

      setState({
        data: result.data || null,
        loading: false,
        error: null,
      })

      return result.data || null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

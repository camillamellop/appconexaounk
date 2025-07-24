"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthService, type AuthUser } from "@/lib/auth/auth-service"

const TOKEN_KEY = "@unk/auth-token"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
          const validatedUser = await AuthService.validateToken(token)
          setUser(validatedUser)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const result = await AuthService.login(email, senha)

      if (result) {
        localStorage.setItem(TOKEN_KEY, result.token)
        setUser(result.user)
        return { success: true, user: result.user }
      }

      return { success: false, error: "Credenciais inválidas" }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro no login"
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const isAdmin = useCallback(() => {
    return user?.tipo === "admin"
  }, [user])

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  }
}

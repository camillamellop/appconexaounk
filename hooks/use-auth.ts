"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: number
  nome: string
  email: string
  tipo: "admin" | "dj" | "produtor"
  ativo: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, senha: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)

        // Redirecionar baseado no tipo de usuário
        if (data.user.tipo === "admin") {
          router.push("/admin-dashboard")
        } else {
          router.push("/dashboard")
        }

        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error || "Credenciais inválidas" }
      }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Erro no logout:", error)
    } finally {
      setUser(null)
      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}

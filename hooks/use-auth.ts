"use client"

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  nome: string
  email: string
  tipo: "admin" | "dj" | "produtor"
  ativo: boolean
}

interface AuthContextType {
  user: User | null
  login: (
    email: string,
    senha: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verifica se está no cliente antes de acessar localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Erro ao parsear usuário do localStorage:", error)
          localStorage.removeItem("user")
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        return { success: false, error: "Credenciais inválidas" }
      }

      const userData = await response.json()
      setUser(userData.user)
      
      // Verifica se está no cliente antes de salvar no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData.user))
      }

      return { success: true, user: userData.user }
    } catch (error) {
      console.error("Erro no login:", error)
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  const logout = () => {
    setUser(null)
    // Verifica se está no cliente antes de remover do localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { restoreSession, isAuthenticated, maintainSession } from "@/lib/auth"
import type { Usuario } from "@/lib/auth"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<Usuario | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing authentication...")

        // Tentar restaurar sessão existente
        const restoredUser = restoreSession()

        if (restoredUser) {
          console.log("✅ Session restored:", restoredUser.nome)
          setUser(restoredUser)

          // Buscar dados atualizados em background
          try {
            const updatedUser = await maintainSession()
            if (updatedUser) {
              setUser(updatedUser)
            }
          } catch (error) {
            console.warn("⚠️ Could not refresh user data:", error)
          }
        } else {
          console.log("ℹ️ No session to restore")
          setUser(null)
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const isLoginPage = pathname === "/login"
    const userIsAuthenticated = isAuthenticated()

    console.log("🔍 Auth check:", {
      pathname,
      isLoginPage,
      userIsAuthenticated,
      hasUser: !!user,
    })

    if (!isLoginPage && !userIsAuthenticated) {
      console.log("🚫 Not authenticated, redirecting to login")
      router.push("/login")
    } else if (isLoginPage && userIsAuthenticated) {
      console.log("✅ Already authenticated, redirecting to dashboard")
      router.push("/")
    }
  }, [isLoading, pathname, user, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Verificando sessão...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

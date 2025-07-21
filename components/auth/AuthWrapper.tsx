"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import type { Usuario } from "@/lib/supabase"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/login"

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = getCurrentUser()
        console.log("Current user:", currentUser) // Debug log

        setUser(currentUser)
        setIsLoading(false)

        // Se não há usuário e não está na página de login, redirecionar
        if (!currentUser && !isLoginPage) {
          console.log("No user found, redirecting to login") // Debug log
          router.push("/login")
          return
        }

        // Se há usuário e está na página de login, redirecionar para home
        if (currentUser && isLoginPage) {
          console.log("User found on login page, redirecting to home") // Debug log
          router.push("/")
          return
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setUser(null)
        setIsLoading(false)
        if (!isLoginPage) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [pathname, router, isLoginPage])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  // Login page - render without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Protected pages - only render if user is authenticated
  if (user) {
    return <>{children}</>
  }

  // Fallback - should not reach here due to redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-white text-lg">Redirecionando...</div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/layout/BottomNavigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          
          // Verificar se é admin
          if (parsedUser.tipo !== "admin") {
            router.push("/dashboard")
            return
          }
          
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing stored user:", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!user || user.tipo !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-slate-400">Você precisa ser um administrador para acessar esta área.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}

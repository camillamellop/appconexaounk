"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Hoje from "@/components/dashboard/Hoje"
import ProjetosTarefas from "@/components/dashboard/ProjetosTarefas"
import NotasFixas from "@/components/dashboard/NotasFixas"
import Metas from "@/components/dashboard/Metas"
import AutoCuidadoCTA from "@/components/dashboard/AutoCuidadoCTA"

interface User {
  id: number
  nome: string
  email: string
  tipo: string
  ativo: boolean
}

interface DashboardStats {
  projetos: number
  tarefas: number
  eventos: number
  receitas: number
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    projetos: 0,
    tarefas: 0,
    eventos: 0,
    receitas: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)

        // Redirect admin users to admin dashboard
        if (parsedUser.tipo === "admin") {
          router.push("/admin/dashboard")
          return
        }

        setUser(parsedUser)
        fetchDashboardStats(parsedUser.id)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchDashboardStats = async (userId: number) => {
    try {
      // Mock data for user dashboard
      setStats({
        projetos: 5,
        tarefas: 12,
        eventos: 3,
        receitas: 15000,
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Redirecionando...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 bg-slate-900 min-h-screen">
      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Hoje />
        <ProjetosTarefas />
      </div>

      {/* Notas Fixas */}
      <NotasFixas />

      {/* Grid inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Metas />
        <AutoCuidadoCTA />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/layout/BottomNavigation"

interface AdminStats {
  totalUsuarios: number
  usuariosAtivos: number
  totalEventos: number
  eventosHoje: number
  totalProjetos: number
  projetosAtivos: number
  receita: number
  crescimento: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalEventos: 0,
    eventosHoje: 0,
    totalProjetos: 0,
    projetosAtivos: 0,
    receita: 0,
    crescimento: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se está logado e é admin
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.tipo !== "admin") {
            router.push("/dashboard")
            return
          }
          setUser(userData)
        } catch (error) {
          router.push("/login")
          return
        }
      } else {
        router.push("/login")
        return
      }
    }

    // Aqui você pode buscar estatísticas reais da sua API
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Bem-vindo, {user?.nome}</p>
          </div>
        </div>
      </div>

      {/* Espaço reservado para cards e estatísticas reais */}
      <div className="p-4 space-y-4">
        {/* Adicione aqui seus cards e componentes reais */}
      </div>

      <BottomNavigation />
    </div>
  )
}

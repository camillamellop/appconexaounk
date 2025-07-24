"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.tipo !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!user || user.tipo !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Painel administrativo - {user.nome}</p>
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Usuários</h2>
            <p className="text-3xl font-bold text-blue-400">12</p>
            <p className="text-gray-400">Total de usuários</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">DJs Ativos</h2>
            <p className="text-3xl font-bold text-green-400">8</p>
            <p className="text-gray-400">DJs online</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Projetos</h2>
            <p className="text-3xl font-bold text-purple-400">24</p>
            <p className="text-gray-400">Projetos ativos</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Eventos</h2>
            <p className="text-3xl font-bold text-yellow-400">6</p>
            <p className="text-gray-400">Próximos eventos</p>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Gerenciamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors">
              Gerenciar Usuários
            </button>
            <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors">
              Configurações do Sistema
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors">Relatórios</button>
          </div>
        </div>
      </div>
    </div>
  )
}

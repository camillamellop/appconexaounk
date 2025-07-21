"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, isAdmin, isDJ } from "@/lib/auth"
import type { Usuario } from "@/lib/supabase"
import Header from "@/components/layout/Header"
import BottomNavigation from "@/components/layout/BottomNavigation"
import Hoje from "@/components/dashboard/Hoje"
import NotasFixas from "@/components/dashboard/NotasFixas"
import Metas from "@/components/dashboard/Metas"
import ProjetosTarefas from "@/components/dashboard/ProjetosTarefas"
import AutoCuidadoCTA from "@/components/dashboard/AutoCuidadoCTA"

export default function HomePage() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = "/login"
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userIsAdmin = isAdmin()
  const userIsDJ = isDJ()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Olá, {user.nome.split(" ")[0]}! 👋</h1>
              <p className="text-slate-400">
                {userIsAdmin && "Painel administrativo - "}
                {userIsDJ && "Painel do DJ - "}
                Bem-vindo de volta à plataforma UNK
              </p>
            </div>
            {userIsAdmin && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <span className="text-red-400 text-sm font-medium">Modo Administrador</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Hoje />
            <ProjetosTarefas />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <NotasFixas />
            <Metas />
            <AutoCuidadoCTA />
          </div>
        </div>

        {/* Admin Section */}
        {userIsAdmin && (
          <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Painel Administrativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium">Usuários Totais</h3>
                <p className="text-2xl font-bold text-blue-400">4</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium">DJs Ativos</h3>
                <p className="text-2xl font-bold text-green-400">3</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium">Eventos Hoje</h3>
                <p className="text-2xl font-bold text-orange-400">2</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}

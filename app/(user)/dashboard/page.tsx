"use client"

import { useAuth } from "@/hooks/use-auth"
import { Hoje } from "@/components/dashboard/Hoje"
import { ProjetosTarefas } from "@/components/dashboard/ProjetosTarefas"
import { NotasFixas } from "@/components/dashboard/NotasFixas"
import { Metas } from "@/components/dashboard/Metas"
import { AutoCuidadoCTA } from "@/components/dashboard/AutoCuidadoCTA"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function UserDashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6">
      {/* Header com saudação */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Olá, {user.nome.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          <Hoje />
          <NotasFixas />
        </div>

        {/* Coluna direita */}
        <div className="space-y-6">
          <ProjetosTarefas />
          <Metas />
        </div>
      </div>

      {/* AutoCuidado CTA */}
      <div className="mt-8">
        <AutoCuidadoCTA />
      </div>
    </div>
  )
}

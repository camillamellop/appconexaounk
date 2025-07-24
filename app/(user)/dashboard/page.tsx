"use client"

import { useAuth } from "@/hooks/use-auth"
import { Hoje } from "@/components/dashboard/Hoje"
import { ProjetosTarefas } from "@/components/dashboard/ProjetosTarefas"
import { NotasFixas } from "@/components/dashboard/NotasFixas"
import { Metas } from "@/components/dashboard/Metas"
import { AutoCuidadoCTA } from "@/components/dashboard/AutoCuidadoCTA"

export default function UserDashboard() {
  const { user } = useAuth()

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white">Olá, {user?.nome}!</h1>
        <p className="text-gray-400 text-sm">Vamos começar o dia com energia</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Hoje />
        <ProjetosTarefas />
      </div>

      <NotasFixas />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Metas />
        <AutoCuidadoCTA />
      </div>
    </div>
  )
}

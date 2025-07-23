"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Calendar, CheckSquare, DollarSign, FileText, TrendingUp } from "lucide-react"
import Hoje from "@/components/dashboard/Hoje"
import ProjetosTarefas from "@/components/dashboard/ProjetosTarefas"
import NotasFixas from "@/components/dashboard/NotasFixas"
import Metas from "@/components/dashboard/Metas"
import AutoCuidadoCTA from "@/components/dashboard/AutoCuidadoCTA"

interface DashboardStats {
  projetos: number
  tarefas: number
  eventos: number
  receitas: number
}

export default function HomePage() {
  const [user, setUser] = useState(getCurrentUser())
  const [stats, setStats] = useState<DashboardStats>({
    projetos: 0,
    tarefas: 0,
    eventos: 0,
    receitas: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    fetchDashboardStats(currentUser.id)
  }, [router])

  const fetchDashboardStats = async (userId: number) => {
    try {
      const [projetosRes, tarefasRes, agendaRes, transacoesRes] = await Promise.all([
        fetch(`/api/projetos?usuario_id=${userId}`),
        fetch(`/api/tarefas?usuario_id=${userId}`),
        fetch(`/api/agenda?usuario_id=${userId}`),
        fetch(`/api/transacoes?usuario_id=${userId}`),
      ])

      const [projetos, tarefas, agenda, transacoes] = await Promise.all([
        projetosRes.json(),
        tarefasRes.json(),
        agendaRes.json(),
        transacoesRes.json(),
      ])

      const receitas = transacoes
        .filter((t: any) => t.tipo === "receita")
        .reduce((sum: number, t: any) => sum + Number.parseFloat(t.valor), 0)

      setStats({
        projetos: projetos.length,
        tarefas: tarefas.filter((t: any) => t.status !== "concluida").length,
        eventos: agenda.length,
        receitas: receitas,
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UNK Dashboard</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user.nome}!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/agenda")}>
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/projetos")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Projetos
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/unkash")}>
                <DollarSign className="h-4 w-4 mr-2" />
                Financeiro
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.projetos}</div>
              <p className="text-xs text-muted-foreground">Projetos em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.tarefas}</div>
              <p className="text-xs text-muted-foreground">Tarefas para concluir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.eventos}</div>
              <p className="text-xs text-muted-foreground">Shows e compromissos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `R$ ${stats.receitas.toLocaleString("pt-BR")}`}
              </div>
              <p className="text-xs text-muted-foreground">Total de receitas</p>
            </CardContent>
          </Card>
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
      </div>
    </div>
  )
}

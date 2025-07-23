"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Calendar, CheckSquare, DollarSign, FileText, TrendingUp } from "lucide-react"

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

export default function HomePage() {
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
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        if (parsedUser.tipo === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/user/dashboard")
        }
      } catch (error) {
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchDashboardStats = async (userId: number) => {
    try {
      // Mock data for now since API might not be working
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

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecionando...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
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
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
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
              <div className="text-2xl font-bold">{stats.projetos}</div>
              <p className="text-xs text-muted-foreground">Projetos em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tarefas}</div>
              <p className="text-xs text-muted-foreground">Tarefas para concluir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.eventos}</div>
              <p className="text-xs text-muted-foreground">Shows e compromissos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.receitas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Total de receitas</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao UNK Dashboard!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Sua plataforma completa de gestão para DJs e produtores musicais está funcionando. Use o menu acima para
              navegar pelas diferentes seções.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

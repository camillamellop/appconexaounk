"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Users, Calendar, DollarSign, TrendingUp, Activity, Target } from "lucide-react"

interface AnalyticsData {
  users: {
    total: number
    active: number
    new_this_month: number
    by_type: { type: string; count: number }[]
  }
  agenda: {
    total_events: number
    upcoming: number
    completed: number
    monthly_trend: { month: string; events: number }[]
  }
  projects: {
    total: number
    completed: number
    in_progress: number
    completion_rate: number
  }
  financial: {
    total_revenue: number
    total_expenses: number
    monthly_trend: { month: string; revenue: number; expenses: number }[]
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        users: {
          total: 156,
          active: 142,
          new_this_month: 23,
          by_type: [
            { type: "DJ", count: 89 },
            { type: "Produtor", count: 52 },
            { type: "Admin", count: 15 },
          ],
        },
        agenda: {
          total_events: 324,
          upcoming: 45,
          completed: 279,
          monthly_trend: [
            { month: "Jan", events: 28 },
            { month: "Fev", events: 32 },
            { month: "Mar", events: 41 },
            { month: "Abr", events: 38 },
            { month: "Mai", events: 45 },
            { month: "Jun", events: 52 },
          ],
        },
        projects: {
          total: 89,
          completed: 67,
          in_progress: 22,
          completion_rate: 75.3,
        },
        financial: {
          total_revenue: 125400,
          total_expenses: 89200,
          monthly_trend: [
            { month: "Jan", revenue: 18500, expenses: 12300 },
            { month: "Fev", revenue: 22100, expenses: 15600 },
            { month: "Mar", revenue: 19800, expenses: 14200 },
            { month: "Abr", revenue: 25300, expenses: 18100 },
            { month: "Mai", revenue: 21700, expenses: 15800 },
            { month: "Jun", revenue: 18000, expenses: 13200 },
          ],
        },
      }

      setData(mockData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar dados de analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Analytics & Relatórios
          </h2>
          <p className="text-gray-600">Visão geral do desempenho da plataforma</p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="7d">7 dias</TabsTrigger>
            <TabsTrigger value="30d">30 dias</TabsTrigger>
            <TabsTrigger value="90d">90 dias</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold">{data.users.active}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />+{data.users.new_this_month} este mês
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eventos Futuros</p>
                <p className="text-2xl font-bold">{data.agenda.upcoming}</p>
                <p className="text-xs text-gray-500">{data.agenda.total_events} total</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{data.projects.completion_rate}%</p>
                <Progress value={data.projects.completion_rate} className="mt-2" />
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">R$ {(data.financial.total_revenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-green-600">
                  Lucro: R$ {((data.financial.total_revenue - data.financial.total_expenses) / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
                <CardDescription>Breakdown dos tipos de usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.users.by_type}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.users.by_type.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
                <CardDescription>Novos usuários por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total de Usuários</span>
                    <Badge variant="secondary">{data.users.total}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Usuários Ativos</span>
                    <Badge variant="default">{data.users.active}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Atividade</span>
                    <Badge variant="outline">{((data.users.active / data.users.total) * 100).toFixed(1)}%</Badge>
                  </div>
                  <Progress value={(data.users.active / data.users.total) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Eventos</CardTitle>
              <CardDescription>Eventos criados por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.agenda.monthly_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
              <CardDescription>Comparativo mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.financial.monthly_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="revenue" fill="#00C49F" name="Receita" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.projects.total}</div>
                <p className="text-sm text-gray-600">projetos criados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{data.projects.completed}</div>
                <p className="text-sm text-gray-600">projetos finalizados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Em Andamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{data.projects.in_progress}</div>
                <p className="text-sm text-gray-600">projetos ativos</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Named export for compatibility
export { Analytics }

// app/(admin)/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FolderOpen, 
  Plus, 
  Activity, 
  Settings,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle
} from "lucide-react"
import { UserManagement } from "@/components/admin/UserManagement"
import { Analytics } from "@/components/admin/Analytics"
import { SystemSettings } from "@/components/admin/SystemSettings"
import { SecuritySettings } from "@/components/admin/SecuritySettings"

interface AdminStats {
  totalUsers: number
  activeProjects: number
  totalRevenue: number
  completedTasks: number
  systemHealth: 'healthy' | 'warning' | 'error'
  activeUsers24h: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    completedTasks: 0,
    systemHealth: 'healthy',
    activeUsers24h: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se usuário está logado e é admin
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        
        if (parsedUser.tipo !== "admin") {
          router.push("/dashboard")
          return
        }
        
        setUser(parsedUser)
        fetchAdminStats()
      } catch (error) {
        console.error("Error parsing stored user:", error)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchAdminStats = async () => {
    try {
      // Simular fetch de dados admin
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalUsers: 24,
        activeProjects: 12,
        totalRevenue: 87500,
        completedTasks: 342,
        systemHealth: 'healthy',
        activeUsers24h: 18
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas admin:", error)
    } finally {
      setLoading(false)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando dashboard admin...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-slate-400 mb-4">Você precisa ser um administrador para acessar esta página.</p>
          <Button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-700">
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-slate-400">Bem-vindo, {user.nome} • Sistema UNK</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={stats.systemHealth === 'healthy' ? 'default' : 'destructive'} 
            className={stats.systemHealth === 'healthy' ? 'bg-green-600' : ''}
          >
            Sistema {stats.systemHealth === 'healthy' ? 'Saudável' : 'Com Problemas'}
          </Badge>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Total Usuários</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-xs text-green-400">+{stats.activeUsers24h} últimas 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Projetos Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
                <p className="text-xs text-blue-400">Sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Receita Total</p>
                <p className="text-2xl font-bold text-white">R$ {stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-sm text-slate-400">Tarefas Sistema</p>
                <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
                <p className="text-xs text-orange-400">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Administração */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sistema Hoje */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="bg-slate-900 rounded-t-xl border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Sistema Hoje
                </CardTitle>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-1" />
                  Gerenciar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Backup Automático</p>
                      <p className="text-sm text-slate-400">Executado às 02:00 • Sucesso</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">Concluído</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Relatório Mensal</p>
                      <p className="text-sm text-slate-400">Gerar relatórios de usuários • 85% concluído</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-600">Em Progresso</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Monitoramento Performance</p>
                      <p className="text-sm text-slate-400">Verificar métricas de sistema</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-600">Pendente</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Health Score do Sistema</span>
                  <span className="text-sm font-medium text-white">94%</span>
                </div>
                <Progress value={94} className="h-2 bg-slate-600" />
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-orange-400" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Novo usuário registrado</p>
                    <p className="text-slate-400 text-xs">2 minutos atrás</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Backup executado com sucesso</p>
                    <p className="text-slate-400 text-xs">1 hora atrás</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Configuração atualizada</p>
                    <p className="text-slate-400 text-xs">3 horas atrás</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Alertas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Uso de CPU acima de 80%</p>
                    <p className="text-slate-400 text-xs">Monitorar performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Atualização disponível</p>
                    <p className="text-slate-400 text-xs">Versão 2.1.0 disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analytics do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <Analytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <SecuritySettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

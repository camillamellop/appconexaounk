"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, DollarSign, FolderOpen, Plus, Activity, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    // Simular dados do admin
    setStats({
      totalUsers: 12,
      activeProjects: 8,
      totalRevenue: 45000,
      completedTasks: 156,
    })
  }, [])

  return (
    <div className="p-4 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-slate-400">Visão geral do sistema UNK</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Usuários</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-sm text-slate-400">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hoje - Admin View */}
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
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Backup do Sistema</p>
                  <p className="text-sm text-slate-400">Executar às 02:00</p>
                </div>
              </div>
              <Badge variant="destructive">Pendente</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Relatório Mensal</p>
                  <p className="text-sm text-slate-400">Gerar relatórios de usuários</p>
                </div>
              </div>
              <Badge className="bg-blue-600">Em Progresso</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Atualização de Segurança</p>
                  <p className="text-sm text-slate-400">Aplicada com sucesso</p>
                </div>
              </div>
              <Badge className="bg-green-600">Concluído</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projetos & Tarefas - Admin View */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="bg-slate-900 rounded-t-xl border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-purple-400" />
              Projetos & Tarefas do Sistema
            </CardTitle>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1" />
              Novo Projeto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Migração de Banco de Dados</p>
                  <p className="text-sm text-slate-400">Crítico • Vence em 2 dias</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">CRÍTICO</Badge>
                <Badge className="bg-red-600">SISTEMA</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Nova Interface Admin</p>
                  <p className="text-sm text-slate-400">Alta • 5 dias restantes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600">ALTA</Badge>
                <Badge className="bg-blue-600">UI/UX</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Otimização de Performance</p>
                  <p className="text-sm text-slate-400">Média • Sem prazo</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-600">MÉDIA</Badge>
                <Badge className="bg-green-600">PERFORMANCE</Badge>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Progresso geral do sistema</span>
                <span className="text-sm font-medium text-white">78%</span>
              </div>
              <Progress value={78} className="h-2 bg-slate-600">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                  style={{ width: "78%" }}
                />
              </Progress>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

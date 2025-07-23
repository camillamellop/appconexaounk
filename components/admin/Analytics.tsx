"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, DollarSign, TrendingUp, Activity, Clock } from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalEvents: number
  completedTasks: number
  revenue: number
  systemUptime: number
}

interface AnalyticsProps {
  data: AnalyticsData
}

export default function Analytics({ data }: AnalyticsProps) {
  const stats = [
    {
      title: "Total de Usuários",
      value: data.totalUsers,
      icon: Users,
      description: `${data.activeUsers} ativos`,
      trend: "+12%",
      color: "text-blue-600",
    },
    {
      title: "Eventos Agendados",
      value: data.totalEvents,
      icon: Calendar,
      description: "Este mês",
      trend: "+8%",
      color: "text-green-600",
    },
    {
      title: "Receita Total",
      value: `R$ ${data.revenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Últimos 30 dias",
      trend: "+23%",
      color: "text-yellow-600",
    },
    {
      title: "Tarefas Concluídas",
      value: data.completedTasks,
      icon: TrendingUp,
      description: "Esta semana",
      trend: "+15%",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Visão geral do sistema e métricas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividade do Sistema
            </CardTitle>
            <CardDescription>Métricas de performance em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span>23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Network I/O</span>
                <span>89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
            <CardDescription>Status dos serviços e uptime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Server</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">File Storage</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Email Service</span>
              <Badge variant="secondary">Maintenance</Badge>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>System Uptime</span>
                <span>{data.systemUptime}%</span>
              </div>
              <Progress value={data.systemUptime} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
          <CardDescription>Últimas atividades do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "10:30", action: "Usuário jack@unk.com fez login", type: "info" },
              { time: "10:25", action: "Novo evento criado: Show no Clube", type: "success" },
              { time: "10:20", action: "Backup automático concluído", type: "success" },
              { time: "10:15", action: "Tentativa de login falhada para admin@test.com", type: "warning" },
              { time: "10:10", action: "Sistema reiniciado", type: "info" },
            ].map((log, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="text-muted-foreground w-12">{log.time}</span>
                <Badge
                  variant={log.type === "success" ? "default" : log.type === "warning" ? "destructive" : "secondary"}
                  className="w-2 h-2 p-0"
                />
                <span>{log.action}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { Analytics }

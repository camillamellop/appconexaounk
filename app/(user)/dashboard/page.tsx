"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Music, Plus, Clock, Target, Heart, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          
          // Se for admin, redirecionar
          if (parsedUser.tipo === "admin") {
            router.push("/admin-dashboard")
            return
          }
          
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing stored user:", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-4 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, {user.nome}!</h1>
          <p className="text-slate-400">Vamos fazer música hoje? 🎵</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {user.nome.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hoje */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="bg-slate-900 rounded-t-xl border-b border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                Hoje
              </CardTitle>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Show - Club XYZ</p>
                    <p className="text-sm text-slate-400">22:00 - 04:00</p>
                  </div>
                </div>
                <Badge className="bg-red-600">Urgente</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Reunião - Label</p>
                    <p className="text-sm text-slate-400">15:00 - 16:00</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">Agendado</Badge>
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-purple-400 hover:text-purple-300 hover:bg-slate-700/50"
                onClick={() => router.push("/agenda")}
              >
                Ver agenda completa →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projetos & Tarefas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="bg-slate-900 rounded-t-xl border-b border-slate-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Music className="h-5 w-5 mr-2 text-pink-400" />
                Projetos & Tarefas
              </CardTitle>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-1" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Finalizar remix do Track A</p>
                    <p className="text-sm text-slate-400">Urgente • Vence amanhã</p>
                  </div>
                </div>
                <Badge className="bg-red-600">HIGH</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Campanha redes sociais</p>
                    <p className="text-sm text-slate-400">Alta • 3 dias restantes</p>
                  </div>
                </div>
                <Badge className="bg-purple-600">PLANNING</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Comprar cabo XLR</p>
                    <p className="text-sm text-slate-400">Média • Sem prazo</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">TODO</Badge>
              </div>

              <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progresso geral</span>
                  <span className="text-sm font-medium text-white">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-slate-600" />
              </div>

              <Button 
                variant="ghost" 
                className="w-full text-pink-400 hover:text-pink-300 hover:bg-slate-700/50"
                onClick={() => router.push("/projetos")}
              >
                Ver todos os projetos →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notas Fixas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-pink-400" />
              Notas Fixas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <p className="text-white font-medium">Lembrete importante:</p>
              <p className="text-sm text-slate-400 mt-1">
                Enviar rider técnico para o evento de sábado até quinta-feira
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <p className="text-white font-medium">Ideias para próximo set:</p>
              <p className="text-sm text-slate-400 mt-1">
                Testar nova transição entre gêneros • Incluir faixa experimental
              </p>
            </div>
            <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-1" />
              Nova Nota
            </Button>
          </CardContent>
        </Card>

        {/* Metas */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-400" />
              Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Equipamento novo</span>
                <span className="text-white text-sm font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2 bg-slate-600" />
              <p className="text-xs text-slate-400 mt-1">R$ 7.500 / R$ 10.000</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Shows este mês</span>
                <span className="text-white text-sm font-medium">60%</span>
              </div>
              <Progress value={60} className="h-2 bg-slate-600" />
              <p className="text-xs text-slate-400 mt-1">6 / 10 shows</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Seguidores no Instagram</span>
                <span className="text-white text-sm font-medium">40%</span>
              </div>
              <Progress value={40} className="h-2 bg-slate-600" />
              <p className="text-xs text-slate-400 mt-1">4k / 10k seguidores</p>
            </div>

            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Nova Meta
            </Button>
          </CardContent>
        </Card>

        {/* AutoCuidado */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-400" />
              AutoCuidado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-2">Cuidar de si mesmo é fundamental para o sucesso na carreira musical</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Beba água
                  </span>
                  <span className="text-blue-400">6/8 copos hoje</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    Dormir 8h
                  </span>
                  <span className="text-orange-400">Meta: 23:00</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Meditação
                  </span>
                  <span className="text-green-400">10 min restantes</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              onClick={() => router.push("/autocuidado")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Abrir AutoCuidado
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

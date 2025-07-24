"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Music, Target, TrendingUp, Clock, Plus, CheckCircle, AlertCircle, Heart, Droplets, Moon, Activity } from 'lucide-react'
import BottomNavigation from "@/components/layout/BottomNavigation"

interface UserStats {
  tarefasPendentes: number
  tarefasConcluidas: number
  eventosProximos: number
  projetosAtivos: number
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    tarefasPendentes: 0,
    tarefasConcluidas: 0,
    eventosProximos: 0,
    projetosAtivos: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se está logado
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.tipo === "admin") {
            router.push("/admin-dashboard")
            return
          }
          setUser(userData)
        } catch (error) {
          router.push("/login")
          return
        }
      } else {
        router.push("/login")
        return
      }
    }

    // Simular carregamento de dados
    const loadUserData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          tarefasPendentes: 5,
          tarefasConcluidas: 12,
          eventosProximos: 3,
          projetosAtivos: 2
        })
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Olá, {user?.nome}! 👋</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
              {user?.tipo?.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hoje Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Hoje
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Show - Club XYZ</p>
                  <p className="text-gray-400 text-sm">22:00 - 04:00</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Reunião - Label</p>
                  <p className="text-gray-400 text-sm">15:00 - 16:00</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full text-purple-400 hover:text-purple-300">
              Ver agenda completa →
            </Button>
          </CardContent>
        </Card>

        {/* Projetos & Tarefas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-500" />
              Projetos & Tarefas
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Finalizar remix do Track A</p>
                  <p className="text-gray-400 text-xs">Urgente • Vence amanhã</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Campanha redes sociais</p>
                  <p className="text-gray-400 text-xs">Alta • 3 dias restantes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Comprar cabo XLR</p>
                  <p className="text-gray-400 text-xs">Média • Sem prazo</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progresso geral</span>
                <span className="text-white">65%</span>
              </div>
              <Progress value={65} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Notas Fixas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-pink-500" />
              Notas Fixas
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <p className="text-white font-medium">Lembrete importante:</p>
              <p className="text-gray-400 text-sm">Enviar rider técnico para o evento de sábado até quinta-feira</p>
            </div>
            
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <p className="text-white font-medium">Ideias para próximo set:</p>
              <p className="text-gray-400 text-sm">Testar nova transição entre gêneros • Incluir faixa experimental</p>
            </div>
          </CardContent>
        </Card>

        {/* Metas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Metas
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Equipamento novo</span>
                <span className="text-white text-sm">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-gray-400 text-xs mt-1">R$ 7.500 / R$ 10.000</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Shows este mês</span>
                <span className="text-white text-sm">60%</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-gray-400 text-xs mt-1">6 / 10 shows</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Seguidores no Instagram</span>
                <span className="text-white text-sm">40%</span>
              </div>
              <Progress value={40} className="h-2" />
              <p className="text-gray-400 text-xs mt-1">4k / 10k seguidores</p>
            </div>
          </CardContent>
        </Card>

        {/* AutoCuidado */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              AutoCuidado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-gray-300 mb-4">
                Cuidar de si mesmo é fundamental para o sucesso na carreira musical
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-blue-400 text-sm font-medium">Beba água</p>
                  <p className="text-gray-400 text-xs">6/8 copos hoje</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Moon className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-orange-400 text-sm font-medium">Dormir 8h</p>
                  <p className="text-gray-400 text-xs">Meta: 23:00</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-green-400 text-sm font-medium">Meditação</p>
                  <p className="text-gray-400 text-xs">10 min restantes</p>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Iniciar sessão de autocuidado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}

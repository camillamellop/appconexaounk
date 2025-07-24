"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Music, TrendingUp, Settings, Shield, BarChart3, UserCheck, Clock, DollarSign } from 'lucide-react'
import BottomNavigation from "@/components/layout/BottomNavigation"

interface AdminStats {
  totalUsuarios: number
  usuariosAtivos: number
  totalEventos: number
  eventosHoje: number
  totalProjetos: number
  projetosAtivos: number
  receita: number
  crescimento: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalEventos: 0,
    eventosHoje: 0,
    totalProjetos: 0,
    projetosAtivos: 0,
    receita: 0,
    crescimento: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se está logado e é admin
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.tipo !== "admin") {
            router.push("/dashboard")
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

    // Simular carregamento de estatísticas
    const loadStats = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalUsuarios: 24,
          usuariosAtivos: 18,
          totalEventos: 156,
          eventosHoje: 3,
          totalProjetos: 89,
          projetosAtivos: 34,
          receita: 45600,
          crescimento: 12.5
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas admin:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
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
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Bem-vindo, {user?.nome}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Usuários</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsuarios}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.usuariosAtivos}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Eventos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEventos}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Eventos Hoje</p>
                  <p className="text-2xl font-bold text-white">{stats.eventosHoje}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  R$ {stats.receita.toLocaleString('pt-BR')}
                </p>
                <p className="text-gray-400 text-sm">Este mês</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{stats.crescimento}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-pink-500" />
              Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total de Projetos</span>
                <span className="text-white font-semibold">{stats.totalProjetos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Projetos Ativos</span>
                <span className="text-white font-semibold">{stats.projetosAtivos}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${(stats.projetosAtivos / stats.totalProjetos) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, CheckSquare, Plus, Calendar, Music } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"

interface Projeto {
  id: number
  nome: string
  descricao?: string
  status: string
  data_inicio?: string
  data_fim?: string
  _count: {
    tarefas: number
  }
}

interface Tarefa {
  id: number
  titulo: string
  descricao?: string
  prioridade: string
  status: string
  data_vencimento?: string
  projeto?: {
    nome: string
  }
}

export default function ProjetosTarefas() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    if (user) {
      fetchProjetos()
      fetchTarefasRecentes()
    }
  }, [user])

  const fetchProjetos = async () => {
    try {
      const response = await fetch(`/api/projetos?usuario_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setProjetos(data.slice(0, 6)) // Mostrar apenas os 6 mais recentes
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error)
    }
  }

  const fetchTarefasRecentes = async () => {
    try {
      const response = await fetch(`/api/tarefas?usuario_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setTarefas(data.slice(0, 8)) // Mostrar apenas as 8 mais recentes
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "planejamento":
        return "bg-blue-100 text-blue-800"
      case "pausado":
        return "bg-yellow-100 text-yellow-800"
      case "concluido":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "bg-green-100 text-green-800"
      case "em_andamento":
        return "bg-blue-100 text-blue-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const tarefasMock = [
    {
      id: 1,
      titulo: "Finalizar remix do Track A",
      prioridade: "alta",
      prazo: "Urgente • Vence amanhã",
      cor: "bg-red-500",
    },
    {
      id: 2,
      titulo: "Campanha redes sociais",
      prioridade: "alta",
      prazo: "Alta • 3 dias restantes",
      cor: "bg-purple-500",
    },
    {
      id: 3,
      titulo: "Comprar cabo XLR",
      prioridade: "media",
      prazo: "Média • Sem prazo",
      cor: "bg-blue-500",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projetos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-purple-400" />
            Projetos
          </CardTitle>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {projetos.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum projeto encontrado</p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro projeto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projetos.map((projeto) => (
                <div key={projeto.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{projeto.nome}</h3>
                    <Badge className={getStatusColor(projeto.status)}>{projeto.status}</Badge>
                  </div>

                  {projeto.descricao && <p className="text-xs text-gray-600 mb-3">{projeto.descricao}</p>}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      {projeto._count.tarefas} tarefas
                    </span>

                    {projeto.data_fim && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(projeto.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {projetos.length >= 6 && (
                <Button variant="ghost" className="w-full text-sm">
                  Ver todos os projetos
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tarefas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Music className="h-5 w-5 text-purple-400" />
            Tarefas
          </CardTitle>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {tarefas.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhuma tarefa encontrada</p>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira tarefa
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getPrioridadeColor(tarefa.prioridade)}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{tarefa.titulo}</p>
                    <p className="text-gray-400 text-sm">
                      {tarefa.data_vencimento
                        ? format(parseISO(tarefa.data_vencimento), "dd/MM", { locale: ptBR })
                        : "Sem prazo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Progresso geral</span>
              <span className="text-purple-400 text-sm font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2 bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                style={{ width: "65%" }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Evento {
  id: number
  titulo: string
  descricao?: string
  data_evento: string
  hora_inicio?: string
  hora_fim?: string
  local?: string
  tipo: string
  status: string
  cor?: string
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

export default function Hoje() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    if (user) {
      fetchEventosHoje()
      fetchTarefasUrgentes()
    }
  }, [user])

  const fetchEventosHoje = async () => {
    try {
      const response = await fetch(`/api/agenda?usuario_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        const eventosHoje = data.filter((evento: Evento) => {
          const dataEvento = parseISO(evento.data_evento)
          return isToday(dataEvento) || isTomorrow(dataEvento)
        })
        setEventos(eventosHoje)
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error)
    }
  }

  const fetchTarefasUrgentes = async () => {
    try {
      const response = await fetch(`/api/tarefas?usuario_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        const tarefasUrgentes = data.filter((tarefa: Tarefa) => {
          if (!tarefa.data_vencimento) return false
          const dataVencimento = parseISO(tarefa.data_vencimento)
          return (isToday(dataVencimento) || isTomorrow(dataVencimento)) && tarefa.status !== "concluida"
        })
        setTarefas(tarefasUrgentes)
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800"
      case "agendado":
        return "bg-blue-100 text-blue-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
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

  const formatarData = (dataString: string) => {
    const data = parseISO(dataString)
    if (isToday(data)) return "Hoje"
    if (isTomorrow(data)) return "Amanhã"
    return format(data, "dd/MM", { locale: ptBR })
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Hoje
          </CardTitle>
          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          Hoje
        </CardTitle>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eventos */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Eventos ({eventos.length})
          </h3>
          {eventos.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhum evento para hoje ou amanhã</p>
          ) : (
            <div className="space-y-3">
              {eventos.map((evento) => (
                <div key={evento.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${evento.cor || getStatusColor(evento.status)}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{evento.titulo}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {evento.hora_inicio && `${evento.hora_inicio} - ${evento.hora_fim}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tarefas Urgentes */}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Tarefas Urgentes ({tarefas.length})
          </h3>
          {tarefas.length === 0 ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma tarefa urgente! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{tarefa.titulo}</h4>
                    <Badge className={getPrioridadeColor(tarefa.prioridade)}>{tarefa.prioridade}</Badge>
                  </div>

                  {tarefa.descricao && <p className="text-xs text-gray-600 mb-2">{tarefa.descricao}</p>}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {tarefa.data_vencimento && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Vence {formatarData(tarefa.data_vencimento)}
                      </span>
                    )}

                    {tarefa.projeto && <span className="text-purple-600">{tarefa.projeto.nome}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 justify-start"
        >
          Ver agenda completa →
        </Button>
      </CardContent>
    </Card>
  )
}

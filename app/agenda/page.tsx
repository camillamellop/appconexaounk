"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Phone, Mail, Plus } from "lucide-react"
import AgendaHeader from "@/components/agenda/AgendaHeader"
import { CalendarView } from "@/components/agenda/CalendarView"
import { useNeon } from "@/hooks/useNeon"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AgendaPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const { agendaEvents, loading, error } = useNeon()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500"
      case "agendado":
        return "bg-blue-500"
      case "cancelado":
        return "bg-red-500"
      case "concluido":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado"
      case "agendado":
        return "Agendado"
      case "cancelado":
        return "Cancelado"
      case "concluido":
        return "Concluído"
      default:
        return "Agendado"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <AgendaHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Carregando agenda...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <AgendaHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400">Erro ao carregar agenda: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <AgendaHeader />

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              onClick={() => setView("calendar")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendário
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Lista
            </Button>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Calendar View */}
        {view === "calendar" && <CalendarView events={agendaEvents} />}

        {/* List View */}
        {view === "list" && (
          <div className="grid gap-4">
            {agendaEvents.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-white/60" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhum evento agendado</h3>
                  <p className="text-white/60 mb-4">Comece criando seu primeiro evento na agenda</p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Evento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              agendaEvents.map((event) => (
                <Card key={event.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{event.titulo}</CardTitle>
                        <Badge className={`${getStatusColor(event.status)} text-white mt-2`}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white/80 text-sm">
                          {format(new Date(event.data_inicio), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <div className="text-white/60 text-sm">
                          {event.hora_inicio}
                          {event.hora_fim && ` - ${event.hora_fim}`}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {event.descricao && <p className="text-white/80 mb-4">{event.descricao}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.local && (
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.local}</span>
                        </div>
                      )}

                      {event.tipo && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm capitalize">{event.tipo}</span>
                        </div>
                      )}

                      {event.contato_nome && (
                        <div className="flex items-center gap-2 text-white/70">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{event.contato_nome}</span>
                        </div>
                      )}

                      {event.contato_telefone && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{event.contato_telefone}</span>
                        </div>
                      )}

                      {event.contato_email && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{event.contato_email}</span>
                        </div>
                      )}

                      {event.preco && (
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="text-sm font-medium">
                            R$ {event.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>

                    {event.observacoes && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">{event.observacoes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

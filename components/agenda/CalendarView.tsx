"use client"

import { useState, useMemo } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAgendaEvents } from "@/hooks/useNeon"
import { isAdmin } from "@/lib/auth"
import { CalendarIcon } from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "pt-BR": ptBR },
})

const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste período.",
  showMore: (total: number) => `+ Ver mais (${total})`,
}

interface CalendarViewProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}

export default function CalendarView({ selectedDate, onDateSelect }: CalendarViewProps) {
  const { events, loading, error } = useAgendaEvents()
  const [selectedDJ, setSelectedDJ] = useState<string>("all")
  const userIsAdmin = isAdmin()

  // Cores para cada DJ
  const djColors = {
    "suzy@conexaounk.com": "#8B5CF6", // Purple
    "pedro@conexaounk.com": "#06B6D4", // Cyan
    "gustavo@conexaounk.com": "#10B981", // Emerald
    "camilla@conexaounk.com": "#F59E0B", // Amber
  }

  // Filtrar eventos por DJ selecionado
  const filteredEvents = useMemo(() => {
    if (selectedDJ === "all") return events
    return events.filter((event) => event.usuario?.email === selectedDJ)
  }, [events, selectedDJ])

  // Converter eventos para formato do calendário
  const calendarEvents = useMemo(() => {
    return filteredEvents.map((event) => {
      // Compatibilidade: aceita data_evento (legado) ou data_inicio (Neon).
      const startDate = new Date(event.data_evento ?? event.data_inicio)

      // Se tem hora de início, usar ela
      if (event.hora_inicio) {
        const [hours, minutes] = event.hora_inicio.split(":")
        startDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      }

      // Data de fim (mesmo dia por padrão)
      const endDate = new Date(startDate)
      if (event.hora_fim) {
        const [hours, minutes] = event.hora_fim.split(":")
        endDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      } else {
        // Se não tem hora fim, adicionar 2 horas
        endDate.setHours(endDate.getHours() + 2)
      }

      const djEmail = event.usuario?.email || ""
      const color = djColors[djEmail as keyof typeof djColors] || "#6B7280"

      return {
        id: event.id,
        title: event.titulo,
        start: startDate,
        end: endDate,
        resource: {
          ...event,
          color,
        },
      }
    })
  }, [filteredEvents])

  // Obter lista única de DJs
  const availableDJs = useMemo(() => {
    const djSet = new Set()
    events.forEach((event) => {
      if (event.usuario) {
        djSet.add(
          JSON.stringify({
            email: event.usuario.email,
            nome: event.usuario.nome,
          }),
        )
      }
    })
    return Array.from(djSet).map((dj) => JSON.parse(dj as string))
  }, [events])

  // Estilo personalizado para eventos
  const eventStyleGetter = (event: any) => {
    const backgroundColor = event.resource?.color || "#6B7280"
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
        padding: "2px 4px",
      },
    }
  }

  // Componente customizado para eventos
  const EventComponent = ({ event }: { event: any }) => {
    const eventData = event.resource
    return (
      <div className="text-xs">
        <div className="font-medium truncate">{event.title}</div>
        {userIsAdmin && eventData.usuario && (
          <div className="text-white/80 truncate">{eventData.usuario.nome.split(" ")[0]}</div>
        )}
        {eventData.local && <div className="text-white/70 truncate">📍 {eventData.local}</div>}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Erro ao carregar eventos: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros e Controles */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário de Eventos
              {userIsAdmin && (
                <Badge variant="destructive" className="text-xs">
                  Admin View
                </Badge>
              )}
            </CardTitle>

            {/* Filtro por DJ (apenas para admin) */}
            {userIsAdmin && availableDJs.length > 0 && (
              <Select value={selectedDJ} onValueChange={setSelectedDJ}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por DJ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os DJs</SelectItem>
                  {availableDJs.map((dj) => (
                    <SelectItem key={dj.email} value={dj.email}>
                      {dj.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Legenda de cores (apenas para admin) */}
          {userIsAdmin && (
            <div className="mb-4 flex flex-wrap gap-2">
              {availableDJs.map((dj) => {
                const color = djColors[dj.email as keyof typeof djColors] || "#6B7280"
                return (
                  <div key={dj.email} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="text-xs text-gray-600">{dj.nome}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Calendário */}
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              messages={messages}
              culture="pt-BR"
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              onSelectEvent={(event) => {
                console.log("Event selected:", event)
                // Aqui você pode abrir um modal com detalhes do evento
              }}
              onSelectSlot={(slotInfo) => {
                if (onDateSelect) {
                  onDateSelect(slotInfo.start)
                }
              }}
              selectable
              popup
              step={30}
              timeslots={2}
              defaultView="month"
              views={["month", "week", "day", "agenda"]}
              style={{ height: "100%" }}
            />
          </div>

          {/* Estatísticas */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredEvents.length}</div>
              <div className="text-sm text-gray-600">Total de Eventos</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredEvents.filter((e) => e.status === "confirmado").length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredEvents.filter((e) => e.status === "pendente").length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{availableDJs.length}</div>
              <div className="text-sm text-gray-600">DJs Ativos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

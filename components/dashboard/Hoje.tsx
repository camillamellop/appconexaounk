"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useAgendaEvents } from "@/hooks/useSupabase"
import { isToday } from "date-fns"

const colorClasses = {
  pendente: "bg-yellow-500",
  confirmado: "bg-green-500",
  cancelado: "bg-red-500",
}

const statusLabels = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
}

export default function Hoje() {
  const { events, loading } = useAgendaEvents()
  const [todayEvents, setTodayEvents] = useState<any[]>([])

  useEffect(() => {
    if (!loading && events) {
      // Filtrar eventos de hoje
      const eventsToday = events
        .filter((event) => {
          const eventDate = new Date(event.data)
          return isToday(eventDate)
        })
        .sort((a, b) => {
          // Ordenar por horário se disponível
          const timeA = a.tempo || "00:00"
          const timeB = b.tempo || "00:00"
          return timeA.localeCompare(timeB)
        })

      setTodayEvents(eventsToday)
    }
  }, [events, loading])

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white font-semibold">Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Carregando eventos...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white font-semibold">Hoje</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayEvents.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Nenhum evento agendado para hoje.</p>
        ) : (
          todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${colorClasses[event.status as keyof typeof colorClasses]}`} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{event.evento}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {event.tempo && <span>{event.tempo}</span>}
                  <span className="text-gray-500">•</span>
                  <span>{statusLabels[event.status as keyof typeof statusLabels]}</span>
                </div>
                {event.local && <p className="text-xs text-gray-500 mt-1">{event.local}</p>}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useAgendaHoje } from "@/hooks/useNeon"

export default function Hoje() {
  const { eventos, loading, error } = useAgendaHoje()

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Carregando eventos…</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400 text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5" />
          Hoje
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {eventos.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">Nenhum evento agendado.</p>
        ) : (
          eventos.map((e) => (
            <div key={e.id} className="p-3 rounded-lg hover:bg-slate-700 flex flex-col gap-1">
              <span className="text-sm text-gray-300 font-medium">{e.titulo}</span>
              <time className="text-xs text-gray-400">
                {new Date(e.data_inicio).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" – "}
                {new Date(e.data_fim).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

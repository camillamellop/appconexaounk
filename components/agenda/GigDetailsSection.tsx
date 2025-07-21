"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { CalendarEvent, Producer } from "@/lib/agenda-types"
import { Music, Calendar, Clock, MapPin, DollarSign, User } from "lucide-react"

interface GigDetailsSectionProps {
  selectedGig?: CalendarEvent
  producers: Producer[]
}

export default function GigDetailsSection({ selectedGig, producers }: GigDetailsSectionProps) {
  if (!selectedGig || selectedGig.type !== "gig") {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Music className="h-5 w-5" />
            Datas & Pagamentos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-center py-8">
            <Music className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma data adicionada.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const producer = producers.find((p) => p.id === selectedGig.producerId)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Music className="h-5 w-5" />
          Detalhes da Gig
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-400">Nome do Evento/Clube</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white">{selectedGig.title}</div>
          </div>

          <div>
            <Label className="text-slate-400">Data</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedGig.date.toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-400">Horário</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {selectedGig.startTime} - {selectedGig.endTime}
            </div>
          </div>

          <div>
            <Label className="text-slate-400">Valor do Cachê</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              R$ {selectedGig.fee?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </div>
          </div>
        </div>

        {selectedGig.location && (
          <div>
            <Label className="text-slate-400">Local</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedGig.location}
            </div>
          </div>
        )}

        {producer && (
          <div>
            <Label className="text-slate-400">Produtor</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">{producer.name}</span>
              </div>
              {producer.company && <p className="text-slate-300 text-sm">{producer.company}</p>}
              {producer.email && <p className="text-slate-300 text-sm">{producer.email}</p>}
              {producer.phone && <p className="text-slate-300 text-sm">{producer.phone}</p>}
            </div>
          </div>
        )}

        {selectedGig.description && (
          <div>
            <Label className="text-slate-400">Observações</Label>
            <div className="bg-slate-700 p-3 rounded-lg text-white">{selectedGig.description}</div>
          </div>
        )}

        {/* Status */}
        <div>
          <Label className="text-slate-400">Status</Label>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedGig.status === "confirmed"
                  ? "bg-green-600 text-white"
                  : selectedGig.status === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
              }`}
            >
              {selectedGig.status === "confirmed"
                ? "Confirmado"
                : selectedGig.status === "pending"
                  ? "Pendente"
                  : "Cancelado"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

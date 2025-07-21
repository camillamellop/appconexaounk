"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEvent, Producer } from "@/lib/agenda-types"
import { Calendar, X } from "lucide-react"

interface EventDetailsProps {
  event?: CalendarEvent
  producers: Producer[]
  onSave: (event: Partial<CalendarEvent>) => void
  onClose: () => void
}

export default function EventDetails({ event, producers, onSave, onClose }: EventDetailsProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    type: event?.type || "meeting",
    date: event?.date ? event.date.toISOString().split("T")[0] : "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    location: event?.location || "",
    description: event?.description || "",
    producerId: event?.producerId || "",
    fee: event?.fee || 0,
    status: event?.status || "pending",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      date: new Date(formData.date),
      fee: Number(formData.fee),
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "gig":
        return "bg-green-600"
      case "meeting":
        return "bg-blue-600"
      case "event":
        return "bg-purple-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {event ? "Editar Evento" : "Novo Evento"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">
                Título
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-white">
                Tipo
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="gig">Gig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date" className="text-white">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime" className="text-white">
                Início
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime" className="text-white">
                Fim
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="text-white">
              Local
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Endereço ou local do evento"
            />
          </div>

          {formData.type === "gig" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="producer" className="text-white">
                    Produtor
                  </Label>
                  <Select
                    value={formData.producerId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, producerId: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecionar produtor" />
                    </SelectTrigger>
                    <SelectContent>
                      {producers.map((producer) => (
                        <SelectItem key={producer.id} value={producer.id}>
                          {producer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fee" className="text-white">
                    Cachê (R$)
                  </Label>
                  <Input
                    id="fee"
                    type="number"
                    value={formData.fee}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fee: Number(e.target.value) }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="description" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
              placeholder="Detalhes adicionais sobre o evento..."
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-white">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {event ? "Atualizar" : "Criar"} Evento
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

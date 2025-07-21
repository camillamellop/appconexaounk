"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Producer } from "@/lib/agenda-types"
import { Users, Plus, Mail, Phone, Building } from "lucide-react"

interface ProducersSectionProps {
  producers: Producer[]
  onAddProducer: (producer: Omit<Producer, "id" | "createdAt">) => void
}

export default function ProducersSection({ producers, onAddProducer }: ProducersSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddProducer(formData)
    setFormData({ name: "", email: "", phone: "", company: "" })
    setShowForm(false)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Produtores
        </CardTitle>
      </CardHeader>

      <CardContent>
        {producers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum produtor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {producers.map((producer) => (
              <div key={producer.id} className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">{producer.name}</h3>
                {producer.company && (
                  <p className="text-slate-400 text-sm flex items-center gap-1 mb-1">
                    <Building className="h-3 w-3" />
                    {producer.company}
                  </p>
                )}
                {producer.email && (
                  <p className="text-slate-400 text-sm flex items-center gap-1 mb-1">
                    <Mail className="h-3 w-3" />
                    {producer.email}
                  </p>
                )}
                {producer.phone && (
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {producer.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Nome *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-white">
                  Empresa
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Salvar Produtor
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setShowForm(true)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produtor
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

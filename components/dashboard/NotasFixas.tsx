"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pin, Plus } from "lucide-react"

export default function NotasFixas() {
  const notas = [
    {
      id: 1,
      titulo: "Lembrete importante:",
      conteudo: "Enviar rider técnico para o evento de sábado até quinta-feira",
    },
    {
      id: 2,
      titulo: "Ideias para próximo set:",
      conteudo: "Testar nova transição entre gêneros • Incluir faixa experimental",
    },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Pin className="h-5 w-5 text-purple-400" />
          Notas Fixas
        </CardTitle>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {notas.map((nota) => (
          <div key={nota.id} className="p-4 bg-gray-700/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">{nota.titulo}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{nota.conteudo}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

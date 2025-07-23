"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Plus } from "lucide-react"

export default function Metas() {
  const metas = [
    {
      id: 1,
      titulo: "Equipamento novo",
      progresso: 75,
      valor: "R$ 7.500 / R$ 10.000",
    },
    {
      id: 2,
      titulo: "Shows este mês",
      progresso: 60,
      valor: "6 / 10 shows",
    },
    {
      id: 3,
      titulo: "Seguidores no Instagram",
      progresso: 40,
      valor: "4k / 10k seguidores",
    },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-400" />
          Metas
        </CardTitle>
        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {metas.map((meta) => (
          <div key={meta.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">{meta.titulo}</h4>
              <span className="text-purple-400 text-sm font-medium">{meta.progresso}%</span>
            </div>
            <Progress value={meta.progresso} className="h-2 bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                style={{ width: `${meta.progresso}%` }}
              />
            </Progress>
            <p className="text-gray-400 text-sm">{meta.valor}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

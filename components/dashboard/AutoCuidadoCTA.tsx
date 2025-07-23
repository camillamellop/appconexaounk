"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Droplets, Moon, Zap } from "lucide-react"

export default function AutoCuidadoCTA() {
  const lembretes = [
    {
      icon: Droplets,
      texto: "Beba água • 6/8 copos hoje",
      cor: "text-blue-400",
    },
    {
      icon: Moon,
      texto: "Dormir 8h • Meta: 23:00",
      cor: "text-purple-400",
    },
    {
      icon: Zap,
      texto: "Meditação • 10 min restantes",
      cor: "text-yellow-400",
    },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-purple-400" />
          AutoCuidado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400 text-sm">Cuidar de si mesmo é fundamental para o sucesso na carreira musical</p>

        <div className="space-y-3">
          {lembretes.map((lembrete, index) => {
            const Icon = lembrete.icon
            return (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded-lg">
                <Icon className={`h-4 w-4 ${lembrete.cor}`} />
                <span className="text-gray-300 text-sm">{lembrete.texto}</span>
              </div>
            )
          })}
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
          Abrir AutoCuidado
        </Button>
      </CardContent>
    </Card>
  )
}

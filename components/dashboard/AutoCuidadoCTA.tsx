"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AutoCuidadoCTA() {
  const router = useRouter()

  const handleNavigateToAutocuidado = () => {
    router.push("/autocuidado")
  }

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-700">
          <Heart className="h-5 w-5" />
          Autocuidado
        </CardTitle>
        <CardDescription className="text-pink-600">Cuide da sua saúde mental e física</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
            <span className="text-gray-700">Meditação diária</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-700">Exercícios físicos</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
            <span className="text-gray-700">Tempo para hobbies</span>
          </div>
        </div>

        <div className="pt-4 border-t border-pink-200">
          <Button
            onClick={handleNavigateToAutocuidado}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Acessar Autocuidado
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">"A música vem da alma, cuide bem dela" 💜</p>
        </div>
      </CardContent>
    </Card>
  )
}

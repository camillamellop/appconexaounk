"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AutoCuidadoCTA() {
  const router = useRouter()

  return (
    <Card className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400 fill-current" />
          <CardTitle className="text-white font-semibold text-sm">AutoCuidado</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-white/90 text-sm font-medium mb-1">O que eu posso fazer por mim hoje?</p>
          <p className="text-white/60 text-xs">Pequenos gestos de autocuidado fazem toda diferença</p>
        </div>

        <Button
          onClick={() => router.push("/autocuidado")}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          Começar Agora
        </Button>
      </CardContent>
    </Card>
  )
}

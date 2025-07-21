"use client"

import { ArrowLeft, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FinancialHeader() {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 p-6 rounded-t-xl">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Unkash</h1>
            <p className="text-purple-200 text-sm">Seu centro financeiro completo.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

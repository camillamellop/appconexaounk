"use client"

import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AgendaHeader() {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white">Agenda</h1>
            <p className="text-purple-100 text-sm">Pro Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}

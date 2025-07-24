"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/layout/BottomNavigation"

interface UserStats {
  tarefasPendentes: number
  tarefasConcluidas: number
  eventosProximos: number
  projetosAtivos: number
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    tarefasPendentes: 0,
    tarefasConcluidas: 0,
    eventosProximos: 0,
    projetosAtivos: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.tipo === "admin") {
            router.push("/admin-dashboard")
            return
          }
          setUser(userData)
        } catch (error) {
          router.push("/login")
          return
        }
      } else {
        router.push("/login")
        return
      }
    }

    // Saudação dinâmica
    const now = new Date()
    const hour = now.getHours()
    let saudacao = "Olá"
    if (hour >= 5 && hour < 12) saudacao = "Bom dia ☀️"
    else if (hour >= 12 && hour < 18) saudacao = "Boa tarde 🌤️"
    else saudacao = "Boa noite 🌙"

    setGreeting(saudacao)
  }, [router])

  // Estrutura básica da dashboard, sem dados de exemplo
  return (
    <div>
      {/* Saudação */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white">{greeting}, {user?.nome || "Usuário"}!</h1>
      </div>

      {/* Aqui você pode adicionar seus cards e componentes, puxando dados reais da API ou do estado */}
      {/* Exemplo de espaço reservado */}
      <div className="p-4 space-y-6">
        {/* Cards e seções reais devem ser implementados aqui */}
      </div>

      <BottomNavigation />
    </div>
  )
}

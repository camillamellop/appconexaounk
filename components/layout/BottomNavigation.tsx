"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, DollarSign, Music, FileText, Heart, Users, Shield, BarChart3, Settings } from 'lucide-react'

export default function BottomNavigation() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Erro ao parsear usuário:", error)
        }
      }
    }
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Navegação para Admin
  const adminNavItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/admin-dashboard",
      color: "text-purple-500"
    },
    { 
      icon: Users, 
      label: "Usuários", 
      path: "/admin/users",
      color: "text-blue-500"
    },
    { 
      icon: BarChart3, 
      label: "Relatórios", 
      path: "/admin/reports",
      color: "text-green-500"
    },
    { 
      icon: Shield, 
      label: "Segurança", 
      path: "/admin/security",
      color: "text-red-500"
    },
    { 
      icon: Settings, 
      label: "Config", 
      path: "/admin/settings",
      color: "text-gray-400"
    }
  ]

  // Navegação para Usuários
  const userNavItems = [
    { 
      icon: Home, 
      label: "Hoje", 
      path: "/dashboard",
      color: "text-purple-500"
    },
    { 
      icon: Calendar, 
      label: "Agenda", 
      path: "/agenda",
      color: "text-blue-500"
    },
    { 
      icon: DollarSign, 
      label: "Financeiro", 
      path: "/unkash",
      color: "text-green-500"
    },
    { 
      icon: Music, 
      label: "Projetos", 
      path: "/projetos",
      color: "text-pink-500"
    },
    { 
      icon: Heart, 
      label: "AutoCuidado", 
      path: "/autocuidado",
      color: "text-red-500"
    }
  ]

  const navItems = user?.tipo === "admin" ? adminNavItems : userNavItems

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? `${item.color} bg-gray-700/50` 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

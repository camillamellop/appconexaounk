"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, DollarSign, Music, FileText, Heart, Users, Shield, BarChart3, Settings } from 'lucide-react'
import { useEffect, useState } from "react"

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing user:", error)
        }
      }
    }
  }, [])

  // Navegação para usuários normais (DJ/Produtor)
  const userNavItems = [
    {
      icon: Home,
      label: "Hoje",
      path: "/dashboard",
      color: "text-purple-400"
    },
    {
      icon: Calendar,
      label: "Agenda",
      path: "/agenda",
      color: "text-blue-400"
    },
    {
      icon: DollarSign,
      label: "UNKash",
      path: "/unkash",
      color: "text-green-400"
    },
    {
      icon: Music,
      label: "Projetos",
      path: "/projetos",
      color: "text-pink-400"
    },
    {
      icon: FileText,
      label: "UNK",
      path: "/unk",
      color: "text-yellow-400"
    },
    {
      icon: Heart,
      label: "AutoCuidado",
      path: "/autocuidado",
      color: "text-red-400"
    }
  ]

  // Navegação para administradores
  const adminNavItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/admin-dashboard",
      color: "text-purple-400"
    },
    {
      icon: Users,
      label: "Usuários",
      path: "/admin/users",
      color: "text-blue-400"
    },
    {
      icon: Calendar,
      label: "Agenda",
      path: "/admin/agenda",
      color: "text-green-400"
    },
    {
      icon: DollarSign,
      label: "Financeiro",
      path: "/admin/financial",
      color: "text-yellow-400"
    },
    {
      icon: Shield,
      label: "Segurança",
      path: "/admin/security",
      color: "text-red-400"
    },
    {
      icon: Settings,
      label: "Config",
      path: "/admin/settings",
      color: "text-gray-400"
    }
  ]

  const navItems = user?.tipo === "admin" ? adminNavItems : userNavItems

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 z-50">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-slate-800 scale-105' 
                  : 'hover:bg-slate-800/50'
              }`}
            >
              <Icon 
                className={`h-5 w-5 mb-1 ${
                  isActive ? item.color : 'text-slate-400'
                }`} 
              />
              <span 
                className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

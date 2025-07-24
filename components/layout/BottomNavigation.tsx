"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Home, Calendar, DollarSign, Music, FileText, Heart, Shield, Users } from 'lucide-react'

const BottomNavigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin } = useAuth()

  // Navegação para admin
  const adminNavItems = [
    { 
      icon: Shield, 
      label: "Admin", 
      path: "/admin-dashboard", 
      color: "text-red-400",
      activeColor: "text-red-300 bg-red-900/20"
    },
    { 
      icon: Users, 
      label: "Usuários", 
      path: "/admin/users", 
      color: "text-blue-400",
      activeColor: "text-blue-300 bg-blue-900/20"
    },
    { 
      icon: Calendar, 
      label: "Agenda", 
      path: "/agenda", 
      color: "text-green-400",
      activeColor: "text-green-300 bg-green-900/20"
    },
    { 
      icon: FileText, 
      label: "Relatórios", 
      path: "/admin/reports", 
      color: "text-purple-400",
      activeColor: "text-purple-300 bg-purple-900/20"
    },
    { 
      icon: Heart, 
      label: "Sistema", 
      path: "/admin/system", 
      color: "text-pink-400",
      activeColor: "text-pink-300 bg-pink-900/20"
    }
  ]

  // Navegação para usuários normais
  const userNavItems = [
    { 
      icon: Home, 
      label: "Hoje", 
      path: "/dashboard", 
      color: "text-blue-400",
      activeColor: "text-blue-300 bg-blue-900/20"
    },
    { 
      icon: Calendar, 
      label: "Agenda", 
      path: "/agenda", 
      color: "text-green-400",
      activeColor: "text-green-300 bg-green-900/20"
    },
    { 
      icon: DollarSign, 
      label: "Financeiro", 
      path: "/unkash", 
      color: "text-purple-400",
      activeColor: "text-purple-300 bg-purple-900/20"
    },
    { 
      icon: Music, 
      label: "Projetos", 
      path: "/projetos", 
      color: "text-yellow-400",
      activeColor: "text-yellow-300 bg-yellow-900/20"
    },
    { 
      icon: Heart, 
      label: "Cuidado", 
      path: "/autocuidado", 
      color: "text-pink-400",
      activeColor: "text-pink-300 bg-pink-900/20"
    }
  ]

  const navItems = isAdmin() ? adminNavItems : userNavItems

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? `${item.activeColor} scale-105` 
                  : `${item.color} hover:bg-gray-700/50`
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation

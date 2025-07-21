"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Calendar, DollarSign, FolderOpen, Heart, User } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Unkash", href: "/unkash", icon: DollarSign },
  { name: "Projetos", href: "/projetos", icon: FolderOpen },
  { name: "AutoCuidado", href: "/autocuidado", icon: Heart },
  { name: "UNK", href: "/unk", icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 safe-area-bottom">
      <div className="grid grid-cols-6 gap-0.5 sm:gap-1 p-1 sm:p-2 max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-orange-400/70 to-amber-400/70 text-white scale-105 shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50 active:scale-95"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs font-medium leading-tight">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

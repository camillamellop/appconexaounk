"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Calendar, DollarSign, Music, FileText, Heart } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      color: "text-purple-400",
    },
    {
      href: "/agenda",
      icon: Calendar,
      label: "Agenda",
      color: "text-blue-400",
    },
    {
      href: "/unkash",
      icon: DollarSign,
      label: "UNKash",
      color: "text-green-400",
    },
    {
      href: "/unk",
      icon: Music,
      label: "UNK",
      color: "text-pink-400",
    },
    {
      href: "/projetos",
      icon: FileText,
      label: "Projetos",
      color: "text-yellow-400",
    },
    {
      href: "/autocuidado",
      icon: Heart,
      label: "AutoCuidado",
      color: "text-red-400",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? `${item.color} bg-gray-800` : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

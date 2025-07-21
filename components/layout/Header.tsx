"use client"

import { useState } from "react"
import { Bell, Settings, User, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, logout, isAdmin } from "@/lib/auth"
import ProfileModal from "@/components/profile/ProfileModal"
import LogoutConfirmDialog from "@/components/profile/LogoutConfirmDialog"

export default function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const user = getCurrentUser()
  const userIsAdmin = isAdmin()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "admin":
        return "Admin"
      case "dj":
        return "DJ"
      case "cliente":
        return "Cliente"
      default:
        return "Usuário"
    }
  }

  const getUserTypeBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "admin":
        return "destructive"
      case "dj":
        return "default"
      case "cliente":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">unk</div>
            {userIsAdmin && (
              <Badge variant="destructive" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nome} />
                    <AvatarFallback className="bg-slate-700 text-white">{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.nome}</p>
                    <p className="text-xs leading-none text-slate-400">{user.email}</p>
                    <Badge variant={getUserTypeBadgeVariant(user.tipo)} className="w-fit text-xs mt-1">
                      {getUserTypeLabel(user.tipo)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => setShowProfileModal(true)}
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <LogoutConfirmDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onConfirm={logout} />
    </>
  )
}

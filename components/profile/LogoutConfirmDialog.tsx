"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { logout, getCurrentUser } from "@/lib/auth"
import { LogOut } from "lucide-react"

interface LogoutConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutConfirmDialog({ isOpen, onClose }: LogoutConfirmDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const currentUser = getCurrentUser()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      console.log("🚪 User confirmed logout")

      // Pequeno delay para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500))

      logout()
    } catch (error) {
      console.error("❌ Error during logout:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <LogOut className="h-5 w-5 text-orange-500" />
            Confirmar Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            {currentUser ? (
              <>
                Olá <strong className="text-white">{currentUser.nome}</strong>, tem certeza que deseja sair da sua
                conta?
                <br />
                <span className="text-sm text-slate-400 mt-2 block">
                  Você precisará fazer login novamente para acessar o sistema.
                </span>
              </>
            ) : (
              "Tem certeza que deseja sair da sua conta?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoggingOut}
            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoggingOut ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saindo...
              </div>
            ) : (
              "Sair"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

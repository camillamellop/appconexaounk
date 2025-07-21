"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Play, SkipBack, SkipForward, Pause, Menu, Users, X } from "lucide-react"
import { login, testSupabaseConnection, listAllUsers } from "@/lib/auth"

export default function LoginPage() {
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [showUsersList, setShowUsersList] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()

  // Testar conexão com Supabase ao carregar a página
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testSupabaseConnection()
      setSupabaseConnected(connected)

      if (connected) {
        const users = await listAllUsers()
        setAllUsers(users)
      }
    }
    checkConnection()
  }, [])

  const handlePlayClick = () => {
    if (!showEmailCard) {
      setShowEmailCard(true)
      setIsPlaying(true)
      return
    }
    handleLogin()
  }

  const handleCloseCard = () => {
    setShowEmailCard(false)
    setIsPlaying(false)
    setEmail("")
    setError("")
  }

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Por favor, digite seu email")
      return
    }

    if (!supabaseConnected) {
      setError("Erro de conexão com o banco de dados")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🚀 Starting login process for:", email.trim())
      const user = await login(email.trim())

      if (user) {
        console.log("✅ Login successful, redirecting to dashboard")
        router.push("/")
      } else {
        setError("Email não encontrado ou erro no login")
        console.log("❌ Login failed for:", email.trim())
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
      {/* iPod Container */}
      <div className="relative">
        {/* iPod Body */}
        <div className="rounded-3xl shadow-2xl p-8 w-80 h-[600px] border border-gray-200 text-black text-black text-black bg-black">
          {/* Screen */}
          <div className="rounded-2xl h-48 mb-8 p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-3000 bg-slate-300">
            {/* Screen Content */}
            <div className="text-center">
              {/* Logo */}
              <div className="mb-4">
                <img src="/images/u-logo.png" alt="U/ Logo" className="w-16 h-16 mx-auto filter invert" />
              </div>

              {/* Now Playing Info */}
              <div className="text-white">
                <p className="text-sm font-medium text-slate-600">UNK Connection</p>
                <p className="text-xs mt-1 text-black">{isPlaying ? "Conectando..." : "Pressione Play"}</p>
              </div>

              {/* Connection Status */}
              <div className="mt-3">
                {supabaseConnected ? (
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-red-400">Offline</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>0:00</span>
                  <span>3:14</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className={`bg-white h-1 rounded-full transition-all duration-1000 ${isPlaying ? "w-1/3" : "w-0"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Wheel */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full shadow-inner border border-gray-300 relative">
              {/* Inner Circle */}
              <div className="absolute inset-4 bg-white rounded-full shadow-lg border border-gray-200">
                {/* Center Button */}
                <Button
                  onClick={handlePlayClick}
                  disabled={isLoading || !supabaseConnected}
                  className="absolute inset-6 bg-gray-50 hover:bg-gray-100 rounded-full shadow-md border border-gray-300 flex items-center justify-center disabled:opacity-50 transition-all duration-200 active:scale-95"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                  ) : isPlaying && !showEmailCard ? (
                    <Pause className="h-6 w-6 text-gray-700" />
                  ) : (
                    <Play className="h-6 w-6 text-gray-700 ml-0.5" fill="currentColor" />
                  )}
                </Button>

                {/* Control Buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full hover:bg-gray-100"
                  onClick={() => setShowUsersList(!showUsersList)}
                >
                  <Menu className="h-4 w-4 text-gray-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-100"
                >
                  <SkipBack className="h-4 w-4 text-gray-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-100"
                >
                  <SkipForward className="h-4 w-4 text-gray-600" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full hover:bg-gray-100"
                  onClick={() => setShowUsersList(!showUsersList)}
                >
                  <Users className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Brand */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 font-medium">UNK</p>
          </div>
        </div>

        {/* Email Card Overlay */}
        {showEmailCard && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
            <Card className="relative w-72 mx-4 shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/images/u-logo.png" alt="U/ Logo" className="w-6 h-6" />
                    <h3 className="font-semibold text-gray-900">Login UNK</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseCard}
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-center"
                      autoFocus
                      disabled={isLoading}
                    />
                  </div>

                  {/* Quick Access Users */}
                  {allUsers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2 text-center">Acesso rápido:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {allUsers.slice(0, 4).map((user) => (
                          <Button
                            key={user.id}
                            variant="outline"
                            size="sm"
                            onClick={() => setEmail(user.email)}
                            className="text-xs h-8"
                            disabled={isLoading}
                          >
                            {user.nome.split(" ")[0]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                  <Button
                    onClick={handleLogin}
                    disabled={isLoading || !email.trim()}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {isLoading ? "Conectando..." : "Entrar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List Overlay */}
        {showUsersList && !showEmailCard && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
            <Card className="relative w-72 mx-4 shadow-2xl border-2 border-white/20 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Usuários ({allUsers.length})</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUsersList(false)}
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium">{user.nome}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{user.tipo}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Volume2, SkipBack, SkipForward } from "lucide-react"
import { login, isAuthenticated } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<"player" | "login">("player")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  // Verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  // Simular progresso da música
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handlePlayClick = async () => {
    if (currentView === "player") {
      setCurrentView("login")
    } else {
      // Fazer login
      if (!email || !senha) {
        setError("Por favor, preencha email e senha")
        return
      }

      setIsLoading(true)
      setError("")

      try {
        const result = await login({ email, senha })

        if (result.success) {
          console.log("✅ Login realizado com sucesso")
          router.push("/")
        } else {
          setError(result.message || "Erro no login")
        }
      } catch (error) {
        console.error("Erro no login:", error)
        setError("Erro de conexão")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleMenuClick = () => {
    if (currentView === "login") {
      setCurrentView("player")
      setError("")
      setEmail("")
      setSenha("")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentTime = Math.floor((progress / 100) * 222) // 3:42 = 222 segundos

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800/90 border-gray-700 backdrop-blur-sm">
        {currentView === "player" ? (
          // Tela do Player
          <div className="p-8 text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-wider">Conexão U N K</h1>
              <p className="text-gray-400 text-sm">Fuderosa Systems</p>
            </div>

            {/* Speaker Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Volume2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>3:42</span>
              </div>
            </div>

            {/* Controls */}
            <div className="relative">
              <div className="w-48 h-48 mx-auto bg-gray-700/50 rounded-full border-2 border-gray-600 flex items-center justify-center">
                {/* Menu Button */}
                <button
                  onClick={handleMenuClick}
                  className="absolute top-4 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="text-xs font-medium">MENU</span>
                </button>

                {/* Skip Back */}
                <button className="absolute left-8 text-gray-400 hover:text-white transition-colors">
                  <SkipBack className="w-6 h-6" />
                </button>

                {/* Play Button */}
                <button
                  onClick={handlePlayClick}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </button>

                {/* Skip Forward */}
                <button className="absolute right-8 text-gray-400 hover:text-white transition-colors">
                  <SkipForward className="w-6 h-6" />
                </button>

                {/* Select Button */}
                <button className="absolute bottom-4 text-gray-400 hover:text-white transition-colors">
                  <span className="text-xs font-medium">SELECT</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Tela de Login
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-white tracking-wider">Login UNK</h1>
              <p className="text-gray-400 text-sm">Digite suas credenciais</p>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === "Enter" && handlePlayClick()}
                />
              </div>

              {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}
            </div>

            {/* Controls */}
            <div className="relative">
              <div className="w-48 h-48 mx-auto bg-gray-700/50 rounded-full border-2 border-gray-600 flex items-center justify-center">
                {/* Menu Button */}
                <button
                  onClick={handleMenuClick}
                  className="absolute top-4 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <span className="text-xs font-medium">MENU</span>
                </button>

                {/* Play/Login Button */}
                <button
                  onClick={handlePlayClick}
                  disabled={isLoading}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                  )}
                </button>

                {/* Select Button */}
                <button className="absolute bottom-4 text-gray-400 hover:text-white transition-colors">
                  <span className="text-xs font-medium">SELECT</span>
                </button>
              </div>
            </div>

            {/* Credenciais de Exemplo */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>Exemplos de login:</p>
              <p>camilla@conexaounk.com / camillaunk</p>
              <p>suzyprado1@gmail.com / suzyunk</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

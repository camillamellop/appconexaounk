"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Volume2, ChevronLeft, ChevronRight, Play } from "lucide-react"

const users = [
  { name: "Admin", email: "camilla@conexaounk.com", password: "camillaunk" },
  { name: "DJ Pedro", email: "pedro@conexaounk.com", password: "pedrounk" },
  { name: "DJ Suzy", email: "suzy@conexaounk.com", password: "suzyunk" },
  { name: "DJ Gustavo", email: "gustavo@conexaounk.com", password: "gustavounk" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState("1:28")
  const [totalTime] = useState("3:42")
  const [progress, setProgress] = useState(25)

  const { login, user } = useAuth()
  const router = useRouter()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      if (user.tipo === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  // Simular progresso da música
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 25 : prev + 1))

      // Atualizar tempo baseado no progresso
      const totalSeconds = 3 * 60 + 42 // 3:42 em segundos
      const currentSeconds = Math.floor((progress / 100) * totalSeconds)
      const minutes = Math.floor(currentSeconds / 60)
      const seconds = currentSeconds % 60
      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [progress])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !senha) return

    setLoading(true)
    setError("")

    try {
      const result = await login(email, senha)
      if (!result.success) {
        setError(result.error || "Email ou senha incorretos")
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (userIndex: number) => {
    const user = users[userIndex]
    setEmail(user.email)
    setSenha(user.password)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* iPod Container */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-white text-xl font-light tracking-wider">Conexão U N K</h1>
            <p className="text-gray-400 text-sm mt-1">Fuderosa Systems</p>
          </div>

          {/* Volume Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-2xl">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{currentTime}</span>
              <span>{totalTime}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Login Form */}
          {showForm && (
            <form onSubmit={handleLogin} className="mb-6 space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                required
              />
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </form>
          )}

          {/* iPod Controls */}
          <div className="relative">
            {/* MENU Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-gray-300 text-xs font-medium hover:text-white transition-colors"
            >
              MENU
            </button>

            {/* Control Wheel */}
            <div className="relative w-48 h-48 mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-inner">
                {/* Left Arrow */}
                <button
                  onClick={() => fillCredentials(1)} // Pedro
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => fillCredentials(2)} // Suzy
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Center Play Button */}
                <button
                  onClick={showForm ? handleLogin : () => fillCredentials(0)} // Admin ou Submit
                  disabled={loading}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
              </div>
            </div>

            {/* SELECT Button */}
            <button
              onClick={() => fillCredentials(0)} // Admin
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-300 text-xs font-medium hover:text-white transition-colors"
            >
              SELECT
            </button>
          </div>

          {/* Quick Access Buttons */}
          <div className="mt-12 grid grid-cols-2 gap-2">
            {users.map((user, index) => (
              <button
                key={index}
                onClick={() => fillCredentials(index)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-xs transition-colors"
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

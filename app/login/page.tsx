"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Volume2 } from 'lucide-react'
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Verificar se já está logado
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          if (user.tipo === "admin") {
            router.push("/admin-dashboard")
          } else {
            router.push("/dashboard")
          }
        } catch (error) {
          localStorage.removeItem("user")
        }
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const userData = await response.json()
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userData.user))
      }

      // Redirecionar baseado no tipo de usuário
      if (userData.user.tipo === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Email ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        {/* iPod Style Container */}
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Volume2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Conexão U N K</h1>
              <p className="text-slate-400 text-sm">Fuderosa Systems</p>
            </div>

            {/* Progress Bar Simulation */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>1:28</span>
                <span>3:42</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full w-1/3"></div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 rounded-xl h-12"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 rounded-xl h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl h-12 transition-all duration-200"
              >
                {loading ? "Conectando..." : "ENTRAR"}
              </Button>
            </form>

            {/* iPod Control Wheel Simulation */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-32 bg-slate-700/50 rounded-full flex items-center justify-center border border-slate-600">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Labels */}
            <div className="mt-4 text-center space-y-1">
              <p className="text-slate-400 text-sm font-medium">MENU</p>
              <p className="text-slate-500 text-xs">SELECT</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Sistema UNK Dashboard • Versão 2.0
          </p>
        </div>
      </div>
    </div>
  )
}

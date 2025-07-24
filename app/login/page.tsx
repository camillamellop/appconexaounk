"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, SkipBack, Play, SkipForward } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(email, senha)

      if (result.success) {
        // Redirect based on user type
        if (result.user?.tipo === "admin") {
          router.push("/(admin)/dashboard")
        } else {
          router.push("/(user)/dashboard")
        }
      } else {
        setError(result.error || "Erro no login")
      }
    } catch (err) {
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* iPod-style Login Card */}
        <Card className="bg-gray-800 border-gray-700 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-white mb-1">Conexão U N K</h1>
              <p className="text-gray-400 text-sm">Fuderosa Systems</p>
            </div>

            {/* Audio Player Style Display */}
            <div className="bg-gray-700 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>1:28</span>
                <span>3:42</span>
              </div>

              <div className="w-full bg-gray-600 rounded-full h-1 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full w-1/3"></div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-xl"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-xl"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl py-3"
              >
                {loading ? "Conectando..." : "CONECTAR"}
              </Button>
            </form>

            {/* iPod Controls */}
            <div className="mt-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>

                {/* Control Buttons */}
                <button className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white">
                  <span className="text-xs font-medium">MENU</span>
                </button>

                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <SkipBack className="w-4 h-4" />
                </button>

                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <SkipForward className="w-4 h-4" />
                </button>

                <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white">
                  <span className="text-xs font-medium">SELECT</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Admin: admin@unk.com / admin123</p>
          <p>DJ: liam@unk.com / liam123</p>
        </div>
      </div>
    </div>
  )
}

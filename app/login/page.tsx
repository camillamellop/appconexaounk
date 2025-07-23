"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Mock users for testing
  const mockUsers = [
    { id: 1, nome: "Admin", email: "admin@unk.com", password: "admin123", tipo: "admin", ativo: true },
    { id: 2, nome: "DJ Liam", email: "liam@unk.com", password: "liam123", tipo: "dj", ativo: true },
    { id: 3, nome: "Producer Jack", email: "jack@unk.com", password: "jack123", tipo: "produtor", ativo: true },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication
      const user = mockUsers.find((u) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))

        // Redirect based on user type
        if (user.tipo === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/user/dashboard")
        }
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const fillTestCredentials = (userType: string) => {
    const user = mockUsers.find((u) => u.tipo === userType || u.email.includes(userType))
    if (user) {
      setEmail(user.email)
      setPassword(user.password)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        {/* iPod-style Login Container */}
        <div className="bg-gray-100 rounded-3xl p-8 shadow-2xl border-4 border-gray-300">
          {/* iPod Screen */}
          <div className="bg-black rounded-2xl p-6 mb-6 shadow-inner">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Music className="h-6 w-6 text-green-400" />
                  <span className="text-green-400 font-mono text-lg">UNK</span>
                </div>
                <div className="text-gray-300 text-sm font-mono">Sistema de Login</div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono text-sm"
                  />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <div className="text-red-400 text-xs font-mono text-center bg-red-900/20 p-2 rounded">{error}</div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-mono text-sm"
                >
                  {loading ? "Conectando..." : "LOGIN"}
                </Button>
              </form>
            </div>
          </div>

          {/* iPod Control Wheel */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-inner border-2 border-gray-400 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full shadow-md flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <button
                  onClick={() => fillTestCredentials("admin")}
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full text-xs text-white hover:bg-gray-500 flex items-center justify-center"
                  title="Admin"
                >
                  A
                </button>
                <button
                  onClick={() => fillTestCredentials("liam")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-400 rounded-full text-xs text-white hover:bg-gray-500 flex items-center justify-center"
                  title="DJ Liam"
                >
                  L
                </button>
                <button
                  onClick={() => fillTestCredentials("jack")}
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full text-xs text-white hover:bg-gray-500 flex items-center justify-center"
                  title="Producer Jack"
                >
                  J
                </button>
              </div>
            </div>
          </div>

          {/* Test Accounts Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 mb-2">Contas de Teste:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Admin: admin@unk.com / admin123</div>
              <div>DJ: liam@unk.com / liam123</div>
              <div>Produtor: jack@unk.com / jack123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

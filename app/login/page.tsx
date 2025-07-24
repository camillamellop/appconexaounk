"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push(user.tipo === "admin" ? "/admin-dashboard" : "/dashboard")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, senha)
      if (!result.success) {
        setError(result.error || "Erro no login")
      }
    } catch {
      setError("Erro interno do servidor")
    } finally {
      setIsLoading(false)
    }
  }

  // Esta verificação de estado de carregamento é para a verificação inicial de autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-800 border-gray-700 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* O formulário estava em falta. Eu adicionei-o aqui. */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de Email */}
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg"
                />
              </div>

              {/* Campo de Senha */}
              <div className="space-y-2 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Exibição de Mensagem de Erro */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

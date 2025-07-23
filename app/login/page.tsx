"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Music } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Mock authentication for now
      const mockUsers = [
        { id: 1, nome: "Camilla", email: "camilla@conexaounk.com", senha: "camillaunk", tipo: "admin", ativo: true },
        { id: 2, nome: "Pedro", email: "pedro@conexaounk.com", senha: "pedrounk", tipo: "dj", ativo: true },
        { id: 3, nome: "Suzy", email: "suzy@conexaounk.com", senha: "suzyunk", tipo: "dj", ativo: true },
      ]

      const user = mockUsers.find((u) => u.email === email && u.senha === senha)

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        router.push("/")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com imagem do iPod */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      </div>

      {/* Container principal com design de iPod */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Tela do iPod */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-8 border-gray-300 relative">
          {/* Tela LCD do iPod */}
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl p-6 mb-6 border-2 border-gray-400">
            {/* Header da tela */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Music className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-black mb-1">UNK Dashboard</h1>
              <p className="text-sm text-gray-600">Entre com suas credenciais</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-2 border-gray-300 rounded-lg text-black placeholder:text-gray-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium text-black">
                  Senha
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-white border-2 border-gray-300 rounded-lg text-black placeholder:text-gray-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert className="bg-red-100 border-red-300">
                  <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-b from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black border-2 border-gray-500 rounded-lg font-medium shadow-inner"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>

          {/* Roda de controle do iPod */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border-4 border-gray-500 shadow-inner relative">
              {/* Centro da roda */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full border-2 border-gray-600 shadow-inner flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              </div>

              {/* Botões da roda */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-600 rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-600 rounded-full"></div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full"></div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Contas de teste */}
        <div className="mt-6 bg-black/60 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white text-sm font-medium mb-2">Contas de teste:</p>
          <div className="space-y-1 text-xs text-gray-300">
            <p>
              <strong>Admin:</strong> camilla@conexaounk.com / camillaunk
            </p>
            <p>
              <strong>DJ Pedro:</strong> pedro@conexaounk.com / pedrounk
            </p>
            <p>
              <strong>DJ Suzy:</strong> suzy@conexaounk.com / suzyunk
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

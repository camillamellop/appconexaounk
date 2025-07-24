"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { VolumeIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentTime, setCurrentTime] = useState("1:28")
  const [progress, setProgress] = useState(30) // 30% progress
  const router = useRouter()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.type === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError("Email ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (userType: string) => {
    switch (userType) {
      case "admin":
        setEmail("camilla@conexaounk.com")
        setPassword("camillaunk")
        break
      case "pedro":
        setEmail("pedro@conexaounk.com")
        setPassword("pedrounk")
        break
      case "suzy":
        setEmail("suzy@conexaounk.com")
        setPassword("suzyunk")
        break
      case "gustavo":
        setEmail("gustavo@conexaounk.com")
        setPassword("gustavounk")
        break
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        {/* iPod Design */}
        <div className="bg-[#121217] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          {/* Screen */}
          <div className="p-6 pb-2">
            <div className="bg-[#1a1a22] rounded-2xl p-6 mb-4">
              <div className="text-center mb-6">
                <h1 className="text-white text-2xl font-bold tracking-wider">Conexão U N K</h1>
                <p className="text-gray-400 text-sm">Fuderosa Systems</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-4 w-20 h-20 flex items-center justify-center">
                  <VolumeIcon className="w-10 h-10 text-white" />
                </div>
              </div>

              {showForm && (
                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 p-2 rounded-lg text-center">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Entrando..." : "ENTRAR"}
                  </button>
                </form>
              )}

              {/* Progress bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>1:28</span>
                  <span>3:42</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full">
                  <div
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* iPod Controls */}
            <div className="flex flex-col items-center">
              <div className="text-gray-400 text-xs mb-2">MENU</div>
              <div className="relative w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center">
                {/* Center button */}
                <button
                  onClick={() => handleLogin({ preventDefault: () => {} } as React.FormEvent)}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center z-10"
                >
                  <PlayIcon className="w-8 h-8 text-white" />
                </button>

                {/* Control buttons */}
                <button
                  onClick={() => fillCredentials("pedro")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                >
                  <ChevronLeftIcon className="w-8 h-8" />
                </button>
                <button
                  onClick={() => fillCredentials("suzy")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                >
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white"
                >
                  <span className="sr-only">Menu</span>
                </button>
                <button
                  onClick={() => fillCredentials("admin")}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
                >
                  <span className="sr-only">Select</span>
                </button>
              </div>
              <div className="text-gray-400 text-xs mt-2">SELECT</div>
            </div>
          </div>

          {/* Quick login buttons */}
          <div className="bg-[#0a0a0f] p-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                fillCredentials("admin")
                setTimeout(() => handleLogin({ preventDefault: () => {} } as React.FormEvent), 500)
              }}
              className="bg-gray-800 text-white p-2 rounded-lg text-sm hover:bg-gray-700"
            >
              Admin: Camilla
            </button>
            <button
              onClick={() => {
                fillCredentials("pedro")
                setTimeout(() => handleLogin({ preventDefault: () => {} } as React.FormEvent), 500)
              }}
              className="bg-gray-800 text-white p-2 rounded-lg text-sm hover:bg-gray-700"
            >
              DJ: Pedro
            </button>
            <button
              onClick={() => {
                fillCredentials("suzy")
                setTimeout(() => handleLogin({ preventDefault: () => {} } as React.FormEvent), 500)
              }}
              className="bg-gray-800 text-white p-2 rounded-lg text-sm hover:bg-gray-700"
            >
              DJ: Suzy
            </button>
            <button
              onClick={() => {
                fillCredentials("gustavo")
                setTimeout(() => handleLogin({ preventDefault: () => {} } as React.FormEvent), 500)
              }}
              className="bg-gray-800 text-white p-2 rounded-lg text-sm hover:bg-gray-700"
            >
              DJ: Gustavo
            </button>
          </div>
        </div>

        {/* Login instructions */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Clique em MENU para mostrar/esconder o formulário</p>
          <p>Use as setas para preencher credenciais de Pedro/Suzy</p>
          <p>Use SELECT para preencher credenciais de Admin</p>
          <p>Ou clique nos botões abaixo para login rápido</p>
        </div>
      </div>
    </div>
  )
}

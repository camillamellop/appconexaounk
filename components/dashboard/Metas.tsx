"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface Meta {
  id: number
  nome: string
  valor_meta: number
  valor_atual: number
  data_inicio: string
  data_fim: string
  status: string
}

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    if (user) {
      fetchMetas()
    }
  }, [user])

  const fetchMetas = async () => {
    try {
      const response = await fetch(`/api/metas-financeiras?usuario_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setMetas(data.filter((meta: Meta) => meta.status === "ativa").slice(0, 3))
      }
    } catch (error) {
      console.error("Erro ao buscar metas:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularProgresso = (valorAtual: number, valorMeta: number) => {
    return Math.min((valorAtual / valorMeta) * 100, 100)
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Metas Financeiras
        </CardTitle>
        <CardDescription>Acompanhe seu progresso</CardDescription>
      </CardHeader>
      <CardContent>
        {metas.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma meta ativa</p>
          </div>
        ) : (
          <div className="space-y-6">
            {metas.map((meta) => {
              const progresso = calcularProgresso(meta.valor_atual, meta.valor_meta)
              return (
                <div key={meta.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{meta.nome}</h3>
                    <span className="text-xs text-gray-500">{progresso.toFixed(0)}%</span>
                  </div>

                  <Progress value={progresso} className="h-2" />

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatarMoeda(meta.valor_atual)}</span>
                    <span>{formatarMoeda(meta.valor_meta)}</span>
                  </div>
                </div>
              )
            })}

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>Continue assim! 🎯</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

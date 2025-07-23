"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote, Plus, X } from "lucide-react"

interface Nota {
  id: string
  texto: string
  cor: string
  timestamp: number
}

const cores = [
  "bg-yellow-100 border-yellow-200",
  "bg-pink-100 border-pink-200",
  "bg-blue-100 border-blue-200",
  "bg-green-100 border-green-200",
  "bg-purple-100 border-purple-200",
  "bg-orange-100 border-orange-200",
]

export default function NotasFixas() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [novaNota, setNovaNota] = useState("")
  const [mostrarForm, setMostrarForm] = useState(false)

  useEffect(() => {
    const notasSalvas = localStorage.getItem("notas-fixas")
    if (notasSalvas) {
      setNotas(JSON.parse(notasSalvas))
    }
  }, [])

  const salvarNotas = (notasAtualizadas: Nota[]) => {
    setNotas(notasAtualizadas)
    localStorage.setItem("notas-fixas", JSON.stringify(notasAtualizadas))
  }

  const adicionarNota = () => {
    if (novaNota.trim()) {
      const nota: Nota = {
        id: Date.now().toString(),
        texto: novaNota.trim(),
        cor: cores[Math.floor(Math.random() * cores.length)],
        timestamp: Date.now(),
      }
      salvarNotas([...notas, nota])
      setNovaNota("")
      setMostrarForm(false)
    }
  }

  const removerNota = (id: string) => {
    salvarNotas(notas.filter((nota) => nota.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Notas Fixas
            </CardTitle>
            <CardDescription>Suas anotações rápidas</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setMostrarForm(!mostrarForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mostrarForm && (
          <div className="space-y-2">
            <Textarea
              placeholder="Digite sua nota..."
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={adicionarNota}>
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMostrarForm(false)
                  setNovaNota("")
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {notas.length === 0 ? (
          <div className="text-center py-8">
            <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nenhuma nota ainda</p>
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira nota
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {notas.map((nota) => (
              <div key={nota.id} className={`p-3 rounded-lg border-2 ${nota.cor} relative group`}>
                <button
                  onClick={() => removerNota(nota.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
                <p className="text-sm text-gray-700 pr-6">{nota.texto}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

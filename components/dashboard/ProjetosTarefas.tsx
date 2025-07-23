"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react"
import { useTarefas } from "@/hooks/useNeon"

/* -----------------------------------------------------------
 *  Visual helpers
 * -------------------------------------------------------- */
const statusIcon: Record<string, any> = {
  pendente: Circle,
  em_andamento: Clock,
  concluida: CheckCircle2,
  cancelada: AlertCircle,
}

const priorityColor: Record<string, string> = {
  baixa: "bg-green-500/20 text-green-400",
  media: "bg-yellow-500/20 text-yellow-400",
  alta: "bg-orange-500/20 text-orange-400",
  urgente: "bg-red-500/20 text-red-400",
}

function StatusBadge({ status }: { status: string }) {
  const Icon = statusIcon[status] ?? Circle
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Icon className="w-3 h-3" />
      {status.replace("_", " ")}
    </span>
  )
}

/* -----------------------------------------------------------
 *  Component
 * -------------------------------------------------------- */
export default function ProjetosTarefas() {
  const { tarefas, loading, error } = useTarefas()
  const [showFinished, setShowFinished] = useState(false)

  const visibleTasks = useMemo(
    () => tarefas.filter((t) => (showFinished ? true : t.status !== "concluida")),
    [tarefas, showFinished],
  )

  const done = tarefas.filter((t) => t.status === "concluida").length
  const progress = tarefas.length === 0 ? 0 : Math.round((done / tarefas.length) * 100)

  /* -------------------------- UI states ------------------- */
  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardHeader>
          <CardTitle className="text-white">Projetos &amp; Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Carregando tarefas…</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardHeader>
          <CardTitle className="text-white">Projetos &amp; Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400 text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  /* --------------------------- Render --------------------- */
  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Projetos &amp; Tarefas</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFinished((v) => !v)}>
              {showFinished ? "Ocultar concluídas" : "Mostrar concluídas"}
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
          </div>
        </div>
        {tarefas.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progresso geral</span>
              <span className="text-purple-400 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        {visibleTasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Nenhuma tarefa encontrada.</p>
        ) : (
          visibleTasks.map((t) => {
            const Icon = statusIcon[t.status] ?? Circle
            return (
              <div key={t.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700">
                {/* Status circle */}
                <div className="mt-1">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm ${t.status === "concluida" ? "line-through text-gray-500" : "text-gray-300"}`}
                    >
                      {t.titulo}
                    </h4>

                    {/* Priority */}
                    <Badge className={`border-0 ${priorityColor[t.prioridade]}`}>{t.prioridade}</Badge>
                  </div>

                  {t.descricao && <p className="text-xs text-gray-400 truncate">{t.descricao}</p>}

                  {/* Progress bar for in-progress items */}
                  {t.status !== "concluida" && t.progresso > 0 && (
                    <div className="mt-2">
                      <Progress value={t.progresso} className="h-1" />
                    </div>
                  )}

                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <StatusBadge status={t.status} />
                    {t.data_vencimento && <time>{new Date(t.data_vencimento).toLocaleDateString("pt-BR")}</time>}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

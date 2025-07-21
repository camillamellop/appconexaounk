"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"
import { useTarefas } from "@/hooks/useSupabase"
import { useState } from "react"

export default function ProjetosTarefas() {
  const { tarefas, loading, updateTarefa } = useTarefas()
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set())

  const toggleTask = async (taskId: string, currentStatus: string) => {
    if (updatingTasks.has(taskId)) return

    setUpdatingTasks((prev) => new Set(prev).add(taskId))

    const newStatus = currentStatus === "concluida" ? "pendente" : "concluida"

    try {
      await updateTarefa(taskId, { status: newStatus })
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
    } finally {
      setUpdatingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const completedTasks = tarefas.filter((task) => task.status === "concluida").length
  const totalTasks = tarefas.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-white font-semibold">Projetos & Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Carregando tarefas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white font-semibold">Projetos & Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tarefas.length > 0 ? (
          <>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Progresso Geral</span>
                  <span className="text-purple-400 font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium text-sm">Tarefas Recentes</h4>
                <span className="text-gray-400 text-xs">
                  {completedTasks}/{totalTasks}
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tarefas.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTask(task.id, task.status)}
                      disabled={updatingTasks.has(task.id)}
                      className="h-5 w-5 p-0 text-gray-400 hover:text-purple-400"
                    >
                      {task.status === "concluida" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </Button>
                    <span
                      className={`text-sm flex-1 ${
                        task.status === "concluida" ? "text-gray-500 line-through" : "text-gray-300"
                      }`}
                    >
                      {task.titulo}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.prioridade === "alta"
                          ? "bg-red-500"
                          : task.prioridade === "media"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Nenhuma tarefa encontrada</p>
            <p className="text-gray-500 text-xs mt-1">Crie suas primeiras tarefas na página de Projetos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

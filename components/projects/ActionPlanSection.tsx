"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, Circle, Calendar, Target } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { ActionPlan, ActionTask } from "@/lib/project-types"

const categoryColors = {
  networking: "bg-blue-500",
  learning: "bg-green-500",
  branding: "bg-purple-500",
  career: "bg-orange-500",
  other: "bg-gray-500",
}

const categoryLabels = {
  networking: "Networking",
  learning: "Aprendizado",
  branding: "Branding",
  career: "Carreira",
  other: "Outros",
}

export default function ActionPlanSection() {
  const [actionPlan, setActionPlan] = useLocalStorage<ActionPlan>("actionPlan", {
    id: "1",
    title: "Plano de Ação - Próximo Mês",
    month: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    tasks: [
      {
        id: "1",
        title: "Atualizar perfil no LinkedIn com novas competências",
        completed: false,
        priority: "high",
        category: "branding",
      },
      {
        id: "2",
        title: "Concluir o curso de 'Gestão de Projetos Ágeis'",
        completed: false,
        priority: "medium",
        category: "learning",
      },
      {
        id: "3",
        title: "Marcar 2 cafés virtuais para networking",
        completed: false,
        priority: "medium",
        category: "networking",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [newTaskTitle, setNewTaskTitle] = useState("")

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: ActionTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: "medium",
      category: "other",
    }

    setActionPlan({
      ...actionPlan,
      tasks: [...actionPlan.tasks, newTask],
      updatedAt: new Date(),
    })

    setNewTaskTitle("")
  }

  const toggleTask = (taskId: string) => {
    setActionPlan({
      ...actionPlan,
      tasks: actionPlan.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
      updatedAt: new Date(),
    })
  }

  const completedTasks = actionPlan.tasks.filter((task) => task.completed).length
  const completionPercentage =
    actionPlan.tasks.length > 0 ? Math.round((completedTasks / actionPlan.tasks.length) * 100) : 0

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            {actionPlan.title}
          </CardTitle>
          <Badge variant="outline" className="border-green-500 text-green-400">
            {completionPercentage}% concluído
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{actionPlan.month}</span>
          <span>•</span>
          <span>
            {completedTasks}/{actionPlan.tasks.length} tarefas concluídas
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Adicionar nova tarefa */}
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="bg-slate-700 border-slate-600 text-white"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask} className="bg-green-600 hover:bg-green-700" disabled={!newTaskTitle.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-2">
          {actionPlan.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTask(task.id)}
                className="h-5 w-5 p-0 text-gray-400 hover:text-green-400"
              >
                {task.completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4" />}
              </Button>

              <span className={`flex-1 text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-300"}`}>
                {task.title}
              </span>

              <Badge className={`${categoryColors[task.category]} text-white text-xs`}>
                {categoryLabels[task.category]}
              </Badge>
            </div>
          ))}
        </div>

        {actionPlan.tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma tarefa ainda. Adicione sua primeira meta!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit3, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Goal } from "@/lib/types"

export default function Metas() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", [
    {
      id: "1",
      title: "Exercícios semanais",
      description: "Completar 5 treinos por semana",
      progress: 3,
      target: 5,
      unit: "treinos",
    },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)

  const updateProgress = (id: string, newProgress: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, progress: Math.max(0, Math.min(goal.target, newProgress)) } : goal,
      ),
    )
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-white font-semibold">Metas</CardTitle>
        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.progress / goal.target) * 100

          return (
            <div key={goal.id} className="group space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">{goal.title}</h4>
                  <p className="text-gray-400 text-xs">{goal.description}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-purple-400">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGoal(goal.id)}
                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {goal.progress}/{goal.target} {goal.unit}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateProgress(goal.id, goal.progress - 1)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      -
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateProgress(goal.id, goal.progress + 1)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

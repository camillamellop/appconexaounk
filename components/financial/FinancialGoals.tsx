"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, Target, Calendar } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { FinancialGoal } from "@/lib/financial-types"

export default function FinancialGoals() {
  const [goals] = useLocalStorage<FinancialGoal[]>("financialGoals", [
    {
      id: "1",
      title: "Viagem Japão",
      targetAmount: 15000,
      currentAmount: 8500,
      deadline: new Date(2025, 11, 31),
      category: "Viagem",
      color: "bg-purple-500",
      description: "Reserva de emergência para viagem dos sonhos",
    },
    {
      id: "2",
      title: "Setup Novo",
      targetAmount: 8000,
      currentAmount: 7200,
      deadline: new Date(2025, 8, 30),
      category: "Equipamentos",
      color: "bg-green-500",
      description: "Upgrade completo do setup de trabalho",
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const totalGoalsAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-400" />
            Metas Financeiras
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          {formatCurrency(totalSavedAmount)} de {formatCurrency(totalGoalsAmount)} economizados
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const remainingAmount = goal.targetAmount - goal.currentAmount
          const daysUntilDeadline = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )

          return (
            <div key={goal.id} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">{formatCurrency(goal.currentAmount)}</div>
                  <div className="text-sm text-gray-400">de {formatCurrency(goal.targetAmount)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progresso</span>
                  <span className="text-purple-400">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{daysUntilDeadline} dias restantes</span>
                  </div>
                  <span>Faltam: {formatCurrency(remainingAmount)}</span>
                </div>
              </div>

              {progress >= 100 && (
                <div className="mt-2 text-center">
                  <span className="text-green-400 text-sm font-medium">🎉 Meta alcançada!</span>
                </div>
              )}
            </div>
          )
        })}

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎯</div>
            <p>Nenhuma meta financeira definida</p>
            <p className="text-sm">Crie sua primeira meta para começar a economizar</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

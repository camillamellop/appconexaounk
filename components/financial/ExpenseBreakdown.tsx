"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FinancialSummary } from "@/lib/financial-types"

interface ExpenseBreakdownProps {
  summary: FinancialSummary
}

export default function ExpenseBreakdown({ summary }: ExpenseBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const fixedPercentage = summary.totalExpenses > 0 ? (summary.fixedExpenses / summary.totalExpenses) * 100 : 0

  const variablePercentage = summary.totalExpenses > 0 ? (summary.variableExpenses / summary.totalExpenses) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Receitas vs. Despesas */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Receitas vs. Despesas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Receitas</span>
              <span className="text-white">{formatCurrency(summary.totalIncome)}</span>
            </div>
            <Progress value={summary.totalIncome > 0 ? 100 : 0} className="h-2 bg-slate-700" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-400">Despesas</span>
              <span className="text-white">{formatCurrency(summary.totalExpenses)}</span>
            </div>
            <Progress
              value={
                summary.totalExpenses > 0
                  ? (summary.totalExpenses / Math.max(summary.totalIncome, summary.totalExpenses)) * 100
                  : 0
              }
              className="h-2 bg-slate-700"
            />
          </div>

          <div className="pt-2 border-t border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Saldo</span>
              <span className={`font-semibold ${summary.totalBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatCurrency(summary.totalBalance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Despesas Fixas vs. Variáveis */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Despesas Fixas vs. Variáveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-orange-400">Despesas Fixas</span>
              <span className="text-white">{formatCurrency(summary.fixedExpenses)}</span>
            </div>
            <Progress value={fixedPercentage} className="h-2 bg-slate-700" />
            <div className="text-xs text-gray-500">{fixedPercentage.toFixed(1)}% do total</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">Despesas Variáveis</span>
              <span className="text-white">{formatCurrency(summary.variableExpenses)}</span>
            </div>
            <Progress value={variablePercentage} className="h-2 bg-slate-700" />
            <div className="text-xs text-gray-500">{variablePercentage.toFixed(1)}% do total</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

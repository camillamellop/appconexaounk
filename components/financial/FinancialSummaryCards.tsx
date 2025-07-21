"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { FinancialSummary } from "@/lib/financial-types"

interface FinancialSummaryCardsProps {
  summary: FinancialSummary
}

export default function FinancialSummaryCards({ summary }: FinancialSummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Balanço Total */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Balanço Total</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(summary.totalBalance)}</div>
          <p className="text-xs text-gray-500">Balanço geral de todas as transações</p>
        </CardContent>
      </Card>

      {/* Receitas */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-gray-400 text-sm">Receitas</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">+ {formatCurrency(summary.totalIncome)}</div>
          <p className="text-xs text-gray-500">Total de entradas</p>
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            <span className="text-gray-400 text-sm">Despesas</span>
          </div>
          <div className="text-2xl font-bold text-red-400 mb-1">- {formatCurrency(summary.totalExpenses)}</div>
          <p className="text-xs text-gray-500">Total de saídas</p>
        </CardContent>
      </Card>
    </div>
  )
}

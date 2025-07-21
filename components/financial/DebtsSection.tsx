"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Debt } from "@/lib/financial-types"

export default function DebtsSection() {
  const [debts] = useLocalStorage<Debt[]>("debts", [
    {
      id: "1",
      title: "Notebook",
      totalAmount: 3600,
      paidAmount: 1500,
      installments: 12,
      currentInstallment: 5,
      monthlyPayment: 300,
      dueDate: new Date(2025, 11, 15), // Dezembro 2025
      category: "Eletrônicos",
    },
    {
      id: "2",
      title: "Cartão de Crédito",
      totalAmount: 2400,
      paidAmount: 800,
      installments: 8,
      currentInstallment: 3,
      monthlyPayment: 300,
      dueDate: new Date(2025, 9, 10), // Outubro 2025
      category: "Cartão",
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const totalDebt = debts.reduce((sum, debt) => sum + (debt.totalAmount - debt.paidAmount), 0)
  const monthlyPayments = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)

  return (
    <div className="space-y-4">
      {/* Resumo das Dívidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-red-400" />
              <span className="text-gray-400 text-sm">Total em Dívidas</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-gray-500">
              {debts.length} dívida{debts.length !== 1 ? "s" : ""} ativa{debts.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-orange-400" />
              <span className="text-gray-400 text-sm">Pagamentos Mensais</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{formatCurrency(monthlyPayments)}</div>
            <p className="text-xs text-gray-500">Total mensal comprometido</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Dívidas Ativas */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Dívidas Ativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {debts.map((debt) => {
            const progress = (debt.paidAmount / debt.totalAmount) * 100
            const remainingAmount = debt.totalAmount - debt.paidAmount
            const remainingInstallments = debt.installments - debt.currentInstallment

            return (
              <div key={debt.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">{debt.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>
                        {debt.currentInstallment}/{debt.installments}
                      </span>
                      <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                        {debt.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white">{formatCurrency(remainingAmount)}</div>
                    <div className="text-sm text-gray-400">{formatCurrency(debt.monthlyPayment)}/mês</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-purple-400">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pago: {formatCurrency(debt.paidAmount)}</span>
                    <span>{remainingInstallments} parcelas restantes</span>
                  </div>
                </div>
              </div>
            )
          })}

          {debts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🎉</div>
              <p>Nenhuma dívida ativa!</p>
              <p className="text-sm">Parabéns pela organização financeira</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

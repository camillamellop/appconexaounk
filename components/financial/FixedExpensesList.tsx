"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Calendar, Tag, Edit, Trash2, Clock } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import FixedExpenseForm from "./FixedExpenseForm"
import type { FixedExpense } from "@/lib/financial-types"

export default function FixedExpensesList() {
  const [fixedExpenses, setFixedExpenses] = useLocalStorage<FixedExpense[]>("fixedExpenses", [
    {
      id: "1",
      title: "Aluguel",
      amount: 1200,
      category: "Moradia",
      dueDay: 5,
      isActive: true,
      description: "Aluguel do apartamento",
      tags: ["moradia", "fixo"],
    },
    {
      id: "2",
      title: "Internet",
      amount: 89.9,
      category: "Serviços",
      dueDay: 15,
      isActive: true,
      tags: ["internet", "fixo"],
    },
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<FixedExpense | undefined>()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const handleSaveExpense = (expenseData: Omit<FixedExpense, "id">) => {
    if (editingExpense) {
      // Editar despesa existente
      setFixedExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : e)),
      )
    } else {
      // Criar nova despesa
      const newExpense: FixedExpense = {
        ...expenseData,
        id: Date.now().toString(),
      }
      setFixedExpenses((prev) => [...prev, newExpense])
    }
    setEditingExpense(undefined)
  }

  const handleEditExpense = (expense: FixedExpense) => {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }

  const handleDeleteExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setFixedExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e)))
  }

  const openNewExpenseForm = () => {
    setEditingExpense(undefined)
    setIsFormOpen(true)
  }

  const totalActiveExpenses = fixedExpenses.filter((e) => e.isActive).reduce((sum, e) => sum + e.amount, 0)

  return (
    <>
      <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Contas Fixas</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Total mensal: {formatCurrency(totalActiveExpenses)}</p>
            </div>
            <Button onClick={openNewExpenseForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              className={`p-4 rounded-lg transition-colors ${
                expense.isActive ? "bg-slate-700/50 hover:bg-slate-700/70" : "bg-slate-700/30 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <Clock className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{expense.title}</h4>
                      {!expense.isActive && (
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-500">
                          Inativa
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Tag className="h-3 w-3" />
                      <span>{expense.category}</span>
                      <Calendar className="h-3 w-3 ml-2" />
                      <span>Vence dia {expense.dueDay}</span>
                    </div>
                    {expense.description && <p className="text-xs text-gray-500 mt-1">{expense.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-400">{formatCurrency(expense.amount)}</div>
                    <div className="flex gap-1 mt-1">
                      {expense.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={expense.isActive}
                      onCheckedChange={() => handleToggleActive(expense.id)}
                      size="sm"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExpense(expense)}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {fixedExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p>Nenhuma conta fixa cadastrada</p>
              <p className="text-sm">Adicione suas contas recorrentes</p>
            </div>
          )}
        </CardContent>
      </Card>

      <FixedExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </>
  )
}

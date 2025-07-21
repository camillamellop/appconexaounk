"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, TrendingDown, Calendar, Tag, Edit, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import TransactionForm from "./TransactionForm"
import type { Transaction } from "@/lib/financial-types"

export default function TransactionsList() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", [
    {
      id: "1",
      title: "Salário",
      amount: 5000,
      type: "income",
      category: "Salário",
      date: new Date(),
      isRecurring: true,
      recurringType: "monthly",
      tags: ["trabalho", "fixo"],
    },
    {
      id: "2",
      title: "Aluguel",
      amount: 1200,
      type: "expense",
      category: "Moradia",
      date: new Date(),
      isRecurring: true,
      recurringType: "monthly",
      tags: ["fixo", "moradia"],
    },
  ])

  const [filter, setFilter] = useState<"all" | "income" | "expense">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const filteredTransactions = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSaveTransaction = (transactionData: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      // Editar transação existente
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTransaction.id ? { ...transactionData, id: editingTransaction.id } : t)),
      )
    } else {
      // Criar nova transação
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
      }
      setTransactions((prev) => [...prev, newTransaction])
    }
    setEditingTransaction(undefined)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const openNewTransactionForm = () => {
    setEditingTransaction(undefined)
    setIsFormOpen(true)
  }

  return (
    <>
      <Card className="bg-slate-800/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Transações</CardTitle>
            <Button onClick={openNewTransactionForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <div className="flex gap-1">
              {[
                { key: "all", label: "Todas" },
                { key: "income", label: "Receitas" },
                { key: "expense", label: "Despesas" },
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key as any)}
                  className={
                    filter === filterOption.key
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-600 text-gray-300 hover:bg-slate-700"
                  }
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    transaction.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{transaction.title}</h4>
                    {transaction.isRecurring && (
                      <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                        Recorrente
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Tag className="h-3 w-3" />
                    <span>{transaction.category}</span>
                    <Calendar className="h-3 w-3 ml-2" />
                    <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {transaction.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTransaction(transaction)}
                    className="border-slate-600 hover:bg-slate-700"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">💰</div>
              <p>Nenhuma transação encontrada</p>
              <p className="text-sm">Adicione sua primeira transação</p>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </>
  )
}

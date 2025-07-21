"use client"

import { useState, useMemo } from "react"
import FinancialHeader from "@/components/financial/FinancialHeader"
import FinancialSummaryCards from "@/components/financial/FinancialSummaryCards"
import ExpenseBreakdown from "@/components/financial/ExpenseBreakdown"
import TransactionsList from "@/components/financial/TransactionsList"
import FixedExpensesList from "@/components/financial/FixedExpensesList"
import DebtsSection from "@/components/financial/DebtsSection"
import FinancialGoals from "@/components/financial/FinancialGoals"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Transaction, Debt, FixedExpense, FinancialSummary } from "@/lib/financial-types"

export default function UnkashPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "debts" | "fixed">("overview")

  const [transactions] = useLocalStorage<Transaction[]>("transactions", [])
  const [debts] = useLocalStorage<Debt[]>("debts", [])
  const [fixedExpenses] = useLocalStorage<FixedExpense[]>("fixedExpenses", [])

  // Calcular resumo financeiro
  const financialSummary = useMemo((): FinancialSummary => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const fixedExpensesTotal = fixedExpenses.filter((e) => e.isActive).reduce((sum, e) => sum + e.amount, 0)

    const recurringExpenses = transactions
      .filter((t) => t.type === "expense" && t.isRecurring)
      .reduce((sum, t) => sum + t.amount, 0)

    const variableExpenses = totalExpenses - recurringExpenses

    const monthlyIncome = transactions
      .filter((t) => t.type === "income" && t.isRecurring && t.recurringType === "monthly")
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = recurringExpenses + fixedExpensesTotal

    return {
      totalBalance: totalIncome - totalExpenses - fixedExpensesTotal,
      totalIncome,
      totalExpenses: totalExpenses + fixedExpensesTotal,
      monthlyIncome,
      monthlyExpenses,
      fixedExpenses: fixedExpensesTotal,
      variableExpenses,
    }
  }, [transactions, fixedExpenses])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <FinancialHeader />

        {/* Tabs personalizadas */}
        <div className="px-4 mb-6">
          <div className="flex gap-2 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-1">
            {[
              { key: "overview", label: "Visão Geral" },
              { key: "transactions", label: "Transações" },
              { key: "fixed", label: "Contas Fixas" },
              { key: "debts", label: "Dívidas" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <FinancialSummaryCards summary={financialSummary} />
            <ExpenseBreakdown summary={financialSummary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
              <DebtsSection />
              <FinancialGoals />
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="p-4">
            <TransactionsList />
          </div>
        )}

        {activeTab === "fixed" && (
          <div className="p-4">
            <FixedExpensesList />
          </div>
        )}

        {activeTab === "debts" && (
          <div className="p-4">
            <DebtsSection />
          </div>
        )}
      </div>
    </div>
  )
}

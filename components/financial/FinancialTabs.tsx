"use client"

import { Button } from "@/components/ui/button"

interface FinancialTabsProps {
  activeTab: "overview" | "transactions" | "debts"
  onTabChange: (tab: "overview" | "transactions" | "debts") => void
}

export default function FinancialTabs({ activeTab, onTabChange }: FinancialTabsProps) {
  const tabs = [
    { key: "overview", label: "Visão Geral" },
    { key: "transactions", label: "Transações" },
    { key: "debts", label: "Dívidas" },
  ] as const

  return (
    <div className="flex gap-2 p-4 bg-slate-800">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeTab === tab.key ? "default" : "ghost"}
          onClick={() => onTabChange(tab.key)}
          className={
            activeTab === tab.key ? "bg-slate-700 text-white" : "text-gray-400 hover:text-white hover:bg-slate-700"
          }
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}

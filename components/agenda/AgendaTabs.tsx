"use client"

import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, Clock } from "lucide-react"

interface AgendaTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "availability", label: "Availability", icon: Clock },
]

export default function AgendaTabs({ activeTab, onTabChange }: AgendaTabsProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4">
      <div className="flex gap-2 max-w-7xl mx-auto overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

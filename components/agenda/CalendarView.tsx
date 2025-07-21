"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import type { CalendarEvent } from "@/lib/agenda-types"
import { isAdmin } from "@/lib/auth"

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onAddEvent: (date: Date) => void
  users?: any[]
}

export default function CalendarView({ events, onEventClick, onAddEvent, users = [] }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const userIsAdmin = isAdmin()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ date, isCurrentMonth: true })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDate = (date: Date) => {
    let filteredEvents = events.filter((event) => event.date.toDateString() === date.toDateString())

    // Filtrar por usuário se admin selecionou um usuário específico
    if (userIsAdmin && selectedUser !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.usuario_id === selectedUser)
    }

    return filteredEvents
  }

  const getUserColor = (userId: string) => {
    const colors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600", "bg-pink-600", "bg-indigo-600"]
    const index = users.findIndex((user) => user.id === userId)
    return colors[index % colors.length] || "bg-gray-600"
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.nome || "Usuário"
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <div className="flex items-center gap-4">
            {/* Filtro por usuário (apenas para admin) */}
            {userIsAdmin && users.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Filtrar por DJ" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white">
                      Todos os DJs
                    </SelectItem>
                    {users
                      .filter((user) => user.tipo === "dj")
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id} className="text-white">
                          {user.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-400 hover:text-white bg-transparent"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={goToToday}>
                Today
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-400 hover:text-white bg-transparent"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-slate-400 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isToday = day.date.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors ${
                  !day.isCurrentMonth ? "opacity-50" : ""
                } ${isToday ? "bg-purple-900/30 border-purple-600" : "bg-slate-800"}`}
                onClick={() => onAddEvent(day.date)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-purple-400" : "text-white"}`}>
                  {day.date.getDate()}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded cursor-pointer ${
                        event.type === "gig"
                          ? "bg-green-600 text-white"
                          : event.type === "meeting"
                            ? "bg-blue-600 text-white"
                            : "bg-purple-600 text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      {userIsAdmin && event.usuarios && (
                        <div className="text-xs opacity-75 truncate">{event.usuarios.nome}</div>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > 3 && <div className="text-xs text-slate-400">+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda para admin */}
        {userIsAdmin && users.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-medium text-slate-400 mb-3">DJs:</h3>
            <div className="flex flex-wrap gap-2">
              {users
                .filter((user) => user.tipo === "dj")
                .map((user) => (
                  <Badge
                    key={user.id}
                    variant="outline"
                    className={`${getUserColor(user.id)} text-white border-transparent`}
                  >
                    {user.nome}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

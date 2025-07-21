"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import BottomNavigation from "@/components/layout/BottomNavigation"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Smile, Moon, Droplets, Zap, CheckCircle2, Circle } from "lucide-react"

interface WellnessActivity {
  id: string
  title: string
  description: string
  icon: any
  color: string
  completed: boolean
}

export default function AutoCuidadoPage() {
  const [activities, setActivities] = useState<WellnessActivity[]>([
    {
      id: "1",
      title: "Meditação Matinal",
      description: "5 minutos de respiração consciente",
      icon: Moon,
      color: "blue",
      completed: false,
    },
    {
      id: "2",
      title: "Hidratação",
      description: "Beber 2 litros de água hoje",
      icon: Droplets,
      color: "cyan",
      completed: false,
    },
    {
      id: "3",
      title: "Exercício Físico",
      description: "30 minutos de atividade física",
      icon: Zap,
      color: "green",
      completed: false,
    },
    {
      id: "4",
      title: "Gratidão",
      description: "Anotar 3 coisas pelas quais sou grato",
      icon: Heart,
      color: "pink",
      completed: false,
    },
    {
      id: "5",
      title: "Momento de Alegria",
      description: "Fazer algo que me deixa feliz",
      icon: Smile,
      color: "yellow",
      completed: false,
    },
  ])

  const toggleActivity = (id: string) => {
    setActivities(
      activities.map((activity) => (activity.id === id ? { ...activity, completed: !activity.completed } : activity)),
    )
  }

  const completedCount = activities.filter((activity) => activity.completed).length
  const progressPercentage = (completedCount / activities.length) * 100

  const colorClasses = {
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    yellow: "bg-yellow-500",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-slate-900 to-black"></div>
      <div className="relative z-10">
        <Header />

        <main className="pt-20 pb-20 px-4 space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-pink-400 fill-current" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">AutoCuidado</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Cuide de si mesmo todos os dias. Pequenos gestos fazem grandes diferenças.
            </p>
          </div>

          {/* Progress Card */}
          <div className="max-w-2xl mx-auto">
            <div className="card-glass rounded-2xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center">Progresso de Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {completedCount}/{activities.length}
                  </div>
                  <p className="text-white/70">atividades concluídas</p>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-center text-sm text-white/60">
                  {progressPercentage.toFixed(0)}% do seu autocuidado diário
                </p>
              </CardContent>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="card-glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">{activity.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{activity.description}</p>
                      <Button
                        onClick={() => toggleActivity(activity.id)}
                        variant={activity.completed ? "default" : "outline"}
                        className={`w-full ${
                          activity.completed
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-white/20 text-white hover:bg-white/10"
                        }`}
                      >
                        {activity.completed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Concluído
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 mr-2" />
                            Marcar como feito
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Motivational Quote */}
          <div className="max-w-2xl mx-auto">
            <div className="card-glass rounded-2xl p-8 text-center">
              <blockquote className="text-white/90 text-lg italic mb-4">
                "Cuidar de si mesmo não é egoísmo, é necessidade. Você não pode servir de um vaso vazio."
              </blockquote>
              <cite className="text-white/60 text-sm">— Eleanor Brown</cite>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto">
            <div className="card-glass rounded-2xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700">Respiração 1min</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Alongamento</Button>
                <Button className="bg-green-600 hover:bg-green-700">Caminhada</Button>
                <Button className="bg-pink-600 hover:bg-pink-700">Música Relaxante</Button>
              </CardContent>
            </div>
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  )
}

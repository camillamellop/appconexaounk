"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, Save, X } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { PersonalBranding } from "@/lib/project-types"

export default function PersonalBrandingSection() {
  const [branding, setBranding] = useLocalStorage<PersonalBranding>("personalBranding", {
    mission: "",
    vision: "",
    values: "",
    updatedAt: new Date(),
  })

  const [editing, setEditing] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")

  const startEdit = (field: keyof PersonalBranding, currentValue: string) => {
    setEditing(field)
    setTempValue(currentValue)
  }

  const saveField = (field: keyof PersonalBranding) => {
    setBranding({
      ...branding,
      [field]: tempValue,
      updatedAt: new Date(),
    })
    setEditing(null)
    setTempValue("")
  }

  const cancelEdit = () => {
    setEditing(null)
    setTempValue("")
  }

  const fields = [
    {
      key: "mission" as keyof PersonalBranding,
      title: "Missão",
      placeholder: "Ex: Ajudar empresas a crescer com tecnologia...",
      description: "Defina seu propósito e o que você oferece ao mundo",
    },
    {
      key: "vision" as keyof PersonalBranding,
      title: "Visão",
      placeholder: "Ex: Ser referência em liderança de produtos...",
      description: "Onde você quer chegar no futuro",
    },
    {
      key: "values" as keyof PersonalBranding,
      title: "Valores",
      placeholder: "Ex: Inovação, Colaboração, Integridade...",
      description: "Princípios que guiam suas decisões e comportamentos",
    },
  ]

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="text-2xl">👤</span>
          Meu Branding Pessoal
        </CardTitle>
        <p className="text-gray-400 text-sm">Defina sua marca no mercado. Clique nos textos para editar.</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-purple-400 font-semibold">{field.title}</h4>
              {editing !== field.key && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(field.key, branding[field.key])}
                  className="h-6 w-6 text-gray-400 hover:text-purple-400"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-2">{field.description}</p>

            {editing === field.key ? (
              <div className="space-y-2">
                <Textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-slate-700 border-slate-600 text-white resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveField(field.key)} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-3 w-3 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-gray-400">
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="bg-slate-700/50 rounded-lg p-4 min-h-[80px] cursor-pointer hover:bg-slate-700/70 transition-colors"
                onClick={() => startEdit(field.key, branding[field.key])}
              >
                {branding[field.key] ? (
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{branding[field.key]}</p>
                ) : (
                  <p className="text-gray-500 text-sm italic">{field.placeholder}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

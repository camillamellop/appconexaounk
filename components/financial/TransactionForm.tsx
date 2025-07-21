"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Transaction } from "@/lib/financial-types"
import { expenseCategories, incomeCategories } from "@/lib/financial-types"

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: Omit<Transaction, "id">) => void
  transaction?: Transaction
}

export default function TransactionForm({ isOpen, onClose, onSave, transaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    title: transaction?.title || "",
    amount: transaction?.amount || 0,
    type: transaction?.type || ("expense" as "income" | "expense"),
    category: transaction?.category || "",
    date: transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
    isRecurring: transaction?.isRecurring || false,
    recurringType: transaction?.recurringType || ("monthly" as "monthly" | "weekly" | "yearly"),
    tags: transaction?.tags || [],
  })

  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.amount || !formData.category) return

    onSave({
      ...formData,
      date: new Date(formData.date),
    })
    onClose()
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const categories = formData.type === "income" ? incomeCategories : expenseCategories

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, type: "income", category: "" }))}
              className={
                formData.type === "income" ? "bg-green-600 hover:bg-green-700" : "border-slate-600 hover:bg-slate-700"
              }
            >
              Receita
            </Button>
            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              onClick={() => setFormData((prev) => ({ ...prev, type: "expense", category: "" }))}
              className={
                formData.type === "expense" ? "bg-red-600 hover:bg-red-700" : "border-slate-600 hover:bg-slate-700"
              }
            >
              Despesa
            </Button>
          </div>

          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              required
            />
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-slate-700 border-slate-600"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              rows={2}
            />
          </div>

          {/* Recorrente */}
          <div className="flex items-center justify-between">
            <Label htmlFor="recurring">Transação Recorrente</Label>
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: checked }))}
            />
          </div>

          {formData.isRecurring && (
            <div>
              <Label htmlFor="recurringType">Frequência</Label>
              <Select
                value={formData.recurringType}
                onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                  setFormData((prev) => ({ ...prev, recurringType: value }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                className="bg-slate-700 border-slate-600"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-slate-600 text-gray-300">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 hover:bg-slate-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              {transaction ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventDocument } from "@/lib/agenda-types"
import { FolderOpen, Download, Trash2, Plus } from "lucide-react"

interface DocumentsSectionProps {
  documents: EventDocument[]
  onAddDocument: (document: Omit<EventDocument, "id" | "uploadedAt">) => void
  onDeleteDocument: (documentId: string) => void
}

export default function DocumentsSection({ documents, onAddDocument, onDeleteDocument }: DocumentsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "other" as EventDocument["type"],
    url: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddDocument(formData)
    setFormData({ name: "", type: "other", url: "" })
    setShowForm(false)
  }

  const getDocumentIcon = (type: EventDocument["type"]) => {
    switch (type) {
      case "contract":
        return "📄"
      case "rider":
        return "🎵"
      case "invoice":
        return "💰"
      default:
        return "📎"
    }
  }

  const getDocumentTypeLabel = (type: EventDocument["type"]) => {
    switch (type) {
      case "contract":
        return "Contrato"
      case "rider":
        return "Rider Técnico"
      case "invoice":
        return "Nota Fiscal"
      default:
        return "Outro"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Documentos
        </CardTitle>
      </CardHeader>

      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Nenhum documento anexado.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {documents.map((document) => (
              <div key={document.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDocumentIcon(document.type)}</span>
                  <div>
                    <h3 className="font-semibold text-white">{document.name}</h3>
                    <p className="text-slate-400 text-sm">{getDocumentTypeLabel(document.type)}</p>
                    <p className="text-slate-500 text-xs">
                      Enviado em {document.uploadedAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white"
                    onClick={() => window.open(document.url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => onDeleteDocument(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-4 rounded-lg">
            <div>
              <Label htmlFor="docName" className="text-white">
                Nome do Documento *
              </Label>
              <Input
                id="docName"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="Ex: Contrato Show XYZ"
                required
              />
            </div>

            <div>
              <Label htmlFor="docType" className="text-white">
                Tipo de Documento
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as EventDocument["type"] }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="rider">Rider Técnico</SelectItem>
                  <SelectItem value="invoice">Nota Fiscal</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="docUrl" className="text-white">
                URL do Documento *
              </Label>
              <Input
                id="docUrl"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="https://drive.google.com/..."
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Salvar Documento
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setShowForm(true)} className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Anexar Documento
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

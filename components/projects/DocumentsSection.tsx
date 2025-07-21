"use client"

import type React from "react"

import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, Trash2, FolderOpen } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { ProjectDocument } from "@/lib/project-types"

export default function DocumentsSection() {
  const [documents, setDocuments] = useLocalStorage<ProjectDocument[]>("projectDocuments", [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newDocument: ProjectDocument = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        url: URL.createObjectURL(file), // Em produção, seria upload para servidor
        uploadedAt: new Date(),
      }

      setDocuments((prev) => [...prev, newDocument])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
    if (type.includes("powerpoint") || type.includes("presentation")) return "📊"
    return "📁"
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-500" />
            Documentos do Projeto
          </CardTitle>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {documents.length} arquivo{documents.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-gray-400 text-sm">Anexe documentos importantes para seus projetos</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Arquivos
          </Button>
          <p className="text-xs text-gray-500 mt-2">Suporte: PDF, DOC, XLS, PPT, JPG, PNG (máx. 10MB cada)</p>
        </div>

        {/* Lista de Documentos */}
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors group"
            >
              <span className="text-2xl">{getFileIcon(doc.type)}</span>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(doc.url, "_blank")}
                  className="h-8 w-8 text-gray-400 hover:text-blue-400"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDocument(doc.id)}
                  className="h-8 w-8 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum documento anexado ainda</p>
            <p className="text-sm">Faça upload dos seus arquivos importantes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

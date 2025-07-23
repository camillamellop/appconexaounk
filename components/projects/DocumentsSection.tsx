"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FolderOpen, Download, Trash2, Plus, FileText } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { formatFileSize, getFileIcon, type UploadedFile } from "@/lib/file-upload"
import type { ProjectDocument } from "@/lib/project-types"

export default function DocumentsSection() {
  const [documents, setDocuments] = useLocalStorage<ProjectDocument[]>("projectDocuments", [])
  const [showUpload, setShowUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (uploadedFiles: UploadedFile[]) => {
    setIsLoading(true)

    try {
      const newDocuments: ProjectDocument[] = uploadedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.url,
        uploadedAt: file.uploadedAt,
      }))

      setDocuments((prev) => [...prev, ...newDocuments])
      setShowUpload(false)
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
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
        {showUpload ? (
          <div className="space-y-4">
            <FileUpload
              onUpload={handleFileUpload}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUpload(false)}
                disabled={isLoading}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowUpload(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Anexar Documento
          </Button>
        )}

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

        {documents.length === 0 && !showUpload && (
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

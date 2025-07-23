"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, X, AlertCircle } from "lucide-react"
import { uploadFile, validateFile, formatFileSize, getFileIcon, type UploadedFile } from "@/lib/file-upload"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void
  multiple?: boolean
  accept?: string
  maxSize?: number
  className?: string
  disabled?: boolean
}

interface FileWithProgress {
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  result?: UploadedFile
}

export function FileUpload({
  onUpload,
  multiple = false,
  accept,
  maxSize,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: FileWithProgress[] = Array.from(selectedFiles).map((file) => {
      const validation = validateFile(file)
      return {
        file,
        progress: 0,
        status: validation.valid ? "pending" : "error",
        error: validation.error,
      }
    })

    setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles))

    // Start uploading valid files
    newFiles.forEach((fileWithProgress, index) => {
      if (fileWithProgress.status === "pending") {
        uploadFileWithProgress(fileWithProgress, index)
      }
    })
  }

  const uploadFileWithProgress = async (fileWithProgress: FileWithProgress, index: number) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "uploading" as const } : f)))

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f, i) => (i === index && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
        )
      }, 100)

      const result = await uploadFile(fileWithProgress.file)

      clearInterval(progressInterval)

      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, status: "success" as const, progress: 100, result } : f)),
      )

      // Call onUpload with successful uploads
      const successfulUploads = files.filter((f) => f.status === "success" && f.result).map((f) => f.result!)

      if (result) {
        onUpload([...successfulUploads, result])
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error" as const,
                progress: 0,
                error: error instanceof Error ? error.message : "Erro no upload",
              }
            : f,
        ),
      )
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-xs text-gray-500">
            {accept ? `Tipos aceitos: ${accept}` : "Todos os tipos de arquivo"}
            {maxSize && ` • Máximo: ${formatFileSize(maxSize)}`}
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileWithProgress, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(fileWithProgress.file.type)}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileWithProgress.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(fileWithProgress.file.size)}</p>

                  {fileWithProgress.status === "uploading" && (
                    <Progress value={fileWithProgress.progress} className="mt-1" />
                  )}

                  {fileWithProgress.status === "error" && (
                    <div className="flex items-center gap-1 mt-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">{fileWithProgress.error}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {fileWithProgress.status === "uploading" && <LoadingSpinner size="sm" />}

                  {fileWithProgress.status === "success" && <span className="text-green-600 text-xs">✓</span>}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

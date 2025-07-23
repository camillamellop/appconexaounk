export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
  all: [] as string[],
}

ALLOWED_FILE_TYPES.all = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents, ...ALLOWED_FILE_TYPES.audio]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(MAX_FILE_SIZE)}`,
    }
  }

  if (!ALLOWED_FILE_TYPES.all.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de arquivo não suportado",
    }
  }

  return { valid: true }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileIcon = (type: string): string => {
  if (type.includes("image")) return "🖼️"
  if (type.includes("pdf")) return "📄"
  if (type.includes("word") || type.includes("document")) return "📝"
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
  if (type.includes("powerpoint") || type.includes("presentation")) return "📊"
  if (type.includes("audio")) return "🎵"
  return "📁"
}

// Simulate file upload (in production, this would upload to a cloud service)
export const uploadFile = async (file: File): Promise<UploadedFile> => {
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  const url = URL.createObjectURL(file)

  return {
    id: fileId,
    name: file.name,
    type: file.type,
    size: file.size,
    url,
    uploadedAt: new Date(),
  }
}

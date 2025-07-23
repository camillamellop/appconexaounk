import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { validateFile } from "@/lib/file-upload"
import { handleApiError, createErrorResponse } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return createErrorResponse("Nenhum arquivo enviado", 400)
    }

    if (!userId) {
      return createErrorResponse("ID do usuário é obrigatório", 400)
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return createErrorResponse(validation.error!, 400)
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), "public", "uploads", userId)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return file info
    const fileUrl = `/uploads/${userId}/${filename}`

    return NextResponse.json({
      success: true,
      file: {
        id: timestamp.toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    const errorResponse = handleApiError(error)
    return createErrorResponse(errorResponse.message, errorResponse.statusCode)
  }
}

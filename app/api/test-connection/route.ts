import { NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"
import { handleApiError, createErrorResponse } from "@/lib/error-handler"

export async function GET() {
  try {
    const isConnected = await neonDB.testConnection()

    if (!isConnected) {
      return createErrorResponse("Falha na conexão com o banco de dados", 500)
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com banco de dados estabelecida com sucesso",
      timestamp: new Date().toISOString(),
      database: "Neon PostgreSQL",
    })
  } catch (error) {
    const errorResponse = handleApiError(error)
    return createErrorResponse(errorResponse.message, errorResponse.statusCode)
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"
import { cache, CACHE_KEYS } from "@/lib/cache"
import { handleApiError, createErrorResponse } from "@/lib/error-handler"

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return createErrorResponse("Email e senha são obrigatórios", 400)
    }

    // Check cache first
    const cacheKey = CACHE_KEYS.USER_BY_EMAIL(email)
    let user = cache.get(cacheKey)

    if (!user) {
      // Fetch from database
      user = await neonDB.getUsuarioByEmail(email)

      if (user) {
        // Cache the user
        cache.set(cacheKey, user, 5 * 60 * 1000) // 5 minutes
      }
    }

    if (!user) {
      return createErrorResponse("Usuário não encontrado", 404)
    }

    // Simple password check (in production, use bcrypt)
    if (user.senha !== senha) {
      return createErrorResponse("Senha incorreta", 401)
    }

    // Remove password from response
    const { senha: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: userWithoutPassword,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error)
    return createErrorResponse(errorResponse.message, errorResponse.statusCode)
  }
}

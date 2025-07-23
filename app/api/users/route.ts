import { type NextRequest, NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"
import { cache, CACHE_KEYS } from "@/lib/cache"
import { handleApiError, createErrorResponse } from "@/lib/error-handler"

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const cachedUsers = cache.get(CACHE_KEYS.USERS)
    if (cachedUsers) {
      return NextResponse.json({
        success: true,
        data: cachedUsers,
        cached: true,
        timestamp: new Date().toISOString(),
      })
    }

    // Fetch from database
    const users = await neonDB.getUsuarios()

    // Cache the result
    cache.set(CACHE_KEYS.USERS, users, 10 * 60 * 1000) // 10 minutes

    return NextResponse.json({
      success: true,
      data: users,
      cached: false,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error)
    return createErrorResponse(errorResponse.message, errorResponse.statusCode)
  }
}

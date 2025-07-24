import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@/lib/neon"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "conexaounk-secret-key"
const COOKIE_NAME = "auth_token"

export async function POST(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = cookies().get(COOKIE_NAME)?.value

    if (token) {
      try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

        // Remover sessão do banco
        const sql = neon(process.env.DATABASE_URL || "")
        await sql`
          DELETE FROM sessoes
          WHERE usuario_id = ${decoded.id} AND token = ${token}
        `
      } catch (error) {
        console.error("Erro ao verificar token:", error)
      }

      // Remover cookie
      cookies().delete(COOKIE_NAME)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

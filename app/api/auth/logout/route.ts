import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Remover sessão do banco
        await sql`
          DELETE FROM sessoes 
          WHERE usuario_id = ${decoded.userId}
        `
      } catch (error) {
        console.error("Erro ao decodificar token:", error)
      }
    }

    // Criar resposta e limpar cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete("auth-token")

    return response
  } catch (error) {
    console.error("Erro no logout:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

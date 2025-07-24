import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { neon } from "@/lib/neon"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "conexaounk-secret-key"
const COOKIE_NAME = "auth_token"

export async function GET(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = cookies().get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; type: string }

      // Verificar se a sessão existe no banco
      const sql = neon(process.env.DATABASE_URL || "")
      const sessions = await sql`
        SELECT * FROM sessoes
        WHERE usuario_id = ${decoded.id} AND token = ${token} AND expira_em > NOW()
      `

      if (sessions.length === 0) {
        cookies().delete(COOKIE_NAME)
        return NextResponse.json({ error: "Sessão expirada" }, { status: 401 })
      }

      // Buscar dados atualizados do usuário
      const users = await sql`
        SELECT id, nome, email, tipo
        FROM usuarios
        WHERE id = ${decoded.id} AND ativo = true
      `

      if (users.length === 0) {
        cookies().delete(COOKIE_NAME)
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
      }

      const user = users[0]

      // Retornar dados do usuário
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.nome,
          email: user.email,
          type: user.tipo,
        },
      })
    } catch (error) {
      console.error("Erro ao verificar token:", error)
      cookies().delete(COOKIE_NAME)
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

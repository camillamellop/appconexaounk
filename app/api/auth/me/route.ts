import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Verificar se a sessão ainda existe no banco
    const sessions = await sql`
      SELECT s.*, u.nome, u.email, u.tipo, u.ativo
      FROM sessoes s
      JOIN usuarios u ON s.usuario_id = u.id
      WHERE s.usuario_id = ${decoded.userId} 
      AND s.expires_at > NOW()
      AND u.ativo = true
    `

    if (sessions.length === 0) {
      return NextResponse.json({ success: false, error: "Sessão expirada" }, { status: 401 })
    }

    const session = sessions[0]

    return NextResponse.json({
      success: true,
      user: {
        id: session.usuario_id,
        nome: session.nome,
        email: session.email,
        tipo: session.tipo,
        ativo: session.ativo,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
  }
}

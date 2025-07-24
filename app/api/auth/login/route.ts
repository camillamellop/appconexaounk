import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json({ success: false, error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco
    const users = await sql`
      SELECT id, nome, email, tipo, ativo, senha
      FROM usuarios 
      WHERE email = ${email} AND ativo = true
    `

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Usuário não encontrado" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha (assumindo que está em texto plano por enquanto)
    if (user.senha !== senha) {
      return NextResponse.json({ success: false, error: "Senha incorreta" }, { status: 401 })
    }

    // Criar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tipo: user.tipo,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Salvar sessão no banco
    await sql`
      INSERT INTO sessoes (usuario_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
      ON CONFLICT (usuario_id) 
      DO UPDATE SET token = ${token}, expires_at = ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
    `

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        ativo: user.ativo,
      },
    })

    // Definir cookie httpOnly
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

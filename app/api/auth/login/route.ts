import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@/lib/neon"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "conexaounk-secret-key"
const COOKIE_NAME = "auth_token"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Consultar usuário no banco
    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql`
      SELECT id, nome, email, tipo
      FROM usuarios
      WHERE email = ${email} AND senha = ${password} AND ativo = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = result[0]

    // Criar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.tipo,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Salvar sessão no banco
    await sql`
      INSERT INTO sessoes (usuario_id, token, expira_em)
      VALUES (${user.id}, ${token}, ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
    `

    // Definir cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

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
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

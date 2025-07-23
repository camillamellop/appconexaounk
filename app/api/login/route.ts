import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSql } from "@/lib/neon"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const sql = getSql()

    // Buscar usuário por email
    const users = await sql`
      SELECT id, nome, email, senha, tipo, ativo 
      FROM usuarios 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const user = users[0]

    if (!user.ativo) {
      return NextResponse.json({ error: "Conta desativada" }, { status: 401 })
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.senha)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Remover senha do objeto de resposta
    const { senha, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

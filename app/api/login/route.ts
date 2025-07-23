import { NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, senha } = body

    console.log("🔐 Tentativa de login para:", email)

    // Validar dados obrigatórios
    if (!email || !senha) {
      return NextResponse.json(
        {
          success: false,
          message: "Email e senha são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Buscar usuário no banco
    const usuario = await neonDB.getUsuarioByEmail(email)

    if (!usuario) {
      console.log("❌ Usuário não encontrado:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Email ou senha incorretos",
        },
        { status: 401 },
      )
    }

    if (!usuario.ativo) {
      console.log("❌ Usuário inativo:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Usuário inativo",
        },
        { status: 401 },
      )
    }

    // Verificar senha (em produção, use bcrypt)
    if (usuario.senha !== senha) {
      console.log("❌ Senha incorreta para:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Email ou senha incorretos",
        },
        { status: 401 },
      )
    }

    // Criar objeto do usuário sem a senha
    const userSession = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      ativo: usuario.ativo,
    }

    console.log("✅ Login realizado com sucesso para:", usuario.nome)

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: userSession,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro no login:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

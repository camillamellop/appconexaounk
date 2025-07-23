import { NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"

export async function GET() {
  try {
    console.log("📊 Buscando todos os usuários...")

    const usuarios = await neonDB.getAllUsuarios()

    console.log(`✅ ${usuarios.length} usuários encontrados`)

    return NextResponse.json({
      success: true,
      message: `${usuarios.length} usuários encontrados`,
      data: usuarios,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao buscar usuários:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar usuários",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, senha, tipo_usuario } = body

    console.log("👤 Criando novo usuário:", email)

    // Validar dados obrigatórios
    if (!nome || !email || !senha) {
      return NextResponse.json(
        {
          success: false,
          message: "Nome, email e senha são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Verificar se o email já existe
    const usuarioExistente = await neonDB.getUsuarioByEmail(email)
    if (usuarioExistente) {
      return NextResponse.json(
        {
          success: false,
          message: "Email já está em uso",
        },
        { status: 409 },
      )
    }

    // Criar usuário
    const novoUsuario = await neonDB.createUsuario({
      nome,
      email,
      senha,
      tipo_usuario: tipo_usuario || "dj",
      ativo: true,
    })

    console.log("✅ Usuário criado:", novoUsuario.nome)

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      data: usuarioSemSenha,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao criar usuário:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar usuário",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

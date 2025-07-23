import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const projetos = await prisma.projetos.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
      },
      include: {
        _count: {
          select: {
            tarefas: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(projetos)
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const projeto = await prisma.projetos.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        status: data.status || "ativo",
        data_inicio: data.data_inicio ? new Date(data.data_inicio) : null,
        data_fim: data.data_fim ? new Date(data.data_fim) : null,
        usuario_id: data.usuario_id,
      },
    })

    return NextResponse.json(projeto, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 })
  }
}

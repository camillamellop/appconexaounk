import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const tarefas = await prisma.tarefas.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
      },
      include: {
        projeto: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: [{ data_vencimento: "asc" }, { prioridade: "desc" }],
    })

    return NextResponse.json(tarefas)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return NextResponse.json({ error: "Erro ao buscar tarefas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const tarefa = await prisma.tarefas.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        prioridade: data.prioridade || "media",
        status: data.status || "pendente",
        data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : null,
        usuario_id: data.usuario_id,
        projeto_id: data.projeto_id || null,
      },
    })

    return NextResponse.json(tarefa, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 })
  }
}

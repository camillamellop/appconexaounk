import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const eventos = await prisma.agenda.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
      },
      orderBy: {
        data_evento: "asc",
      },
    })

    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Erro ao buscar agenda:", error)
    return NextResponse.json({ error: "Erro ao buscar agenda" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const evento = await prisma.agenda.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        data_evento: new Date(data.data_evento),
        hora_inicio: data.hora_inicio,
        hora_fim: data.hora_fim,
        local: data.local,
        tipo: data.tipo || "evento",
        status: data.status || "agendado",
        usuario_id: data.usuario_id,
      },
    })

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 })
  }
}

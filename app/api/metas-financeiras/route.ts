import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const metas = await prisma.metas_financeiras.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
      },
      orderBy: {
        data_fim: "asc",
      },
    })

    return NextResponse.json(metas)
  } catch (error) {
    console.error("Erro ao buscar metas financeiras:", error)
    return NextResponse.json({ error: "Erro ao buscar metas financeiras" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const meta = await prisma.metas_financeiras.create({
      data: {
        nome: data.nome,
        valor_meta: Number.parseFloat(data.valor_meta),
        valor_atual: data.valor_atual ? Number.parseFloat(data.valor_atual) : 0,
        data_inicio: new Date(data.data_inicio),
        data_fim: new Date(data.data_fim),
        status: data.status || "ativa",
        usuario_id: data.usuario_id,
      },
    })

    return NextResponse.json(meta, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar meta financeira:", error)
    return NextResponse.json({ error: "Erro ao criar meta financeira" }, { status: 500 })
  }
}

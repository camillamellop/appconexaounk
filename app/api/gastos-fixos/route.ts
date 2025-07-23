import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const gastosFixos = await prisma.gastos_fixos.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
        ativo: true,
      },
      orderBy: {
        dia_vencimento: "asc",
      },
    })

    return NextResponse.json(gastosFixos)
  } catch (error) {
    console.error("Erro ao buscar gastos fixos:", error)
    return NextResponse.json({ error: "Erro ao buscar gastos fixos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const gastoFixo = await prisma.gastos_fixos.create({
      data: {
        descricao: data.descricao,
        valor: Number.parseFloat(data.valor),
        categoria: data.categoria,
        dia_vencimento: Number.parseInt(data.dia_vencimento),
        ativo: data.ativo !== undefined ? data.ativo : true,
        usuario_id: data.usuario_id,
      },
    })

    return NextResponse.json(gastoFixo, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar gasto fixo:", error)
    return NextResponse.json({ error: "Erro ao criar gasto fixo" }, { status: 500 })
  }
}

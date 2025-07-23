import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const transacoes = await prisma.transacoes.findMany({
      where: {
        usuario_id: Number.parseInt(usuarioId),
      },
      orderBy: {
        data: "desc",
      },
    })

    return NextResponse.json(transacoes)
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const transacao = await prisma.transacoes.create({
      data: {
        descricao: data.descricao,
        valor: Number.parseFloat(data.valor),
        tipo: data.tipo,
        categoria: data.categoria,
        data: data.data ? new Date(data.data) : new Date(),
        usuario_id: data.usuario_id,
      },
    })

    return NextResponse.json(transacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 })
  }
}

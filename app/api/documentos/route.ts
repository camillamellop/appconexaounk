import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const documentos = await prisma.documentos.findMany({
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
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(documentos)
  } catch (error) {
    console.error("Erro ao buscar documentos:", error)
    return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const documento = await prisma.documentos.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
        url: data.url || null,
        conteudo: data.conteudo || null,
        usuario_id: data.usuario_id,
        projeto_id: data.projeto_id || null,
      },
    })

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar documento:", error)
    return NextResponse.json({ error: "Erro ao criar documento" }, { status: 500 })
  }
}

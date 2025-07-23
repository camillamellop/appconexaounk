import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/neon"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do documento é obrigatório",
        },
        { status: 400 },
      )
    }

    const result = await sql`
      DELETE FROM documentos 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Documento não encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Documento deletado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao deletar documento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao deletar documento",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

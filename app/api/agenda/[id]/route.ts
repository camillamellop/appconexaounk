import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/neon"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const updates = await request.json()
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do evento é obrigatório",
        },
        { status: 400 },
      )
    }

    // Construir query de update dinamicamente
    const updateFields = []
    const values = []
    let paramIndex = 1

    if (updates.titulo) {
      updateFields.push(`titulo = $${paramIndex++}`)
      values.push(updates.titulo)
    }
    if (updates.descricao !== undefined) {
      updateFields.push(`descricao = $${paramIndex++}`)
      values.push(updates.descricao)
    }
    if (updates.data_inicio) {
      updateFields.push(`data_inicio = $${paramIndex++}`)
      values.push(updates.data_inicio)
    }
    if (updates.data_fim !== undefined) {
      updateFields.push(`data_fim = $${paramIndex++}`)
      values.push(updates.data_fim)
    }
    if (updates.local !== undefined) {
      updateFields.push(`local = $${paramIndex++}`)
      values.push(updates.local)
    }
    if (updates.tipo) {
      updateFields.push(`tipo = $${paramIndex++}`)
      values.push(updates.tipo)
    }
    if (updates.status) {
      updateFields.push(`status = $${paramIndex++}`)
      values.push(updates.status)
    }
    if (updates.preco !== undefined) {
      updateFields.push(`preco = $${paramIndex++}`)
      values.push(updates.preco)
    }
    if (updates.cor !== undefined) {
      updateFields.push(`cor = $${paramIndex++}`)
      values.push(updates.cor)
    }

    updateFields.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE agenda 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql(query, values)

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Evento não encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Evento atualizado com sucesso",
      data: result[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar evento",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do evento é obrigatório",
        },
        { status: 400 },
      )
    }

    const result = await sql`
      DELETE FROM agenda 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Evento não encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Evento deletado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao deletar evento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao deletar evento",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

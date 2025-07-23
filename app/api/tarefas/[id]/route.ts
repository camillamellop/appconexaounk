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
          message: "ID da tarefa é obrigatório",
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
    if (updates.status) {
      updateFields.push(`status = $${paramIndex++}`)
      values.push(updates.status)
    }
    if (updates.prioridade) {
      updateFields.push(`prioridade = $${paramIndex++}`)
      values.push(updates.prioridade)
    }
    if (updates.data_vencimento !== undefined) {
      updateFields.push(`data_vencimento = $${paramIndex++}`)
      values.push(updates.data_vencimento)
    }
    if (updates.categoria !== undefined) {
      updateFields.push(`categoria = $${paramIndex++}`)
      values.push(updates.categoria)
    }
    if (updates.progresso !== undefined) {
      updateFields.push(`progresso = $${paramIndex++}`)
      values.push(updates.progresso)
    }

    updateFields.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE tarefas 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql(query, values)

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tarefa não encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tarefa atualizada com sucesso",
      data: result[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar tarefa",
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
          message: "ID da tarefa é obrigatório",
        },
        { status: 400 },
      )
    }

    const result = await sql`
      DELETE FROM tarefas 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tarefa não encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tarefa deletada com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao deletar tarefa",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

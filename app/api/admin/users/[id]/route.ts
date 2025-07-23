import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const updates = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    // Build dynamic update query
    const updateFields = []
    const values = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(updates)) {
      if (["nome", "email", "role", "is_active"].includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(userId)

    const query = `
      UPDATE usuarios 
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, nome, email, role, is_active, created_at, updated_at
    `

    const result = await sql(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    // Check if user exists and is not admin
    const user = await sql`
      SELECT role FROM usuarios WHERE id = ${userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    if (user[0].role === "admin") {
      return NextResponse.json({ error: "Não é possível excluir usuários administradores" }, { status: 403 })
    }

    // Delete user
    await sql`
      DELETE FROM usuarios WHERE id = ${userId}
    `

    return NextResponse.json({ message: "Usuário excluído com sucesso" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

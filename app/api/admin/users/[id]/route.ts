import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/neon"

const sql = getSql()

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id)
    const updates = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    // constrói o UPDATE dinamicamente
    const allowed = ["nome", "email", "role", "is_active"]
    const setParts: string[] = []
    const values: any[] = []

    Object.entries(updates).forEach(([key, value]) => {
      if (allowed.includes(key)) {
        setParts.push(`${key} = $${setParts.length + 1}`)
        values.push(value)
      }
    })

    if (!setParts.length) {
      return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    }

    // updated_at automático
    setParts.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(userId) // WHERE id = $n

    const query = `
      UPDATE public.usuarios
      SET ${setParts.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, nome, email, role, is_active, created_at, updated_at
    `
    const result = await sql(query, values)

    if (!result.length) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err)
    return NextResponse.json({ error: "Falha ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id)
    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const user = await sql`SELECT role FROM public.usuarios WHERE id = ${userId}`
    if (!user.length) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }
    if (user[0].role === "admin") {
      return NextResponse.json({ error: "Não é possível excluir usuários administradores" }, { status: 403 })
    }

    await sql`DELETE FROM public.usuarios WHERE id = ${userId}`
    return NextResponse.json({ message: "Usuário excluído com sucesso" })
  } catch (err) {
    console.error("Erro ao excluir usuário:", err)
    return NextResponse.json({ error: "Falha ao excluir usuário" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { neonDB, getSql } from "@/lib/neon"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do usuário é obrigatório",
        },
        { status: 400 },
      )
    }

    console.log(`📋 Buscando tarefas para usuário: ${usuarioId}`)

    const tarefas = await neonDB.getTarefasByUsuario(usuarioId)

    console.log(`✅ ${tarefas.length} tarefas encontradas`)

    return NextResponse.json({
      success: true,
      message: `${tarefas.length} tarefas encontradas`,
      data: tarefas,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao buscar tarefas:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar tarefas",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      usuario_id,
      titulo,
      descricao,
      status = "pendente",
      prioridade = "media",
      data_vencimento,
      categoria,
      tags = [],
      progresso = 0,
    } = body

    if (!usuario_id || !titulo) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do usuário e título são obrigatórios",
        },
        { status: 400 },
      )
    }

    console.log(`📋 Criando nova tarefa: ${titulo}`)

    const sql = getSql()
    const result = await sql`
      INSERT INTO public.tarefas (
        usuario_id, titulo, descricao, status, prioridade, 
        data_vencimento, categoria, tags, progresso
      )
      VALUES (
        ${usuario_id}, ${titulo}, ${descricao}, ${status}, ${prioridade},
        ${data_vencimento}, ${categoria}, ${tags}, ${progresso}
      )
      RETURNING *
    `

    const newTask = result[0]

    console.log(`✅ Tarefa criada com sucesso: ${newTask.id}`)

    return NextResponse.json({
      success: true,
      message: "Tarefa criada com sucesso",
      data: newTask,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao criar tarefa:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar tarefa",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

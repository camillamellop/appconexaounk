import { type NextRequest, NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"

/**
 * GET  /api/agenda?usuario_id=<uuid>
 * ------------------------------------------------------------------
 * Retorna todos os eventos da agenda de um usuário.
 * Sempre devolve JSON, inclusive em caso de erro, para que o
 * front-end possa fazer res.json() sem quebrar.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json(
        {
          success: false,
          message: "Parâmetro 'usuario_id' é obrigatório",
        },
        { status: 400 },
      )
    }

    const eventos = await neonDB.getAgendasByUsuario(usuarioId)

    return NextResponse.json(
      {
        success: true,
        data: eventos,
        total: eventos.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("💥 Erro interno em GET /api/agenda:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao buscar agenda",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

/**
 * POST  /api/agenda
 * ------------------------------------------------------------------
 * Cria um novo evento para determinado usuário.
 * Exemplo de body JSON:
 * {
 *   "usuario_id": "uuid",
 *   "titulo": "Meu show",
 *   "descricao": "Detalhes...",
 *   "data_evento": "2025-12-31",
 *   "hora_inicio": "22:00",
 *   "hora_fim": "23:30",
 *   "local": "Clube XYZ",
 *   "tipo_evento": "show",
 *   "status": "agendado"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>

    const required = ["usuario_id", "titulo", "data_evento", "hora_inicio"]
    const missing = required.filter((k) => !body[k])

    if (missing.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Campos obrigatórios faltando: ${missing.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const novoEvento = await neonDB.createAgenda({
      usuario_id: body.usuario_id as string,
      titulo: body.titulo as string,
      descricao: (body.descricao as string) || null,
      data_evento: body.data_evento as string,
      hora_inicio: body.hora_inicio as string,
      hora_fim: (body.hora_fim as string) || null,
      local: (body.local as string) || null,
      tipo_evento: (body.tipo_evento as string) || "show",
      status: (body.status as string) || "agendado",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Evento criado com sucesso",
        data: novoEvento,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("💥 Erro interno em POST /api/agenda:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao criar evento",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

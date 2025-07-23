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

    console.log(`📄 Buscando documentos para usuário: ${usuarioId}`)

    const documentos = await neonDB.getDocumentosByUsuario(usuarioId)

    console.log(`✅ ${documentos.length} documentos encontrados`)

    return NextResponse.json({
      success: true,
      message: `${documentos.length} documentos encontrados`,
      data: documentos,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao buscar documentos:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar documentos",
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
    const { usuario_id, nome, tipo, url, tamanho } = body

    if (!usuario_id || !nome || !tipo) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do usuário, nome e tipo são obrigatórios",
        },
        { status: 400 },
      )
    }

    console.log(`📄 Criando novo documento: ${nome}`)

    const sql = getSql()
    const result = await sql`
      INSERT INTO public.documentos (usuario_id, nome, tipo, url, tamanho)
      VALUES (${usuario_id}, ${nome}, ${tipo}, ${url}, ${tamanho})
      RETURNING *
    `

    const newDocument = result[0]

    console.log(`✅ Documento criado com sucesso: ${newDocument.id}`)

    return NextResponse.json({
      success: true,
      message: "Documento criado com sucesso",
      data: newDocument,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro ao criar documento:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar documento",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { neonDB } from "@/lib/neon"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get("usuario_id")

    if (!usuarioId) {
      return NextResponse.json(
        {
          success: false,
          message: "usuario_id é obrigatório",
        },
        { status: 400 },
      )
    }

    const metas = await neonDB.getMetasFinanceirasByUsuario(usuarioId)

    // Calcular estatísticas das metas
    const estatisticas = metas.reduce(
      (acc, meta) => {
        const progresso = (Number(meta.valor_atual) / Number(meta.valor_meta)) * 100
        acc.totalMetas++
        acc.valorTotalMetas += Number(meta.valor_meta)
        acc.valorTotalAtual += Number(meta.valor_atual)

        if (meta.status === "ativa") acc.metasAtivas++
        if (meta.status === "concluida") acc.metasConcluidas++
        if (progresso >= 100) acc.metasAlcancadas++

        return acc
      },
      {
        totalMetas: 0,
        metasAtivas: 0,
        metasConcluidas: 0,
        metasAlcancadas: 0,
        valorTotalMetas: 0,
        valorTotalAtual: 0,
      },
    )

    const progressoGeral =
      estatisticas.valorTotalMetas > 0 ? (estatisticas.valorTotalAtual / estatisticas.valorTotalMetas) * 100 : 0

    return NextResponse.json({
      success: true,
      data: metas.map((meta) => ({
        ...meta,
        progresso_percentual: ((Number(meta.valor_atual) / Number(meta.valor_meta)) * 100).toFixed(2),
      })),
      estatisticas: {
        ...estatisticas,
        progressoGeral: progressoGeral.toFixed(2),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar metas financeiras:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar metas financeiras",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const metaData = await request.json()

    if (
      !metaData.usuario_id ||
      !metaData.titulo ||
      !metaData.valor_meta ||
      !metaData.data_inicio ||
      !metaData.data_fim
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "usuario_id, titulo, valor_meta, data_inicio e data_fim são obrigatórios",
        },
        { status: 400 },
      )
    }

    if (new Date(metaData.data_fim) <= new Date(metaData.data_inicio)) {
      return NextResponse.json(
        {
          success: false,
          message: "data_fim deve ser posterior à data_inicio",
        },
        { status: 400 },
      )
    }

    const novaMeta = await neonDB.createMetaFinanceira(metaData)

    return NextResponse.json(
      {
        success: true,
        message: "Meta financeira criada com sucesso",
        data: novaMeta,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar meta financeira:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar meta financeira",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

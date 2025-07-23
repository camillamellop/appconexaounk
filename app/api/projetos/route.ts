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

    const projetos = await neonDB.getProjetosByUsuario(usuarioId)

    // Calcular estatísticas dos projetos
    const estatisticas = projetos.reduce(
      (acc, projeto) => {
        acc.totalProjetos++
        acc.progressoMedio += Number(projeto.progresso)

        switch (projeto.status) {
          case "planejamento":
            acc.emPlanejamento++
            break
          case "em_andamento":
            acc.emAndamento++
            break
          case "pausado":
            acc.pausados++
            break
          case "concluido":
            acc.concluidos++
            break
          case "cancelado":
            acc.cancelados++
            break
        }

        if (projeto.orcamento) {
          acc.orcamentoTotal += Number(projeto.orcamento)
        }

        return acc
      },
      {
        totalProjetos: 0,
        emPlanejamento: 0,
        emAndamento: 0,
        pausados: 0,
        concluidos: 0,
        cancelados: 0,
        progressoMedio: 0,
        orcamentoTotal: 0,
      },
    )

    if (estatisticas.totalProjetos > 0) {
      estatisticas.progressoMedio = estatisticas.progressoMedio / estatisticas.totalProjetos
    }

    return NextResponse.json({
      success: true,
      data: projetos,
      estatisticas: {
        ...estatisticas,
        progressoMedio: estatisticas.progressoMedio.toFixed(2),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar projetos",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const projetoData = await request.json()

    if (!projetoData.usuario_id || !projetoData.nome) {
      return NextResponse.json(
        {
          success: false,
          message: "usuario_id e nome são obrigatórios",
        },
        { status: 400 },
      )
    }

    if (
      projetoData.data_fim &&
      projetoData.data_inicio &&
      new Date(projetoData.data_fim) <= new Date(projetoData.data_inicio)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "data_fim deve ser posterior à data_inicio",
        },
        { status: 400 },
      )
    }

    const novoProjeto = await neonDB.createProjeto(projetoData)

    return NextResponse.json(
      {
        success: true,
        message: "Projeto criado com sucesso",
        data: novoProjeto,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar projeto",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

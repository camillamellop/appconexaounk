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

    const gastosFixos = await neonDB.getGastosFixosByUsuario(usuarioId)

    // Calcular total mensal
    const totalMensal = gastosFixos.reduce((acc, gasto) => acc + Number(gasto.valor), 0)

    return NextResponse.json({
      success: true,
      data: gastosFixos,
      resumo: {
        totalMensal,
        totalGastos: gastosFixos.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar gastos fixos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar gastos fixos",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const gastoData = await request.json()

    if (
      !gastoData.usuario_id ||
      !gastoData.nome ||
      !gastoData.categoria ||
      !gastoData.valor ||
      !gastoData.dia_vencimento
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "usuario_id, nome, categoria, valor e dia_vencimento são obrigatórios",
        },
        { status: 400 },
      )
    }

    if (gastoData.dia_vencimento < 1 || gastoData.dia_vencimento > 31) {
      return NextResponse.json(
        {
          success: false,
          message: "dia_vencimento deve estar entre 1 e 31",
        },
        { status: 400 },
      )
    }

    const novoGasto = await neonDB.createGastoFixo(gastoData)

    return NextResponse.json(
      {
        success: true,
        message: "Gasto fixo criado com sucesso",
        data: novoGasto,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar gasto fixo:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar gasto fixo",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

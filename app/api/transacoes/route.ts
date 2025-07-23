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

    const transacoes = await neonDB.getTransacoesByUsuario(usuarioId)

    // Calcular resumo financeiro
    const resumo = transacoes.reduce(
      (acc, transacao) => {
        if (transacao.tipo === "receita") {
          acc.totalReceitas += Number(transacao.valor)
        } else {
          acc.totalDespesas += Number(transacao.valor)
        }
        return acc
      },
      { totalReceitas: 0, totalDespesas: 0 },
    )

    const saldo = resumo.totalReceitas - resumo.totalDespesas

    return NextResponse.json({
      success: true,
      data: transacoes,
      resumo: {
        ...resumo,
        saldo,
        totalTransacoes: transacoes.length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar transações",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const transacaoData = await request.json()

    if (
      !transacaoData.usuario_id ||
      !transacaoData.tipo ||
      !transacaoData.categoria ||
      !transacaoData.descricao ||
      !transacaoData.valor ||
      !transacaoData.data_transacao
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "usuario_id, tipo, categoria, descricao, valor e data_transacao são obrigatórios",
        },
        { status: 400 },
      )
    }

    if (!["receita", "despesa"].includes(transacaoData.tipo)) {
      return NextResponse.json(
        {
          success: false,
          message: "tipo deve ser 'receita' ou 'despesa'",
        },
        { status: 400 },
      )
    }

    const novaTransacao = await neonDB.createTransacao(transacaoData)

    return NextResponse.json(
      {
        success: true,
        message: "Transação criada com sucesso",
        data: novaTransacao,
        timestamp: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar transação",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

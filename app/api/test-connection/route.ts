import { NextResponse } from "next/server"
import { getSql } from "@/lib/neon"

export async function GET() {
  try {
    console.log("🔗 Testando conexão com Neon...")

    const sql = getSql()

    // Teste básico de conexão
    const result = await sql`SELECT 1 as test, NOW() as timestamp`

    if (!result || result.length === 0) {
      throw new Error("Resposta vazia do banco de dados")
    }

    console.log("✅ Conexão com Neon bem-sucedida")

    // Teste de criação de tabela
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Verificar se a tabela usuarios existe
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      )
    `

    const tableExists = tableCheck[0]?.exists || false

    return NextResponse.json({
      success: true,
      message: "Conexão com Neon estabelecida com sucesso",
      data: {
        connected: true,
        timestamp: result[0].timestamp,
        test_value: result[0].test,
        usuarios_table_exists: tableExists,
        database_url_configured: !!process.env.NEON_NEON_DATABASE_URL,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 Erro na conexão com Neon:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Falha na conexão com Neon",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        data: {
          connected: false,
          database_url_configured: !!process.env.NEON_DATABASE_URL,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

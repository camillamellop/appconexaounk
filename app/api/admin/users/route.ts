import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/neon"

/**
 * Lazily obtain the Neon SQL client.
 * Throws a 500 if DATABASE_URL is missing at runtime.
 */
function sqlClient() {
  const sql = getSql()
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL env-var is missing at runtime.")
  }
  return sql
}

// -----------------------------------------------------------------------------
// GET /api/admin/users – list all users (admin only)
// -----------------------------------------------------------------------------
export async function GET() {
  try {
    const sql = sqlClient()

    const users = await sql`
      SELECT 
        id,
        nome,
        email,
        role,
        is_active,
        created_at,
        updated_at
      FROM usuarios
      ORDER BY created_at DESC
    `
    return NextResponse.json(users)
  } catch (err) {
    console.error("GET /api/admin/users failed:", err)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// -----------------------------------------------------------------------------
// POST /api/admin/users – create a new user
// -----------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      nome?: string
      email?: string
      senha?: string
      role?: string
    }

    const { nome, email, senha, role = "user" } = body
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    const sql = sqlClient()

    // E-mail uniqueness check
    const [exists] = await sql`
      SELECT 1 FROM usuarios WHERE email = ${email} LIMIT 1
    `
    if (exists) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 409 })
    }

    // Create
    const [user] = await sql`
      INSERT INTO usuarios (nome, email, senha, role, is_active)
      VALUES (${nome}, ${email}, ${senha}, ${role}, true)
      RETURNING id, nome, email, role, is_active, created_at, updated_at
    `

    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    console.error("POST /api/admin/users failed:", err)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        id, 
        nome, 
        email, 
        role, 
        is_active, 
        last_login, 
        created_at, 
        updated_at
      FROM usuarios 
      ORDER BY created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, role = "user" } = await request.json()

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM usuarios WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Usuário já existe com este email" }, { status: 409 })
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO usuarios (nome, email, senha, role, is_active, created_at, updated_at)
      VALUES (${nome}, ${email}, ${senha}, ${role}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, nome, email, role, is_active, created_at, updated_at
    `

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

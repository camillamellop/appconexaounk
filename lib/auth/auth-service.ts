import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export interface AuthUser {
  id: string
  nome: string
  email: string
  tipo: "admin" | "dj" | "produtor"
  ativo: boolean
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static async login(email: string, senha: string): Promise<{ user: AuthUser; token: string } | null> {
    try {
      console.log(`🔐 [AUTH] Attempting login for: ${email}`)

      const user = await prisma.usuarios.findUnique({
        where: { email },
      })

      if (!user || !user.ativo) {
        console.log(`❌ [AUTH] User not found or inactive: ${email}`)
        return null
      }

      const isValidPassword = await this.verifyPassword(senha, user.senha)
      if (!isValidPassword) {
        console.log(`❌ [AUTH] Invalid password for: ${email}`)
        return null
      }

      const authUser: AuthUser = {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        tipo: user.tipo as "admin" | "dj" | "produtor",
        ativo: user.ativo,
      }

      // Generate JWT token
      const token = await this.generateToken(authUser)

      console.log(`✅ [AUTH] Login successful for: ${email}`)
      return { user: authUser, token }
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error)
      return null
    }
  }

  private static async generateToken(user: AuthUser): Promise<string> {
    // Simple token implementation - in production use proper JWT
    return Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        tipo: user.tipo,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
      }),
    ).toString("base64")
  }

  static async validateToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())

      if (decoded.exp < Date.now()) {
        return null // Token expired
      }

      // Verify user still exists and is active
      const user = await prisma.usuarios.findUnique({
        where: { id: Number.parseInt(decoded.id) },
      })

      if (!user || !user.ativo) {
        return null
      }

      return {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        tipo: user.tipo as "admin" | "dj" | "produtor",
        ativo: user.ativo,
      }
    } catch (error) {
      console.error("❌ [AUTH] Token validation error:", error)
      return null
    }
  }
}

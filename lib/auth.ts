import { neonDB, type Usuario } from "./neon"

// In-memory session storage (replace with proper session management in production)
let currentUser: Usuario | null = null

export interface AuthUser {
  id: number
  nome: string
  email: string
  tipo: "admin" | "dj" | "produtor"
  ativo: boolean
}

export class AuthService {
  static async login(email: string, senha: string): Promise<AuthUser | null> {
    try {
      console.log(`🔐 [AUTH] Attempting login for: ${email}`)

      const user = await neonDB.getUsuarioByEmail(email)

      if (!user) {
        console.log(`❌ [AUTH] User not found: ${email}`)
        return null
      }

      if (!user.ativo) {
        console.log(`❌ [AUTH] User inactive: ${email}`)
        return null
      }

      // In production, use proper password hashing (bcrypt)
      if (user.senha !== senha) {
        console.log(`❌ [AUTH] Invalid password for: ${email}`)
        return null
      }

      const authUser: AuthUser = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        ativo: user.ativo,
      }

      currentUser = user
      console.log(`✅ [AUTH] Login successful for: ${email}`)
      return authUser
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error)
      return null
    }
  }

  static async logout(): Promise<void> {
    currentUser = null
    console.log("✅ [AUTH] User logged out")
  }

  static getCurrentUser(): AuthUser | null {
    if (!currentUser) return null

    return {
      id: currentUser.id,
      nome: currentUser.nome,
      email: currentUser.email,
      tipo: currentUser.tipo,
      ativo: currentUser.ativo,
    }
  }

  static isAuthenticated(): boolean {
    return currentUser !== null && currentUser.ativo
  }

  static isAdmin(): boolean {
    return this.isAuthenticated() && currentUser?.tipo === "admin"
  }

  static async validateSession(): Promise<boolean> {
    if (!currentUser) return false

    try {
      const user = await neonDB.getUsuarioById(currentUser.id)
      if (!user || !user.ativo) {
        currentUser = null
        return false
      }
      return true
    } catch (error) {
      console.error("❌ [AUTH] Session validation error:", error)
      currentUser = null
      return false
    }
  }
}

// Named exports for compatibility
export const getCurrentUser = () => AuthService.getCurrentUser()
export const setCurrentUser = (user: Usuario | null) => {
  currentUser = user
}
export const isAdmin = () => AuthService.isAdmin()
export const logout = () => AuthService.logout()

export default AuthService

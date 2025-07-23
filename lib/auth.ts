import { neonDB, type Usuario } from "./neon"

// In-memory storage for demo purposes
let currentUser: Usuario | null = null
let isAuthenticated = false

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: Usuario
  message?: string
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("🔐 [AUTH] Attempting login for:", credentials.email)

      const user = await neonDB.getUsuarioByEmail(credentials.email)

      if (!user) {
        console.log("❌ [AUTH] User not found")
        return { success: false, message: "Usuário não encontrado" }
      }

      if (!user.ativo) {
        console.log("❌ [AUTH] User inactive")
        return { success: false, message: "Usuário inativo" }
      }

      // Simple password check (in production, use proper hashing)
      if (user.senha !== credentials.password) {
        console.log("❌ [AUTH] Invalid password")
        return { success: false, message: "Senha incorreta" }
      }

      // Set current user
      currentUser = user
      isAuthenticated = true

      console.log("✅ [AUTH] Login successful for:", user.nome)
      return { success: true, user }
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error)
      return { success: false, message: "Erro interno do servidor" }
    }
  }

  static async logout(): Promise<void> {
    console.log("🚪 [AUTH] User logged out")
    currentUser = null
    isAuthenticated = false
  }

  static getCurrentUser(): Usuario | null {
    return currentUser
  }

  static isAuthenticated(): boolean {
    return isAuthenticated && currentUser !== null
  }

  static isAdmin(): boolean {
    return currentUser?.tipo === "admin"
  }

  static async validateSession(): Promise<boolean> {
    // In a real app, validate JWT token or session
    return isAuthenticated && currentUser !== null
  }
}

// Named exports for compatibility
export const getCurrentUser = () => AuthService.getCurrentUser()
export const setCurrentUser = (user: Usuario | null) => {
  currentUser = user
  isAuthenticated = user !== null
}
export const isAdmin = () => AuthService.isAdmin()
export const logout = () => AuthService.logout()

export default AuthService

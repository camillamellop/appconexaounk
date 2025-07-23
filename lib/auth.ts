import { neonDB } from "./neon"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  nome: string
  email: string
  tipo: string
  role?: string
  is_active?: boolean
  last_login?: string
}

export class AuthService {
  private static readonly SESSION_KEY = "unk_user_session"

  static async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    console.log("🔐 [AUTH] Attempting login for:", credentials.email)

    try {
      const user = await neonDB.getUsuarioByEmail(credentials.email)

      if (!user) {
        console.log("❌ [AUTH] User not found")
        return null
      }

      if (!user.ativo) {
        console.log("❌ [AUTH] User account is inactive")
        return null
      }

      // Simple password check (in production, use proper hashing)
      if (user.senha !== credentials.password) {
        console.log("❌ [AUTH] Invalid password")
        return null
      }

      // Update last login
      try {
        await neonDB.updateUsuario(user.id, {
          ...user,
          updated_at: new Date().toISOString(),
        })
      } catch (updateError) {
        console.warn("⚠️ [AUTH] Could not update last login:", updateError)
      }

      const authUser: AuthUser = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        role: user.tipo === "admin" ? "admin" : "user",
        is_active: user.ativo,
        last_login: new Date().toISOString(),
      }

      // Store session
      this.setSession(authUser)

      console.log("✅ [AUTH] Login successful for:", user.nome)
      return authUser
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error)
      return null
    }
  }

  static logout(): void {
    console.log("🚪 [AUTH] Logging out user")

    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    }
  }

  static getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY)

      if (!sessionData) {
        return null
      }

      const user = JSON.parse(sessionData) as AuthUser
      console.log("👤 [AUTH] Current user:", user.nome)
      return user
    } catch (error) {
      console.error("❌ [AUTH] Error getting current user:", error)
      this.logout() // Clear corrupted session
      return null
    }
  }

  static setSession(user: AuthUser): void {
    if (typeof window === "undefined") {
      return
    }

    const sessionData = JSON.stringify(user)
    localStorage.setItem(this.SESSION_KEY, sessionData)
    console.log("💾 [AUTH] Session stored for:", user.nome)
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.tipo === "admin" || user?.role === "admin" || false
  }

  static requireAuth(): AuthUser {
    const user = this.getCurrentUser()
    if (!user) {
      throw new Error("Authentication required")
    }
    return user
  }

  static requireAdmin(): AuthUser {
    const user = this.requireAuth()
    if (!this.isAdmin()) {
      throw new Error("Admin access required")
    }
    return user
  }
}

// Export default instance
export const authService = AuthService

// --- named re-exports expected by the build ---
export const getCurrentUser = AuthService.getCurrentUser
export const setCurrentUser = AuthService.setSession // alias
export const isAdmin = AuthService.isAdmin
export const logout = AuthService.logout

export default AuthService

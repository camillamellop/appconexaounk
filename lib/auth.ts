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

/**
 * Simple in-memory store.
 * In production you should replace this with
 * real authentication (e.g. Supabase, Clerk, NextAuth, etc.).
 */
let currentUser: User | null = null

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user" | string
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
      await this.setSession(authUser)

      console.log("✅ [AUTH] Login successful for:", user.nome)
      return authUser
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error)
      return null
    }
  }

  static async logout(): Promise<void> {
    console.log("🚪 [AUTH] Logging out user")

    await this.setCurrentUser(null)
  }

  static async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") {
      return null
    }

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY)

      if (!sessionData) {
        return null
      }

      const user = JSON.parse(sessionData) as User
      console.log("👤 [AUTH] Current user:", user.name)
      return user
    } catch (error) {
      console.error("❌ [AUTH] Error getting current user:", error)
      await this.logout() // Clear corrupted session
      return null
    }
  }

  static async setSession(user: AuthUser): Promise<void> {
    if (typeof window === "undefined") {
      return
    }

    const sessionData = JSON.stringify(user)
    localStorage.setItem(this.SESSION_KEY, sessionData)
    console.log("💾 [AUTH] Session stored for:", user.nome)
  }

  static async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null
  }

  static async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === "admin" || false
  }

  static async requireAuth(): Promise<AuthUser> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error("Authentication required")
    }
    return user
  }

  static async requireAdmin(): Promise<AuthUser> {
    const user = await this.requireAuth()
    if (!(await this.isAdmin())) {
      throw new Error("Admin access required")
    }
    return user
  }

  /**
   * Persist a user in the in-memory store (or clear it with `null`).
   */
  private static async setCurrentUser(user: User | null): Promise<void> {
    currentUser = user
  }
}

// Export default instance
export const authService = AuthService

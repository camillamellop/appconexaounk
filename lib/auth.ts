import { supabase } from "./supabase"
import type { User } from "./types"

const USER_STORAGE_KEY = "unk_current_user"

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing Supabase connection...")
    const { data, error } = await supabase.from("usuarios").select("count").limit(1)

    if (error) {
      console.error("❌ Supabase connection error:", error.message)
      return false
    }

    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error("❌ Supabase connection error:", error)
    return false
  }
}

export async function listAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("usuarios").select("*").order("nome")

    if (error) {
      console.error("Erro ao listar usuários:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao listar usuários:", error)
    return []
  }
}

export async function login(email: string): Promise<User | null> {
  try {
    console.log("🔐 Attempting login for:", email)

    const { data, error } = await supabase.from("usuarios").select("*").ilike("email", email.trim()).single()

    if (error) {
      console.error("❌ Login error:", error.message)
      return null
    }

    if (!data) {
      console.log("❌ User not found")
      return null
    }

    // Salvar usuário no localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
    console.log("✅ Login successful for:", data.nome)

    return data
  } catch (error) {
    console.error("❌ Login exception:", error)
    return null
  }
}

export function getCurrentUser(): User | null {
  try {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem(USER_STORAGE_KEY)
    if (!userData) return null

    const user = JSON.parse(userData)

    // Validar se o objeto tem as propriedades necessárias
    if (!user.id || !user.email || !user.nome) {
      console.warn("⚠️ Invalid user data in localStorage, clearing...")
      localStorage.removeItem(USER_STORAGE_KEY)
      return null
    }

    return user
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
    console.log("✅ User logged out successfully")

    // Forçar reload da página para limpar qualquer estado
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  } catch (error) {
    console.error("❌ Error during logout:", error)
  }
}

export function isAuthenticated(): boolean {
  const user = getCurrentUser()
  return user !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.tipo === "admin"
}

export function isDJ(): boolean {
  const user = getCurrentUser()
  return user?.tipo === "dj"
}

export function getUserType(): string {
  const user = getCurrentUser()
  return user?.tipo || "guest"
}

import { neonDB } from "./neon"
import type { Usuario } from "./neon"

export interface CreateUserData {
  nome: string
  email: string
  senha: string
  tipo?: "admin" | "dj" | "produtor"
  cargo?: string
  bio?: string
  phone?: string
  location?: string
  specialty?: string
  instagram?: string
  twitter?: string
  avatar?: string
}

export interface UpdateUserData extends Partial<CreateUserData> {
  ativo?: boolean
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  djs: number
  producers: number
  recentLogins: number
}

export class UserService {
  static async getAllUsers(): Promise<Usuario[]> {
    console.log("👥 [USER_SERVICE] Fetching all users...")

    try {
      const users = await neonDB.getUsuarios()
      console.log(`✅ [USER_SERVICE] Found ${users.length} users`)
      return users
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error fetching users:", error)
      throw new Error("Failed to fetch users")
    }
  }

  static async getUserById(id: number): Promise<Usuario | null> {
    console.log(`🔍 [USER_SERVICE] Fetching user by ID: ${id}`)

    try {
      const user = await neonDB.getUsuarioById(id)
      console.log(`${user ? "✅" : "❌"} [USER_SERVICE] User ${user ? "found" : "not found"}`)
      return user
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error fetching user by ID:", error)
      throw new Error("Failed to fetch user")
    }
  }

  static async getUserByEmail(email: string): Promise<Usuario | null> {
    console.log(`🔍 [USER_SERVICE] Fetching user by email: ${email}`)

    try {
      const user = await neonDB.getUsuarioByEmail(email)
      console.log(`${user ? "✅" : "❌"} [USER_SERVICE] User ${user ? "found" : "not found"}`)
      return user
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error fetching user by email:", error)
      throw new Error("Failed to fetch user")
    }
  }

  static async createUser(data: CreateUserData): Promise<Usuario> {
    console.log("👤 [USER_SERVICE] Creating new user:", data.email)

    try {
      // Check if user already exists
      const existingUser = await neonDB.getUsuarioByEmail(data.email)
      if (existingUser) {
        throw new Error("User with this email already exists")
      }

      const userData: Partial<Usuario> = {
        nome: data.nome,
        email: data.email,
        senha: data.senha, // In production, hash this password
        tipo: data.tipo || "dj",
        cargo: data.cargo,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        specialty: data.specialty,
        instagram: data.instagram,
        twitter: data.twitter,
        avatar: data.avatar,
        ativo: true,
      }

      const user = await neonDB.createUsuario(userData)
      console.log("✅ [USER_SERVICE] User created successfully:", user.email)
      return user
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error creating user:", error)
      throw error
    }
  }

  static async updateUser(id: number, data: UpdateUserData): Promise<Usuario> {
    console.log(`👤 [USER_SERVICE] Updating user ${id}`)

    try {
      const existingUser = await neonDB.getUsuarioById(id)
      if (!existingUser) {
        throw new Error("User not found")
      }

      // If email is being changed, check for conflicts
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await neonDB.getUsuarioByEmail(data.email)
        if (emailExists) {
          throw new Error("Email already in use by another user")
        }
      }

      const updatedUser = await neonDB.updateUsuario(id, data)
      console.log("✅ [USER_SERVICE] User updated successfully:", updatedUser.email)
      return updatedUser
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error updating user:", error)
      throw error
    }
  }

  static async deleteUser(id: number): Promise<void> {
    console.log(`🗑️ [USER_SERVICE] Deleting user ${id}`)

    try {
      const user = await neonDB.getUsuarioById(id)
      if (!user) {
        throw new Error("User not found")
      }

      await neonDB.deleteUsuario(id)
      console.log("✅ [USER_SERVICE] User deleted successfully")
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error deleting user:", error)
      throw error
    }
  }

  static async toggleUserStatus(id: number): Promise<Usuario> {
    console.log(`🔄 [USER_SERVICE] Toggling status for user ${id}`)

    try {
      const user = await neonDB.getUsuarioById(id)
      if (!user) {
        throw new Error("User not found")
      }

      const updatedUser = await neonDB.updateUsuario(id, {
        ativo: !user.ativo,
      })

      console.log(`✅ [USER_SERVICE] User status toggled: ${updatedUser.ativo ? "active" : "inactive"}`)
      return updatedUser
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error toggling user status:", error)
      throw error
    }
  }

  static async getUserStats(): Promise<UserStats> {
    console.log("📊 [USER_SERVICE] Calculating user statistics...")

    try {
      const users = await neonDB.getUsuarios()

      const stats: UserStats = {
        total: users.length,
        active: users.filter((u) => u.ativo).length,
        inactive: users.filter((u) => !u.ativo).length,
        admins: users.filter((u) => u.tipo === "admin").length,
        djs: users.filter((u) => u.tipo === "dj").length,
        producers: users.filter((u) => u.tipo === "produtor").length,
        recentLogins: 0, // This would require tracking login timestamps
      }

      console.log("✅ [USER_SERVICE] User statistics calculated:", stats)
      return stats
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error calculating user stats:", error)
      throw new Error("Failed to calculate user statistics")
    }
  }

  static async searchUsers(query: string): Promise<Usuario[]> {
    console.log(`🔍 [USER_SERVICE] Searching users with query: "${query}"`)

    try {
      const users = await neonDB.getUsuarios()
      const filteredUsers = users.filter(
        (user) =>
          user.nome.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          (user.cargo && user.cargo.toLowerCase().includes(query.toLowerCase())) ||
          user.tipo.toLowerCase().includes(query.toLowerCase()),
      )

      console.log(`✅ [USER_SERVICE] Found ${filteredUsers.length} users matching query`)
      return filteredUsers
    } catch (error) {
      console.error("❌ [USER_SERVICE] Error searching users:", error)
      throw new Error("Failed to search users")
    }
  }
}

export const userService = UserService
export default UserService

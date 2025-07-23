import { neonDB } from "@/lib/neon"

export interface LoginCredentials {
  email: string
  senha: string
}

export interface LoginResult {
  success: boolean
  message?: string
  user?: any
}

export interface User {
  id: string
  nome: string
  email: string
  tipo_usuario: string
  ativo: boolean
}

// Chave para localStorage
const USER_STORAGE_KEY = "currentUser"
const LOGIN_TIMESTAMP_KEY = "loginTimestamp"

// Duração da sessão (24 horas em milissegundos)
const SESSION_DURATION = 24 * 60 * 60 * 1000

// Função de login
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    console.log("🔐 Tentando fazer login com:", credentials.email)

    // Buscar usuário no banco
    const usuario = await neonDB.getUsuarioByEmail(credentials.email)

    if (!usuario) {
      console.log("❌ Usuário não encontrado")
      return {
        success: false,
        message: "Email não encontrado",
      }
    }

    if (!usuario.ativo) {
      console.log("❌ Usuário inativo")
      return {
        success: false,
        message: "Usuário inativo",
      }
    }

    // Verificar senha (em produção, use hash)
    if (usuario.senha !== credentials.senha) {
      console.log("❌ Senha incorreta")
      return {
        success: false,
        message: "Senha incorreta",
      }
    }

    // Criar objeto do usuário sem a senha
    const userSession = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      ativo: usuario.ativo,
    }

    // Salvar no localStorage
    setCurrentUser(userSession)

    console.log("✅ Login realizado com sucesso para:", usuario.nome)

    return {
      success: true,
      message: "Login realizado com sucesso",
      user: userSession,
    }
  } catch (error) {
    console.error("💥 Erro no login:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

// Função para salvar usuário atual
export function setCurrentUser(user: User): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString())
    console.log("💾 Usuário salvo no localStorage:", user.nome)
  } catch (error) {
    console.error("Erro ao salvar usuário:", error)
  }
}

// Função para obter usuário atual
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY)
    const timestampStr = localStorage.getItem(LOGIN_TIMESTAMP_KEY)

    if (!userStr || !timestampStr) {
      return null
    }

    // Verificar se a sessão expirou
    const loginTime = Number.parseInt(timestampStr)
    const now = Date.now()

    if (now - loginTime > SESSION_DURATION) {
      console.log("⏰ Sessão expirada")
      clearCurrentUser()
      return null
    }

    return JSON.parse(userStr) as User
  } catch (error) {
    console.error("Erro ao obter usuário:", error)
    return null
  }
}

// Função para limpar usuário atual
export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY)
    console.log("🗑️ Usuário removido do localStorage")
  } catch (error) {
    console.error("Erro ao limpar usuário:", error)
  }
}

// Função para fazer logout
export function logout(): void {
  clearCurrentUser()
  console.log("👋 Logout realizado")
}

// Função para verificar se está autenticado
export function isAuthenticated(): boolean {
  const user = getCurrentUser()
  return user !== null
}

// Função para verificar se é admin
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.tipo_usuario === "admin"
}

// Função para verificar se é DJ
export function isDJ(): boolean {
  const user = getCurrentUser()
  return user?.tipo_usuario === "dj"
}

// Função para verificar se é produtor
export function isProducer(): boolean {
  const user = getCurrentUser()
  return user?.tipo_usuario === "produtor" || user?.tipo_usuario === "produtora"
}

// Função para verificar se é manager
export function isManager(): boolean {
  const user = getCurrentUser()
  return user?.tipo_usuario === "manager"
}

// Função para manter sessão ativa
export function maintainSession(): void {
  const user = getCurrentUser()
  if (user) {
    // Atualizar timestamp da sessão
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString())
  }
}

// Função para restaurar sessão
export function restoreSession(): User | null {
  const user = getCurrentUser()
  if (user) {
    console.log("🔄 Sessão restaurada para:", user.nome)
    maintainSession()
  }
  return user
}

"use client"

import type { User } from "./user-types"

// Sistema de autenticação em memória (temporário)
let currentUser: User | null = null

// Usuários mock para desenvolvimento
const mockUsers: User[] = [
  {
    id: "1",
    nome: "Admin",
    email: "admin@unk.com",
    senha: "admin123",
    tipo: "admin",
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Jack",
    email: "jack@unk.com",
    senha: "jack123",
    tipo: "dj",
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function login(email: string, senha: string): Promise<User | null> {
  const user = mockUsers.find((u) => u.email === email && u.senha === senha && u.ativo)
  if (user) {
    currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    return user
  }
  return null
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      currentUser = JSON.parse(stored)
      return currentUser
    }
  }

  return null
}

export function setCurrentUser(user: User | null): void {
  currentUser = user
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.tipo === "admin"
}

export function logout(): void {
  currentUser = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function requireAuth(): User {
  const user = getCurrentUser()
  if (!user) {
    throw new Error("Usuário não autenticado")
  }
  return user
}

export function requireAdmin(): User {
  const user = requireAuth()
  if (user.tipo !== "admin") {
    throw new Error("Acesso negado: apenas administradores")
  }
  return user
}

/**
 * Wrapper conveniente para que o build encontre um export nomeado “AuthService”.
 * Ele simplesmente aponta para as funções já existentes.
 */
export const AuthService = {
  login,
  getCurrentUser,
  setCurrentUser,
  isAdmin,
  logout,
  isAuthenticated,
  requireAuth,
  requireAdmin,
}

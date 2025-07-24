import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "conexaounk-secret-key"
const COOKIE_NAME = "auth_token"

// Rotas que não precisam de autenticação
const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout", "/api/auth/me"]

// Rotas que precisam de autenticação de admin
const adminRoutes = ["/admin-dashboard"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar token
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return redirectToLogin(request)
  }

  try {
    // Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; type: string }

    // Verificar permissões para rotas de admin
    if (adminRoutes.some((route) => pathname.startsWith(route)) && decoded.type !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.search = `?from=${encodeURIComponent(request.nextUrl.pathname)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Rotas que precisam de autenticação
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)",
  ],
}

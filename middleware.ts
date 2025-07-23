import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // In a real app, you'd validate the JWT token here
    // For now, we'll let the client-side handle auth
    return NextResponse.next()
  }

  // API routes protection
  if (pathname.startsWith("/api/admin")) {
    // Protect admin API routes
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return new NextResponse(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    }

    // In production, validate JWT token here
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

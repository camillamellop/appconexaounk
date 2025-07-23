"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user && pathname !== "/login") {
      router.push("/login")
      setIsAuthenticated(false)
    } else if (user && pathname === "/login") {
      router.push("/")
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(!!user)
    }
  }, [router, pathname])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

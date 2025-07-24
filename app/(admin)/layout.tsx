"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          if (user.tipo !== "admin") {
            router.push("/dashboard")
            return
          }
        } catch (error) {
          router.push("/login")
          return
        }
      } else {
        router.push("/login")
        return
      }
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Verificando permissões...</div>
      </div>
    )
  }

  return <>{children}</>
}

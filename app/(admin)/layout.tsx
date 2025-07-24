import type React from "react"
import { AuthWrapper } from "@/components/auth/AuthWrapper"
import BottomNavigation from "@/components/layout/BottomNavigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper requireAdmin>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="pb-20">{children}</div>
        <BottomNavigation />
      </div>
    </AuthWrapper>
  )
}

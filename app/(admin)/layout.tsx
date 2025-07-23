import type React from "react"
import { BottomNavigation } from "@/components/layout/BottomNavigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <main className="pb-20">{children}</main>
      <BottomNavigation />
    </div>
  )
}

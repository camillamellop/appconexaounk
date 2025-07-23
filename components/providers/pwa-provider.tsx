"use client"

import type React from "react"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa"

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      registerServiceWorker()
    }
  }, [])

  return <>{children}</>
}

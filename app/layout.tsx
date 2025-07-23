import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { InstallPrompt } from "@/components/ui/install-prompt"
import { PWAProvider } from "@/components/providers/pwa-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UNK Dashboard - Gestão para DJs e Produtores",
  description: "Plataforma completa de gestão para DJs e produtores musicais",
  keywords: ["DJ", "música", "gestão", "agenda", "financeiro", "projetos"],
  authors: [{ name: "UNK Music" }],
  creator: "UNK Music",
  publisher: "UNK Music",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://unk-dashboard.vercel.app"),
  openGraph: {
    title: "UNK Dashboard - Gestão para DJs e Produtores",
    description: "Plataforma completa de gestão para DJs e produtores musicais",
    url: "https://unk-dashboard.vercel.app",
    siteName: "UNK Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UNK Dashboard",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNK Dashboard - Gestão para DJs e Produtores",
    description: "Plataforma completa de gestão para DJs e produtores musicais",
    images: ["/og-image.png"],
    creator: "@unkmusic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UNK Dashboard" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PWAProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
              <InstallPrompt />
              <Toaster />
            </PWAProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

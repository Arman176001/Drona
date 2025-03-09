import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drona Learning Platform",
  description: "AI-powered interactive learning platform with personalized study materials and quizzes",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-black`}>
            <div className="flex flex-col min-h-screen w-full">
              <Header />
              <div className="flex-1 w-full">
                <ThemeProvider>{children}</ThemeProvider>
              </div>
            </div>
        </body>
      </html>
  )
}


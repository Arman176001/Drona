import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import AuthUI from "@/components/auth-ui"
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
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-black text-white`}>
          <SignedIn>
            <div className="flex flex-col min-h-screen w-full">
              <Header />
              <div className="flex-1 w-full">
                <ThemeProvider>{children}</ThemeProvider>
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-6 relative overflow-hidden">
              {/* Animated grid lines */}
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] opacity-20"></div>

              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.random() * 10 + 2}px`,
                        height: `${Math.random() * 10 + 2}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        boxShadow: "0 0 20px 2px rgba(99, 102, 241, 0.7)",
                        animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Glowing accents */}
              <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-3xl" />

              {/* Hero Section */}
              <div className="text-center mb-12 z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-8 w-8 text-white"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.5 9.5L3 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.5 9.5L21 3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.5 16.5L3 23"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.5 16.5L21 23"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-4">
                    Drona
                  </h1>
                </div>
                <p className="text-xl text-gray-300 mt-2 max-w-md mx-auto">
                  The AI-powered learning platform that adapts to your unique learning style
                </p>
              </div>

              {/* Authentication UI */}
              <div className="w-full max-w-md z-10">
                <AuthUI />
              </div>

              {/* Footer */}
              <div className="mt-12 text-center text-gray-400 text-sm z-10">
                <p>© {new Date().getFullYear()} Drona Learning. All rights reserved.</p>
              </div>
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  )
}


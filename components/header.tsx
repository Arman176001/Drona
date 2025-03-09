"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Menu, X, Home, BookOpen, LayoutDashboard } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75"></div>
            <div className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <Brain className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Drona
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/library"
            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
          >
            <BookOpen className="h-4 w-4" />
            <span>Library</span>
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/library"
              className="text-gray-300 hover:text-white transition-colors py-2 flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>Library</span>
            </Link>
            <div className="pt-2 border-t border-white/10">
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}


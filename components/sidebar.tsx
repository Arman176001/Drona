"use client"

import { useState } from "react"
import { Book, BookOpen } from "lucide-react"

type SidebarProps = {
  activeView: "study" | "cheatsheet" | "quiz" | "review"
  setActiveView: (view: "study" | "cheatsheet" | "quiz" | "review") => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`bg-gray-900 text-white flex flex-col items-center transition-all duration-300 ${
        isExpanded ? "w-48" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-6 flex flex-col items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
          <BookOpen className="w-6 h-6 text-white" />
        </div>

        <nav className="flex flex-col space-y-4 w-full">
          <button
            className={`flex items-center px-4 py-3 transition-colors ${
              activeView === "cheatsheet"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            onClick={() => setActiveView("cheatsheet")}
          >
            <Book className="w-6 h-6" />
            {isExpanded && <span className="ml-3 whitespace-nowrap">Cheat Sheet</span>}
          </button>

          <button
            className={`flex items-center px-4 py-3 transition-colors ${
              activeView === "study" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            onClick={() => setActiveView("study")}
          >
            <BookOpen className="w-6 h-6" />
            {isExpanded && <span className="ml-3 whitespace-nowrap">Study</span>}
          </button>
        </nav>
      </div>
    </div>
  )
}


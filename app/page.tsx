"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Button from "@/components/ui/button"
import Modal from "@/components/ui/modal"
import MediaInput from "@/components/media-input"
import { Brain, Zap, BookOpen, Rocket, Atom } from "lucide-react"
import {UserProfile, useUser} from "@clerk/nextjs"


export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  // Replace this with your actual auth context hook to obtain the logged in user's clerkId
  const user=useUser()
  const userClerkId = user?.user?.id;

  // Update user document on page load if not saved already.
  useEffect(() => {
    async function updateUserIfNeeded() {
      try {
        // Call API to update/upsert user using clerkId.
        await axios.post("/api/userStore", { clerkId: userClerkId })
      } catch (error) {
        console.error("Error updating user", error)
      }
    }
    updateUserIfNeeded()
  }, [userClerkId])

  const handleMediaSubmit = (data: any) => {
    const formattedData = {
      topics: data.topics,
      cheet_sheet: data.cheet_sheet,
    }
    const encodedData = encodeURIComponent(JSON.stringify(formattedData))
    router.push(`/study?view=cheatsheet&data=${encodedData}`)
  }

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4 md:p-8 overflow-hidden relative">
      {/* Animated background elements */}
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

      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] opacity-20"></div>

      {/* Glowing accent */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-7xl mx-auto text-center space-y-10 z-10 backdrop-blur-sm bg-black/10 p-6 md:p-10 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(99,102,241,0.2)]">
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-black rounded-full p-2">
                <Atom className="text-indigo-400 h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-4">
              Drona Learning
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Enhance your learning experience with our AI-powered interactive study materials, cheat sheets, and
            personalized quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Brain className="h-8 w-8 text-indigo-400 mb-3 relative z-10" />
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">AI-Powered Learning</h3>
            <p className="text-gray-400 relative z-10">Personalized content tailored to your learning style and pace</p>
          </div>
          <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Zap className="h-8 w-8 text-indigo-400 mb-3 relative z-10" />
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Interactive Sessions</h3>
            <p className="text-gray-400 relative z-10">Engage with dynamic content that adapts to your progress</p>
          </div>
          <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <BookOpen className="h-8 w-8 text-indigo-400 mb-3 relative z-10" />
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Comprehensive Materials</h3>
            <p className="text-gray-400 relative z-10">Access a wide range of study resources in various formats</p>
          </div>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 border-0 group relative overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-20 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700"></span>
          <Rocket className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
          <span className="relative z-10">Start Learning Session</span>
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Choose Your Learning Material">
        <MediaInput onSubmit={handleMediaSubmit} />
      </Modal>
    </main>
  )
}


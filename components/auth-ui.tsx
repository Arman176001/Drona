"use client"

import { useState } from "react"
import { SignIn, SignUp } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthUI() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-50"></div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-3xl"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-3xl"></div>

      <div className="relative z-10">
        {/* Toggle buttons */}
        <div className="flex mb-6 bg-black/20 p-1 rounded-lg">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              isSignIn
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              !isSignIn
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth components with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h2>
            {isSignIn ? <SignIn routing="hash" /> : <SignUp routing="hash" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}


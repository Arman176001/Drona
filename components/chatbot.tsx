"use client"

import { useState, useEffect, useRef } from "react"
import Button  from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2, MinusCircle, PlusCircle, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Add a prop to receive the state update function
interface ChatBotProps {
  topic: string
  onVisibilityChange?: (isMinimized: boolean) => void
}

export default function ChatBot({ topic, onVisibilityChange }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm your learning assistant. Ask me anything about ${topic}.`,
        timestamp: new Date(),
      },
    ])
  }, [topic])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API call to backend
      const response = await fetch(`http://127.0.0.1:8000/chat?query=${encodeURIComponent(input)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Network error:", error);
        // Fallback for preview mode
        return new Response(JSON.stringify({
          response: `This is a simulated response about ${topic} related to your question: "${input}". In a real implementation, this would connect to your backend API.`
        }))
      })

      const data = await response.json()
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.response,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date()
        },
      ])
    } finally {
      setIsLoading(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Update the setIsMinimized to trigger the callback
  const handleMinimizedChange = (value: boolean) => {
    setIsMinimized(value);
    onVisibilityChange?.(value);
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMaximized ? 'left-6 top-6' : ''}`}>
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`${
              isMaximized 
                ? 'w-full h-[calc(100vh-48px)]' 
                : 'w-[350px] h-[500px]'
            } shadow-xl rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
          >
            <CardHeader className="py-3 px-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">
                  {topic} Assistant
                </CardTitle>
                <div className="flex gap-2">
                  {isMaximized ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMaximized(false)}
                      className="h-8 w-8 p-0 text-white hover:bg-blue-600"
                    >
                      <PlusCircle size={26} />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMaximized(true)}
                      className="h-8 w-8 p-0 text-white hover:bg-blue-600"
                    >
                      <PlusCircle size={26} />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMinimizedChange(true)}
                    className="h-8 w-8 p-0 text-white hover:bg-blue-600"
                  >
                    <MinusCircle size={26} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow p-0 overflow-hidden">
              <ScrollArea className={`${
                isMaximized ? 'h-[calc(100vh-180px)]' : 'h-[380px]'
              } p-4`} ref={scrollAreaRef}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${
                      message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                    }`}>
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://about.fb.com/wp-content/uploads/2024/04/Meta-AI-Expasion_Header.gif" />
                          <AvatarFallback className="bg-blue-500 dark:text-white">AI</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div className={`rounded-lg p-3 ${
                          message.role === "assistant" 
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" 
                            : "bg-blue-500 text-white"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://th.bing.com/th/id/OIP.9S_lwnQSyuuceKYGctRN6QHaHa?w=161&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" />
                          <AvatarFallback className="bg-gray-500 text-white">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Assistant is thinking...</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-3 border-t dark:border-gray-700">
              <form 
                className="flex w-full gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this topic..."
                  className="flex-grow dark:text-white text-gray-700"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-500 hover:bg-blue-600 p-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMinimizedChange(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

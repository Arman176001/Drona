"use client"

import { useState, useEffect, useRef } from "react"
import Button from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink, Download } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"
import dynamic from "next/dynamic"
import ChatBot from "@/components/chatbot"
import { markdownComponents } from "@/components/ui/markdown-components"

// Define the structure of the study content from the API
interface TopicContent {
  summary: string
  youtube: string
}

interface StudyContentProps {
  topic: {
    id: string
    title: string
    completed: boolean
  } | null
  section: "educate" | "quiz"
  onMarkCompleted: () => void
  studyContent: Record<string, TopicContent>
  isLoading: boolean
}

export default function StudyContent({ topic, section, onMarkCompleted, studyContent, isLoading }: StudyContentProps) {
  const [activeTab, setActiveTab] = useState<"resources" | "study-guide">("resources")
  const [isCompleted, setIsCompleted] = useState(topic?.completed || false)
  // Add state for chatbot visibility
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    const html2pdfModule = await import("html2pdf.js")
    const html2pdf = (html2pdfModule as any).default

    html2pdf()
      .set({
        margin: 10,
        filename: `${topic?.title}-study-guide.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(contentRef.current)
      .save()
  }

  // Update completed state when topic changes
  useEffect(() => {
    if (topic) {
      setIsCompleted(topic.completed)
    }
  }, [topic])

  // Return early if no topic is selected
  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Please select a topic to begin</p>
      </div>
    )
  }

  const handleMarkCompleted = () => {
    setIsCompleted(!isCompleted)
    onMarkCompleted()
  }

  // Find the current topic content in the studyContent object
  // The keys in studyContent might not match the topic.id exactly, so we need to find the best match
  const findTopicContent = () => {
    if (!studyContent || Object.keys(studyContent).length === 0) return null

    // Try to find an exact match first
    if (studyContent[topic.title]) {
      return studyContent[topic.title]
    }

    // If no exact match, find the closest match by checking if the topic title is included in any key
    const key = Object.keys(studyContent).find(
      (k) => k.toLowerCase().includes(topic.title.toLowerCase()) || topic.title.toLowerCase().includes(k.toLowerCase()),
    )

    return key ? studyContent[key] : null
  }

  const currentTopicContent = findTopicContent()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{topic.title}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 border-b dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "resources"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "study-guide"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          onClick={() => setActiveTab("study-guide")}
        >
          Study-Guide
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md w-3/4"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "resources" && (
            <>
              {currentTopicContent ? (
                <>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentTopicContent.youtube}`}
                      className="w-full h-full"
                      title={topic.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>


                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No content available for this topic yet.</p>
                  <Button variant="outline" size="sm">
                    Refresh Content
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === "study-guide" && (
            <div className="relative">
              <button
                onClick={handleDownloadPDF}
                className="fixed bottom-6 right-30 flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all hover:shadow-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 z-10"
              >
                <Download size={18} />
                Download PDF
              </button>

              <div className={`${
                !isChatMinimized 
                  ? 'grid grid-cols-1 lg:grid-cols-4 gap-6 lg:mr-[400px]' 
                  : 'max-w-full'
              }`}>
                <div className={`${!isChatMinimized ? 'lg:col-span-3' : ''}`}>
                  <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    {currentTopicContent ? (
                      <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Reference Guide</h2>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeHighlight]}
                          components={markdownComponents}
                        >
                          {currentTopicContent.summary}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No cheat sheet available for this topic.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleMarkCompleted} className="px-6">
              {isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
            </Button>
          </div>
        </div>
      )}
      <ChatBot 
        topic={topic.title} 
        onVisibilityChange={setIsChatMinimized}
      />
    </div>
  )
}


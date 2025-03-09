"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import TopicsSidebar from "@/components/topics-sidebar"
import StudyContent from "@/components/study-content"
import CheatSheetContent from "@/components/cheatsheet-content"
import Quiz from "@/components/quiz"
import Review from "@/components/review"
import SearchBar from "@/components/ui/search-bar"
import ProgressBar from "@/components/ui/progress-bar"
import ThemeToggle from "@/components/ui/theme-toggle"
import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import axios from 'axios';
import {  Atom } from "lucide-react"

export default function StudyPage() {
  const searchParams = useSearchParams()
  const initialView = searchParams.get("view") === "cheatsheet" ? "cheatsheet" : "study"
  const encodedData = searchParams.get("data")

  const [decodedData, setDecodedData] = useState<any>(null)
  const [topics, setTopics] = useState<Array<{ id: string; title: string; completed: boolean }>>([])
  const [markdownText, setMarkdownText] = useState("")
  const [studyContent, setStudyContent] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeView, setActiveView] = useState<"study" | "cheatsheet" | "quiz" | "review">(initialView)
  const [activeTopic, setActiveTopic] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<"educate" | "quiz">("educate")
  const [progress, setProgress] = useState(0)
  const [showQuizRules, setShowQuizRules] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (encodedData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(encodedData))
        setDecodedData(parsed)

        if (parsed.topics) {
          if (Array.isArray(parsed.topics)) {
            const formattedTopics = parsed.topics.map((title: string, index: number) => ({
              id: String(index + 1),
              title: title,
              completed: false,
            }))
            setTopics(formattedTopics)
            if (formattedTopics.length > 0) {
              setActiveTopic(formattedTopics[0])
            }
          } else if (typeof parsed.topics === "object") {
            const formattedTopics = Object.keys(parsed.topics).map((key, index) => ({
              id: String(index + 1),
              title: key,
              completed: false,
            }))
            setTopics(formattedTopics)
            if (formattedTopics.length > 0) {
              setActiveTopic(formattedTopics[0])
            }
          }
        }

        if (parsed.cheet_sheet && typeof parsed.cheet_sheet === "string") {
          setMarkdownText(parsed.cheet_sheet)
        }

        // Fetch study content immediately
        fetchStudyContent()
      } catch (error) {
        console.error("Error parsing data:", error)
        setTopics([])
        setMarkdownText("")
      }
    } else {
      // If no encodedData, fetch study content directly
      fetchStudyContent()
    }
  }, [encodedData])

  const calculateProgress = () => {
    const totalTopics = topics.length
    const completedTopics = topics.filter((topic) => topic.completed).length
    return Math.round((completedTopics / totalTopics) * 100)
  }

  const markAsCompleted = () => {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === activeTopic.id) {
        return { ...topic, completed: !topic.completed }
      }
      return topic
    })

    setTopics(updatedTopics)
    setActiveTopic({ ...activeTopic, completed: !activeTopic.completed })
    setProgress(calculateProgress())
  }

  const handleQuizClick = async () => {
    setShowQuizRules(true)
  }

  const startQuiz = async () => {
    setShowQuizRules(false)
    setIsLoading(true)
    try {
      const response = await fetch(`https://drona-7zhi.onrender.com/quiz?topic=${activeTopic.title}`)
      const data = await response.json()
      setQuizQuestions(data.quiz.Questions)
      setActiveView("quiz")
    } catch (error) {
      console.error("Error fetching quiz questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudyContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://drona-7zhi.onrender.com/study")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Study content fetched:", data)
      if (data.study) {
        setStudyContent(data.study)
      }
    } catch (error) {
      console.error("Error fetching study content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <TopicsSidebar
        topics={topics}
        activeTopic={activeTopic}
        activeSection={activeSection}
        setActiveTopic={setActiveTopic}
        setActiveSection={setActiveSection}
        onQuizClick={handleQuizClick}
        view={activeView}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
      <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-4">

            <div className="relative bg-black rounded-full p-2">
              <Atom className="text-indigo-400 h-10 w-10" />
            </div>
          </div>

          <div className="flex items-center space-x-4 ">
            <div className="flex justify-between items-center w-72">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress: {progress}%</span>
            </div>
            <ProgressBar progress={progress} />
            <ThemeToggle />
          </div>
        </header>

        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress: {progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        <main className="flex-1 overflow-auto p-6">
          {activeView === "study" && (
            <StudyContent
              topic={activeTopic}
              section={activeSection}
              onMarkCompleted={markAsCompleted}
              studyContent={studyContent}
              isLoading={isLoading}
            />
          )}
          {activeView === "cheatsheet" && <CheatSheetContent markdown={markdownText} />}
          {activeView === "quiz" && <Quiz topic={activeTopic.title} questions={quizQuestions} />}
          {activeView === "review" && <Review />}
        </main>
      </div>

      <Modal isOpen={showQuizRules} onClose={() => setShowQuizRules(false)} title="Quiz Rules">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Before you begin:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
              <li>The quiz contains multiple-choice questions</li>
              <li>Each question has only one correct answer</li>
              <li>You cannot go back to previous questions once answered</li>
              <li>Your score will be displayed at the end of the quiz</li>
              <li>A score of 70% or higher is required to pass</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowQuizRules(false)}>
              Go Back
            </Button>
            <Button onClick={startQuiz}>Continue to Quiz</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}




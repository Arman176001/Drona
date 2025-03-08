"use client"
import { BookOpen, HelpCircle, CheckCircle } from "lucide-react"

type Topic = {
  id: string
  title: string
  completed: boolean
}

type TopicsSidebarProps = {
  topics: Topic[]
  activeTopic: Topic
  activeSection: "educate" | "quiz"
  setActiveTopic: (topic: Topic) => void
  setActiveSection: (section: "educate" | "quiz") => void
  onQuizClick: () => void
  view: String
}

export default function TopicsSidebar({
  topics,
  activeTopic,
  activeSection,
  setActiveTopic,
  setActiveSection,
  onQuizClick,
  view

}: TopicsSidebarProps) {
  const handleTopicClick = (topic: Topic) => {
    setActiveTopic(topic)
    setActiveSection("educate")
  }

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Topics</h2>
      </div>

      <div className="py-2">
        {topics.map((topic) => (
          <div key={topic.id} className="mb-4">
            <button
              className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium ${
                topic.id === activeTopic.id
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleTopicClick(topic)}
            >
              <span>{topic.title}</span>
              {topic.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
            </button>

            {topic.id === activeTopic.id && view==="study" && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                    activeSection === "educate"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setActiveSection("educate")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Educate</span>
                </button>

                <button
                  className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                    activeSection === "quiz"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={onQuizClick}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Quiz</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


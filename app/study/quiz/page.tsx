"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"

// Temporary quiz data
const quizData = {
  title: "Bluetooth Overview Quiz",
  questions: [
    {
      id: 1,
      question: "What does Bluetooth technology primarily enable?",
      options: [
        "Wireless internet connection",
        "Wireless communication between devices over short distances",
        "Satellite communication",
        "Long-range radio transmission",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which company developed Bluetooth technology?",
      options: ["Apple", "Microsoft", "Ericsson", "Samsung"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "What is the typical range of Bluetooth 5.0?",
      options: ["Up to 10 meters", "Up to 100 meters", "Up to 240 meters", "Up to 400 meters"],
      correctAnswer: 2,
    },
  ],
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let score = 0
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / quizData.questions.length) * 100)

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Quiz Results</h1>

          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2 text-blue-600 dark:text-blue-400">{percentage}%</div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              You got {score} out of {quizData.questions.length} questions correct
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/study")} variant="outline">
              Return to Study
            </Button>
            <Button
              onClick={() => {
                setShowResults(false)
                setCurrentQuestion(0)
                setSelectedAnswers([])
              }}
            >
              Retry Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{quizData.title}</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                      selectedAnswers[currentQuestion] === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
            Previous
          </Button>

          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
            {currentQuestion === quizData.questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}


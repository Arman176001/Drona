"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react'

interface QuizQuestion {
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correct: string
  explanation: string
}

interface QuizProps {
  topic: string
  questions: QuizQuestion[]
}

interface QuizResult {
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correctAnswer: string
  userAnswer: string
  explanation: string
}

export default function Quiz({ topic, questions }: QuizProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(questions.length).fill(""))
  const [timer, setTimer] = useState(600) // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results = questions.map((q, index) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      userAnswer: userAnswers[index],
      explanation: q.explanation
    }))

    setQuizResults(results)
    setShowReview(true)
    setIsSubmitting(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` 
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {!showReview ? (
        <>
          {/* Quiz header section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600">
                {topic} Quiz
              </h1>
              <div className="flex items-center bg-primary/5 dark:bg-primary/20 px-4 py-2 rounded-full border border-primary/10 dark:border-primary/30 shadow-sm">
                <Clock className="mr-2 text-primary dark:text-primary-400" />
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {formatTime(timer)}
                </span>
              </div>
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
            {/* Question number and title */}
            <div className="flex items-center mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-gray-100 font-semibold mr-3">
                {currentQuestion + 1}
              </span>
              <h2 className="text-xl font-semiboldtext-gray-900 dark:text-gray-100">
                Question{" "}
                <span className="text-primary text-gray-900 dark:text-gray-100">
                  {currentQuestion + 1}
                </span>{" "}
                of {questions.length}
              </h2>
            </div>

            {/* Question text */}
            <p className="text-lg mb-8 font-medium text-gray-800 dark:text-gray-200">
              {questions[currentQuestion].question}
            </p>

            {/* Answer options */}
            <RadioGroup 
              value={userAnswers[currentQuestion]} 
              onValueChange={handleAnswerChange} 
              className="space-y-4"
            >
              {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    userAnswers[currentQuestion] === key
                      ? 'border-primary bg-primary/5 dark:bg-primary/20 text-gray-900 dark:text-gray-100'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <RadioGroupItem 
                    value={key} 
                    id={`option-${key}`} 
                    className="text-primary dark:text-primary-400" 
                  />
                  <Label 
                    htmlFor={`option-${key}`} 
                    className="ml-3 cursor-pointer w-full font-medium text-gray-800 dark:text-gray-200"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mr-3 font-semibold">
                      {key.toUpperCase()}
                    </span>
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {/* Question indicators */}
            <div className="hidden md:flex space-x-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestion ? "default" : userAnswers[index] ? "outline" : "ghost"}
                  size="sm"
                  className={`w-9 h-9 rounded-full p-0 ${
                    index === currentQuestion
                      ? 'bg-primary dark:bg-primary-400 text-white shadow-md'
                      : userAnswers[index]
                        ? 'border-primary/50 dark:border-primary-400/50 text-primary dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {/* Next/Submit button */}
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md bg-primary dark:bg-primary-400 text-white"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary to-primary/80 dark:from-primary-400 dark:to-primary-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800 hover:shadow-xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Quiz Results</h2>
            <p className="text-gray-600 dark:text-gray-400">You've completed the quiz! Review your answers below.</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">Your Score</div>
              <div className="text-2xl font-bold text-primary">
                {quizResults.filter(r => r.userAnswer === r.correctAnswer).length} / {quizResults.length}
                <span className="ml-2 text-lg">
                  ({Math.round((quizResults.filter(r => r.userAnswer === r.correctAnswer).length / quizResults.length) * 100)}%)
                </span>
              </div>
            </div>

            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(quizResults.filter(r => r.userAnswer === r.correctAnswer).length / quizResults.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {quizResults.map((result, index) => (
            <div key={index} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-400 font-semibold mr-3">
                  {index + 1}
                </span>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {result.question}
                </p>
              </div>

              <div className="grid gap-3 mb-4">
                {Object.entries(result.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg flex items-center ${
                      key === result.correctAnswer
                        ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
                        : key === result.userAnswer && key !== result.correctAnswer
                          ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
                          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 font-semibold ${
                      key === result.correctAnswer
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                        : key === result.userAnswer && key !== result.correctAnswer
                          ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {key.toUpperCase()}
                    </span>
                    <span className="font-medium">{value}</span>
                    {key === result.correctAnswer && (
                      <CheckCircle className="ml-auto text-green-500 h-5 w-5" />
                    )}
                    {key === result.userAnswer && key !== result.correctAnswer && (
                      <XCircle className="ml-auto text-red-500 h-5 w-5" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-primary/5 dark:bg-primary/20 p-4 rounded-lg border border-primary/20 dark:border-primary/30">
                <p className="text-sm font-medium text-primary dark:text-primary-400 mb-2">
                  Explanation:
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {result.explanation}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              onClick={() => setShowReview(false)}
              variant="outline"
              className="w-full sm:w-auto px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back to Quiz
            </Button>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                className="flex-1 sm:flex-none px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary to-primary/80 text-white dark:text-gray-100"
                onClick={() => {
                  // This would be implemented to share results
                  alert('Share functionality would be implemented here')
                }}
              >
                Share Results
              </Button>

              <Button
                variant="outline"
                className="flex-1 sm:flex-none px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md"
                onClick={() => router.push("/study")}
              >
                Back to Study
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

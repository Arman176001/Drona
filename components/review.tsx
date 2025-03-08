"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Button from "@/components/ui/button"
import { CheckCircle, XCircle, Share2, Download, Award, ArrowLeft, BarChart } from 'lucide-react'

interface QuizReviewItem {
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
  correctAnswer: string
  userAnswer: string
  explanation: string  // Add this line
}

export default function Review() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [quizData, setQuizData] = useState<QuizReviewItem[]>([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    const data = searchParams.get('data')
    if (typeof data === "string") {
      const parsedData: QuizReviewItem[] = JSON.parse(data)
      setQuizData(parsedData)
      const correctAnswers = parsedData.filter((item) => item.userAnswer === item.correctAnswer).length
      setScore((correctAnswers / parsedData.length) * 100)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4 rounded-full p-2" 
          onClick={() => router.push("/study")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Quiz Review</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800 hover-lift">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Your Score: {score.toFixed(0)}%</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              You answered {quizData.filter((item) => item.userAnswer === item.correctAnswer).length} out of{" "}
              {quizData.length} questions correctly.
            </p>
            
            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full flex items-center gap-2"
                onClick={() => {
                  // This would be implemented to share results
                  alert('Share functionality would be implemented here')
                }}
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full flex items-center gap-2"
                onClick={() => {
                  // This would be implemented to download results
                  alert('Download functionality would be implemented here')
                }}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
          
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e6e6e6" 
                    strokeWidth="10" 
                    className="dark:stroke-gray-600"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    strokeDasharray="282.7" 
                    strokeDashoffset={282.7 - (282.7 * score / 100)} 
                    strokeLinecap="round" 
                    className="text-primary transition-all duration-1000 ease-out animate-progress-circle"
                    style={{ '--progress-circle-offset': `${282.7 - (282.7 * score / 100)}` } as React.CSSProperties}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{score.toFixed(0)}%</span>
              </div>
            </div>
            {score >= 70 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                <Award className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" /> Performance Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-green-600 dark:text-green-400 text-2xl font-bold">
                {quizData.filter((item) => item.userAnswer === item.correctAnswer).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 text-2xl font-bold">
                {quizData.filter((item) => item.userAnswer !== item.correctAnswer).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                {quizData.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
              <div className="text-purple-600 dark:text-purple-400 text-2xl font-bold">
                {score >= 70 ? 'Pass' : 'Retry'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>
      </div>

      {quizData.map((item, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800 hover-lift transition-all duration-200">
          <div className="flex items-center mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold mr-3">
              {index + 1}
            </span>
            <h3 className="text-xl font-semibold">{item.userAnswer === item.correctAnswer ? (
              <span className="flex items-center gap-2">
                <span>Question {index + 1}</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  Correct
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Question {index + 1}</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  Incorrect
                </span>
              </span>
            )}</h3>
          </div>
          
          <p className="text-lg mb-6 font-medium">{item.question}</p>

          <div className="grid gap-3 mb-6">
            {Object.entries(item.options).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-lg flex items-center ${
                  key === item.correctAnswer
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                    : key === item.userAnswer && key !== item.correctAnswer
                      ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 font-semibold ${
                  key === item.correctAnswer
                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                    : key === item.userAnswer && key !== item.correctAnswer
                      ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {key.toUpperCase()}
                </span>
                <span className="font-medium">{value}</span>
                {key === item.correctAnswer && (
                  <CheckCircle className="ml-auto text-green-500 h-5 w-5" />
                )}
                {key === item.userAnswer && key !== item.correctAnswer && (
                  <XCircle className="ml-auto text-red-500 h-5 w-5" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-primary/5 dark:bg-primary/20 p-4 rounded-lg border border-primary/20 dark:border-primary/30">
            <p className="text-sm font-medium text-primary dark:text-primary-400 mb-2">
              Explanation:
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              {item.explanation}
            </p>
          </div>
          
          {item.userAnswer !== item.correctAnswer && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Study Tip: Review the explanation carefully and try to understand why your answer was incorrect.
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <Button 
          onClick={() => router.push("/study")}
          variant="outline"
          className="w-full sm:w-auto px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study
        </Button>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-none px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md bg-gradient-to-r from-primary to-primary/80"
            onClick={() => {
              // This would be implemented to retry the quiz
              router.push("/study?view=quiz")
            }}
          >
            Retry Quiz
          </Button>
          
          {score >= 70 && (
            <Button 
              variant="outline"
              className="flex-1 sm:flex-none px-5 py-2 rounded-full transition-all duration-200 hover:shadow-md"
              onClick={() => {
                // This would be implemented to get a certificate
                alert('Certificate functionality would be implemented here')
              }}
            >
              <Award className="mr-2 h-4 w-4" /> Get Certificate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

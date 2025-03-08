"use client"

import { useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"
import { Download } from "lucide-react"
import dynamic from "next/dynamic"
import type { ReactNode } from "react"
import { useTheme } from "./theme-provider"

// Dynamic import for html2pdf
const Html2Pdf = dynamic(() => import("html2pdf.js").then((mod) => mod.default), {
  ssr: false,
})

// Component props types
type MarkdownComponentProps = {
  children?: ReactNode
  node?: any
  className?: string
  [key: string]: any
}

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { theme = 'dark' } = useTheme() // Set dark as default

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    try {
      const html2pdf = await import("html2pdf.js").then((mod) => mod.default)

      html2pdf()
        .set({
          margin: 10,
          filename: "cheatsheet.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(contentRef.current)
        .save()
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    }
  }

  return (
    <div className={`relative p-6 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <button
        onClick={handleDownloadPDF}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 z-10"
      >
        <Download size={18} />
        Download PDF
      </button>

      <div
        ref={contentRef}
        className={`prose prose-lg max-w-4xl mx-auto p-8 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-900 text-gray-100 border-gray-700 prose-invert' 
            : 'bg-white text-gray-900 border-gray-200'
        } print:shadow-none`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            h1: ({ children }: MarkdownComponentProps) => (
              <h1 className={`text-4xl font-bold mb-6 pb-2 border-b ${
                theme === 'dark' ? 'text-gray-50 border-gray-700' : 'text-gray-900 border-gray-200'
              }`}>{children}</h1>
            ),
            h2: ({ children }: MarkdownComponentProps) => (
              <h2 className={`text-3xl font-semibold mt-8 mb-4 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
              }`}>{children}</h2>
            ),
            h3: ({ children }: MarkdownComponentProps) => (
              <h3 className={`text-2xl font-medium mt-6 mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>{children}</h3>
            ),
            h4: ({ children }: MarkdownComponentProps) => (
              <h4 className={`text-xl font-medium mt-6 mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{children}</h4>
            ),
            blockquote: ({ children }: MarkdownComponentProps) => (
              <blockquote className={`border-l-4 border-blue-500 pl-4 py-1 my-4 italic rounded-r-md ${
                theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-blue-50 text-gray-700'
              }`}>
                {children}
              </blockquote>
            ),
            ul: ({ children }: MarkdownComponentProps) => (
              <ul className="list-disc pl-6 text-lg my-4 space-y-2">{children}</ul>
            ),
            ol: ({ children }: MarkdownComponentProps) => (
              <ol className="list-decimal pl-6 text-lg my-4 space-y-2">{children}</ol>
            ),
            li: ({ children }: MarkdownComponentProps) => (
              <li className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{children}</li>
            ),
            table: ({ children }: MarkdownComponentProps) => (
              <div className="overflow-x-auto my-6">
                <table className={`min-w-full border-collapse border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                } rounded-md`}>{children}</table>
              </div>
            ),
            thead: ({ children }: MarkdownComponentProps) => (
              <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>{children}</thead>
            ),
            th: ({ children }: MarkdownComponentProps) => (
              <th className={`border px-4 py-2 text-left font-semibold ${
                theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'
              }`}>{children}</th>
            ),
            td: ({ children }: MarkdownComponentProps) => (
              <td className={`border px-4 py-2 ${
                theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'
              }`}>{children}</td>
            ),
            a: ({ href, children }: MarkdownComponentProps) => (
              <a
                href={href}
                className={`${
                  theme === 'dark' 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                } hover:underline`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            code: ({ className, children }: MarkdownComponentProps) => {
              const match = /language-(\w+)/.exec(className || "")
              return match ? (
                <div className="my-4 rounded-lg overflow-hidden shadow-md">
                  <div className={`text-xs px-4 py-1 flex items-center ${
                    theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-700 text-gray-200'
                  }`}>
                    <span>{match[1]}</span>
                  </div>
                  <pre className={`p-4 overflow-auto ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'
                  }`}>
                    <code className={className}>{children}</code>
                  </pre>
                </div>
              ) : (
                <code className={`px-1.5 py-0.5 rounded font-mono text-sm ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'
                }`}>{children}</code>
              )
            },
            p: ({ children, node }: MarkdownComponentProps) => {
              if (node?.children[0]?.type === "element" && node.children[0].tagName === "span") {
                return <span>{children}</span> // Fixes inline math issues
              }
              return <p className={`text-lg my-4 leading-relaxed ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>{children}</p>
            },
            hr: () => <hr className={`my-8 border-t-2 ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
        
      </div>
    </div>
  )
}

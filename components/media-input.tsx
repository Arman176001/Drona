"use client"

import { useState, useRef, useEffect } from "react"
import Button from "@/components/ui/button"
import { Upload, LinkIcon, Globe, Youtube, FileType, CheckCircle, Loader2, ArrowLeft, Sparkles } from "lucide-react"
import axios from "axios"
import Loader from "./loader"
import { useUser } from "@clerk/nextjs"

type MediaInputProps = {
  onSubmit: (url: string) => void
}

export default function MediaInput({ onSubmit }: MediaInputProps) {
  const [inputType, setInputType] = useState<"youtube" | "file" | "url" | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hoverCard, setHoverCard] = useState<"youtube" | "file" | "url" | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropzoneRef = useRef<HTMLLabelElement>(null)

  // Particle animation for background
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle properties
    const particlesArray: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
    }[] = []

    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const speedX = Math.random() * 0.5 - 0.25
        const speedY = Math.random() * 0.5 - 0.25
        const colorChoices = ["rgba(99, 102, 241, ", "rgba(168, 85, 247, ", "rgba(79, 70, 229, "]
        const color = colorChoices[Math.floor(Math.random() * colorChoices.length)]
        const alpha = Math.random() * 0.5 + 0.2

        particlesArray.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          alpha,
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()

        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1

        // Connect particles
        connectParticles(p, i)
      }

      requestAnimationFrame(animate)
    }

    // Connect nearby particles with lines
    const connectParticles = (p: (typeof particlesArray)[0], index: number) => {
      for (let j = index + 1; j < particlesArray.length; j++) {
        const p2 = particlesArray[j]
        const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)

        if (distance < canvas.width / 15) {
          ctx.beginPath()
          ctx.strokeStyle = `${p.color}${Math.max(0, 0.8 - distance / (canvas.width / 15))})`
          ctx.lineWidth = 0.4
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // File upload drag and drop effects
  useEffect(() => {
    if (!dropzoneRef.current || inputType !== "file") return

    const dropzone = dropzoneRef.current

    const highlight = () => {
      dropzone.classList.add("border-indigo-500", "bg-indigo-500/10")
      dropzone.classList.remove("border-white/20", "hover:bg-white/5")
    }

    const unhighlight = () => {
      dropzone.classList.remove("border-indigo-500", "bg-indigo-500/10")
      dropzone.classList.add("border-white/20", "hover:bg-white/5")
    }

    const preventDefaults = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = async (e: DragEvent) => {
      unhighlight()
      const dt = e.dataTransfer
      if (!dt) return

      const file = dt.files[0]
      if (file) {
        setIsLoading(true)
        await fileUpload(file)
      }
    }
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, preventDefaults, false)
    })

    dropzone.addEventListener("dragenter", highlight, false)
    dropzone.addEventListener("dragover", highlight, false)
    dropzone.addEventListener("dragleave", unhighlight, false)
    dropzone.addEventListener("drop", handleDrop, false)

    return () => {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropzone.removeEventListener(eventName, preventDefaults, false)
      })

      dropzone.removeEventListener("dragenter", highlight, false)
      dropzone.removeEventListener("dragover", highlight, false)
      dropzone.removeEventListener("dragleave", unhighlight, false)
      dropzone.removeEventListener("drop", handleDrop, false)
    }
  }, [inputType])

  const fileUpload = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const fileType = file.type

      const res = await axios.post("/api/s3/upload", { fileName, fileType })
      const { uploadUrl } = await res.data

      if (!uploadUrl) {
        throw new Error("Failed to get upload URL")
      }

      const upload = await axios.put(uploadUrl, file)
      if (upload.status !== 200) {
        throw new Error("Failed to upload resume")
      }

      const docUrl = uploadUrl.split("?")[0]
      setFileUrl(docUrl)
      setIsLoading(false)
    } catch (error) {
      console.error("Upload failed:", error)
      // setError("Failed to upload resume. Please try again.")
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      let params = {}

      if (inputType === "file" && fileUrl) {
        params = { file_path: fileUrl }
      } else if (inputType === "youtube" && inputValue) {
        params = { yt_url: inputValue }
      } else if (inputType === "url" && inputValue) {
        params = { web_url: inputValue }
      } else {
        throw new Error("Invalid input")
      }

      const response = await axios.post("http://127.0.0.1:8000/upload", null, {
        params: params,
      })
      console.log("Received response from upload API", response)

      if (response.status === 200) {
        const data = response.data;
        
        onSubmit(data) // Pass the response data to parent component
        console.log(data)
      } else {
        throw new Error("Failed to process input")
      }
    } catch (error) {
      console.error("Error submitting data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative w-full max-w-[1920px] mx-auto px-4">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 opacity-50 w-full bg-black" />

      {!inputType ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1800px] mx-auto">
          <button
            onClick={() => setInputType("youtube")}
            onMouseEnter={() => setHoverCard("youtube")}
            onMouseLeave={() => setHoverCard(null)}
            className="group relative flex flex-col items-center justify-center p-8 border border-white/10 bg-black backdrop-blur-md rounded-xl hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Animated background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hoverCard === "youtube" ? "opacity-100" : ""}`}
            ></div>

            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${hoverCard === "youtube" ? "opacity-30" : ""}`}
            ></div>

            <div className="relative z-10 flex flex-col items-center  ">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
                <Youtube className="w-20 h-8 text-white" />
              </div>
              <span className="font-medium text-white text-lg mb-2 ">YouTube Link</span>
              <p className="text-xs text-gray-100 text-center">Import content from YouTube videos</p>
            </div>

            {/* Animated corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-tl from-red-500/40 to-transparent rounded-tl-xl"></div>
          </button>

          <button
            onClick={() => setInputType("file")}
            onMouseEnter={() => setHoverCard("file")}
            onMouseLeave={() => setHoverCard(null)}
            className="group relative flex flex-col items-center justify-center p-8 border border-white/10 bg-black backdrop-blur-md rounded-xl hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Animated background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hoverCard === "file" ? "opacity-100" : ""}`}
            ></div>

            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-700 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${hoverCard === "file" ? "opacity-30" : ""}`}
            ></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <span className="font-medium text-white text-lg mb-2">File Upload</span>
              <p className="text-xs text-gray-100 text-center">Upload documents, presentations or media</p>
            </div>

            {/* Animated corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-tl from-indigo-500/40 to-transparent rounded-tl-xl"></div>
          </button>

          <button
            onClick={() => setInputType("url")}
            onMouseEnter={() => setHoverCard("url")}
            onMouseLeave={() => setHoverCard(null)}
            className="group relative flex flex-col items-center justify-center p-8 border border-white/10 bg-black backdrop-blur-md rounded-xl hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Animated background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hoverCard === "url" ? "opacity-100" : ""}`}
            ></div>

            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-700 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${hoverCard === "url" ? "opacity-30" : ""}`}
            ></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-700 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="font-medium text-white text-lg mb-2">Website URL</span>
              <p className="text-xs text-gray-100 text-center">Extract content from web pages</p>
            </div>

            {/* Animated corner accent */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-tl from-emerald-500/40 to-transparent rounded-tl-xl"></div>
          </button>
        </div>
      ) : (
        <div className="space-y-6 bg-black backdrop-blur-md rounded-xl border border-white/10 p-6 relative overflow-hidden max-w-[1900px] mx-auto">
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-3xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-3xl"></div>

          <div className="flex items-center space-x-3 pb-4 border-b border-white/10 relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                inputType === "youtube"
                  ? "bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30"
                  : inputType === "file"
                    ? "bg-gradient-to-br from-indigo-500 to-blue-700 shadow-indigo-500/30"
                    : "bg-gradient-to-br from-emerald-500 to-green-700 shadow-emerald-500/30"
              }`}
            >
              {inputType === "youtube" && <Youtube className="w-6 h-6 text-white" />}
              {inputType === "file" && <FileType className="w-6 h-6 text-white" />}
              {inputType === "url" && <Globe className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">
                {inputType === "youtube"
                  ? "Add YouTube Video"
                  : inputType === "file"
                    ? "Upload Learning Material"
                    : "Add Website URL"}
              </h3>
              <p className="text-xs text-gray-100 mt-1">
                {inputType === "youtube"
                  ? "Import content from a YouTube video"
                  : inputType === "file"
                    ? "Upload documents, presentations or media files"
                    : "Extract content from a website"}
              </p>
            </div>
          </div>

          {inputType === "youtube" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">YouTube Video URL</label>
              <div className="flex group focus-within:ring-2 focus-within:ring-indigo-500 rounded-md transition-all duration-200">
                <div className="flex-shrink-0 inline-flex items-center px-3 border-y border-l border-white/10 bg-black/50 text-gray-100 rounded-l-md group-focus-within:border-indigo-500 transition-all duration-200">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 min-w-0 block w-full px-3 py-3 border border-white/10 bg-black/50 text-white rounded-r-md focus:outline-none group-focus-within:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div className="flex items-center text-xs text-gray-100 mt-2">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                <p>Paste the full YouTube URL including the video ID</p>
              </div>
            </div>
          )}

          {inputType === "file" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">Upload Learning Material</label>
              <div className="flex items-center justify-center w-full">
                <label
                  ref={dropzoneRef}
                  className="flex flex-col w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Subtle animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <input
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setIsLoading(true)
                        await fileUpload(file)
                      }
                    }}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3"
                    // Max file size 100MB in bytes
                    max="104857600"
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                    {isLoading ? (
                      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    ) : fileUrl ? (
                      <>
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                          <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <p className="text-base text-white font-medium">File uploaded successfully</p>
                        <p className="text-xs text-gray-100 mt-2">Ready for processing</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                          <Upload className="w-8 h-8 text-indigo-400" />
                        </div>
                        <p className="text-base text-white">
                          <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-100 mt-2">PDF, DOC, PPT, MP4, MP3 (MAX. 100MB)</p>

                        {/* Animated upload indicator */}
                        <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-shimmer"
                            style={{ backgroundSize: "200% 100%" }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {inputType === "url" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">Website URL</label>
              <div className="flex group focus-within:ring-2 focus-within:ring-indigo-500 rounded-md transition-all duration-200">
                <div className="flex-shrink-0 inline-flex items-center px-3 border-y border-l border-white/10 bg-black text-gray-100 rounded-l-md group-focus-within:border-indigo-500 transition-all duration-200">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 min-w-0 block w-full px-3 py-3 border border-white bg-black text-white rounded-r-md focus:outline-none group-focus-within:border-indigo-500 transition-all duration-200"
                />
              </div>
              <div className="flex items-center text-xs text-gray-100 mt-2">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                <p>Enter the full URL including https://</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              onClick={() => {
                setInputType(null)
                setInputValue("")
                setFileUrl("")
              }}
              className="bg-black hover:bg-white/10 text-white border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2 px-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                (inputType === "file" && !fileUrl) ||
                ((inputType === "youtube" || inputType === "url") && !inputValue) ||
                isLoading
              }
              className={`relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 px-6 ${
                (inputType === "file" && !fileUrl) ||
                ((inputType === "youtube" || inputType === "url") && !inputValue) ||
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {/* Animated shimmer effect */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-20 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700"></span>

              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


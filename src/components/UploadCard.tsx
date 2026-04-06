"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { useImageProcessor } from "@/hooks/useImageProcessor"

type Mode = "remove-bg" | "convert"
type Format = "png" | "jpg" | "webp" | "avif"

interface ModeOption {
  label: string
  mode: Mode
  format?: Format
}

const MODE_OPTIONS: ModeOption[] = [
  { label: "Remove BG", mode: "remove-bg" },
  { label: "→ PNG", mode: "convert", format: "png" },
  { label: "→ JPG", mode: "convert", format: "jpg" },
  { label: "→ WEBP", mode: "convert", format: "webp" },
  { label: "→ AVIF", mode: "convert", format: "avif" },
]

export default function UploadCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ rx: 0, ry: 0 })
  const currentRef = useRef({ rx: 0, ry: 0 })

  const [activeIdx, setActiveIdx] = useState(0)
  const { processImage, status, progress, errorMessage, setStatus } =
    useImageProcessor()

  const activeOption = MODE_OPTIONS[activeIdx]

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      targetRef.current = {
        rx: (ny - 0.5) * -14,
        ry: (nx - 0.5) * 14,
      }
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`)
      card.style.setProperty("--my", `${e.clientY - rect.top}px`)
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { rx: 0, ry: 0 }
  }, [])

  useEffect(() => {
    function lerp() {
      const c = currentRef.current
      const t = targetRef.current
      c.rx += (t.rx - c.rx) * 0.08
      c.ry += (t.ry - c.ry) * 0.08
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(800px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
      }
      rafRef.current = requestAnimationFrame(lerp)
    }
    rafRef.current = requestAnimationFrame(lerp)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      await processImage(file, activeOption.mode, activeOption.format)
      setTimeout(() => setStatus("idle"), 1500)
    },
    [processImage, activeOption, setStatus]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
    },
    []
  )

  const handleClick = useCallback(() => {
    if (status === "loading") return
    inputRef.current?.click()
  }, [status])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [handleFile]
  )

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="relative mx-auto w-full max-w-[500px] cursor-pointer"
        style={{
          aspectRatio: "16/10",
          transformStyle: "preserve-3d",
          willChange: "transform",
          ["--mx" as string]: "250px",
          ["--my" as string]: "156px",
        }}
      >
        {/* Glow border */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            background:
              "radial-gradient(circle 140px at var(--mx) var(--my), rgba(220,215,200,0.65), transparent 75%)",
            zIndex: 1,
          }}
        />

        {/* Card body */}
        <div className="absolute inset-[1px] flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          {status === "idle" && (
            <>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text)] opacity-40"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="font-jost text-sm font-light tracking-wide text-[var(--text)] opacity-50">
                Drop an image or click to upload
              </p>
            </>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--text)]/20 border-t-[var(--text)]/70" />
              <p className="font-jost text-sm font-light tracking-wide text-[var(--text)] opacity-70">
                Processing… {progress}%
              </p>
            </div>
          )}

          {status === "done" && (
            <div className="flex flex-col items-center gap-3">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text)] opacity-60"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <p className="font-jost text-sm font-light tracking-wide text-[var(--text)] opacity-70">
                Done — downloading
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 px-6">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-400 opacity-70"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="font-jost text-center text-sm font-light tracking-wide text-red-400/80">
                {errorMessage ?? "Something went wrong"}
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Format selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MODE_OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            onClick={(e) => {
              e.stopPropagation()
              setActiveIdx(i)
            }}
            className={`rounded-full border px-4 py-1.5 font-jost text-xs tracking-wider transition-[color,border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${
              i === activeIdx
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/[0.06] bg-transparent text-white/35 hover:text-white/60 hover:border-white/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

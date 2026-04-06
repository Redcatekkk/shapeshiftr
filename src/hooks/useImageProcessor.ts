"use client"

import { useState, useCallback } from "react"

type Status = "idle" | "loading" | "done" | "error"
type Mode = "remove-bg" | "convert"
type Format = "png" | "jpg" | "webp" | "avif"

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function stripExtension(name: string): string {
  return name.replace(/\.[^.]+$/, "")
}

const MIME_MAP: Record<Format, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
}

export function useImageProcessor() {
  const [status, setStatus] = useState<Status>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const processImage = useCallback(
    async (file: File, mode: Mode, format: Format = "png") => {
      setStatus("loading")
      setProgress(0)
      setErrorMessage(null)

      try {
        if (mode === "remove-bg") {
          const { removeBackground } = await import(
            "@imgly/background-removal"
          )

          const blob = await removeBackground(file, {
            progress: (key: string, current: number, total: number) => {
              if (total > 0) {
                setProgress(Math.round((current / total) * 100))
              }
            },
          })

          const baseName = stripExtension(file.name)
          triggerDownload(blob as Blob, `${baseName}-no-bg.png`)
        } else {
          setProgress(10)

          const bitmap = await createImageBitmap(file)
          setProgress(40)

          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Could not get canvas context")

          ctx.drawImage(bitmap, 0, 0)
          bitmap.close()
          setProgress(60)

          const mime = MIME_MAP[format]
          const blob = await canvas.convertToBlob({
            type: mime,
            quality: 0.92,
          })
          setProgress(90)

          const baseName = stripExtension(file.name)
          triggerDownload(blob, `${baseName}.${format}`)
          setProgress(100)
        }

        setStatus("done")
      } catch (err) {
        setStatus("error")
        setErrorMessage(
          err instanceof Error ? err.message : "Processing failed"
        )
      }
    },
    []
  )

  return { processImage, status, progress, errorMessage, setStatus }
}

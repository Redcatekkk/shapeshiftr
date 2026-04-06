"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Upload, FileCheck, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import UploadCard from "@/components/UploadCard"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

function FloatingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: rotate - 10 }}
      animate={{ opacity: 0.4, y: 0, rotate }}
      transition={{ duration: 2, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r from-blue-500/10 to-transparent",
            "backdrop-blur-sm border border-blue-500/10"
          )}
        />
      </motion.div>
    </motion.div>
  )
}

const FEATURES = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag and drop or click to upload your files",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Convert files in seconds with our optimized engine",
  },
  {
    icon: FileCheck,
    title: "Quality Output",
    description: "Get high-quality converted files every time",
  },
]

export default function Home() {
  const prefersReducedMotion = useReducedMotion()
  const uploadRef = React.useRef<HTMLDivElement>(null)
  const featuresRef = React.useRef<HTMLDivElement>(null)

  const animateProps = prefersReducedMotion
    ? { initial: undefined, animate: undefined, variants: undefined }
    : { initial: "hidden" as const, animate: "visible" as const, variants: fadeUpVariants }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="film-grain" aria-hidden="true" />
      <div className="absolute inset-0 radial-gradient-dark" aria-hidden="true" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape delay={0.2} width={500} height={120} rotate={15} className="left-[-10%] top-[20%]" />
        <FloatingShape delay={0.4} width={400} height={100} rotate={-12} className="right-[-5%] top-[70%]" />
        <FloatingShape delay={0.6} width={300} height={80} rotate={8} className="left-[10%] bottom-[15%]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Pill badge */}
          <motion.div custom={0} {...animateProps} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <Zap className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-sm text-white/60 tracking-wide font-medium font-jost">
                Fast &amp; Secure Conversion
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div custom={1} {...animateProps}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight font-syne" style={{ textWrap: "balance" }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 text-glow">
                Convert Files Instantly
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div custom={2} {...animateProps}>
            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-12 leading-relaxed font-light max-w-2xl mx-auto font-jost">
              Upload, convert, and download your files in seconds. Support for all major formats with lightning-fast processing.
            </p>
          </motion.div>

          {/* Upload zone */}
          <motion.div custom={3} {...animateProps} className="w-full max-w-2xl mb-12" ref={uploadRef} id="upload">
            <UploadCard />
          </motion.div>

          {/* CTA buttons */}
          <motion.div custom={4} {...animateProps} className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => {
                uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                const input = uploadRef.current?.querySelector<HTMLInputElement>('input[type="file"]')
                setTimeout(() => input?.click(), 400)
              }}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-[background-color,transform,box-shadow] duration-300 hover:scale-105 motion-reduce:hover:scale-100 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] font-jost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              Start Converting
            </button>
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-[background-color,border-color] duration-300 hover:border-white/20 font-jost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              View Formats
            </button>
          </motion.div>

          {/* Feature cards */}
          <motion.div custom={5} {...animateProps} ref={featuresRef} id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl scroll-mt-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card rounded-xl p-6 text-left">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                  <feature.icon className="w-6 h-6 text-blue-400" aria-hidden="true" />
                </div>
                <h2 className="text-white text-lg font-semibold mb-2 font-jost">
                  {feature.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed font-jost">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom/top vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80 pointer-events-none" />
    </div>
  )
}

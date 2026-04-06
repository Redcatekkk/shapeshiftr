"use client"

import { motion } from "framer-motion"
import MorphIcon from "./MorphIcon"

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

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6">
      {/* Wordmark row */}
      <motion.div
        custom={0}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-4"
      >
        <MorphIcon size={72} />
        <h1
          className="font-syne font-extrabold leading-none tracking-tight text-[var(--text)]"
          style={{ fontSize: "clamp(68px, 11vw, 148px)" }}
        >
          shapeshiftr
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        custom={1}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="mt-5 font-jost text-lg font-light italic tracking-wide text-[var(--text)] opacity-40 md:text-xl"
      >
        Remove backgrounds. Convert anything.
      </motion.p>
    </section>
  )
}

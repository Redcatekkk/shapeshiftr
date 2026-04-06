"use client"

import { useEffect, useRef } from "react"

export default function MorphIcon({ size = 48 }: { size?: number }) {
  const pathRef = useRef<SVGPathElement>(null)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const cx = 24
    const cy = 24
    const baseR = 16
    const numPoints = 7

    function buildPath(t: number): string {
      const points: [number, number][] = []
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints
        const r =
          baseR *
          (0.78 +
            Math.sin(t * 0.9 + i * 1.4) * 0.22 +
            Math.sin(t * 0.55 + i * 2.3) * 0.14)
        points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
      }

      let d = ""
      for (let i = 0; i < numPoints; i++) {
        const curr = points[i]
        const next = points[(i + 1) % numPoints]
        const mx = (curr[0] + next[0]) / 2
        const my = (curr[1] + next[1]) / 2
        if (i === 0) {
          const prev = points[numPoints - 1]
          const startMx = (prev[0] + curr[0]) / 2
          const startMy = (prev[1] + curr[1]) / 2
          d += `M ${startMx},${startMy} `
        }
        d += `Q ${curr[0]},${curr[1]} ${mx},${my} `
      }
      d += "Z"
      return d
    }

    function tick(now: number) {
      if (!startRef.current) startRef.current = now
      const elapsed = (now - startRef.current) / 1000
      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildPath(elapsed))
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className="inline-block flex-shrink-0"
      style={{ verticalAlign: "middle" }}
    >
      <path
        ref={pathRef}
        fill="var(--text)"
        fillOpacity={0.9}
        d=""
      />
    </svg>
  )
}

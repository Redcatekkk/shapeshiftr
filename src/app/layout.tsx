import type { Metadata, Viewport } from "next"
import { Syne, Jost } from "next/font/google"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-syne",
  display: "swap",
})

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jost",
  display: "swap",
})

export const metadata: Metadata = {
  title: "shapeshiftr — Remove backgrounds. Convert anything.",
  description:
    "Remove backgrounds. Convert anything. No account needed. Instant processing.",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}

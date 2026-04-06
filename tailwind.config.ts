import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)"],
        jost: ["var(--font-jost)"],
      },
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
      },
    },
  },
  plugins: [],
}

export default config

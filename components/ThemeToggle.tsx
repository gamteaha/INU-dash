"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-[var(--color-bone)]/10 animate-pulse" />
  }

  const isLight = theme === "light"

  return (
    <button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-char)] border border-[var(--color-bone)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-[var(--color-iron)]/50 focus:outline-none"
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 text-yellow-500 transition-all duration-300 ${isLight ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute"}`} />
      <Moon className={`h-5 w-5 text-[var(--color-mist)] transition-all duration-300 ${isLight ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100"}`} />
    </button>
  )
}

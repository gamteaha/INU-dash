import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useBrandColors() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = theme === "light"

  // INU Blue
  const blueTheme = ["#004B9B", "#38BDF8", "#003366"]
  // Torch Orange
  const orangeTheme = ["#F97316", "#FDBA74", "#C2410C"]

  if (!mounted) {
    // SSR defaults to dark theme
    return {
      blue: blueTheme,
      orange: orangeTheme,
      isLight: false,
    }
  }

  return {
    // Swap colors in light mode
    blue: isLight ? orangeTheme : blueTheme,
    orange: isLight ? blueTheme : orangeTheme,
    isLight,
  }
}

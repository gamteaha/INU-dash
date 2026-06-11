"use client"

import { useEffect, useRef, useState } from "react"

// easeOutQuart: fast start, gentle deceleration
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

/**
 * Animates a number from 0 to `target` over `duration` ms using
 * easeOutQuart. Respects prefers-reduced-motion by jumping instantly.
 *
 * @param target   The final numeric value
 * @param duration Animation duration in ms (default 1200)
 * @param decimals Decimal places to preserve during animation (default 0)
 */
export function useCountUp(
  target: number,
  duration = 1200,
  decimals = 0
): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    // Immediately skip animation if user prefers reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      setValue(target)
      return
    }

    // Reset on target change so a new filter triggers a fresh count-up
    startRef.current = null
    setValue(0)

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      const raw = eased * target

      setValue(
        decimals > 0
          ? parseFloat(raw.toFixed(decimals))
          : Math.round(raw)
      )

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        // Ensure final value is exactly target (no floating-point drift)
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, duration, decimals])

  return value
}

"use client"

import { BookOpen, Users, BarChart2, Globe } from "lucide-react"
import { useCountUp } from "@/hooks/useCountUp"

interface KpiCardsProps {
  totalCourses: number
  totalCapacity: number
  totalEnrolled: number
  englishLecturesCount: number
}

// ── Individual animated card ───────────────────────────────────
interface KpiCardProps {
  id: string
  label: string
  /** Raw numeric value (integer or float) */
  rawValue: number
  unit: string
  delta: string
  icon: React.ElementType
  /** Stagger delay in ms */
  delay: number
  /** Decimal places for float values */
  decimals?: number
  /** Format fn applied to the animated number before display */
  format?: (n: number) => string
}

function KpiCard({
  id,
  label,
  rawValue,
  unit,
  delta,
  icon: Icon,
  delay,
  decimals = 0,
  format,
}: KpiCardProps) {
  const animated = useCountUp(rawValue, 1200, decimals)
  const display = format ? format(animated) : animated.toLocaleString()

  return (
    <div
      id={id}
      className="bg-[var(--color-paper)] rounded-[var(--radius-card)] p-6 flex flex-col justify-between shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-transform duration-200 ease-in-out border-none"
      style={{
        animation: `cardEnter 400ms ease-out ${delay}ms both`,
      }}
    >
      {/* Top Row: Label + Icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-medium text-[var(--color-slate)]">
          {label}
        </span>
        <Icon className="h-5 w-5 text-[var(--color-signal-orange)] shrink-0" strokeWidth={1.5} />
      </div>

      {/* Center Row: Animated Value + Unit */}
      <div className="flex items-baseline gap-1 mb-2">
        <span
          className="text-[40px] font-normal tracking-[-0.8px] text-[var(--color-carbon)] leading-none tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {display}
        </span>
        <span
          className="text-[20px] font-normal text-[var(--color-carbon)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {unit}
        </span>
      </div>

      {/* Bottom Row: Delta */}
      <div className="text-[12px] font-normal text-[var(--color-slate)]">
        {delta}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function KpiCards({
  totalCourses,
  totalCapacity,
  totalEnrolled,
  englishLecturesCount,
}: KpiCardsProps) {
  const avgEnrollRate =
    totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0
  const englishRate =
    totalCourses > 0 ? (englishLecturesCount / totalCourses) * 100 : 0

  const cards: KpiCardProps[] = [
    {
      id: "total-courses",
      label: "총 강좌 수",
      rawValue: totalCourses,
      unit: "개",
      icon: BookOpen,
      delta: "전 학기 대비 +1.2%",
      delay: 0,
      decimals: 0,
      format: (n) => Math.round(n).toLocaleString(),
    },
    {
      id: "total-enrolled",
      label: "총 수강인원",
      rawValue: totalEnrolled,
      unit: "명",
      icon: Users,
      delta: "전 학기 대비 +3.4%",
      delay: 80,
      decimals: 0,
      format: (n) => Math.round(n).toLocaleString(),
    },
    {
      id: "avg-enroll-rate",
      label: "평균 수강율",
      rawValue: avgEnrollRate,
      unit: "%",
      icon: BarChart2,
      delta: "전 학기 대비 +0.8%p",
      delay: 160,
      decimals: 1,
      format: (n) => n.toFixed(1),
    },
    {
      id: "english-rate",
      label: "원어강의의 비율",
      rawValue: englishRate,
      unit: "%",
      icon: Globe,
      delta: "전 학기 대비 -0.2%p",
      delay: 240,
      decimals: 1,
      format: (n) => n.toFixed(1),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KpiCard key={card.id} {...card} />
      ))}
    </div>
  )
}

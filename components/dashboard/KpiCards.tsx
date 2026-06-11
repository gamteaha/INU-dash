"use client"

import { BookOpen, Users, BarChart2, Globe } from "lucide-react"
import { useCountUp } from "@/hooks/useCountUp"
import { useBrandColors } from "@/hooks/useBrandColors"

interface KpiCardsProps {
  totalCourses: number
  totalCapacity: number
  totalEnrolled: number
  englishLecturesCount: number
}

interface KpiCardProps {
  id: string
  label: string
  rawValue: number
  unit: string
  delta: string
  icon: React.ElementType
  delay: number
  decimals?: number
  accentColor: string
  glowColor: string
  isLight: boolean
}

function KpiCard({ id, label, rawValue, unit, delta, icon: Icon, delay, decimals = 0, accentColor, glowColor, isLight }: KpiCardProps) {
  const animated = useCountUp(rawValue, 1200, decimals)
  const display = animated.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return (
    <div
      id={id}
      className="glass-card relative flex flex-col justify-between p-6 overflow-hidden group cursor-default"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      {/* Accent glow blob */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ background: glowColor }}
      />
      {/* Top shimmer line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Label + Icon */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[13px] font-medium tracking-wide" style={{ color: isLight ? "#4a5568" : "rgba(255,255,255,0.6)" }}>{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${glowColor}33` }}>
          <Icon className="h-4 w-4" style={{ color: accentColor }} strokeWidth={1.5} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className="text-[34px] font-light tracking-tight font-geist leading-none" style={{ color: isLight ? "#1a202c" : "white", textShadow: isLight ? "none" : `0 0 12px ${glowColor}` }}>
          {display}
        </span>
        <span className="text-[14px] font-medium" style={{ color: accentColor }}>{unit}</span>
      </div>

      {/* Delta */}
      <div className="mt-4 pt-3 relative z-10" style={{ borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)"}` }}>
        <span className="text-[12px] font-normal" style={{ color: isLight ? "#718096" : "rgba(255,255,255,0.4)" }}>{delta}</span>
      </div>
    </div>
  )
}

export default function KpiCards({ totalCourses, totalCapacity, totalEnrolled, englishLecturesCount }: KpiCardsProps) {
  const avgEnrollRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0
  const englishRate = totalCourses > 0 ? (englishLecturesCount / totalCourses) * 100 : 0
  const { blue, orange, isLight } = useBrandColors()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <KpiCard id="kpi-total-courses" label="총 강좌 수" rawValue={totalCourses} unit="개" delta="필터링된 전체 강좌"
        icon={BookOpen} delay={0} accentColor={blue[1]} glowColor={blue[0]} isLight={isLight} />
      <KpiCard id="kpi-avg-enroll" label="평균 수강률" rawValue={avgEnrollRate} unit="%" delta="수강정원 대비 수강인원"
        icon={BarChart2} delay={80} decimals={1} accentColor={blue[0]} glowColor={blue[1]} isLight={isLight} />
      <KpiCard id="kpi-total-enrolled" label="총 수강 인원" rawValue={totalEnrolled} unit="명" delta="전체 수강생 누적 합계"
        icon={Users} delay={160} accentColor={blue[1]} glowColor={blue[0]} isLight={isLight} />
      <KpiCard id="kpi-english" label="원어 강의 비율" rawValue={englishRate} unit="%" delta={`${englishLecturesCount.toLocaleString()}개 원어 강좌`}
        icon={Globe} delay={240} decimals={1} accentColor={orange[0]} glowColor={orange[1]} isLight={isLight} />
    </div>
  )
}

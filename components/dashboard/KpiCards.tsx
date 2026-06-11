"use client"

import { BookOpen, Users, BarChart2, Globe } from "lucide-react"
import { useCountUp } from "@/hooks/useCountUp"

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
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-[5px_5px_15px_rgba(0,75,155,0.08)] border border-white/60 hover:-translate-y-1 hover:shadow-[8px_8px_20px_rgba(0,75,155,0.12)] transition-all duration-300 ease-in-out relative overflow-hidden group"
      style={{
        animation: `cardEnter 400ms ease-out ${delay}ms both`,
      }}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-300/30 to-indigo-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      {/* Top Row: Label + Icon */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[14px] font-bold text-blue-900/60 tracking-wide">
          {label}
        </span>
        <div className="p-2.5 bg-blue-50/80 rounded-xl shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),2px_2px_5px_rgba(0,75,155,0.1)] group-hover:bg-blue-100/80 transition-colors">
          <Icon className="h-5 w-5 text-blue-600 shrink-0 drop-shadow-sm" strokeWidth={2} />
        </div>
      </div>

      {/* Center Row: Animated Value + Unit */}
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-blue-900 drop-shadow-sm">
          {display}
        </span>
        <span className="text-[14px] font-semibold text-blue-900/60">
          {unit}
        </span>
      </div>

      {/* Bottom Row: Context/Delta text */}
      <div className="mt-3 relative z-10">
        <span className="text-[12px] font-medium text-blue-600/80 bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100/50">
          {delta}
        </span>
      </div>
    </div>
  )
}

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <KpiCard
        id="kpi-total-courses"
        label="총 개설 강좌"
        rawValue={totalCourses}
        unit="개"
        delta="전체 단과대학 기준"
        icon={BookOpen}
        delay={0}
      />
      <KpiCard
        id="kpi-avg-enroll"
        label="평균 수강률"
        rawValue={avgEnrollRate}
        unit="%"
        delta="전체 정원 대비 수강인원"
        icon={BarChart2}
        delay={100}
        decimals={1}
      />
      <KpiCard
        id="kpi-total-enrolled"
        label="총 수강 인원"
        rawValue={totalEnrolled}
        unit="명"
        delta="수강신청 인원 합계"
        icon={Users}
        delay={200}
      />
      <KpiCard
        id="kpi-english"
        label="원어 강의 비율"
        rawValue={englishRate}
        unit="%"
        delta={`전체 중 ${englishLecturesCount.toLocaleString()}개`}
        icon={Globe}
        delay={300}
        decimals={1}
      />
    </div>
  )
}

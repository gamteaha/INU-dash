"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { ArrowRight } from "lucide-react"

interface CollegeRow {
  rank: number
  name: string
  courseCount: number
  totalEnrolled: number
  avgEnrollRate: number
}

interface CollegeSummaryTableProps {
  title: string
  data: CollegeRow[]
}

// 1위는 횃불이 오렌지, 나머지는 인천대 블루 계열
const RANK_COLORS = ["#F97316", "#64B4FF", "#5BC8F5", "#1A6EBF", "#A8D8F0"]
const RANK_GLOW  = ["rgba(249,115,22,0.55)", "rgba(100,180,255,0.45)", "rgba(91,200,245,0.4)", "rgba(26,110,191,0.35)", "rgba(168,216,240,0.35)"]

export default function CollegeSummaryTable({ title, data }: CollegeSummaryTableProps) {
  const { selectedCollege, selectedDepartment, setSelectedCollege, setSelectedDepartment } = useDashboard()

  const handleCardClick = (name: string) => {
    if (!selectedCollege) {
      setSelectedCollege(name)
      setSelectedDepartment(null)
    } else if (!selectedDepartment) {
      setSelectedDepartment(name)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#F97316", boxShadow: "0 0 8px rgba(249,115,22,0.7)" }} />
        <h3 className="text-[14px] font-semibold text-[var(--color-bone)]">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((row) => {
          const accentColor = RANK_COLORS[(row.rank - 1) % RANK_COLORS.length]
          const glowColor  = RANK_GLOW[(row.rank - 1) % RANK_GLOW.length]
          const isTop = row.rank === 1
          const fillPct = Math.min(row.avgEnrollRate, 100)

          return (
            <div
              key={row.name}
              onClick={() => handleCardClick(row.name)}
              className="glass-card relative p-5 cursor-pointer group overflow-hidden"
            >
              {/* Accent glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
                style={{ background: isTop ? "rgba(249,115,22,0.22)" : `${accentColor}33` }} />
              {/* 1위 카드 오렌지 코너 빛 번짐 */}
              {isTop && (
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-60"
                  style={{ background: "rgba(249,115,22,0.35)" }} />
              )}
              {/* Top shimmer */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Rank badge */}
              <div className="flex items-start justify-between mb-3 relative z-10">
                <span className="text-[11px] font-bold font-geist px-2 py-0.5 rounded-full border"
                  style={{ color: accentColor, borderColor: `${accentColor}44`, background: `${accentColor}18` }}>
                  #{row.rank}
                </span>
                {!selectedDepartment && (
                  <ArrowRight className="w-4 h-4 text-[var(--color-fog)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                )}
              </div>

              <p className="text-[15px] font-semibold text-[var(--color-bone)] mb-3 relative z-10 leading-tight">{row.name}</p>

              <div className="flex items-baseline gap-1.5 mb-4 relative z-10">
                <span
                  className="text-[28px] font-light tracking-tight font-geist"
                  style={{ color: "#fff", textShadow: isTop ? "0 0 18px rgba(249,115,22,0.6)" : "0 0 14px rgba(56,189,248,0.4)" }}
                >
                  {row.courseCount.toLocaleString()}
                </span>
                <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>개 강좌</span>
              </div>

              {/* Enrollment rate bar */}
              <div className="relative z-10">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.totalEnrolled.toLocaleString()}명 수강</span>
                  <span className="font-medium font-geist" style={{ color: accentColor }}>{row.avgEnrollRate.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${fillPct}%`,
                      background: isTop
                        ? "linear-gradient(90deg, #C2410C88, #F97316, #FDBA74)"
                        : `linear-gradient(90deg, ${accentColor}88, ${accentColor})`
                    }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

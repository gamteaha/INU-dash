"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { ArrowRight } from "lucide-react"
import { useBrandColors } from "@/hooks/useBrandColors"

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

export default function CollegeSummaryTable({ title, data }: CollegeSummaryTableProps) {
  const { selectedCollege, selectedDepartment, setSelectedCollege, setSelectedDepartment } = useDashboard()
  const { blue, orange, isLight } = useBrandColors()

  // 1위는 포인트 컬러, 나머지는 메인 컬러
  const RANK_COLORS = isLight 
    ? [blue[1], orange[1], orange[0], orange[2], orange[1]]
    : [orange[1], blue[1], blue[0], blue[2], blue[1]]
    
  const RANK_GLOW = isLight
    ? [`${blue[1]}80`, `${orange[1]}60`, `${orange[0]}60`, `${orange[2]}60`, `${orange[1]}60`]
    : [`${orange[1]}80`, `${blue[1]}60`, `${blue[0]}60`, `${blue[2]}60`, `${blue[1]}60`]

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
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isLight ? blue[1] : orange[1], boxShadow: `0 0 8px ${isLight ? blue[1] : orange[1]}` }} />
        <h3 className="text-[14px] font-semibold" style={{ color: isLight ? "#1a202c" : "var(--color-bone)" }}>{title}</h3>
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
                style={{ background: isTop ? (isLight ? "rgba(56,189,248,0.22)" : "rgba(249,115,22,0.22)") : `${accentColor}33` }} />
              {/* 1위 카드 코너 빛 번짐 */}
              {isTop && (
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-60"
                  style={{ background: isLight ? blue[1] : orange[1] }} />
              )}
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white shadow-md font-geist"
                    style={{ background: accentColor, boxShadow: `0 0 10px ${glowColor}` }}>
                    {row.rank}
                  </span>
                  <span className="text-[15px] font-semibold tracking-tight" style={{ color: isLight ? "#2d3748" : "var(--color-paper)" }}>
                    {row.name}
                  </span>
                </div>
                {!selectedDepartment && (
                  <ArrowRight className="w-4 h-4 text-[var(--color-fog)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                )}
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span
                  className="text-[28px] font-light tracking-tight font-geist"
                  style={{ color: isLight ? "#1a202c" : "#fff" }}
                >
                  {row.courseCount.toLocaleString()}
                  <span className="text-[12px] font-medium ml-1.5" style={{ color: isLight ? "#718096" : "rgba(255,255,255,0.5)" }}>개 강좌</span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: accentColor }} />
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span style={{ color: isLight ? "#718096" : "rgba(255,255,255,0.5)" }}>평균 수강률</span>
                    <span className="font-geist font-medium" style={{ color: accentColor }}>{row.avgEnrollRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)" }}>
                    <div 
                      className="h-full rounded-full relative"
                      style={{ 
                        width: `${fillPct}%`,
                        background: accentColor,
                        boxShadow: `0 0 8px ${glowColor}`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

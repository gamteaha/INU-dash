"use client"

import { useState } from "react"
import { useDashboard } from "@/context/DashboardFilterContext"
import { COLLEGE_ORDER, DEPARTMENT_LINKS } from "@/lib/supabase/constants"
import { Sparkles, GraduationCap, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const {
    selectedCollege,
    selectedDepartment,
    setSelectedCollege,
    setSelectedDepartment,
    setCollegeAndDepartment,
    departmentsByCollege,
  } = useDashboard()

  const [expandedColleges, setExpandedColleges] = useState<Record<string, boolean>>(() => 
    Object.fromEntries(COLLEGE_ORDER.map(c => [c, true]))
  )

  const toggleCollege = (e: React.MouseEvent, college: string) => {
    e.stopPropagation()
    setExpandedColleges(prev => ({ ...prev, [college]: !prev[college] }))
  }

  const handleExternalLink = (e: React.MouseEvent, dept: string) => {
    e.stopPropagation()
    const url = DEPARTMENT_LINKS[dept]
    if (url) window.open(url, "_blank", "noopener noreferrer")
  }

  return (
    <aside
      className="w-[268px] min-w-[268px] h-screen sticky top-0 flex flex-col z-40 overflow-y-auto custom-scrollbar"
      style={{
        background: "rgba(8,12,20,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Brand Header */}
      <div className="p-5 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => { setSelectedCollege(null); setSelectedDepartment(null) }}
          className="flex flex-col items-start gap-1 w-full hover:opacity-80 transition-opacity text-left"
        >
          <span className="text-[11px] font-medium tracking-widest uppercase"
            style={{ color: "var(--color-indigo-haze)" }}>
            INCHEON NATIONAL UNIV.
          </span>
          <span className="text-[18px] font-bold tracking-tight font-geist"
            style={{ color: "var(--color-paper)" }}>
            INU DASH
          </span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col p-3 gap-1 pb-8">

        {/* 대학전체 */}
        <button
          onClick={() => { setSelectedCollege(null); setSelectedDepartment(null) }}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13.5px] font-semibold transition-all w-full text-left mb-2"
          style={
            !selectedCollege
              ? { background: "rgba(100,180,255,0.15)", color: "var(--color-bone)", border: "1px solid rgba(100,180,255,0.3)" }
              : { color: "rgba(255,255,255,0.6)", border: "1px solid transparent" }
          }
          onMouseEnter={(e) => { if (selectedCollege) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
          onMouseLeave={(e) => { if (selectedCollege) e.currentTarget.style.background = "transparent" }}
        >
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: !selectedCollege ? "#A8D8F0" : "rgba(255,255,255,0.5)" }} />
          대학전체
        </button>

        {/* ── 구분선 ── */}
        <div className="h-[1px] mx-3 mb-2" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* 대학 목록 (COLLEGE_ORDER 고정 순서) */}
        <div className="flex flex-col gap-3">
          {COLLEGE_ORDER.map((collegeName) => {
            const isCollegeSelected = selectedCollege === collegeName
            const depts = departmentsByCollege[collegeName] || []
            const showDepts = expandedColleges[collegeName] && depts.length > 0

            return (
              <div key={collegeName}>
                {/* 대학 버튼 */}
                <button
                  onClick={() => setSelectedCollege(collegeName)}
                  className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-semibold transition-all w-full text-left group"
                  style={
                    isCollegeSelected && !selectedDepartment
                      ? { background: "rgba(100,180,255,0.15)", color: "var(--color-bone)", border: "1px solid rgba(100,180,255,0.2)" }
                      : { color: "var(--color-bone)", border: "1px solid transparent" }
                  }
                  onMouseEnter={(e) => {
                    if (!isCollegeSelected || selectedDepartment)
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                  }}
                  onMouseLeave={(e) => {
                    if (!isCollegeSelected || selectedDepartment)
                      e.currentTarget.style.background = "transparent"
                  }}
                >
                  <GraduationCap
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: isCollegeSelected ? "#64B4FF" : "rgba(255,255,255,0.5)" }}
                  />
                  <span className="flex-1">{collegeName}</span>
                  {depts.length > 0 && (
                    <div 
                      onClick={(e) => toggleCollege(e, collegeName)}
                      className="p-1 rounded-md hover:bg-white/10 transition-colors"
                    >
                      {expandedColleges[collegeName] ? (
                        <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                      )}
                    </div>
                  )}
                </button>

                {/* 학과 목록 — 토글 상태에 따라 렌더링 */}
                {showDepts && (
                  <div className="flex flex-col gap-0.5 mt-1 ml-5 pl-3"
                    style={{ borderLeft: "1px solid rgba(100,180,255,0.2)" }}>
                    {depts.map((dept) => {
                      const isDeptSelected = selectedDepartment === dept
                      const hasLink = !!DEPARTMENT_LINKS[dept]

                      return (
                        <div
                          key={dept}
                          className="group flex items-center justify-between rounded-[8px] pr-1 relative transition-all"
                          style={isDeptSelected ? { background: "rgba(100,180,255,0.12)" } : {}}
                          onMouseEnter={(e) => {
                            if (!isDeptSelected) e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                          }}
                          onMouseLeave={(e) => {
                            if (!isDeptSelected) e.currentTarget.style.background = "transparent"
                          }}
                        >
                          {/* 선택 표시 인디케이터 */}
                          {isDeptSelected && (
                            <span
                              className="absolute left-[-13px] top-1/2 -translate-y-1/2 w-[2px] h-[14px] rounded-full"
                              style={{ background: "#64B4FF" }}
                            />
                          )}

                          <button
                            onClick={() => {
                              if (isDeptSelected) {
                                // 학과 선택 해제 → 대학 레벨로 복귀
                                setSelectedDepartment(null)
                              } else {
                                // atomic: college + dept 동시 설정 (순서 꼬임 방지)
                                setCollegeAndDepartment(collegeName, dept)
                              }
                            }}
                            className="flex-1 text-left px-2 py-1.5 text-[12px] transition-colors"
                            style={{ color: isDeptSelected ? "var(--color-bone)" : "rgba(255,255,255,0.5)" }}
                          >
                            {dept}
                          </button>

                          {/* 외부 링크 아이콘 */}
                          {hasLink && (
                            <button
                              onClick={(e) => handleExternalLink(e, dept)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                              style={{ color: "var(--color-fog)" }}
                              title={`${dept} 홈페이지`}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-bone)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-fog)"}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

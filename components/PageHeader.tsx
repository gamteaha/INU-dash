"use client"

import { useDashboard } from "@/context/DashboardFilterContext"

interface PageHeaderProps {
  college?: string
  department?: string
  totalCourses: number
  onAiAnalysis: () => void
}

export default function PageHeader({
  college,
  department,
  totalCourses,
  onAiAnalysis,
}: PageHeaderProps) {
  const { setSelectedCollege, setSelectedDepartment, isLoading } = useDashboard()

  // Derive page title
  const pageTitle = department
    ? `${department} 교과목 대시보드`
    : college
    ? `${college} 교과목 대시보드`
    : "전체 교과목 대시보드"

  const filterLabel = department ?? college ?? "전체"
  const subtitle = isLoading
    ? `${filterLabel} | 데이터 로딩 중...`
    : `${filterLabel} | ${totalCourses.toLocaleString()}개 강좌`

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-chalk)] pb-6 mb-2">
      <div className="flex flex-col gap-2">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] font-normal text-[var(--color-slate)]">
          <button
            onClick={() => { setSelectedCollege(null); setSelectedDepartment(null) }}
            className="flex items-center gap-1 hover:text-[var(--color-signal-orange)] transition-colors"
          >
            <span>🏠 홈</span>
          </button>

          <span className="text-[var(--color-slate)]">/</span>

          {!college ? (
            <span className="text-[var(--color-carbon)] font-medium">전체 대시보드</span>
          ) : (
            <>
              {department ? (
                <button
                  onClick={() => { setSelectedCollege(college); setSelectedDepartment(null) }}
                  className="hover:text-[var(--color-signal-orange)] transition-colors"
                >
                  {college}
                </button>
              ) : (
                <span className="text-[var(--color-carbon)] font-medium">{college}</span>
              )}
            </>
          )}

          {department && (
            <>
              <span className="text-[var(--color-slate)]">/</span>
              <span className="text-[var(--color-carbon)] font-medium">{department}</span>
            </>
          )}
        </nav>

        {/* Page Title */}
        <h1
          className="text-[32px] font-normal tracking-[-0.64px] text-[var(--color-carbon)] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pageTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] font-normal text-[var(--color-slate)]">{subtitle}</p>
      </div>

      {/* AI Analysis Button - Filled Pill Button */}
      <button
        onClick={onAiAnalysis}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-[20px] bg-[var(--color-carbon)] hover:bg-[var(--color-graphite)] text-white text-[14px] font-medium shadow-[0_1px_3px_rgba(32,32,32,0.04)] whitespace-nowrap self-start sm:self-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-[#ff682c]">✨</span>
        AI 강의 분석
      </button>
    </div>
  )
}

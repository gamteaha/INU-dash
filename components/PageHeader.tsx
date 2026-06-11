"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

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
  const { isLoading } = useDashboard()

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
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
      <div className="flex flex-col gap-1">
        {/* Page Title */}
        <h1 className="text-[28px] font-medium tracking-tight text-[var(--color-paper)] leading-tight">
          {pageTitle}
        </h1>
        {/* Subtitle */}
        <p className="text-[14px] font-normal text-[var(--color-smoke)]">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 self-start sm:self-start">
        <ThemeToggle />
        <button
          onClick={onAiAnalysis}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-buttons)] bg-[var(--color-iron)]/60 backdrop-blur-md border border-[var(--color-bone)]/10 hover:bg-[var(--color-iron)] text-[var(--color-bone)] text-[14px] font-medium whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-indigo-haze)]" />
          AI 강의 분석
        </button>
      </div>
    </div>
  )
}

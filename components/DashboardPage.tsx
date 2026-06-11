"use client"

import { useState, useMemo } from "react"
import { useDashboard, extractDays, extractStartHour } from "@/context/DashboardFilterContext"
import { COLLEGE_HIERARCHY } from "@/lib/supabase/constants"
import KpiCards from "@/components/dashboard/KpiCards"
import CourseTypeCharts from "@/components/dashboard/CourseTypeCharts"
import DistributionCharts from "@/components/dashboard/DistributionCharts"
import TimeCharts from "@/components/dashboard/TimeCharts"
import CollegeSummaryTable from "@/components/dashboard/CollegeSummaryTable"
import CourseDetailTable from "@/components/dashboard/CourseDetailTable"
import PageHeader from "@/components/PageHeader"
import AiAnalysisModal from "@/components/AiAnalysisModal"
import { Loader2, X } from "lucide-react"

// ── Skeleton block ─────────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-[var(--color-fog)] animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--color-paper)] rounded-lg p-6 shadow-[var(--shadow-card)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-5 w-5 rounded-full" />
            </div>
            <SkeletonBlock className="h-10 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Chart rows skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-56" />
      </div>

      {/* College cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-32" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-[var(--color-paper)] rounded-lg p-6 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-8 w-48 rounded-lg" />
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <SkeletonBlock key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

// ── Filter badge ───────────────────────────────────────────────
function FilterBadge({
  label,
  onClear,
}: {
  label: string
  onClear: () => void
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] bg-[var(--color-fog)] text-[var(--color-signal-orange)] text-[12px] font-medium border border-[var(--color-chalk)]">
      <span>필터: {label}</span>
      <button
        onClick={onClear}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[var(--color-chalk)] transition-colors"
        aria-label="필터 초기화"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function DashboardPage() {
  const {
    filteredCourses,
    allCourses,
    selectedCollege,
    selectedDepartment,
    filterLabel,
    isLoading,
    fetchError,
    setSelectedCollege,
    setSelectedDepartment,
  } = useDashboard()

  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  const isFiltered = !!(selectedCollege || selectedDepartment)

  const handleClearFilter = () => {
    setSelectedCollege(null)
    setSelectedDepartment(null)
  }

  // ── Aggregations (재계산은 필터 변경 시에만) ────────────────
  const aggregated = useMemo(() => {
    const courses = filteredCourses

    let totalCapacity = 0
    let totalEnrolled = 0
    let englishLecturesCount = 0

    const courseTypeCount: Record<string, number> = {}
    const courseTypeEnrolled: Record<string, { sum: number; count: number }> = {}
    const teachingMethodCount: Record<string, number> = {}
    const creditCount: Record<string, number> = {}
    const dayCount: Record<string, number> = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0 }
    const timeSlotCount: Record<string, number> = {
      "오전 9-12시": 0,
      "12-15시": 0,
      "15-18시": 0,
      "18시 이후": 0,
    }
    const collegeStats: Record<string, { courses: number; enrolled: number; capacity: number }> = {}

    courses.forEach((course) => {
      const capacity = parseInt(course.정원 || "0", 10)
      const enrolled = parseInt(course.수강 || "0", 10)
      const credit = course.학점 || "0"

      totalCapacity += capacity
      totalEnrolled += enrolled

      if (course.원어강의 === "Y") englishLecturesCount++

      // 이수구분
      const ct = (course.이수구분 || "기타").trim()
      courseTypeCount[ct] = (courseTypeCount[ct] || 0) + 1
      if (!courseTypeEnrolled[ct]) courseTypeEnrolled[ct] = { sum: 0, count: 0 }
      courseTypeEnrolled[ct].sum += enrolled
      courseTypeEnrolled[ct].count += 1

      // 수업방법
      const method = (course.수업방법 || "대면수업").trim()
      teachingMethodCount[method] = (teachingMethodCount[method] || 0) + 1

      // 학점
      const creditKey = `${credit}학점`
      creditCount[creditKey] = (creditCount[creditKey] || 0) + 1

      // 요일
      const days = extractDays(course["시간표(교시)"] || "")
      days.forEach((day) => { if (day in dayCount) dayCount[day] += 1 })

      // 시간대
      const startHour = extractStartHour(course["시간표(시간)"] || "")
      if (startHour !== null) {
        if (startHour >= 9 && startHour < 12) timeSlotCount["오전 9-12시"] += 1
        else if (startHour >= 12 && startHour < 15) timeSlotCount["12-15시"] += 1
        else if (startHour >= 15 && startHour < 18) timeSlotCount["15-18시"] += 1
        else if (startHour >= 18) timeSlotCount["18시 이후"] += 1
      }

      // 대학별
      const collegeName = course["대학(원)"] || "기타"
      if (!collegeStats[collegeName]) {
        collegeStats[collegeName] = { courses: 0, enrolled: 0, capacity: 0 }
      }
      collegeStats[collegeName].courses += 1
      collegeStats[collegeName].enrolled += enrolled
      collegeStats[collegeName].capacity += capacity
    })

    const byCourseTypeCount = Object.entries(courseTypeCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7)

    const byCourseTypeAvgEnroll = Object.entries(courseTypeEnrolled)
      .map(([name, s]) => ({ name, value: s.count > 0 ? s.sum / s.count : 0 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7)

    const totalMethods = Object.values(teachingMethodCount).reduce((a, b) => a + b, 0)
    const teachingMethodData = Object.entries(teachingMethodCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
        percent: totalMethods > 0 ? (value / totalMethods) * 100 : 0,
      }))

    const totalCredits = Object.values(creditCount).reduce((a, b) => a + b, 0)
    const creditData = Object.entries(creditCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
        percent: totalCredits > 0 ? (value / totalCredits) * 100 : 0,
      }))

    const DAY_ORDER = ["월", "화", "수", "목", "금", "토"]
    const dayData = DAY_ORDER.map((day) => ({ name: day, value: dayCount[day] || 0 }))
    const timeSlotData = Object.entries(timeSlotCount).map(([name, value]) => ({ name, value }))

    const collegeSummary = COLLEGE_HIERARCHY.map((h, idx) => {
      const dbNames = h.dbColleges
      let courseCount = 0
      let enrolledSum = 0
      let capacitySum = 0
      dbNames.forEach((db) => {
        const s = collegeStats[db]
        if (s) {
          courseCount += s.courses
          enrolledSum += s.enrolled
          capacitySum += s.capacity
        }
      })
      return {
        rank: idx + 1,
        name: h.college,
        courseCount,
        totalEnrolled: enrolledSum,
        avgEnrollRate: capacitySum > 0 ? (enrolledSum / capacitySum) * 100 : 0,
      }
    })
      .filter((r) => r.courseCount > 0)
      .sort((a, b) => b.courseCount - a.courseCount)
      .map((r, idx) => ({ ...r, rank: idx + 1 }))

    const aiStats = {
      totalCourses: courses.length,
      totalCapacity,
      totalEnrolled,
      englishLecturesCount,
      byCourseTypeCount,
      byCourseTypeAvgEnroll,
      teachingMethodData,
      creditData,
      dayData,
      timeSlotData,
    }

    return {
      totalCapacity,
      totalEnrolled,
      englishLecturesCount,
      byCourseTypeCount,
      byCourseTypeAvgEnroll,
      teachingMethodData,
      creditData,
      dayData,
      timeSlotData,
      collegeSummary,
      aiStats,
    }
  }, [filteredCourses])

  const totalCourses = filteredCourses.length
  const college = selectedCollege ?? undefined
  const department = selectedDepartment ?? undefined

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto w-full">
      {/* Page Header */}
      <PageHeader
        college={college}
        department={department}
        totalCourses={isLoading ? 0 : totalCourses}
        onAiAnalysis={() => setIsAiModalOpen(true)}
      />

      {/* Filter Badge */}
      {isFiltered && !isLoading && (
        <div className="flex items-center gap-2">
          <FilterBadge label={filterLabel} onClear={handleClearFilter} />
        </div>
      )}

      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm">
          ⚠️ <strong>데이터 로드 경고:</strong> {fetchError}
        </div>
      )}

      {/* Loading state: skeleton or content */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* KPI Cards */}
          <KpiCards
            totalCourses={totalCourses}
            totalCapacity={aggregated.totalCapacity}
            totalEnrolled={aggregated.totalEnrolled}
            englishLecturesCount={aggregated.englishLecturesCount}
          />

          {/* 이수구분별 강좌 수 + 평균 수강인원 */}
          <CourseTypeCharts
            byCourseTypeCount={aggregated.byCourseTypeCount}
            byCourseTypeAvgEnroll={aggregated.byCourseTypeAvgEnroll}
          />

          {/* 수업방법 유형 분포 + 학점 구성 비율 */}
          <DistributionCharts
            teachingMethodData={aggregated.teachingMethodData}
            creditData={aggregated.creditData}
            totalCourses={totalCourses}
          />

          {/* 요일별 + 수업 시간별 강좌 수 */}
          <TimeCharts
            dayData={aggregated.dayData}
            timeSlotData={aggregated.timeSlotData}
          />

          {/* 대학(원)별 강좌 분석 요약 (학과 선택 시 숨김) */}
          {!selectedDepartment && (
            <CollegeSummaryTable data={aggregated.collegeSummary} />
          )}

          {/* 상세 강좌 정보 테이블 */}
          <CourseDetailTable courses={filteredCourses} />
        </>
      )}

      {/* AI 강의 분석 모달 */}
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        target={filterLabel}
        stats={aggregated.aiStats}
      />
    </div>
  )
}

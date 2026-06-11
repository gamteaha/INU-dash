"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDashboard } from "@/context/DashboardFilterContext"
import {
  processKpiStats,
  processCourseTypeStats,
  processDistributionStats,
  processTimeStats,
  processCollegeSummary,
  processDepartmentSummary,
  processGradeSummary,
} from "@/lib/utils/courseStats"
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"
import KpiCards from "@/components/dashboard/KpiCards"
import CourseTypeCharts from "@/components/dashboard/CourseTypeCharts"
import DistributionCharts from "@/components/dashboard/DistributionCharts"
import TimeCharts from "@/components/dashboard/TimeCharts"
import CollegeSummaryTable from "@/components/dashboard/CollegeSummaryTable"
import CourseDetailTable from "@/components/dashboard/CourseDetailTable"
import AiAnalysisModal from "@/components/AiAnalysisModal"
import MascotBanner from "@/components/dashboard/MascotBanner"
import Breadcrumb from "@/components/dashboard/Breadcrumb"
import PageHeader from "@/components/PageHeader"
import CampusMap from "@/components/CampusMap"
import { X } from "lucide-react"

export default function DashboardPage() {
  const {
    filteredCourses,
    isLoading,
    fetchError,
    selectedCollege,
    selectedDepartment,
    filterLabel,
  } = useDashboard()

  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  // Process data for components
  const kpiStats = useMemo(() => processKpiStats(filteredCourses), [filteredCourses])
  const courseTypeStats = useMemo(() => processCourseTypeStats(filteredCourses), [filteredCourses])
  const distributionStats = useMemo(() => processDistributionStats(filteredCourses), [filteredCourses])
  const timeStats = useMemo(() => processTimeStats(filteredCourses), [filteredCourses])

  // Context-specific dynamic summary
  const dynamicSummary = useMemo(() => {
    if (selectedDepartment) return processGradeSummary(filteredCourses)
    if (selectedCollege && selectedCollege !== "대학전체") return processDepartmentSummary(filteredCourses)
    return processCollegeSummary(filteredCourses)
  }, [filteredCourses, selectedCollege, selectedDepartment])

  const summaryTitle = selectedDepartment
    ? "학년별 강좌 분석 요약"
    : selectedCollege && selectedCollege !== "대학전체"
    ? "학과별 강좌 분석 요약"
    : "대학(원)별 강좌 분석 요약"

  // AI analysis stats payload
  const aiStats = useMemo(() => ({
    totalCourses: kpiStats.totalCourses,
    totalEnrolled: kpiStats.totalEnrolled,
    avgEnrollRate: kpiStats.totalCapacity > 0 ? ((kpiStats.totalEnrolled / kpiStats.totalCapacity) * 100).toFixed(1) : "0",
    englishRate: kpiStats.totalCourses > 0 ? ((kpiStats.englishLecturesCount / kpiStats.totalCourses) * 100).toFixed(1) : "0",
    byCourseType: courseTypeStats.byCourseTypeCount,
    byDay: timeStats.dayData,
  }), [kpiStats, courseTypeStats, timeStats])

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-mist)] gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <X className="w-6 h-6" />
        </div>
        <p className="text-[16px]">데이터를 불러오지 못했습니다.</p>
        <p className="text-[14px] text-[var(--color-smoke)]">{fetchError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 relative">

      {/* Page Title + AI Button */}
      <PageHeader
        college={selectedCollege ?? undefined}
        department={selectedDepartment ?? undefined}
        totalCourses={kpiStats.totalCourses}
        onAiAnalysis={() => setIsAiModalOpen(true)}
      />

      {/* 1. Breadcrumb */}
      <Breadcrumb />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCollege ?? "all"}-${selectedDepartment ?? "none"}`}
            className="flex flex-col gap-[80px]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >

          {/* Hero Banner */}
          <MascotBanner />

          {/* 2. KPI Cards */}
          <KpiCards
            totalCourses={kpiStats.totalCourses}
            totalCapacity={kpiStats.totalCapacity}
            totalEnrolled={kpiStats.totalEnrolled}
            englishLecturesCount={kpiStats.englishLecturesCount}
          />

          {/* 캠퍼스 맵 */}
          <CampusMap />

          {/* 3. 이수구분별 차트 */}
          <CourseTypeCharts
            byCourseTypeCount={courseTypeStats.byCourseTypeCount}
            byCourseTypeAvgEnroll={courseTypeStats.byCourseTypeAvgEnroll}
          />

          {/* 4. 수업방법 / 학점 분포 차트 */}
          <DistributionCharts
            teachingMethodData={distributionStats.teachingMethodData}
            creditData={distributionStats.creditData}
            totalCourses={kpiStats.totalCourses}
          />

          {/* 5. 요일 / 시간대 차트 */}
          <TimeCharts
            dayData={timeStats.dayData}
            timeSlotData={timeStats.timeSlotData}
          />

          {/* 6. 데이터 테이블 */}
          <div className="flex flex-col gap-8">
            <CollegeSummaryTable title={summaryTitle} data={dynamicSummary} />
            <CourseDetailTable courses={filteredCourses} />
          </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* AI 강의 분석 모달 */}
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        target={filterLabel}
        stats={aiStats}
      />
    </div>
  )
}

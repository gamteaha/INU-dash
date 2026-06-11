"use client"

import { useState } from "react"
import PageHeader from "@/components/PageHeader"
import AiAnalysisModal from "@/components/AiAnalysisModal"

interface DashboardClientProps {
  college?: string
  department?: string
  totalCourses: number
  stats: any
}

export default function DashboardClient({
  college,
  department,
  totalCourses,
  stats,
}: DashboardClientProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  const handleAiAnalysis = () => {
    setIsAiModalOpen(true)
  }

  const target = department || college || "전체"

  return (
    <>
      <PageHeader
        college={college}
        department={department}
        totalCourses={totalCourses}
        onAiAnalysis={handleAiAnalysis}
      />
      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        target={target}
        stats={stats}
      />
    </>
  )
}

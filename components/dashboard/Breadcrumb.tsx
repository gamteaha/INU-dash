"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb() {
  const { selectedCollege, selectedDepartment } = useDashboard()

  return (
    <div className="flex items-center gap-2 text-[14px] font-bold text-blue-900/60 mb-6 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/50 shadow-[2px_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
        <Home className="w-4 h-4" />
        <span>홈</span>
      </div>
      
      {selectedCollege && (
        <>
          <ChevronRight className="w-4 h-4 text-blue-900/30" />
          <span className={`${!selectedDepartment ? "text-blue-900" : "hover:text-blue-600 cursor-pointer transition-colors"}`}>
            {selectedCollege}
          </span>
        </>
      )}

      {selectedDepartment && (
        <>
          <ChevronRight className="w-4 h-4 text-blue-900/30" />
          <span className="text-blue-900">
            {selectedDepartment}
          </span>
        </>
      )}
    </div>
  )
}

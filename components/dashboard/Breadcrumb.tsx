"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumb() {
  const { selectedCollege, selectedDepartment, setSelectedCollege, setSelectedDepartment } = useDashboard()

  const handleHomeClick = () => {
    setSelectedCollege(null)
    setSelectedDepartment(null)
  }

  const handleCollegeClick = () => {
    setSelectedDepartment(null)
  }

  return (
    <nav className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-mist)] bg-[var(--color-char)]/50 backdrop-blur-md px-4 py-2.5 rounded-[var(--radius-inputs)] border border-[var(--color-bone)]/5 w-fit">
      <button 
        onClick={handleHomeClick}
        className="flex items-center gap-1.5 hover:text-[var(--color-bone)] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>홈</span>
      </button>
      
      {selectedCollege && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-smoke)]" />
          <button 
            onClick={handleCollegeClick}
            className={`hover:text-[var(--color-bone)] transition-colors ${!selectedDepartment ? "text-[var(--color-bone)] font-semibold" : ""}`}
          >
            {selectedCollege}
          </button>
        </>
      )}

      {selectedCollege && selectedDepartment && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--color-smoke)]" />
          <span className="text-[var(--color-bone)] font-semibold">
            {selectedDepartment}
          </span>
        </>
      )}
    </nav>
  )
}

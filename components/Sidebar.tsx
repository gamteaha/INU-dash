"use client"

import { useState } from "react"
import { LayoutDashboard, GraduationCap, X, Menu } from "lucide-react"
import { COLLEGE_HIERARCHY } from "@/lib/supabase/constants"
import { useDashboard } from "@/context/DashboardFilterContext"

interface SidebarProps {
  className?: string
}

function SidebarContent({
  onClose,
  collapsed,
}: {
  onClose?: () => void
  collapsed?: boolean
}) {
  const { selectedCollege, selectedDepartment, setSelectedCollege, setSelectedDepartment } =
    useDashboard()

  const isAllDashboardActive = !selectedCollege && !selectedDepartment

  const handleCollegeClick = (college: string) => {
    if (selectedCollege === college && !selectedDepartment) {
      setSelectedCollege(null)
    } else {
      setSelectedCollege(college)
    }
    onClose?.()
  }

  const handleDeptClick = (college: string, dept: string) => {
    if (selectedCollege === college && selectedDepartment === dept) {
      setSelectedCollege(college)
      setSelectedDepartment(null)
    } else {
      setSelectedCollege(college)
      setSelectedDepartment(dept)
    }
    onClose?.()
  }

  const handleHomeClick = () => {
    setSelectedCollege(null)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-white/60 shadow-[5px_0_15px_rgba(0,75,155,0.05)]">
      {/* Header Logo */}
      <div className="h-20 flex items-center px-6 border-b border-blue-900/10 shrink-0 gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[2px_2px_10px_rgba(0,75,155,0.2)] flex items-center justify-center">
          <span className="text-xl text-white">🎓</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[14px] text-blue-900 uppercase tracking-widest truncate">
              INCHEON NATL UNIV
            </span>
            <span className="text-[12px] font-medium text-blue-600/80">
              대시보드 2026-1
            </span>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors lg:hidden shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* All Dashboard */}
        <div>
          <button
            onClick={handleHomeClick}
            title="전체 대시보드"
            className={`flex items-center w-full px-4 py-3 text-[14px] font-bold rounded-full transition-all duration-200 gap-3 ${
              isAllDashboardActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_10px_rgba(0,75,155,0.3)]"
                : "bg-white/50 text-blue-900 border border-white/60 shadow-[2px_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.06)] hover:bg-white/80"
            } ${collapsed ? "justify-center px-0" : ""}`}
          >
            <LayoutDashboard className={`h-5 w-5 shrink-0 ${isAllDashboardActive ? "text-white" : "text-blue-600"}`} />
            {!collapsed && <span>전체 대시보드</span>}
          </button>
        </div>

        {/* College List (Always 100% expanded) */}
        {!collapsed && (
          <div className="space-y-3">
            <span className="block px-4 pt-2 pb-1 text-[12px] font-extrabold uppercase tracking-widest text-blue-400">
              단과대학 / 학부
            </span>
            <div className="space-y-4 mt-2">
              {COLLEGE_HIERARCHY.map((item) => {
                const isCollegeSelected = selectedCollege === item.college && !selectedDepartment

                return (
                  <div key={item.college} className="space-y-2">
                    {/* College Group Header */}
                    <button
                      className={`flex items-center w-full px-4 py-2 text-[13px] font-extrabold rounded-full transition-all duration-200 ${
                        isCollegeSelected
                          ? "bg-blue-100/80 text-blue-800 border border-blue-200 shadow-inner"
                          : "bg-transparent text-blue-900 hover:bg-blue-50/50"
                      }`}
                      onClick={() => handleCollegeClick(item.college)}
                    >
                      {item.college}
                    </button>

                    {/* Departments (Always Open) */}
                    <div className="space-y-1.5 px-3">
                      {item.departments.map((dept) => {
                        const isDeptSelected =
                          selectedCollege === item.college && selectedDepartment === dept
                        return (
                          <button
                            key={dept}
                            onClick={() => handleDeptClick(item.college, dept)}
                            className={`block w-full text-[12px] text-left transition-all duration-200 px-4 py-2 rounded-full ${
                              isDeptSelected
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_3px_8px_rgba(0,75,155,0.25)] font-bold"
                                : "bg-white/40 text-blue-700/80 border border-white/50 shadow-[1px_1px_4px_rgba(0,0,0,0.02)] hover:bg-white hover:text-blue-900 hover:shadow-[2px_2px_8px_rgba(0,0,0,0.05)] font-medium"
                            }`}
                          >
                            <span className="truncate block">{dept}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Collapsed: icon-only college list */}
        {collapsed && (
          <div className="space-y-2 mt-4 px-1">
            {COLLEGE_HIERARCHY.map((item) => {
              const isCollegeSelected = selectedCollege === item.college

              return (
                <button
                  key={item.college}
                  onClick={() => handleCollegeClick(item.college)}
                  title={item.college}
                  className={`flex items-center justify-center w-full py-3 rounded-full transition-all duration-200 ${
                    isCollegeSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_10px_rgba(0,75,155,0.3)]"
                      : "bg-white/50 text-blue-600 border border-white/60 shadow-[2px_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.06)] hover:bg-white/80"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-blue-900/10 z-40 flex items-center px-4 shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 rounded-full text-blue-900 hover:bg-blue-100 transition-colors shadow-sm"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-3 font-extrabold text-[15px] text-blue-900 tracking-wider">INU 대시보드</span>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className || ""}`}
      >
        <SidebarContent onClose={() => setIsOpen(false)} />
      </aside>
    </>
  )
}

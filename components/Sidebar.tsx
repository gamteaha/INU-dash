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
    <div className="flex flex-col h-full bg-[var(--color-paper)]">
      {/* Header Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[var(--color-chalk)] bg-[var(--color-paper)] shrink-0 gap-2">
        <span className="text-xl">🎓</span>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[11px] text-[var(--color-slate)] uppercase tracking-[0.08em] truncate">
              INCHEON NATL UNIV
            </span>
            <span className="text-[11px] font-normal text-[var(--color-slate)]">
              2026-1 Course Dashboard
            </span>
          </div>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-full text-[var(--color-slate)] hover:bg-[var(--color-fog)] transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 py-4 px-2 space-y-4 overflow-y-auto">
        {/* All Dashboard */}
        <div className="px-2">
          <button
            onClick={handleHomeClick}
            title="전체 대시보드"
            className={`flex items-center w-full px-3 py-2 text-[13px] font-medium rounded-[6px] transition-all duration-150 gap-2 ${
              isAllDashboardActive
                ? "bg-[var(--color-carbon)] text-white"
                : "text-[var(--color-carbon)] hover:bg-[var(--color-fog)]"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <LayoutDashboard className={`h-4 w-4 shrink-0 ${isAllDashboardActive ? "text-white" : "text-[var(--color-carbon)]"}`} />
            {!collapsed && <span>전체 대시보드</span>}
          </button>
        </div>

        {/* College Accordion */}
        {!collapsed && (
          <div className="space-y-1">
            <span className="block px-4 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-slate)]">
              대학 / 학부
            </span>
            <div className="space-y-1.5 mt-2">
              {COLLEGE_HIERARCHY.map((item) => {
                const isCollegeSelected = selectedCollege === item.college && !selectedDepartment

                return (
                  <div key={item.college} className="space-y-1">
                    {/* College Group Header */}
                    <div
                      className={`flex items-center justify-between w-full py-2 pb-1 border-l-2 cursor-pointer transition-all duration-150 ${
                        isCollegeSelected
                          ? "bg-[var(--color-fog)] border-[var(--color-signal-orange)] text-[var(--color-carbon)] font-semibold"
                          : "border-transparent text-[var(--color-carbon)] hover:bg-[var(--color-fog)] hover:border-[var(--color-signal-orange)]"
                      }`}
                      onClick={() => handleCollegeClick(item.college)}
                    >
                      <button
                        className="flex-1 text-[12px] font-semibold text-left px-4"
                      >
                        {item.college}
                      </button>
                    </div>

                    {/* Always Open/Expanded */}
                    <div className="space-y-0.5 mt-0.5">
                      {item.departments.map((dept) => {
                        const isDeptSelected =
                          selectedCollege === item.college && selectedDepartment === dept
                        return (
                          <button
                            key={dept}
                            onClick={() => handleDeptClick(item.college, dept)}
                            className={`block w-full text-[12px] text-left transition-all duration-150 pl-7 pr-4 py-1 border-l-2 ${
                              isDeptSelected
                                ? "bg-[var(--color-fog)] text-[var(--color-carbon)] font-semibold border-[var(--color-signal-orange)]"
                                : "border-transparent text-[var(--color-graphite)] hover:bg-[var(--color-fog)] hover:border-[var(--color-signal-orange)] hover:text-[var(--color-carbon)]"
                            }`}
                          >
                            {dept}
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
          <div className="space-y-1.5 mt-2 px-1">
            {COLLEGE_HIERARCHY.map((item) => {
              const isCollegeSelected = selectedCollege === item.college
              const abbr = item.college.slice(0, 2)
              return (
                <button
                  key={item.college}
                  onClick={() => handleCollegeClick(item.college)}
                  title={item.college}
                  className={`flex items-center justify-center w-full py-2 rounded-[6px] text-[10px] font-semibold transition-all duration-150 ${
                    isCollegeSelected
                      ? "bg-[var(--color-carbon)] text-white"
                      : "text-[var(--color-slate)] hover:bg-[var(--color-fog)]"
                  }`}
                >
                  {abbr}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Mobile Top Bar (< md) ─────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--color-paper)] border-b border-[var(--color-chalk)] flex items-center px-4 gap-3 shadow-none">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-full text-[var(--color-slate)] hover:bg-[var(--color-fog)] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-xl">🎓</span>
        <span className="font-semibold text-[11px] text-[var(--color-carbon)] uppercase tracking-wider">
          INU Course Dashboard
        </span>
      </div>

      {/* ── Mobile Overlay Drawer (< md) ──────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-[220px] bg-[var(--color-paper)] h-full flex flex-col shadow-none overflow-y-auto">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Tablet Collapsed Sidebar (md ~ lg) ────────────── */}
      <aside className="hidden md:flex lg:hidden w-[64px] min-w-[64px] bg-[var(--color-paper)] border-r border-[var(--color-chalk)] flex-col h-screen sticky top-0 overflow-y-auto select-none shadow-none">
        <SidebarContent collapsed />
      </aside>

      {/* ── Desktop Full Sidebar (≥ lg) ───────────────────── */}
      <aside
        className={`hidden lg:flex w-[220px] min-w-[220px] bg-[var(--color-paper)] border-r border-[var(--color-chalk)] flex-col h-screen sticky top-0 overflow-y-auto select-none shadow-none ${className}`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

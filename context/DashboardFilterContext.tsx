"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { COLLEGE_HIERARCHY } from "@/lib/supabase/constants"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────
export interface Course {
  순번: string
  학기: string
  "대학(원)": string
  "학과(부)": string
  학년: string
  이수구분: string
  이수영역: string
  학수번호: string
  교과목명: string
  담당교수: string
  강의실: string
  "시간표(교시)": string
  "시간표(시간)": string
  학점: string
  정원: string
  수강: string
  "수강(남)": string
  "수강(여)": string
  원어강의: string
  수업방법: string | null
}

interface DashboardFilterContextValue {
  // Filter state
  selectedCollege: string | null
  selectedDepartment: string | null
  setSelectedCollege: (college: string | null) => void
  setSelectedDepartment: (dept: string | null) => void
  filterLabel: string

  // Raw/Filtered data
  allCourses: Course[]
  filteredCourses: Course[]
  isLoading: boolean
  fetchError: string | null
}

// ── Helpers ───────────────────────────────────────────────────
export function extractDays(schedule: string): string[] {
  const DAY_CHARS = ["월", "화", "수", "목", "금", "토", "일"]
  const found = new Set<string>()
  for (const day of DAY_CHARS) {
    if (schedule.includes(day)) found.add(day)
  }
  return Array.from(found)
}

export function extractStartHour(timeStr: string): number | null {
  const match = timeStr.match(/\((\d{2}):\d{2}~/)
  if (match) return parseInt(match[1], 10)
  return null
}

// ── Context ───────────────────────────────────────────────────
export const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(null)

export function useDashboard(): DashboardFilterContextValue {
  const ctx = useContext(DashboardFilterContext)
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardFilterProvider")
  }
  return ctx
}

// Alias to match DashboardFilterContext name if preferred
export const useDashboardFilter = useDashboard

// ── Provider ──────────────────────────────────────────────────
export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCollege, setSelectedCollegeState] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartmentState] = useState<string | null>(null)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Fetch courses dynamically whenever filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true)
      setFetchError(null)
      const supabase = createClient()
      let fetchedData: Course[] = []
      let from = 0
      const step = 1000

      while (true) {
        let query = supabase
          .from("종합강의시간표_1학기_전체.csv")
          .select("*")
          .eq("학기", "2026년 1학기")

        // Apply filters on database query level
        if (selectedDepartment) {
          query = query.eq("학과(부)", selectedDepartment)
        } else if (selectedCollege) {
          const config = COLLEGE_HIERARCHY.find((h) => h.college === selectedCollege)
          if (config) {
            query = query.in("대학(원)", config.dbColleges)
          }
        }

        const { data, error } = await query.range(from, from + step - 1)

        if (error) {
          console.error("❌ Supabase fetch error:", error)
          setFetchError(error.message)
          break
        }

        if (data && data.length > 0) {
          fetchedData = [...fetchedData, ...(data as Course[])]
        }
        if (!data || data.length < step) break
        from += step
      }

      // Base filter: valid course name, no summary rows
      const base = fetchedData.filter((c) => {
        const hasName = c.교과목명 && c.교과목명.trim() !== ""
        const isSummary = c.교과목명?.includes("총건수") || c.순번?.includes("총건수")
        return hasName && !isSummary
      })

      setAllCourses(base)
      setIsLoading(false)
    }

    fetchFiltered()
  }, [selectedCollege, selectedDepartment])

  // Setters that also reset child state
  const setSelectedCollege = useCallback((college: string | null) => {
    setSelectedCollegeState(college)
    setSelectedDepartmentState(null)
  }, [])

  const setSelectedDepartment = useCallback((dept: string | null) => {
    setSelectedDepartmentState(dept)
  }, [])

  // Since we query-filter on the server, filteredCourses is the same as allCourses
  const filteredCourses = allCourses

  // Derived: human-readable label
  const filterLabel = selectedDepartment ?? selectedCollege ?? "전체"

  return (
    <DashboardFilterContext.Provider
      value={{
        selectedCollege,
        selectedDepartment,
        setSelectedCollege,
        setSelectedDepartment,
        filterLabel,
        allCourses,
        filteredCourses,
        isLoading,
        fetchError,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  )
}

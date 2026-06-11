"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import {
  COLLEGE_HIERARCHY,
  COLLEGE_ORDER,
  mapCollegeName,
} from "@/lib/supabase/constants"
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
  selectedCollege: string | null      // null = 대학전체
  selectedDepartment: string | null
  setSelectedCollege: (college: string | null) => void
  setSelectedDepartment: (dept: string | null) => void
  filterLabel: string

  // Data
  allCourses: Course[]        // 전체 원본 (대학전체 기준)
  filteredCourses: Course[]   // 현재 필터 적용된 데이터

  // 현재 선택 대학의 학과 목록 (동적, 맵핑 적용 후)
  departmentsByCollege: Record<string, string[]>

  isLoading: boolean
  fetchError: string | null
}

// ── Schedule helpers ───────────────────────────────────────────
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
  if (!ctx) throw new Error("useDashboard must be used inside DashboardFilterProvider")
  return ctx
}

export const useDashboardFilter = useDashboard

// ── Provider ──────────────────────────────────────────────────
export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  // null = 대학전체
  const [selectedCollege, setSelectedCollegeState] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartmentState] = useState<string | null>(null)

  // 전체 원본 데이터 (최초 1회 로드 후 캐시)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // ── 전체 데이터 1회 fetch (대학전체 기준, 필터 없음) ──────────
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true)
      setFetchError(null)
      const supabase = createClient()
      let fetched: Course[] = []
      let from = 0
      const step = 1000

      while (true) {
        const { data, error } = await supabase
          .from("종합강의시간표_1학기_전체.csv")
          .select("*")
          .eq("학기", "2026년 1학기")
          .range(from, from + step - 1)

        if (error) {
          console.error("❌ Supabase fetch error:", error)
          setFetchError(error.message)
          break
        }

        if (data && data.length > 0) fetched = [...fetched, ...(data as Course[])]
        if (!data || data.length < step) break
        from += step
      }

      // 기본 필터: 유효한 교과목명만
      const valid = fetched.filter((c) => {
        const hasName = c.교과목명?.trim() !== ""
        const isSummary = c.교과목명?.includes("총건수") || c.순번?.includes("총건수")
        return hasName && !isSummary
      })

      setAllCourses(valid)
      setIsLoading(false)
    }

    fetchAll()
  }, []) // 최초 1회만 실행

  // ── 클라이언트 사이드 필터링 ────────────────────────────────
  const filteredCourses = useMemo(() => {
    // 대학전체: 모든 데이터 반환 (교직/일선/군사학/기타 포함)
    if (!selectedCollege) return allCourses

    // 특정 학과 선택
    if (selectedDepartment) {
      return allCourses.filter((c) => {
        const mappedCollege = mapCollegeName(c["대학(원)"])
        return (
          mappedCollege === selectedCollege &&
          c["학과(부)"] === selectedDepartment
        )
      })
    }

    // 특정 대학 선택
    return allCourses.filter((c) => {
      return mapCollegeName(c["대학(원)"]) === selectedCollege
    })
  }, [allCourses, selectedCollege, selectedDepartment])

  // ── 전체 대학의 학과 목록 (동적 추출, 맵핑 적용 후) ──
  const departmentsByCollege = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    COLLEGE_ORDER.forEach(c => map[c] = new Set())

    allCourses.forEach((c) => {
      const col = mapCollegeName(c["대학(원)"])
      const dept = c["학과(부)"]?.trim()
      if (col && map[col] && dept) {
        map[col].add(dept)
      }
    })

    const result: Record<string, string[]> = {}
    COLLEGE_ORDER.forEach(college => {
      const hierarchyDepts = COLLEGE_HIERARCHY.find(h => h.college === college)?.departments ?? []
      const ordered: string[] = []
      hierarchyDepts.forEach(d => { if (map[college].has(d)) ordered.push(d) })
      map[college].forEach(d => { if (!ordered.includes(d)) ordered.push(d) })
      result[college] = ordered
    })

    return result
  }, [allCourses])

  // ── Setters ─────────────────────────────────────────────────
  const setSelectedCollege = useCallback((college: string | null) => {
    setSelectedCollegeState(college)
    setSelectedDepartmentState(null)
  }, [])

  const setSelectedDepartment = useCallback((dept: string | null) => {
    setSelectedDepartmentState(dept)
  }, [])

  const filterLabel = selectedDepartment ?? selectedCollege ?? "대학전체"

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
        departmentsByCollege,
        isLoading,
        fetchError,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  )
}

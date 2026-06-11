"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"

interface Course {
  순번: string
  교과목명: string
  "대학(원)": string
  "학과(부)": string
  이수구분: string
  수업방법: string | null
  학점: string
  담당교수: string
  "시간표(교시)": string
  수강: string
  정원: string
}

interface CourseDetailTableProps {
  courses: Course[]
}

const ITEMS_PER_PAGE = 20

// ── Text highlight helper ─────────────────────────────────────
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  // Escape special regex chars in query to avoid errors
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escaped})`, "gi")
  return text.replace(
    regex,
    '<mark style="background:rgba(59,130,246,0.15);color:#2563EB;border-radius:2px;padding:0 2px;font-weight:700;">$1</mark>'
  )
}

// ── Highlighted cell ──────────────────────────────────────────
function Hl({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  return (
    <span
      dangerouslySetInnerHTML={{ __html: highlightText(text, query) }}
    />
  )
}

// ── Pagination helper ─────────────────────────────────────────
function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages)
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
  }
  return pages
}

// ── Main component ────────────────────────────────────────────
export default function CourseDetailTable({ courses }: CourseDetailTableProps) {
  const [inputValue, setInputValue] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 300 ms debounce
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val)
      setCurrentPage(1)
    }, 300)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  // Reset page when external courses change (filter switch)
  useEffect(() => {
    setCurrentPage(1)
    setInputValue("")
    setDebouncedQuery("")
  }, [courses])

  // Filter: 강좌명 OR 교수명 OR 학과명 (OR)
  const query = debouncedQuery.toLowerCase().trim()
  const filtered = query
    ? courses.filter((c) =>
        (c.교과목명 || "").toLowerCase().includes(query) ||
        (c.담당교수 || "").toLowerCase().includes(query) ||
        (c["학과(부)"] || "").toLowerCase().includes(query)
      )
    : courses

  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
  const currentData = filtered.slice(startIndex, endIndex)
  const pageNumbers = getPageNumbers(safePage, totalPages)

  const isSearching = debouncedQuery.trim().length > 0

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[5px_5px_20px_rgba(0,75,155,0.08)] border border-white/60 flex flex-col gap-6 w-full min-w-0 overflow-hidden relative">
      {/* Decorative gradient orb */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-extrabold text-blue-900 flex items-center gap-2 px-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            상세 강좌 정보
            <span className="text-[12px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {totalItems.toLocaleString()}건
            </span>
          </h3>
          <span className="text-[12px] font-medium text-blue-900/50 pl-1">
            총 {totalItems.toLocaleString()}개 중{" "}
            {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}번째 표시
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-400" />
          </div>
          <input
            id="course-search"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="강좌명, 교수명, 학과명 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-blue-100 rounded-full text-[13px] text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-[inset_1px_1px_4px_rgba(0,0,0,0.02)]"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* ── Table Container ─────────────────────────────────── */}
      <div className="overflow-x-auto w-full custom-scrollbar rounded-xl border border-blue-900/10 shadow-inner bg-white/40 relative z-10">
        {totalItems === 0 ? (
          <div className="py-16 text-center text-blue-400 text-[13px] font-medium">
            {isSearching ? "검색 결과가 없습니다." : "해당하는 강좌가 없습니다."}
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="bg-blue-50/80 border-b border-blue-100 text-blue-900/70 text-[12px] font-extrabold uppercase tracking-wider">
                <th className="py-3 px-4 font-extrabold text-center w-16">순번</th>
                <th className="py-3 px-4 font-extrabold">교과목명</th>
                <th className="py-3 px-4 font-extrabold">대학(원)</th>
                <th className="py-3 px-4 font-extrabold">학과(부)</th>
                <th className="py-3 px-4 font-extrabold w-24">이수구분</th>
                <th className="py-3 px-4 font-extrabold w-24 text-center">수업방법</th>
                <th className="py-3 px-4 font-extrabold w-16 text-center">학점</th>
                <th className="py-3 px-4 font-extrabold w-24">담당교수</th>
                <th className="py-3 px-4 font-extrabold">시간표</th>
                <th className="py-3 px-4 font-extrabold w-16 text-right">수강</th>
                <th className="py-3 px-4 font-extrabold w-16 text-right">정원</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/5 text-[13px] text-blue-900">
              {currentData.map((course, idx) => {
                const globalIndex = startIndex + idx + 1
                return (
                  <tr
                    key={`${course.순번}-${idx}`}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="py-2.5 px-4 text-center text-blue-400/80 text-[12px] font-mono">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-blue-800 truncate max-w-[240px]" title={course.교과목명}>
                      <Hl text={course.교과목명} query={debouncedQuery} />
                    </td>
                    <td className="py-2.5 px-4 text-blue-600/80">{course["대학(원)"]}</td>
                    <td className="py-2.5 px-4 text-blue-600/80">{course["학과(부)"]}</td>
                    <td className="py-2.5 px-4">
                      <span className="bg-white border border-blue-100 px-2 py-0.5 rounded text-[11px] text-blue-600 shadow-sm font-semibold">
                        {course.이수구분}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-blue-500/80 text-[12px] font-medium">
                        {course.수업방법 || "-"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-blue-700">
                      {course.학점}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-blue-700 truncate max-w-[120px]" title={course.담당교수}>
                      <Hl text={course.담당교수} query={debouncedQuery} />
                    </td>
                    <td className="py-2.5 px-4 truncate max-w-[200px] text-blue-600/80 text-[12px]" title={course["시간표(교시)"]}>
                      {course["시간표(교시)"]}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-blue-800">
                      {course.수강}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-blue-400/80">
                      {course.정원}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-full border border-blue-200 text-blue-600 bg-white/50 hover:bg-blue-100 disabled:opacity-30 disabled:hover:bg-white/50 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {pageNumbers.map((p, i) => {
                if (p === "ellipsis") {
                  return (
                    <span key={`ell-${i}`} className="text-blue-300 px-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  )
                }
                const isActive = p === safePage
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`w-8 h-8 rounded-full text-[13px] font-bold transition-all shadow-sm ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_2px_8px_rgba(0,75,155,0.3)]"
                        : "bg-white/50 text-blue-600 border border-blue-100 hover:bg-blue-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-full border border-blue-200 text-blue-600 bg-white/50 hover:bg-blue-100 disabled:opacity-30 disabled:hover:bg-white/50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

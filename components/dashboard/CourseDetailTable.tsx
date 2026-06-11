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

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(new RegExp(`(${escaped})`, "gi"),
    '<mark style="background:rgba(107,98,242,0.35);color:#c4b5fd;border-radius:3px;padding:0 2px;">$1</mark>')
}

function Hl({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  return <span dangerouslySetInnerHTML={{ __html: highlightText(text, query) }} />
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
  else if (currentPage <= 4) { pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages) }
  else if (currentPage >= totalPages - 3) { pages.push(1, "ellipsis", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages) }
  else { pages.push(1, "ellipsis", currentPage-1, currentPage, currentPage+1, "ellipsis", totalPages) }
  return pages
}

export default function CourseDetailTable({ courses }: CourseDetailTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => { setDebouncedQuery(searchQuery); setCurrentPage(1) }, 300)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [searchQuery])

  const filteredCourses = courses.filter((c) => {
    if (!debouncedQuery.trim()) return true
    const t = debouncedQuery.toLowerCase()
    return c.교과목명.toLowerCase().includes(t) || c.담당교수.toLowerCase().includes(t)
  })

  const totalItems = filteredCourses.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages) }, [totalPages, currentPage])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const handlePageChange = useCallback((p: number) => { if (p >= 1 && p <= totalPages) setCurrentPage(p) }, [totalPages])
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="glass-card relative p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <h3 className="text-[14px] font-semibold text-[var(--color-bone)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]" style={{ background: "#64B4FF" }} />
          상세 강좌 정보
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
            style={{ background: "rgba(100,180,255,0.15)", borderColor: "rgba(100,180,255,0.3)", color: "#64B4FF" }}>
            {totalItems.toLocaleString()}건
          </span>
        </h3>
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[var(--color-fog)] pointer-events-none" />
          <input type="text" placeholder="교과목명 또는 담당교수 검색..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[var(--radius-inputs)] text-[13px] placeholder:text-[var(--color-fog)] focus:outline-none transition-all font-sans"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--color-bone)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(100,180,255,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(100,180,255,0.1)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar rounded-xl border relative z-10"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        {paginatedCourses.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-fog)] text-[14px]">검색 결과가 없습니다.</div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px] font-geist">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "var(--color-fog)" }}>
                {["번호","교과목명","대학(원)","학과(부)","이수구분","수업방법","학점","담당교수","시간표","수강","정원"].map(h => (
                  <th key={h} className="py-3 px-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course, idx) => {
                const gi = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1
                return (
                  <tr key={course.순번} className="transition-colors group"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(100,180,255,0.06)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td className="py-3 px-4 text-[11px] font-mono" style={{ color: "var(--color-fog)" }}>{gi}</td>
                    <td className="py-3 px-4 text-[13px] font-medium max-w-[200px] truncate" style={{ color: "var(--color-bone)" }} title={course.교과목명}>
                      <Hl text={course.교과목명} query={debouncedQuery} />
                    </td>
                    <td className="py-3 px-4 text-[13px]" style={{ color: "var(--color-mist)" }}>{course["대학(원)"]}</td>
                    <td className="py-3 px-4 text-[13px]" style={{ color: "var(--color-mist)" }}>{course["학과(부)"]}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(100,180,255,0.15)", color: "#64B4FF", border: "1px solid rgba(100,180,255,0.25)" }}>
                        {course.이수구분}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[12px] text-center" style={{ color: "var(--color-fog)" }}>{course.수업방법 || "-"}</td>
                    <td className="py-3 px-4 text-[13px] text-center font-medium" style={{ color: "var(--color-mist)" }}>{course.학점}</td>
                    <td className="py-3 px-4 text-[13px] max-w-[100px] truncate" style={{ color: "var(--color-mist)" }} title={course.담당교수}>
                      <Hl text={course.담당교수} query={debouncedQuery} />
                    </td>
                    <td className="py-3 px-4 text-[12px] max-w-[160px] truncate" style={{ color: "var(--color-fog)" }} title={course["시간표(교시)"]}>
                      {course["시간표(교시)"]}
                    </td>
                    <td className="py-3 px-4 text-[13px] text-right font-medium font-geist" style={{ color: "var(--color-bone)" }}>{course.수강}</td>
                    <td className="py-3 px-4 text-[13px] text-right" style={{ color: "var(--color-fog)" }}>{course.정원}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between relative z-10">
          <div className="text-[12px]" style={{ color: "var(--color-fog)" }}>
            <span style={{ color: "var(--color-mist)" }}>{startIndex+1}</span>–<span style={{ color: "var(--color-mist)" }}>{Math.min(startIndex+ITEMS_PER_PAGE, totalItems)}</span> / 총 <span style={{ color: "var(--color-mist)" }}>{totalItems}</span>건
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1}
              className="p-1.5 rounded-full transition-all disabled:opacity-30"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "var(--color-mist)", background: "rgba(255,255,255,0.04)" }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <span key={`ell-${i}`} style={{ color: "var(--color-fog)" }}><MoreHorizontal className="w-4 h-4" /></span>
              ) : (
                <button key={p} onClick={() => handlePageChange(p as number)}
                  className="min-w-[32px] h-8 rounded-full text-[12px] font-medium transition-all"
                  style={p === currentPage ? { background: "#1A6EBF", color: "#fff", boxShadow: "0 0 12px rgba(100,180,255,0.5)" }
                    : { color: "var(--color-mist)", background: "transparent", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages}
              className="p-1.5 rounded-full transition-all disabled:opacity-30"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "var(--color-mist)", background: "rgba(255,255,255,0.04)" }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

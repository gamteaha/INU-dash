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
    '<mark style="background:rgba(255,104,44,0.15);color:#ff682c;border-radius:2px;padding:0 2px;">$1</mark>'
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
    <div className="bg-[var(--color-paper)] rounded-lg overflow-hidden shadow-[var(--shadow-card)] border-none">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="p-6 border-b border-[var(--color-chalk)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-carbon)] flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal-orange)]" />
            상세 강좌 정보
          </h3>
          <span className="text-xs font-medium text-[var(--color-slate)]">
            총 {totalItems.toLocaleString()}개 중{" "}
            {totalItems > 0 ? startIndex + 1 : 0}–{endIndex}번째 표시
          </span>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-slate)] pointer-events-none" />
          <input
            id="course-search"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="강좌명, 교수명, 학과명 검색..."
            className="w-full border border-[var(--color-chalk)] rounded-lg pl-8 pr-3 py-2 text-[13px] focus:outline-none focus:border-[var(--color-signal-orange)] bg-[var(--color-paper)] text-[var(--color-carbon)] transition-colors placeholder:text-[var(--color-slate)]"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* ── Search result badge ──────────────────────────────── */}
      {isSearching && (
        <div className="px-6 py-2.5 border-b border-[var(--color-chalk)] bg-[var(--color-fog)]">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] bg-[var(--color-fog)] border border-[var(--color-chalk)] text-[12px] text-[var(--color-signal-orange)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-signal-orange)] inline-block" />
            검색 결과: {totalItems.toLocaleString()}개 강좌
          </span>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[var(--color-fog)] border-b border-[var(--color-chalk)]">
              <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)]">
                강좌명
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-32">
                대학
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-36">
                학과
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-24">
                이수구분
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-28">
                수업방법
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-20 text-center">
                학점
              </th>
              <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-28 text-center">
                수강인원
              </th>
              <th className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--color-slate)] w-24 text-right">
                수강률
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--color-chalk)] bg-[var(--color-paper)]">
            {currentData.length > 0 ? (
              currentData.map((course) => {
                const capacity = Number(course.정원) || 0
                const enrolled = Number(course.수강) || 0
                const rate = capacity > 0 ? (enrolled / capacity) * 100 : 0
                const q = debouncedQuery  // raw (non-lowercased) for display

                return (
                  <tr
                    key={course.순번}
                    className="hover:bg-[var(--color-fog)] transition-colors text-[13px] text-[var(--color-carbon)]"
                  >
                    {/* 강좌명 + 교수명 */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[var(--color-carbon)]">
                        <Hl text={course.교과목명 || "-"} query={q} />
                      </div>
                      <div className="text-[11px] text-[var(--color-slate)] mt-0.5">
                        <Hl text={course.담당교수 || "-"} query={q} />
                        {" | "}
                        {course["시간표(교시)"] || "-"}
                      </div>
                    </td>

                    {/* 대학 */}
                    <td className="px-4 py-3.5 text-[var(--color-graphite)] truncate max-w-[120px]">
                      {course["대학(원)"] || "-"}
                    </td>

                    {/* 학과 */}
                    <td className="px-4 py-3.5 text-[var(--color-graphite)] truncate max-w-[140px]">
                      <Hl text={course["학과(부)"] || "-"} query={q} />
                    </td>

                    {/* 이수구분 badge */}
                    <td className="px-4 py-3.5">
                      <span className="text-[var(--color-graphite)] bg-[var(--color-fog)] px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
                        {course.이수구분 || "-"}
                      </span>
                    </td>

                    {/* 수업방법 */}
                    <td className="px-4 py-3.5 text-[var(--color-graphite)]">
                      {course.수업방법 || "대면"}
                    </td>

                    {/* 학점 */}
                    <td className="px-4 py-3.5 text-center text-[var(--color-graphite)]">
                      {course.학점 ? `${course.학점}학점` : "-"}
                    </td>

                    {/* 수강인원 */}
                    <td className="px-4 py-3.5 text-center text-[var(--color-graphite)] tabular-nums">
                      {enrolled} / {capacity}
                    </td>

                    {/* 수강률 */}
                    <td className="px-5 py-3.5 text-right font-semibold text-[var(--color-carbon)] tabular-nums">
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                )
              })
            ) : (
              /* 검색 결과 없음 */
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl select-none">🔍</span>
                    <span
                      className="text-[14px] text-[var(--color-slate)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      검색 결과가 없습니다
                    </span>
                    {isSearching && (
                      <span className="text-[12px] text-[var(--color-slate)] opacity-70">
                        &ldquo;{debouncedQuery}&rdquo; 에 해당하는 강좌를 찾을 수 없습니다
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[var(--color-chalk)] flex items-center justify-center bg-[var(--color-paper)]">
          <nav className="flex items-center gap-1" aria-label="페이지 네비게이션">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-full text-[var(--color-slate)] hover:bg-[var(--color-fog)] disabled:opacity-40 disabled:pointer-events-none transition-colors mr-1"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((page, idx) =>
              page === "ellipsis" ? (
                <div
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-[var(--color-slate)]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                    page === safePage
                      ? "bg-[var(--color-signal-orange)] text-white"
                      : "text-[var(--color-graphite)] hover:bg-[var(--color-fog)]"
                  }`}
                  aria-current={page === safePage ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-full text-[var(--color-slate)] hover:bg-[var(--color-fog)] disabled:opacity-40 disabled:pointer-events-none transition-colors ml-1"
              aria-label="다음 페이지"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

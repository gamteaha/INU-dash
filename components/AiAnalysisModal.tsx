"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, Sparkles, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"
import { useBrandColors } from "@/hooks/useBrandColors"

interface AiAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  target: string
  stats: any
}

export default function AiAnalysisModal({
  isOpen,
  onClose,
  target,
  stats,
}: AiAnalysisModalProps) {
  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { orange, isLight } = useBrandColors()
  
  // 포인트 컬러: 횃불이 오렌지 (다크) -> 인천대 블루 (라이트)
  const pointColor = orange[0]

  const fetchAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setCompletion("")
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, stats }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "분석 실패")
      }
      setCompletion(data.text)
    } catch (e: any) {
      setError(e)
    } finally {
      setIsLoading(false)
    }
  }

  const hasStarted = useRef(false)

  // 모달이 열리면 자동으로 분석 시작
  useEffect(() => {
    if (isOpen && !hasStarted.current) {
      hasStarted.current = true
      fetchAnalysis()
    }
    if (!isOpen) {
      hasStarted.current = false
    }
  }, [isOpen, target, stats])

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleDownload = () => {
    const today = new Date().toISOString().split("T")[0]
    const filename = `AI_강의_분석_보고서_${target.replace(/\s+/g, "_")}_${today}.md`
    const blob = new Blob([completion], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isGenerating = isLoading || (!completion && !error)

  return (
    <AnimatePresence>
      {isOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[var(--color-void)]/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <motion.div
        className={`relative w-full max-w-[640px] backdrop-blur-[24px] rounded-[var(--radius-cards)] shadow-[0_24px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden flex flex-col max-h-[90vh] ${isLight ? "bg-white/95 border border-black/10" : "bg-[var(--color-char)]/95 border border-[var(--color-bone)]/10"}`}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      >
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isLight ? "border-black/10" : "border-[var(--color-bone)]/10"}`}>
          <h2 className="text-[15px] font-medium flex items-center gap-2.5" style={{ color: isLight ? "#1a202c" : "var(--color-bone)" }}>
            <Sparkles className="w-5 h-5" style={{ color: pointColor }} />
            AI 강의 데이터 종합 분석
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-[var(--color-smoke)] hover:text-[var(--color-bone)] hover:bg-[var(--color-iron)]/50 rounded-[var(--radius-iconcontainers)] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isGenerating && !completion ? (
            // 로딩 상태
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${pointColor}22` }}>
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: pointColor }} />
              </div>
              <div>
                <p className="text-[16px] font-medium mb-1" style={{ color: isLight ? "#2d3748" : "var(--color-bone)" }}>
                  Gemini 3.1 Flash-Lite 분석 중
                </p>
                <p className="text-[13px]" style={{ color: isLight ? "#718096" : "var(--color-smoke)" }}>
                  대시보드 데이터를 종합적으로 해석하여 보고서를 작성하고 있습니다.
                </p>
              </div>
            </div>
          ) : error ? (
            // 에러 상태
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-[var(--radius-inputs)] text-sm">
              ⚠️ 분석 중 오류가 발생했습니다: {error.message}
            </div>
          ) : (
            // 결과 상태
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3 text-[12px] pb-4 border-b border-[var(--color-bone)]/10">
                <span className="bg-[var(--color-iron)] text-[var(--color-bone)] border border-[var(--color-bone)]/10 px-3 py-1 rounded-[var(--radius-tags)] font-medium">
                  분석 대상: {target}
                </span>
                <span className="text-[var(--color-smoke)]">
                  {new Date().toLocaleDateString("ko-KR")}
                </span>
              </div>

              {/* Markdown Content */}
              <article className="prose prose-invert prose-sm md:prose-base max-w-none
                prose-headings:font-medium prose-headings:text-[var(--color-bone)] prose-headings:tracking-tight
                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                prose-p:text-[var(--color-mist)] prose-p:leading-relaxed
                prose-li:text-[var(--color-mist)]
                prose-strong:text-[#FDBA74]
                prose-code:text-[var(--color-indigo-haze)] prose-code:bg-[var(--color-iron)]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px]
                prose-hr:border-[var(--color-bone)]/10">
                <ReactMarkdown>{completion}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-end shrink-0 gap-3 ${isLight ? "bg-gray-50 border-black/10" : "bg-black/20 border-[var(--color-bone)]/10"}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 text-[13px] font-medium rounded-[var(--radius-buttons)] transition-colors ${isLight ? "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100" : "text-[var(--color-mist)] bg-[var(--color-iron)]/50 border border-[var(--color-bone)]/10 hover:bg-[var(--color-iron)]"}`}
          >
            닫기
          </button>
          <button
            onClick={handleDownload}
            disabled={!completion || isLoading}
            className="px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 rounded-[var(--radius-buttons)] transition-opacity disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
            style={{ backgroundColor: pointColor }}
          >
            <Download className="w-4 h-4" />
            보고서 다운로드 (.md)
          </button>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  )
}

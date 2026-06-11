"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, Sparkles, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

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

  if (!isOpen) return null

  const isGenerating = isLoading || (!completion && !error)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-void)]/70 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[640px] bg-[var(--color-char)]/95 backdrop-blur-[24px] rounded-[var(--radius-cards)] border border-[var(--color-bone)]/10 shadow-[0_24px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-bone)]/10 flex items-center justify-between shrink-0">
          <h2 className="text-[15px] font-medium text-[var(--color-bone)] flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[var(--color-indigo-haze)]" />
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
              <div className="w-14 h-14 rounded-full bg-[var(--color-iron)]/50 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[var(--color-indigo-haze)] animate-spin" />
              </div>
              <div>
                <p className="text-[16px] font-medium text-[var(--color-bone)] mb-1">
                  Gemini 3.1 Flash-Lite 분석 중
                </p>
                <p className="text-[13px] text-[var(--color-smoke)]">
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
                prose-strong:text-[var(--color-bone)]
                prose-code:text-[var(--color-indigo-haze)] prose-code:bg-[var(--color-iron)]/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px]
                prose-hr:border-[var(--color-bone)]/10">
                <ReactMarkdown>{completion}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-bone)]/10 shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[var(--color-mist)] bg-[var(--color-iron)]/50 border border-[var(--color-bone)]/10 hover:bg-[var(--color-iron)] rounded-[var(--radius-buttons)] transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleDownload}
            disabled={!completion || isLoading}
            className="px-5 py-2.5 text-[13px] font-medium text-[var(--color-void)] bg-[var(--color-bone)] hover:opacity-90 rounded-[var(--radius-buttons)] transition-opacity disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            보고서 다운로드 (.md)
          </button>
        </div>
      </div>
    </div>
  )
}

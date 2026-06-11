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

  // 모달이 열리면 자동으로 fetchAnalysis() 호출
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[600px] bg-white rounded-lg border border-[#e8e8e8] shadow-[0_4px_12px_rgba(32,32,32,0.03)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e8e8e8] flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-base font-semibold text-[#202020] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff682c]" />
            💡 AI 강의 데이터 종합 분석
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-[#828282] hover:bg-[#f5f5f5] rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f5f5f5]">
          {isGenerating && !completion ? (
            // 로딩 상태
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 text-[#ff682c] animate-spin mb-4" />
              <p className="text-[#202020] font-semibold text-base mb-2">
                Gemini 3.1 Flash-Lite 모델이 통계를 분석 중입니다...
              </p>
              <p className="text-[#828282] text-xs">
                대시보드 데이터를 종합적으로 해석하여 보고서를 작성하고 있습니다.
              </p>
            </div>
          ) : error ? (
            // 에러 상태
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm">
              ⚠️ 분석 중 오류가 발생했습니다: {error.message}
            </div>
          ) : (
            // 결과 상태
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-6 shadow-sm">
              <div className="mb-6 pb-4 border-b border-[#e8e8e8] bg-[#f5f5f5] -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#202020]">
                  <span className="bg-[#202020] text-white px-2.5 py-1 rounded-[20px]">
                    분석 대상: {target}
                  </span>
                  <span className="text-[#828282]">
                    일자: {new Date().toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>

              {/* Markdown Content */}
              <article className="prose prose-sm md:prose-base prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-[#202020] prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[#4d4d4d] prose-li:text-[#4d4d4d]">
                <ReactMarkdown>{completion}</ReactMarkdown>
              </article>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e8e8e8] bg-white shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-[#202020] bg-white border border-[#202020] rounded-[20px] hover:bg-[#f5f5f5] transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleDownload}
            disabled={!completion || isLoading}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#202020] hover:bg-[#4d4d4d] rounded-[20px] transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#ff682c]" />
            보고서 다운로드 (.md)
          </button>
        </div>
      </div>
    </div>
  )
}

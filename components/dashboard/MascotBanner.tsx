"use client"

import { useDashboard } from "@/context/DashboardFilterContext"
import { COLLEGE_HIERARCHY, DEPARTMENT_LINKS, DEPARTMENT_IMAGES } from "@/lib/supabase/constants"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MascotBanner() {
  const { selectedCollege, selectedDepartment, setSelectedDepartment, setSelectedCollege } = useDashboard()

  const getHeadline = () => {
    if (selectedDepartment) return selectedDepartment
    if (selectedCollege) return selectedCollege
    return "전체 교과목 대시보드"
  }

  const getSubtitle = () => {
    if (selectedDepartment) return "학과 상세 데이터"
    if (selectedCollege) return "단과대학 데이터"
    return "인천대학교 2026학년도 1학기"
  }

  // 현재 선택된 대학의 학과 목록 → dock에 표시
  const getDockItems = (): string[] => {
    if (selectedCollege) {
      const college = COLLEGE_HIERARCHY.find(c => c.college === selectedCollege)
      return college ? college.departments : []
    }
    // 전체 보기일 때는 단과대학 목록 표시
    return COLLEGE_HIERARCHY.map(c => c.college)
  }

  const dockItems = getDockItems()
  const isCollegeView = !selectedCollege

  const handleDockItemClick = (item: string) => {
    if (isCollegeView) {
      // 단과대학 클릭 시 → 해당 대학으로 필터링
      setSelectedCollege(item)
    } else {
      // 학과 클릭 시 → 학과 필터링
      setSelectedDepartment(item === selectedDepartment ? null : item)
    }
  }

  const handleExternalLink = (e: React.MouseEvent, item: string) => {
    e.stopPropagation()
    const url = DEPARTMENT_LINKS[item]
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }

  return (
    <div className="relative w-full mb-4">
      {/* Dawn Wash Gradient Background */}
      <div
        className="absolute inset-x-0 -top-24 h-[700px] w-[100vw] left-1/2 -translate-x-1/2 -z-20 pointer-events-none opacity-15"
        style={{
          background: "linear-gradient(180deg, rgb(13,27,42), rgb(26,110,191), rgb(168,216,240))",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />
      {/* Radial Blue Spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] -z-10 pointer-events-none opacity-25"
        style={{ background: "radial-gradient(ellipse at center, rgba(100,180,255,0.6) 0%, transparent 70%)" }}
      />

      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Left Column: Headline & Features */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span 
              className="text-[72px] font-normal tracking-[-0.035em] leading-[1.0] text-white font-geist block mb-1" 
              style={{ fontFeatureSettings: '"ss01" on, "cv11" on' }}
            >
              Course Intelligence.
            </span>
            <AnimatePresence mode="wait">
              <motion.h1
                key={getHeadline()}
                className="text-[40px] font-medium tracking-[-0.02em] leading-[1.2] text-white text-balance font-geist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              >
                {getHeadline()}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={getSubtitle()}
                className="text-[16px] text-[var(--color-mist)] mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {getSubtitle()}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-0 mt-2 max-w-[400px]">
            <h4 className="text-[13px] font-medium text-[var(--color-smoke)] uppercase tracking-wider mb-3">분석 기능</h4>
            {[
              "실시간 수강 인원 트래킹",
              "이수구분 및 학점 분포 분석",
              "인터랙티브 캠퍼스 맵",
            ].map((feature, i) => (
              <div key={i} className="flex items-center justify-between h-[40px] border-b border-[var(--color-bone)]/10">
                <span className="text-[15px] font-normal text-[var(--color-mist)]">{feature}</span>
                <span className="text-[13px] font-medium text-[var(--color-fog)] font-geist">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Glass Department Dock */}
        <div className="lg:col-span-7 relative">
        <div className="relative w-full glass-card-elevated overflow-hidden"
          style={{ animation: "pulseGlow 4s ease-in-out infinite", border: "1px solid rgba(100,180,255,0.25)", position: "relative" }}>
          {/* Blue shimmer top edge */}
          <div className="absolute top-0 left-8 right-8 h-[1px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(100,180,255,0.6), transparent)" }} />
          {/* Corner accent glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(100,180,255,0.2)" }} />

          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[var(--color-mist)]">
                {isCollegeView ? "단과대학 선택" : `${selectedCollege} — 학과 선택 (클릭하여 필터 / 🔗 홈페이지 이동)`}
              </p>
              {selectedCollege && (
                <button
                  onClick={() => { setSelectedCollege(null); setSelectedDepartment(null) }}
                  className="text-[12px] text-[var(--color-smoke)] hover:text-[var(--color-bone)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--color-iron)]/50"
                >
                  ← 전체로
                </button>
              )}
            </div>

            {/* Department / College Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
              {dockItems.map((item) => {
                const isActive = isCollegeView
                  ? selectedCollege === item
                  : selectedDepartment === item
                const imgSrc = isCollegeView
                  ? DEPARTMENT_IMAGES[COLLEGE_HIERARCHY.find(c => c.college === item)?.departments[0] ?? ""] ?? null
                  : DEPARTMENT_IMAGES[item] ?? null
                const hasLink = !isCollegeView && !!DEPARTMENT_LINKS[item]

              return (
                  <motion.div
                    key={item}
                    className={`group relative flex flex-col items-center gap-2 rounded-[14px] p-2.5 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-indigo-haze)]/20 border border-[var(--color-indigo-haze)]/40 shadow-[0_0_16px_rgba(107,98,242,0.2)]"
                        : "border border-transparent hover:bg-[var(--color-iron)]/40 hover:border-[var(--color-bone)]/10"
                    }`}
                    onClick={() => handleDockItemClick(item)}
                    initial={{ opacity: 0, scale: 0.88, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  >
                    {/* Image or Placeholder */}
                    <div className={`relative w-full aspect-square rounded-[10px] overflow-hidden border transition-all ${
                      isActive ? "border-[var(--color-indigo-haze)]/60" : "border-[var(--color-bone)]/10 group-hover:border-[var(--color-bone)]/25"
                    }`}>
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="80px"
                        />
                      ) : (
                        <Image
                          src="/inu_logo_fallback.png"
                          alt={item}
                          fill
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                          sizes="80px"
                        />
                      )}

                      {/* External Link Overlay (학과 뷰에서만) */}
                      {hasLink && (
                        <button
                          onClick={(e) => handleExternalLink(e, item)}
                          className="absolute inset-0 flex items-center justify-center bg-[var(--color-void)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]"
                          title={`${item} 홈페이지 방문`}
                        >
                          <ExternalLink className="w-5 h-5 text-[var(--color-paper)]" />
                        </button>
                      )}
                    </div>

                    {/* Label */}
                    <span className={`text-center leading-tight text-[11px] font-medium transition-colors line-clamp-2 ${
                      isActive ? "text-[var(--color-bone)]" : "text-[var(--color-mist)] group-hover:text-[var(--color-bone)]"
                    }`}>
                      {item}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Status Row (AI Engine) */}
            <div className="mt-4 pt-4 border-t border-[var(--color-bone)]/5 flex items-center gap-3">
              <div className="w-6 h-6 bg-[var(--color-indigo-haze)]/20 border border-[var(--color-indigo-haze)]/40 rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--color-indigo-haze)]">
                AI
              </div>
              <span className="text-[13px] font-medium text-[var(--color-bone)]">Gemini 3.1 Flash-Lite</span>
              <span className="text-[12px] font-normal text-[var(--color-smoke)] ml-auto animate-pulse">분석 엔진 가동 중...</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

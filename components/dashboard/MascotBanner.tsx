"use client"

import { useDashboard } from "@/context/DashboardFilterContext"

export default function MascotBanner() {
  const { selectedCollege, selectedDepartment } = useDashboard()

  const getWelcomeText = () => {
    if (selectedDepartment) return `${selectedDepartment} 현황`
    if (selectedCollege) return `${selectedCollege} 대시보드`
    return "인천대학교 2026-1 교과목 대시보드"
  }

  const getSubText = () => {
    if (selectedDepartment) return `${selectedDepartment}에 개설된 전체 강의 현황을 분석합니다.`
    if (selectedCollege) return `${selectedCollege} 소속 학과들의 강의 지표를 확인하세요.`
    return "전체 단과대학 및 학부의 개설 강좌, 수강 인원, 수업 유형 분포를 한눈에 파악하세요."
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 mb-8 overflow-hidden shadow-[0_10px_30px_rgba(0,75,155,0.2)] border border-white/20">
      {/* Abstract 3D Glass Shapes Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[10%] w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-2xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-white">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-bold bg-white/20 backdrop-blur-md rounded-full w-fit border border-white/30 text-blue-50">
            INCHEON NATIONAL UNIVERSITY
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
            {getWelcomeText()}
          </h1>
          <p className="text-blue-100 font-medium text-sm md:text-base mt-1 max-w-[600px] leading-relaxed">
            {getSubText()}
          </p>
        </div>

        {/* Mascot Area (Virtual Placeholder for 3D Mascot) */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-full blur-xl scale-150 animate-pulse" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-[5px_5px_15px_rgba(0,0,0,0.1)]">
            <span className="text-5xl md:text-6xl drop-shadow-lg filter pb-2">🔥</span>
            <div className="absolute -bottom-2 px-3 py-1 bg-white text-blue-900 text-xs font-extrabold rounded-full shadow-lg border border-blue-100">
              횃불이
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

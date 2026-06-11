import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative z-10 p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto bg-white/60 backdrop-blur-md shadow-[5px_5px_15px_rgba(0,0,0,0.05)] border border-white/40 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Branding & Creator Name */}
          <div className="flex flex-col gap-1">
            <span className="text-[18px] font-extrabold tracking-tight text-blue-900">
              INCHEON NATIONAL UNIVERSITY
            </span>
            <span className="text-[13px] font-medium text-blue-700/80">
              인천대학교 2026-1 교과목 대시보드
            </span>
            <span className="text-[14px] font-bold text-blue-600 mt-1">
              제작: 김태희 (KIM TAE HEE)
            </span>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6" aria-label="외부 링크">
            <a
              href="https://www.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-blue-800 hover:text-blue-500 transition-colors bg-white/50 px-4 py-2 rounded-full shadow-[2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
            >
              인천대학교 홈페이지
            </a>
            <a
              href="https://portal.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-blue-800 hover:text-blue-500 transition-colors bg-white/50 px-4 py-2 rounded-full shadow-[2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
            >
              INU 포털
            </a>
            <a
              href="https://cyber.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-blue-800 hover:text-blue-500 transition-colors bg-white/50 px-4 py-2 rounded-full shadow-[2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]"
            >
              이러닝
            </a>
          </nav>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-blue-900/10">
          <p className="text-[12px] font-medium text-blue-900/50">
            © 2026 Incheon National University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

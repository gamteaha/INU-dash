import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="w-full mt-auto"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "var(--color-carbon)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left: Branding */}
          <div className="flex flex-col gap-1">
            <span
              className="text-[16px] font-[400] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              INCHEON NATL UNIV
            </span>
            <span
              className="text-[12px] font-[400] text-[var(--color-slate)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              인천대학교 2026-1 교과목 대시보드
            </span>
            <span
              className="text-[12px] font-[400] text-[var(--color-slate)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              제작: Antigravity
            </span>
          </div>

          {/* Right: Links */}
          <nav
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            aria-label="외부 링크"
          >
            <Link
              href="https://www.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-[400] text-[var(--color-slate)] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              인천대학교 홈페이지
            </Link>
            <span className="hidden sm:inline w-px h-3 bg-[var(--color-slate)] opacity-40" />
            <Link
              href="https://portal.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-[400] text-[var(--color-slate)] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              INU 포털
            </Link>
            <span className="hidden sm:inline w-px h-3 bg-[var(--color-slate)] opacity-40" />
            <Link
              href="https://cyber.inu.ac.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-[400] text-[var(--color-slate)] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              이러닝
            </Link>
          </nav>
        </div>

        {/* Bottom copyright row */}
        <div
          className="pt-4 flex flex-col sm:flex-row items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-[11px] font-[400] text-[var(--color-slate)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            © 2026 Incheon National University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

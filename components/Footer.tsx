export default function Footer() {
  return (
    <footer className="w-full mt-auto relative z-10 py-12">
      <div className="flex flex-col items-center gap-6">
        {/* Hairline divider */}
        <div className="h-[1px] w-full bg-[var(--color-bone)]/10" />
        
        {/* Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <a
            href="https://www.inu.ac.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"
          >
            인천대학교 홈페이지
          </a>
          <span className="w-[1px] h-[12px] bg-[var(--color-smoke)]" />
          <a
            href="https://portal.inu.ac.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"
          >
            INU 포털
          </a>
          <span className="w-[1px] h-[12px] bg-[var(--color-smoke)]" />
          <a
            href="https://elearning.inu.ac.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-[var(--color-mist)] hover:text-[var(--color-bone)] transition-colors"
          >
            이러닝
          </a>
        </div>

        {/* Credit */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[13px] text-[var(--color-fog)]">
            © 2026 인천대학교 2026-1 강의시간표 대시보드
          </p>
          <p className="text-[13px] text-[var(--color-smoke)]">
            Designed &amp; Built by <span className="text-[var(--color-mist)] font-medium">김태희 (KIM TAE HEE)</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

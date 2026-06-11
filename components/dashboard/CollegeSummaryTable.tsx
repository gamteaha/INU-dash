import { useDashboard } from "@/context/DashboardFilterContext"

interface CollegeRow {
  rank: number
  name: string
  courseCount: number
  totalEnrolled: number
  avgEnrollRate: number
}

interface CollegeSummaryTableProps {
  data: CollegeRow[]
}

export default function CollegeSummaryTable({ data }: CollegeSummaryTableProps) {
  const { setSelectedCollege, setSelectedDepartment } = useDashboard()

  const handleCardClick = (name: string) => {
    setSelectedCollege(name)
    setSelectedDepartment(null)
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-[14px] font-semibold text-[var(--color-carbon)] flex items-center gap-2 px-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal-orange)]" />
        대학(원)별 강좌 분석 요약
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((row) => (
          <div
            key={row.name}
            onClick={() => handleCardClick(row.name)}
            className="bg-[var(--color-paper)] p-6 rounded-lg shadow-[var(--shadow-card)] border-l-2 border-transparent hover:border-[var(--color-signal-orange)] hover:bg-[var(--color-fog)] cursor-pointer transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              {/* College Name */}
              <p className="text-[13px] font-semibold text-[var(--color-carbon)] font-sans mb-3">
                {row.name}
              </p>
              
              {/* Course count */}
              <div className="flex items-baseline gap-0.5 mb-1">
                <span
                  className="text-[24px] font-normal text-[var(--color-signal-orange)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {row.courseCount.toLocaleString()}
                </span>
                <span className="text-xs font-normal text-[var(--color-slate)]">개 강좌</span>
              </div>
            </div>

            {/* Enrolled Students + Avg Rate */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-chalk)] text-[12px] text-[var(--color-slate)] font-sans">
              <span>수강인원: {row.totalEnrolled.toLocaleString()}명</span>
              <span className="font-semibold text-[var(--color-carbon)]">수강률: {row.avgEnrollRate.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

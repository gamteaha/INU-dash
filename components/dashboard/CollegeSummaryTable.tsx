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
    <div className="space-y-4 mb-8">
      {/* Title */}
      <h3 className="text-[16px] font-extrabold text-blue-900 flex items-center gap-2 px-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        대학(원)별 강좌 분석 요약
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.map((row) => (
          <div
            key={row.name}
            onClick={() => handleCardClick(row.name)}
            className="group relative bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-[5px_5px_15px_rgba(0,75,155,0.05)] border border-white/60 hover:-translate-y-1 hover:shadow-[8px_8px_20px_rgba(0,75,155,0.12)] cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="relative z-10">
              {/* College Name */}
              <p className="text-[15px] font-extrabold text-blue-900 mb-3 tracking-tight">
                {row.name}
              </p>
              
              {/* Course count */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[32px] font-extrabold tracking-tight text-blue-600 drop-shadow-sm">
                  {row.courseCount.toLocaleString()}
                </span>
                <span className="text-[13px] font-bold text-blue-900/60">개 강좌</span>
              </div>
            </div>

            {/* Enrolled Students + Avg Rate */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-900/10 text-[13px] font-medium text-blue-800/80 relative z-10">
              <span>수강인원: {row.totalEnrolled.toLocaleString()}명</span>
              <span className="font-extrabold text-blue-900">수강률: {row.avgEnrollRate.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

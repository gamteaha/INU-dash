"use client"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

interface DistributionChartsProps {
  teachingMethodData: { name: string; value: number }[]
  creditData: { name: string; value: number }[]
  totalCourses: number
}

// 인천대 블루 테마 차트 색상 (진한 블루부터 밝은 스카이블루까지)
const COLORS = [
  "#1E3A8A", // 아주 짙은 네이비
  "#1D4ED8", // 로열 블루
  "#3B82F6", // 기본 블루
  "#60A5FA", // 스카이 블루
  "#93C5FD", // 라이트 블루
  "#BFDBFE", // 틴트 블루
]

function DonutTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length || total === 0) return null
  const { name, value } = payload[0].payload
  const percent = ((value / total) * 100).toFixed(1)
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-[0_4px_12px_rgba(0,75,155,0.15)] rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: payload[0].payload.fill }}
        />
        <span>{name}</span>
      </div>
      <div className="pl-4 text-blue-600">
        {Number(value).toLocaleString()}개 <span className="text-blue-400 text-[11px] ml-1">({percent}%)</span>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  children,
  delay = 0,
}: {
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 min-w-0 shadow-[5px_5px_15px_rgba(0,75,155,0.05)] border border-white/60 hover:shadow-[8px_8px_20px_rgba(0,75,155,0.1)] transition-all duration-300"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      <h3 className="text-[15px] font-extrabold text-blue-900 mb-6 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        {title}
      </h3>
      <div className="h-[260px] w-full relative">{children}</div>
    </div>
  )
}

export default function DistributionCharts({
  teachingMethodData,
  creditData,
  totalCourses,
}: DistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
      {/* 3. 수업방법 유형 분포 */}
      <ChartCard title="수업방법 유형 분포" delay={350}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={teachingMethodData}
              cx="50%"
              cy="45%"
              innerRadius={70} // 매우 슬림하게
              outerRadius={90}
              paddingAngle={4} // 간격을 두어 세련되게
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {teachingMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={<DonutTooltip total={totalCourses} />}
              cursor={false}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#1E3A8A", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. 학점 구성 비율 */}
      <ChartCard title="학점 구성 비율" delay={450}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={creditData}
              cx="50%"
              cy="45%"
              innerRadius={70} // 매우 슬림하게
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {creditData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={<DonutTooltip total={totalCourses} />}
              cursor={false}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#1E3A8A", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

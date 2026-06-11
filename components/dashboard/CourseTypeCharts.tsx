"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"

interface CourseTypeChartsProps {
  byCourseTypeCount: { name: string; value: number }[]
  byCourseTypeAvgEnroll: { name: string; value: number }[]
}

const HIGHLIGHT = "#3B82F6"
const BASE = "#93C5FD"

/* ── Custom Tooltip ──────────────────────────────────── */
function CountTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-[0_4px_12px_rgba(0,75,155,0.15)] rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900">
      {name}: <span className="text-blue-600">{Number(value).toLocaleString()}개</span>
    </div>
  )
}

function AvgTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-[0_4px_12px_rgba(0,75,155,0.15)] rounded-xl px-4 py-3 text-[13px] font-bold text-blue-900">
      {name}: <span className="text-blue-600">{Number(value).toFixed(1)}명</span>
    </div>
  )
}

/* ── Shared card wrapper ─────────────────────────────── */
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
      <div className="h-[260px] w-full">{children}</div>
    </div>
  )
}

export default function CourseTypeCharts({
  byCourseTypeCount,
  byCourseTypeAvgEnroll,
}: CourseTypeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
      {/* 1. 이수구분별 개설 강좌 수 */}
      <ChartCard title="이수구분별 개설 강좌 수" delay={150}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byCourseTypeCount}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            barSize={16}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#1E3A8A", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#60A5FA", fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip content={<CountTooltip />} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {byCourseTypeCount.map((entry, index) => {
                const max = Math.max(...byCourseTypeCount.map((d) => d.value))
                const fill = entry.value === max ? HIGHLIGHT : BASE
                return <Cell key={`cell-${index}`} fill={fill} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. 이수구분별 평균 수강 인원 */}
      <ChartCard title="이수구분별 평균 수강 인원" delay={250}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={byCourseTypeAvgEnroll}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            barSize={16}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#1E3A8A", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#60A5FA", fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip content={<AvgTooltip />} cursor={{ fill: "rgba(59,130,246,0.05)" }} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {byCourseTypeAvgEnroll.map((entry, index) => {
                const max = Math.max(...byCourseTypeAvgEnroll.map((d) => d.value))
                const fill = entry.value === max ? HIGHLIGHT : BASE
                return <Cell key={`cell-${index}`} fill={fill} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

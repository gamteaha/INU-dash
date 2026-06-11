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

interface CourseTypeChartProps {
  byCourseTypeCount: { name: string; value: number }[]
  byCourseTypeAvgEnroll: { name: string; value: number }[]
}

const HIGHLIGHT = "#FACC15"
const BASE = "#A5B4FC"

export default function CourseTypeChart({
  byCourseTypeCount,
  byCourseTypeAvgEnroll,
}: CourseTypeChartProps) {
  const sortedCount = [...byCourseTypeCount].sort((a, b) => b.value - a.value)
  const sortedAvg = [...byCourseTypeAvgEnroll].sort((a, b) => b.value - a.value)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: 이수구분별 강좌 수 */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
          <h3 className="text-sm font-bold text-[#1A1D23]">이수구분별 강좌 수</h3>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <BarChart
              data={sortedCount}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB", borderRadius: 10 }}
                formatter={(v: any) => [`${Number(v).toLocaleString()}개`, "강좌 수"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {sortedCount.map((entry, idx) => (
                  <Cell key={idx} fill={idx === 0 ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: 이수구분별 평균 수강인원 */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
          <h3 className="text-sm font-bold text-[#1A1D23]">이수구분별 평균 수강인원</h3>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <BarChart
              data={sortedAvg}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#E5E7EB", borderRadius: 10 }}
                formatter={(v: any) => [`${Number(v).toFixed(1)}명`, "평균 수강인원"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {sortedAvg.map((entry, idx) => (
                  <Cell key={idx} fill={idx === 0 ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

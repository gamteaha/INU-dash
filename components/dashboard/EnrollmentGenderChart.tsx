"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface EnrollmentGenderChartProps {
  maleCount: number
  femaleCount: number
}

export default function EnrollmentGenderChart({ maleCount, femaleCount }: EnrollmentGenderChartProps) {
  const total = maleCount + femaleCount
  const malePercent = total > 0 ? (maleCount / total) * 100 : 0
  const femalePercent = total > 0 ? (femaleCount / total) * 100 : 0

  const data = [
    { name: "남학생", value: maleCount, percent: malePercent.toFixed(1) },
    { name: "여학생", value: femaleCount, percent: femalePercent.toFixed(1) }
  ]

  // Primary Indigo for Male, Highlight Yellow/Orange for Female (as requested by user color scheme)
  const COLORS = ["#6366F1", "#FACC15"]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full min-h-[350px]">
      <div className="mb-2">
        <h3 className="text-base font-bold text-gray-900">수강 신청 성비 구성</h3>
        <p className="text-xs text-gray-500 mt-1">2026학년도 1학기 수강생 남녀 성별 비율</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="w-full sm:w-1/2 h-[220px] relative">
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${Number(value).toLocaleString()}명`, '수강생']}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-xs text-gray-400 font-medium">총 수강생</span>
            <p className="text-lg font-bold text-gray-950 mt-0.5">{total.toLocaleString()}명</p>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center gap-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-gray-900">{item.percent}%</span>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.value.toLocaleString()}명</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell
} from "recharts"

interface CollegeData {
  name: string
  courses: number
  enrolled: number
}

interface CollegeChartProps {
  data: CollegeData[]
  title?: string
  subtitle?: string
}

export default function CollegeChart({ data, title = "단과대학별 개설 강좌 (Top 8)", subtitle = "각 단과대학별로 개설된 강의 수와 총 학생 수" }: CollegeChartProps) {
  // Sort data by number of courses descending, take top 10
  const sortedData = [...data]
    .sort((a, b) => b.courses - a.courses)
    .slice(0, 8)

  // Soft Indigo and highlight yellow theme
  const COLORS = ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF", "#C7D2FE", "#A5B4FC", "#818CF8"]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full min-h-[350px]">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              angle={-15}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1A1D23" }}
            />
            <Bar dataKey="courses" radius={[4, 4, 0, 0]} name="강좌 수">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

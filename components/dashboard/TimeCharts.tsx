"use client"

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Rectangle,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

function DarkTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="px-4 py-3 rounded-xl text-[13px] font-medium border glass-card-elevated"
      style={{ background: "rgba(13,27,42,0.95)", borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <p style={{ color: "rgba(255,255,255,0.6)" }} className="mb-0.5">{name}</p>
      <p className="text-[var(--color-paper)] font-geist text-glow-blue">{Number(value).toLocaleString()}개</p>
    </div>
  )
}

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="glass-card relative p-6 min-w-0 group"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}>
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <h3 className="text-[14px] font-semibold text-[var(--color-bone)] mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]" style={{ background: "#64B4FF" }} />
        {title}
      </h3>
      <div className="h-[260px] w-full font-geist">{children}</div>
    </div>
  )
}

export default function TimeCharts({ dayData, timeSlotData }: TimeChartsProps) {
  const maxDayIdx = dayData.reduce((mi, v, i, a) => v.value > a[mi].value ? i : mi, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 요일별 강좌 수 */}
      <ChartCard title="요일별 수업 강좌 수" delay={550}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dayData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={20}>
            <defs>
              <linearGradient id="dayBarBase" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1E3656" />
                <stop offset="100%" stopColor="#2E4A70" />
              </linearGradient>
              <linearGradient id="dayBarHigh" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1A6EBF" />
                <stop offset="100%" stopColor="#5BC8F5" />
              </linearGradient>
              <linearGradient id="dayBarActive" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#2A7EDF" />
                <stop offset="100%" stopColor="#7CDDFF" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 13, fill: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} dx={-8} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[6,6,0,0]} activeBar={<Rectangle fill="url(#dayBarActive)" filter="brightness(1.1)" />}>
              {dayData.map((_, index) => (
                <Cell key={index} fill={index === maxDayIdx ? "url(#dayBarHigh)" : "url(#dayBarBase)"} style={{ transition: "all 0.3s ease" }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 시간대별 강좌 수 */}
      <ChartCard title="수업 시간별 강좌 수 분포" delay={650}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSlotData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64B4FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#64B4FF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} dx={-8} />
            <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(100,180,255,0.3)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="value" stroke="#64B4FF" strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={{ r: 5, fill: "#0D1B2A", stroke: "#64B4FF", strokeWidth: 2 }}
              activeDot={{ r: 7, fill: "#64B4FF", stroke: "#A8D8F0", strokeWidth: 2,
                style: { filter: "drop-shadow(0 0 8px rgba(100,180,255,0.8))" } }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

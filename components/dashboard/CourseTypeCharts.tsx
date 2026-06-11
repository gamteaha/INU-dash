"use client"

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Rectangle
} from "recharts"

interface CourseTypeChartsProps {
  byCourseTypeCount: { name: string; value: number }[]
  byCourseTypeAvgEnroll: { name: string; value: number }[]
}

function DarkTooltip({ active, payload, suffix = "" }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="px-4 py-3 rounded-xl text-[13px] font-medium border glass-card-elevated"
      style={{ background: "rgba(13,27,42,0.95)", borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <p style={{ color: "rgba(255,255,255,0.6)" }} className="mb-0.5">{name}</p>
      <p className="text-[var(--color-paper)] font-geist text-glow-blue">{typeof value === "number" ? value.toLocaleString() : value}{suffix}</p>
    </div>
  )
}

function GradientBar(props: any) {
  const { x, y, width, height, index, maxIdx } = props
  const isMax = index === maxIdx
  return (
    <rect
      x={x} y={y} width={width} height={height}
      rx={6} ry={6}
      fill={isMax ? "url(#barGradientHighlight)" : "url(#barGradientBase)"}
      style={{ transition: "all 0.3s ease" }}
    />
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

export default function CourseTypeCharts({ byCourseTypeCount, byCourseTypeAvgEnroll }: CourseTypeChartsProps) {
  const maxCountIdx = byCourseTypeCount.reduce((mi, v, i, a) => v.value > a[mi].value ? i : mi, 0)
  const maxAvgIdx = byCourseTypeAvgEnroll.reduce((mi, v, i, a) => v.value > a[mi].value ? i : mi, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="이수구분별 강좌 수" delay={150}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCourseTypeCount} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={14}>
            <defs>
              <linearGradient id="barGradientBase" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1E3656" />
                <stop offset="100%" stopColor="#2E4A70" />
              </linearGradient>
              <linearGradient id="barGradientHighlight" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1A6EBF" />
                <stop offset="100%" stopColor="#5BC8F5" />
              </linearGradient>
              <linearGradient id="barGradientActive" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#2A7EDF" />
                <stop offset="100%" stopColor="#7CDDFF" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} dx={-8} />
            <Tooltip content={<DarkTooltip suffix="개" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" shape={(props: any) => <GradientBar {...props} maxIdx={maxCountIdx} />} radius={[6,6,0,0]} activeBar={<Rectangle fill="url(#barGradientActive)" filter="brightness(1.1)" />} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="이수구분별 평균 수강인원" delay={250}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCourseTypeAvgEnroll} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={14}>
            <defs>
              <linearGradient id="barGradientBase2" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1E3656" />
                <stop offset="100%" stopColor="#2E4A70" />
              </linearGradient>
              <linearGradient id="barGradientHighlight2" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1A6EBF" />
                <stop offset="100%" stopColor="#5BC8F5" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} dx={-8} />
            <Tooltip content={<DarkTooltip suffix="명" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="value" radius={[6,6,0,0]} activeBar={<Rectangle fill="url(#barGradientActive)" filter="brightness(1.1)" />}>
              {byCourseTypeAvgEnroll.map((_, index) => (
                <Cell key={index} fill={index === maxAvgIdx ? "url(#barGradientHighlight2)" : "url(#barGradientBase2)"} style={{ transition: "all 0.3s ease" }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

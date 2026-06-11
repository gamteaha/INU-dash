"use client"

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Label
} from "recharts"

interface DistributionChartsProps {
  teachingMethodData: { name: string; value: number }[]
  creditData: { name: string; value: number }[]
  totalCourses: number
}

// Light Blue Crystal Palette
const NEON_COLORS = [
  "#C8E8FF",  // lightest
  "#A8D8F0",
  "#64B4FF",
  "#5BC8F5",
  "#1A6EBF",
  "#0F4C81",  // darkest
]

// 커스텀 범례: 항목명 N개 (X.X%) 형태
const renderLegend = (total: number) => (props: any) => {
  const { payload } = props
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
      {payload.map((entry: any, index: number) => {
        const value = entry.payload.value
        const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"
        return (
          <li key={index} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block", flexShrink: 0, boxShadow: `0 0 6px ${entry.color}99` }} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.value}</span>
            <span style={{ flexShrink: 0, fontFamily: "var(--font-geist)", color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>
              {Number(value).toLocaleString()}개
            </span>
            <span style={{ flexShrink: 0, fontFamily: "var(--font-geist)", color: "#64B4FF", fontSize: "11px", minWidth: "42px", textAlign: "right" }}>
              {pct}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function DarkTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length || total === 0) return null
  const { name, value } = payload[0].payload
  const percent = ((value / total) * 100).toFixed(1)
  return (
    <div className="px-4 py-3 rounded-xl text-[13px] font-medium border glass-card-elevated"
      style={{ background: "rgba(13,27,42,0.95)", borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: payload[0].fill }} />
        <span style={{ color: "rgba(255,255,255,0.6)" }}>{name}</span>
      </div>
      <div className="pl-4 font-geist" style={{ color: "#A8D8F0" }}>
        {Number(value).toLocaleString()}개
        <span className="ml-2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>({percent}%)</span>
      </div>
    </div>
  )
}

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="glass-card relative p-6 min-w-0 group"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}>
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <h3 className="text-[14px] font-semibold text-[var(--color-bone)] mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]" style={{ background: "#64B4FF" }} />
        {title}
      </h3>
      <div className="w-full relative font-geist">{children}</div>
    </div>
  )
}

export default function DistributionCharts({ teachingMethodData, creditData, totalCourses }: DistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="수업방법 유형 분포" delay={350}>
        {/* 도넛 차트 */}
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={teachingMethodData} cx="50%" cy="50%" innerRadius={70} outerRadius={92}
                paddingAngle={0} dataKey="value"
                stroke="#ffffff" strokeWidth={1.5} cornerRadius={2}
                label={false} labelLine={false}>
                {teachingMethodData.map((_, index) => (
                  <Cell key={index} fill={NEON_COLORS[index % NEON_COLORS.length]} opacity={0.85} />
                ))}
                <Label value={`총 ${totalCourses.toLocaleString()}개`} position="center"
                  style={{ fontSize: "13px", fill: "rgba(255,255,255,0.85)", fontWeight: "600" }} />
              </Pie>
              <Tooltip content={<DarkTooltip total={totalCourses} />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 커스텀 범례 */}
        <div className="mt-3 px-1">
          {teachingMethodData.map((entry, index) => {
            const pct = totalCourses > 0 ? ((entry.value / totalCourses) * 100).toFixed(1) : "0.0"
            const color = NEON_COLORS[index % NEON_COLORS.length]
            return (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "rgba(255,255,255,0.75)", marginBottom: "5px", fontFamily: "var(--font-sans)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}99` }} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</span>
                <span style={{ flexShrink: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "var(--font-geist)" }}>{Number(entry.value).toLocaleString()}개</span>
                <span style={{ flexShrink: 0, color: "#64B4FF", fontSize: "11px", minWidth: "42px", textAlign: "right", fontFamily: "var(--font-geist)" }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </ChartCard>

      <ChartCard title="학점 구성 비율" delay={450}>
        {/* 도넛 차트 */}
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={creditData} cx="50%" cy="50%" innerRadius={70} outerRadius={92}
                paddingAngle={0} dataKey="value"
                stroke="#ffffff" strokeWidth={1.5} cornerRadius={2}
                label={false} labelLine={false}>
                {creditData.map((_, index) => (
                  <Cell key={index} fill={NEON_COLORS[index % NEON_COLORS.length]} opacity={0.85} />
                ))}
                <Label value={`총 ${totalCourses.toLocaleString()}개`} position="center"
                  style={{ fontSize: "13px", fill: "rgba(255,255,255,0.85)", fontWeight: "600" }} />
              </Pie>
              <Tooltip content={<DarkTooltip total={totalCourses} />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 커스텀 범례 */}
        <div className="mt-3 px-1">
          {creditData.map((entry, index) => {
            const pct = totalCourses > 0 ? ((entry.value / totalCourses) * 100).toFixed(1) : "0.0"
            const color = NEON_COLORS[index % NEON_COLORS.length]
            return (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "rgba(255,255,255,0.75)", marginBottom: "5px", fontFamily: "var(--font-sans)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}99` }} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</span>
                <span style={{ flexShrink: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "var(--font-geist)" }}>{Number(entry.value).toLocaleString()}개</span>
                <span style={{ flexShrink: 0, color: "#64B4FF", fontSize: "11px", minWidth: "42px", textAlign: "right", fontFamily: "var(--font-geist)" }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </ChartCard>
    </div>
  )
}

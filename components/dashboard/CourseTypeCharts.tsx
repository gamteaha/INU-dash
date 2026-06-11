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

const HIGHLIGHT = "var(--color-signal-orange)"
const BASE = "var(--color-slate)"

/* ── Custom Tooltip ──────────────────────────────────── */
function CountTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-chalk)] rounded-[6px] px-3 py-2 shadow-[var(--shadow-card)] text-[12px] font-normal text-[var(--color-carbon)]">
      {name}: {Number(value).toLocaleString()}개
    </div>
  )
}

function AvgTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-chalk)] rounded-[6px] px-3 py-2 shadow-[var(--shadow-card)] text-[12px] font-normal text-[var(--color-carbon)]">
      {name}: {Number(value).toFixed(1)}명
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
      className="bg-[var(--color-paper)] rounded-lg p-6 min-w-0 shadow-[var(--shadow-card)] border-none"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      <h3 className="text-[14px] font-semibold text-[var(--color-carbon)] mb-5 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal-orange)]" />
        {title}
      </h3>
      {children}
    </div>
  )
}

/* ── Main component ──────────────────────────────────── */
export default function CourseTypeCharts({
  byCourseTypeCount,
  byCourseTypeAvgEnroll,
}: CourseTypeChartsProps) {
  const sortedCount = [...byCourseTypeCount].sort((a, b) => b.value - a.value)
  const sortedAvg = [...byCourseTypeAvgEnroll].sort((a, b) => b.value - a.value)

  const chartHeight = Math.max(sortedCount.length, sortedAvg.length) * 38 + 20

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1 — 이수구분별 강좌 수 */}
      <ChartCard title="이수구분별 강좌 수" delay={320}>
        <div style={{ height: chartHeight, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <BarChart
              data={sortedCount}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "var(--color-slate)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fill: "var(--color-graphite)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CountTooltip />} cursor={{ fill: "var(--color-fog)" }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={16}
                activeBar={{ fillOpacity: 0.8 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {sortedCount.map((_, idx) => (
                  <Cell key={idx} fill={idx === 0 ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Chart 2 — 이수구분별 평균 수강인원 */}
      <ChartCard title="이수구분별 평균 수강인원" delay={400}>
        <div style={{ height: chartHeight, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <BarChart
              data={sortedAvg}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "var(--color-slate)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fill: "var(--color-graphite)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<AvgTooltip />} cursor={{ fill: "var(--color-fog)" }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={16}
                activeBar={{ fillOpacity: 0.8 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {sortedAvg.map((_, idx) => (
                  <Cell key={idx} fill={idx === 0 ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}

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

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

const HIGHLIGHT = "var(--color-signal-orange)"
const BASE = "var(--color-slate)"

/* ── Custom Tooltips ─────────────────────────────────── */
function DayTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-chalk)] rounded-[6px] px-3 py-2 shadow-[var(--shadow-card)] text-[12px] font-normal text-[var(--color-carbon)]">
      {name}: {Number(value).toLocaleString()}개
    </div>
  )
}

function TimeSlotTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-chalk)] rounded-[6px] px-3 py-2 shadow-[var(--shadow-card)] text-[12px] font-normal text-[var(--color-carbon)]">
      {name}: {Number(value).toLocaleString()}개
    </div>
  )
}

/* ── Shared Card Wrapper ─────────────────────────────── */
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

export default function TimeCharts({
  dayData,
  timeSlotData,
}: TimeChartsProps) {
  // Find highest index for highlighting
  let maxDayValue = -1
  let maxDayIdx = 0
  dayData.forEach((d, i) => {
    if (d.value > maxDayValue) {
      maxDayValue = d.value
      maxDayIdx = i
    }
  })

  let maxTimeValue = -1
  let maxTimeIdx = 0
  timeSlotData.forEach((d, i) => {
    if (d.value > maxTimeValue) {
      maxTimeValue = d.value
      maxTimeIdx = i
    }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: 요일별 수업 강좌 수 */}
      <ChartCard title="요일별 수업 강좌 수" delay={640}>
        <div className="h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dayData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "var(--color-slate)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={30}
                tick={{ fill: "var(--color-graphite)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<DayTooltip />} cursor={{ fill: "var(--color-fog)" }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={16}
                activeBar={{ fillOpacity: 0.8 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {dayData.map((_, idx) => (
                  <Cell key={idx} fill={idx === maxDayIdx ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Chart 2: 수업 시간별 강좌 수 */}
      <ChartCard title="수업 시간별 강좌 수" delay={720}>
        <div className="h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={timeSlotData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "var(--color-slate)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: "var(--color-graphite)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<TimeSlotTooltip />} cursor={{ fill: "var(--color-fog)" }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={16}
                activeBar={{ fillOpacity: 0.8 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {timeSlotData.map((_, idx) => (
                  <Cell key={idx} fill={idx === maxTimeIdx ? HIGHLIGHT : BASE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}

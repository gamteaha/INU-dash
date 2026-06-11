"use client"

import { useState, useCallback } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts"

interface ChartItem {
  name: string
  value: number
  percent: number
}

interface DistributionChartsProps {
  teachingMethodData: ChartItem[]
  creditData: ChartItem[]
  totalCourses: number
}

/* ── 색상 팔레트 ───────────────────────────────────────── */
const METHOD_COLORS = ["#ff682c", "#816729", "#828282", "#a6a6a6", "#cccccc"]
const CREDIT_COLORS = ["#ff682c", "#816729", "#828282", "#a6a6a6", "#cccccc"]

/* ── 커스텀 Active Shape (hover 확대) ────────────────────── */
function ActiveShape(props: any) {
  const {
    cx, cy,
    innerRadius, outerRadius,
    startAngle, endAngle,
    fill,
  } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="white"
      strokeWidth={2}
    />
  )
}

/* ── 커스텀 툴팁 ──────────────────────────────────────────── */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload as ChartItem
  return (
    <div className="bg-[var(--color-paper)] border border-[var(--color-chalk)] rounded-[6px] px-4 py-2.5 shadow-[var(--shadow-card)] text-xs">
      <p className="font-semibold text-[var(--color-carbon)] mb-1">{item.name}</p>
      <p className="text-[var(--color-slate)]">
        {item.value.toLocaleString()}개 &nbsp;·&nbsp;
        <span className="font-semibold text-[var(--color-signal-orange)]">{item.percent.toFixed(1)}%</span>
      </p>
    </div>
  )
}

/* ── 단일 도넛 차트 카드 ────────────────────────────────── */
function DonutCard({
  title,
  centerLabel,
  centerValue,
  data,
  colors,
  delay = 0,
}: {
  title: string
  centerLabel: string
  centerValue: number
  data: ChartItem[]
  colors: string[]
  delay?: number
}) {
  const [activeIdx, setActiveIdx] = useState<number | undefined>(undefined)

  const onEnter = useCallback((_: any, idx: number) => setActiveIdx(idx), [])
  const onLeave = useCallback(() => setActiveIdx(undefined), [])

  return (
    <div
      className="bg-[var(--color-paper)] rounded-lg p-6 min-w-0 shadow-[var(--shadow-card)] border-none"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      {/* Title */}
      <h3 className="text-[14px] font-semibold text-[var(--color-carbon)] mb-5 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal-orange)]" />
        {title}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0 w-[160px] h-[160px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                {...({
                  activeIndex: activeIdx,
                  activeShape: ActiveShape,
                  onMouseEnter: onEnter,
                  onMouseLeave: onLeave,
                  isAnimationActive: true,
                  animationDuration: 800,
                  animationEasing: "ease-out",
                } as any)}
              >
                {data.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={colors[idx % colors.length]}
                    style={{ cursor: "pointer", outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-[9px] font-medium text-[var(--color-slate)] uppercase tracking-widest leading-tight">
              {centerLabel}
            </span>
            <span className="text-[17px] font-semibold text-[var(--color-carbon)] leading-tight mt-0.5">
              {centerValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 w-full space-y-2.5">
          {data.map((item, idx) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 group"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(undefined)}
              style={{ cursor: "default" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-150 group-hover:scale-125"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="text-xs text-[var(--color-graphite)] truncate leading-snug">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-carbon)] shrink-0 tabular-nums">
                {item.percent.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ─────────────────────────────────────── */
export default function DistributionCharts({
  teachingMethodData,
  creditData,
  totalCourses,
}: DistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DonutCard
        title="수업방법 유형 분포"
        centerLabel="TOTAL"
        centerValue={totalCourses}
        data={teachingMethodData}
        colors={METHOD_COLORS}
        delay={480}
      />
      <DonutCard
        title="학점 구성 비율"
        centerLabel="COURSES"
        centerValue={totalCourses}
        data={creditData}
        colors={CREDIT_COLORS}
        delay={560}
      />
    </div>
  )
}

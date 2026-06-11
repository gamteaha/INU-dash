"use client"

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Rectangle
} from "recharts"
import { useBrandColors } from "@/hooks/useBrandColors"

interface CourseTypeChartsProps {
  byCourseTypeCount: { name: string; value: number }[]
  byCourseTypeAvgEnroll: { name: string; value: number }[]
}

function DarkTooltip({ active, payload, suffix = "" }: any) {
  const { blue, orange, isLight } = useBrandColors()
  
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  const isGenEd = name.includes("교양")
  const color = isGenEd ? orange[0] : blue[0]
  const glowColor = isGenEd ? `${orange[0]}66` : `${blue[0]}66`

  return (
    <div className="px-4 py-3 rounded-xl text-[13px] font-medium border glass-card-elevated"
      style={{ background: isLight ? "rgba(255,255,255,0.95)" : "rgba(8,20,42,0.92)", borderColor: glowColor, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full shadow-md" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></span>
        <p style={{ color: isLight ? "#1a202c" : "rgba(255,255,255,0.85)" }} className="mb-0">{name}</p>
      </div>
      <p className="font-geist text-[14px] mt-1 pl-4" style={{ color: isLight ? "#2d3748" : "var(--color-paper)" }}>
        <span className="font-bold" style={{ color }}>{typeof value === "number" ? value.toLocaleString() : value}</span>
        <span className="text-[12px] ml-1" style={{ color: isLight ? "#718096" : "rgba(255,255,255,0.6)" }}>{suffix}</span>
      </p>
    </div>
  )
}

function GradientBar(props: any) {
  const { x, y, width, height, payload } = props
  const isGenEd = payload.name.includes("교양")
  const gradientUrl = isGenEd ? "url(#barGradientOrange)" : "url(#barGradientBlue)"
  
  // y가 NaN이거나 height가 음수인 경우 에러 방지
  if (typeof y !== 'number' || typeof height !== 'number' || height < 0) return null;

  return (
    <rect
      x={x} y={y} width={width} height={height}
      rx={6} ry={6}
      fill={gradientUrl}
      style={{ transition: "all 0.3s ease" }}
    />
  )
}

function CustomActiveBar(props: any) {
  const { payload } = props
  const isGenEd = payload?.name?.includes("교양")
  return <Rectangle {...props} fill={isGenEd ? "url(#barGradientOrangeActive)" : "url(#barGradientBlueActive)"} filter="brightness(1.15)" />
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

function ChartDefs() {
  const { blue, orange } = useBrandColors()
  
  return (
    <defs>
      {/* 기본/액티브 블루 그라데이션 */}
      <linearGradient id="barGradientBlue" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={blue[2]} />
        <stop offset="100%" stopColor={blue[1]} />
      </linearGradient>
      <linearGradient id="barGradientBlueActive" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={blue[0]} />
        <stop offset="100%" stopColor={blue[1]} />
      </linearGradient>
      
      {/* 기본/액티브 오렌지 그라데이션 */}
      <linearGradient id="barGradientOrange" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={orange[2]} />
        <stop offset="100%" stopColor={orange[1]} />
      </linearGradient>
      <linearGradient id="barGradientOrangeActive" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={orange[0]} />
        <stop offset="100%" stopColor={orange[1]} />
      </linearGradient>
    </defs>
  )
}

export default function CourseTypeCharts({ byCourseTypeCount, byCourseTypeAvgEnroll }: CourseTypeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="이수구분별 강좌 수" delay={150}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCourseTypeCount} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={16}>
            <ChartDefs />
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-mist)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-mist)" }} dx={-8} />
            <Tooltip content={<DarkTooltip suffix="개" />} cursor={{ fill: "rgba(100,180,255,0.08)" }} />
            <Bar dataKey="value" shape={<GradientBar />} activeBar={<CustomActiveBar />} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="이수구분별 평균 수강인원" delay={250}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCourseTypeAvgEnroll} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barSize={16}>
            <ChartDefs />
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-mist)", fontFamily: "var(--font-sans)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-mist)" }} dx={-8} />
            <Tooltip content={<DarkTooltip suffix="명" />} cursor={{ fill: "rgba(100,180,255,0.08)" }} />
            <Bar dataKey="value" radius={[6,6,0,0]} activeBar={<CustomActiveBar />}>
              {byCourseTypeAvgEnroll.map((entry, index) => {
                const isGenEd = entry.name.includes("교양")
                return (
                  <Cell 
                    key={index} 
                    fill={isGenEd ? "url(#barGradientOrange)" : "url(#barGradientBlue)"} 
                    style={{ transition: "all 0.3s ease" }} 
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface DistributionChartsProps {
  teachingMethodData: { name: string; value: number }[]
  creditData: { name: string; value: number }[]
  totalCourses: number
}

import { useBrandColors } from "@/hooks/useBrandColors"

function Pie3DChart({
  data,
  total,
  title,
  delay = 0,
  colors
}: {
  data: { name: string; value: number }[]
  total: number
  title: string
  delay?: number
  colors: { blue: string[]; orange: string[]; isLight: boolean }
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" })
    instanceRef.current = chart

    const { blue, orange, isLight } = colors
    const PALETTE = isLight 
      ? ["#FDBA74", "#EA580C", "#FED7AA", "#C2410C", "#FFEDD5", "#9A3412"]
      : ["#5BC8F5", "#1A6EBF", "#A8D8F0", "#7B9EBF", "#3D7EAA", "#C8E8FF"]

    const maxVal = Math.max(...data.map(d => d.value)) || 1

    // 데이터에 isMax 등 추가 정보 매핑
    const mappedData = data.map((d, i) => {
      const isMax = d.value === maxVal && maxVal > 0
      const pointColorLight = blue[1]
      const pointColorDark = orange[1]
      const pointColorDarkerLight = blue[2]
      const pointColorDarkerDark = orange[2]
      
      return {
        name: d.name,
        value: d.value,
        isMax,
        itemStyle: {
          color: isMax
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: isLight ? pointColorLight : pointColorDark }, // 포인트 하이라이트
                { offset: 1, color: isLight ? pointColorDarkerLight : pointColorDarkerDark },
              ])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: PALETTE[i % PALETTE.length] },
                { offset: 1, color: PALETTE[(i + 1) % PALETTE.length] + "bb" },
              ]),
        },
        originalColor: isMax ? (isLight ? pointColorLight : pointColorDark) : PALETTE[i % PALETTE.length]
      }
    })

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0,
        formatter: (params: any) => {
          const d = params.data
          const isMax = d.isMax
          const borderColor = isMax ? (isLight ? blue[0] : orange[0]) : d.originalColor
          const textColor = isMax ? (isLight ? blue[1] : orange[1]) : d.originalColor
          const percent = ((d.value / total) * 100).toFixed(1)

          return `
            <div style="background:${isLight ? 'rgba(255,255,255,0.95)' : 'rgba(8,20,42,0.92)'}; border: 1px solid ${borderColor}; border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${textColor};box-shadow:0 0 8px ${textColor}"></span>
                <b style="color:${isLight ? '#1a202c' : 'rgba(255,255,255,0.85)'};font-size:13px;font-family:var(--font-sans)">${d.name}</b>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:flex-end; gap: 12px; margin-top: 4px;">
                <span style="color:${isLight ? '#718096' : 'rgba(255,255,255,0.7)'};font-size:12px">강좌 수:</span> 
                <span>
                  <span style="color:${textColor};font-weight:700;font-size:14px;font-family:var(--font-geist)">${Number(d.value).toLocaleString()}</span>
                  <span style="color:${isLight ? '#718096' : 'rgba(255,255,255,0.5)'};font-size:11px;margin-left:2px">(${percent}%)</span>
                </span>
              </div>
            </div>
          `
        },
      },
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: `총 ${total.toLocaleString()}개`,
            fill: isLight ? "#4a5568" : "rgba(255,255,255,0.85)",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-geist, monospace)",
          },
        },
      ],
      series: [
        {
          name: title,
          type: "pie",
          radius: ["52%", "75%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.08)",
            borderWidth: 2,
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.3)",
          },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 24,
              shadowOffsetX: 0,
              shadowColor: "rgba(91,200,245,0.5)",
              borderColor: "rgba(255,255,255,0.3)",
            },
            scale: true,
            scaleSize: 6,
          },
          data: mappedData,
        },
      ],
    }

    chart.setOption(option)

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartRef.current)

    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [data, total, title, colors])

  return (
    <div
      className="glass-card relative p-6 min-w-0 group"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <h3 className="text-[14px] font-semibold text-[var(--color-bone)] mb-4 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]"
          style={{ background: colors.blue[1] }}
        />
        {title}
      </h3>

      {/* 3D 기울기 효과 래퍼 */}
      <div
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          style={{
            transform: "rotateX(22deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div ref={chartRef} style={{ width: "100%", height: "240px" }} />
        </div>
      </div>

      {/* 커스텀 범례 */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d, index) => {
          const mappedItem = {
            originalColor: d.value === Math.max(...data.map(v => v.value)) && d.value > 0
              ? (colors.isLight ? colors.blue[1] : colors.orange[1])
              : (colors.isLight ? [colors.blue[0], colors.orange[0], colors.blue[2], colors.orange[2], colors.blue[4], colors.orange[4]][index % 6] : [colors.blue[1], colors.orange[1], colors.blue[3], colors.orange[3], colors.blue[5], colors.orange[5]][index % 6])
          }
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ background: mappedItem.originalColor }} />
              <span className="text-[12px] whitespace-nowrap" style={{ color: colors.isLight ? '#4a5568' : 'rgba(255,255,255,0.7)' }}>{d.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DistributionCharts({
  teachingMethodData,
  creditData,
  totalCourses,
}: DistributionChartsProps) {
  const colors = useBrandColors()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Pie3DChart data={teachingMethodData} total={totalCourses} title="수업 방법별 비중" delay={750} colors={colors} />
      <Pie3DChart data={creditData} total={totalCourses} title="학점별 비중" delay={850} colors={colors} />
    </div>
  )
}

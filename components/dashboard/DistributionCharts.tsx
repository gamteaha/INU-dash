"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface DistributionChartsProps {
  teachingMethodData: { name: string; value: number }[]
  creditData: { name: string; value: number }[]
  totalCourses: number
}

const PALETTE = ["#5BC8F5", "#1A6EBF", "#A8D8F0", "#7B9EBF", "#3D7EAA", "#C8E8FF"]

function Pie3DChart({
  data,
  total,
  title,
  delay = 0,
}: {
  data: { name: string; value: number }[]
  total: number
  title: string
  delay?: number
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" })
    instanceRef.current = chart

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(8,20,42,0.92)",
        borderColor: "rgba(100,180,255,0.35)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
        formatter: (params: any) => {
          const pct = ((params.value / total) * 100).toFixed(1)
          return `
            <div style="font-size:13px; padding:2px 0">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};margin-right:6px"></span>
              <b>${params.name}</b><br/>
              <span style="color:#A8D8F0;margin-left:14px">${Number(params.value).toLocaleString()}개 · ${pct}%</span>
            </div>
          `
        },
        extraCssText: "border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);",
      },
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: `총 ${total.toLocaleString()}개`,
            fill: "rgba(255,255,255,0.85)",
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
            borderColor: "rgba(255,255,255,0.08)",
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
          data: data.map((d, i) => ({
            name: d.name,
            value: d.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: PALETTE[i % PALETTE.length] },
                { offset: 1, color: PALETTE[(i + 1) % PALETTE.length] + "bb" },
              ]),
            },
          })),
        },
      ],
      // 3D 기울기 효과 - CSS perspective 사용
    }

    chart.setOption(option)

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartRef.current)

    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [data, total, title])

  return (
    <div
      className="glass-card relative p-6 min-w-0 group"
      style={{ animation: `cardEnter 400ms ease-out ${delay}ms both` }}
    >
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <h3 className="text-[14px] font-semibold text-[var(--color-bone)] mb-4 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]"
          style={{ background: "#64B4FF" }}
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
      <div className="mt-3 px-1 space-y-1.5">
        {data.map((entry, index) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0"
          const color = PALETTE[index % PALETTE.length]
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  boxShadow: `0 0 5px ${color}99`,
                }}
              />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {entry.name}
              </span>
              <span style={{ flexShrink: 0, color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                {Number(entry.value).toLocaleString()}개
              </span>
              <span style={{ flexShrink: 0, color: "#64B4FF", fontSize: "11px", minWidth: "40px", textAlign: "right" }}>
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DistributionCharts({ teachingMethodData, creditData, totalCourses }: DistributionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Pie3DChart data={teachingMethodData} total={totalCourses} title="수업방법 유형 분포" delay={350} />
      <Pie3DChart data={creditData} total={totalCourses} title="학점 구성 비율" delay={450} />
    </div>
  )
}

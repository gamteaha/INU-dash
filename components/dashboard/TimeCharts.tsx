"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

const PALETTE = ["#5BC8F5", "#1A6EBF", "#A8D8F0", "#7B9EBF", "#3D7EAA", "#C8E8FF"]

function Bar3DChart({
  data,
  title,
  delay = 0,
}: {
  data: { name: string; value: number }[]
  title: string
  delay?: number
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" })
    instanceRef.current = chart

    const maxVal = Math.max(...data.map((d) => d.value)) || 1

    const option: echarts.EChartsOption = {
      backgroundColor: "transparent",
      grid: {
        top: 20,
        right: 16,
        bottom: 40,
        left: 48,
        containLabel: false,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "none" },
        backgroundColor: "rgba(8,20,42,0.92)",
        borderColor: "rgba(100,180,255,0.35)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params
          return `
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#5BC8F5;margin-right:6px"></span>
            <b>${p.name}</b>&nbsp;&nbsp;
            <span style="color:#A8D8F0;font-weight:700">${Number(p.value).toLocaleString()}개</span>
          `
        },
        extraCssText: "border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;",
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.name),
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
        axisTick: { show: false },
        axisLabel: {
          color: "rgba(255,255,255,0.55)",
          fontSize: 12,
          fontFamily: "var(--font-sans, sans-serif)",
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)", type: "dashed" } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "rgba(255,255,255,0.35)",
          fontSize: 11,
          formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`),
        },
      },
      series: [
        {
          type: "bar",
          data: data.map((d, i) => ({
            value: d.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#1A6EBF" },
                { offset: 0.6, color: "#3D7EAA" },
                { offset: 1, color: "#5BC8F5" },
              ]),
              borderRadius: [6, 6, 0, 0],
              shadowBlur: d.value === maxVal ? 16 : 0,
              shadowColor: d.value === maxVal ? "rgba(91,200,245,0.5)" : "transparent",
            },
          })),
          barWidth: "55%",
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: "#1A6EBF" },
                { offset: 1, color: "#C8E8FF" },
              ]),
              shadowBlur: 20,
              shadowColor: "rgba(91,200,245,0.6)",
            },
          },
          // 3D 느낌을 위한 그라디언트 사이드 패널 (pseudo-3D)
          markPoint: {
            symbol: "none",
          },
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
  }, [data])

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
          perspective: "900px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            transform: "rotateX(8deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div ref={chartRef} style={{ width: "100%", height: "240px" }} />
        </div>
      </div>
    </div>
  )
}

export default function TimeCharts({ dayData, timeSlotData }: TimeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Bar3DChart data={dayData} title="요일별 수업 강좌 수" delay={550} />
      <Bar3DChart data={timeSlotData} title="수업 시간대별 강좌 수" delay={650} />
    </div>
  )
}

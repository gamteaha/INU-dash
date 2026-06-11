"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

function NeonBarChart({
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
    
    if (instanceRef.current) {
      instanceRef.current.dispose()
    }

    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" })
    instanceRef.current = chart

    const option = {
      backgroundColor: 'transparent',
      grid: {
        top: 35,
        right: 15,
        bottom: 25,
        left: 45,
      },
      tooltip: { 
        show: true,
        trigger: 'axis',
        axisPointer: { 
          type: 'shadow', 
          shadowStyle: { color: 'rgba(56, 189, 248, 0.04)' } 
        },
        backgroundColor: "rgba(8,20,42,0.92)",
        borderColor: "rgba(56,189,248,0.35)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
        formatter: (params: any) => {
          const p = params[0];
          return `
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#38BDF8;box-shadow:0 0 8px #38BDF8"></span>
              <b>${p.name}</b>
            </div>
            강좌 수: <span style="color:#38BDF8;font-weight:700;font-size:14px;margin-left:4px">${Number(p.value).toLocaleString()}개</span>
          `
        },
        extraCssText: "border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;"
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
        axisTick: { show: false },
        axisLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 12, fontFamily: 'var(--font-sans, sans-serif)' },
      },
      yAxis: {
        type: 'value',
        name: '강좌 수',
        nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11, align: 'right', padding: [0, 8, 0, 0] },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: 12 },
      },
      series: [{
        type: 'bar',
        data: data.map(d => d.value),
        barWidth: 32,  // 24~32px의 두툼한 볼륨감
        itemStyle: {
          borderRadius: [8, 8, 0, 0], // 상단이 둥근 캡슐 모양
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#38BDF8' }, // 라이트 스카이블루 (상단)
            { offset: 1, color: '#004B9B' }  // 인천대 딥블루 (하단)
          ]),
          // 네온 그림자 효과 (글로우)
          shadowBlur: 14,
          shadowColor: 'rgba(56, 189, 248, 0.45)',
          shadowOffsetY: 0,
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#7DD3FC' }, // Hover 시 더 밝게
              { offset: 1, color: '#0284C7' }  
            ]),
            shadowBlur: 24,
            shadowColor: 'rgba(56, 189, 248, 0.8)', // Hover 시 글로우 확장
          }
        }
      }],
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
          className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(56,189,248,0.6)]"
          style={{ background: "#38BDF8" }}
        />
        {title}
      </h3>

      <div ref={chartRef} style={{ width: "100%", height: "260px" }} />
    </div>
  )
}

export default function TimeCharts({ dayData, timeSlotData }: TimeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <NeonBarChart data={dayData} title="요일별 수업 강좌 수" delay={550} />
      <NeonBarChart data={timeSlotData} title="수업 시간대별 강좌 수" delay={650} />
    </div>
  )
}

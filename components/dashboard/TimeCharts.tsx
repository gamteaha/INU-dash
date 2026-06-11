"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import "echarts-gl"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

const PALETTE = ['#1A6EBF', '#2E8FD5', '#5BC8F5', '#A8D8F0']

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
    
    // Dispose before re-initializing if needed
    if (instanceRef.current) {
      instanceRef.current.dispose()
    }

    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" })
    instanceRef.current = chart

    const maxVal = Math.max(...data.map((d) => d.value)) || 1

    const option = {
      backgroundColor: 'transparent',
      tooltip: { 
        show: true,
        backgroundColor: "rgba(8,20,42,0.92)",
        borderColor: "rgba(100,180,255,0.35)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
        extraCssText: "border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;"
      },
      grid3D: {
        boxWidth: 200,
        boxDepth: 40,
        boxHeight: 80,
        viewControl: {
          alpha: 25,        // 수직 기울기 (위에서 내려다보는 각도)
          beta: 10,         // 수평 회전 각도
          autoRotate: false,
          rotateSensitivity: 0,  // 마우스로 회전 비활성화
          zoomSensitivity: 0,    // 줌 비활성화
        },
        light: {
          main: { intensity: 1.5, shadow: true },
          ambient: { intensity: 0.4 }
        },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      },
      xAxis3D: {
        type: 'category',
        data: data.map(d => d.name),
      },
      yAxis3D: {
        type: 'value',
        name: '강좌 수',
        nameTextStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      },
      zAxis3D: { type: 'value', show: false },
      series: [{
        type: 'bar3D',
        data: data.map((d, idx) => [idx, d.value, 0]),
        shading: 'lambert',   // 빛 반사로 입체감 표현
        itemStyle: {
          color: (params: any) => {
            // 높이에 따라 색상 그라디언트
            const ratio = params.data[1] / maxVal;
            const idx = Math.min(Math.floor(ratio * (PALETTE.length - 1)), PALETTE.length - 1);
            return PALETTE[idx];
          },
          opacity: 0.9,
        },
        emphasis: {
          itemStyle: { color: '#C8E8FF', opacity: 1 }
        },
        barSize: 14,  // 육면체 굵기
        tooltip: {
          formatter: (params: any) => {
            const categoryName = data[params.data[0]].name;
            return `
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#5BC8F5;margin-right:6px"></span>
              <b>${categoryName}</b><br/>
              강좌 수: <span style="color:#A8D8F0;font-weight:700">${Number(params.data[1]).toLocaleString()}개</span>
            `
          }
        }
      }],
    } as any

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

      <div ref={chartRef} style={{ width: "100%", height: "260px" }} />
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

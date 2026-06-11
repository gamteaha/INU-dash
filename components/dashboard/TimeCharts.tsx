"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

function IsometricBarChart({
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
        top: 40,
        right: 25,
        bottom: 25,
        left: 45,
      },
      tooltip: { 
        show: true,
        trigger: 'axis',
        axisPointer: { 
          type: 'shadow', 
          shadowStyle: { color: 'rgba(56, 189, 248, 0.05)' } 
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
        type: 'custom',
        name: '강좌 수',
        data: data.map(d => ({ name: d.name, value: d.value })),
        renderItem: (params: any, api: any) => {
          const location = api.coord([api.value(0), api.value(1)]);
          const start = api.coord([api.value(0), 0]);
          
          const x = location[0];
          const y = location[1];
          const y0 = start[1];
          
          // 값이 0이더라도 뚜껑이 바닥에 보이도록 최소 높이 설정
          const rawHeight = y0 - y;
          const h = Math.max(rawHeight, 4); 
          const currentY = y0 - h;
          
          // 입체 볼륨 사양
          const width = 32;       // 두툼한 폭 (28~36px 요구사항)
          const depth = 14;       // 측면 깊이(입체감)
          const offsetX = depth;  // X축 우측 기울기
          const offsetY = -depth; // Y축 상단 기울기
          
          // 기둥이 축 눈금 중앙에 오도록 오프셋 보정
          const cx = x - offsetX / 2;

          // 색상 및 명암 분리 (Shading)
          // 1. 윗면(뚜껑) - 가장 빛을 직접 받는 하이라이트
          const topColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#BAE6FD' }, 
            { offset: 1, color: '#38BDF8' }
          ]);
          
          // 2. 정면 - 밝은 스카이블루에서 묵직한 딥블루로
          const frontColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#38BDF8' }, 
            { offset: 1, color: '#004B9B' }  
          ]);
          
          // 3. 측면(그림자) - 한 단계 더 어둡고 깊이감 있는 톤
          const sideColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0284C7' }, 
            { offset: 1, color: '#002E5D' }  
          ]);

          // 기하학 꼭짓점 계산
          const pFL = [cx - width / 2, currentY];
          const pFR = [cx + width / 2, currentY];
          const pBL = [cx - width / 2 + offsetX, currentY + offsetY];
          const pBR = [cx + width / 2 + offsetX, currentY + offsetY];

          const pBottomFL = [cx - width / 2, y0];
          const pBottomFR = [cx + width / 2, y0];
          const pBottomBR = [cx + width / 2 + offsetX, y0 + offsetY];

          return {
            type: 'group',
            children: [
              // 측면 (우측면)
              {
                type: 'polygon',
                shape: { points: [pFR, pBottomFR, pBottomBR, pBR] },
                style: {
                  fill: sideColor,
                  shadowBlur: 16,
                  shadowColor: 'rgba(56, 189, 248, 0.25)',
                  shadowOffsetX: 4,
                  shadowOffsetY: 4
                }
              },
              // 정면
              {
                type: 'polygon',
                shape: { points: [pFL, pBottomFL, pBottomFR, pFR] },
                style: {
                  fill: frontColor,
                  shadowBlur: 8,
                  shadowColor: 'rgba(56, 189, 248, 0.5)' // 네온 글로우
                }
              },
              // 윗면 (뚜껑)
              {
                type: 'polygon',
                shape: { points: [pFL, pFR, pBR, pBL] },
                style: {
                  fill: topColor,
                  stroke: 'rgba(255,255,255,0.7)', // 반짝이는 모서리 엣지
                  lineWidth: 1
                }
              }
            ]
          };
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
      <IsometricBarChart data={dayData} title="요일별 수업 강좌 수" delay={550} />
      <IsometricBarChart data={timeSlotData} title="수업 시간대별 강좌 수" delay={650} />
    </div>
  )
}

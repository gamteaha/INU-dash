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

    const maxVal = Math.max(...data.map((d) => d.value)) || 1

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
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0,
        formatter: (params: any) => {
          const p = params[0];
          const isMax = p.value === maxVal;
          const borderColor = isMax ? 'rgba(249,115,22,0.4)' : 'rgba(56,189,248,0.35)';
          const textColor = isMax ? '#F97316' : '#38BDF8';
          
          return `
            <div style="background:rgba(8,20,42,0.92); border: 1px solid ${borderColor}; border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${textColor};box-shadow:0 0 8px ${textColor}"></span>
                <b style="color:rgba(255,255,255,0.85);font-size:13px;font-family:var(--font-sans)">${p.name}</b>
              </div>
              <span style="color:rgba(255,255,255,0.7);font-size:12px">강좌 수:</span> 
              <span style="color:${textColor};font-weight:700;font-size:14px;margin-left:4px;font-family:var(--font-geist)">${Number(p.value).toLocaleString()}개</span>
            </div>
          `
        }
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
          const val = api.value(1);
          const isMax = val === maxVal;
          
          const x = location[0];
          const y = location[1];
          const y0 = start[1];
          
          const rawHeight = y0 - y;
          const h = Math.max(rawHeight, 4); 
          const currentY = y0 - h;
          
          const width = 32;       
          const depth = 14;       
          const offsetX = depth;  
          const offsetY = -depth; 
          
          const cx = x - offsetX / 2;

          // 색상 분기 (Dual Color System)
          const topColor = isMax 
            ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#FED7AA' }, { offset: 1, color: '#FDBA74' }])
            : new echarts.graphic.LinearGradient(0, 0, 1, 1, [{ offset: 0, color: '#BAE6FD' }, { offset: 1, color: '#38BDF8' }]);
          
          const frontColor = isMax
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FDBA74' }, { offset: 1, color: '#F97316' }])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#38BDF8' }, { offset: 1, color: '#004B9B' }]);
          
          const sideColor = isMax
            ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#EA580C' }, { offset: 1, color: '#C2410C' }])
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#0284C7' }, { offset: 1, color: '#003366' }]);

          const glowColor = isMax ? 'rgba(249, 115, 22, 0.5)' : 'rgba(56, 189, 248, 0.5)';
          const sideGlowColor = isMax ? 'rgba(249, 115, 22, 0.25)' : 'rgba(56, 189, 248, 0.25)';

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
              {
                type: 'polygon',
                shape: { points: [pFR, pBottomFR, pBottomBR, pBR] },
                style: {
                  fill: sideColor,
                  shadowBlur: 16,
                  shadowColor: sideGlowColor,
                  shadowOffsetX: 4,
                  shadowOffsetY: 4
                }
              },
              {
                type: 'polygon',
                shape: { points: [pFL, pBottomFL, pBottomFR, pFR] },
                style: {
                  fill: frontColor,
                  shadowBlur: 8,
                  shadowColor: glowColor
                }
              },
              {
                type: 'polygon',
                shape: { points: [pFL, pFR, pBR, pBL] },
                style: {
                  fill: topColor,
                  stroke: 'rgba(255,255,255,0.7)',
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

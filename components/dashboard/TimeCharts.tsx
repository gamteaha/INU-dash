"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import { motion } from "framer-motion"
import { useBrandColors } from "@/hooks/useBrandColors"

interface TimeChartsProps {
  dayData: { name: string; value: number }[]
  timeSlotData: { name: string; value: number }[]
}

function IsometricBarChart({
  data,
  title,
  delay = 0,
  colors
}: {
  data: { name: string; value: number }[]
  title: string
  delay?: number
  colors: { blue: string[]; orange: string[]; isLight: boolean }
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)
  const { blue, orange, isLight } = colors

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
          const borderColor = isMax ? orange[0] : blue[0]
          const textColor = isMax ? orange[1] : blue[1]
          
          return `
            <div style="background:${isLight ? 'rgba(255,255,255,0.95)' : 'rgba(8,20,42,0.92)'}; border: 1px solid ${borderColor}; border-radius:12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); padding: 10px 14px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${textColor};box-shadow:0 0 8px ${textColor}"></span>
                <b style="color:${isLight ? '#1a202c' : 'rgba(255,255,255,0.85)'};font-size:13px;font-family:var(--font-sans)">${p.name}</b>
              </div>
              <span style="color:${isLight ? '#718096' : 'rgba(255,255,255,0.7)'};font-size:12px">강좌 수:</span> 
              <span style="color:${textColor};font-weight:700;font-size:14px;margin-left:4px;font-family:var(--font-geist)">${Number(p.value).toLocaleString()}개</span>
            </div>
          `
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLine: { lineStyle: { color: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)' } },
        axisTick: { show: false },
        axisLabel: { color: isLight ? '#4a5568' : 'rgba(255,255,255,0.8)', fontSize: 12, margin: 12, fontFamily: 'var(--font-sans, sans-serif)' },
      },
      yAxis: {
        type: 'value',
        name: '강좌 수',
        nameTextStyle: { color: isLight ? '#718096' : 'rgba(255,255,255,0.5)', fontSize: 11, align: 'right', padding: [0, 8, 0, 0] },
        splitLine: { lineStyle: { color: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)', type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: isLight ? '#a0aec0' : 'rgba(255,255,255,0.45)', fontSize: 11, margin: 12 },
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

          // 색상 분기 (Dual Color System, Light Mode 대응)
          const baseColor = isMax ? orange : blue;
          
          const topColor = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: baseColor[1] }, { offset: 1, color: baseColor[1] }
          ]);
          
          const frontColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor[1] }, { offset: 1, color: baseColor[0] }
          ]);
          
          const sideColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor[0] }, { offset: 1, color: baseColor[2] }
          ]);

          const glowColor = `${baseColor[0]}80`; // 50% opacity
          const sideGlowColor = `${baseColor[0]}40`; // 25% opacity

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
    <motion.div
      className="glass-card relative p-6 min-w-0 group"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay / 1000, ease: [0.25, 1, 0.5, 1] }}
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
    </motion.div>
  )
}

export default function TimeCharts({ dayData, timeSlotData }: TimeChartsProps) {
  const brandColors = useBrandColors()
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <IsometricBarChart data={dayData} title="요일별 수업 강좌 수" delay={550} colors={brandColors} />
      <IsometricBarChart data={timeSlotData} title="수업 시간대별 강좌 수" delay={650} colors={brandColors} />
    </div>
  )
}

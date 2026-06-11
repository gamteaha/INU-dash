"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useDashboardFilter } from "@/context/DashboardFilterContext"
import { mapCollegeName } from "@/lib/supabase/constants"
import { useBrandColors } from "@/hooks/useBrandColors"

declare global {
  interface Window { kakao: any }
}

// 겹치는 건물은 오프셋을 적용하여 분리
const buildings = [
  { name: "공과대학",         lat: 37.3733938, lng: 126.6328111, college: "공과대학" },
  { name: "도시과학대학",     lat: 37.3731200, lng: 126.6325000, college: "도시과학대학" },   // 남쪽으로 이동
  { name: "정보기술대학",     lat: 37.3744966, lng: 126.6334807, college: "정보기술대학" },
  { name: "자연과학대학",     lat: 37.3752000, lng: 126.6349000, college: "자연과학대학" },
  { name: "생명과학기술대학", lat: 37.3756000, lng: 126.6349000, college: "생명과학기술대학" }, // 북쪽으로 이동
  { name: "기초교육원",       lat: 37.3751448, lng: 126.6325671, college: "기초교육원" },
  { name: "인문대학",         lat: 37.3754641, lng: 126.6319879, college: "인문대학" },
  { name: "경영대학",         lat: 37.3761287, lng: 126.6326264, college: "경영대학" },
  { name: "글로벌정경대학",   lat: 37.3762500, lng: 126.6332681, college: "글로벌정경대학" },
  { name: "사회과학대학",     lat: 37.3759500, lng: 126.6338000, college: "사회과학대학" },   // 동쪽으로 이동
  { name: "예술체육대학",     lat: 37.3749000, lng: 126.6309000, college: "예술체육대학" },
  { name: "융합자유전공대학", lat: 37.3749000, lng: 126.6303000, college: "융합자유전공대학" },
  { name: "사범대학",         lat: 37.3815880, lng: 126.6542564, college: "사범대학" },
]

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [mapTypeId, setMapTypeId] = useState<"ROADMAP" | "SKYVIEW">("SKYVIEW")

  const { filteredCourses, selectedCollege, setSelectedCollege } = useDashboardFilter()
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null)
  const { blue, orange, isLight } = useBrandColors()

  const overlaysRef = useRef<any[]>([])

  // Load Script & Init Map
  useEffect(() => {
    if (document.getElementById('kakao-map-script')) {
      if (window.kakao && window.kakao.maps && !mapInstance) {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.3745, 126.6327),
            level: 3
          })
          setMapInstance(map)
          setIsLoaded(true)
        })
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'kakao-map-script'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.3745, 126.6327),
          level: 3
        })
        setMapInstance(map)
        setIsLoaded(true)
      })
    }
    script.onerror = () => console.error('카카오 스크립트 로드 실패 - 도메인 등록 확인')
    document.head.appendChild(script)
    return () => {}
  }, [mapInstance])

  // Update MapType
  useEffect(() => {
    if (mapInstance && window.kakao) {
      mapInstance.setMapTypeId(window.kakao.maps.MapTypeId[mapTypeId])
    }
  }, [mapInstance, mapTypeId])

  // Pan to 사범대학 if selected
  useEffect(() => {
    if (!mapInstance || !window.kakao) return
    if (selectedCollege === "사범대학") {
      mapInstance.panTo(new window.kakao.maps.LatLng(37.3815880, 126.6542564))
    } else {
      mapInstance.panTo(new window.kakao.maps.LatLng(37.3745, 126.6327))
    }
  }, [mapInstance, selectedCollege])

  // Aggregate stats
  const buildingStats = useMemo(() => {
    const stats: Record<string, { count: number; totalCapacity: number; totalEnrolled: number }> = {}
    buildings.forEach((b) => { stats[b.college] = { count: 0, totalCapacity: 0, totalEnrolled: 0 } })
    filteredCourses.forEach((course) => {
      const col = mapCollegeName(course["대학(원)"])
      if (col && stats[col]) {
        stats[col].count++
        stats[col].totalCapacity += Number(course.정원) || 0
        stats[col].totalEnrolled += Number(course.수강) || 0
      }
    })
    return stats
  }, [filteredCourses])

  const maxCourseCount = Math.max(...Object.values(buildingStats).map((s) => s.count)) || 1
  const minSize = 46
  const maxSize = 88

  // Render Overlays
  useEffect(() => {
    if (!mapInstance || !window.kakao) return

    // Clear old overlays
    overlaysRef.current.forEach(ov => ov.setMap(null))
    overlaysRef.current = []

    buildings.forEach((building) => {
      const stats = buildingStats[building.college]
      const courseCount = stats.count
      if (courseCount === 0) return

      const avgEnrolled = Math.round(stats.totalEnrolled / courseCount)
      const size = minSize + (courseCount / maxCourseCount) * (maxSize - minSize)
      const isHovered = hoveredBuilding === building.college
      const isRoadmap = mapTypeId === "ROADMAP"

      const content = document.createElement("div")
      content.style.position = "relative"
      content.style.display = "flex"
      content.style.flexDirection = "column"
      content.style.alignItems = "center"
      content.style.fontFamily = "var(--font-body)"
      content.style.zIndex = isHovered ? "30" : "10"

      // ── 버블 ───────────────────────────────────────────────────
      const bubble = document.createElement("div")
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`
      bubble.style.borderRadius = "50%"
      bubble.style.display = "flex"
      bubble.style.flexDirection = "column"
      bubble.style.alignItems = "center"
      bubble.style.justifyContent = "center"
      bubble.style.cursor = "pointer"
      bubble.style.transition = "transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s"
      bubble.style.userSelect = "none"
      bubble.style.position = "relative"
      bubble.style.overflow = "visible"

      // 글래스 버블 스타일 (지도일 땐 솔리드 컬러, 위성일 땐 글래스)
      // 라이트 모드이면 기본색상을 주황, 아니면 파랑으로.
      const solidColor = isLight ? orange[0] : "#1A6EBF"
      const solidHoverColor = isLight ? orange[1] : "#5BC8F5"
      const glassColor = isLight ? "rgba(249,115,22,0.22)" : "rgba(100,180,255,0.22)"
      const glassHoverColor = isLight ? "rgba(249,115,22,0.35)" : "rgba(91,200,245,0.35)"

      bubble.style.background = isRoadmap
        ? (isHovered ? solidHoverColor : solidColor)
        : (isHovered ? glassHoverColor : glassColor)
      bubble.style.backdropFilter = isRoadmap ? "none" : "blur(10px)"
      bubble.style.border = isHovered
        ? `1.5px solid ${isLight ? orange[1] : "rgba(91,200,245,0.9)"}`
        : (isRoadmap ? `1.5px solid ${solidColor}` : `1.5px solid ${isLight ? "rgba(249,115,22,0.6)" : "rgba(168,216,240,0.6)"}`)
      bubble.style.boxShadow = isHovered
        ? "0 0 20px rgba(91,200,245,0.5), inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 20px rgba(91,200,245,0.3)"
        : "0 0 12px rgba(100,180,255,0.3), inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 12px rgba(0,0,0,0.25)"

      // 버블 내부 하이라이트 (광택 효과 - 지도 모드일 땐 더 밝게)
      const highlight = document.createElement("div")
      highlight.style.cssText = `
        position: absolute; top: 12%; left: 20%; width: 38%; height: 28%;
        background: radial-gradient(ellipse, ${isRoadmap ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.55)"} 0%, transparent 80%);
        border-radius: 50%; pointer-events: none;
      `
      bubble.appendChild(highlight)

      // 텍스트
      const label = document.createElement("div")
      label.style.cssText = `
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 1px; position: relative; z-index: 1;
      `
      label.innerHTML = `
        <span style="
          color: #fff;
          font-size: ${size < 58 ? "12px" : "14px"};
          font-weight: 700;
          line-height: 1;
          text-shadow: 0 1px 4px rgba(0,60,120,0.6);
          font-family: 'Geist', sans-serif;
        ">${courseCount}</span>
        <span style="
          color: rgba(220,240,255,0.9);
          font-size: 9px;
          line-height: 1.3;
          text-shadow: 0 1px 3px rgba(0,40,100,0.5);
        ">강좌</span>
      `
      bubble.appendChild(label)

      bubble.onmouseenter = () => {
        bubble.style.transform = "scale(1.18)"
        bubble.style.background = isRoadmap ? solidHoverColor : (isLight ? "rgba(249,115,22,0.4)" : "rgba(91,200,245,0.4)")
        bubble.style.boxShadow = isRoadmap 
          ? `0 0 24px ${isLight ? "rgba(249,115,22,0.8)" : "rgba(91,200,245,0.8)"}` 
          : `0 0 24px ${isLight ? "rgba(249,115,22,0.6)" : "rgba(91,200,245,0.6)"}, inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 24px ${isLight ? "rgba(249,115,22,0.35)" : "rgba(91,200,245,0.35)"}`
        bubble.style.border = `1.5px solid ${isLight ? "rgba(249,115,22,0.95)" : "rgba(91,200,245,0.95)"}`
        setHoveredBuilding(building.college)
      }
      bubble.onmouseleave = () => {
        bubble.style.transform = "scale(1)"
        bubble.style.background = isRoadmap ? solidColor : glassColor
        bubble.style.boxShadow = isRoadmap
          ? `0 4px 12px ${isLight ? "rgba(249,115,22,0.5)" : "rgba(26,110,191,0.5)"}`
          : `0 0 12px ${isLight ? "rgba(249,115,22,0.3)" : "rgba(100,180,255,0.3)"}, inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 12px rgba(0,0,0,0.25)`
        bubble.style.border = isRoadmap ? `1.5px solid ${solidColor}` : `1.5px solid ${isLight ? "rgba(249,115,22,0.6)" : "rgba(168,216,240,0.6)"}`
        setHoveredBuilding(null)
      }
      bubble.onclick = (e) => {
        e.stopPropagation()
        setSelectedCollege(building.college)
      }

      content.appendChild(bubble)

      // ── Hover 툴팁 ──────────────────────────────────────────────
      if (isHovered) {
        const tooltip = document.createElement("div")
        tooltip.style.cssText = `
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(8,20,42,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(100,180,255,0.35);
          border-radius: 14px;
          padding: 12px 16px;
          min-width: 180px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(100,180,255,0.1);
          pointer-events: auto;
          white-space: nowrap;
          z-index: 50;
        `
        tooltip.onclick = (e) => e.stopPropagation()

        tooltip.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="width:8px; height:8px; border-radius:50%; background:#64B4FF; display:inline-block; box-shadow: 0 0 8px #64B4FF;"></span>
            <span style="font-size:14px; font-weight:700; color:#e8f4ff;">${building.name}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; gap:24px;">
              <span style="font-size:11px; color:rgba(168,216,240,0.7);">강좌 수</span>
              <span style="font-size:13px; font-weight:700; color:#A8D8F0; font-family:'Geist',sans-serif;">${courseCount}개</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:24px;">
              <span style="font-size:11px; color:rgba(168,216,240,0.7);">평균 수강</span>
              <span style="font-size:13px; font-weight:700; color:#A8D8F0; font-family:'Geist',sans-serif;">${avgEnrolled}명</span>
            </div>
          </div>
          <div style="width:100%; height:1px; background:rgba(100,180,255,0.15); margin-bottom:10px;"></div>
          <button id="goto-btn-${building.college}" style="
            width:100%; background:linear-gradient(135deg,#64B4FF,#1A6EBF);
            color:#fff; border-radius:9999px; padding:8px 16px;
            font-size:13px; font-weight:600; border:none; cursor:pointer;
            box-shadow: 0 2px 12px rgba(100,180,255,0.3);
            transition: opacity 0.15s;
          ">대시보드 보기 →</button>
          <div style="
            position:absolute; top:100%; left:50%; transform:translateX(-50%);
            border:7px solid transparent; border-top-color:rgba(8,20,42,0.92);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          "></div>
        `
        content.appendChild(tooltip)

        setTimeout(() => {
          const gotoBtn = document.getElementById(`goto-btn-${building.college}`)
          if (gotoBtn) {
            gotoBtn.onclick = (e) => {
              e.stopPropagation()
              setSelectedCollege(building.college)
            }
            gotoBtn.onmouseenter = () => { (gotoBtn as HTMLButtonElement).style.opacity = "0.85" }
            gotoBtn.onmouseleave = () => { (gotoBtn as HTMLButtonElement).style.opacity = "1" }
          }
        }, 0)
      }

      // 대학명 레이블 (버블 아래)
      const nameTag = document.createElement("div")
      nameTag.style.cssText = `
        margin-top: 5px;
        font-size: 10px;
        font-weight: 600;
        color: ${isRoadmap ? (isHovered ? "#1A6EBF" : "#004B9B") : (isHovered ? "#A8D8F0" : "rgba(200,232,255,0.8)")};
        text-shadow: ${isRoadmap ? "0 1px 2px rgba(255,255,255,0.8)" : "0 1px 4px rgba(0,20,60,0.8), 0 0 8px rgba(0,0,0,0.6)"};
        white-space: nowrap;
        letter-spacing: 0.02em;
        pointer-events: none;
      `
      nameTag.textContent = building.name
      content.appendChild(nameTag)

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(building.lat, building.lng),
        content: content,
        map: mapInstance,
        zIndex: isHovered ? 30 : 10,
        yAnchor: 0.5,
        xAnchor: 0.5,
      })

      overlaysRef.current.push(overlay)
    })
  }, [mapInstance, buildingStats, hoveredBuilding, maxCourseCount, setSelectedCollege, mapTypeId, isLight, blue, orange])

  return (
    <div className="glass-card p-6 md:p-8 mb-8 flex flex-col gap-6 min-h-[520px] overflow-hidden relative">
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[14px] font-semibold text-[var(--color-bone)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full inline-block shadow-[0_0_8px_rgba(100,180,255,0.6)]" style={{ background: "#64B4FF" }} />
          Campus Map
        </h3>
        <span className="text-[11px]" style={{ color: "rgba(168,216,240,0.6)" }}>
          버블 크기 = 강좌 수 비례 · 버블 hover 후 클릭으로 이동
        </span>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[480px] rounded-[14px] overflow-hidden border z-10"
        style={{ borderColor: "rgba(100,180,255,0.15)", background: "rgba(0,0,0,0.3)" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(8,12,20,0.8)" }}>
            <span className="text-[14px] font-medium animate-pulse" style={{ color: "rgba(168,216,240,0.7)" }}>
              Initializing map...
            </span>
          </div>
        )}
        {isLoaded && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {(["ROADMAP", "SKYVIEW"] as const).map(type => (
              <button key={type}
                onClick={() => setMapTypeId(type)}
                className="px-4 py-2 text-[12px] font-medium rounded-full transition-all backdrop-blur-md"
                style={mapTypeId === type
                  ? { background: "rgba(100,180,255,0.9)", color: "#0a0a0a", boxShadow: "0 0 12px rgba(100,180,255,0.4)" }
                  : { background: "rgba(8,20,42,0.75)", color: "rgba(168,216,240,0.8)", border: "1px solid rgba(100,180,255,0.25)" }
                }
              >
                {type === "ROADMAP" ? "지도" : "위성"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

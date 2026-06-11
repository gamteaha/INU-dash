"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useDashboardFilter } from "@/context/DashboardFilterContext"
import { COLLEGE_HIERARCHY, mapCollegeName } from "@/lib/supabase/constants"
import { X } from "lucide-react"
import { createRoot } from "react-dom/client"

declare global {
  interface Window {
    kakao: any
  }
}

const buildings = [
  // 08호관 — 공과대학 (Google Maps 실측)
  { name: "공과대학",           lat: 37.3733938, lng: 126.6328111, college: "공과대학" },
  // 08호관 — 도시과학대학 (공과대학과 같은 건물, 작은 오프셋)
  { name: "도시과학대학",       lat: 37.3733938, lng: 126.6325,    college: "도시과학대학" },
  // 07호관 — 정보기술대학 (Google Maps 실측)
  { name: "정보기술대학",       lat: 37.3744966, lng: 126.6334807, college: "정보기술대학" },
  // 05호관 — 자연과학대학 + 생명과학기술대학 (같은 건물, 빗변 동쪽 직각 꼭짓점)
  { name: "자연과학대학",       lat: 37.3752,    lng: 126.6347,    college: "자연과학대학" },
  { name: "생명과학기술대학",   lat: 37.3755,    lng: 126.6347,    college: "생명과학기술대학" },
  // 기초교육원 (기존 사회과학대학 위치)
  { name: "기초교육원",         lat: 37.3751448, lng: 126.6325671, college: "기초교육원" },
  // 15호관 — 인문대학 (Google Maps 실측)
  { name: "인문대학",           lat: 37.3754641, lng: 126.6319879, college: "인문대학" },
  // 14호관 — 경영대학 (Google Maps 실측)
  { name: "경영대학",         lat: 37.3761287, lng: 126.6326264, college: "경영대학" },
  // 13호관 — 글로벌정경대학 (유저 제공 좌표)
  { name: "글로벌정경대학",   lat: 37.37608802566786, lng: 126.63326810964642, college: "글로벌정경대학" },
  // 13호관 — 사회과학대학 (글로벌정경대학과 같은 건물, 미세 오프셋)
  { name: "사회과학대학",       lat: 37.37608802566786, lng: 126.63336810964642, college: "사회과학대학" },
  // 16호관 — 예술체육대학 (조금 더 남쪽)
  { name: "예술체육대학",       lat: 37.3749,    lng: 126.6309,    college: "예술체육대학" },
  // 융합자유전공대학 (예술체육대학보다 조금 더 서쪽)
  { name: "융합자유전공대학",   lat: 37.3749,    lng: 126.6303,    college: "융합자유전공대학" },
  // 미추홀캠퍼스 — 사범대학
  { name: "사범대학",           lat: 37.381588,  lng: 126.6542564, college: "사범대학" },
]

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [mapTypeId, setMapTypeId] = useState<"ROADMAP" | "SKYVIEW">("SKYVIEW")

  const { allCourses, setSelectedCollege } = useDashboardFilter()
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

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

    return () => {
      // document.head.removeChild(script)
    }
  }, [mapInstance])

  // Update MapType
  useEffect(() => {
    if (mapInstance && window.kakao) {
      mapInstance.setMapTypeId(window.kakao.maps.MapTypeId[mapTypeId])
    }
  }, [mapInstance, mapTypeId])

  // Aggregate stats
  const buildingStats = useMemo(() => {
    const stats: Record<string, { count: number; totalCapacity: number; totalEnrolled: number }> = {}
    buildings.forEach((b) => {
      stats[b.college] = { count: 0, totalCapacity: 0, totalEnrolled: 0 }
    })

    allCourses.forEach((course) => {
      const mainCollege = mapCollegeName(course["대학(원)"])

      if (mainCollege && stats[mainCollege]) {
        stats[mainCollege].count++
        stats[mainCollege].totalCapacity += Number(course.정원) || 0
        stats[mainCollege].totalEnrolled += Number(course.수강) || 0
      }
    })
    return stats
  }, [allCourses])

  const maxCourseCount = Math.max(...Object.values(buildingStats).map((s) => s.count)) || 1
  const minSize = 44
  const maxSize = 84

  // Render Overlays
  useEffect(() => {
    if (!mapInstance || !window.kakao) return

    // Clear old
    overlaysRef.current.forEach(overlay => {
      overlay.setMap(null)
      // If we used createRoot, we could unmount here, but we are using pure DOM manipulation
    })
    overlaysRef.current = []

    buildings.forEach((building) => {
      const stats = buildingStats[building.college]
      const courseCount = stats.count
      const avgEnrolled = courseCount > 0 ? Math.round(stats.totalEnrolled / courseCount) : 0
      const size = courseCount === 0 ? minSize : minSize + (courseCount / maxCourseCount) * (maxSize - minSize)

      const isSelected = selectedBuilding === building.college

      // Wrapper element
      const content = document.createElement("div")
      content.className = "relative flex flex-col items-center justify-center"
      content.style.fontFamily = "var(--font-body)"

      // Bubble
      const bubble = document.createElement("div")
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`
      bubble.style.background = isSelected ? "rgba(107,98,242,0.95)" : "rgba(29,29,29,0.88)"
      bubble.style.border = isSelected ? "2px solid rgba(107,98,242,0.8)" : "2px solid rgba(229,229,229,0.2)"
      bubble.style.borderRadius = "50%"
      bubble.style.display = "flex"
      bubble.style.flexDirection = "column"
      bubble.style.alignItems = "center"
      bubble.style.justifyContent = "center"
      bubble.style.cursor = "pointer"
      bubble.style.boxShadow = isSelected ? "0 0 16px rgba(107,98,242,0.5)" : "0 2px 12px rgba(0,0,0,0.5)"
      bubble.style.transition = "transform 0.18s, background 0.18s"
      bubble.style.userSelect = "none"
      bubble.style.backdropFilter = "blur(8px)"
      bubble.style.transform = "scale(1)"

      bubble.onmouseenter = () => bubble.style.transform = "scale(1.15)"
      bubble.onmouseleave = () => bubble.style.transform = "scale(1)"
      bubble.onclick = (e) => {
        e.stopPropagation()
        setSelectedBuilding(building.college)
      }

      bubble.innerHTML = `
        <span style="color: #e5e5e5; font-size: 13px; font-weight: 600; line-height: 1; font-family: 'Geist', sans-serif;">${courseCount}</span>
        <span style="color: rgba(229,229,229,0.6); font-size: 9px; line-height: 1.4;">강좌</span>
      `
      content.appendChild(bubble)

      // Popup
      if (isSelected) {
        const popup = document.createElement("div")
        popup.className = "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 min-w-[180px] pointer-events-auto z-[30]"
        popup.style.background = "rgba(29,29,29,0.92)"
        popup.style.backdropFilter = "blur(16px)"
        popup.style.border = "1px solid rgba(229,229,229,0.12)"
        popup.onclick = (e) => e.stopPropagation()

        popup.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 14px; font-weight: 600; color: #e5e5e5;">${building.college}</span>
            <button id="close-btn-${building.college}" style="color: #797979; background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;">✕</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
            <span style="font-size: 24px; color: #e5e5e5; line-height: 1; font-family: 'Geist', sans-serif; font-weight: 400;">${courseCount}개</span>
            <span style="font-size: 12px; color: #797979;">평균 수강인원: ${avgEnrolled}명</span>
          </div>
          <div style="width: 100%; height: 1px; background: rgba(229,229,229,0.1); margin: 8px 0;"></div>
          <button id="filter-btn-${building.college}" style="width: 100%; background: #e5e5e5; color: #0a0a0a; border-radius: 9999px; padding: 8px 16px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.15s;">필터 적용 →</button>
          <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: rgba(29,29,29,0.92);"></div>
        `
        content.appendChild(popup)

        // Bind event listeners asynchronously to ensure DOM exists inside the string
        setTimeout(() => {
          const closeBtn = document.getElementById(`close-btn-${building.college}`)
          if (closeBtn) closeBtn.onclick = () => setSelectedBuilding(null)

          const filterBtn = document.getElementById(`filter-btn-${building.college}`)
          if (filterBtn) {
            filterBtn.onclick = () => {
              setSelectedCollege(building.college)
              setSelectedBuilding(null)
            }
          }
        }, 0)
      }

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(building.lat, building.lng),
        content: content,
        map: mapInstance,
        zIndex: isSelected ? 20 : 10,
        yAnchor: 0.5,
        xAnchor: 0.5,
      })

      overlaysRef.current.push(overlay)
    })
  }, [mapInstance, buildingStats, selectedBuilding, maxCourseCount, setSelectedCollege])

  return (
    <div className="bg-[var(--color-char)]/85 backdrop-blur-[16px] rounded-[var(--radius-cards)] p-6 md:p-8 mb-8 shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex flex-col gap-6 border border-[var(--color-bone)]/10 min-h-[500px] overflow-hidden relative">

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[15px] font-medium text-[var(--color-bone)] flex items-center gap-3">
          Campus Map
        </h3>
        <span
          className="text-[11px] text-[var(--color-slate)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          버블 크기 = 강좌 수 비례
        </span>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[500px] rounded-[var(--radius-inputs)] overflow-hidden bg-[var(--color-void)] border border-[var(--color-bone)]/10 z-10">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {!isLoaded && (
          <div className="absolute inset-0 bg-[var(--color-char)]/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[14px] text-[var(--color-mist)] font-medium animate-pulse">Initializing map...</span>
          </div>
        )}
        {isLoaded && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => setMapTypeId("ROADMAP")}
              className={`px-4 py-2 text-[13px] font-medium rounded-[var(--radius-buttons)] transition-colors shadow-sm backdrop-blur-md ${
                mapTypeId === "ROADMAP"
                  ? "bg-[var(--color-bone)] text-[var(--color-void)]"
                  : "bg-[var(--color-char)]/80 text-[var(--color-bone)] border border-[var(--color-bone)]/10 hover:bg-[var(--color-iron)]"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapTypeId("SKYVIEW")}
              className={`px-4 py-2 text-[13px] font-medium rounded-[var(--radius-buttons)] transition-colors shadow-sm backdrop-blur-md ${
                mapTypeId === "SKYVIEW"
                  ? "bg-[var(--color-bone)] text-[var(--color-void)]"
                  : "bg-[var(--color-char)]/80 text-[var(--color-bone)] border border-[var(--color-bone)]/10 hover:bg-[var(--color-iron)]"
              }`}
            >
              Satellite
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

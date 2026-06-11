"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useDashboardFilter } from "@/context/DashboardFilterContext"
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
  // 13호관 — 글로벌정경대학 (동쪽 + 남쪽으로 이동)
  { name: "글로벌정경대학",   lat: 37.3756,    lng: 126.6323,    college: "글로벌정경대학" },
  // 13호관 — 사회과학대학 (글로벌정경대학과 같은 건물, 미세 오프셋)
  { name: "사회과학대학",       lat: 37.3756,    lng: 126.6325,    college: "사회과학대학" },
  // 16호관 — 예술체육대학 (조금 더 남쪽)
  { name: "예술체육대학",       lat: 37.3749,    lng: 126.6309,    college: "예술체육대학" },
  // 융합자유전공대학 (예술체육대학보다 조금 더 서쪽)
  { name: "융합자유전공대학",   lat: 37.3749,    lng: 126.6303,    college: "융합자유전공대학" },
]

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [mapTypeId, setMapTypeId] = useState<"ROADMAP" | "SKYVIEW">("ROADMAP")

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
      const col = course["대학(원)"]
      if (col && stats[col]) {
        stats[col].count++
        stats[col].totalCapacity += Number(course.정원) || 0
        stats[col].totalEnrolled += Number(course.수강) || 0
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
      bubble.style.background = "rgba(255,104,44,0.88)"
      bubble.style.border = "2.5px solid white"
      bubble.style.borderRadius = "50%"
      bubble.style.display = "flex"
      bubble.style.flexDirection = "column"
      bubble.style.alignItems = "center"
      bubble.style.justifyContent = "center"
      bubble.style.cursor = "pointer"
      bubble.style.boxShadow = "0 2px 12px rgba(255,104,44,0.45)"
      bubble.style.transition = "transform 0.18s"
      bubble.style.userSelect = "none"
      bubble.style.transform = "scale(1)"

      bubble.onmouseenter = () => bubble.style.transform = "scale(1.15)"
      bubble.onmouseleave = () => bubble.style.transform = "scale(1)"
      bubble.onclick = (e) => {
        e.stopPropagation()
        setSelectedBuilding(building.college)
      }

      bubble.innerHTML = `
        <span style="color: white; font-size: 13px; font-weight: 700; line-height: 1;">${courseCount}</span>
        <span style="color: rgba(255,255,255,0.8); font-size: 9px; line-height: 1.4;">강좌</span>
      `
      content.appendChild(bubble)

      // Popup
      if (isSelected) {
        const popup = document.createElement("div")
        popup.className = "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] p-4 min-w-[180px] pointer-events-auto z-[30]"
        popup.onclick = (e) => e.stopPropagation()

        popup.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <span class="text-[14px] font-semibold text-[#202020]">${building.college}</span>
            <button id="close-btn-${building.college}" class="text-[#828282] hover:text-[#202020] transition-colors cursor-pointer" style="border: none; background: none; padding: 0;">
              ✕
            </button>
          </div>
          <div class="flex flex-col gap-1 mb-3">
            <span class="text-[24px] text-[#ff682c] leading-none tracking-tight" style="font-family: var(--font-display)">${courseCount}개</span>
            <span class="text-[12px] text-[#828282]">평균 수강인원: ${avgEnrolled}명</span>
          </div>
          <div class="w-full h-[1px] bg-[#e8e8e8] my-3"></div>
          <button id="filter-btn-${building.college}" class="w-full bg-[#202020] text-white rounded-[20px] py-2 px-4 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-1 cursor-pointer" style="border: none;">
            → 대시보드 필터 적용
          </button>
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
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
    <div className="bg-[var(--color-paper)] rounded-lg p-6 min-w-0 shadow-[var(--shadow-card)] border-none">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14px] font-semibold text-[var(--color-carbon)] flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal-orange)]" />
          캠퍼스 강좌 분포 지도
        </h3>
        <span
          className="text-[11px] text-[var(--color-slate)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          버블 크기 = 강좌 수 비례
        </span>
      </div>

      <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-[var(--color-fog)] border border-[var(--color-chalk)]">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
            <p className="text-[14px] text-[var(--color-slate)] animate-pulse">지도 로딩 중...</p>
          </div>
        )}

        {isLoaded && (
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              onClick={() => setMapTypeId("SKYVIEW")}
              className={`bg-white border border-[#e8e8e8] rounded-lg px-3.5 py-2 text-[12px] font-medium cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f5f5] ${mapTypeId === "SKYVIEW" ? "text-[#ff682c] border-[#ff682c]" : "text-[#202020]"
                }`}
            >
              🛰 위성뷰
            </button>
            <button
              onClick={() => setMapTypeId("ROADMAP")}
              className={`bg-white border border-[#e8e8e8] rounded-lg px-3.5 py-2 text-[12px] font-medium cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f5f5] ${mapTypeId === "ROADMAP" ? "text-[#ff682c] border-[#ff682c]" : "text-[#202020]"
                }`}
            >
              🗺 지도뷰
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

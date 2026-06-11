"use client"

import { useState, useMemo } from "react"
import { Map, CustomOverlayMap, useKakaoLoader } from "react-kakao-maps-sdk"
import { useDashboardFilter } from "@/context/DashboardFilterContext"
import { X } from "lucide-react"

const buildings = [
  { name: "공과대학",       lat: 37.3728, lng: 126.6318, college: "공과대학" },
  { name: "정보기술대학",   lat: 37.3735, lng: 126.6325, college: "정보기술대학" },
  { name: "자연과학대학",   lat: 37.3742, lng: 126.6340, college: "자연과학대학" },
  { name: "인문대학",       lat: 37.3748, lng: 126.6315, college: "인문대학" },
  { name: "사회과학대학",   lat: 37.3750, lng: 126.6322, college: "사회과학대학" },
  { name: "글로벌경영대학", lat: 37.3755, lng: 126.6330, college: "글로벌경영대학" },
  { name: "도시과학대학",   lat: 37.3720, lng: 126.6310, college: "도시과학대학" },
  { name: "예술체육대학",   lat: 37.3760, lng: 126.6308, college: "예술체육학부" },
]

export default function CampusMap() {
  const { allCourses, setSelectedCollege } = useDashboardFilter()
  const [mapTypeId, setMapTypeId] = useState<"ROADMAP" | "SKYVIEW">("ROADMAP")
  const [selectedBuilding, setSelectedBuilding] = useState<typeof buildings[0] | null>(null)

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY as string,
  })

  // Aggregate courses per building
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
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-[14px] text-[var(--color-slate)]">
            지도를 불러오지 못했습니다
          </div>
        ) : loading ? (
          <div className="absolute inset-0 animate-pulse bg-[var(--color-fog)]" />
        ) : (
          <Map
            center={{ lat: 37.3745, lng: 126.6327 }}
            level={3}
            style={{ width: "100%", height: "100%" }}
            mapTypeId={window.kakao.maps.MapTypeId[mapTypeId]}
            onClick={() => setSelectedBuilding(null)}
          >
            {/* Top Right Controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <button
                onClick={() => setMapTypeId("SKYVIEW")}
                className={`bg-white border border-[#e8e8e8] rounded-lg px-3.5 py-2 text-[12px] font-medium cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f5f5] ${
                  mapTypeId === "SKYVIEW" ? "text-[#ff682c] border-[#ff682c]" : "text-[#202020]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                🛰 위성뷰
              </button>
              <button
                onClick={() => setMapTypeId("ROADMAP")}
                className={`bg-white border border-[#e8e8e8] rounded-lg px-3.5 py-2 text-[12px] font-medium cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f5f5f5] ${
                  mapTypeId === "ROADMAP" ? "text-[#ff682c] border-[#ff682c]" : "text-[#202020]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                🗺 지도뷰
              </button>
            </div>

            {/* Building Bubbles */}
            {buildings.map((building) => {
              const stats = buildingStats[building.college]
              const courseCount = stats.count
              const avgEnrolled =
                courseCount > 0 ? Math.round(stats.totalEnrolled / courseCount) : 0
              const size =
                courseCount === 0
                  ? minSize
                  : minSize + (courseCount / maxCourseCount) * (maxSize - minSize)

              const isSelected = selectedBuilding?.college === building.college

              return (
                <CustomOverlayMap
                  key={building.college}
                  position={{ lat: building.lat, lng: building.lng }}
                  zIndex={isSelected ? 20 : 10}
                  xAnchor={0.5}
                  yAnchor={0.5}
                >
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Bubble */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBuilding(building)
                      }}
                      style={{
                        width: size,
                        height: size,
                        background: "rgba(255,104,44,0.88)",
                        border: "2.5px solid white",
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 12px rgba(255,104,44,0.45)",
                        transition: "transform 0.18s",
                        userSelect: "none",
                        transform: "scale(1)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <span
                        style={{ color: "white", fontSize: 13, fontWeight: 700, lineHeight: 1 }}
                      >
                        {courseCount}
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: 9,
                          lineHeight: 1.4,
                        }}
                      >
                        강좌
                      </span>
                    </div>

                    {/* Info Popup Card */}
                    {isSelected && (
                      <div
                        className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] p-4 min-w-[180px] pointer-events-auto z-[30]"
                        style={{ fontFamily: "var(--font-body)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-semibold text-[#202020]">
                            {building.college}
                          </span>
                          <button
                            onClick={() => setSelectedBuilding(null)}
                            className="text-[#828282] hover:text-[#202020] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1 mb-3">
                          <span
                            className="text-[24px] text-[#ff682c] leading-none tracking-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {courseCount}개
                          </span>
                          <span className="text-[12px] text-[#828282]">
                            평균 수강인원: {avgEnrolled}명
                          </span>
                        </div>

                        <div className="w-full h-[1px] bg-[#e8e8e8] my-3" />

                        <button
                          onClick={() => {
                            setSelectedCollege(building.college)
                            setSelectedBuilding(null)
                          }}
                          className="w-full bg-[#202020] text-white rounded-[20px] py-2 px-4 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-1"
                        >
                          → 대시보드 필터 적용
                        </button>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                      </div>
                    )}
                  </div>
                </CustomOverlayMap>
              )
            })}
          </Map>
        )}
      </div>
    </div>
  )
}

import { BookOpen, Users, BarChart2, Globe } from "lucide-react"

interface OverviewCardsProps {
  totalCourses: number
  totalCapacity: number
  totalEnrolled: number
  englishLecturesCount: number
}

export default function OverviewCards({
  totalCourses,
  totalCapacity,
  totalEnrolled,
  englishLecturesCount,
}: OverviewCardsProps) {
  const avgEnrollRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0
  const englishRate = totalCourses > 0 ? (englishLecturesCount / totalCourses) * 100 : 0

  const cards = [
    {
      label: "총 강좌 수",
      value: `${totalCourses.toLocaleString()}`,
      icon: BookOpen,
    },
    {
      label: "총 수강인원",
      value: `${totalEnrolled.toLocaleString()}`,
      icon: Users,
    },
    {
      label: "평균 수강율",
      value: `${avgEnrollRate.toFixed(1)}%`,
      icon: BarChart2,
    },
    {
      label: "원어강의의 비율",
      value: `${englishRate.toFixed(1)}%`,
      icon: Globe,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[#6B7280]">{card.label}</span>
              <span className="text-2xl font-extrabold text-[#1A1D23] tracking-tight">{card.value}</span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-[#F4F6FB] flex items-center justify-center text-[#9CA3AF]">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

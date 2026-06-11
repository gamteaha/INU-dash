export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-[80px] animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[var(--color-char)]/60 rounded-[var(--radius-cards)] p-6 h-[148px] border border-[var(--color-bone)]/5"
          />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-[var(--color-char)]/60 rounded-[var(--radius-cards)] p-6 h-[340px] border border-[var(--color-bone)]/5"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-[var(--color-char)]/60 rounded-[var(--radius-cards)] p-6 h-[340px] border border-[var(--color-bone)]/5"
          />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-[var(--color-char)]/60 rounded-[var(--radius-cards)] p-6 h-[400px] border border-[var(--color-bone)]/5" />
    </div>
  )
}

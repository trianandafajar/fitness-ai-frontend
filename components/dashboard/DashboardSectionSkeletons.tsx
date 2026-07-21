function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface ${className}`} aria-hidden="true" />;
}

export function DashboardHeroSkeleton() {
  return <SkeletonBlock className="h-44 rounded-3xl" />;
}

export function DashboardSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="Loading summary" role="status">
      {[1, 2, 3, 4].map((item) => (
        <SkeletonBlock key={item} className="h-21" />
      ))}
    </div>
  );
}

export function DashboardInsightSkeleton() {
  return (
    <div aria-label="Loading summary insight" role="status">
      <SkeletonBlock className="h-20" />
    </div>
  );
}

export function DashboardRecommendationsSkeleton() {
  return (
    <div aria-label="Loading AI recommendations" role="status">
      <SkeletonBlock className="mb-3 h-5 w-56 rounded" />
      <div className="space-y-2">
        {[1, 2].map((item) => (
          <div key={item} className="animate-pulse rounded-2xl border border-line bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-surface" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-surface" />
                <div className="h-3 w-full rounded bg-surface" />
                <div className="h-3 w-1/2 rounded bg-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

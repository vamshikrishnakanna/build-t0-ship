/**
 * client/src/components/UI/LoadingSkeleton.jsx
 * Shimmer skeleton components for loading states.
 */

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-5 animate-pulse ${className}`}>
      <div className="skeleton h-4 w-2/3 mb-3 rounded" />
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-4/5 mb-4 rounded" />
      <div className="skeleton h-8 w-1/3 rounded-lg" />
    </div>
  );
}

export function SkeletonAdvisoryCard() {
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="skeleton h-5 w-48 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-white/5 p-4 space-y-3">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-2 w-full rounded-full" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

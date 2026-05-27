const SkeletonLoader = ({ rows = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse flex gap-4">
        <div className="h-4 bg-surface-container-high rounded w-1/4" />
        <div className="h-4 bg-surface-container-high rounded w-1/3" />
        <div className="h-4 bg-surface-container-high rounded w-1/5" />
        <div className="h-4 bg-surface-container-high rounded w-1/6" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;

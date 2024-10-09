export function SkeletonList() {
  return (
    <div className="animate-pulse">
      {Array(4)
        .fill('')
        .map((_, i) => (
          <div key={i}>
            <h1 className="my-2 h-4 rounded bg-gray-700"></h1>
            <div className="mb-8 h-16 rounded bg-gray-700"></div>
          </div>
        ))}
    </div>
  )
}

// components/TableSkeleton.tsx
const TableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500">Actors</th>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500">Last Runs</th>
            <th className="px-6 py-3 text-left text-sm font-medium tracking-wider text-gray-500">Last Tests</th>
          </tr>
        </thead>
        <tbody>
          {/* Render 5 skeleton rows */}
          {Array(4)
            .fill('')
            .map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-8 rounded bg-gray-700"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 rounded bg-gray-700"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 rounded bg-gray-700"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 rounded bg-gray-700"></div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSkeleton

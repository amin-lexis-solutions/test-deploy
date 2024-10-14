import { useMemo } from 'react'

type BadgeProps = {
  status?: string
}

export function BadgeComponent({ status }: BadgeProps) {
  const baseClasses = 'badge-text inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'

  const statusClasses: any = useMemo(
    () => ({
      SUCCEEDED: 'text-green-700 bg-green-50 ring-green-600/20',
      FAILED: 'text-red-700 bg-red-50 ring-red-600/10',
      'TIMED-OUT': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
      reliable: 'text-green-700 bg-green-50 ring-green-600/20',
      active: 'text-green-700 bg-green-50 ring-green-600/20',
      enabled: 'text-green-700 bg-green-50 ring-green-600/20',
      disabled: 'text-red-700 bg-red-50 ring-red-600/10',
      proxy: 'text-purple-700 bg-purple-50 ring-purple-600/20',
      default: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    }),
    []
  )

  const getBadgeClass = (status?: string) => {
    if (!status) return `${baseClasses} ${statusClasses.default}`
    if (status.toLowerCase().includes('proxy')) return `${baseClasses} ${statusClasses.proxy}`
    return `${baseClasses} ${statusClasses[status] || statusClasses.default}`
  }

  return <span className={getBadgeClass(status)}>{status || 'N/A'}</span>
}

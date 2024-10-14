import { useMemo } from 'react'

type BadgeProps = {
  status?: string
}

export function BadgeComponent({ status }: BadgeProps) {
  const baseClasses = 'badge-text inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'

  const statusClasses: any = useMemo(
    () => ({
      SUCCEEDED:
        'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-300 dark:bg-green-900/30 dark:ring-green-400/30',
      FAILED: 'text-red-700 bg-red-50 ring-red-600/10 dark:text-red-300 dark:bg-red-900/30 dark:ring-red-400/30',
      'TIMED-OUT':
        'text-yellow-800 bg-yellow-50 ring-yellow-600/20 dark:text-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-400/30',
      reliable:
        'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-300 dark:bg-green-900/30 dark:ring-green-400/30',
      active:
        'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-300 dark:bg-green-900/30 dark:ring-green-400/30',
      enabled:
        'text-green-700 bg-green-50 ring-green-600/20 dark:text-green-300 dark:bg-green-900/30 dark:ring-green-400/30',
      disabled: 'text-red-700 bg-red-50 ring-red-600/10 dark:text-red-300 dark:bg-red-900/30 dark:ring-red-400/30',
      proxy:
        'text-purple-700 bg-purple-50 ring-purple-600/20 dark:text-purple-300 dark:bg-purple-900/30 dark:ring-purple-400/30',
      default: 'text-gray-600 bg-gray-50 ring-gray-500/10 dark:text-gray-300 dark:bg-gray-800 dark:ring-gray-400/20',
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

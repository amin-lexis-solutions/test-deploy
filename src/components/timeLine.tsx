import { CheckCircleIcon } from '@heroicons/react/16/solid'
import Tooltip from './tooltip'

export function TimelineItem({
  title,
  status,
  date,
  data,
}: {
  title: string
  status: string
  date: string
  data: any
}) {
  function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()

    const diffInMs = now.getTime() - date.getTime() // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60) // Difference in minutes
    const diffInHours = Math.floor(diffInMinutes / 60) // Difference in hours
    const diffInDays = Math.floor(diffInHours / 24) // Difference in days

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours === 1 ? '' : 's'} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    } else {
      const options: any = { year: 'numeric', month: 'short', day: 'numeric' }
      return date.toLocaleDateString(undefined, options)
    }
  }

  return (
    <div className="relative">
      <li className="mb-6 ms-4">
        <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>

        <div className="flex items-center justify-between rounded-lg px-2 shadow-sm">
          <time className="mb-1 text-xs font-normal text-zinc-500 sm:order-last sm:mb-0">{timeAgo(date)}</time>
          <div className="flex items-center justify-between space-x-2 text-sm font-bold text-gray-500 dark:text-gray-300">
            <div>
              <Tooltip text={status}>
                {status ? (
                  <CheckCircleIcon height={18} color="#387407" className="ph-thin ph-check-circle"></CheckCircleIcon>
                ) : (
                  <></>
                )}
              </Tooltip>
            </div>
            <div>
              <span>{title}</span>
            </div>
          </div>
        </div>
        <div>
          {data && status == 'SUCCEEDED' && (
            <div className="row mt-4 flex justify-start space-x-4 rounded-lg border border-gray-500 bg-gray-50 px-2 py-2 text-xs font-normal text-gray-500 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <p>Created {data.createdCount}</p>
              <p>Updated {data.updatedCount}</p>
              <p>Archived {data.archivedCount ? data.archivedCount : 0}</p>
            </div>
          )}
        </div>
      </li>
    </div>
  )
}

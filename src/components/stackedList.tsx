import { formatNumberWithDots } from '@/utils/helpers'
import { useEffect, useState } from 'react'
import { BadgeComponent } from './badgeComponent'

export function StackedList({ data }: { data: any }) {
  const [selectedDomain, setSelectedDomain] = useState<any>(null)

  const handleSelectDomain = (domainData: any) => {
    if (selectedDomain && selectedDomain.domain === domainData.domain) {
      // If already selected, toggle visibility
      setSelectedDomain({ ...domainData, visible: !selectedDomain.visible })
    } else {
      // Select a new domain and set it to visible
      setSelectedDomain({ ...domainData, visible: true })
    }
  }

  useEffect(() => {}, [selectedDomain])

  return (
    <div className="w-full overflow-x-auto">
      <ul role="list" className="divide-y divide-gray-100">
        <li className="flex flex-col items-start justify-between gap-y-2 border-b border-zinc-200 px-2 py-3 sm:flex-row sm:items-center sm:gap-x-4 dark:border-white/5">
          <div className="flex w-full min-w-0 flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-4">
            <div className="w-full sm:w-20">
              <h3 className="list-text-1 truncate font-bold">{data[0]}</h3>
            </div>
            <div className="flex w-full items-center gap-x-2 sm:w-auto">
              <BadgeComponent status={data[1].enabled ? 'enabled' : 'disabled'} />
              <p className="text-sm leading-5 text-gray-500">{data[1].domains.length} Domains</p>
            </div>
            <div className="flex w-full items-center gap-x-4 sm:w-auto">
              <p className="text-sm leading-5 text-gray-500">
                {formatNumberWithDots(data[1].targetPagesCount)} Target pages
              </p>
              <p className="text-sm leading-5 text-gray-500">{formatNumberWithDots(data[1].itemsCount)} Items</p>
              <p className="text-sm leading-5 text-gray-500">
                {formatNumberWithDots(data[1].itemsSeenLast24h)} Items seen last 24h
              </p>
            </div>
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <button onClick={() => handleSelectDomain(data[1])} className="p-1">
              <svg
                className="h-4 w-4 transform text-gray-500 transition-transform duration-200 ease-in-out dark:text-gray-500"
                style={{ transform: selectedDomain?.visible ? 'rotate(180deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                />
              </svg>
            </button>
          </div>
        </li>
      </ul>

      {selectedDomain?.visible && (
        <ul className="px-2 py-2 sm:px-6" role="list">
          {selectedDomain?.domains.map((domain: any, index: number) => (
            <li
              key={index}
              className="flex flex-col items-start justify-between gap-y-2 border-b border-zinc-200 py-3 sm:flex-row sm:items-center sm:gap-x-4 dark:border-white/5"
            >
              <div className="flex w-full min-w-0 flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-4">
                <h1 className="list-child-text truncate text-sm leading-5 text-gray-500 dark:font-semibold">
                  {domain.domain}
                </h1>
                <div className="flex items-center gap-x-2">
                  <BadgeComponent status={domain.status} />
                  <BadgeComponent status={domain.reliability} />
                </div>
                <div className="flex items-center gap-x-4">
                  <p className="list-text-sm truncate text-xs leading-5 text-gray-500">
                    {formatNumberWithDots(domain.itemsCount)} items
                  </p>
                  <p className="block truncate text-xs leading-5 text-gray-500">
                    {formatNumberWithDots(domain.itemsSeenLast24h)} Items seen last 24h
                  </p>
                </div>
                {domain.proxy && (
                  <div className="flex items-center sm:mt-0">
                    <BadgeComponent status={`${domain.proxy} proxy`} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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
    <>
      <ul role="list" className="divide-y divide-gray-100">
        <li className="flex items-center justify-between gap-x-6 px-4 py-2">
          <div className="flex min-w-0 items-center gap-x-4">
            <h3 style={{ minWidth: '6ch' }} className="items-center font-bold">
              {data[0]}
            </h3>
            <div className="flex min-w-0 flex-auto items-center">
              <BadgeComponent status={data[1].enabled ? 'enabled' : 'disabled'}></BadgeComponent>
            </div>
            <div style={{ minWidth: '7ch' }} className="min-w-0 flex-auto">
              <p className="mt-1 truncate text-sm leading-5 text-gray-500">{data[1].domains.length} Domains</p>
            </div>
            <div style={{ minWidth: '12ch' }} className="min-w-0 flex-auto">
              <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                {formatNumberWithDots(data[1].targetPagesCount)} Target pages
              </p>
            </div>
            <div style={{ minWidth: '8ch' }} className="min-w-0 flex-auto">
              <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                {formatNumberWithDots(data[1].itemsCount)} Items
              </p>
            </div>
            <div className="min-w-0 flex-auto">
              <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                {formatNumberWithDots(data[1].itemsSeenLast24h)} {'Items seen last 24h'}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:items-center">
            <div className="ml-4">
              {selectedDomain?.visible ? (
                <svg
                  onClick={() => handleSelectDomain(data[1])}
                  className="h-4 w-4 text-gray-500 dark:text-gray-500"
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
                    d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
                  />
                </svg>
              ) : (
                <svg
                  onClick={() => handleSelectDomain(data[1])}
                  className="h-4 w-4 text-gray-500 dark:text-gray-500"
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
              )}
            </div>
          </div>
        </li>
      </ul>

      <div>
        {selectedDomain?.visible && (
          <ul role="list" className="mb-4">
            {selectedDomain?.domains.map((domain: any) => {
              return (
                <li className="mx-6 flex justify-between gap-x-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
                  <div className="flex min-w-0 items-center gap-x-4">
                    <h1 style={{ minWidth: '24ch' }} className="items-center text-xs font-semibold">
                      {domain.domain}
                    </h1>
                    <div className="flex min-w-0 items-center">
                      <BadgeComponent status={domain.status}></BadgeComponent>
                    </div>
                    <div className="flex min-w-0 items-center">
                      <BadgeComponent status={domain.reliability}></BadgeComponent>
                    </div>
                    <div style={{ minWidth: '8ch' }} className="flex min-w-0 items-center">
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {formatNumberWithDots(domain.itemsCount)} Items
                      </p>
                    </div>
                    <div className="flex min-w-0 items-center">
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {formatNumberWithDots(domain.itemsSeenLast24h)} {'Items seen last 24h'}
                      </p>
                    </div>
                    <div className="flex min-w-0 items-center">
                      {domain.proxy && <BadgeComponent status={`${domain.proxy} proxy`}></BadgeComponent>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}

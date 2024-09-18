'use client'
import { Badge } from '@/components/badge'
import { BadgeComponent } from '@/components/badgeComponent'
import { Divider } from '@/components/divider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'

import { formatDateString } from '@/utils/helpers'

import { useEffect, useState } from 'react'

import '../../styles/home.css'

export function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500">from last week</span>
      </div>
    </div>
  )
}

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
    <>
      <li className="mb-6 ms-4">
        <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>

        <div className="items-center justify-between rounded-lg px-2 shadow-sm sm:flex">
          <time className="mb-1 text-xs font-normal text-zinc-500 sm:order-last sm:mb-0">{timeAgo(date)}</time>
          <div className="justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
            <span>
              {title}
              {'  '}
            </span>
            <span className="ml-10 rounded bg-gray-300 px-2.5 py-1 text-xs font-normal text-gray-800 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {status}
            </span>
          </div>
        </div>
        <div>
          {data && status == 'SUCCEEDED' && (
            <div className="mt-4 flex flex-col rounded-lg border border-gray-500 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-500 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <span className="row flex-1 font-normal"> Created items {data.createdCount}</span>
              <span className="row flex-1 font-normal"> Updated items {data.updatedCount}</span>
              <span className="row flex-1 font-normal">
                {' '}
                Archived items {data.archivedCount ? data.archivedCount : 0}
              </span>
            </div>
          )}
        </div>
      </li>
    </>
  )
}

export default function Home() {
  const [actors, setActors] = useState([])
  const [runs, setRuns] = useState([])

  const [searchActor, setsearchActor] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  const getActors = async function () {
    const params = new URLSearchParams()
    if (searchActor) params.append('actor', searchActor) // Add name filter if provided
    if (statusFilter) params.append('status', statusFilter) // Add status filter if provided

    const response = await fetch(`/api/actors?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })
    const json = await response.json()
    setActors(json?.data?.results)
  }

  const getRuns = async function () {
    const response = await fetch(`/api/runs`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })

    const json = await response.json()
    setRuns(json.data.results)
  }

  useEffect(() => {
    getActors()
    getRuns()
    fetch('/api/auth/csrf')
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
  }, [searchActor, statusFilter])

  return (
    <>
      <div style={styles.container}>
        {/* Left Section (2/3 of the screen) */}
        <div style={{ ...styles.leftBox, ...styles.box }}>
          {/* <h2>Table 1</h2> */}
          <div>
            <div className="mb-4">
              <div className="mb-2">Actors</div>
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <form className="w-full">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    id="countries"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option selected value={''}>
                      Choose a status
                    </option>
                    <option value="RUNNING">Running</option>
                    <option value="SUCCEEDED">Success</option>
                    <option value="FAILED">Fail</option>
                    <option value="TIMED-OUT">Time out</option>
                  </select>
                </form>
                <form className="w-2/3">
                  <label className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                      <svg
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      value={searchActor}
                      onChange={(e) => setsearchActor(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Search Actor by name"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div style={{ ...styles.leftBox, ...styles.scrollable }}>
              {actors && (
                <Table className="mr-4 mt-2 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.8)]">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Actor</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Processed Run</TableHeader>
                      <TableHeader>Last Test</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actors.length > 0 ? (
                      actors?.map((actor: any) => (
                        <TableRow key={actor.id} title={`Actor #${actor.id}`}>
                          <TableCell>{actor.name}</TableCell>
                          <TableCell>
                            <BadgeComponent status={actor?.ProcessedRun[0]?.status}></BadgeComponent>
                          </TableCell>
                          <TableCell className="text-zinc-500">
                            <div className="flex-container">
                              <div className="row">{formatDateString(actor.lastRunAt)}</div>
                              <div className="row">Scraped {actor?.ProcessedRun[0]?.resultCount}</div>
                              <div className="row">Failed {actor?.ProcessedRun[0]?.failedCount}</div>
                            </div>
                          </TableCell>

                          <TableCell className="text-zinc-500">
                            {actor.test ? (
                              formatDateString(actor.test.lastRunAt)
                            ) : (
                              <BadgeComponent status={actor?.test?.status}></BadgeComponent>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        <p className="mt-4 text-sm text-zinc-500">No records found.</p>
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
        <div style={{ ...styles.box }}>
          <div>
            <div className="mb-4">Processed Run</div>
            <div style={{ ...styles.rightBox, ...styles.scrollable }}>
              <ol className="relative ml-2 mr-8 mt-2 border-s border-gray-200 dark:border-gray-700">
                {runs.map((run: any) => (
                  <TimelineItem
                    title={run.name}
                    date={run?._max?.endedAt}
                    status={run?._max?.status}
                    data={run?._sum}
                  ></TimelineItem>
                ))}
              </ol>
              {runs.length == 0 && (
                <>
                  <span className="mt-4 text-sm text-zinc-500">No runs for today.</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section (1/3 of the screen) */}
        <div style={{ ...styles.box, ...styles.rightBox }}>
          <div>
            <div>Letf Row 2</div>

            {/* <MultiAxisLineChart></MultiAxisLineChart> */}
          </div>
        </div>
        <div style={{ ...styles.box, ...styles.rightBox }}>Right Row 2</div>
      </div>
    </>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // 2/3 for the left section, 1/3 for the right
    gridTemplateRows: '1fr 1fr', // Two rows on both sections
    gap: '30px', // Optional gap between the items
    height: 'auto',
  },
  box: {
    padding: '10px',
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  scrollable: {
    height: '500px',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
  },
  leftBox: {
    gridRow: 'span 1',
    display: 'block',
  },
  rightBox: {
    gridRow: 'span 1',
  },
}

'use client'
import { Badge } from '@/components/badge'
import { BadgeComponent } from '@/components/badgeComponent'
import { Divider } from '@/components/divider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { formatDateString } from '@/utils/helpers'
import { useEffect, useState } from 'react'

import ImageSkeleton from '@/components/cardSkeleton'
import MultiAxisLineChart from '@/components/chart'
import PieChart from '@/components/pieChart'
import { SkeletonList } from '@/components/skeletonList'
import TableSkeleton from '@/components/skeletonTable'
import { StackedList } from '@/components/stackedList'
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

        <div className="flex items-center justify-between rounded-lg px-2 shadow-sm">
          <time className="mb-1 text-xs font-normal text-zinc-500 sm:order-last sm:mb-0">{timeAgo(date)}</time>
          <div className="justify-center text-sm font-bold text-gray-500 dark:text-gray-300">
            <span>
              {title}
              {'  '}
            </span>
            <span className="ml-10 rounded bg-gray-300 px-2 py-1 text-xs font-normal text-gray-800 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {status}
            </span>
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
    </>
  )
}

function formatNumberWithDots(num: number) {
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function Home() {
  const [actors, setActors] = useState([])
  const [runs, setRuns] = useState<any>([])

  const [items, setItems] = useState([])
  const [targets, setTargets] = useState([])
  const [expires, setExpires] = useState([])
  const [locales, setLocales] = useState([])

  const [loadingActors, setLoadingActors] = useState(true)
  const [loadingRuns, setLoadingRuns] = useState(true)
  const [loadingBreakdown, setLoadingBreakdown] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)
  const [loadingLocales, setLoadingLocales] = useState(true)

  const [searchActor, setsearchActor] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  const [runsPagination, setRunsPagination] = useState<any>({})

  // Async function to retrieve and set actors
  const getActors = async function ({ params }: { params?: { statusFilter?: string; searchActor?: string } }) {
    const search: any = new URLSearchParams()

    if (params?.searchActor) search.append('actor', params?.searchActor)
    if (params?.statusFilter) search.append('status', params?.statusFilter)

    setLoadingActors(true)

    setTimeout(async () => {
      const response = await fetch(`/api/actors?${search.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      })
      const json = await response.json()
      setActors(json?.data?.results)
      setLoadingActors(false)
    }, 2000)
  }

  // Async function to retrieve and set processed runs
  const getRuns = async function ({ params }: { params?: { previousDay?: string } } = {}) {
    const search = new URLSearchParams()
    search.append('endDate', params?.previousDay || '')

    const response = await fetch(`/api/runs?${search.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })
    const json = await response.json()
    return json
  }

  const fetchInitialRuns = async () => {
    setLoadingRuns(true)
    setTimeout(async () => {
      const initialData = await getRuns()
      setRunsPagination(initialData.data.pagination)
      setRuns(initialData.data.results)
      setLoadingRuns(false)
    }, 1000)
  }

  // Async function to retrieve and set itemCount
  const getItems = async function () {
    const response = await fetch('/api/charts/items')
    const json = await response.json()
    setItems(json.data.results)
  }

  // Async function to retrieve and set target pages
  const getTargets = async () => {
    const response = await fetch('/api/charts/targets')
    const json = await response.json()
    setTargets(json.data.results)
  }

  // Async function to retrieve and set items breakdowns
  const getBreakdown = async () => {
    setLoadingBreakdown(true)
    setTimeout(async () => {
      const response = await fetch('/api/charts/breakdown')
      const json = await response.json()
      setExpires(json.data.results)
      setLoadingBreakdown(false)
    }, 2000)
  }

  // function to call runs
  const showRuns = async () => {
    const json = await getRuns({ params: { previousDay: runsPagination?.previousDay } })
    const data = json.data.results
    setRunsPagination(json.data.pagination)
    setRuns((prevRuns: any) => [...prevRuns, ...data]) // Append new data to the current state
  }

  // Async function to retrieve and set locales
  const getLocales = async () => {
    setLoadingLocales(true)
    setTimeout(async () => {
      const response = await fetch('/api/locales')
      const json = await response?.json()
      setLocales(json?.data?.locales)
      setLoadingLocales(false)
    }, 2000)
  }

  const getChartData = async () => {
    setLoadingChart(true)
    setTimeout(async () => {
      await getItems()
      await getTargets()
      setLoadingChart(false)
    }, 2000)
  }

  const getToken = () => {
    fetch('/api/auth/csrf')
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
  }

  const handleStatus = async (query: string) => {
    setStatusFilter(query)
    await getActors({ params: { statusFilter: query } })
  }

  const handleSearch = async (query: string) => {
    setsearchActor(query)
    await getActors({ params: { searchActor: query } })
  }

  useEffect(() => {
    getActors({})
    fetchInitialRuns()
    getBreakdown()
    getLocales()
    getChartData()
    getToken()
  }, [])

  return (
    <>
      <div style={styles.container}>
        {/* Actors */}
        <div style={{ ...styles.leftBox, ...styles.box }}>
          <div>
            <div className="mb-4">
              <h2 className="mb-2">Actors</h2>
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <form className="w-full">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatus(e.target.value)}
                    id="status"
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
                      onChange={(e) => handleSearch(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Search Actor by name"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div style={{ ...styles.leftBox, ...styles.scrollable }}>
              {actors && !loadingActors && (
                <Table dense={true} className="mr-4 mt-2 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.8)]">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Actors</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Dates</TableHeader>
                      <TableHeader>Processed Runs</TableHeader>
                      <TableHeader>Last Tests</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actors.length > 0 ? (
                      actors?.map((actor: any) => (
                        <TableRow key={actor.id} title={`Actor #${actor.id}`}>
                          <TableCell>{actor.name}</TableCell>
                          <TableCell>
                            <BadgeComponent status={actor?.runs.status}></BadgeComponent>
                          </TableCell>
                          <TableCell> {actor?.lastRunAt && formatDateString(actor?.lastRunAt)} </TableCell>
                          <TableCell>
                            <div className="inline-block justify-around">
                              Scraped {formatNumberWithDots(actor?.runs.resultCount) || 0} - Failed{' '}
                              {formatNumberWithDots(actor?.runs.failedCount) || 0}
                            </div>
                          </TableCell>

                          <TableCell>
                            {actor?.test && formatDateString(actor?.test?.lastRunAt)}{' '}
                            {actor?.test && <BadgeComponent status={actor?.test?.status}></BadgeComponent>}
                            {!actor?.test && <BadgeComponent status={'N/A'}></BadgeComponent>}
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
              {loadingActors && <TableSkeleton></TableSkeleton>}
            </div>
          </div>
        </div>
        {/* Processed Runs */}
        <div style={{ ...styles.box }}>
          <h2 className="mb-4">Processed Runs</h2>

          {!loadingRuns && (
            <div>
              <div style={{ ...styles.rightBox, ...styles.scrollable }}>
                <ol className="relative ml-2 mr-8 mt-2 border-s border-gray-200 dark:border-gray-700">
                  {runs.map((run: any) => (
                    <TimelineItem
                      title={run.name}
                      date={run?._max?.startedAt}
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

              <div className="mt-4 flex">
                <div className="mx-auto items-center self-center">
                  <button
                    onClick={showRuns}
                    type="button"
                    className="mb-2 me-2 rounded-lg px-8 py-2.5 text-xs font-medium text-gray-300 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Show previous day
                  </button>
                </div>
              </div>
            </div>
          )}
          {loadingRuns && <SkeletonList></SkeletonList>}
        </div>

        {/* Right Section (1/3 of the screen) */}
        <div style={{ ...styles.box, ...styles.rightBox }}>
          <div>
            <h2 className="mb-4">Items & Target Pages stats</h2>
            {loadingChart ? (
              <ImageSkeleton></ImageSkeleton>
            ) : (
              <MultiAxisLineChart data={{ items, targets }}></MultiAxisLineChart>
            )}
          </div>
        </div>
        {/* Breakdowns */}
        <div style={{ ...styles.box, ...styles.rightBox }}>
          <div>
            <div className="mb-6">Items breakdown</div>
            {loadingBreakdown ? <ImageSkeleton></ImageSkeleton> : <PieChart dataset={expires}></PieChart>}
          </div>
        </div>
      </div>
      {/* Locales */}
      <div style={styles.box}>
        <div className="mb-6">Locales</div>

        {loadingLocales ? (
          <SkeletonList></SkeletonList>
        ) : (
          Object.entries(locales).map(([key, value], index) => (
            <div key={index}>
              <StackedList data={[key, value]}></StackedList>
            </div>
          ))
        )}
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
  '@media (max-width: 768px)': {
    // For tablets or small screens
    gridTemplateColumns: '1fr', // Make the grid a single column
    gridTemplateRows: 'auto', // Adjust the rows to be automatic based on content
    gap: '20px', // Smaller gap on smaller screens
  },

  '@media (max-width: 480px)': {
    // For mobile screens
    gridTemplateColumns: '1fr', // Single column layout
    gridTemplateRows: 'auto', // Auto height for rows
    gap: '15px', // Even smaller gap
  },
}

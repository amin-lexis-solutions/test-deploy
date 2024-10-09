'use client'
import { BadgeComponent } from '@/components/badgeComponent'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { formatDateString, formatNumberWithDots } from '@/utils/helpers'
import { useEffect, useState } from 'react'

import ImageSkeleton from '@/components/cardSkeleton'
import MultiAxisLineChart from '@/components/chart'
import PieChart from '@/components/pieChart'
import { SkeletonList } from '@/components/skeletonList'
import TableSkeleton from '@/components/skeletonTable'
import { StackedList } from '@/components/stackedList'
import { TimelineItem } from '@/components/timeLine'

import '../../styles/home.css'

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

  const [debouncedSearch, setDebouncedSearch] = useState('')

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
    const response = await fetch(`/api/items`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })
    const json = await response.json()
    setItems(json.data.results)
  }

  // Async function to retrieve and set target pages
  const getTargets = async () => {
    const response = await fetch(`/api/targets`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    })
    const json = await response.json()
    setTargets(json.data.results)
  }

  // Async function to retrieve and set items breakdowns
  const getBreakdown = async () => {
    setLoadingBreakdown(true)
    setTimeout(async () => {
      const response = await fetch(`/api/breakdown`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      })
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
      const response = await fetch(`/api/locales`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      })
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
    await getActors({ params: { statusFilter: query, searchActor } })
  }

  useEffect(() => {
    getActors({})
    fetchInitialRuns()
    getBreakdown()
    getLocales()
    getChartData()
    getToken()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      getActors({ params: { searchActor, statusFilter } })
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchActor])

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 p-4 lg:col-span-2">
          {/* Actors */}
          <div style={{ ...styles.leftBox, ...styles.box }}>
            <div>
              <div className="mb-4">
                <h2 className="mb-2">Actors</h2>
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <form className="w-full">
                    <select
                      defaultValue={''}
                      value={statusFilter}
                      onChange={(e) => handleStatus(e.target.value)}
                      id="status"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    >
                      <option value={''}>Choose a status</option>
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
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
                {actors && !loadingActors && (
                  <Table
                    dense={true}
                    bleed={true}
                    className="mr-4 mt-2 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.8)]"
                  >
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
                          <div className="mt-4 text-sm text-zinc-500">No records found.</div>
                        </>
                      )}
                    </TableBody>
                  </Table>
                )}
                {loadingActors && <TableSkeleton></TableSkeleton>}
              </div>
            </div>
          </div>

          <div className="lg:mt-6" style={{ ...styles.box, ...styles.rightBox }}>
            <div>
              <h2 className="mb-4">Items & Target Pages stats</h2>
              {loadingChart ? (
                <ImageSkeleton></ImageSkeleton>
              ) : (
                <MultiAxisLineChart data={{ items, targets }}></MultiAxisLineChart>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 p-4 lg:col-span-1">
          {/* Right Section (1/3 of the screen) */}
          {/* Processed Runs */}
          <div style={{ ...styles.box }}>
            <h2 className="relative mb-4 flex">Processed Runs</h2>

            {!loadingRuns && (
              <div>
                <div style={{ ...styles.rightBox, ...styles.scrollable }}>
                  <ol className="relative ml-2 mr-8 mt-8 border-s border-gray-200 dark:border-gray-700">
                    {runs.map((run: any, index: number) => (
                      <TimelineItem
                        key={index}
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
                      className="mb-2 me-2 rounded-lg bg-gray-300 px-8 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Show previous day
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loadingRuns && <SkeletonList></SkeletonList>}
          </div>
          {/* Breakdowns */}
          <div className="lg:mt-6" style={{ ...styles.box, ...styles.rightBox }}>
            <div>
              <div className="mb-6">Items breakdown</div>
              {loadingBreakdown ? <ImageSkeleton></ImageSkeleton> : <PieChart dataset={expires}></PieChart>}
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div style={{ ...styles.box }}>
            {/* Locales */}
            <div>
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
          </div>
        </div>
      </div>
    </div>
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
    padding: '20px',
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  scrollable: {
    height: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
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

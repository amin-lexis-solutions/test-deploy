'use client'
import { BadgeComponent } from '@/components/badgeComponent'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { formatDateString, formatNumberWithDots } from '@/utils/helpers'
import { useEffect, useState } from 'react'

import ImageSkeleton from '@/components/cardSkeleton'
import MultiAxisLineChart from '@/components/chart'
import { SkeletonList } from '@/components/skeletonList'
import TableSkeleton from '@/components/skeletonTable'
import { StackedList } from '@/components/stackedList'
import { TimelineItem } from '@/components/timeLine'

import PieChart from '@/components/pieChart'
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
  const [debouncedSearchActor, setDebouncedSearchActor] = useState('')

  const [loadRuns, setLoadRuns] = useState(false)

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
    setLoadRuns(true)
    const json = await getRuns({ params: { previousDay: runsPagination?.previousDay } })
    const data = json.data.results
    setRunsPagination(json.data.pagination)
    setRuns((prevRuns: any) => [...prevRuns, ...data]) // Append new data to the current state
    setLoadRuns(false)
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
      setDebouncedSearchActor(searchActor)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchActor])

  useEffect(() => {
    if (debouncedSearchActor !== '' || statusFilter !== '') {
      getActors({ params: { searchActor: debouncedSearchActor, statusFilter } })
    } else {
      getActors({})
    }
  }, [debouncedSearchActor, statusFilter])

  return (
    <div>
      <div className="grid grid-cols-1 gap-12">
        <div className="dashboard-box">
          <div className="col-span-2" style={{ ...styles.leftBox, ...styles.box }}>
            <div>
              <h2 className="py-4">Actors</h2>

              <div>
                <div className="grid grid-cols-[auto_1fr] gap-4 py-4">
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
              <div style={{ ...styles.leftBox, ...styles.scrollable }} className="overflow-y-auto lg:overflow-x-hidden">
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

          {/* Processed Runs */}
          <div style={{ ...styles.box }}>
            <h2 className="py-4">Processed Runs</h2>

            {!loadingRuns && (
              <div>
                <div style={{ ...styles.rightBox, ...styles.scrollable }} className="overflow-y-auto overflow-x-hidden">
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
                    {loadRuns ? (
                      <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-gray-300 px-8 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                      >
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>
                        Loading
                      </button>
                    ) : (
                      <button
                        onClick={showRuns}
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-gray-300 px-8 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                      >
                        Show previous day
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {loadingRuns && <SkeletonList></SkeletonList>}
          </div>
        </div>
        <div className="dashboard-box">
          <div className="col-span-2" style={{ ...styles.box, ...styles.rightBox }}>
            <div>
              <h2 className="py-4">Items & Target Pages stats</h2>
              {loadingChart ? (
                <ImageSkeleton></ImageSkeleton>
              ) : (
                <MultiAxisLineChart data={{ items, targets }}></MultiAxisLineChart>
              )}
            </div>
          </div>

          <div style={{ ...styles.box, ...styles.rightBox }}>
            <div className="py-4">Items breakdown</div>
            {loadingBreakdown ? <ImageSkeleton></ImageSkeleton> : <PieChart dataset={expires}></PieChart>}
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div style={{ ...styles.box }}>
            {/* Locales */}
            <div className="py-4">Locales</div>

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
    display: 'block',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  scrollable: {
    height: '500px',
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

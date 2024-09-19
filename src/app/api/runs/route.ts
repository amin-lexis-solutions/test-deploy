import { PrismaClient } from '@prisma/client'
import { subHours } from 'date-fns' // Import date-fns for easy time manipulation
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: any) {
  const { searchParams } = new URL(request.url)

  const lastHoursParam = parseInt(searchParams.get('lastHours') || '24', 24) // default to 10 items per page

  const now = new Date()
  const lastHours = subHours(now, lastHoursParam)

  const [totalSource, sources] = await Promise.all([
    prisma.source.count(),
    prisma.source.findMany({
      select: {
        apifyActorId: true,
        name: true,
      },
    }),
  ])

  const [total, runs] = await Promise.all([
    prisma.processedRun.count(),
    prisma.processedRun.groupBy({
      by: ['apifyActorId'],
      where: {
        endedAt: {
          gt: lastHours,
        },
      },
      _sum: {
        resultCount: true,
        errorCount: true,
        createdCount: true,
        updatedCount: true,
        archivedCount: true,
      },
      _max: {
        status: true, // Get the last status by selecting the max (most recent) status
        endedAt: true, // Assuming createdAt is the field used for tracking time
      },
    }),
  ])

  // Combine source data with processedRun data
  const ProcessedRuns = runs?.map((run: any) => {
    const source = sources?.filter((source: any) => source.apifyActorId == run.apifyActorId)[0]?.name

    return {
      name: source,
      ...run,
    }
  })

  const data = ProcessedRuns?.sort((a: any, b: any) => {
    const dateA = new Date(a?._max?.endedAt)?.getTime()
    const dateB = new Date(b?._max?.endedAt)?.getTime()
    return dateB - dateA // Sort descending by date
  })

  return NextResponse.json({
    message: `Success! ${total} total results found.`,
    data: {
      total,
      results: data,
    },
  })
}

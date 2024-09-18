import { Prisma, PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()

export async function GET(request: any) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const status = searchParams.get('status') || undefined
  const actor = searchParams.get('actor') || undefined

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sourceFilter: Prisma.SourceWhereInput = {
    name: actor ? { contains: actor, mode: 'insensitive' } : undefined,
  }

  const [total, sources] = await Promise.all([
    prisma.source.count(),
    prisma.source.findMany({
      orderBy: {
        name: 'asc',
      },
      where: sourceFilter,
      select: {
        id: true,
        name: true,
        lastRunAt: true,
        apifyActorId: true,
        ProcessedRun: {
          where: {
            status,
            endedAt: {
              gt: today,
            },
          },
          select: {
            status: true,
            resultCount: true,
            errorCount: true,
            endedAt: true,
          },
        },
      },
    }),
  ])

  const apifyActorIds = sources.map((source) => source.apifyActorId)

  const tests = await prisma.test.findMany({
    where: {
      apifyActorId: { in: apifyActorIds },
    },
  })

  const data = sources.map((source) => {
    const test = tests.filter((test) => test.apifyActorId == source.apifyActorId)?.[0]
    return {
      ...source,
      test,
    }
  })

  const results = status ? data.filter((source) => source.ProcessedRun?.[0]?.status == status) : data

  return NextResponse.json({
    message: `Success! ${total} total results found.`,
    data: {
      total,
      results,
    },
  })
}

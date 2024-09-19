import { PrismaClient } from '@prisma/client'
import { subDays } from 'date-fns'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: any) {
  const today = new Date()
  const startDate = subDays(today, 29) // 29 days ago

  const results: any = await prisma.$queryRaw`
  SELECT
    DATE("lastApifyRunAt") as date,
    COUNT(*)::bigint as count 
  FROM "TargetPage"
  WHERE "lastApifyRunAt" BETWEEN ${startDate} AND ${today}
  GROUP BY DATE("lastApifyRunAt")
  ORDER BY DATE("lastApifyRunAt") ASC;
`
  const targets = {
    dates: results.map((item: any) => item.date),
    targets: results.map((item: any) => Number(item.count)),
  }

  return NextResponse.json({
    message: `Success! total results found.`,
    data: {
      results: targets,
    },
  })
}

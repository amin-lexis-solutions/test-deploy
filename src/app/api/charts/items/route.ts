import { PrismaClient } from '@prisma/client'
import { subDays } from 'date-fns'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: any) {
  const today = new Date()
  const startDate = subDays(today, 29) // 29 days ago

  const results: any = await prisma.$queryRaw`
  SELECT 
    DATE("firstSeenAt") as date, 
    COUNT(*)::bigint as count 
  FROM "Coupon"
  WHERE "firstSeenAt" BETWEEN ${startDate} AND ${today}
  GROUP BY DATE("firstSeenAt")
  ORDER BY DATE("firstSeenAt") ASC;
`

  const chartData = {
    dates: results.map((item: any) => item.date),
    items: results.map((item: any) => Number(item.count)),
  }

  return NextResponse.json({
    message: `Success! total results found.`,
    data: {
      results: chartData,
    },
  })
}

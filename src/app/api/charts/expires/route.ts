import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: any) {
  const expiredCount = await prisma.coupon.count({
    where: {
      isExpired: true,
    },
  })

  const activeCount = await prisma.coupon.count({
    where: {
      isExpired: false,
    },
  })

  const nullableCount = await prisma.coupon.count({
    where: {
      isExpired: null,
    },
  })

  return NextResponse.json({
    message: `Success! total results found.`,
    data: {
      results: {
        expiredCount,
        activeCount,
        nullableCount,
      },
    },
  })
}

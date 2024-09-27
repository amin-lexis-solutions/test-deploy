import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const endDate = request.nextUrl.searchParams.get('endDate') || ''

  const url = new URL(`${process.env.API_URL}/dashboard/runs`)

  if (endDate) url.searchParams.set('endDate', endDate)

  const response = await fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
  })
  const data = await response.json()
  return NextResponse.json(data)
}

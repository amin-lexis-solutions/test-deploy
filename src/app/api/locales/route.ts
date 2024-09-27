import { NextResponse } from 'next/server'

export async function GET() {
  const response = await fetch(`${process.env.API_URL}/overview/scrape-stats`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
  })

  const data = await response.json()

  return NextResponse.json({ ...data })
}

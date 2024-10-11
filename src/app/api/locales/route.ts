import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_URL}/overview/scrape-stats`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
    })

    const data = await response.json()

    return NextResponse.json({ ...data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 })
  }
}

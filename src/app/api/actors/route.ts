import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const actor = request.nextUrl.searchParams.get('actor') || null
    const status = request.nextUrl.searchParams.get('status') || null

    const url = new URL(`${process.env.API_URL}/dashboard/actors`)

    if (actor) url.searchParams.set('actor', actor)
    if (status) url.searchParams.set('status', status)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_SECRET}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 })
  }
}

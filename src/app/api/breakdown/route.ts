import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL
const API_SECRET = process.env.API_SECRET

if (!API_URL || !API_SECRET) {
  throw new Error('Missing required environment variables')
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/dashboard/items-breakdown`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_SECRET}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    console.error('Error fetching items breakdown:', error)
    return NextResponse.json({ error: 'Error fetching items breakdown' }, { status: 500 })
  }
}

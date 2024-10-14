import { NextRequest, NextResponse } from 'next/server'

function validateAndSanitizeInput(value: string | null): string | null {
  if (!value) return null
  return value.replace(/[^\w\s-]/gi, '').trim()
}

export async function GET(request: NextRequest) {
  try {
    const actor = validateAndSanitizeInput(request.nextUrl.searchParams.get('actor')) || undefined
    const status = validateAndSanitizeInput(request.nextUrl.searchParams.get('status')) || undefined

    console.log('Received request with actor:', actor, 'and status:', status) // Debug log

    if (!process.env.API_URL || !process.env.API_SECRET) {
      throw new Error('Missing required environment variables')
    }

    const url = new URL(`${process.env.API_URL}/dashboard/actors`)

    if (actor) url.searchParams.set('actor', actor)
    if (status) url.searchParams.set('status', status)

    console.log('Fetching from URL:', url.toString()) // Debug log

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_SECRET}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      next: { revalidate: 0 },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API response not OK:', response.status, errorText) // Debug log
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()

    const headers = new Headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    })

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Detailed error:', error) // Debug log
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

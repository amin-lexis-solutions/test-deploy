import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Define a schema for input validation
const QuerySchema = z.object({
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
})

// Helper function for consistent error responses
function errorResponse(message: string, status: number = 500) {
  console.error(`Error: ${message}`)
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  console.log(`Received request: ${request.url}`)

  try {
    // Validate environment variables
    if (!process.env.API_URL || !process.env.API_SECRET) {
      throw new Error('Missing required environment variables')
    }

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams)
    const validatedParams = QuerySchema.safeParse(queryParams)

    if (!validatedParams.success) {
      return errorResponse('Invalid query parameters: ' + validatedParams.error.message, 400)
    }

    const { endDate } = validatedParams.data

    // Construct URL for external API
    const url = new URL(`${process.env.API_URL}/dashboard/runs`)
    if (endDate) url.searchParams.set('endDate', endDate)

    console.log(`Fetching from URL: ${url.toString()}`)

    // Fetch data from external API with timeout
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
      console.error(`API response not OK: ${response.status} ${errorText}`)
      return errorResponse(`External API error: ${response.status} ${errorText}`, response.status)
    }

    const data = await response.json()

    // Return successful response
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    console.error('Detailed error:', error)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return errorResponse('Request timed out', 504)
      }
      return errorResponse(error.message)
    }
    return errorResponse('An unexpected error occurred')
  }
}

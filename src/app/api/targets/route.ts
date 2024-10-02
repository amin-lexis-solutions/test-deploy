import { NextResponse } from 'next/server'

export async function GET(request: any) {
  const response = await fetch(`${process.env.API_URL}/dashboard/targets`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
  })

  const data = await response.json()

  return NextResponse.json(data)
}

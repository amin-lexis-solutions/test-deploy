import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/utils/jwt'

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('authToken')?.value

  if (authToken && verifyToken(authToken)) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
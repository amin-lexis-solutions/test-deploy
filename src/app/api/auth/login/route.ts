import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { generateToken } from '@/utils/jwt'
import { validateCsrfToken } from '@/utils/csrf'
import { rateLimit } from '@/utils/rateLimit'

interface User {
  id: string;
  password: string;
}

const USERS: Record<string, User> = {
  admin: { id: '1', password: process.env.ADMIN_PASS ?? '' },
}

export async function POST(request: NextRequest) {
  const limitResult = rateLimit(request)

  console.log('Received request with authToken  ', process.env) // Debug log

  if (!limitResult.success) {
    return NextResponse.json({ success: false, message: limitResult.message }, { status: 429 })
  }

  const csrfToken = headers().get('X-CSRF-Token')
  if (!csrfToken || !validateCsrfToken(csrfToken)) {
    return NextResponse.json({ success: false, message: 'Invalid CSRF token' }, { status: 403 })
  }

  const { username, password } = await request.json()

  if (username in USERS && USERS[username].password === password) {
    const token = generateToken(USERS[username].id)

    cookies().set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    })

    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  }
}
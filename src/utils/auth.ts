import { cookies } from 'next/headers'

export function getAuthToken() {
  const cookieStore = cookies()
  return cookieStore.get('authToken')?.value
}

export function checkAuth() {
  const token = getAuthToken()
  return !!token
}

export function generateToken(username: string): string {
  const jwt = require('jsonwebtoken');
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }

  const payload = {
    username: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token expires in 1 hour
  };

  return jwt.sign(payload, secretKey);
}
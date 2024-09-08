import { NextRequest } from 'next/server'

const WINDOW_SIZE = 15 * 60 * 1000 // 15 minutes in milliseconds
const MAX_REQUESTS = 5

const ipRequests = new Map<string, number[]>()

export function rateLimit(request: NextRequest) {
 const ip = request.ip ?? '127.0.0.1'
  const now = Date.now()
  const windowStart = now - WINDOW_SIZE

  let requestTimestamps = ipRequests.get(ip) || []
  requestTimestamps = requestTimestamps.filter(timestamp => timestamp > windowStart)

  if (requestTimestamps.length >= MAX_REQUESTS) {
    return { success: false, message: 'Too many requests, please try again later.' }
  }

  requestTimestamps.push(now)
  ipRequests.set(ip, requestTimestamps)

  // Periodically clean up old entries
  if (Math.random() < 0.01) {
    ipRequests.forEach((timestamps, ip) => {
      ipRequests.set(ip, timestamps.filter((timestamp: number) => timestamp > windowStart));
    });
  }

  return { success: true }
}
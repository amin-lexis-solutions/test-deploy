
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check')
      if (!res.ok) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])
}
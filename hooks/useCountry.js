'use client'
import { useState, useEffect, useCallback } from 'react'

const SUPPORTED = ['CL', 'CO', 'AR', 'MX']
const COOKIE_NAME = 'rukka_country'

// geo: read cookie synchronously to avoid flicker on first render
function readCountryCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split(';').find(c => c.trim().startsWith(COOKIE_NAME + '='))
  if (!match) return null
  const val = match.split('=')[1]?.trim()
  return SUPPORTED.includes(val) ? val : null
}

export function useCountry() {
  const [country, setCountryState] = useState(() => readCountryCookie() || 'CL')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(({ country: c }) => { if (SUPPORTED.includes(c)) setCountryState(c) })
      .catch(() => {})
  }, [])

  const setCountry = useCallback(async (code) => {
    if (!SUPPORTED.includes(code)) return
    setIsLoading(true)
    try {
      await fetch('/api/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: code }),
      })
      setCountryState(code)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { country, setCountry, isLoading }
}

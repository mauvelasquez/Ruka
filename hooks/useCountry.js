'use client'
import { useState, useEffect } from 'react'

export function useCountry() {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(({ country: c }) => setCountry(c))
      .catch(() => setCountry('CL'))
  }, [])

  return country
}

'use client'
import { useState } from 'react'

export default function CityImage({ src, alt, className, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) return null
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  )
}

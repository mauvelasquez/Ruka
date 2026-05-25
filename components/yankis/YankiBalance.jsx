'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function YankiBalance({ size = 'md', showLabel = true, linkable = false }) {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    fetch('/api/yankis/balance')
      .then(r => r.json())
      .then(d => setBalance(d.balance ?? 0))
      .catch(() => setBalance(0))
  }, [])

  const sizes = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-xl gap-2',
  }

  const content = (
    <span className={`flex items-center ${sizes[size]} font-semibold text-terra`}>
      <span className="text-lg leading-none">🪙</span>
      <span>{balance === null ? '…' : balance}</span>
      {showLabel && (
        <span className="text-xs font-normal text-gray-500">
          {balance === 1 ? 'Yanki' : 'Yankis'}
        </span>
      )}
    </span>
  )

  if (linkable) {
    return (
      <Link href="/dashboard/yankis" title="Ver mis Yankis" className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}

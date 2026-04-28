'use client'
import { useState, useEffect } from 'react'

const HINTS = [
  '¿Qué es lo primero que ves al despertar? ¿Un volcán, el mar, la cordillera?',
  '¿Tu vecino hace las mejores empanadas del barrio? ¡Cuéntalo!',
  '¿Hay un café a la vuelta que vale la pena mencionar?',
  '¿Qué harías tú si fueras visitante de tu propio hogar?',
  '¿Tu terraza tiene historia? ¿Tu jardín tiene nombre?',
  '¿A qué huele tu casa por las mañanas?',
  '¿Qué no debe perderse quien llegue a tu barrio?',
]

export default function DescriptionHints() {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % HINTS.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p
      className="text-xs text-forest flex items-start gap-1 mt-1.5 max-w-xs"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      <span className="flex-shrink-0">💡</span>
      <span>{HINTS[idx]}</span>
    </p>
  )
}

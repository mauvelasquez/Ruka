interface YankisBadgeProps {
  cantidad: number
}

export function YankisBadge({ cantidad }: YankisBadgeProps) {
  const label = cantidad === 1 ? 'Yanki' : 'Yankis'
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: '#FDF0EA',
        color: '#C4622D',
        fontWeight: 'bold',
        fontSize: '15px',
        borderRadius: '6px',
        padding: '4px 10px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      🪙 {cantidad} {label}
    </span>
  )
}

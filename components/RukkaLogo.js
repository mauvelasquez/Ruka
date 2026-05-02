import Image from 'next/image'

export default function RukkaLogo({ height = 48, className = '' }) {
  return (
    <Image
      src="/rukka-logo.png"
      alt="Rukka"
      height={height}
      width={height}
      className={className ? `rounded-xl ${className}` : 'rounded-xl'}
      priority
    />
  )
}

import { headers } from 'next/headers'

const SUPPORTED = ['CL', 'MX', 'CO', 'AR']

export function getCountryFromIP() {
  const headersList = headers()
  const country = headersList.get('x-vercel-ip-country')
  if (country && SUPPORTED.includes(country)) return country
  if (process.env.NEXT_PUBLIC_DEV_COUNTRY && SUPPORTED.includes(process.env.NEXT_PUBLIC_DEV_COUNTRY)) {
    return process.env.NEXT_PUBLIC_DEV_COUNTRY
  }
  return null
}

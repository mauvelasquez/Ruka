export type SupportedCountry = 'CL' | 'CO' | 'AR' | 'MX'

export const SUPPORTED_COUNTRIES: SupportedCountry[] = ['CL', 'CO', 'AR', 'MX']

export const COUNTRY_NAMES: Record<SupportedCountry, string> = {
  CL: 'Chile',
  CO: 'Colombia',
  AR: 'Argentina',
  MX: 'México',
}

export const COUNTRY_FLAGS: Record<SupportedCountry, string> = {
  CL: '🇨🇱',
  CO: '🇨🇴',
  AR: '🇦🇷',
  MX: '🇲🇽',
}

export async function detectUserCountry(): Promise<SupportedCountry> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return 'CL'
    const data = await res.json()
    const code = data?.country_code as string
    if (SUPPORTED_COUNTRIES.includes(code as SupportedCountry)) {
      return code as SupportedCountry
    }
    return 'CL'
  } catch {
    return 'CL'
  }
}

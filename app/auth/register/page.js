import { getCountryFromIP } from '../../../lib/getCountryFromIP'
import RegisterClient from './RegisterClient'

const SUBTITLES = {
  CL: 'Intercambia tu hogar en Chile',
}

export default function RegisterPage() {
  const country = getCountryFromIP()
  const subtitle = SUBTITLES[country] || 'Intercambia tu hogar en Chile'
  return <RegisterClient subtitle={subtitle} />
}

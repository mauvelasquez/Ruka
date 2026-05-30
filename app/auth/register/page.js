import { getCountryFromIP } from '../../../lib/getCountryFromIP'
import RegisterClient from './RegisterClient'

const SUBTITLES = {
  CL: 'Intercambia tu hogar en Chile',
  MX: 'Intercambia tu hogar en México',
  CO: 'Intercambia tu hogar en Colombia',
  AR: 'Intercambia tu hogar en Argentina',
}

export default function RegisterPage() {
  const country = getCountryFromIP()
  const subtitle = SUBTITLES[country] || 'Intercambia tu hogar en Chile, México, Colombia y Argentina'
  return <RegisterClient subtitle={subtitle} />
}

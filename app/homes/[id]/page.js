import { mockHomes } from '../../../lib/mockData'
import HomeDetailClient from './HomeDetailClient'

export function generateStaticParams() {
  return mockHomes.map(h => ({ id: h.id }))
}

export default function HomePage({ params }) {
  return <HomeDetailClient id={params.id} />
}

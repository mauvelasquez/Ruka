import HomeDetailClient from './HomeDetailClient'

export default function HomePage({ params }) {
  return <HomeDetailClient id={params.id} />
}

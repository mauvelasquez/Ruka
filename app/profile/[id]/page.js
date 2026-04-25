import { mockUsers } from '../../../lib/mockData'
import ProfileClient from './ProfileClient'
import Navbar from '../../../components/Navbar'

export function generateStaticParams() {
  return mockUsers.map(u => ({ id: u.id }))
}

export default function ProfilePage({ params }) {
  return (
    <>
      <Navbar />
      <ProfileClient id={params.id} />
    </>
  )
}

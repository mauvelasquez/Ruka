import ProfileClient from './ProfileClient'
import Navbar from '../../../components/Navbar'

export default function ProfilePage({ params }) {
  return (
    <>
      <Navbar />
      <ProfileClient id={params.id} />
    </>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Mountain } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Verificando tu cuenta...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // createBrowserClient detecta el code/token en la URL automáticamente
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          setStatus('No se pudo verificar la sesión. Redirigiendo...')
          setTimeout(() => router.push('/auth/login?error=auth_error'), 1500)
          return
        }

        const user = session.user

        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', user.id)
          .single()

        if (!profile) {
          setStatus('Creando tu perfil...')
          const avatar =
            user.user_metadata?.picture ||
            user.user_metadata?.avatar_url ||
            null
          const { error: upsertError } = await supabase.from('profiles').upsert({
            id:     user.id,
            name:   user.user_metadata?.name || user.user_metadata?.full_name || 'Usuario',
            email:  user.email || user.user_metadata?.email || '',
            avatar,
            status: 'pending',
          })
          if (upsertError) {
            router.push('/auth/login?error=profile_error')
            return
          }
          router.push('/onboarding')
        } else if (profile.status === 'confirmed') {
          setStatus('¡Bienvenido de vuelta!')
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        router.push('/auth/login?error=auth_error')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="text-center">
        <div className="w-16 h-16 landscape-gradient rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-5">
          <Mountain className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{status}</p>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import PhoneInputCL from '../../components/ui/PhoneInputCL'
import CountryUserSelect from '../../components/ui/CountryUserSelect'
import { COUNTRY_ID_CONFIG } from '../../lib/identification'
import {
  CheckCircle, User, Lock, AlertCircle, Check, ArrowLeft
} from 'lucide-react'

export default function PerfilPage() {
  const router = useRouter()
  const { currentUser, ready, updateProfile } = useApp()

  const [profileForm, setProfileForm] = useState({ phone: '', birth_date: '', country_user: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (!currentUser) return
    setProfileForm({
      phone:        currentUser.phone        || '',
      birth_date:   currentUser.birth_date   || '',
      country_user: currentUser.country_user || '',
    })
  }, [currentUser?.id])

  useEffect(() => {
    if (!ready) return
    if (!currentUser) router.push('/auth/login')
  }, [currentUser, ready])

  useEffect(() => {
    if (ready) return
    const timer = setTimeout(() => window.location.reload(), 15000)
    return () => clearTimeout(timer)
  }, [ready])

  const handleProfileSave = async () => {
    setProfileError('')
    if (profileForm.phone) {
      const local = profileForm.phone.replace(/^\+56/, '')
      if (local.length !== 9 || !local.startsWith('9')) {
        setProfileError('Teléfono inválido. Debe tener 9 dígitos y comenzar con 9.')
        return
      }
    }
    setProfileSaving(true)
    const updates = {
      phone:        profileForm.phone        || null,
      birth_date:   profileForm.birth_date   || null,
      country_user: profileForm.country_user || null,
    }
    const res = await updateProfile(updates)
    setProfileSaving(false)
    if (!res?.success) {
      setProfileError(res?.error || 'Error al guardar')
    } else {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }
  }

  if (!ready || !currentUser) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-forest hover:text-forest transition-colors text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-rukka-dark">Mi perfil</h1>
            <p className="text-gray-500 text-sm mt-0.5">Administra tu información personal</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center text-white text-3xl font-black overflow-hidden flex-shrink-0">
              {currentUser.avatar
                ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                : <span>{currentUser.name?.[0]?.toUpperCase() || '?'}</span>
              }
            </div>
            <div>
              <p className="font-black text-gray-900 text-xl">{currentUser.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {/* Campos fijos */}
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">

            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Nombre completo
              </label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 select-none flex items-center gap-2">
                <span className="flex-1">{currentUser.name || '—'}</span>
                {currentUser.verified && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
              </div>
              {currentUser.verified && (
                <p className="text-xs text-gray-400 mt-1">El nombre no puede modificarse una vez verificada la identidad.</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Correo electrónico
              </label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 select-none">
                {currentUser.email || '—'}
              </div>
            </div>

            {/* Documento de identidad */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                {COUNTRY_ID_CONFIG[currentUser.identification_country]?.label || 'Documento de identidad'}
              </label>
              <div className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm select-none flex items-center gap-2 ${currentUser.identification_number ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                <span className="flex-1">{currentUser.identification_number || 'No verificado'}</span>
                {currentUser.verified && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
              </div>
            </div>

            {/* Estado de verificación */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Estado de identidad
              </label>
              {currentUser.verified ? (
                <span className="inline-flex items-center gap-1.5 bg-forest/10 text-forest text-sm font-bold px-3 py-1.5 rounded-full border border-forest/20">
                  <CheckCircle className="w-4 h-4" /> Verificado
                </span>
              ) : (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1.5 rounded-full border border-gray-200">
                    <User className="w-4 h-4" /> Sin verificar
                  </span>
                  <Link href="/onboarding"
                    className="text-sm font-bold text-forest hover:text-forest-dark underline underline-offset-2 transition-colors">
                    Verificar mi identidad →
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Campos editables */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Información de contacto</h3>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Teléfono
              </label>
              <PhoneInputCL
                value={profileForm.phone}
                onChange={v => setProfileForm(f => ({ ...f, phone: v }))}
              />
            </div>

            {/* País */}
            <CountryUserSelect
              value={profileForm.country_user}
              onChange={v => setProfileForm(f => ({ ...f, country_user: v }))}
              detectIP={false}
            />

            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={profileForm.birth_date}
                disabled
                readOnly
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Completada automáticamente mediante verificación de identidad.</p>
            </div>

            {profileError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {profileError}
              </div>
            )}

            <button
              onClick={handleProfileSave}
              disabled={profileSaving}
              className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {profileSaving
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : profileSaved
                ? <><Check className="w-4 h-4" /> Guardado</>
                : 'Guardar cambios'
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

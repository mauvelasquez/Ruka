'use client'
import { useState } from 'react'
import { Phone, ArrowRight, AlertCircle, Loader } from 'lucide-react'
import PhoneInputCL from '../../../components/ui/PhoneInputCL'
import { normalizeChileanPhone, isValidChileanPhone } from '../../../lib/phone'
import { analytics } from '../../../lib/analytics'

export default function DatosBasicosStep({ initialPhone, needsCountryUser, onComplete }) {
  const [phone, setPhone] = useState(isValidChileanPhone(initialPhone) ? initialPhone : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = normalizeChileanPhone(phone)
    if (!normalized) {
      setError('Ingresa un número móvil chileno válido (9 dígitos, comenzando con 9).')
      return
    }
    setError('')
    setSaving(true)
    try {
      const body = { phone: normalized }
      if (needsCountryUser) body.country_user = 'CL'
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'No se pudo guardar tu teléfono. Intenta nuevamente.')
        setSaving(false)
        return
      }
      analytics.datosBasicosCompletados()
      onComplete(normalized)
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.')
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-forest" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Antes de continuar</h2>
        <p className="text-sm text-gray-500">
          Necesitamos tu número de teléfono para contactarte sobre tu verificación e intercambios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
            Teléfono
          </label>
          <PhoneInputCL value={phone} onChange={setPhone} disabled={saving} />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-60"
        >
          {saving
            ? <><Loader className="w-4 h-4 animate-spin" />Guardando...</>
            : <>Continuar<ArrowRight className="w-4 h-4" /></>
          }
        </button>
      </form>
    </div>
  )
}

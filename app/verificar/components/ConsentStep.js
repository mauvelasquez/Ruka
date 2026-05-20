'use client'
import { useState } from 'react'
import { Shield, Eye, EyeOff, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ConsentStep({ onAccept }) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-forest" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Tu privacidad es lo primero</h2>
        <p className="text-sm text-gray-500">Lee cómo manejamos tus datos antes de continuar</p>
      </div>

      <div className="space-y-3">
        <InfoRow
          icon={<Eye className="w-4 h-4 text-terra" />}
          title="Qué capturamos"
          text="Foto de tu carnet de identidad (frente) y una selfie temporal desde tu cámara."
        />
        <InfoRow
          icon={<CheckCircle className="w-4 h-4 text-forest" />}
          title="Para qué lo usamos"
          text="Verificar que eres quien dices ser, comparando tu rostro con la foto del carnet."
        />
        <InfoRow
          icon={<EyeOff className="w-4 h-4 text-andean" />}
          title="Qué NO se guarda"
          text="Las imágenes del carnet y la selfie nunca llegan a nuestros servidores. La comparación facial ocurre completamente en tu dispositivo."
          highlight
        />
        <InfoRow
          icon={<FileText className="w-4 h-4 text-gray-400" />}
          title="Qué SÍ guardamos"
          text="Solo el resultado (verificado / rechazado) y la fecha y hora de tu verificación."
        />
      </div>

      <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 text-xs text-gray-600 leading-relaxed">
        Este proceso cumple con la{' '}
        <span className="font-semibold">Ley 19.628 sobre Protección de la Vida Privada</span>{' '}
        de Chile. Tus datos biométricos no son almacenados ni compartidos con terceros.
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            checked ? 'bg-forest border-forest' : 'border-gray-300 group-hover:border-forest/50'
          }`}>
            {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
          </div>
        </div>
        <span className="text-sm text-gray-700 leading-relaxed">
          Acepto el tratamiento de mis datos biométricos para la verificación de identidad
          según los términos descritos y los{' '}
          <Link href="/terminos" target="_blank" className="text-forest underline underline-offset-2 font-medium hover:text-forest-dark">
            Términos de Uso de Rukka
          </Link>
          .
        </span>
      </label>

      <button
        onClick={onAccept}
        disabled={!checked}
        className="w-full bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar con la verificación
      </button>
    </div>
  )
}

function InfoRow({ icon, title, text, highlight }) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl ${highlight ? 'bg-andean/5 border border-andean/20' : 'bg-gray-50'}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-700 mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

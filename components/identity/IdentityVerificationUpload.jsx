'use client'
import { useState, useRef, useCallback } from 'react'
import {
  Shield, Upload, CheckCircle, AlertCircle, Loader2,
  FileText, Globe, RefreshCw, Lock, Eye
} from 'lucide-react'
import { ALLOWED_DOCUMENTS } from '@/lib/identity/allowed-documents'

const TARGET_BYTES = 350_000

async function compressImage(file) {
  if (file.size < 150_000) return file
  const compress = (canvas, q) => new Promise(res =>
    canvas.toBlob(
      blob => res(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
      'image/jpeg', q
    )
  )
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = async () => {
      URL.revokeObjectURL(url)
      const MAX_PX = 1280
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > MAX_PX || height > MAX_PX) {
        if (width >= height) { height = Math.round(height * MAX_PX / width); width = MAX_PX }
        else                  { width = Math.round(width * MAX_PX / height); height = MAX_PX }
      }
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      let result = await compress(canvas, 0.75)
      if (result.size > TARGET_BYTES) result = await compress(canvas, 0.55)
      resolve(result)
    }
    img.onerror = reject
    img.src = url
  })
}

const DOC_TYPE_LABELS = {
  national_id:     'Documento Nacional',
  passport:        'Pasaporte',
  drivers_license: 'Licencia de Conducir',
}

const COUNTRY_FLAGS = { CL: '🇨🇱', AR: '🇦🇷', CO: '🇨🇴', MX: '🇲🇽' }

export default function IdentityVerificationUpload({ onVerified }) {
  const [country, setCountry]       = useState('')
  const [docType, setDocType]       = useState('')
  const [preview, setPreview]       = useState(null)
  const [file, setFile]             = useState(null)
  const [status, setStatus]         = useState('idle') // idle | compressing | verifying | success | error
  const [result, setResult]         = useState(null)
  const [errorMsg, setErrorMsg]     = useState('')
  const inputRef = useRef()

  const countryDocs = country ? ALLOWED_DOCUMENTS[country]?.documents ?? [] : []

  const handleCountryChange = (e) => {
    setCountry(e.target.value)
    setDocType('')
    setFile(null)
    setPreview(null)
    setResult(null)
    setStatus('idle')
  }

  const handleFileChange = useCallback(async (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setErrorMsg('Solo se aceptan imágenes (JPG, PNG, WebP).')
      return
    }
    setErrorMsg('')
    setResult(null)
    setStatus('compressing')
    try {
      const compressed = await compressImage(selected)
      setFile(compressed)
      setPreview(URL.createObjectURL(compressed))
      setStatus('idle')
    } catch {
      setErrorMsg('No se pudo procesar la imagen. Intenta con otra foto.')
      setStatus('idle')
    }
  }, [])

  const handleSubmit = async () => {
    if (!file || !country || !docType) return
    setStatus('verifying')
    setErrorMsg('')
    try {
      const formData = new FormData()
      formData.append('document_image', file)
      const res = await fetch('/api/verify-identity', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error al verificar. Intenta nuevamente.')
        setStatus('error')
        return
      }
      setResult(data)
      setStatus(data.verified ? 'success' : 'error')
      if (data.verified && onVerified) onVerified(data)
    } catch {
      setErrorMsg('Error de conexión. Intenta nuevamente.')
      setStatus('error')
    }
  }

  const handleRetry = () => {
    setStatus('idle')
    setResult(null)
    setFile(null)
    setPreview(null)
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = status === 'compressing' || status === 'verifying'
  const canSubmit = file && country && docType && !busy

  return (
    <div className="space-y-5">
      {/* Privacy notice */}
      <div className="flex gap-3 bg-andean/5 border border-andean/20 rounded-xl p-3.5">
        <Lock className="w-4 h-4 text-andean flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-andean">Tu imagen no se almacena.</span>{' '}
          Solo guardamos los datos extraídos (nombre, número de documento y tipo) una vez verificados.
        </p>
      </div>

      {/* Country selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> País del documento
        </label>
        <select
          value={country}
          onChange={handleCountryChange}
          disabled={busy}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest disabled:opacity-50"
        >
          <option value="">Selecciona un país…</option>
          {Object.entries(ALLOWED_DOCUMENTS).map(([code, { country: name }]) => (
            <option key={code} value={code}>
              {COUNTRY_FLAGS[code]} {name}
            </option>
          ))}
        </select>
      </div>

      {/* Document type selector */}
      {country && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Tipo de documento
          </label>
          <div className="grid gap-2">
            {countryDocs.map(doc => (
              <button
                key={doc.type}
                type="button"
                onClick={() => setDocType(doc.type)}
                disabled={busy}
                className={`flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-colors text-sm disabled:opacity-50 ${
                  docType === doc.type
                    ? 'border-forest bg-forest/5 text-forest font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  docType === doc.type ? 'border-forest bg-forest' : 'border-gray-300'
                }`}>
                  {docType === doc.type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="font-medium leading-tight">{doc.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.issuer}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File upload */}
      {docType && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Foto del documento (frente)
          </label>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={preview} alt="Documento" className="w-full max-h-48 object-contain bg-gray-50" />
              {status !== 'success' && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="absolute top-2 right-2 bg-white/90 border border-gray-200 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-forest/50 hover:bg-forest/[0.02] transition-colors disabled:opacity-50"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">Toca para subir foto</span>
              <span className="text-xs text-gray-400">JPG, PNG o WebP · máx. 2MB</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Result — success */}
      {status === 'success' && result && (
        <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-forest font-bold text-sm">
            <CheckCircle className="w-4 h-4" /> Identidad verificada
          </div>
          {result.full_name && (
            <div>
              <p className="text-xs text-gray-400">Nombre</p>
              <p className="text-sm font-semibold text-gray-800">{result.full_name}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap pt-1">
            {result.document_type && (
              <span className="inline-flex items-center gap-1 bg-forest text-white text-xs font-medium px-2.5 py-1 rounded-full">
                <FileText className="w-3 h-3" />
                {DOC_TYPE_LABELS[result.document_type] ?? result.document_type}
              </span>
            )}
            {result.document_country && (
              <span className="inline-flex items-center gap-1 bg-andean text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {COUNTRY_FLAGS[result.document_country]} {ALLOWED_DOCUMENTS[result.document_country]?.country}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Result — rejection */}
      {status === 'error' && result && !result.verified && (
        <div className="bg-terra/5 border border-terra/20 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-terra flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-terra">Verificación no aprobada</p>
              <p className="text-xs text-gray-600 mt-1">
                {result.rejection_reason ?? 'No fue posible verificar el documento.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 border border-terra/30 text-terra text-sm font-semibold py-2.5 rounded-xl hover:bg-terra/5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Intentar nuevamente
          </button>
        </div>
      )}

      {/* Generic error */}
      {errorMsg && !result && (
        <p className="text-sm text-terra flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
        </p>
      )}

      {/* Submit */}
      {status !== 'success' && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'compressing' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Procesando imagen…</>
          ) : status === 'verifying' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Verificando identidad…</>
          ) : (
            <><Shield className="w-4 h-4" /> Verificar identidad</>
          )}
        </button>
      )}
    </div>
  )
}

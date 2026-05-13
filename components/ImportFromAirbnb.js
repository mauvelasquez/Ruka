'use client'
import { useState, useRef, useCallback } from 'react'
import { X, Upload, Sparkles, CheckCircle, AlertCircle, Loader2, Camera, ImagePlus, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'

const FIELD_LABELS = {
  title:       'Nombre de la propiedad',
  description: 'Descripción',
  location:    'Ubicación',
  city:        'Ciudad',
  region:      'Región',
  type:        'Tipo de propiedad',
  bedrooms:    'Habitaciones',
  bathrooms:   'Baños',
  maxGuests:   'Máx. huéspedes',
  size:        'Tamaño (m²)',
  amenities:   'Comodidades',
  rating:      'Rating',
  reviewCount: 'Nº reseñas',
}

// ── step machine ──────────────────────────────────────────
// idle → uploading → extracting → review → done
// ─────────────────────────────────────────────────────────

export default function AirbnbImportModal({ onClose, onImport }) {
  const [step,      setStep]      = useState('idle')       // idle | uploading | extracting | review | done
  const [files,     setFiles]     = useState([])           // File[]
  const [previews,  setPreviews]  = useState([])           // dataURL[]
  const [extracted, setExtracted] = useState(null)         // parsed object
  const [edited,    setEdited]    = useState(null)         // user-edited copy
  const [error,     setError]     = useState('')
  const [showRaw,   setShowRaw]   = useState(false)
  const inputRef = useRef()
  const dropRef  = useRef()

  // ── drag-and-drop ──────────────────────────────────────
  const onDrop = useCallback(e => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (dropped.length) addFiles(dropped)
  }, [])

  const addFiles = newFiles => {
    const merged = [...files, ...newFiles].slice(0, 5) // max 5 screenshots
    setFiles(merged)
    merged.forEach(f => {
      const r = new FileReader()
      r.onload = ev => setPreviews(p => {
        const next = [...p]
        const idx  = merged.indexOf(f)
        next[idx]  = ev.target.result
        return next
      })
      r.readAsDataURL(f)
    })
    setStep('uploading')
    setError('')
  }

  const removeFile = idx => {
    setFiles(f   => f.filter((_, i) => i !== idx))
    setPreviews(p => p.filter((_, i) => i !== idx))
    if (files.length <= 1) setStep('idle')
  }

  // ── call API ───────────────────────────────────────────
  const extract = async () => {
    if (!files.length) return
    setStep('extracting')
    setError('')
    try {
      const formData = new FormData()
      files.forEach((f, i) => formData.append(`image_${i}`, f))

      const res = await fetch('/api/import-airbnb', { method: 'POST', body: formData })
      if (!res.ok) throw new Error((await res.json()).error || 'Error del servidor')
      const data = await res.json()
      setExtracted(data)
      setEdited(data)
      setStep('review')
    } catch (err) {
      setError(err.message)
      setStep('uploading')
    }
  }

  // ── field edit helpers ─────────────────────────────────
  const set = (key, val) => setEdited(e => ({ ...e, [key]: val }))

  const confirmImport = () => {
    onImport(edited)
    setStep('done')
  }

  const reset = () => {
    setStep('idle'); setFiles([]); setPreviews([])
    setExtracted(null); setEdited(null); setError('')
  }

  // ── render ─────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A5F]/10 flex items-center justify-center">
              <span className="text-lg">🏠</span>
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-base leading-tight">Importar desde Airbnb</h2>
              <p className="text-xs text-gray-400">Sube hasta 5 pantallazos · la IA extrae los datos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── STEP: idle or uploading ─────────────────────── */}
          {(step === 'idle' || step === 'uploading') && (<>

            {/* Drop zone */}
            <div
              ref={dropRef}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-[#FF5A5F]/50 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
              style={{ background: 'linear-gradient(135deg,#fff9f9 0%,#fff 100%)' }}>
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A5F]/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7 text-[#FF5A5F]" />
              </div>
              <p className="font-bold text-gray-800 mb-1">Arrastra tus pantallazos aquí</p>
              <p className="text-sm text-gray-400 mb-4">o haz clic para seleccionar · JPG, PNG, WEBP · máx. 5 imágenes</p>
              <span className="inline-flex items-center gap-1.5 bg-[#FF5A5F] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#e04e53] transition-colors">
                <ImagePlus className="w-4 h-4" /> Seleccionar imágenes
              </span>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => addFiles(Array.from(e.target.files))} />
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Consejos para mejores resultados</p>
              <ul className="space-y-1">
                {[
                  'Captura la página principal del anuncio (título, ubicación, fotos)',
                  'Incluye la sección de descripción completa',
                  'Agrega el pantallazo de habitaciones, baños y comodidades',
                  'El rating y las reseñas ayudan a enriquecer el perfil',
                ].map((t, i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                    <span className="font-bold mt-0.5">{i + 1}.</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Imágenes cargadas ({previews.length}/5)</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {previews.map((src, i) => src && (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={e => { e.stopPropagation(); removeFile(i) }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                  {previews.length < 5 && (
                    <button onClick={() => inputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-[#FF5A5F]/40 transition-colors">
                      <ImagePlus className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button onClick={extract} disabled={!files.length}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                bg-[#FF5A5F] text-white hover:bg-[#e04e53]">
              <Sparkles className="w-4 h-4" />
              Extraer datos con IA ({files.length} imagen{files.length !== 1 ? 'es' : ''})
            </button>
          </>)}

          {/* ── STEP: extracting ────────────────────────────── */}
          {step === 'extracting' && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FF5A5F]/10 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-[#FF5A5F] animate-spin" />
              </div>
              <p className="font-bold text-gray-900 mb-1">Analizando tus pantallazos…</p>
              <p className="text-sm text-gray-400">La IA está leyendo título, habitaciones, descripción y más</p>
            </div>
          )}

          {/* ── STEP: review ────────────────────────────────── */}
          {step === 'review' && edited && (<>

            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800">¡Datos extraídos correctamente!</p>
                <p className="text-xs text-green-600">Revisa y edita antes de importar</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Title */}
              <Field label="Nombre" value={edited.title || ''} onChange={v => set('title', v)} />

              {/* Location row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ciudad"  value={edited.city || ''}     onChange={v => set('city', v)} />
                <Field label="Región"  value={edited.region || ''}   onChange={v => set('region', v)} />
              </div>
              <Field label="Dirección / Zona" value={edited.location || ''} onChange={v => set('location', v)} />

              {/* Numbers row */}
              <div className="grid grid-cols-3 gap-3">
                <Field label="Habitaciones" type="number" value={edited.bedrooms ?? ''} onChange={v => set('bedrooms', Number(v))} />
                <Field label="Baños"        type="number" value={edited.bathrooms ?? ''} onChange={v => set('bathrooms', Number(v))} />
                <Field label="Huéspedes"    type="number" value={edited.maxGuests ?? ''} onChange={v => set('maxGuests', Number(v))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipo"     value={edited.type || ''} onChange={v => set('type', v)} />
                <Field label="Tamaño m²" type="number" value={edited.size ?? ''} onChange={v => set('size', Number(v))} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Descripción</label>
                <textarea value={edited.description || ''} rows={4}
                  onChange={e => set('description', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none" />
              </div>

              {/* Amenities */}
              {edited.amenities?.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Comodidades detectadas</label>
                  <div className="flex flex-wrap gap-2">
                    {edited.amenities.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-forest-50 text-forest text-xs font-semibold px-3 py-1 rounded-full border border-forest-100">
                        {a}
                        <button onClick={() => set('amenities', edited.amenities.filter((_, j) => j !== i))}
                          className="ml-1 text-forest/60 hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {edited.rating > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Rating" type="number" value={edited.rating ?? ''} onChange={v => set('rating', parseFloat(v))} />
                  <Field label="Nº reseñas" type="number" value={edited.reviewCount ?? ''} onChange={v => set('reviewCount', Number(v))} />
                </div>
              )}

              {/* Raw JSON toggle */}
              <button onClick={() => setShowRaw(s => !s)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-1">
                {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showRaw ? 'Ocultar' : 'Ver'} JSON completo
              </button>
              {showRaw && (
                <pre className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs overflow-auto max-h-48 text-gray-600">
                  {JSON.stringify(edited, null, 2)}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={reset}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-4 h-4" /> Reintentar
              </button>
              <button onClick={confirmImport}
                className="flex-1 py-3 rounded-xl bg-forest text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-forest-dark transition-colors">
                <CheckCircle className="w-4 h-4" /> Importar propiedad
              </button>
            </div>
          </>)}

          {/* ── STEP: done ──────────────────────────────────── */}
          {step === 'done' && (
            <div className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-forest" />
              </div>
              <p className="text-xl font-extrabold text-gray-900 mb-1">¡Propiedad importada!</p>
              <p className="text-sm text-gray-400 mb-6">Los datos se han cargado en el formulario. Revisa y guarda.</p>
              <button onClick={onClose}
                className="bg-forest text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                Continuar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── tiny field component ──────────────────────────────────
function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white" />
    </div>
  )
}

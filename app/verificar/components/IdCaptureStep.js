'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, AlertCircle, CheckCircle, Loader, RotateCcw, Sun, Square, Sparkles } from 'lucide-react'

function compressImage(file, maxBytes = 1_000_000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      // Scale down if too large
      const MAX_DIM = 1600
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
        width  = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      // Try reducing quality until under maxBytes
      let q = quality
      const tryEncode = () => {
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('No se pudo comprimir la imagen'))
          if (blob.size <= maxBytes || q <= 0.3) {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target.result.split(',')[1]) // base64 only
            reader.readAsDataURL(blob)
          } else {
            q -= 0.1
            tryEncode()
          }
        }, 'image/jpeg', q)
      }
      tryEncode()
    }
    img.onerror = reject
    img.src = url
  })
}

export default function IdCaptureStep({ onSuccess }) {
  const [preview, setPreview]     = useState(null)
  const [file, setFile]           = useState(null)
  const [status, setStatus]       = useState('idle') // idle | loading | success | error
  const [error, setError]         = useState(null)
  const [result, setResult]       = useState(null)
  const inputRef = useRef()

  const handleFile = useCallback(async (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes (JPG, PNG, HEIC)')
      return
    }
    setError(null)
    setResult(null)
    setStatus('idle')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleAnalyze = async () => {
    if (!file) return
    setStatus('loading')
    setError(null)
    try {
      const base64 = await compressImage(file)
      const res = await fetch('/api/verify-id/extract', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ image_base64: base64, media_type: 'image/jpeg' }),
      })
      const data = await res.json()
      if (!data.success) {
        setStatus('error')
        setError(data.error || 'No se pudo leer el carnet. Intenta con otra foto.')
        return
      }
      if (!data.rut_valid) {
        setStatus('error')
        setError('El RUT extraído no es válido. Verifica que la imagen sea legible.')
        return
      }
      setStatus('success')
      setResult(data)
      // Small delay so user sees the success state
      setTimeout(() => onSuccess({ ...data, idImageBase64: base64 }), 1200)
    } catch (err) {
      setStatus('error')
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.')
    }
  }

  const reset = () => {
    setPreview(null)
    setFile(null)
    setStatus('idle')
    setError(null)
    setResult(null)
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-black text-gray-900 mb-1">Foto de tu carnet</h2>
        <p className="text-sm text-gray-500">Sube una foto clara de la <strong>parte frontal</strong> de tu carnet de identidad</p>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Sun className="w-4 h-4" />,     label: 'Buena luz' },
          { icon: <Square className="w-4 h-4" />,  label: 'Carnet completo' },
          { icon: <Sparkles className="w-4 h-4" />,label: 'Sin reflejos' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl text-gray-500">
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-forest/40 hover:bg-forest/5 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Arrastra tu foto aquí</p>
            <p className="text-xs text-gray-400 mt-0.5">o haz clic para seleccionar</p>
          </div>
          <p className="text-xs text-gray-300">JPG, PNG, HEIC — máx. 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[1.586/1]">
            <img src={preview} alt="Carnet preview" className="w-full h-full object-contain" />
            {status === 'success' && (
              <div className="absolute inset-0 bg-forest/20 flex items-center justify-center">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-forest" />
                </div>
              </div>
            )}
          </div>

          {status === 'error' && (
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {status === 'success' && result?.extracted_data && (
            <div className="bg-forest/5 border border-forest/20 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-forest uppercase tracking-wide mb-2">Datos extraídos</p>
              {result.extracted_data.nombre_completo && (
                <p className="text-sm text-gray-700"><span className="text-gray-400 text-xs">Nombre:</span> {result.extracted_data.nombre_completo}</p>
              )}
              {result.extracted_data.identification_number && (
                <p className="text-sm text-gray-700"><span className="text-gray-400 text-xs">N° documento:</span> {result.extracted_data.identification_number}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Cambiar foto
            </button>
            <button
              onClick={handleAnalyze}
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 flex items-center justify-center gap-2 bg-forest text-white py-2.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ¡Listo!
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Analizar carnet
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

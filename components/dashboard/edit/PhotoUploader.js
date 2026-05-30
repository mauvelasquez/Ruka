'use client'
// Prerequisito: bucket "home-images" en Supabase Storage (público, RLS por userId).
// Path de cada imagen: {userId}/{nanoid}.{webp|jpg}

import { useState, useRef, useCallback } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { compressImage } from '../../../lib/imageUtils'

// Genera un ID corto sin dependencias externas
function nanoid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Galería de fotos con compresión + upload a Supabase Storage.
 * Controlled: `photos` = fuente de verdad de URLs ya guardadas.
 * `onChange(newPhotos)` se llama cuando el array cambia (add o remove).
 *
 * Props:
 *   photos: string[]       — URLs de fotos ya subidas
 *   onChange: (string[]) => void
 *   userId: string         — auth.uid() del usuario
 *   onSaving: (bool) => void — notifica al padre si hay uploads en curso
 *   max: number            — máximo de fotos (default 12)
 */
export default function PhotoUploader({ photos, onChange, userId, onSaving, max = 12 }) {
  // Items en proceso de compresión/upload — separados del array definitivo
  const [processing, setProcessing] = useState([])
  const photosRef = useRef(photos)
  photosRef.current = photos

  const handleFiles = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const available = max - photosRef.current.length - processing.length
    if (available <= 0) return
    const batch = files.slice(0, available)

    // Crear placeholders inmediatos para preview local
    const newItems = batch.map(f => ({
      id:        nanoid(),
      objectUrl: URL.createObjectURL(f),
      status:    'compressing',
      metrics:   null,
      file:      f,
    }))

    setProcessing(prev => [...prev, ...newItems])
    onSaving?.(true)

    // Procesar todos en paralelo
    const results = await Promise.allSettled(
      newItems.map(async (item) => {
        try {
          // Comprimir
          const result = await compressImage(item.file)

          setProcessing(prev =>
            prev.map(p => p.id === item.id ? { ...p, status: 'uploading', metrics: result } : p)
          )

          // Subir a Storage
          const ext  = result.format === 'image/webp' ? 'webp' : 'jpg'
          const path = `${userId}/${item.id}.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('home-images')
            .upload(path, result.blob, { contentType: result.format, upsert: false })
          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage.from('home-images').getPublicUrl(path)

          URL.revokeObjectURL(item.objectUrl)
          return { id: item.id, url: publicUrl, metrics: result, success: true }
        } catch (err) {
          console.error('[PhotoUploader] upload error:', err)
          setProcessing(prev =>
            prev.map(p => p.id === item.id ? { ...p, status: 'error' } : p)
          )
          return { id: item.id, success: false }
        }
      })
    )

    const successes = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => r.value)

    // Quitar exitosos del processing
    const successIds = successes.map(s => s.id)
    setProcessing(prev => prev.filter(p => !successIds.includes(p.id)))

    if (successes.length > 0) {
      onChange([...photosRef.current, ...successes.map(s => s.url)])
    }

    onSaving?.(false)
  }, [processing.length, max, userId, onChange, onSaving])

  const removePhoto = useCallback((index) => {
    onChange(photosRef.current.filter((_, i) => i !== index))
  }, [onChange])

  const removeProcessing = useCallback((id) => {
    setProcessing(prev => {
      const item = prev.find(p => p.id === id)
      if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl)
      return prev.filter(p => p.id !== id)
    })
  }, [])

  const totalCount = photos.length + processing.length

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {/* Fotos ya subidas */}
        {photos.map((src, i) => (
          <div key={src} className="relative aspect-video rounded-xl overflow-hidden group bg-gray-100">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label="Eliminar foto"
                className="bg-white text-red-500 rounded-full p-1 hover:bg-red-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5 font-semibold">
                Portada
              </span>
            )}
          </div>
        ))}

        {/* Items en proceso */}
        {processing.map((item) => (
          <div key={item.id} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
            <img src={item.objectUrl} alt="" className="w-full h-full object-cover" />
            {item.status === 'compressing' && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span className="text-white text-[10px] font-semibold">Optimizando…</span>
              </div>
            )}
            {item.status === 'uploading' && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span className="text-white text-[10px] font-semibold">Subiendo…</span>
                {item.metrics && !item.metrics.skipped && (
                  <span className="text-white/80 text-[9px]">
                    {item.metrics.originalKB}KB → {item.metrics.sizeKB}KB
                  </span>
                )}
              </div>
            )}
            {item.status === 'error' && (
              <div className="absolute inset-0 bg-red-500/70 flex flex-col items-center justify-center gap-1">
                <span className="text-white text-[10px] font-bold text-center px-1">Error al subir</span>
                <button
                  type="button"
                  onClick={() => removeProcessing(item.id)}
                  className="text-white/80 text-[9px] underline"
                >
                  Descartar
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Botón agregar */}
        {totalCount < max && (
          <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-forest cursor-pointer flex flex-col items-center justify-center gap-1 transition group">
            <Camera className="w-5 h-5 text-gray-400 group-hover:text-forest" />
            <span className="text-xs text-gray-400 group-hover:text-forest">Agregar</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </label>
        )}
      </div>

      {/* Resumen de compresión para el último batch (solo si hay fotos) */}
      {photos.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          {photos.length}/{max} fotos · La primera es la portada
        </p>
      )}
    </div>
  )
}

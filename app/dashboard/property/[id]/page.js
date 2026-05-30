'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useApp } from '../../../../lib/store'
import ChileLocationSelect from '../../../../components/ChileLocationSelect'
import CountryRegionSelector from '../../../../components/geo/CountryRegionSelector'
import DescriptionHints from '../../../../components/DescriptionHints'
import Link from 'next/link'

// Importación lazy/dinámica — aísla errores del importador Airbnb
// de la carga principal del formulario de propiedad
const ImportFromAirbnb = dynamic(
  () => import('../../../../components/ImportFromAirbnb'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-center gap-2 text-gray-400 text-sm mb-6">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-forest rounded-full animate-spin" />
        Cargando importador de Airbnb...
      </div>
    ),
  }
)
import {
  ArrowLeft, Save, Camera, X, ChevronDown, MapPin,
  AlertCircle, CheckCircle, Bath, Search,
} from 'lucide-react'
import { AMENITY_CATEGORIES, AIRBNB_IMPORT_LEGACY_MAP } from '../../../../lib/amenities'

// ── Constantes ────────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { key: 'full_home', label: 'Hogar completo', desc: 'Los huéspedes tienen el alojamiento para ellos solos.', emoji: '🏠' },
  { key: 'room',      label: 'Habitación',     desc: 'Los huéspedes tienen su habitación pero comparten áreas comunes.', emoji: '🛏️' },
]

const SUBTYPES = {
  full_home: ['Casa', 'Departamento', 'Cabaña', 'Bungalow', 'Villa', 'Loft', 'Estudio', 'Otro'],
  room:      ['Habitación estándar', 'Habitación suite', 'Habitación con baño privado'],
}

const BED_TYPES = ['Cama doble', 'Cama queen', 'Cama king', 'Camas individuales', 'Sofá cama', 'Futón']


// ── Photo uploader ─────────────────────────────────────────────────────────────
function PhotoUploader({ photos, onChange, max = 12 }) {
  const handleFile = (e) => {
    Array.from(e.target.files).forEach(file => {
      if (file.size > 1024 * 1024) { alert('Cada foto debe pesar menos de 1MB'); return }
      const reader = new FileReader()
      reader.onload = ev => onChange([...photos, ev.target.result])
      reader.readAsDataURL(file)
    })
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {photos.map((src, i) => (
        <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button type="button" onClick={() => onChange(photos.filter((_, j) => j !== i))}
              aria-label="Eliminar foto"
              className="bg-white text-red-500 rounded-full p-1"><X className="w-4 h-4" /></button>
          </div>
          {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">Portada</span>}
        </div>
      ))}
      {photos.length < max && (
        <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-forest cursor-pointer flex flex-col items-center justify-center gap-1 transition group">
          <Camera className="w-5 h-5 text-gray-400 group-hover:text-forest" />
          <span className="text-xs text-gray-400 group-hover:text-forest">Agregar</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function PropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const isNew = id === 'new'

  const { currentUser, homes, createHome, updateHome, ready } = useApp()

  const [saving,          setSaving]          = useState(false)
  const [error,           setError]           = useState('')
  const [success,         setSuccess]         = useState(false)
  const [geocoding,       setGeocoding]       = useState(false)
  const [geocodeError,    setGeocodeError]    = useState('')
  const [leafletError,    setLeafletError]    = useState(false)
  const [notFound,        setNotFound]        = useState(false)
  const [showAirbnbModal, setShowAirbnbModal] = useState(false)
  const [searchAmenity,   setSearchAmenity]   = useState('')

  // Form state
  const [category,  setCategory]  = useState('full_home')
  const [subtype,   setSubtype]   = useState('')
  const [homeForm,  setHomeForm]  = useState({
    title: '', description: '',
    bedrooms: 1, bathrooms: 1, maxGuests: 2,
    private_bathroom: false, bed_type: '', shared_with: 1,
    amenities: [],
  })
  const [location, setLocation] = useState({ country_code: 'CL', region: '', region_code: '', comuna: '', city: '', direccion: '' })
  const [photos,   setPhotos]   = useState([])
  const [coords,   setCoords]   = useState(null)

  // Map refs
  const mapRef         = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef      = useRef(null)

  // Auth guard
  useEffect(() => {
    if (ready && !currentUser) router.push('/auth/login')
  }, [ready, currentUser, router])

  // Load existing home for editing
  useEffect(() => {
    if (isNew || !ready) return
    const home = homes.find(h => h.id === id)
    if (!home) { setNotFound(true); return }
    if (home.userId !== currentUser?.id) { setNotFound(true); return }
    setCategory(home.category || 'full_home')
    setSubtype(home.subtype || home.type || '')
    setHomeForm({
      title:            home.title || '',
      description:      home.description || '',
      bedrooms:         home.bedrooms || 1,
      bathrooms:        home.bathrooms || 1,
      maxGuests:        home.maxGuests || 2,
      private_bathroom: home.private_bathroom || false,
      bed_type:         home.bed_type || '',
      shared_with:      home.shared_with || 1,
      amenities:        home.amenities || [],
    })
    setLocation({ country_code: home.country_code || 'CL', region: home.region || '', region_code: home.region_code || '', comuna: home.comuna || '', city: home.city || home.comuna || '', direccion: home.direccion || '' })
    setPhotos(home.images || [])
    if (home.coords) setCoords(home.coords)
  }, [isNew, ready, homes, id])

  // Init Leaflet map
  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current || !window.L) return
    const L = window.L

    const map = L.map(mapRef.current).setView([-33.45, -70.67], 9)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    const icon = L.divIcon({
      html: '<div style="width:18px;height:18px;background:#2A5C45;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>',
      iconSize: [18, 18], iconAnchor: [9, 9], className: ''
    })

    const marker = L.marker([-33.45, -70.67], { icon, draggable: true }).addTo(map)
    marker.on('dragend', e => {
      const { lat, lng } = e.target.getLatLng()
      setCoords({ lat, lng })
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let leafletTimeout = null

    const loadLeaflet = () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      if (window.L) {
        initMap()
      } else if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script')
        script.id = 'leaflet-js'
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => { clearTimeout(leafletTimeout); initMap() }
        script.onerror = () => { clearTimeout(leafletTimeout); setLeafletError(true) }
        document.body.appendChild(script)
        // Show fallback if Leaflet doesn't load within 5 seconds
        leafletTimeout = setTimeout(() => { if (!window.L) setLeafletError(true) }, 5000)
      }
    }

    // Small delay so the div is rendered
    const t = setTimeout(loadLeaflet, 100)
    return () => {
      clearTimeout(t)
      clearTimeout(leafletTimeout)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [initMap])

  // Move marker when coords change
  useEffect(() => {
    if (!coords || !mapInstanceRef.current || !markerRef.current) return
    markerRef.current.setLatLng([coords.lat, coords.lng])
    mapInstanceRef.current.setView([coords.lat, coords.lng], 14)
  }, [coords])

  const geocode = async () => {
    const q = [location.direccion, location.comuna, location.region, 'Chile'].filter(Boolean).join(', ')
    if (!q.trim()) return
    setGeocoding(true)
    setGeocodeError('')
    try {
      const controller = new AbortController()
      const timeoutId  = setTimeout(() => controller.abort(), 7000)
      let res
      try {
        res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'es' }, signal: controller.signal }
        )
      } finally {
        clearTimeout(timeoutId)
      }
      if (res.status === 429) {
        setGeocodeError('Demasiadas solicitudes al servicio de mapas. Espera un momento e intenta de nuevo.')
      } else if (res.status === 403) {
        setGeocodeError('El servicio de mapas bloqueó la solicitud. Intenta de nuevo más tarde.')
      } else if (!res.ok) {
        setGeocodeError(`No se pudo obtener la ubicación (error ${res.status}). Intenta de nuevo.`)
      } else {
        const data = await res.json()
        if (data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
        } else {
          setGeocodeError('No se encontró la dirección. Prueba con menos detalles o solo la comuna.')
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setGeocodeError('La búsqueda tardó demasiado. Intenta de nuevo.')
      } else {
        setGeocodeError('No se pudo conectar con el servicio de mapas. Verifica tu conexión.')
      }
    }
    setGeocoding(false)
  }

  const toggleAmenity = (aid) => setHomeForm(f => ({
    ...f,
    amenities: f.amenities.includes(aid)
      ? f.amenities.filter(a => a !== aid)
      : [...f.amenities, aid]
  }))

  const handleAirbnbImport = (data) => {
    try {
      const allIds = AMENITY_CATEGORIES.flatMap(cat => cat.amenities.map(a => a.id))
      // Translate legacy Airbnb import IDs → current IDs, then filter valid ones
      const mapped = (data?.amenities || [])
        .map(a => AIRBNB_IMPORT_LEGACY_MAP[a] || a)
        .filter(a => allIds.includes(a))

      // Mapear tipo (campo 'type' de Claude Vision) a categoría y subtipo de Rukka
      const tipo = (data?.type || '').toLowerCase()
      let cat = 'full_home', sub = 'Casa'
      if (tipo.includes('departamento')) sub = 'Departamento'
      else if (tipo.includes('cabaña')) sub = 'Cabaña'
      else if (tipo.includes('villa')) sub = 'Villa'
      else if (tipo.includes('estudio')) sub = 'Estudio'
      else if (tipo.includes('loft')) sub = 'Loft'
      else if (tipo.includes('bungalow')) sub = 'Bungalow'
      if (tipo.includes('habitación') || tipo.includes('habitacion')) {
        cat = 'room'; sub = 'Habitación estándar'
      }

      setCategory(cat)
      setSubtype(sub)
      setHomeForm(f => ({
        ...f,
        title:       data?.title       || f.title,
        description: data?.description || f.description,
        maxGuests:   data?.maxGuests   || f.maxGuests,
        bedrooms:    data?.bedrooms    || f.bedrooms,
        bathrooms:   data?.bathrooms   || f.bathrooms,
        amenities:   mapped,
      }))
    } catch (err) {
      console.error('handleAirbnbImport error:', err)
      setError('Error al importar los datos de Airbnb. Intenta de nuevo o ingresa los datos manualmente.')
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')
    if (!homeForm.title.trim()) { setError('Ingresa el título del hogar'); return }
    if (location.country_code === 'CL' && !location.region) { setError('Selecciona la región'); return }
    if (location.country_code === 'CL' && !location.comuna) { setError('Selecciona la ciudad'); return }
    if (location.country_code !== 'CL' && !location.region_code) { setError('Selecciona la región'); return }
    if (location.country_code !== 'CL' && !location.city) { setError('Selecciona la ciudad'); return }
    if (!subtype)               { setError('Selecciona el tipo de hogar'); return }

    setSaving(true)
    const data = {
      title:            homeForm.title,
      description:      homeForm.description,
      category,
      subtype,
      type:             subtype,
      country_code:     location.country_code || 'CL',
      region:           location.region,
      region_code:      location.region_code,
      comuna:           location.comuna,
      city:             location.city || location.comuna,
      direccion:        location.direccion,
      coords,
      bedrooms:         homeForm.bedrooms,
      bathrooms:        homeForm.bathrooms,
      maxGuests:        homeForm.maxGuests,
      amenities:        homeForm.amenities,
      images:           photos,
      private_bathroom: homeForm.private_bathroom,
      bed_type:         homeForm.bed_type,
      shared_with:      homeForm.shared_with,
    }

    try {
      if (isNew) {
        const result = await createHome(data)
        if (!result) throw new Error('createHome devolvió null')
      } else {
        await updateHome(id, data)
      }
      setSuccess(true)
      setTimeout(() => router.push('/dashboard?tab=homes'), 1200)
    } catch (err) {
      console.error('Error guardando propiedad:', err)
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!currentUser) return null

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Propiedad no encontrada</h2>
        <p className="text-gray-500 text-sm mb-6">Este hogar no existe o no tienes acceso.</p>
        <a href="/dashboard" className="text-forest font-bold hover:text-forest-dark text-sm">← Volver al panel</a>
      </div>
    </div>
  )

  const hf = homeForm

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      {/* Header sticky */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-forest transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h1 className="font-black text-gray-900">{isNew ? 'Publicar hogar' : 'Editar hogar'}</h1>
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-forest-dark disabled:opacity-60 transition-colors">
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save className="w-4 h-4" /> Guardar</>
            }
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle className="w-4 h-4" /> ¡Guardado! Redirigiendo...
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* ── Airbnb import (solo en creación) ── */}
        {isNew && (
          <>
            <div className="bg-gradient-to-br from-[#FF5A5F]/8 to-[#FF5A5F]/4 border border-[#FF5A5F]/20 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl">📸</span>
                <div>
                  <p className="font-black text-gray-900 text-base">¿Tu propiedad está en Airbnb?</p>
                  <p className="text-gray-500 text-sm">Sube pantallazos del anuncio y la IA extrae título, descripción, capacidad y comodidades automáticamente.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAirbnbModal(true)}
                className="flex items-center gap-2 bg-[#FF5A5F] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e04e53] transition-colors"
              >
                <Camera className="w-4 h-4" /> Importar con pantallazos
              </button>
              <p className="text-xs text-gray-400 mt-2">Máx. 2 MB por imagen · hasta 5 imágenes</p>
            </div>
            {showAirbnbModal && (
              <ImportFromAirbnb
                onClose={() => setShowAirbnbModal(false)}
                onImport={(data) => { handleAirbnbImport(data); setShowAirbnbModal(false); }}
              />
            )}
          </>
        )}

        {/* ── Tipo ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-4">Tipo de alojamiento</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {CATEGORY_OPTIONS.map(opt => (
              <button key={opt.key} type="button"
                onClick={() => { setCategory(opt.key); setSubtype('') }}
                className={`p-4 rounded-2xl border-2 text-left transition ${
                  category === opt.key ? 'border-forest bg-forest/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                <span className="text-2xl mb-2 block">{opt.emoji}</span>
                <p className={`font-bold text-sm ${category === opt.key ? 'text-forest' : 'text-gray-700'}`}>{opt.label}</p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tipo específico *</label>
            <div className="relative">
              <select value={subtype} onChange={e => setSubtype(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none">
                <option value="">Selecciona una opción</option>
                {SUBTYPES[category].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {category === 'room' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Baño privado</span>
                </div>
                <button type="button"
                  onClick={() => setHomeForm(f => ({ ...f, private_bathroom: !f.private_bathroom }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${hf.private_bathroom ? 'bg-forest' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all ${hf.private_bathroom ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tipo de cama</label>
                <div className="relative">
                  <select value={hf.bed_type} onChange={e => setHomeForm(f => ({ ...f, bed_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none">
                    <option value="">Selecciona</option>
                    {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Personas que comparten</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setHomeForm(f => ({ ...f, shared_with: Math.max(0, f.shared_with - 1) }))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition">−</button>
                  <span className="text-xl font-bold text-forest w-8 text-center">{hf.shared_with}</span>
                  <button type="button" onClick={() => setHomeForm(f => ({ ...f, shared_with: f.shared_with + 1 }))}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Descripción ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-4">Descripción</h2>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Título *</label>
            <input type="text" value={hf.title} maxLength={60}
              onChange={e => setHomeForm(f => ({ ...f, title: e.target.value }))}
              placeholder="ej. Departamento luminoso en Providencia"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none" />
            <p className="text-xs text-gray-400 text-right mt-0.5">{hf.title.length}/60</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Descripción</label>
            <textarea value={hf.description} rows={5} maxLength={600}
              onChange={e => setHomeForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe tu hogar, el barrio, qué lo hace especial..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none resize-none" />
            <div className="flex items-start justify-between mt-0.5">
              <DescriptionHints />
              <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{hf.description.length}/600</p>
            </div>
          </div>
        </div>

        {/* ── Capacidad ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-4">Capacidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {[['bedrooms','Dormitorios',1,10],['bathrooms','Baños',1,6],['maxGuests','Huéspedes',1,20]].map(([field,lbl,min,max]) => (
              <div key={field} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-2">{lbl}</p>
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.max(min, f[field]-1) }))}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-forest hover:text-forest text-sm">−</button>
                  <span className="font-black text-forest w-6 text-center text-sm">{hf[field]}</span>
                  <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.min(max, f[field]+1) }))}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-forest hover:text-forest text-sm">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Comodidades ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-3">Comodidades</h2>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchAmenity}
              onChange={e => setSearchAmenity(e.target.value)}
              placeholder="Buscar comodidad..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:outline-none"
            />
            {searchAmenity && (
              <button type="button" onClick={() => setSearchAmenity('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Results: flat when searching, grouped otherwise */}
          {searchAmenity.trim() ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_CATEGORIES.flatMap(cat => cat.amenities)
                .filter(a => a.label.toLowerCase().includes(searchAmenity.toLowerCase()))
                .map(({ id: aid, emoji, label }) => {
                  const active = hf.amenities.includes(aid)
                  return (
                    <button key={aid} type="button" onClick={() => toggleAmenity(aid)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition text-left text-sm font-medium ${
                        active ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      <span className="text-base flex-shrink-0">{emoji}</span> {label}
                    </button>
                  )
                })
              }
            </div>
          ) : (
            <div className="space-y-6">
              {AMENITY_CATEGORIES.map(cat => (
                <div key={cat.id}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{cat.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cat.amenities.map(({ id: aid, emoji, label }) => {
                      const active = hf.amenities.includes(aid)
                      return (
                        <button key={aid} type="button" onClick={() => toggleAmenity(aid)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition text-left text-sm font-medium ${
                            active ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}>
                          <span className="text-base flex-shrink-0">{emoji}</span> {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Fotos ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-1">Fotos</h2>
          <p className="text-xs text-gray-400 mb-4">Máx. 12 fotos · 1MB por foto · La primera es la portada</p>
          <PhotoUploader photos={photos} onChange={setPhotos} max={12} />
        </div>

        {/* ── Ubicación + Mapa ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-lg mb-4">Ubicación</h2>

          {/* Selector de país */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">País *</label>
            <CountryRegionSelector
              value={{ country_code: location.country_code, region_code: location.region_code, city: location.city }}
              onChange={geo => setLocation(prev => ({
                ...prev,
                country_code: geo.country_code,
                region_code:  geo.region_code,
                city:         geo.city,
                region:       geo.country_code === 'CL' ? prev.region : '',
                comuna:       geo.country_code === 'CL' ? prev.comuna : geo.city,
              }))}
            />
          </div>

          {/* Para Chile: mantener el selector detallado con direccion */}
          {location.country_code === 'CL' && (
            <ChileLocationSelect value={location} onChange={v => setLocation(prev => ({ ...prev, ...v }))} showDireccion required />
          )}

          <button type="button" onClick={geocode} disabled={geocoding}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors disabled:opacity-60">
            <MapPin className="w-4 h-4" />
            {geocoding ? 'Buscando...' : 'Buscar en mapa'}
          </button>
          {geocodeError && (
            <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {geocodeError}
            </p>
          )}

          {leafletError ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm" style={{ height: 280 }}>
              <MapPin className="w-6 h-6" />
              <p className="font-medium">No se pudo cargar el mapa</p>
              <p className="text-xs text-center px-6">Puedes guardar la propiedad sin coordenadas y agregarlas más tarde.</p>
            </div>
          ) : (
            <div ref={mapRef} className="mt-4 rounded-2xl overflow-hidden border border-gray-200" style={{ height: 280 }} />
          )}

          {coords && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} — arrastra el marcador verde para ajustar
            </p>
          )}
        </div>

        {/* ── Botón guardar ── */}
        <button type="submit" disabled={saving}
          className="w-full bg-forest text-white py-4 rounded-2xl font-extrabold text-sm hover:bg-forest-dark disabled:opacity-60 transition flex items-center justify-center gap-2">
          {saving
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <><Save className="w-5 h-5" /> {isNew ? 'Publicar hogar' : 'Guardar cambios'}</>
          }
        </button>
      </form>
    </div>
  )
}

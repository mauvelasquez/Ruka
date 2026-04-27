'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import ChileLocationSelect from '@/components/ChileLocationSelect'
import {
  Home, Building2, BedDouble, Bath, Users, Camera, MapPin,
  Save, ArrowLeft, Plus, X, ChevronDown, Info, CheckCircle,
  Wifi, Car, Snowflake, Flame, Tv, Coffee, Dog, Baby,
  Utensils, Shirt, Dumbbell, Pool
} from 'lucide-react'

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const PROPERTY_TYPES = {
  full_home: {
    label: 'Hogar completo',
    icon: Home,
    description: 'Los huéspedes tienen el alojamiento para ellos solos.',
    subtypes: ['Casa', 'Departamento', 'Cabaña', 'Bungalow', 'Villa', 'Loft', 'Estudio', 'Otro'],
  },
  room: {
    label: 'Habitación privada',
    icon: BedDouble,
    description: 'Los huéspedes tienen su habitación pero comparten áreas comunes.',
    subtypes: ['Habitación estándar', 'Habitación suite', 'Habitación con baño privado'],
  },
}

const BED_TYPES = ['Cama doble', 'Cama queen', 'Cama king', 'Camas individuales', 'Sofá cama', 'Futón']

const AMENITIES = [
  { id: 'wifi',      label: 'WiFi',             icon: Wifi },
  { id: 'parking',   label: 'Estacionamiento',  icon: Car },
  { id: 'ac',        label: 'Aire acondicionado',icon: Snowflake },
  { id: 'heating',   label: 'Calefacción',      icon: Flame },
  { id: 'tv',        label: 'Televisor',        icon: Tv },
  { id: 'coffee',    label: 'Cafetera',         icon: Coffee },
  { id: 'kitchen',   label: 'Cocina equipada',  icon: Utensils },
  { id: 'washer',    label: 'Lavadora',         icon: Shirt },
  { id: 'gym',       label: 'Gimnasio',         icon: Dumbbell },
  { id: 'pool',      label: 'Piscina',          icon: Pool },
  { id: 'pets',      label: 'Mascotas ok',      icon: Dog },
  { id: 'baby',      label: 'Apto para bebés',  icon: Baby },
]

// ─── MAPA (Leaflet - gratuito, sin API key) ───────────────────────────────────
function PropertyMap({ address, onCoordsChange }) {
  const mapRef      = useRef(null)
  const mapInstance = useRef(null)
  const markerRef   = useRef(null)
  const [coords, setCoords]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Cargar Leaflet dinámicamente (gratuito, sin API key)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (document.getElementById('leaflet-css')) return

    const link = document.createElement('link')
    link.id    = 'leaflet-css'
    link.rel   = 'stylesheet'
    link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)

    return () => { /* cleanup handled by component unmount */ }
  }, [])

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstance.current) return
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [-33.4489, -70.6693], // Santiago por defecto
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Click en mapa para colocar marcador
    map.on('click', (e) => {
      placeMarker(map, e.latlng.lat, e.latlng.lng)
    })

    mapInstance.current = map
  }, [])

  const placeMarker = (map, lat, lng) => {
    const L = window.L
    if (!L) return

    if (markerRef.current) markerRef.current.remove()

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:40px;height:40px;border-radius:50% 50% 50% 0;
        background:#2d6a4f;transform:rotate(-45deg);
        border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconAnchor: [20, 40],
    })

    markerRef.current = L.marker([lat, lng], { icon, draggable: true })
      .addTo(map)
      .on('dragend', (e) => {
        const pos = e.target.getLatLng()
        updateCoords(pos.lat, pos.lng)
      })

    map.setView([lat, lng], 16)
    updateCoords(lat, lng)
  }

  const updateCoords = (lat, lng) => {
    const rounded = { lat: +lat.toFixed(6), lng: +lng.toFixed(6) }
    setCoords(rounded)
    onCoordsChange?.(rounded)
  }

  const geocodeAddress = async () => {
    if (!address?.trim()) return
    setLoading(true)
    setError('')
    try {
      const query = encodeURIComponent(`${address}, Chile`)
      const res   = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      const data  = await res.json()
      if (data.length > 0) {
        const { lat, lon } = data[0]
        if (!mapInstance.current) initMap()
        setTimeout(() => {
          if (mapInstance.current) placeMarker(mapInstance.current, +lat, +lon)
        }, 300)
      } else {
        setError('No se encontró la dirección. Haz clic en el mapa para ubicar manualmente.')
      }
    } catch {
      setError('Error al buscar la dirección. Puedes ubicarla manualmente en el mapa.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-geocode cuando hay dirección completa
  useEffect(() => {
    if (address && address.length > 10) {
      const t = setTimeout(geocodeAddress, 1200)
      return () => clearTimeout(t)
    }
  }, [address])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-forest" />
          <span className="text-sm font-semibold text-gray-700">Ubicación en el mapa</span>
        </div>
        <button
          type="button"
          onClick={geocodeAddress}
          disabled={loading || !address}
          className="text-xs text-forest hover:underline disabled:opacity-40"
        >
          {loading ? 'Buscando...' : 'Buscar dirección'}
        </button>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        style={{ height: '320px', zIndex: 0 }}
      />

      <p className="text-xs text-gray-400 text-center">
        {coords
          ? `📍 Ubicación guardada: ${coords.lat}, ${coords.lng} — puedes arrastrar el marcador para ajustar`
          : 'Haz clic en el mapa para marcar la ubicación exacta de tu propiedad'}
      </p>
    </div>
  )
}

// ─── FOTO UPLOADER ────────────────────────────────────────────────────────────
function PhotoUploader({ photos, onChange }) {
  const handleFile = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => onChange([...photos, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((src, i) => (
          <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange(photos.filter((_, j) => j !== i))}
                className="bg-white text-red-500 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">
                Portada
              </span>
            )}
          </div>
        ))}

        {photos.length < 12 && (
          <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-forest cursor-pointer flex flex-col items-center justify-center gap-1 transition group">
            <Camera className="w-6 h-6 text-gray-400 group-hover:text-forest transition" />
            <span className="text-xs text-gray-400 group-hover:text-forest transition">Agregar foto</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">La primera foto es la portada. Máximo 12 fotos.</p>
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { user, homes, updateHome, addHome } = useApp()

  const isNew = params.id === 'new'
  const home  = isNew ? null : homes.find(h => h.id === params.id)

  // ── Estado del formulario ──
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [category, setCategory] = useState(home?.category || 'full_home')
  const [subtype,  setSubtype]  = useState(home?.subtype  || '')
  const [photos,   setPhotos]   = useState(home?.images   || [])
  const [coords,   setCoords]   = useState(home?.coords   || null)
  const [amenities,setAmenities]= useState(home?.amenities || [])

  const [form, setForm] = useState({
    title:        home?.title        || '',
    description:  home?.description  || '',
    max_guests:   home?.max_guests   || 2,
    bedrooms:     home?.bedrooms     || 1,
    bathrooms:    home?.bathrooms    || 1,
    // Habitación específico
    private_bathroom: home?.private_bathroom || false,
    bed_type:     home?.bed_type     || '',
    shared_with:  home?.shared_with  || 1,
    // Ubicación
    location: {
      region:    home?.region    || '',
      comuna:    home?.comuna    || '',
      direccion: home?.direccion || '',
    },
  })

  const fullAddress = [form.location.direccion, form.location.comuna, form.location.region]
    .filter(Boolean).join(', ')

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleAmenity = (id) => {
    setAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      category,
      subtype,
      images:   photos,
      coords,
      amenities,
      region:   form.location.region,
      comuna:   form.location.comuna,
      direccion:form.location.direccion,
      city:     form.location.comuna,
    }
    try {
      if (isNew) {
        await addHome(data)
      } else {
        await updateHome(params.id, data)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Debes iniciar sesión para gestionar propiedades.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-forest transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {isNew ? 'Publicar propiedad' : 'Editar propiedad'}
          </h1>
          <button
            form="property-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-forest text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-forest-dark transition disabled:opacity-60"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Guardado</>
            ) : saving ? (
              'Guardando...'
            ) : (
              <><Save className="w-4 h-4" /> Guardar</>
            )}
          </button>
        </div>
      </div>

      <form id="property-form" onSubmit={handleSave} className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* ── CATEGORÍA ── */}
        <Section title="Tipo de propiedad" icon={Building2}>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PROPERTY_TYPES).map(([key, info]) => {
              const Icon = info.icon
              const active = category === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`p-5 rounded-2xl border-2 text-left transition flex flex-col gap-2 ${
                    active
                      ? 'border-forest bg-forest/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${active ? 'text-forest' : 'text-gray-400'}`} />
                  <span className={`font-bold text-sm ${active ? 'text-forest' : 'text-gray-700'}`}>
                    {info.label}
                  </span>
                  <span className="text-xs text-gray-400 leading-snug">{info.description}</span>
                </button>
              )
            })}
          </div>

          {/* Subtipo */}
          <div className="relative mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              ¿Qué tipo específicamente?
            </label>
            <div className="relative">
              <select
                value={subtype}
                onChange={e => setSubtype(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none"
              >
                <option value="">Selecciona una opción</option>
                {PROPERTY_TYPES[category].subtypes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── DETALLES DE HABITACIÓN ── */}
        {category === 'room' && (
          <Section title="Detalles de la habitación" icon={BedDouble}>
            <div className="space-y-5">
              {/* Baño privado */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Baño privado</p>
                    <p className="text-xs text-gray-400">¿El huésped tiene baño exclusivo?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update('private_bathroom', !form.private_bathroom)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    form.private_bathroom ? 'bg-forest' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                    form.private_bathroom ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Tipo de cama */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Tipo de cama
                </label>
                <div className="relative">
                  <select
                    value={form.bed_type}
                    onChange={e => update('bed_type', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none"
                  >
                    <option value="">Selecciona el tipo de cama</option>
                    {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Personas con las que se comparte */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  ¿Con cuántas personas más comparte el hogar?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => update('shared_with', Math.max(0, form.shared_with - 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-forest hover:text-forest transition"
                  >−</button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-forest">{form.shared_with}</span>
                    <p className="text-xs text-gray-400">
                      {form.shared_with === 0 ? 'Nadie más (solo tú)' : `persona${form.shared_with !== 1 ? 's' : ''} más en el hogar`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update('shared_with', form.shared_with + 1)}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:border-forest hover:text-forest transition"
                  >+</button>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* ── TÍTULO Y DESCRIPCIÓN ── */}
        <Section title="Descripción" icon={Info}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Título de la publicación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                required
                maxLength={60}
                placeholder="Ej: Departamento con vista al mar en Valparaíso"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/60</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={5}
                maxLength={800}
                placeholder="Cuéntale a los visitantes sobre tu espacio: ambiente, entorno, qué lo hace especial..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/800</p>
            </div>
          </div>
        </Section>

        {/* ── CAPACIDAD ── */}
        <Section title="Capacidad" icon={Users}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'max_guests', label: 'Huéspedes', min: 1, max: 20 },
              { key: 'bedrooms',   label: 'Dormitorios', min: 0, max: 20 },
              { key: 'bathrooms',  label: 'Baños', min: 0, max: 10 },
            ].map(({ key, label, min, max }) => (
              <div key={key} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-2">{label}</p>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => update(key, Math.max(min, form[key] - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition text-sm"
                  >−</button>
                  <span className="text-xl font-bold text-forest w-8 text-center">{form[key]}</span>
                  <button
                    type="button"
                    onClick={() => update(key, Math.min(max, form[key] + 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition text-sm"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── COMODIDADES ── */}
        <Section title="Comodidades" icon={CheckCircle}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map(({ id, label, icon: Icon }) => {
              const active = amenities.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAmenity(id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition text-left ${
                    active
                      ? 'border-forest bg-forest/5 text-forest'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── FOTOS ── */}
        <Section title="Fotos" icon={Camera}>
          <PhotoUploader photos={photos} onChange={setPhotos} />
        </Section>

        {/* ── UBICACIÓN ── */}
        <Section title="Ubicación" icon={MapPin}>
          <div className="space-y-6">
            <ChileLocationSelect
              value={form.location}
              onChange={(loc) => update('location', loc)}
              showDireccion
              required
            />

            <PropertyMap
              address={fullAddress}
              onCoordsChange={setCoords}
            />
          </div>
        </Section>

        {/* Botón final */}
        <div className="pb-8">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-forest text-white py-4 rounded-2xl font-bold text-base hover:bg-forest-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saved ? (
              <><CheckCircle className="w-5 h-5" /> ¡Propiedad guardada!</>
            ) : saving ? (
              'Guardando...'
            ) : (
              <><Save className="w-5 h-5" /> {isNew ? 'Publicar propiedad' : 'Guardar cambios'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── HELPER ───────────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-forest" />
        </div>
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

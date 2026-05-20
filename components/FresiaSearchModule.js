'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, Minus, Plus, Navigation } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CITIES = [
  { icon: '🌺', name: 'Zapallar',            desc: 'Exclusividad costera' },
  { icon: '🐧', name: 'Cachagua',            desc: 'Playa secreta' },
  { icon: '⚓', name: 'Papudo',              desc: 'Caleta pintoresca' },
  { icon: '🏖️', name: 'Santo Domingo',       desc: 'Arena blanca y dunas' },
  { icon: '🏄', name: 'Pichilemu',           desc: 'Capital del surf' },
  { icon: '🤙', name: 'Puertecillo',         desc: 'Olas de clase mundial' },
  { icon: '🌊', name: 'Navidad',             desc: 'Costa salvaje' },
  { icon: '🪁', name: 'Matanzas',            desc: 'Paraíso del kitesurf' },
  { icon: '🌋', name: 'Pucón',              desc: 'Volcán y aventura' },
  { icon: '🌹', name: 'Puerto Varas',        desc: 'Lago y volcán Osorno' },
  { icon: '🔭', name: 'La Serena',           desc: 'Playas y astronomía' },
  { icon: '🌵', name: 'San Pedro de Atacama', desc: 'Desierto y estrellas' },
  { icon: '🏔️', name: 'Torres del Paine',    desc: 'Trekking y glaciares' },
  { icon: '🌸', name: 'Viña del Mar',        desc: 'Playa y ciudad jardín' },
  { icon: '🐋', name: 'Puerto Montt',        desc: 'Patagonia y fiordos' },
  { icon: '🍷', name: 'Santa Cruz',          desc: 'Vino y cultura rural' },
]

const FOREST = '#1B4332'

// ── Date utilities ─────────────────────────────────────────────────────────────
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Do','Lu','Ma','Mi','Ju','Vi','Sa']

const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString()
const inRange  = (d, s, e) => s && e && d > s && d < e
const fmtDate  = d => d?.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) ?? null

// ── Month calendar ─────────────────────────────────────────────────────────────
function MonthCalendar({ year, month, checkIn, checkOut, hover, onDay, onHover }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow    = new Date(year, month, 1).getDay()
  const today       = new Date(); today.setHours(0,0,0,0)

  const cells = Array.from({ length: startDow }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  return (
    <div>
      <p className="text-center text-sm font-bold text-gray-900 mb-3">{MONTHS_ES[month]} {year}</p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map(d => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const date = new Date(year, month, d); date.setHours(0,0,0,0)
          const past  = date < today
          const isCI  = sameDay(date, checkIn)
          const isCO  = sameDay(date, checkOut)
          const range = inRange(date, checkIn, checkOut || hover)
          const hov   = sameDay(date, hover) && checkIn && !checkOut
          let cls = 'flex items-center justify-center text-sm h-9 rounded-full transition-colors '
          if (past)          cls += 'text-gray-300 cursor-default'
          else if (range || hov) cls += `bg-[${FOREST}]/10 text-gray-800 cursor-pointer`
          else               cls += 'text-gray-800 hover:bg-gray-100 cursor-pointer'
          return (
            <div key={d} className={cls}
              style={isCI || isCO ? { background: FOREST, color: '#fff', borderRadius: '50%' } : {}}
              onClick={() => !past && onDay(date)}
              onMouseEnter={() => !past && onHover(date)}
            >{d}</div>
          )
        })}
      </div>
    </div>
  )
}

// ── Date picker dropdown ───────────────────────────────────────────────────────
function DatePickerDropdown({ checkIn, checkOut, onChange, onClose }) {
  const now = new Date()
  const [yr,   setYr]   = useState(now.getFullYear())
  const [mo,   setMo]   = useState(now.getMonth())
  const [hover, setHover] = useState(null)
  const [mode,  setMode]  = useState('exact')
  const [flex,  setFlex]  = useState(null)

  const yr2 = mo === 11 ? yr + 1 : yr
  const mo2 = mo === 11 ? 0 : mo + 1

  const prev = () => mo === 0  ? (setMo(11), setYr(y => y - 1)) : setMo(m => m - 1)
  const next = () => mo === 11 ? (setMo(0),  setYr(y => y + 1)) : setMo(m => m + 1)

  const onDay = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: date, checkOut: null })
    } else if (date < checkIn) {
      onChange({ checkIn: date, checkOut: null })
    } else {
      onChange({ checkIn, checkOut: date })
      onClose()
    }
  }

  return (
    <div className="p-4 w-full">
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
          {['exact','flexible'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              {m === 'exact' ? 'Fechas exactas' : 'Flexible'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'exact' ? (
        <>
          <div className="flex items-start gap-4">
            <button onClick={prev} className="mt-1 p-1 hover:bg-gray-100 rounded-full" aria-label="Mes anterior">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MonthCalendar year={yr} month={mo} checkIn={checkIn} checkOut={checkOut} hover={hover} onDay={onDay} onHover={setHover} />
              <div className="hidden sm:block">
                <MonthCalendar year={yr2} month={mo2} checkIn={checkIn} checkOut={checkOut} hover={hover} onDay={onDay} onHover={setHover} />
              </div>
            </div>
            <button onClick={next} className="mt-1 p-1 hover:bg-gray-100 rounded-full" aria-label="Mes siguiente">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3 h-4">
            {checkIn && !checkOut ? 'Selecciona fecha de salida' : ''}
            {checkIn && checkOut  ? `${fmtDate(checkIn)} → ${fmtDate(checkOut)}` : ''}
          </p>
        </>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500 mb-3">¿Cuánta flexibilidad tienes?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['±1 día','±2 días','±3 días','±7 días','±14 días'].map(opt => (
              <button key={opt} onClick={() => setFlex(opt)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${flex === opt ? 'border-forest text-forest font-medium bg-forest/5' : 'border-gray-200 text-gray-600 hover:border-forest'}`}
                style={flex === opt ? { borderColor: FOREST, color: FOREST } : {}}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Guests dropdown ────────────────────────────────────────────────────────────
function GuestsDropdown({ guests, onChange }) {
  const rows = [
    { key: 'adults',   label: 'Adultos',  desc: '13 años o más' },
    { key: 'children', label: 'Niños',    desc: '2–12 años' },
    { key: 'babies',   label: 'Bebés',    desc: 'Menos de 2 años' },
    { key: 'pets',     label: 'Mascotas', desc: '' },
  ]
  return (
    <div className="p-4 space-y-4" style={{ minWidth: 280 }}>
      {rows.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            {desc && <p className="text-xs text-gray-400">{desc}</p>}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onChange({ ...guests, [key]: Math.max(0, (guests[key] || 0) - 1) })}
              disabled={(guests[key] || 0) === 0}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 transition hover:border-[#1B4332] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={`Reducir ${label}`}
            ><Minus className="w-3 h-3" /></button>
            <span className="w-5 text-center text-sm font-medium">{guests[key] || 0}</span>
            <button
              onClick={() => onChange({ ...guests, [key]: (guests[key] || 0) + 1 })}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 transition hover:border-[#1B4332]"
              aria-label={`Aumentar ${label}`}
            ><Plus className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Cities dropdown ────────────────────────────────────────────────────────────
function CitiesDropdown({ onSelect }) {
  return (
    <div className="p-2" style={{ minWidth: 240 }}>
      <button onClick={() => onSelect('Cerca de ti')}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-left">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${FOREST}15` }}>
          <Navigation className="w-4 h-4" style={{ color: FOREST }} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Cerca de ti</p>
          <p className="text-xs text-gray-400">Destinos cercanos</p>
        </div>
      </button>
      <div className="border-t border-gray-100 my-1.5" />
      {CITIES.map(({ icon, name, desc }) => (
        <button key={name} onClick={() => onSelect(name)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition text-left">
          <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FresiaSearchModule() {
  const router = useRouter()

  const [where,    setWhere]    = useState('')
  const [checkIn,  setCheckIn]  = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests,   setGuests]   = useState({ adults: 0, children: 0, babies: 0, pets: 0 })
  const [openDropdown, setOpenDropdown] = useState(null) // 'where' | 'when' | 'who'
  const searchBarRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    const p = new URLSearchParams()
    if (where) p.set('search', where)
    if (checkIn) p.set('from', checkIn.toISOString().split('T')[0])
    if (checkOut) p.set('to', checkOut.toISOString().split('T')[0])
    const total = (guests.adults || 0) + (guests.children || 0)
    if (total > 0) p.set('guests', total)
    router.push(`/homes${p.size > 0 ? '?' + p.toString() : ''}`)
  }

  const totalGuests = Object.values(guests).reduce((a, b) => a + (b || 0), 0)
  const hasAnySearch = where || checkIn || totalGuests > 0

  const datesLabel = checkIn
    ? checkOut ? `${fmtDate(checkIn)} – ${fmtDate(checkOut)}` : `Desde ${fmtDate(checkIn)}`
    : null

  const guestsLabel = totalGuests === 0 ? null
    : `${(guests.adults||0) + (guests.children||0)} pers.${guests.pets ? `, ${guests.pets} masc.` : ''}`

  return (
    <div ref={searchBarRef} className="relative w-full flex flex-col sm:flex-row items-stretch sm:items-center"
      style={{ maxWidth: 680, background: '#FFFFFF', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>

      {/* Dónde */}
      <div className="relative flex-1">
        <button onClick={() => setOpenDropdown(p => p === 'where' ? null : 'where')}
          className="block w-full text-left transition-colors hover:bg-[#F7F7F7] rounded-tl-3xl rounded-bl-3xl sm:rounded-bl-none"
          style={{ padding: '14px 20px', background: openDropdown === 'where' ? '#F7F7F7' : 'transparent', border: 'none', cursor: 'pointer' }}
          aria-haspopup="listbox" aria-expanded={openDropdown === 'where'} aria-label="Seleccionar destino">
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Dónde</p>
          <p style={{ fontSize: 14, color: where ? '#1a1a1a' : '#717171', margin: 0, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {where || 'Explora destinos'}
          </p>
        </button>
        {openDropdown === 'where' && (
          <div className="rukka-dropdown" style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 8, zIndex: 50, background: '#FFF', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', maxHeight: 380, overflowY: 'auto' }}>
            <CitiesDropdown onSelect={city => { setWhere(city); setOpenDropdown(null) }} />
          </div>
        )}
      </div>

      <div className="hidden sm:block flex-shrink-0" style={{ width: 1, height: 36, background: '#EBEBEB' }} />
      <div className="block sm:hidden" style={{ height: 1, background: '#EBEBEB', margin: '0 20px' }} />

      {/* Cuándo */}
      <div className="relative flex-1">
        <button onClick={() => setOpenDropdown(p => p === 'when' ? null : 'when')}
          className="block w-full text-left transition-colors hover:bg-[#F7F7F7]"
          style={{ padding: '14px 20px', background: openDropdown === 'when' ? '#F7F7F7' : 'transparent', border: 'none', cursor: 'pointer' }}
          aria-haspopup="dialog" aria-expanded={openDropdown === 'when'} aria-label="Seleccionar fechas">
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Cuándo</p>
          <p style={{ fontSize: 14, color: datesLabel ? '#1a1a1a' : '#717171', margin: 0, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {datesLabel || 'Agrega fechas'}
          </p>
        </button>
        {openDropdown === 'when' && (
          <div className="rukka-dropdown" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, zIndex: 50, background: '#FFF', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', width: 'min(560px, 90vw)' }}>
            <DatePickerDropdown
              checkIn={checkIn} checkOut={checkOut}
              onChange={({ checkIn: ci, checkOut: co }) => { setCheckIn(ci); setCheckOut(co) }}
              onClose={() => setOpenDropdown(null)}
            />
          </div>
        )}
      </div>

      <div className="hidden sm:block flex-shrink-0" style={{ width: 1, height: 36, background: '#EBEBEB' }} />
      <div className="block sm:hidden" style={{ height: 1, background: '#EBEBEB', margin: '0 20px' }} />

      {/* Quiénes */}
      <div className="relative flex-1">
        <button onClick={() => setOpenDropdown(p => p === 'who' ? null : 'who')}
          className="block w-full text-left transition-colors hover:bg-[#F7F7F7]"
          style={{ padding: '14px 20px', background: openDropdown === 'who' ? '#F7F7F7' : 'transparent', border: 'none', cursor: 'pointer' }}
          aria-haspopup="dialog" aria-expanded={openDropdown === 'who'} aria-label="Seleccionar número de personas">
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Quiénes</p>
          <p style={{ fontSize: 14, color: guestsLabel ? '#1a1a1a' : '#717171', margin: 0, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {guestsLabel || '¿Cuántos?'}
          </p>
        </button>
        {openDropdown === 'who' && (
          <div className="rukka-dropdown" style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 8, zIndex: 50, background: '#FFF', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <GuestsDropdown guests={guests} onChange={setGuests} />
          </div>
        )}
      </div>

      {/* Search button */}
      <div className="flex justify-end sm:justify-start" style={{ padding: '10px 10px 10px 8px', flexShrink: 0 }}>
        <button onClick={handleSearch}
          className="flex items-center justify-center gap-2 transition-all"
          style={{ background: FOREST, color: '#FFF', borderRadius: hasAnySearch ? 24 : '50%', minWidth: 48, height: 48, padding: hasAnySearch ? '0 20px' : 0, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0F3D2A' }}
          onMouseLeave={e => { e.currentTarget.style.background = FOREST }}
          aria-label="Buscar hogares">
          <Search className="w-4 h-4 flex-shrink-0" />
          {hasAnySearch && <span>Buscar</span>}
        </button>
      </div>
    </div>
  )
}

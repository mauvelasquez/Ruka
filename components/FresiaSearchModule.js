'use client'
import { useState, useReducer, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, X, Search, ChevronLeft, ChevronRight, Minus, Plus, Navigation } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FresiaAvatar } from './fresia/ChatInterface'

// ── Constants ──────────────────────────────────────────────────────────────────
const DESTINATION_CHIPS = [
  { emoji: '🌊', label: 'Playa' },
  { emoji: '🌲', label: 'Naturaleza' },
  { emoji: '🏔️', label: 'Montaña' },
  { emoji: '🏙️', label: 'Ciudad' },
]

const CITIES = [
  { icon: '🌺', name: 'Zapallar',      desc: 'Exclusividad costera' },
  { icon: '🐧', name: 'Cachagua',      desc: 'Playa secreta' },
  { icon: '⚓', name: 'Papudo',        desc: 'Caleta pintoresca' },
  { icon: '🏖️', name: 'Santo Domingo', desc: 'Arena blanca y dunas' },
  { icon: '🏄', name: 'Pichilemu',     desc: 'Capital del surf' },
  { icon: '🤙', name: 'Puertecillo',   desc: 'Olas de clase mundial' },
  { icon: '🌊', name: 'Navidad',       desc: 'Costa salvaje' },
  { icon: '🪁', name: 'Matanzas',      desc: 'Paraíso del kitesurf' },
]

const SESSION_KEY = 'fresia_messages'
const FOREST      = '#1B4332'

// ── Text renderer ──────────────────────────────────────────────────────────────
function Segment({ text }) {
  const parts = []
  const re = /\*\*(.*?)\*\*/g
  let last = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ bold: false, v: text.slice(last, m.index) })
    parts.push({ bold: true, v: m[1] })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ bold: false, v: text.slice(last) })
  return (
    <>{parts.map((p, i) => p.bold ? <strong key={i}>{p.v}</strong> : <span key={i}>{p.v}</span>)}</>
  )
}

function MessageContent({ text }) {
  return (
    <div className="space-y-0.5 text-sm leading-relaxed">
      {text.split('\n').map((line, i) =>
        line === '' ? <div key={i} className="h-2" /> : <p key={i}><Segment text={line} /></p>
      )}
    </div>
  )
}

// ── Chat reducer ───────────────────────────────────────────────────────────────
const INIT = { messages: [], input: '', pendingImage: null, loading: false, error: null }

function reducer(state, a) {
  switch (a.type) {
    case 'SET_INPUT':         return { ...state, input: a.value, error: null }
    case 'SET_IMAGE':         return { ...state, pendingImage: a.image }
    case 'CLEAR_IMAGE':       return { ...state, pendingImage: null }
    case 'ADD_USER_MSG':      return { ...state, messages: [...state.messages, a.msg], input: '', pendingImage: null }
    case 'ADD_ASSISTANT_MSG': return { ...state, messages: [...state.messages, a.msg] }
    case 'SET_LOADING':       return { ...state, loading: a.value }
    case 'SET_ERROR':         return { ...state, error: a.message }
    case 'SET_MESSAGES':      return { ...state, messages: a.messages }
    case 'APPEND_TEXT': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') msgs[msgs.length - 1] = { ...last, content: last.content + a.text }
      return { ...state, messages: msgs }
    }
    case 'SET_LAST_ERROR': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') msgs[msgs.length - 1] = { ...last, content: a.message, isError: true }
      return { ...state, messages: msgs, loading: false }
    }
    default: return state
  }
}

function toApiMessages(messages) {
  return messages.flatMap(msg => {
    if (msg.role === 'assistant') return msg.content && !msg.isError ? [{ role: 'assistant', content: msg.content }] : []
    if (msg.role === 'user') {
      if (msg.images?.length) return [{ role: 'user', content: [
        ...msg.images.map(img => ({ type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.base64 } })),
        { type: 'text', text: msg.content || 'Analiza esta imagen' },
      ]}]
      return msg.content ? [{ role: 'user', content: msg.content }] : []
    }
    return []
  })
}

// ── Date utilities ─────────────────────────────────────────────────────────────
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Do','Lu','Ma','Mi','Ju','Vi','Sa']

const sameDay  = (a, b) => a && b && a.toDateString() === b.toDateString()
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
          if (past)       cls += 'text-gray-300 cursor-default'
          else if (isCI || isCO) cls += `bg-[${FOREST}] text-white font-bold cursor-pointer`
          else if (range || hov) cls += `bg-[${FOREST}]/10 text-gray-800 cursor-pointer`
          else                   cls += 'text-gray-800 hover:bg-gray-100 cursor-pointer'
          return (
            <div key={d} className={cls}
              style={isCI || isCO ? { background: FOREST, color: '#fff' } : {}}
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
  const [yr,  setYr]  = useState(now.getFullYear())
  const [mo,  setMo]  = useState(now.getMonth())
  const [hover,   setHover]   = useState(null)
  const [mode,    setMode]    = useState('exact')
  const [flex,    setFlex]    = useState(null)

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
    { key: 'adults',   label: 'Adultos',   desc: '13 años o más' },
    { key: 'children', label: 'Niños',     desc: '2–12 años' },
    { key: 'babies',   label: 'Bebés',     desc: 'Menos de 2 años' },
    { key: 'pets',     label: 'Mascotas',  desc: '' },
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

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <FresiaAvatar size={28} />
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0,150,300].map(d => (
            <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: `${FOREST}99`, animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FresiaSearchModule() {
  const router = useRouter()

  // Chat
  const [state, dispatch] = useReducer(reducer, INIT)
  const messagesEndRef    = useRef(null)
  const fileInputRef      = useRef(null)
  const abortRef          = useRef(null)

  // Search fields
  const [where,    setWhere]    = useState('')
  const [checkIn,  setCheckIn]  = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests,   setGuests]   = useState({ adults: 0, children: 0, babies: 0, pets: 0 })

  // Dropdown
  const [openDropdown, setOpenDropdown] = useState(null) // 'where' | 'when' | 'who'
  const searchBarRef = useRef(null)

  // Restore session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) dispatch({ type: 'SET_MESSAGES', messages: parsed })
      }
    } catch {}
  }, [])

  // Persist session
  useEffect(() => {
    if (!state.messages.length) return
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(
        state.messages.map(m => ({ ...m, images: (m.images || []).map(img => ({ preview: img.preview })) }))
      ))
    } catch {}
  }, [state.messages])

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [state.messages, state.loading])

  // Cleanup
  useEffect(() => () => abortRef.current?.abort(), [])

  // Clear conversation when user leaves the page
  useEffect(() => {
    const clear = () => sessionStorage.removeItem(SESSION_KEY)
    window.addEventListener('pagehide', clear)
    window.addEventListener('beforeunload', clear)
    return () => {
      window.removeEventListener('pagehide', clear)
      window.removeEventListener('beforeunload', clear)
    }
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Send message to Fresia
  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride ?? state.input).trim()
    if (!text && !state.pendingImage) return
    if (state.loading) return
    // Enforce response limit (checked before sending)
    const currentCount = state.messages.filter(m => m.role === 'assistant' && m.content && !m.isError).length
    if (currentCount >= 20) return

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: text, images: state.pendingImage ? [state.pendingImage] : [], timestamp: new Date().toISOString() }
    const apiMessages = toApiMessages([...state.messages, userMsg])

    dispatch({ type: 'ADD_USER_MSG', msg: userMsg })
    dispatch({ type: 'ADD_ASSISTANT_MSG', msg: { id: `a_${Date.now() + 1}`, role: 'assistant', content: '', timestamp: new Date().toISOString() } })
    dispatch({ type: 'SET_LOADING', value: true })

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch('/api/fresia/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }), signal: ctrl.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const parts = buf.split('\n\n')
        buf = parts.pop() ?? ''
        for (const part of parts) {
          if (!part.startsWith('data: ')) continue
          try { const d = JSON.parse(part.slice(6)); if (d.type === 'text') dispatch({ type: 'APPEND_TEXT', text: d.text }) } catch {}
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') dispatch({ type: 'SET_LAST_ERROR', message: 'No pude conectarme. Intenta de nuevo 🙁' })
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }, [state.messages, state.input, state.pendingImage, state.loading])

  // Chip click — fill "where" + chat
  const handleChip = useCallback((chip) => {
    setWhere(chip.label)
    sendMessage(`Quiero ir a la ${chip.label.toLowerCase()}`)
  }, [sendMessage])

  // Image attach
  const handleImageSelect = useCallback((file) => {
    if (!file) return
    if (file.size > 4 * 1024 * 1024) { dispatch({ type: 'SET_ERROR', message: 'La imagen debe pesar menos de 4MB' }); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      const full = e.target.result
      const mt   = ['image/jpeg','image/png','image/webp','image/gif'].includes(full.split(';')[0].split(':')[1]) ? full.split(';')[0].split(':')[1] : 'image/jpeg'
      dispatch({ type: 'SET_IMAGE', image: { base64: full.split(',')[1], mediaType: mt, preview: full, name: file.name } })
    }
    reader.readAsDataURL(file)
  }, [])

  // Navigate to search results
  const handleSearch = useCallback(() => {
    const p = new URLSearchParams()
    if (where) p.set('search', where)
    if (checkIn) p.set('from', checkIn.toISOString().split('T')[0])
    if (checkOut) p.set('to', checkOut.toISOString().split('T')[0])
    const total = (guests.adults || 0) + (guests.children || 0)
    if (total > 0) p.set('guests', total)
    router.push(`/homes${p.size > 0 ? '?' + p.toString() : ''}`)
  }, [where, checkIn, checkOut, guests, router])

  // Computed labels
  const hasMessages         = state.messages.length > 0
  const isStreaming         = state.loading
  const totalGuests         = Object.values(guests).reduce((a, b) => a + (b || 0), 0)
  const hasAnySearch        = where || checkIn || totalGuests > 0
  const fresiaResponseCount = state.messages.filter(m => m.role === 'assistant' && m.content && !m.isError).length
  const limitReached        = fresiaResponseCount >= 20

  const datesLabel = checkIn
    ? checkOut ? `${fmtDate(checkIn)} – ${fmtDate(checkOut)}` : `Desde ${fmtDate(checkIn)}`
    : null

  const guestsLabel = totalGuests === 0 ? null
    : `${(guests.adults||0) + (guests.children||0)} pers.${guests.pets ? `, ${guests.pets} masc.` : ''}`

  return (
    <div className="w-full" style={{ maxWidth: 680, borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: '#FFFFFF' }}>

      {/* ── CHAT SECTION ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#F5F0E8', borderRadius: '24px 24px 0 0', padding: 20 }}>

        {/* Messages area — overscrollBehavior:contain prevents page scroll bleed-through */}
        <div style={{ minHeight: 280, maxHeight: 400, overflowY: 'auto', scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}>
          {!hasMessages ? (
            // Welcome state
            <div>
              <div className="flex items-start gap-2.5 mb-3">
                <div className="flex-shrink-0"><FresiaAvatar size={36} /></div>
                <div style={{ background: '#FFFFFF', borderRadius: '0 16px 16px 16px', padding: '12px 16px', maxWidth: '85%' }}>
                  <p style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.5, margin: 0 }}>
                    Hola 👋 Soy Fresia, tu asistente en Rukka. ¿A dónde quieres ir?
                    Cuéntame y te ayudo a encontrar el hogar perfecto.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap pl-12">
                {DESTINATION_CHIPS.map(chip => (
                  <button key={chip.label} onClick={() => handleChip(chip)}
                    className="fresia-chip"
                    style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#1a1a1a', transition: 'border-color 120ms, color 120ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = FOREST; e.currentTarget.style.color = FOREST }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.color = '#1a1a1a' }}
                    aria-label={`Buscar destinos de ${chip.label}`}
                  >
                    {chip.emoji} {chip.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Conversation
            <div className="space-y-3 py-1">
              {state.messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <div key={msg.id} className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : ''}`}>
                    {!isUser && <div className="flex-shrink-0 self-end"><FresiaAvatar size={28} /></div>}
                    <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                      {msg.images?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {msg.images.map((img, i) => (
                            <div key={i} className="w-28 h-20 rounded-xl overflow-hidden border border-gray-200">
                              <img src={img.preview} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.content && (
                        <div className="px-4 py-3 shadow-sm" style={{
                          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                          background: isUser ? FOREST : msg.isError ? '#FEF2F2' : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : msg.isError ? '#991B1B' : '#1a1a1a',
                          fontSize: 14,
                        }}>
                          {isUser
                            ? <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                            : <MessageContent text={msg.content} />
                          }
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {isStreaming && state.messages[state.messages.length - 1]?.role === 'assistant' && !state.messages[state.messages.length - 1]?.content && (
                <TypingIndicator />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="mt-3">
          {limitReached ? (
            // Limit reached banner
            <div className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-3">
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                  Has alcanzado el límite de esta sesión
                </p>
                <p style={{ fontSize: 12, color: '#717171', margin: 0, marginTop: 2 }}>
                  Usa el buscador de abajo o continúa en Fresia
                </p>
              </div>
              <a href="/FresIA"
                style={{ flexShrink: 0, background: FOREST, color: '#FFF', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Abrir Fresia →
              </a>
            </div>
          ) : (
            <>
          {state.error && <p className="text-xs text-red-500 mb-2">{state.error}</p>}
          {state.pendingImage && (
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <img src={state.pendingImage.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => dispatch({ type: 'CLEAR_IMAGE' })}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <span className="text-xs text-gray-400 truncate">{state.pendingImage.name || 'Imagen adjunta'}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => fileInputRef.current?.click()} disabled={isStreaming}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-[#1B4332] transition disabled:opacity-40"
              aria-label="Adjuntar imagen">
              <Paperclip className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
              className="hidden" onChange={e => handleImageSelect(e.target.files?.[0])} onClick={e => { e.target.value = '' }} />
            <input
              type="text"
              value={state.input}
              onChange={e => dispatch({ type: 'SET_INPUT', value: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Escribe tu mensaje o sube una foto..."
              disabled={isStreaming}
              className="flex-1 outline-none bg-white"
              style={{ fontSize: 14, padding: '10px 14px', borderRadius: 12, border: 'none' }}
              aria-label="Mensaje para Fresia"
            />
            <button onClick={() => sendMessage()}
              disabled={isStreaming || (!state.input.trim() && !state.pendingImage)}
              className="flex-shrink-0 flex items-center justify-center transition"
              style={{ width: 36, height: 36, borderRadius: '50%', background: FOREST, color: 'white', border: 'none', cursor: (isStreaming || (!state.input.trim() && !state.pendingImage)) ? 'not-allowed' : 'pointer', opacity: (isStreaming || (!state.input.trim() && !state.pendingImage)) ? 0.4 : 1 }}
              aria-label="Enviar mensaje">
              {isStreaming
                ? <div style={{ width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
            </>
          )}
        </div>
      </div>

      {/* ── SEARCH FOOTER ────────────────────────────────────────────────────── */}
      <div ref={searchBarRef} className="relative flex flex-col sm:flex-row items-stretch sm:items-center"
        style={{ background: '#FFFFFF', borderTop: '1px solid #EBEBEB', borderRadius: '0 0 24px 24px' }}>

        {/* Dónde */}
        <div className="relative flex-1">
          <button onClick={() => setOpenDropdown(p => p === 'where' ? null : 'where')}
            className="block w-full text-left transition-colors hover:bg-[#F7F7F7] rounded-bl-3xl sm:rounded-bl-none"
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
    </div>
  )
}

'use client'
import { useReducer, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, X, Home, Search, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '../../lib/store'

// ── Fresia SVG avatar ──────────────────────────────────────────────────────────
export function FresiaAvatar({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#2A5C45" />
      {/* Stylized leaf / flower petals */}
      <ellipse cx="20" cy="12" rx="3.5" ry="6" fill="#52B788" />
      <ellipse cx="27" cy="16" rx="3.5" ry="6" fill="#40916C" transform="rotate(60 27 16)" />
      <ellipse cx="27" cy="24" rx="3.5" ry="6" fill="#52B788" transform="rotate(120 27 24)" />
      <ellipse cx="20" cy="28" rx="3.5" ry="6" fill="#40916C" transform="rotate(180 20 28)" />
      <ellipse cx="13" cy="24" rx="3.5" ry="6" fill="#52B788" transform="rotate(240 13 24)" />
      <ellipse cx="13" cy="16" rx="3.5" ry="6" fill="#40916C" transform="rotate(300 13 16)" />
      <circle cx="20" cy="20" r="5" fill="#D8F3DC" />
      <circle cx="20" cy="20" r="2.5" fill="#2A5C45" />
    </svg>
  )
}

// ── Markdown renderer ──────────────────────────────────────────────────────────
function Segment({ text }) {
  // Split by **bold** markers
  const parts = []
  const boldRe = /\*\*(.*?)\*\*/g
  let last = 0
  let m
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'text', v: text.slice(last, m.index) })
    parts.push({ t: 'bold', v: m[1] })
    last = boldRe.lastIndex
  }
  if (last < text.length) parts.push({ t: 'text', v: text.slice(last) })

  return (
    <>
      {parts.map((p, i) =>
        p.t === 'bold'
          ? <strong key={i} className="font-semibold">{p.v}</strong>
          : <span key={i}>{p.v}</span>
      )}
    </>
  )
}

function MessageContent({ text }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-0.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line === '') return <div key={i} className="h-2" />
        return (
          <p key={i}>
            <Segment text={line} />
          </p>
        )
      })}
    </div>
  )
}

// ── State management ───────────────────────────────────────────────────────────
const INIT = {
  messages: [],
  input: '',
  pendingImage: null, // { base64, mediaType, preview, name }
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.value, error: null }
    case 'SET_IMAGE':
      return { ...state, pendingImage: action.image }
    case 'CLEAR_IMAGE':
      return { ...state, pendingImage: null }
    case 'ADD_USER_MSG':
      return { ...state, messages: [...state.messages, action.msg], input: '', pendingImage: null }
    case 'ADD_ASSISTANT_MSG':
      return { ...state, messages: [...state.messages, action.msg] }
    case 'APPEND_TEXT': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: last.content + action.text }
      }
      return { ...state, messages: msgs }
    }
    case 'SET_LAST_ERROR': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: action.message, isError: true }
      }
      return { ...state, messages: msgs, loading: false }
    }
    case 'SET_LOADING':
      return { ...state, loading: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.message }
    case 'SET_MESSAGES':
      return { ...state, messages: action.messages }
    default:
      return state
  }
}

// ── Message → API format ───────────────────────────────────────────────────────
function toApiMessages(messages) {
  const result = []
  for (const msg of messages) {
    if (msg.role === 'assistant') {
      if (msg.content && !msg.isError) result.push({ role: 'assistant', content: msg.content })
    } else if (msg.role === 'user') {
      if (msg.images?.length) {
        result.push({
          role: 'user',
          content: [
            ...msg.images.map(img => ({
              type: 'image',
              source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
            })),
            { type: 'text', text: msg.content || 'Analiza esta imagen de mi hogar' },
          ],
        })
      } else if (msg.content) {
        result.push({ role: 'user', content: msg.content })
      }
    }
  }
  return result
}

// ── Quick actions ──────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: '🏠', label: 'Publicar mi hogar',     msg: 'Quiero publicar mi hogar en Rukka' },
  { icon: '🔍', label: 'Buscar propiedades',    msg: 'Quiero buscar hogares disponibles en Chile' },
  { icon: '💬', label: '¿Cómo funciona Rukka?', msg: '¿Cómo funciona Rukka?' },
]

// ── Main component ─────────────────────────────────────────────────────────────
const SESSION_KEY = 'fresia_messages'

export default function ChatInterface({ compact = false, showHeader = false }) {
  const { user } = useApp()
  const [state, dispatch] = useReducer(reducer, INIT)
  const messagesEndRef  = useRef(null)
  const fileInputRef    = useRef(null)
  const textareaRef     = useRef(null)
  const abortRef        = useRef(null)

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'SET_MESSAGES', messages: parsed })
        }
      }
    } catch { /* ignore */ }
  }, [])

  // Persist to sessionStorage whenever messages change
  useEffect(() => {
    if (!state.messages.length) return
    try {
      // Strip base64 data from stored messages to keep storage lean
      const toStore = state.messages.map(m => ({
        ...m,
        images: (m.images || []).map(img => ({ preview: img.preview })),
      }))
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(toStore))
    } catch { /* ignore */ }
  }, [state.messages])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages, state.loading])

  // Abort ongoing request on unmount
  useEffect(() => () => abortRef.current?.abort(), [])

  const handleImageSelect = useCallback((file) => {
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      dispatch({ type: 'SET_ERROR', message: 'La imagen debe pesar menos de 4MB' })
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const full = e.target.result
      const mediaType = full.split(';')[0].split(':')[1]
      const safe = ['image/jpeg','image/png','image/webp','image/gif'].includes(mediaType)
        ? mediaType : 'image/jpeg'
      const base64 = full.split(',')[1]
      dispatch({ type: 'SET_IMAGE', image: { base64, mediaType: safe, preview: full, name: file.name } })
    }
    reader.readAsDataURL(file)
  }, [])

  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride ?? state.input).trim()
    if (!text && !state.pendingImage) return
    if (state.loading) return

    const userMsg = {
      id:        `u_${Date.now()}`,
      role:      'user',
      content:   text,
      images:    state.pendingImage ? [state.pendingImage] : [],
      timestamp: new Date().toISOString(),
    }

    // Build API messages from existing history + new user message BEFORE dispatch
    const apiMessages = toApiMessages([...state.messages, userMsg])

    dispatch({ type: 'ADD_USER_MSG', msg: userMsg })
    dispatch({ type: 'ADD_ASSISTANT_MSG', msg: {
      id:        `a_${Date.now() + 1}`,
      role:      'assistant',
      content:   '',
      timestamp: new Date().toISOString(),
    }})
    dispatch({ type: 'SET_LOADING', value: true })

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/fresia/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: apiMessages }),
        signal:  controller.signal,
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue
          try {
            const data = JSON.parse(part.slice(6))
            if (data.type === 'text') dispatch({ type: 'APPEND_TEXT', text: data.text })
          } catch { /* malformed SSE */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({ type: 'SET_LAST_ERROR', message: 'No pude conectarme. Intenta de nuevo 🙁' })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }, [state.messages, state.input, state.pendingImage, state.loading])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const hasMessages = state.messages.length > 0
  const isStreaming = state.loading

  // ── Welcome screen ───────────────────────────────────────────────────────────
  const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-4 py-8">
      <FresiaAvatar size={compact ? 56 : 72} />
      <div>
        <h2 className={`font-black text-gray-900 ${compact ? 'text-lg' : 'text-2xl'}`}>
          {user ? `Hola, ${user.name?.split(' ')[0]} 👋` : 'Hola, soy Fresia 👋'}
        </h2>
        <p className={`text-gray-500 mt-1 ${compact ? 'text-sm' : 'text-base'}`}>
          Tu asistente de hogares en Rukka
        </p>
        {!compact && (
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Puedo ayudarte a publicar tu hogar, buscar propiedades, o resolver cualquier duda
          </p>
        )}
      </div>
      <div className={`flex ${compact ? 'flex-col' : 'flex-wrap justify-center'} gap-2 mt-2`}>
        {QUICK_ACTIONS.map(({ icon, label, msg }) => (
          <button
            key={msg}
            onClick={() => sendMessage(msg)}
            className={`flex items-center gap-2 bg-white border border-gray-200 hover:border-forest hover:text-forest rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${compact ? 'w-full justify-start' : ''}`}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  )

  // ── Typing indicator ─────────────────────────────────────────────────────────
  const TypingIndicator = () => (
    <div className="flex items-end gap-2 px-4">
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
        <FresiaAvatar size={28} />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-forest/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-forest/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-forest/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col ${compact ? 'h-full' : 'h-[calc(100vh-64px)]'} bg-[#F8F4EE]`}>
      {/* Full-page header (when not inside widget) */}
      {showHeader && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <FresiaAvatar size={36} />
          <div>
            <p className="font-black text-gray-900 text-base leading-tight">Fresia</p>
            <p className="text-xs text-gray-400 leading-tight">Asistente IA · powered by Claude ✦</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-400">En línea</span>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <WelcomeScreen />
        ) : (
          <div className={`py-4 space-y-4 ${compact ? 'px-0' : 'max-w-2xl mx-auto px-4'}`}>
            {state.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} compact={compact} />
            ))}

            {/* Empty streaming bubble → replaced by APPEND_TEXT, but show typing while content is empty */}
            {isStreaming && state.messages[state.messages.length - 1]?.role === 'assistant'
              && !state.messages[state.messages.length - 1]?.content && (
              <TypingIndicator />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className={`border-t border-gray-200 bg-white px-3 py-3 flex-shrink-0 ${compact ? '' : 'max-w-2xl mx-auto w-full'}`}>
        {state.error && (
          <p className="text-xs text-red-500 mb-2 px-1">{state.error}</p>
        )}

        {/* Image preview */}
        {state.pendingImage && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
              <img src={state.pendingImage.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => dispatch({ type: 'CLEAR_IMAGE' })}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <span className="text-xs text-gray-400 truncate">{state.pendingImage.name || 'Imagen adjunta'}</span>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-forest hover:bg-forest/5 transition"
            title="Adjuntar imagen"
            disabled={isStreaming}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={(e) => handleImageSelect(e.target.files?.[0])}
            onClick={(e) => { e.target.value = '' }}
          />

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={state.input}
            onChange={(e) => dispatch({ type: 'SET_INPUT', value: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder={compact ? 'Escribe un mensaje...' : 'Escribe tu mensaje o sube una foto...'}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-forest/30 focus:border-forest focus:outline-none disabled:opacity-50 leading-relaxed max-h-32 overflow-y-auto"
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={isStreaming || (!state.input.trim() && !state.pendingImage)}
            className="flex-shrink-0 w-9 h-9 bg-forest text-white rounded-xl flex items-center justify-center hover:bg-forest-dark disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isStreaming
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, compact }) {
  const isUser      = msg.role === 'user'
  const hasImages   = msg.images?.length > 0
  const hasContent  = !!msg.content

  return (
    <div className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'} ${compact ? 'px-3' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden self-end">
          <FresiaAvatar size={28} />
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center self-end">
          <User className="w-4 h-4 text-forest" />
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Image preview in message */}
        {hasImages && (
          <div className="flex flex-wrap gap-1">
            {msg.images.map((img, i) => (
              <div key={i} className="w-32 h-24 rounded-xl overflow-hidden border border-gray-200">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Text bubble */}
        {hasContent && (
          <div
            className={`px-4 py-3 shadow-sm ${
              isUser
                ? 'bg-forest text-white rounded-2xl rounded-br-sm'
                : msg.isError
                  ? 'bg-red-50 border border-red-100 text-red-600 rounded-2xl rounded-bl-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
            }`}
          >
            {isUser
              ? <p className="text-sm leading-relaxed">{msg.content}</p>
              : <MessageContent text={msg.content} />
            }
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 px-1">
          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
    </div>
  )
}

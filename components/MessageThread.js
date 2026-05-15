'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../lib/store'
import { Send, X } from 'lucide-react'

function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60)   return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date >= today) {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
}

export default function MessageThread({ requestId, otherUser, onClose }) {
  const { user } = useApp()
  const [messages, setMessages] = useState([])
  const [text,     setText]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [error,    setError]    = useState('')
  const bottomRef  = useRef(null)
  const intervalRef = useRef(null)

  const loadMessages = useCallback(async () => {
    if (!requestId) return
    try {
      const res  = await fetch(`/api/messages?request_id=${requestId}`)
      const json = await res.json()
      if (json.messages) setMessages(json.messages)
    } catch {
      // silencioso — no interrumpir la UI por un poll fallido
    }
  }, [requestId])

  useEffect(() => {
    loadMessages()
    intervalRef.current = setInterval(loadMessages, 10000)
    return () => clearInterval(intervalRef.current)
  }, [loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const res  = await fetch('/api/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ request_id: requestId, content: text.trim() }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Error al enviar'); return }
      setText('')
      await loadMessages()
    } catch {
      setError('Error de conexión')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ height: '420px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-sm font-black flex-shrink-0">
          {otherUser?.name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{otherUser?.name || 'Usuario'}</p>
          <p className="text-xs text-gray-400">Intercambio aceptado</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">No hay mensajes aún. ¡Inicia la conversación!</p>
        )}
        {messages.map(msg => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                isMine
                  ? 'bg-forest text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                  {timeAgo(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100">
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Escribe un mensaje..."
            maxLength={2000}
            disabled={sending}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="bg-forest text-white px-3 py-2 rounded-xl hover:bg-forest-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-bold">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

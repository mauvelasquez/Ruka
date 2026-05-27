'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../lib/store'
import { X, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'

const LEVEL_STYLE = {
  error: 'bg-red-100 text-red-700',
  warn:  'bg-amber-100 text-amber-700',
  info:  'bg-green-100 text-green-700',
  debug: 'bg-gray-100 text-gray-500',
}

const SOURCES = ['airbnb-import', 'auth', 'store', 'client', 'admin']

function fmt(ts) {
  return new Date(ts).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'medium' })
}

export default function LogsPage() {
  const router = useRouter()
  const { currentUser, ready } = useApp()

  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [detail,  setDetail]  = useState(null)
  const [offset,  setOffset]  = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [filters, setFilters] = useState({ level: '', source: '', hours: '24' })

  // SECURITY FIX: isAdmin se verifica server-side para no exponer el email del admin en el bundle JS
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!currentUser) { router.push('/auth/login'); return }
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(({ isAdmin: admin }) => {
        if (!admin) router.push('/dashboard')
        else setIsAdmin(true)
      })
      .catch(() => router.push('/dashboard'))
  }, [ready, currentUser])

  const fetchLogs = useCallback(async (reset = false) => {
    setLoading(true)
    setError('')
    const currentOffset = reset ? 0 : offset

    const params = new URLSearchParams({ hours: filters.hours, offset: String(currentOffset) })
    if (filters.level)  params.set('level', filters.level)
    if (filters.source) params.set('source', filters.source)

    try {
      const res = await fetch(`/api/admin/logs?${params}`)
      if (!res.ok) { setError('No tienes acceso o ocurrió un error.'); return }
      const { logs: newLogs } = await res.json()

      setLogs(prev => reset ? newLogs : [...prev, ...newLogs])
      setOffset(currentOffset + newLogs.length)
      setHasMore(newLogs.length === 50)
    } catch {
      setError('Error al cargar logs.')
    } finally {
      setLoading(false)
    }
  }, [filters, offset])

  // Fetch inicial y al cambiar filtros
  useEffect(() => {
    if (!isAdmin) return
    setOffset(0)
    setHasMore(true)
    fetchLogs(true)
  }, [filters, isAdmin]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Logs del sistema</h1>
            <p className="text-gray-400 text-sm mt-0.5">{logs.length} entradas cargadas</p>
          </div>
          <button onClick={() => fetchLogs(true)} disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative">
            <select value={filters.level} onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}
              className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white">
              <option value="">Todos los niveles</option>
              <option value="error">Error</option>
              <option value="warn">Warn</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="relative">
            <select value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value }))}
              className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white">
              <option value="">Todas las fuentes</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="relative">
            <select value={filters.hours} onChange={e => setFilters(f => ({ ...f, hours: e.target.value }))}
              className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white">
              <option value="1">Última hora</option>
              <option value="6">Últimas 6 h</option>
              <option value="24">Últimas 24 h</option>
              <option value="168">Últimos 7 días</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {logs.length === 0 && !loading ? (
            <div className="p-10 text-center text-gray-400 text-sm">No hay logs con los filtros actuales.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Fecha', 'Nivel', 'Fuente', 'Mensaje', 'User ID', 'ms', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map(log => (
                    <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${log.level === 'error' ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmt(log.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_STYLE[log.level] ?? 'bg-gray-100 text-gray-500'}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-600 whitespace-nowrap">{log.source}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{log.message}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-400 whitespace-nowrap">
                        {log.user_id ? log.user_id.slice(0, 8) + '…' : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {log.duration_ms != null ? `${log.duration_ms}ms` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {log.metadata && (
                          <button onClick={() => setDetail(log)}
                            className="text-xs text-forest font-bold hover:text-forest-dark transition-colors whitespace-nowrap">
                            Ver detalle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && (
            <div className="p-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {hasMore && !loading && logs.length > 0 && (
            <div className="p-4 border-t border-gray-100 text-center">
              <button onClick={() => fetchLogs(false)}
                className="text-sm font-bold text-forest hover:text-forest-dark transition-colors">
                Cargar más
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Panel de detalle (modal) */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mr-2 ${LEVEL_STYLE[detail.level]}`}>
                  {detail.level}
                </span>
                <span className="text-sm font-bold text-gray-700">{detail.source}</span>
                <span className="text-xs text-gray-400 ml-2">{fmt(detail.created_at)}</span>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <p className="text-sm text-gray-700 font-semibold mb-4">{detail.message}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                {detail.user_id    && <div><span className="text-gray-400">user_id</span><br /><span className="font-mono">{detail.user_id}</span></div>}
                {detail.route      && <div><span className="text-gray-400">route</span><br /><span className="font-mono">{detail.route}</span></div>}
                {detail.request_id && <div><span className="text-gray-400">request_id</span><br /><span className="font-mono">{detail.request_id}</span></div>}
                {detail.duration_ms != null && <div><span className="text-gray-400">duration</span><br /><span className="font-mono">{detail.duration_ms}ms</span></div>}
              </div>
              {detail.metadata && (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Metadata</p>
                  <pre className="bg-gray-50 rounded-xl p-4 text-xs overflow-x-auto text-gray-700 leading-relaxed">
                    {JSON.stringify(detail.metadata, null, 2)}
                  </pre>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
// Editor de períodos de disponibilidad.
// Formato: [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }]

import { useState } from 'react'
import { Plus, Trash2, CalendarDays } from 'lucide-react'

function periodsOverlap(s1, e1, s2, e2) {
  return new Date(s1) <= new Date(e2) && new Date(e1) >= new Date(s2)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Props:
 *   periods: Array<{start: string, end: string}> — estado actual
 *   onChange: (newPeriods) => void
 */
export default function AvailabilityEditor({ periods, onChange }) {
  const [newStart, setNewStart] = useState('')
  const [newEnd,   setNewEnd]   = useState('')
  const [formError, setFormError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const addPeriod = () => {
    setFormError('')

    if (!newStart || !newEnd) {
      setFormError('Selecciona fecha de inicio y fin.')
      return
    }
    if (newStart >= newEnd) {
      setFormError('La fecha de inicio debe ser anterior a la de fin.')
      return
    }
    const overlap = periods.some(p => periodsOverlap(newStart, newEnd, p.start, p.end))
    if (overlap) {
      setFormError('El período se superpone con uno existente.')
      return
    }

    const updated = [...periods, { start: newStart, end: newEnd }]
      .sort((a, b) => a.start.localeCompare(b.start))

    onChange(updated)
    setNewStart('')
    setNewEnd('')
  }

  const removePeriod = (index) => {
    onChange(periods.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Lista de períodos existentes */}
      {periods.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
          <CalendarDays className="w-4 h-4 flex-shrink-0" />
          Sin períodos configurados — el hogar aparece como disponible todo el año.
        </div>
      ) : (
        <ul className="space-y-2">
          {periods.map((p, i) => (
            <li key={i} className="flex items-center justify-between bg-andean/5 border border-andean/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CalendarDays className="w-4 h-4 text-andean flex-shrink-0" />
                {formatDate(p.start)} — {formatDate(p.end)}
              </div>
              <button
                type="button"
                onClick={() => removePeriod(i)}
                aria-label="Eliminar período"
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Formulario para agregar período */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Agregar período</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={newStart}
              min={today}
              onChange={e => { setNewStart(e.target.value); setFormError('') }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={newEnd}
              min={newStart || today}
              onChange={e => { setNewEnd(e.target.value); setFormError('') }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-forest focus:outline-none bg-white"
            />
          </div>
        </div>
        {formError && (
          <p className="text-xs text-red-500 font-medium">{formError}</p>
        )}
        <button
          type="button"
          onClick={addPeriod}
          className="flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar período
        </button>
      </div>
    </div>
  )
}

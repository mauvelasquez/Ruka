'use client'
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    fetch('/api/log', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level:   'error',
        source:  'client',
        message: error.message,
        metadata: {
          name:            error.name,
          stack:           error.stack,
          componentStack:  info?.componentStack,
          route:           typeof window !== 'undefined' ? window.location.pathname : null,
        },
      }),
    }).catch(() => {})
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F4EE' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '24rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontWeight: 900, color: '#111827', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
            Algo salió mal
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Ocurrió un error inesperado. Recarga la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#2A5C45', color: 'white', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }
}

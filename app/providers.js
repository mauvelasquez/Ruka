'use client'
import { AppProvider } from '../lib/store'
import ErrorBoundary from '../components/ErrorBoundary'

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <AppProvider>{children}</AppProvider>
    </ErrorBoundary>
  )
}

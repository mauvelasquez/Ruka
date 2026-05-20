'use client'
import { useState } from 'react'
import { useApp } from '../lib/store'

export function useVerificationGate() {
  const { user } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState(null)

  const gate = (action, callback) => {
    if (user?.verification_status === 'verified') {
      callback()
    } else {
      setModalAction(action)
      setModalOpen(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalAction(null)
  }

  return { gate, modalOpen, modalAction, closeModal }
}

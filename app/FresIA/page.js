'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ChatInterface from '../../components/fresia/ChatInterface'
import { FresiaAvatar } from '../../components/fresia/ChatInterface'

export default function FresIAPage() {
  return (
    <div className="flex flex-col h-screen bg-[#F8F4EE]">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
        <Link
          href="/"
          className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/5 transition"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <FresiaAvatar size={36} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-black text-gray-900 text-lg leading-none">Fresia</h1>
            <span className="text-xs bg-forest/10 text-forest font-semibold px-2 py-0.5 rounded-full">IA</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Asistente de hogares · powered by Claude ✦</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400">En línea</span>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface showHeader={false} />
      </div>
    </div>
  )
}

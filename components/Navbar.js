'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../lib/store'
import { Menu, X, Globe, User, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { FresiaAvatar } from './fresia/ChatInterface'
import { analytics } from '../lib/analytics'
import YankiBalance from './yankis/YankiBalance'
import CountryPill from './CountryPill'
import { openPublicarModal } from './PublicarModal'

export default function Navbar() {
  const { user, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    setDropdownOpen(false)
    setMenuOpen(false)
    await logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-stone-200/60 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <Image src="/rukka-logo-nuevo.png" alt="Rukka" width={48} height={48} className="object-contain" priority />
          </Link>

          {/* Country selector */}
          <CountryPill className="hidden md:block" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/homes" onClick={() => analytics.navClick('explorar_hogares')} className="text-gray-600 hover:text-forest font-medium text-sm transition-colors flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Explorar hogares
            </Link>
            <Link href="/como-funciona" onClick={() => analytics.navClick('como_funciona')} className="text-gray-600 hover:text-forest font-medium text-sm transition-colors">
              ¿Cómo funciona?
            </Link>
            <Link href="/blog" onClick={() => analytics.navClick('blog')} className="text-gray-600 hover:text-forest font-medium text-sm transition-colors">
              Blog
            </Link>
            <Link href="/anfitriones-airbnb" onClick={() => analytics.navClick('anfitriones_airbnb')} className="flex items-center gap-1.5 text-sm font-bold text-[#ff5a5f] hover:text-[#e0484d] transition-colors">
              <span className="text-base leading-none">🏠</span> Para anfitriones Airbnb
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/FresIA" onClick={() => analytics.navClick('fresia')} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-forest transition-colors">
              <FresiaAvatar size={20} /> Conversa con Fresia
            </Link>
            {user ? (
              <div className="flex items-center gap-3 relative">
                <YankiBalance size="sm" showLabel linkable />
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 hover:shadow-md transition-shadow bg-white"
                    aria-label="Menú de usuario"
                    aria-expanded={dropdownOpen}
                  >
                    <img src={user.avatar} alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2d6a4f&color=fff&size=150` }}
                    />
                    <span className="text-sm font-semibold text-gray-700 max-w-20 truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      {[
                        { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Mi Panel' },
                        { href: `/profile/${user.id}`, icon: <User className="w-4 h-4" />, label: 'Mi Perfil' },
                        { href: '/matches', icon: <Sparkles className="w-4 h-4" />, label: 'Buscar match' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 hover:text-forest transition-colors">
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full">
                          <LogOut className="w-4 h-4" /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  Ingresar
                </Link>
                <button
                  onClick={openPublicarModal}
                  className="text-sm font-bold bg-forest text-white px-5 py-2 rounded-full hover:bg-forest-dark transition-colors shadow-sm">
                  Publicar mi hogar
                </button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
          <div className="px-1 pb-2">
            <CountryPill onCountryChange={() => setMenuOpen(false)} />
          </div>
          <Link href="/homes" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            <Globe className="w-4 h-4 text-forest" /> Explorar hogares
          </Link>
          <Link href="/como-funciona" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            ¿Cómo funciona?
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            📖 Blog
          </Link>
          <Link href="/anfitriones-airbnb" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-[#ff5a5f] hover:bg-[#ff5a5f]/8 font-bold">
            🏠 Para anfitriones de Airbnb
          </Link>
          <Link href="/FresIA" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            <FresiaAvatar size={20} /> Conversa con Fresia
          </Link>
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-gray-400 text-xs truncate mb-2">{user.email}</p>
                <YankiBalance size="sm" showLabel linkable />
              </div>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50">
                <LayoutDashboard className="w-4 h-4 text-forest" /> Mi Panel
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 p-3 rounded-xl text-red-500 w-full hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-center p-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Ingresar</Link>
              <button onClick={() => { setMenuOpen(false); openPublicarModal() }} className="text-center p-3 rounded-xl bg-forest text-white font-bold">Publicar mi hogar</button>
            </div>
          )}
        </div>
      )}
      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </nav>
  )
}

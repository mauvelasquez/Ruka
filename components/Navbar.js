'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../lib/store'
import { Mountain, Menu, X, Globe, User, LogOut, PlusCircle, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-stone-200/60 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 landscape-gradient rounded-xl flex items-center justify-center shadow-md group-hover:opacity-90 transition-opacity">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-forest-dark tracking-tight">Rukka</span>
              <span className="hidden sm:inline text-xs text-stone ml-2 font-normal">· intercambia tu hogar</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/homes" className="text-gray-600 hover:text-forest font-medium text-sm transition-colors flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Explorar hogares
            </Link>
            <Link href="/como-funciona" className="text-gray-600 hover:text-forest font-medium text-sm transition-colors">
              ¿Cómo funciona?
            </Link>
            {user && (
              <Link href="/matches" className="text-gray-600 hover:text-terra font-medium text-sm transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Buscar match
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 relative">
                <Link href="/matches" className="flex items-center gap-1.5 text-sm font-semibold text-terra-dark bg-terra-50 px-4 py-2 rounded-full hover:bg-terra/10 transition-colors border border-terra/20">
                  <Sparkles className="w-4 h-4 text-terra" /> Buscar match
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 hover:shadow-md transition-shadow bg-white"
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
                        <button onClick={() => { logout(); setDropdownOpen(false) }}
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
                <Link href="/auth/login" className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/auth/register" className="text-sm font-bold bg-forest text-white px-5 py-2 rounded-full hover:bg-forest-dark transition-colors shadow-sm">
                  Unirme gratis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
          <Link href="/homes" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            <Globe className="w-4 h-4 text-forest" /> Explorar hogares
          </Link>
          <Link href="/como-funciona" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50 hover:text-forest">
            ¿Cómo funciona?
          </Link>
          {user ? (
            <>
              <Link href="/matches" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-terra-50">
                <Sparkles className="w-4 h-4 text-terra" /> Buscar match
              </Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-xl text-gray-700 hover:bg-forest-50">
                <LayoutDashboard className="w-4 h-4 text-forest" /> Mi Panel
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="flex items-center gap-2 p-3 rounded-xl text-red-500 w-full hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-center p-3 rounded-xl border border-gray-200 text-gray-700 font-semibold">Iniciar sesión</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="text-center p-3 rounded-xl bg-forest text-white font-bold">Unirme gratis</Link>
            </div>
          )}
        </div>
      )}
      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </nav>
  )
}

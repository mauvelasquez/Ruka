'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AppContext = createContext(null)

// ─── MATCHING ALGORITHM ───────────────────────────────────────────────────────
function datesOverlap(s1, e1, s2, e2) {
  return s1 <= e2 && e1 >= s2
}

function homeIsAvailable(home, startDate, endDate) {
  return home.availability_periods?.some(p => datesOverlap(p.start, p.end, startDate, endDate))
}

export function findMatches({ toCity, startDate, endDate, neededCapacity, fromCity, userId, homes, users, wishes }) {
  const candidates = homes.filter(h =>
    h.user_id !== userId &&
    h.max_guests >= neededCapacity &&
    h.city.toLowerCase().includes(toCity.toLowerCase()) &&
    homeIsAvailable(h, startDate, endDate)
  )
  return candidates.map(home => {
    const owner = users.find(u => u.id === home.user_id)
    const myHome = homes.find(h => h.user_id === userId)
    const ownerWishes = wishes.filter(w =>
      w.user_id === home.user_id &&
      w.to_city.toLowerCase().includes(fromCity.toLowerCase()) &&
      datesOverlap(w.start_date, w.end_date, startDate, endDate) &&
      w.needed_capacity <= (myHome?.max_guests || 99)
    )
    return {
      home, owner,
      isPerfectMatch: ownerWishes.length > 0,
      ownerWish: ownerWishes[0] || null,
    }
  }).sort((a, b) => b.isPerfectMatch - a.isPerfectMatch)
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [homes, setHomes] = useState([])
  const [wishes, setWishes] = useState([])
  const [requests, setRequests] = useState([])
  const [ready, setReady] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const init = async () => {
      // Sesión activa
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single()
        if (profile) setUser({ ...session.user, ...profile })
      }

      // Cargar datos públicos
      const [{ data: homesData }, { data: usersData }, { data: wishesData }] = await Promise.all([
        supabase.from('homes').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('travel_wishes').select('*'),
      ])
      if (homesData) setHomes(homesData)
      if (usersData) setUsers(usersData)
      if (wishesData) setWishes(wishesData)
      setReady(true)
    }
    init()

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single()
        setUser({ ...session.user, ...profile })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setRequests([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Cargar requests cuando hay usuario
  useEffect(() => {
    if (!user?.id) return
    const loadRequests = async () => {
      const { data } = await supabase.from('exchange_requests')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      if (data) setRequests(data)
    }
    loadRequests()
  }, [user?.id])

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: 'Email o contraseña incorrectos' }
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', data.user.id).single()
    setUser({ ...data.user, ...profile })
    return { success: true, user: data.user }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRequests([])
  }

  const startRegister = async (data) => {
    // Solo validar que el email no exista (Supabase lo maneja en signUp)
    return { success: true }
  }

  const verifyEmail = async (email, code) => {
    // Con Supabase el email se verifica automáticamente por enlace
    return { success: true }
  }

  const completeRegister = async (pendingData, homeData) => {
    // 1) Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: pendingData.email,
      password: pendingData.password,
      options: {
        data: {
          name: pendingData.name,
          avatar: `https://i.pravatar.cc/150?u=${pendingData.email}`,
        }
      }
    })
    if (authError) return { success: false, error: authError.message }

    const userId = authData.user.id

    // 2) Actualizar perfil con datos adicionales
    await supabase.from('profiles').upsert({
      id: userId,
      name: pendingData.name,
      avatar: `https://i.pravatar.cc/150?u=${pendingData.email}`,
      cover_photo: 'https://picsum.photos/seed/default/900/300',
      city: pendingData.city || '',
      country: pendingData.country || '',
      location: pendingData.location || '',
      bio: '',
      languages: [],
      verified: false,
      rating: 0,
      review_count: 0,
      exchanges: 0,
    })

    // 3) Crear hogar
    const { data: newHome } = await supabase.from('homes').insert({
      user_id: userId,
      title: homeData.title,
      description: homeData.description,
      short_description: homeData.description?.slice(0, 120) + '...',
      type: homeData.type || 'Casa',
      city: homeData.city || pendingData.city || '',
      country: homeData.country || pendingData.country || '',
      location: homeData.location || '',
      bedrooms: homeData.bedrooms || 1,
      bathrooms: homeData.bathrooms || 1,
      max_guests: homeData.maxGuests || homeData.max_guests || 2,
      amenities: homeData.amenities || [],
      images: homeData.images?.length ? homeData.images : [`https://picsum.photos/seed/${Date.now()}/800/500`],
      availability_periods: homeData.availabilityPeriods || homeData.availability_periods || [],
      featured: false,
    }).select().single()

    // 4) Refrescar datos
    const [{ data: allHomes }, { data: allUsers }] = await Promise.all([
      supabase.from('homes').select('*'),
      supabase.from('profiles').select('*'),
    ])
    if (allHomes) setHomes(allHomes)
    if (allUsers) setUsers(allUsers)

    const newUser = { id: userId, ...pendingData }
    setUser(newUser)

    return { success: true, user: newUser, home: newHome }
  }

  // ── Homes ─────────────────────────────────────────────────────────────────
  const createHome = async (data) => {
    const { data: newHome } = await supabase.from('homes').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      short_description: data.description?.slice(0, 120) + '...',
      type: data.type || 'Casa',
      city: data.city || '',
      country: data.country || '',
      location: data.location || '',
      bedrooms: data.bedrooms || 1,
      bathrooms: data.bathrooms || 1,
      max_guests: data.maxGuests || 2,
      amenities: data.amenities || [],
      images: data.images?.length ? data.images : [`https://picsum.photos/seed/${Date.now()}/800/500`],
      availability_periods: data.availabilityPeriods || [],
      featured: false,
    }).select().single()
    if (newHome) setHomes(prev => [...prev, newHome])
    return newHome
  }

  const updateHome = async (homeId, data) => {
    await supabase.from('homes').update(data).eq('id', homeId)
    setHomes(prev => prev.map(h => h.id === homeId ? { ...h, ...data } : h))
  }

  const removeHome = async (homeId) => {
    await supabase.from('homes').delete().eq('id', homeId)
    setHomes(prev => prev.filter(h => h.id !== homeId))
  }

  // ── Wishes ────────────────────────────────────────────────────────────────
  const addWish = async (data) => {
    const { data: newWish } = await supabase.from('travel_wishes').insert({
      user_id: user.id,
      to_city: data.toCity,
      start_date: data.startDate,
      end_date: data.endDate,
      needed_capacity: data.guests || data.neededCapacity || 1,
    }).select().single()
    if (newWish) setWishes(prev => [...prev, newWish])
    return newWish
  }

  const removeWish = async (wishId) => {
    await supabase.from('travel_wishes').delete().eq('id', wishId)
    setWishes(prev => prev.filter(w => w.id !== wishId))
  }

  // ── Exchange Requests ─────────────────────────────────────────────────────
  const sendExchangeRequest = async (data) => {
    const { data: req } = await supabase.from('exchange_requests').insert({
      from_user_id: user.id,
      to_user_id: data.toUserId,
      from_home_id: data.fromHomeId,
      to_home_id: data.toHomeId,
      message: data.message || '',
      status: 'pending',
    }).select().single()
    if (req) setRequests(prev => [...prev, req])
    return req
  }

  const updateRequest = async (reqId, status) => {
    await supabase.from('exchange_requests').update({ status }).eq('id', reqId)
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r))
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getUserById = id => users.find(u => u.id === id)
  const getHomeById = id => homes.find(h => h.id === id)
  const getHomesByUser = userId => homes.filter(h => h.user_id === userId)
  const getWishesByUser = userId => wishes.filter(w => w.user_id === userId)

  return (
    <AppContext.Provider value={{
      user, currentUser: user, users, homes, wishes, requests, ready,
      login, logout, startRegister, verifyEmail, completeRegister,
      createHome, updateHome, removeHome,
      addWish, removeWish,
      sendExchangeRequest, sendRequest: sendExchangeRequest,
      updateRequest, updateRequestStatus: updateRequest,
      getUserById, getHomeById, getHomesByUser, getWishesByUser,
      findMatches,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

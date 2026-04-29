'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const AppContext = createContext(null)

// ─── AVATARES HISTÓRICOS CHILENOS ──────────────────────────────────────────────
// Imágenes de Wikimedia Commons (dominio público)
const AVATARES_MUJER = [
  // Gabriela Mistral
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gabriela_Mistral_1945.jpg/440px-Gabriela_Mistral_1945.jpg',
  // Violeta Parra
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Violeta_Parra_1964.jpg/440px-Violeta_Parra_1964.jpg',
  // Artesanía chilena (Indio Picaro - mujer)
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mujer_mapuche.jpg/440px-Mujer_mapuche.jpg',
]

const AVATARES_HOMBRE = [
  // Arturo Prat
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Arturo_Prat_Chac%C3%B3n.jpg/440px-Arturo_Prat_Chac%C3%B3n.jpg',
  // Lautaro (ilustración histórica)
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Lautaro.jpg/440px-Lautaro.jpg',
  // Bernardo O'Higgins
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Bernardo_O%27Higgins_Riquelme.jpg/440px-Bernardo_O%27Higgins_Riquelme.jpg',
]

// Nombres femeninos comunes en Chile para detectar género
const NOMBRES_FEMENINOS = [
  'maría','ana','carmen','rosa','isabel','laura','patricia','sandra','claudia',
  'alejandra','valeria','carolina','francisca','daniela','andrea','nicole',
  'camila','valentina','javiera','barbara','sofia','constanza','paula',
  'gabriela','violeta','lucía','antonia','josefa','trinidad','catalina',
  'fernanda','natalia','beatriz','lorena','verónica','monica','marcela',
  'pilar','raquel','teresa','elena','beatriz','ximena','tamara','karla',
  'susana','victoria','diana','cecilia','silvia','rebeca','karina','fabiola',
]

function getAvatarChileno(name) {
  if (!name) return AVATARES_HOMBRE[0]
  const firstName = name.trim().toLowerCase().split(' ')[0]
  const esMujer = NOMBRES_FEMENINOS.some(n => firstName.startsWith(n) || n.startsWith(firstName))
  const lista = esMujer ? AVATARES_MUJER : AVATARES_HOMBRE
  // Asignar de forma determinista según el nombre (mismo nombre = mismo avatar)
  const idx = name.charCodeAt(0) % lista.length
  return lista[idx]
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function normalizeHome(h) {
  if (!h) return null
  return {
    ...h,
    userId:      h.user_id    || h.userId,
    maxGuests:   h.max_guests || h.maxGuests || 2,
    reviewCount: h.review_count || h.reviewCount || 0,
    availabilityPeriods: h.availability_periods || h.availabilityPeriods || [],
    nearbyAttractions:   h.nearby_attractions   || h.nearbyAttractions   || [],
  }
}

function normalizeUser(u) {
  if (!u) return null
  return {
    ...u,
    // Si no tiene avatar, asignar uno histórico chileno según su nombre
    avatar:      u.avatar || getAvatarChileno(u.name),
    reviewCount: u.review_count || u.reviewCount || 0,
    joinDate:    u.join_date    || u.joinDate    || '',
  }
}

function datesOverlap(s1, e1, s2, e2) {
  return new Date(s1) <= new Date(e2) && new Date(e1) >= new Date(s2)
}

export function findMatches({ toCity, startDate, endDate, neededCapacity, fromCity, userId, homes, users, wishes }) {
  const candidates = homes.filter(h =>
    h.userId !== userId &&
    (h.max_guests || h.maxGuests || 0) >= neededCapacity &&
    (h.city || '').toLowerCase().includes(toCity.toLowerCase()) &&
    (h.availability_periods || h.availabilityPeriods || []).some(p =>
      datesOverlap(p.start, p.end, startDate, endDate)
    )
  )
  return candidates.map(home => {
    const owner  = users.find(u => u.id === home.user_id || u.id === home.userId)
    const myHome = homes.find(h => (h.user_id || h.userId) === userId)
    const ownerWishes = wishes.filter(w =>
      (w.user_id || w.userId) === (home.user_id || home.userId) &&
      (w.to_city || w.toCity || '').toLowerCase().includes(fromCity.toLowerCase()) &&
      datesOverlap(w.start_date || w.startDate, w.end_date || w.endDate, startDate, endDate) &&
      (w.needed_capacity || w.neededCapacity || 1) <= ((myHome?.max_guests || myHome?.maxGuests) || 99)
    )
    return {
      home:          normalizeHome(home),
      owner:         normalizeUser(owner),
      isPerfectMatch: ownerWishes.length > 0,
      ownerWish:     ownerWishes[0] || null,
    }
  }).sort((a, b) => b.isPerfectMatch - a.isPerfectMatch)
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [user,     setUser]     = useState(null)
  const [users,    setUsers]    = useState([])
  const [homes,    setHomes]    = useState([])
  const [wishes,   setWishes]   = useState([])
  const [requests, setRequests] = useState([])
  const [ready,    setReady]    = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).single()
          if (profile) setUser({ ...session.user, ...normalizeUser(profile) })
        }
        const [{ data: homesData }, { data: usersData }, { data: wishesData }] = await Promise.all([
          supabase.from('homes').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('travel_wishes').select('*'),
        ])
        if (homesData) setHomes(homesData.map(normalizeHome))
        if (usersData) setUsers(usersData.map(normalizeUser))
        if (wishesData) setWishes(wishesData)
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setReady(true)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single()
        if (profile) {
          setUser({ ...session.user, ...normalizeUser(profile) })
          if (profile.status === 'confirmed' && typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
            window.location.href = '/dashboard'
          }
        } else if (event === 'SIGNED_IN') {
          // Perfil no existe — crear pending solo en sign-in nuevos, no en recargas
          await supabase.from('profiles').upsert({
            id:     session.user.id,
            name:   session.user.user_metadata?.name || 'Usuario',
            email:  session.user.email || session.user.user_metadata?.email || '',
            status: 'pending',
          })
          setUser({ ...session.user, status: 'pending', name: session.user.user_metadata?.name || 'Usuario' })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setRequests([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user?.id) return
    supabase.from('exchange_requests')
      .select('*')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .then(({ data }) => { if (data) setRequests(data) })
  }, [user?.id])

  // ── Auth ───────────────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: (typeof window !== 'undefined' ? window.location.origin : '') + '/auth/callback',
      },
    })
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { success: false, error: 'Email o contraseña incorrectos' }
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', data.user.id).single()
      const fullUser = { ...data.user, ...normalizeUser(profile) }
      setUser(fullUser)
      return { success: true, user: fullUser }
    } catch {
      return { success: false, error: 'Error al iniciar sesión' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRequests([])
  }

  const register = async ({ name, email, password }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (authError) return { success: false, error: authError.message }
      return { success: true, userId: authData.user?.id }
    } catch {
      return { success: false, error: 'Error al crear la cuenta' }
    }
  }

  const completeOnboarding = async ({ profileData, homeData }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { success: false, error: 'No hay sesión activa' }
      const userId = session.user.id

      const email  = session.user.email || session.user.user_metadata?.email || ''
      const avatar =
        profileData.avatar ||
        session.user.user_metadata?.picture ||
        session.user.user_metadata?.avatar_url ||
        getAvatarChileno(session.user.user_metadata?.name || '')

      const { error: profileError } = await supabase.from('profiles').upsert({
        id:           userId,
        name:         session.user.user_metadata?.name || profileData.name,
        email:        email,
        phone:        profileData.phone || null,
        avatar,
        cover_photo:  'https://picsum.photos/seed/default/900/300',
        region:       profileData.region || null,
        comuna:       profileData.comuna || null,
        city:         profileData.comuna || null,
        country:      'Chile',
        bio:          '',
        languages:    [],
        verified:     false,
        rating:       0,
        review_count: 0,
        exchanges:    0,
        status:       'confirmed',
      })
      if (profileError) return { success: false, error: profileError.message }

      const { data: newHome, error: homeError } = await supabase.from('homes').insert({
        user_id:           userId,
        title:             homeData.title,
        description:       homeData.description || '',
        short_description: (homeData.description || '').slice(0, 120),
        type:              homeData.subtype || homeData.type || 'Casa',
        category:          homeData.category || 'full_home',
        subtype:           homeData.subtype || null,
        region:            homeData.region || null,
        comuna:            homeData.comuna || null,
        direccion:         homeData.direccion || null,
        coords:            homeData.coords || null,
        city:              homeData.comuna || null,
        country:           'Chile',
        location:          homeData.direccion
          ? `${homeData.direccion}, ${homeData.comuna}, ${homeData.region}`
          : `${homeData.comuna || ''}, ${homeData.region || ''}`,
        bedrooms:          homeData.bedrooms || 1,
        bathrooms:         homeData.bathrooms || 1,
        max_guests:        homeData.maxGuests || 2,
        amenities:         homeData.amenities || [],
        images:            homeData.images?.length
          ? homeData.images
          : [`https://picsum.photos/seed/${Date.now()}/800/500`],
        availability_periods: homeData.availabilityPeriods || [],
        private_bathroom:  homeData.private_bathroom || false,
        bed_type:          homeData.bed_type || null,
        shared_with:       homeData.shared_with || null,
        featured:          false,
      }).select().single()
      if (homeError) return { success: false, error: homeError.message }

      const [{ data: allHomes }, { data: allUsers }] = await Promise.all([
        supabase.from('homes').select('*'),
        supabase.from('profiles').select('*'),
      ])
      if (allHomes) setHomes(allHomes.map(normalizeHome))
      if (allUsers) setUsers(allUsers.map(normalizeUser))

      const { data: updatedProfile } = await supabase
        .from('profiles').select('*').eq('id', userId).single()
      if (updatedProfile) setUser(prev => ({ ...prev, ...normalizeUser(updatedProfile) }))

      return { success: true, home: normalizeHome(newHome) }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const completeRegister = completeOnboarding

  // ── Homes ─────────────────────────────────────────────────────────────────
  const createHome = async (data) => {
    try {
      const { data: newHome, error } = await supabase.from('homes').insert({
        user_id:           user.id,
        title:             data.title,
        description:       data.description || '',
        short_description: (data.description || '').slice(0, 120),
        type:              data.subtype || data.type || 'Casa',
        category:          data.category || 'full_home',
        subtype:           data.subtype || null,
        region:            data.region || null,
        comuna:            data.comuna || null,
        direccion:         data.direccion || null,
        coords:            data.coords || null,
        city:              data.comuna || data.city || null,
        country:           'Chile',
        location:          data.location || `${data.comuna || ''}, ${data.region || ''}`,
        bedrooms:          data.bedrooms || 1,
        bathrooms:         data.bathrooms || 1,
        max_guests:        data.maxGuests || data.max_guests || 2,
        amenities:         data.amenities || [],
        images:            data.images?.length
          ? data.images
          : [`https://picsum.photos/seed/${Date.now()}/800/500`],
        availability_periods: data.availabilityPeriods || [],
        private_bathroom:  data.private_bathroom || false,
        bed_type:          data.bed_type || null,
        shared_with:       data.shared_with || null,
        featured:          false,
      }).select().single()
      if (error) throw error
      if (newHome) setHomes(prev => [...prev, normalizeHome(newHome)])
      return normalizeHome(newHome)
    } catch (err) {
      console.error('createHome error:', err)
      return null
    }
  }

  const updateHome = async (homeId, data) => {
    try {
      const { error } = await supabase.from('homes').update(data).eq('id', homeId)
      if (error) throw error
      setHomes(prev => prev.map(h => h.id === homeId ? normalizeHome({ ...h, ...data }) : h))
    } catch (err) {
      console.error('updateHome error:', err)
    }
  }

  const removeHome = async (homeId) => {
    try {
      const { error } = await supabase.from('homes').delete().eq('id', homeId)
      if (error) throw error
      setHomes(prev => prev.filter(h => h.id !== homeId))
    } catch (err) {
      console.error('removeHome error:', err)
    }
  }

  const updateProfile = async (data) => {
    try {
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id)
      if (error) throw error
      setUser(prev => ({ ...prev, ...data }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ── Wishes ────────────────────────────────────────────────────────────────
  const addWish = async (data) => {
    try {
      const { data: newWish, error } = await supabase.from('travel_wishes').insert({
        user_id:         user.id,
        to_city:         data.toCity,
        start_date:      data.startDate,
        end_date:        data.endDate,
        needed_capacity: data.guests || data.neededCapacity || 1,
      }).select().single()
      if (error) throw error
      if (newWish) setWishes(prev => [...prev, newWish])
      return newWish
    } catch (err) {
      console.error('addWish error:', err)
      return null
    }
  }

  const removeWish = async (wishId) => {
    try {
      await supabase.from('travel_wishes').delete().eq('id', wishId)
      setWishes(prev => prev.filter(w => w.id !== wishId))
    } catch (err) {
      console.error('removeWish error:', err)
    }
  }

  // ── Exchange Requests ─────────────────────────────────────────────────────
  const sendExchangeRequest = async (data) => {
    try {
      const { data: req, error } = await supabase.from('exchange_requests').insert({
        from_user_id: user.id,
        to_user_id:   data.toUserId,
        from_home_id: data.fromHomeId,
        to_home_id:   data.toHomeId,
        message:      data.message || '',
        status:       'pending',
      }).select().single()
      if (error) throw error
      if (req) setRequests(prev => [...prev, req])
      return req
    } catch (err) {
      console.error('sendExchangeRequest error:', err)
      return null
    }
  }

  const updateRequest = async (reqId, status) => {
    try {
      await supabase.from('exchange_requests').update({ status }).eq('id', reqId)
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r))
    } catch (err) {
      console.error('updateRequest error:', err)
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getUserById    = id => users.find(u => u.id === id)
  const getHomeById    = id => homes.find(h => h.id === id)
  const getHomesByUser = uid => homes.filter(h => (h.user_id || h.userId) === uid)
  const getWishesByUser= uid => wishes.filter(w => (w.user_id || w.userId) === uid)

  return (
    <AppContext.Provider value={{
      user, currentUser: user, users, homes, wishes, requests, ready,
      login, loginWithGoogle, logout, register, completeOnboarding, completeRegister,
      createHome, updateHome, removeHome, updateProfile,
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

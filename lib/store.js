'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers, mockHomes, mockTravelWishes, mockExchangeRequests } from './mockData'

const AppContext = createContext(null)

const KEY = {
  USER: 'ruka_user',
  USERS: 'ruka_users',
  HOMES: 'ruka_homes',
  WISHES: 'ruka_wishes',
  REQUESTS: 'ruka_requests',
  VERIFY: 'ruka_pending_verify',
}

function load(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function save(key, val) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(val))
}

// ─── MATCHING ALGORITHM ───────────────────────────────────────────────────────
function datesOverlap(s1, e1, s2, e2) {
  return s1 <= e2 && e1 >= s2
}

function homeIsAvailable(home, startDate, endDate) {
  return home.availabilityPeriods?.some(p => datesOverlap(p.start, p.end, startDate, endDate))
}

export function findMatches({ toCity, startDate, endDate, neededCapacity, fromCity, userId, homes, users, wishes }) {
  // 1) Find homes in destination with enough capacity and available dates
  const candidates = homes.filter(h =>
    h.userId !== userId &&
    h.maxGuests >= neededCapacity &&
    h.city.toLowerCase().includes(toCity.toLowerCase()) &&
    homeIsAvailable(h, startDate, endDate)
  )

  // 2) For each candidate, check if owner has a travel wish to MY city
  return candidates.map(home => {
    const owner = users.find(u => u.id === home.userId)
    const ownerWishes = wishes.filter(w =>
      w.userId === home.userId &&
      w.toCity.toLowerCase().includes(fromCity.toLowerCase()) &&
      datesOverlap(w.startDate, w.endDate, startDate, endDate) &&
      w.neededCapacity <= (homes.find(h => h.userId === userId)?.maxGuests || 99)
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

  useEffect(() => {
    if (!localStorage.getItem(KEY.USERS)) save(KEY.USERS, mockUsers)
    if (!localStorage.getItem(KEY.HOMES)) save(KEY.HOMES, mockHomes)
    if (!localStorage.getItem(KEY.WISHES)) save(KEY.WISHES, mockTravelWishes)
    if (!localStorage.getItem(KEY.REQUESTS)) save(KEY.REQUESTS, mockExchangeRequests)

    setUsers(load(KEY.USERS, mockUsers))
    setHomes(load(KEY.HOMES, mockHomes))
    setWishes(load(KEY.WISHES, mockTravelWishes))
    setRequests(load(KEY.REQUESTS, mockExchangeRequests))

    const storedUser = load(KEY.USER, null)
    if (storedUser) setUser(storedUser)
    setReady(true)
  }, [])

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const all = load(KEY.USERS, mockUsers)
    const found = all.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return { success: false, error: 'Email o contraseña incorrectos' }
    if (!found.emailVerified) return { success: false, error: 'Debes verificar tu email antes de ingresar' }
    setUser(found); save(KEY.USER, found)
    return { success: true, user: found }
  }

  const logout = () => { setUser(null); localStorage.removeItem(KEY.USER) }

  const startRegister = (data) => {
    const all = load(KEY.USERS, mockUsers)
    if (all.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este email ya está registrado' }
    }
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const pending = { ...data, code, emailVerified: false }
    save(KEY.VERIFY, pending)
    return { success: true, code } // In production: send email; here we return code for demo
  }

  const verifyEmail = (email, code) => {
    const pending = load(KEY.VERIFY, null)
    if (!pending || pending.email !== email) return { success: false, error: 'No hay verificación pendiente' }
    if (pending.code !== code) return { success: false, error: 'Código incorrecto. Inténtalo de nuevo.' }
    return { success: true, pendingData: pending }
  }

  const completeRegister = (pendingData, homeData) => {
    const all = load(KEY.USERS, mockUsers)
    const newUser = {
      id: `u${Date.now()}`,
      name: pendingData.name, email: pendingData.email, password: pendingData.password,
      emailVerified: true,
      avatar: `https://i.pravatar.cc/150?u=${pendingData.email}`,
      coverPhoto: 'https://picsum.photos/seed/default/900/300',
      location: pendingData.location || '', city: pendingData.city || '', country: pendingData.country || '',
      bio: '', languages: [], verified: false,
      joinDate: new Date().toISOString().split('T')[0],
      rating: 0, reviewCount: 0, exchanges: 0,
    }
    const updatedUsers = [...all, newUser]
    save(KEY.USERS, updatedUsers)
    setUsers(updatedUsers)

    // Create home
    const allHomes = load(KEY.HOMES, mockHomes)
    const newHome = {
      id: `h${Date.now()}`,
      userId: newUser.id,
      ...homeData,
      shortDescription: homeData.description?.slice(0, 120) + '...',
      rating: 0, reviewCount: 0, reviews: [],
      featured: false,
      images: homeData.images?.length ? homeData.images : [`https://picsum.photos/seed/${Date.now()}/800/500`],
    }
    const updatedHomes = [...allHomes, newHome]
    save(KEY.HOMES, updatedHomes)
    setHomes(updatedHomes)

    setUser(newUser); save(KEY.USER, newUser)
    localStorage.removeItem(KEY.VERIFY)
    return { success: true, user: newUser, home: newHome }
  }

  // ── Homes ─────────────────────────────────────────────────────────────────
  const createHome = (data) => {
    const all = load(KEY.HOMES, mockHomes)
    const newHome = {
      id: `h${Date.now()}`, userId: user.id, ...data,
      rating: 0, reviewCount: 0, reviews: [], featured: false,
      images: data.images?.length ? data.images : [`https://picsum.photos/seed/${Date.now()}/800/500`],
    }
    const updated = [...all, newHome]
    save(KEY.HOMES, updated); setHomes(updated)
    return newHome
  }

  const updateHome = (homeId, data) => {
    const updated = homes.map(h => h.id === homeId ? { ...h, ...data } : h)
    save(KEY.HOMES, updated); setHomes(updated)
  }

  // ── Wishes ────────────────────────────────────────────────────────────────
  const createWish = (data) => {
    const all = load(KEY.WISHES, mockTravelWishes)
    const newWish = { id: `tw${Date.now()}`, userId: user.id, ...data, createdAt: new Date().toISOString().split('T')[0] }
    const updated = [...all, newWish]
    save(KEY.WISHES, updated); setWishes(updated)
    return newWish
  }

  const deleteWish = (wishId) => {
    const updated = wishes.filter(w => w.id !== wishId)
    save(KEY.WISHES, updated); setWishes(updated)
  }

  // ── Remove home ───────────────────────────────────────────────────────────
  const removeHome = (homeId) => {
    const updated = homes.filter(h => h.id !== homeId)
    save(KEY.HOMES, updated); setHomes(updated)
  }

  // ── Exchange Requests ─────────────────────────────────────────────────────
  const sendExchangeRequest = (data) => {
    const all = load(KEY.REQUESTS, mockExchangeRequests)
    const req = {
      id: `er${Date.now()}`,
      fromUserId: user.id,
      toUserId: data.toUserId,
      fromHomeId: data.fromHomeId,
      toHomeId: data.toHomeId,
      message: data.message || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...all, req]
    save(KEY.REQUESTS, updated); setRequests(updated)
    return req
  }

  const updateRequestStatus = (reqId, status) => {
    const updated = requests.map(r => r.id === reqId ? { ...r, status } : r)
    save(KEY.REQUESTS, updated); setRequests(updated)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getUserById = id => users.find(u => u.id === id)
  const getHomeById = id => homes.find(h => h.id === id)
  const getHomesByUser = userId => homes.filter(h => h.userId === userId)
  const getWishesByUser = userId => wishes.filter(w => w.userId === userId)
  const getRequestsForUser = userId => ({
    received: requests.filter(r => r.receiverId === userId),
    sent: requests.filter(r => r.proposerId === userId),
  })
  const getMatchesForUser = (userId) => {
    const myHomes = homes.filter(h => h.userId === userId)
    const myWishes = wishes.filter(w => w.userId === userId)
    const myCity = myHomes[0]?.city || users.find(u => u.id === userId)?.city || ''
    const myMaxGuests = myHomes[0]?.maxGuests || 0

    return myWishes.flatMap(wish =>
      findMatches({
        toCity: wish.toCity, startDate: wish.startDate, endDate: wish.endDate,
        neededCapacity: wish.neededCapacity, fromCity: myCity, userId,
        homes, users, wishes,
      }).map(m => ({ ...m, wish }))
    )
  }

  return (
    <AppContext.Provider value={{
      // Core state
      user, currentUser: user, users, homes, wishes, requests, ready,
      // Auth
      login, logout, startRegister, verifyEmail, completeRegister,
      // Homes
      createHome, updateHome, removeHome,
      // Wishes — primary + aliases
      createWish, deleteWish,
      addWish: createWish,
      removeWish: deleteWish,
      // Requests — primary + aliases
      sendExchangeRequest,
      sendRequest: sendExchangeRequest,
      updateRequestStatus,
      updateRequest: updateRequestStatus,
      // Helpers
      getUserById, getHomeById, getHomesByUser, getWishesByUser,
      getRequestsForUser, getMatchesForUser, findMatches,
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

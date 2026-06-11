'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, clearAuthStorageCookies } from './supabase'
import { track } from './analytics'
import { sendMetaEvent } from './meta-events'
import { trackCompleteRegistration, trackListingPublished } from './tracking/metaEvents'
import { trackGA4Registration, trackGA4ListingPublished } from './tracking/googleEvents'

const AppContext = createContext(null)

// Fallback avatar: initials with forest green background via ui-avatars
function getAvatarFallback(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=2A5C45&color=fff&size=200`
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Normaliza texto para comparaciones insensibles a tildes, mayúsculas y puntuación
export function normalizeText(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s]/g, '')    // quita puntuación
    .trim()
}

function normalizeHome(h) {
  if (!h) return null
  return {
    ...h,
    userId:               h.user_id              || h.userId,
    maxGuests:            h.max_guests            || h.maxGuests            || 2,
    reviewCount:          h.review_count          || h.reviewCount          || 0,
    availabilityPeriods:  h.availability_periods  || h.availabilityPeriods  || [],
    nearbyAttractions:    h.nearby_attractions    || h.nearbyAttractions    || [],
  }
}

function normalizeUser(u) {
  if (!u) return null
  const result = {
    ...u,
    // Si no tiene avatar, asignar uno histórico chileno según su nombre
    avatar:      u.avatar || getAvatarFallback(u.name),
    reviewCount: u.review_count || u.reviewCount || 0,
    joinDate:    u.join_date    || u.joinDate    || '',
    homeCount:   u.home_count   || u.homeCount   || 0,
  }
  // Don't let a null profile.email overwrite session.user.email when merging
  if (!result.email) delete result.email
  return result
}

function normalizeWish(w) {
  if (!w) return null
  return {
    ...w,
    userId:          w.user_id         || w.userId,
    toCity:          w.to_city         || w.toCity         || '',
    startDate:       w.start_date      || w.startDate      || '',
    endDate:         w.end_date        || w.endDate        || '',
    neededCapacity:  w.needed_capacity || w.neededCapacity || 1,
  }
}

function normalizeRequest(r) {
  if (!r) return null
  return {
    ...r,
    fromHomeId:  r.from_home_id  || r.fromHomeId,
    toHomeId:    r.to_home_id    || r.toHomeId,
    fromUserId:  r.from_user_id  || r.fromUserId,
    toUserId:    r.to_user_id    || r.toUserId,
  }
}

function datesOverlap(s1, e1, s2, e2) {
  return new Date(s1) <= new Date(e2) && new Date(e1) >= new Date(s2)
}

export function findMatches({ toCity, startDate, endDate, neededCapacity, fromCity, userId, homes, users, wishes }) {
  const myHome = homes.find(h => h.userId === userId)

  const candidates = homes.filter(h => {
    if (!h) return false
    const periods = h.availabilityPeriods || []
    const available = periods.length === 0 || periods.some(p => datesOverlap(p.start, p.end, startDate, endDate))
    return (
      h.userId !== userId &&
      (h.maxGuests || 0) >= neededCapacity &&
      normalizeText(h.city).includes(normalizeText(toCity)) &&
      available
    )
  })

  return candidates.map(home => {
    const owner = users.find(u => u.id === home.userId)
    const ownerWishes = wishes.filter(w =>
      w.userId === home.userId &&
      normalizeText(w.toCity).includes(normalizeText(fromCity || '')) &&
      datesOverlap(w.startDate, w.endDate, startDate, endDate) &&
      (w.neededCapacity || 1) <= (myHome?.maxGuests || 99)
    )
    return {
      home:           normalizeHome(home),
      owner:          normalizeUser(owner),
      isPerfectMatch: ownerWishes.length > 0,
      ownerWish:      ownerWishes[0] || null,
    }
  }).sort((a, b) => {
    if (b.isPerfectMatch !== a.isPerfectMatch) return b.isPerfectMatch - a.isPerfectMatch
    // Within the same match-quality group, real homes before demo profiles
    return (a.home.is_demo ? 1 : 0) - (b.home.is_demo ? 1 : 0)
  })
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [user,      setUser]      = useState(null)
  const [users,     setUsers]     = useState([])
  const [homes,     setHomes]     = useState([])
  const [wishes,    setWishes]    = useState([])
  const [requests,  setRequests]  = useState([])
  const [dataReady, setDataReady] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const ready = dataReady && authReady

  useEffect(() => {
    if (!supabase) {
      setDataReady(true)
      setAuthReady(true)
      return
    }

    // Generation counter: invalida fetches de perfil en vuelo cuando cambia el usuario
    let authGen = 0
    // Guard para que loadPublicData no se llame dos veces
    let dataLoadStarted = false
    let dataFallback = null

    // Fetch público usando anon key directo — NO pasa por el cliente Supabase
    // ni por el Navigator Lock. Funciona aunque getSession() esté bloqueado.
    // SECURITY FIX #3/#9: columnas explícitas para evitar exponer campos sensibles al cliente
    const PUBLIC_COLUMNS = {
      profiles:      'id,name,bio,location,city,avatar,status,verification_status,review_count,join_date,country_code,email',
      travel_wishes: 'id,user_id,to_city,start_date,end_date,needed_capacity,created_at',
      homes:         '*',
    }

    // Ocultar hogares demo en la carga pública directa, igual que /api/homes
    // (route.js usa .or('is_demo.is.null,is_demo.is.false'))
    const PUBLIC_FILTERS = {
      homes: 'or=(is_demo.is.null,is_demo.is.false)',
    }

    const fetchPublic = (table, ms = 8000) => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const ctrl = new AbortController()
      const timer = setTimeout(() => {
        console.error(`[store] ${table} timed out after ${ms}ms`)
        ctrl.abort()
      }, ms)
      const cols = PUBLIC_COLUMNS[table] || '*'
      const filter = PUBLIC_FILTERS[table] ? `&${PUBLIC_FILTERS[table]}` : ''
      return fetch(`${url}/rest/v1/${table}?select=${cols}${filter}`, {
        signal: ctrl.signal,
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      })
        .then(r => {
          if (!r.ok) console.error(`[store] fetchPublic ${table} → HTTP ${r.status}`)
          return r.json()
        })
        .finally(() => clearTimeout(timer))
    }

    // ── Caché stale-while-revalidate ──────────────────────────────────────────
    // El AppProvider monta una vez y persiste entre navegaciones cliente, pero en
    // un hard-reload o pestaña nueva todo se re-descarga (homes tarda 7-9s). Esta
    // caché en sessionStorage pinta los datos al instante y revalida en background.
    // Se guardan las filas crudas (lo que devuelve el REST), se normaliza al leer —
    // así un cambio en normalize* no invalida la caché de forma incoherente.
    const CACHE_TTL = 10 * 60 * 1000 // 10 min — ventana de staleness aceptable
    const CACHE_KEY = { homes: 'rukka_cache_homes_v1', profiles: 'rukka_cache_profiles_v1', wishes: 'rukka_cache_wishes_v1' }
    const readCache = (key) => {
      if (typeof sessionStorage === 'undefined') return null
      try {
        const raw = sessionStorage.getItem(key)
        if (!raw) return null
        const { t, d } = JSON.parse(raw)
        if (!Array.isArray(d) || Date.now() - t > CACHE_TTL) return null
        return d
      } catch { return null }
    }
    const writeCache = (key, data) => {
      if (typeof sessionStorage === 'undefined' || !Array.isArray(data)) return
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })) } catch {}
    }

    const loadPublicData = async () => {
      if (dataLoadStarted) return
      dataLoadStarted = true

      // 1) Hidratación instantánea desde caché (si está fresca).
      const cachedHomes  = readCache(CACHE_KEY.homes)
      const cachedUsers  = readCache(CACHE_KEY.profiles)
      const cachedWishes = readCache(CACHE_KEY.wishes)
      if (cachedHomes)  setHomes(cachedHomes.map(normalizeHome))
      if (cachedUsers)  setUsers(cachedUsers.map(normalizeUser))
      if (cachedWishes) setWishes(cachedWishes.map(normalizeWish))
      // Con perfiles + wishes en caché, la UI ya puede renderizar — no bloquear ready.
      if (cachedUsers && cachedWishes) {
        clearTimeout(dataFallback)
        setDataReady(true)
      }

      // 2) Revalidación en background (siempre): homes es lenta — fetch aparte.
      fetchPublic('homes', 15000)
        .then(data => { if (Array.isArray(data)) { setHomes(data.map(normalizeHome)); writeCache(CACHE_KEY.homes, data) } })
        .catch(() => {})

      try {
        const [usersResult, wishesResult] = await Promise.allSettled([
          fetchPublic('profiles'),
          fetchPublic('travel_wishes'),
        ])
        if (usersResult.status === 'rejected')
          console.error('[store] profiles fetch failed:', usersResult.reason)
        if (wishesResult.status === 'rejected')
          console.error('[store] travel_wishes fetch failed:', wishesResult.reason)
        if (usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)) {
          setUsers(usersResult.value.map(normalizeUser))
          writeCache(CACHE_KEY.profiles, usersResult.value)
        }
        if (wishesResult.status === 'fulfilled' && Array.isArray(wishesResult.value)) {
          setWishes(wishesResult.value.map(normalizeWish))
          writeCache(CACHE_KEY.wishes, wishesResult.value)
        }
      } catch (err) {
        console.error('[store] loadPublicData error:', err)
      } finally {
        clearTimeout(dataFallback)
        setDataReady(true)
      }
    }

    dataFallback = setTimeout(() => {
      console.error('[store] loadPublicData timed out — forcing dataReady=true')
      setDataReady(true)
    }, 6000)

    // Datos públicos no necesitan auth — se cargan en paralelo con initAuth.
    // Si getSession() se cuelga, los datos ya están listos igual.
    loadPublicData()

    // ── Auth init ─────────────────────────────────────────────────────────────
    const initAuth = async () => {
      // Fast path: leer sesión del cookie directamente — sin Navigator Lock, sin red.
      // Usuarios que regresan ven su sesión en <1ms mientras getSession() refresca en background.
      let hadFastSession = false
      if (typeof document !== 'undefined') {
        try {
          const jar = {}
          document.cookie.split('; ').forEach(c => {
            const eq = c.indexOf('=')
            if (eq > 0) jar[c.slice(0, eq)] = decodeURIComponent(c.slice(eq + 1))
          })
          const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          const projectRef = sbUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
          const key = projectRef ? `sb-${projectRef}-auth-token` : null
          let encoded = key ? (jar[key] || '') : ''
          if (!encoded && key) {
            for (let i = 0; i < 10; i++) {
              const chunk = jar[`${key}.${i}`]
              if (!chunk) break
              encoded += chunk
            }
          }
          if (encoded) {
            // El servidor (createServerClient) escribe JSON plano; el browser escribe base64-.
            // Maneja ambos formatos.
            let json = encoded
            if (encoded.startsWith('base64-')) {
              const b64url = encoded.slice(7)
              const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
              const padded = b64 + '='.repeat((4 - b64.length % 4) % 4)
              const bytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
              json = new TextDecoder().decode(bytes)
            }
            const { user } = JSON.parse(json)
            if (user?.id) {
              setUser({
                ...user,
                name:   user.user_metadata?.name || 'Usuario',
                avatar: user.user_metadata?.picture || user.user_metadata?.avatar_url || undefined,
                status: null,
              })
              setAuthReady(true)
              hadFastSession = true
            }
          }
        } catch {}
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const gen = ++authGen
          if (!hadFastSession) {
            setUser({
              ...session.user,
              name:   session.user.user_metadata?.name || 'Usuario',
              status: null,
            })
            setAuthReady(true)
          }

          // Fetch perfil completo (no bloquea ready — auth ya está listo)
          const { data: profile, error: profileErr } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).maybeSingle()
          if (gen === authGen) {
            if (profile) {
              setUser({ ...session.user, ...normalizeUser(profile) })
              if (profile.status === 'confirmed' &&
                  typeof window !== 'undefined' &&
                  window.location.pathname.startsWith('/onboarding')) {
                window.location.href = '/dashboard'
              }
            } else if (profileErr) {
              console.error('[store] initAuth profile fetch error:', profileErr.message)
            }
          }
        } else {
          // getSession() dice que no hay sesión válida
          if (hadFastSession) setUser(null)
          else setAuthReady(true)
        }
      } catch (err) {
        console.error('[store] initAuth error:', err?.message)
        if (!hadFastSession) setAuthReady(true)
      }
    }

    // Fallback de seguridad: si getSession() no resuelve en 10s
    // lockAcquireTimeout=500ms roba el lock en 500ms; el refresh de token
    // tarda ~2-3s desde Chile. Con 10s hay margen suficiente.
    const authFallback = setTimeout(() => {
      console.error('[store] getSession() timed out after 10s — forcing authReady')
      setAuthReady(true)
    }, 10000)

    initAuth().then(() => clearTimeout(authFallback))

    // Listener SOLO para eventos posteriores al load inicial.
    // INITIAL_SESSION se ignora — ya fue manejado por getSession() arriba.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const gen = ++authGen
        const { data: profile, error: profileErr } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        if (gen !== authGen) return
        if (profile) {
          setUser({ ...session.user, ...normalizeUser(profile) })
          if (session.user.app_metadata?.provider === 'google' &&
              session.user.email && profile.email !== session.user.email) {
            supabase.from('profiles')
              .update({ email: session.user.email })
              .eq('id', session.user.id)
              .then(({ error }) => {
                if (error) console.error('[store] Google email sync:', error.message)
              })
          }
          if (profile.status === 'confirmed' &&
              typeof window !== 'undefined' &&
              window.location.pathname.startsWith('/onboarding')) {
            window.location.href = '/dashboard'
          }
        } else if (!profileErr && event === 'SIGNED_IN') {
          // Nuevo usuario (email signup) — perfil aún no existe
          const newProfileData = {
            id:                  session.user.id,
            name:                session.user.user_metadata?.name || 'Usuario',
            email:               session.user.email || session.user.user_metadata?.email || '',
            status:              'pending',
            verification_status: 'unverified',
          }
          if (session.user.user_metadata?.phone)        newProfileData.phone = session.user.user_metadata.phone
          if (session.user.user_metadata?.country_user) newProfileData.country_user = session.user.user_metadata.country_user
          const { error: upsertError } = await supabase.from('profiles').upsert(newProfileData)
          if (!upsertError && gen === authGen) {
            setUser({ ...session.user, status: 'pending', name: session.user.user_metadata?.name || 'Usuario' })
          }
          if (session.user.app_metadata?.provider === 'google') {
            track('registro_completado', { method: 'google' })
            sendMetaEvent({ event_name: 'CompleteRegistration', email: session.user.email })
            trackCompleteRegistration({ email: session.user.email, name: session.user.user_metadata?.name })
            trackGA4Registration({ method: 'google' })
          }
        }
      } else if (event === 'SIGNED_OUT') {
        ++authGen
        setUser(null)
        setRequests([])
      }
    })

    return () => {
      clearTimeout(authFallback)
      clearTimeout(dataFallback)
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    supabase.from('exchange_requests')
      .select('*')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .then(({ data }) => { if (data) setRequests(data.map(normalizeRequest)) })
  }, [user?.id])

  // ── Auth ───────────────────────────────────────────────────────────────────
  const syncSession = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', authUser.id).single()
        if (profile) setUser({ ...authUser, ...normalizeUser(profile) })
      }
    } catch {
      // silencioso — el fallback de authReady ya se activó
    } finally {
      setAuthReady(true)
    }
  }

  const loginWithGoogle = async () => {
    if (!supabase) {
      const msg = 'Supabase client not initialized — check NEXT_PUBLIC_SUPABASE_URL / ANON_KEY'
      console.error('[store] loginWithGoogle:', msg)
      return { error: msg }
    }
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
          queryParams: {
            // Always show the account selector — prevents silent failures when
            // the Google token is stale or the user has multiple accounts
            prompt: 'select_account',
          },
        },
      })
      if (error) {
        console.error('[store] loginWithGoogle error:', error.message)
        return { error: error.message }
      }
      return { error: null }
    } catch (err) {
      console.error('[store] loginWithGoogle threw:', err?.message)
      return { error: err?.message ?? 'Unknown error' }
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data?.user) return { success: false, error: 'Email o contraseña incorrectos' }
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
    let timedOut = false
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: 'local' }),
        new Promise((_, reject) => setTimeout(() => { timedOut = true; reject(new Error('signOut timeout')) }, 4000)),
      ])
      setUser(null)
      setRequests([])
      return { error: false }
    } catch (err) {
      console.error('[store] logout signOut error:', err?.message)
      // signOut() puede quedar colgado para siempre (deadlock de _acquireLock en
      // @supabase/auth-js) — limpiamos la sesión a mano para que un reload no
      // la recupere, y dejamos que el caller fuerce un hard reload.
      clearAuthStorageCookies()
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          source: 'auth.logout',
          message: timedOut ? 'signOut timed out' : 'signOut failed',
          metadata: { error: err?.message },
        }),
      }).catch(() => {})
      setUser(null)
      setRequests([])
      return { error: true }
    }
  }

  const register = async ({ name, email, password, phone, country_user }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone: phone || null, country_user: country_user || null } }
      })
      if (authError) return { success: false, error: authError.message }
      // Supabase no devuelve error cuando el email ya está registrado: regresa un
      // user con identities vacío. Sin esto, el usuario va a /auth/confirm y espera
      // un correo que nunca llega.
      if (authData?.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0) {
        return { success: false, error: 'Este email ya está registrado. Inicia sesión.' }
      }
      track('registro_completado', { method: 'email' })
      sendMetaEvent({ event_name: 'CompleteRegistration', email })
      const userForTracking = { email, name, phone: phone || null, country_user: country_user || null }
      trackCompleteRegistration(userForTracking)
      trackGA4Registration({ method: 'email' })
      // confirmRequired=true  → Supabase tiene email confirmation habilitado
      // confirmRequired=false → sesión creada inmediatamente, no se necesita confirmar
      return { success: true, userId: authData.user?.id, confirmRequired: !authData.session }
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
        getAvatarFallback(session.user.user_metadata?.name || '')

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

      track('perfil_completado')
      track('hogar_publicado', { ciudad: newHome.city || newHome.comuna, pais: 'Chile' })

      // Fire-and-forget: email notifying the user their home is live
      if (newHome && email) {
        fetch('/api/emails/hogar-publicado', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre:       session.user.user_metadata?.name || profileData.name || 'Anfitrión',
            email,
            nombreHogar:  newHome.title,
            urlHogar:     `https://rukka.cl/homes/${newHome.id}`,
            imagenHogar:  newHome.images?.[0],
          }),
        }).then(async res => {
          if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            console.error('[email] hogar-publicado HTTP', res.status, body.error || '')
          }
        }).catch(e => console.error('[email] hogar-publicado network error:', e.message))
      }

      const [{ data: allHomes }, { data: allUsers }] = await Promise.all([
        supabase.from('homes').select('*'),
        supabase.from('profiles').select('*'),
      ])
      if (allHomes) setHomes(allHomes.map(normalizeHome))
      if (allUsers) setUsers(allUsers.map(normalizeUser))

      const { data: updatedProfile } = await supabase
        .from('profiles').select('*').eq('id', userId).single()
      if (updatedProfile) setUser(prev => ({ ...prev, ...normalizeUser(updatedProfile) }))

      // 3 Yankis de bienvenida al completar perfil (idempotente)
      fetch('/api/yankis/bonus', { method: 'POST' })
        .catch(err => console.warn('[yankis] bonus failed:', err))

      return { success: true, home: normalizeHome(newHome) }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const completeRegister = completeOnboarding

  const completeProfile = async (profileData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { success: false, error: 'No hay sesión activa' }
      const userId = session.user.id

      const email  = session.user.email || session.user.user_metadata?.email || ''
      const avatar =
        profileData.avatar ||
        session.user.user_metadata?.picture ||
        session.user.user_metadata?.avatar_url ||
        getAvatarFallback(session.user.user_metadata?.name || '')

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
        rating:       0,
        review_count: 0,
        exchanges:    0,
        status:       'confirmed',
      })
      if (profileError) return { success: false, error: profileError.message }

      const { data: updatedProfile } = await supabase
        .from('profiles').select('*').eq('id', userId).single()
      if (updatedProfile) setUser(prev => ({ ...prev, ...normalizeUser(updatedProfile) }))

      // Email de bienvenida
      const userName = session.user.user_metadata?.name || profileData.name || 'Viajero'
      fetch('/api/emails/bienvenida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: userName, email }),
      }).then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          console.error('[email] bienvenida HTTP', res.status, body.error || '')
        }
      }).catch(err => console.error('[email] bienvenida network error:', err))

      track('perfil_completado')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ── Homes ─────────────────────────────────────────────────────────────────
  const createHome = async (data) => {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 20000)
      let res
      try {
        res = await fetch('/api/homes', {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } finally {
        clearTimeout(timer)
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      const { home: newHome } = await res.json()
      if (newHome) {
        setHomes(prev => [...prev, normalizeHome(newHome)])
        track('hogar_publicado', { ciudad: newHome.city, pais: newHome.country || 'Chile' })
        trackListingPublished(user)
        trackGA4ListingPublished()
      }

      // Bonus idempotente: se activa al publicar el primer hogar
      fetch('/api/yankis/bonus', { method: 'POST' })
        .catch(err => console.warn('[yankis] bonus failed:', err))

      return normalizeHome(newHome)
    } catch (err) {
      console.error('createHome error:', err)
      return null
    }
  }

  const updateHome = async (homeId, data) => {
    const res = await fetch(`/api/homes/${homeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
    setHomes(prev => prev.map(h => h.id === homeId ? normalizeHome({ ...h, ...data, ...(json.home || {}) }) : h))
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
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error al guardar')
      setUser(prev => ({ ...prev, ...data, ...(json.profile || {}) }))
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
      if (newWish) setWishes(prev => [...prev, normalizeWish(newWish)])
      return normalizeWish(newWish)
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
        start_date:   data.startDate || null,
        end_date:     data.endDate   || null,
        guests:       data.guests    || null,
      }).select().single()
      if (error) throw error
      if (req) {
        setRequests(prev => [...prev, normalizeRequest(req)])
        track('match_iniciado')
      }

      // Emails al viajero (confirmación) y al anfitrión (nueva solicitud)
      const fmt = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
      Promise.all([
        supabase.from('profiles').select('name, email, avatar').eq('id', data.toUserId).single(),
        supabase.from('homes').select('city, images').eq('id', data.toHomeId).single(),
      ]).then(([{ data: hostProfile }, { data: destHome }]) => {
        const fechaInicio = fmt(data.startDate)
        const fechaFin    = fmt(data.endDate)
        const destino     = destHome?.city || 'tu destino'
        const imagenHogar = Array.isArray(destHome?.images) ? (destHome.images[0] || '') : ''
        if (user.email && hostProfile?.name) {
          fetch('/api/emails/solicitud-enviada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: user.name || 'Viajero', email: user.email, destino, fechaInicio, fechaFin, nombreAnfitrion: hostProfile.name, imagenHogar }),
          }).catch(e => console.warn('[email] solicitud-enviada:', e.message))
        }
        if (hostProfile?.email) {
          fetch('/api/emails/solicitud-recibida', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: hostProfile.name || 'Anfitrión', email: hostProfile.email, nombreViajero: user.name || 'Un viajero', avatarViajero: user.avatar || '', fechaInicio, fechaFin, personas: data.guests || 1, mensajePersonal: data.message || '' }),
          }).catch(e => console.warn('[email] solicitud-recibida:', e.message))
        }
      }).catch(e => console.warn('[email] solicitud queries:', e.message))

      return normalizeRequest(req)
    } catch (err) {
      console.error('sendExchangeRequest error:', err)
      return null
    }
  }

  const updateRequest = async (reqId, status) => {
    try {
      await supabase.from('exchange_requests').update({ status }).eq('id', reqId)
      setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r))

      if (status === 'accepted') {
        fetch('/api/yankis/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: reqId, action: 'confirm' }),
        }).catch(err => console.warn('[yankis] exchange confirm failed:', err))

        // Email al viajero: solicitud aceptada
        const accepted = requests.find(r => r.id === reqId)
        if (accepted) {
          const fmt = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
          Promise.all([
            supabase.from('profiles').select('name, email').eq('id', accepted.fromUserId).single(),
            supabase.from('homes').select('city').eq('id', accepted.toHomeId).single(),
          ]).then(([{ data: travelerProfile }, { data: destHome }]) => {
            if (travelerProfile?.email) {
              fetch('/api/emails/solicitud-aceptada', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: travelerProfile.name || 'Viajero', email: travelerProfile.email, nombreAnfitrion: user.name || 'Tu anfitrión', destino: destHome?.city || 'tu destino', fechaInicio: fmt(accepted.start_date), fechaFin: fmt(accepted.end_date), yanquisDescontados: 1 }),
              }).catch(e => console.warn('[email] solicitud-aceptada:', e.message))
            }
          }).catch(e => console.warn('[email] solicitud-aceptada queries:', e.message))
        }
      } else if (status === 'rejected') {
        fetch('/api/yankis/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: reqId, action: 'cancel' }),
        }).catch(err => console.warn('[yankis] exchange cancel failed:', err))
      }
    } catch (err) {
      console.error('updateRequest error:', err)
    }
  }

  // Sync verification_status from public profiles data when fast-session path
  // sets the user without it (getSession() blocked by navigator lock).
  useEffect(() => {
    if (!user?.id || user.verification_status) return
    const pub = users.find(u => u.id === user.id)
    if (pub?.verification_status) {
      setUser(prev =>
        prev?.id === user.id
          ? { ...prev, verification_status: pub.verification_status, status: pub.status || prev.status }
          : prev
      )
    }
  }, [users, user?.id, user?.verification_status])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getUserById    = id => users.find(u => u.id === id)
  const getHomeById    = id => homes.find(h => h.id === id)
  const getHomesByUser = uid => homes.filter(h => h.userId === uid)
  const getWishesByUser= uid => wishes.filter(w => w.userId === uid)

  return (
    <AppContext.Provider value={{
      user, currentUser: user, users, homes, wishes, requests, ready,
      login, loginWithGoogle, logout, register, syncSession, completeOnboarding, completeRegister, completeProfile,
      createHome, updateHome, removeHome, updateProfile,
      addWish, removeWish,
      sendExchangeRequest, sendRequest: sendExchangeRequest,
      updateRequest, updateRequestStatus: updateRequest,
      getUserById, getHomeById, getHomesByUser, getWishesByUser,
      findMatches,
      isVerified: () => user?.verification_status === 'verified' || user?.verification_status === 'id_verified',
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

export const GA_ID = 'G-YJ3D25HF62'

export function track(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

// Alias para compatibilidad con el helper solicitado
export const trackEvent = track

export const analytics = {
  // Hogares
  homeCardClick: (home) => track('home_card_click', {
    home_id:       home.id,
    home_title:    home.title,
    home_location: home.location,
    home_type:     home.type,
  }),
  homeDetailView: (home) => track('home_detail_view', {
    home_id:       home.id,
    home_title:    home.title,
    home_location: home.location,
    home_type:     home.type,
  }),

  // Búsqueda y filtros
  homesSearch:     (query)    => track('homes_search',  { query }),
  homesFilterType: (type)     => track('homes_filter',  { filter_type: 'type',      value: type }),
  homesFilterCity: (city)     => track('homes_filter',  { filter_type: 'city',      value: city }),
  homesFilterBeds: (minBeds)  => track('homes_filter',  { filter_type: 'bedrooms',  value: minBeds }),

  // Fresia
  fresiaWidgetOpen:    ()           => track('fresia_widget_open'),
  fresiaWidgetClose:   ()           => track('fresia_widget_close'),
  fresiaMessageSent:   (source)     => track('fresia_message_sent', { source }),
  fresiaPageView:      ()           => track('fresia_page_view'),
  fresiaQuickAction:   (label)      => track('fresia_quick_action',  { label }),

  // Navegación
  navClick: (destination) => track('nav_click', { destination }),

  // Auth
  loginAttempt:    (method) => track('login_attempt',    { method }),
  loginSuccess:    (method) => track('login',             { method }),
  registerAttempt: (method) => track('sign_up_attempt',  { method }),
  registerSuccess: (method) => track('sign_up',           { method }),

  // Onboarding / Airbnb
  onboardingStart:    () => track('onboarding_start'),
  onboardingComplete: () => track('onboarding_complete'),
  airbnbImportClick:  () => track('airbnb_import_click'),

  // Matches
  matchSearchView: () => track('match_search_view'),

  // Funnel de conversión
  registroCompletado: (method) => track('registro_completado', { method }),
  perfilCompletado:   ()       => track('perfil_completado'),
  hogarPublicado:     (ciudad, pais) => track('hogar_publicado', { ciudad, pais }),
  matchIniciado:      ()       => track('match_iniciado'),
}

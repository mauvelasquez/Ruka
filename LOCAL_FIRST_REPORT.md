# LOCAL_FIRST_REPORT — Rukka Geo-Personalization

_Implementación completada. Documenta todos los cambios, decisiones y riesgos._

---

## SECCIÓN 1 — Auditoría de estado inicial

### Archivos modificados

| Archivo | Tipo | Justificación |
|---------|------|---------------|
| `middleware.js` | Modificado | Agregar detección de país en el edge y escritura de cookie `rukka_country` |
| `app/api/geo/route.js` | Modificado | Leer cookie primero, soportar POST para cambio explícito de país |
| `hooks/useCountry.js` | Modificado | Retornar objeto `{country, setCountry, isLoading}`, leer cookie síncronamente |
| `lib/country-banners.js` | NUEVO | Banners de hero para CL, CO, AR, MX (4 imágenes por país) |
| `app/page.js` | Modificado | Featured homes local-first, hero banner dinámico por país, empty state localizado |
| `app/auth/login/page.js` | Modificado | Copy dinámico: "Chile te está esperando" → país del usuario |
| `app/homes/HomesClient.js` | Modificado | Filtro de país defaultea al país del usuario, sync effect, label contextual |
| `components/CountryPill.js` | NUEVO | Selector de país en Navbar (bandera + nombre + dropdown) |
| `components/Navbar.js` | Modificado | Integrar CountryPill en desktop y mobile |
| `components/Footer.js` | Modificado | Destructuring del hook actualizado |

### Textos hardcodeados encontrados y resueltos

| Texto | Archivo | Resolución |
|-------|---------|------------|
| `"Chile te está esperando."` | `auth/login/page.js:73` | `COUNTRY_NAMES[country] + " te está esperando."` |
| `"Intercambio de hogares en Chile"` | `auth/login/page.js:92` | `"en " + COUNTRY_NAMES[country]` |
| `"ver tus matches en Chile"` | `auth/login/page.js:107` | `"en " + COUNTRY_NAMES[country]` |
| Banner rotando solo Chile | `app/page.js` + `lib/chile-banners.js` | `getRandomCountryBanner(displayCountry)` |
| Sección "Destacados" sin referencia de país | `app/page.js:175` | `"Hogares destacados en " + geoConfig.region` |
| Texto "explorar hogares en Latinoamérica" en homes | `homes/HomesClient.js:140` | Label contextual + chip "Mostrando en [País]" |

### Filtros de país hardcodeados resueltos

| Filtro | Archivo | Resolución |
|--------|---------|------------|
| `h.country === 'Chile' \|\| h.country_code === 'CL'` | `app/page.js:93` | `h.country_code === displayCountry` con fallback LATAM |
| `curateHomesForUser(chileHomes, 'CL', ...)` | `app/page.js:95` | `curateHomesForUser(pool, displayCountry, ...)` |
| `useState('')` sin default de país | `homes/HomesClient.js:43` | `useState(searchParams.get('country') \|\| displayFrom)` |
| `const country = h.get(...) \|\| 'CL'` sin cookie | `api/geo/route.js:5` | Leer cookie → header → fallback |

---

## SECCIÓN 2 — Decisiones de arquitectura

### ¿Por qué cookie y no localStorage?
Las cookies están disponibles en SSR (middleware, server components, API routes). `localStorage` solo existe en el cliente y causa flicker garantizado en Next.js App Router porque el primer render del servidor no tiene acceso a él. Con cookie: el middleware setea el país en el edge, y el primer render del cliente ya tiene el valor correcto.

### ¿Por qué middleware y no solo client-side?
El middleware se ejecuta en el Vercel Edge antes de que cualquier renderizado ocurra. Esto permite:
1. Setear la cookie `rukka_country` en la primera visita (sin round-trip extra)
2. El `useCountry` hook puede leer `document.cookie` síncronamente como `useState` inicial
3. Resultado: cero flicker — el estado inicial ya tiene el país correcto

**Precaución implementada:** Supabase en el middleware puede resetear `response = NextResponse.next(...)` en su callback `setAll`. Se corrigió llevando la escritura de cookie al final del middleware, después de todo el procesamiento de Supabase.

### ¿Cómo se evita el flicker?
1. Middleware detecta país (Vercel header `x-vercel-ip-country`) en primera visita → setea `rukka_country` cookie
2. Visitas posteriores: cookie ya existe, middleware la respeta
3. `useCountry` hook lee `document.cookie` síncronamente como valor inicial de `useState`
4. Resultado: el primer render del cliente ya tiene el país correcto, sin esperar fetch a `/api/geo`
5. El fetch a `/api/geo` sigue corriendo en background para confirmar/actualizar si hay discrepancias

### ¿Cómo se manejan los casos sin datos en un país?
En la página home, si `featured.length === 0` para el país del usuario, se muestra:
- Emoji de casa 🏠
- "Sé el primero en publicar tu hogar en [País]"
- Descripción motivacional
- CTA → `/auth/register`

Nunca una lista vacía sin contexto.

---

## SECCIÓN 3 — Experiencia por país

### Chile 🇨🇱
- **Home**: Banners de Zapallar, Pichilemu, Puerto Varas, San Pedro, Valparaíso
- **Hero copy**: "El hogar de Chile está lleno de puertas abiertas"
- **Destacados**: Casas con `country_code = 'CL'` primero
- **Hogares actuales**: Mayoría del catálogo
- **Fallback**: Si no hay destacados, CTA de registro

### Colombia 🇨🇴
- **Home**: Banners de Cartagena, Medellín, Bogotá, Santa Marta
- **Hero copy**: "El hogar de Colombia está lleno de puertas abiertas"
- **Destacados**: Casas con `country_code = 'CO'` primero, fallback a otras si no hay suficientes
- **Hogares actuales**: Pocos o ninguno — estado de crecimiento
- **Fallback**: "Sé el primero en publicar tu hogar en Colombia" con CTA

### Argentina 🇦🇷
- **Home**: Banners de Buenos Aires, Bariloche, Mendoza, Ushuaia
- **Hero copy**: "El hogar de Argentina está lleno de puertas abiertas"
- **Destacados**: Casas con `country_code = 'AR'` primero
- **Fallback**: Empty state con CTA

### México 🇲🇽
- **Home**: Banners de CDMX, Oaxaca, Tulum, San Miguel de Allende
- **Hero copy**: "El hogar de México está lleno de puertas abiertas"
- **Destacados**: Casas con `country_code = 'MX'` primero
- **Fallback**: Empty state con CTA

---

## SECCIÓN 4 — Riesgos y mitigaciones

### ¿Qué pasa si Vercel no pasa el header de país?
- En desarrollo local: `x-vercel-ip-country` no existe
- **Mitigación 1**: Variable de entorno `NEXT_PUBLIC_DEV_COUNTRY` ya existente en `getCountryFromIP.js` para desarrollo
- **Mitigación 2**: El middleware tiene fallback a 'CL' si no hay header ni cookie
- **Mitigación 3**: La API `/api/geo` también tiene fallback triple (cookie → header → 'CL')
- **Para testear localmente**: `NEXT_PUBLIC_DEV_COUNTRY=CO npm run dev` (no afecta el middleware, pero sí el hook API)

### ¿Qué pasa si un usuario de Perú accede?
- `SUPPORTED_COUNTRIES = ['CL', 'CO', 'AR', 'MX']`
- Vercel devuelve `x-vercel-ip-country: PE`
- El middleware detecta que PE no está en SUPPORTED, hace fallback a 'CL'
- Usuario de Perú ve la experiencia de Chile (razonable por cercanía cultural)
- **Futuro**: agregar 'PE' a SUPPORTED cuando haya suficientes hogares

### ¿Qué pasa con usuarios logueados que tienen `user.country_code`?
- `displayCountry = exploringFrom ?? user?.country_code ?? userCountry ?? 'CL'`
- El `user.country_code` tiene prioridad sobre el país detectado por IP
- Si el usuario tiene cuenta en Chile pero accede desde Colombia, ve la experiencia chilena (su país registrado)
- El `CountryPill` le permite cambiarlo explícitamente → llama a `setCountry()` → actualiza cookie

### Riesgo: race condition en HomesClient
- `country` state se inicializa con `displayFrom`, que depende de `ipCountry` que viene del hook
- Con el nuevo hook, `ipCountry` se inicializa síncronamente desde cookie
- Si la cookie no existe en primera visita: `ipCountry = 'CL'` (fallback del hook), y el middleware ya habrá seteado la cookie
- El `useEffect` de sync actualiza `country` cuando `displayFrom` cambia
- **Mitigación**: el useEffect garantiza que si `displayFrom` se resuelve a un valor diferente, el filtro se actualiza

---

## SECCIÓN 5 — QA Checklist

Ejecutar en producción con usuarios/IPs de cada país:

**Detección y persistencia**
- [ ] 1. Usuario sin cookie ve hero banner del país correcto en primera visita
- [ ] 2. Cookie `rukka_country` se setea en la primera request (verificar DevTools → Application → Cookies)
- [ ] 3. Recargar página sin cambios mantiene el mismo país (cookie persiste)
- [ ] 4. `NEXT_PUBLIC_DEV_COUNTRY=CO npm run dev` muestra experiencia colombiana localmente

**Home page**
- [ ] 5. Featured homes muestran casas del país del usuario (no Chile si es otro país)
- [ ] 6. Si no hay casas en el país, se muestra el empty state con CTA
- [ ] 7. El título "Hogares destacados en X" refleja el país correcto
- [ ] 8. El hero badge (emoji + tagline) corresponde al país detectado
- [ ] 9. Las imágenes hero son del país correcto (no siempre Zapallar/Pichilemu)

**Navbar y CountryPill**
- [ ] 10. CountryPill muestra bandera + nombre del país actual en desktop
- [ ] 11. Al hacer click en CountryPill se abre dropdown con 4 países
- [ ] 12. Al seleccionar Colombia desde Chile, el hero y destacados cambian a Colombia
- [ ] 13. En mobile, CountryPill aparece en el menú hamburguesa
- [ ] 14. Tooltip dice "Estás viendo Rukka [País]" al hacer hover

**/homes page**
- [ ] 15. `/homes` sin parámetros pre-filtra al país del usuario (no muestra todo LATAM)
- [ ] 16. El label "Mostrando en 🇨🇱 Chile" es visible cuando hay filtro de país
- [ ] 17. El chip del país del usuario está activo (verde) al entrar
- [ ] 18. "Ver todos" desactiva el filtro de país y muestra toda LATAM

**Auth**
- [ ] 19. Login muestra "[País] te está esperando" con el país del usuario
- [ ] 20. El banner del login es una imagen del país del usuario (no siempre Chile)

---

## TESTING LOCAL

```bash
# Simular usuario de Colombia
NEXT_PUBLIC_DEV_COUNTRY=CO npm run dev

# Simular usuario de México  
NEXT_PUBLIC_DEV_COUNTRY=MX npm run dev

# Simular usuario de Argentina
NEXT_PUBLIC_DEV_COUNTRY=AR npm run dev

# Testear cambio de país via POST
curl -X POST http://localhost:3000/api/geo \
  -H "Content-Type: application/json" \
  -d '{"country": "CO"}'
```

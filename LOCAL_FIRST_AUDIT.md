# LOCAL_FIRST_AUDIT — Rukka Geo-Personalization

_Generado antes de tocar código. Documenta el estado actual y las decisiones de diseño._

---

## VOZ 1 — CEO / FUNDADOR

### Decisiones estratégicas

**1. ¿Mostrar casas de todos los países en el home de un usuario chileno?**
No. Crea ruido visual, dispersa la atención y hace que el producto parezca vacío en cada mercado porque se "diluye" el catálogo disponible. Un chileno que ve 5 casas en Colombia pero 0 en su ciudad abandona. Un chileno que ve 8 casas en Santiago convierte.

**2. ¿Local-first o LATAM completo?**
Local-first siempre. En etapa temprana, la densidad de catálogo en un mercado es más importante que la amplitud multi-país. Mejor ser "el sitio de intercambio de casas de Chile" que "el sitio de intercambio de casas de LATAM que tiene pocas casas en todos lados".

**3. Riesgo de "0 hogares" en países no Chile**
Si un chileno explora CO/AR/MX y ve cero casas, el producto parece muerto. Solución: mostrar estado de "Próximamente" con CTA para ser el primero en publicar, nunca una lista vacía sin contexto.

**4. Propuesta de valor diferente por país**
- CL: "Ya estamos aquí, hay casas disponibles, intercambia ahora"
- CO: "Medellín, Cartagena, Bogotá te esperan — sé uno de los primeros"
- AR: "Buenos Aires y Bariloche listos para intercambio"
- MX: "CDMX, Oaxaca, Tulum — abre Rukka México"

**5. Modelo de "ventana de exploración"**
Un `CountryPill` en la Navbar (bandera + nombre + ▾) como único punto de entrada para cambiar país. Discreto pero siempre visible. No un banner intrusivo. Al hacer click abre dropdown de 4 países. El cambio es explícito y persistente.

---

## VOZ 2 — UX / DISEÑO

### Textos hardcodeados encontrados (UI-facing)

| Archivo | Línea | Texto hardcodeado | Solución |
|---------|-------|-------------------|----------|
| `app/auth/login/page.js` | 73 | `"Chile te está esperando."` | Usar `COUNTRY_NAMES[country]` |
| `app/auth/login/page.js` | 86 | `"✓ Chile · México · Colombia · Argentina"` | Mantener (es beneficio, no copy local) |
| `app/auth/login/page.js` | 92 | `"Intercambio de hogares en Chile"` | Dinamizar con país |
| `app/auth/login/page.js` | 107 | `"ver tus matches en Chile"` | Dinamizar con país |
| `app/page.js` | 93 | `h.country === 'Chile' \|\| h.country_code === 'CL'` | Usar `displayCountry` |
| `app/page.js` | 95 | `curateHomesForUser(chileHomes, 'CL', ...)` | Usar `displayCountry` |
| `components/Footer.js` | 32 | `"desde Chile para el mundo"` | Mantener (es la historia del producto) |

### Filtros de país hardcodeados (lógica)

| Archivo | Línea | Código | Solución |
|---------|-------|--------|----------|
| `app/page.js` | 93-95 | `h.country_code === 'CL'` | Filtrar por `displayCountry` |
| `app/homes/HomesClient.js` | 43 | `useState('')` sin default de país | Default a `displayFrom` |
| `app/api/geo/route.js` | 5 | Solo lee header, sin cookie | Leer cookie primero |

### Experiencia actual para usuario colombiano
1. Ve el home con banner de Chile (Pichilemu, Zapallar, etc.)
2. Hero dice "El hogar de Colombia está lleno de puertas abiertas" (correcto, via geoConfig)
3. Sección "Destacados" muestra casas de Chile hardcodeadas
4. Sección "¿A qué país quieres ir?" correcta pero confusa (¿por qué ver otros países primero?)
5. No hay indicador en Navbar de qué país está viendo
6. `/homes` abre sin filtro de país, muestra todo LATAM desordenado

### 5 momentos de fricción para usuario no-chileno
1. Banner del hero muestra destinos chilenos (Zapallar, Pichilemu) → confunde
2. "Destacados" son casas de Chile → irrelevante para colombiano
3. Navbar no indica contexto de país → sensación de producto genérico
4. `/homes` sin filtro default → sea abrumador o vacío dependiendo del catálogo
5. Login dice "matches en Chile" → señal de que el producto es solo para chilenos

### Flujo ideal para usuario colombiano
- **Home**: Hero con imagen de Medellín/Cartagena + copy "Colombia", destacados de CO (o "Sé el primero")
- **Navbar**: `🇨🇴 Colombia ▾` visible, permite cambiar a otro país
- **/homes**: Pre-filtrado a CO, con toggle "Mostrando hogares en Colombia ↓"
- **Login/Register**: "ve tus matches en Colombia", banner con imagen colombiana

### Selector de país en UI
- **Desktop**: `CountryPill` entre logo y links de navegación. Tamaño pequeño, no dominante.
- **Mobile**: En el menú hamburguesa, segunda posición después del logo, antes de los links.
- Tooltip: "Estás viendo Rukka [País]"

---

## VOZ 3 — ENGINEERING

### Auditoría de arquitectura

**`hooks/useCountry.js`**
- Problema: No hay estado inicial — devuelve `null` hasta que llega la respuesta de `/api/geo`
- Esto causa un flash: el home renderiza con `displayCountry = 'CL'` (fallback hardcodeado en page.js), luego salta al país real
- Si hay lentitud de red, el usuario ve casas de Chile 300-500ms antes de ver las correctas
- Solución: leer `document.cookie` para obtener `rukka_country` como estado inicial síncrono

**`lib/getCountryFromIP.js`**
- Lee `x-vercel-ip-country` del header de Next.js — correcto para SSR
- Funciona bien en producción en Vercel, en dev requiere `NEXT_PUBLIC_DEV_COUNTRY`
- No persiste en cookie, por eso cada request re-detecta

**`middleware.js`**
- Solo cubre rutas de auth/dashboard (matcher limitado)
- No hace nada con país
- Oportunidad: expandir el matcher, detectar país en el edge y setear cookie antes de que llegue a la aplicación

**Estrategia de persistencia: Cookie > localStorage > Zustand**
- Cookie: disponible en SSR (middleware, server components, API routes), persiste entre sesiones, no requiere JS
- localStorage: solo cliente, no disponible en SSR, causa flicker garantizado
- Zustand: solo en memoria, se pierde al recargar
- Decisión: cookie `rukka_country` como fuente de verdad + Zustand como cache en memoria

**Sin flicker**
1. Middleware setea cookie `rukka_country` en la primera visita (antes de que la app renderice)
2. `useCountry` lee la cookie de `document.cookie` síncronamente como estado inicial
3. Resultado: el estado inicial ya tiene el país correcto, no hay flash

**Performance: filtro en cliente vs Supabase**
- Filtrar en cliente: rápido si homes ya están en store, pero el store carga TODOS los hogares
- Filtrar en Supabase (API): más eficiente, paginado, solo trae lo necesario
- Para la página `/homes`: ya usa API con filtro por `country` query param — solo hay que setear el default
- Para el home destacados: los homes ya están en el store global → filtrar en cliente está bien

**Cookie HttpOnly vs regular**
- HttpOnly: más seguro (no accesible desde JS), pero el hook del cliente no puede leerla para evitar flicker
- Regular (sin HttpOnly): accesible desde `document.cookie`, permite leerla síncronamente en cliente
- Decisión: cookie regular (no contiene datos sensibles — solo un código de país de 2 letras)

---

## DECISIONES ARQUITECTÓNICAS

### ¿Por qué cookie y no localStorage?
Las cookies están disponibles tanto en SSR (via middleware y server components) como en el cliente. localStorage solo existe en el cliente y causa flicker garantizado en Next.js App Router. Además, la cookie permite que el middleware setee el país antes de que la app renderice, eliminando el flash completamente.

### ¿Por qué middleware y no solo client-side?
El middleware se ejecuta en el edge, antes de que cualquier renderizado ocurra. Al setear la cookie ahí, garantizamos que en SSR ya existe `rukka_country` disponible, y que el primer render ya tiene el país correcto.

### ¿Cómo se evita el flicker?
1. Middleware detecta país en el edge y setea cookie (primera visita)
2. `useCountry` lee `document.cookie` síncronamente como `useState` inicial (visitas posteriores)
3. Resultado: el estado inicial del componente ya tiene el país correcto

### ¿Cómo se manejan los casos sin datos en un país?
Si `featured.length === 0` para el país del usuario, mostrar un CTA de "Sé el primero en publicar tu hogar en [País]" con botón hacia `/auth/register`. Nunca una lista vacía sin contexto.

---

## ARCHIVOS A MODIFICAR

1. `middleware.js` — agregar detección de país y cookie
2. `app/api/geo/route.js` — leer cookie, soportar POST
3. `hooks/useCountry.js` — retornar objeto, leer cookie
4. `lib/country-banners.js` — NUEVO: banners para CL, CO, AR, MX
5. `app/page.js` — featured homes local-first
6. `app/auth/login/page.js` — copy dinámico por país
7. `app/homes/HomesClient.js` — default al país del usuario
8. `components/CountryPill.js` — NUEVO: selector de país
9. `components/Navbar.js` — integrar CountryPill
